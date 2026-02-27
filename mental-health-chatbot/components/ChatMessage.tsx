'use client';

import { motion } from 'framer-motion';
import { formatTime } from '@/lib/utils';
import type { ChatMessage as ChatMessageType } from '@/context/ChatContext';
import { HiSparkles } from 'react-icons/hi2';

interface Props {
    message: ChatMessageType;
}

export default function ChatMessage({ message }: Props) {
    const isAI = message.sender === 'ai';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}
        >
            <div className={`max-w-[80%] sm:max-w-[70%] ${isAI ? 'order-1' : 'order-1'}`}>
                {isAI && (
                    <div className="flex items-center gap-2 mb-1 ml-1">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                            <HiSparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">MindfulAI</span>
                    </div>
                )}
                <div
                    className={`px-4 py-3 rounded-2xl ${isAI
                            ? 'bg-white/80 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-tl-md'
                            : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-tr-md'
                        }`}
                >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
                <div className={`flex items-center gap-2 mt-1 ${isAI ? 'ml-1' : 'mr-1 justify-end'}`}>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">
                        {formatTime(new Date(message.timestamp))}
                    </span>
                    {message.emotion && isAI === false && (
                        <span className="text-[11px] text-gray-400 dark:text-gray-500">{message.emotion}</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
