'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@/context/ChatContext';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import PrivacyModal from '@/components/PrivacyModal';
import { HiSparkles, HiArrowPath } from 'react-icons/hi2';

export default function ChatPage() {
    const { messages, isTyping, privacyAccepted, sendMessage, startNewConversation } = useChat();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    return (
        <>
            {!privacyAccepted && <PrivacyModal />}

            <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center shadow-lg pulse-glow">
                            <HiSparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">AI Assistant</h1>
                            <p className="text-xs text-emerald-500 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                                Online • Ready to help
                            </p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startNewConversation}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    >
                        <HiArrowPath className="w-4 h-4" />
                        New Chat
                    </motion.button>
                </div>

                {/* Messages */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto px-2 py-4 space-y-1"
                >
                    {messages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-full text-center"
                        >
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex items-center justify-center mb-6">
                                <HiSparkles className="w-10 h-10 text-primary-400" />
                            </div>
                            <h2 className="text-xl font-bold mb-2">What can I help you with?</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                                Ask me anything: explain a topic, write code, draft an email, summarize text, or brainstorm ideas.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-6 justify-center">
                                {['Explain React hooks', 'Write a professional email', 'Summarize this article', 'Give me study tips'].map((s) => (
                                    <motion.button
                                        key={s}
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => sendMessage(s)}
                                        className="px-4 py-2 rounded-2xl text-sm border border-primary-200 dark:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                                    >
                                        {s}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    <AnimatePresence>
                        {messages.map((msg) => (
                            <ChatMessage key={msg.id} message={msg} />
                        ))}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                                <HiSparkles className="w-4 h-4 text-white" />
                            </div>
                            <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white/80 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                                <div className="flex gap-1.5">
                                    <span className="typing-dot w-2 h-2 rounded-full bg-primary-400" />
                                    <span className="typing-dot w-2 h-2 rounded-full bg-primary-400" />
                                    <span className="typing-dot w-2 h-2 rounded-full bg-primary-400" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Input */}
                <div className="mt-2">
                    <ChatInput onSend={sendMessage} disabled={isTyping || !privacyAccepted} />
                </div>
            </div>
        </>
    );
}
