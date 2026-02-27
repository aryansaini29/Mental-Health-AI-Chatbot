'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { generateId, getAIResponse, detectEmotion } from '@/lib/utils';

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
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);

    useEffect(() => {
        try {
            const storedConversations = localStorage.getItem('mhc_conversations');
            if (storedConversations) setConversations(JSON.parse(storedConversations));

            const storedMoods = localStorage.getItem('mhc_moods');
            if (storedMoods) setMoodHistory(JSON.parse(storedMoods));

            const storedPrivacy = localStorage.getItem('mhc_privacy');
            if (storedPrivacy === 'true') setPrivacyAccepted(true);
        } catch {
            // ignore parse errors
        }
    }, []);

    const acceptPrivacy = () => {
        setPrivacyAccepted(true);
        localStorage.setItem('mhc_privacy', 'true');
    };

    const sendMessage = useCallback((content: string) => {
        const userMessage: ChatMessage = {
            id: generateId(),
            content,
            sender: 'user',
            timestamp: new Date().toISOString(),
            emotion: detectEmotion(content),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);

        setTimeout(() => {
            const aiResponse: ChatMessage = {
                id: generateId(),
                content: getAIResponse(content),
                sender: 'ai',
                timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1200 + Math.random() * 1500);
    }, []);

    const startNewConversation = useCallback(() => {
        if (messages.length > 0) {
            const lastUserMsg = messages.filter((m) => m.sender === 'user').pop();
            const conv: Conversation = {
                id: generateId(),
                date: new Date().toISOString(),
                messages: [...messages],
                emotion: lastUserMsg?.emotion || '😐 Neutral',
                preview: messages[0]?.content.substring(0, 80) + '...',
            };

            const updated = [conv, ...conversations];
            setConversations(updated);
            localStorage.setItem('mhc_conversations', JSON.stringify(updated));
            setMessages([]);
        }
    }, [messages, conversations]);

    const clearChat = useCallback(() => {
        startNewConversation();
    }, [startNewConversation]);

    const saveMood = useCallback((mood: string, emoji: string, note?: string) => {
        const entry: MoodEntry = {
            id: generateId(),
            mood,
            emoji,
            date: new Date().toISOString(),
            note,
        };

        setMoodHistory((prev) => {
            const updated = [entry, ...prev];
            localStorage.setItem('mhc_moods', JSON.stringify(updated));
            return updated;
        });
    }, []);

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
