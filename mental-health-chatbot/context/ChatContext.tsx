'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { generateId, getAIResponse, detectEmotion } from '@/lib/utils';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface ChatMessage {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: string;
    emotion?: string;
}

export interface Conversation {
    id: string;
    date: string;
    messages: ChatMessage[];
    emotion: string;
    preview: string;
}

export interface MoodEntry {
    id: string;
    mood: string;
    emoji: string;
    date: string;
    note?: string;
}

interface ChatContextType {
    messages: ChatMessage[];
    conversations: Conversation[];
    moodHistory: MoodEntry[];
    isTyping: boolean;
    privacyAccepted: boolean;
    sendMessage: (content: string) => void;
    saveMood: (mood: string, emoji: string, note?: string) => void;
    acceptPrivacy: () => void;
    clearChat: () => void;
    startNewConversation: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);

    useEffect(() => {
        try {
            const storedPrivacy = localStorage.getItem('mhc_privacy');
            if (storedPrivacy === 'true') setPrivacyAccepted(true);
        } catch {
            // ignore parse errors
        }
    }, []);

    useEffect(() => {
        const supabase = getSupabaseBrowserClient();

        if (!user?.id || !supabase) {
            setConversations([]);
            setMoodHistory([]);
            setMessages([]);
            return;
        }

        let cancelled = false;

        const loadUserData = async () => {
            const { data: convRows, error: convError } = await supabase
                .from('conversations')
                .select('id, created_at, emotion, preview')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (convError) {
                console.warn('Unable to load conversations from Supabase:', convError.message);
            }

            let hydratedConversations: Conversation[] = [];

            if (convRows && convRows.length > 0) {
                const conversationIds = convRows.map((c) => c.id);
                const { data: messageRows, error: messageError } = await supabase
                    .from('messages')
                    .select('id, conversation_id, sender, content, emotion, created_at')
                    .in('conversation_id', conversationIds)
                    .order('created_at', { ascending: true });

                if (messageError) {
                    console.warn('Unable to load messages from Supabase:', messageError.message);
                }

                hydratedConversations = convRows.map((conv) => ({
                    id: conv.id,
                    date: conv.created_at,
                    emotion: conv.emotion || '😐 Neutral',
                    preview: conv.preview || '',
                    messages:
                        messageRows
                            ?.filter((m) => m.conversation_id === conv.id)
                            .map((m) => ({
                                id: m.id,
                                content: m.content,
                                sender: m.sender,
                                timestamp: m.created_at,
                                emotion: m.emotion || undefined,
                            })) || [],
                }));
            }

            const { data: moodRows, error: moodError } = await supabase
                .from('mood_entries')
                .select('id, mood, emoji, note, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (moodError) {
                console.warn('Unable to load mood history from Supabase:', moodError.message);
            }

            if (!cancelled) {
                setConversations(hydratedConversations);
                setMoodHistory(
                    (moodRows || []).map((entry) => ({
                        id: entry.id,
                        mood: entry.mood,
                        emoji: entry.emoji,
                        note: entry.note || undefined,
                        date: entry.created_at,
                    }))
                );
            }
        };

        void loadUserData();

        return () => {
            cancelled = true;
        };
    }, [user?.id]);

    const acceptPrivacy = () => {
        setPrivacyAccepted(true);
        localStorage.setItem('mhc_privacy', 'true');
    };

    const sendMessage = useCallback(async (content: string) => {
        const userMessage: ChatMessage = {
            id: generateId(),
            content,
            sender: 'user',
            timestamp: new Date().toISOString(),
            emotion: detectEmotion(content),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: content,
                    history: [...messages, userMessage].slice(-12),
                }),
            });

            if (!response.ok) {
                throw new Error('Gemini request failed');
            }

            const data = (await response.json()) as { reply?: string };
            const aiResponse: ChatMessage = {
                id: generateId(),
                content: data.reply || getAIResponse(content),
                sender: 'ai',
                timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, aiResponse]);
        } catch {
            const aiResponse: ChatMessage = {
                id: generateId(),
                content: getAIResponse(content),
                sender: 'ai',
                timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, aiResponse]);
        } finally {
            setIsTyping(false);
        }
    }, [messages]);

    const startNewConversation = useCallback(() => {
        if (!user?.id || messages.length === 0) return;

        const lastUserMsg = messages.filter((m) => m.sender === 'user').pop();
        const conversationId = crypto.randomUUID();
        const conversationDate = new Date().toISOString();
        const conversationPreview = messages[0]?.content.substring(0, 80) + '...';

        const conv: Conversation = {
            id: conversationId,
            date: conversationDate,
            messages: [...messages],
            emotion: lastUserMsg?.emotion || '😐 Neutral',
            preview: conversationPreview,
        };

        setConversations((prev) => [conv, ...prev]);
        setMessages([]);

        void (async () => {
            const supabase = getSupabaseBrowserClient();
            if (!supabase) return;

            const { error: conversationError } = await supabase.from('conversations').insert({
                id: conversationId,
                user_id: user.id,
                created_at: conversationDate,
                emotion: conv.emotion,
                preview: conversationPreview,
            });

            if (conversationError) {
                console.warn('Unable to save conversation:', conversationError.message);
                return;
            }

            const messageRows = messages.map((msg) => ({
                conversation_id: conversationId,
                sender: msg.sender,
                content: msg.content,
                emotion: msg.emotion || null,
                created_at: msg.timestamp,
            }));

            const { error: messagesError } = await supabase.from('messages').insert(messageRows);
            if (messagesError) {
                console.warn('Unable to save messages:', messagesError.message);
            }
        })();
    }, [messages, user?.id]);

    const clearChat = useCallback(() => {
        startNewConversation();
    }, [startNewConversation]);

    const saveMood = useCallback((mood: string, emoji: string, note?: string) => {
        if (!user?.id) return;

        const entry: MoodEntry = {
            id: generateId(),
            mood,
            emoji,
            date: new Date().toISOString(),
            note,
        };

        setMoodHistory((prev) => {
            const updated = [entry, ...prev];
            return updated;
        });

        void (async () => {
            const supabase = getSupabaseBrowserClient();
            if (!supabase) return;

            const { error } = await supabase.from('mood_entries').insert({
                user_id: user.id,
                mood,
                emoji,
                note: note || null,
                created_at: entry.date,
            });

            if (error) {
                console.warn('Unable to save mood entry:', error.message);
            }
        })();
    }, [user?.id]);

    return (
        <ChatContext.Provider
            value={{
                messages,
                conversations,
                moodHistory,
                isTyping,
                privacyAccepted,
                sendMessage,
                saveMood,
                acceptPrivacy,
                clearChat,
                startNewConversation,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChat must be used within a ChatProvider');
    return context;
}
