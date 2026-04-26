'use client';

import { useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { HiPaperAirplane, HiFaceSmile, HiMicrophone } from 'react-icons/hi2';

interface Props {
    onSend: (message: string) => void;
    disabled?: boolean;
}

const QUICK_EMOJIS = ['😊', '😢', '😰', '😡', '😌', '❤️', '🙏', '💪'];

export default function ChatInput({ onSend, disabled }: Props) {
    const [text, setText] = useState('');
    const [showEmojis, setShowEmojis] = useState(false);

    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed);
        setText('');
        setShowEmojis(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const addEmoji = (emoji: string) => {
        setText((prev) => prev + emoji);
        setShowEmojis(false);
    };

    return (
        <div className="relative">
            {showEmojis && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full mb-2 left-0 glass rounded-2xl p-3 flex gap-2 flex-wrap shadow-lg"
                >
                    {QUICK_EMOJIS.map((emoji) => (
                        <button
                            key={emoji}
                            onClick={() => addEmoji(emoji)}
                            className="text-xl hover:scale-125 transition-transform p-1"
                        >
                            {emoji}
                        </button>
                    ))}
                </motion.div>
            )}

            <div className="flex items-end gap-2 p-3 glass rounded-2xl">
                <button
                    onClick={() => setShowEmojis(!showEmojis)}
                    className="p-2 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-700/30 transition-colors flex-shrink-0"
                >
                    <HiFaceSmile className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                    rows={1}
                    className="flex-1 resize-none bg-transparent outline-none text-sm placeholder-gray-400 dark:placeholder-gray-500 max-h-24 py-2"
                    style={{ minHeight: '36px' }}
                />

                <button className="p-2 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-700/30 transition-colors flex-shrink-0">
                    <HiMicrophone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    disabled={!text.trim() || disabled}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                    <HiPaperAirplane className="w-5 h-5" />
                </motion.button>
            </div>
        </div>
    );
}
