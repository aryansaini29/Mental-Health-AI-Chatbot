'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat, Conversation } from '@/context/ChatContext';
import { formatDate, formatTime } from '@/lib/utils';
import { HiMagnifyingGlass, HiChevronDown, HiChevronUp, HiFunnel } from 'react-icons/hi2';

const MOOD_FILTERS = ['All', '😄 Happy', '😐 Neutral', '😢 Sad', '😡 Angry', '😰 Anxious'];

export default function HistoryPage() {
    const { conversations } = useChat();
    const [search, setSearch] = useState('');
    const [moodFilter, setMoodFilter] = useState('All');
    const [expanded, setExpanded] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    const filtered = useMemo(() => {
        return conversations.filter((conv) => {
            const matchesSearch =
                !search ||
                conv.messages.some((m) => m.content.toLowerCase().includes(search.toLowerCase()));
            const matchesMood = moodFilter === 'All' || conv.emotion === moodFilter;
            return matchesSearch && matchesMood;
        });
    }, [conversations, search, moodFilter]);

    const toggleExpand = (id: string) => {
        setExpanded((prev) => (prev === id ? null : id));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold mb-1">Chat History</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Review your past conversations and emotional patterns.
                </p>
            </motion.div>

            {/* Search & Filter */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col sm:flex-row gap-3"
            >
                <div className="flex-1 relative">
                    <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search conversations..."
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-primary-400 transition-colors text-sm"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl glass hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-sm font-medium"
                >
                    <HiFunnel className="w-4 h-4" />
                    Filter
                </button>
            </motion.div>

            {/* Mood Filters */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-2"
                    >
                        {MOOD_FILTERS.map((mood) => (
                            <button
                                key={mood}
                                onClick={() => setMoodFilter(mood)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${moodFilter === mood
                                        ? 'bg-primary-500 text-white shadow-lg'
                                        : 'glass hover:bg-primary-50 dark:hover:bg-primary-900/20'
                                    }`}
                            >
                                {mood}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Conversations List */}
            <div className="space-y-3">
                {filtered.map((conv: Conversation, i: number) => (
                    <motion.div
                        key={conv.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass rounded-2xl overflow-hidden"
                    >
                        <button
                            onClick={() => toggleExpand(conv.id)}
                            className="w-full flex items-center gap-4 p-4 text-left hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium text-gray-400">
                                        {formatDate(new Date(conv.date))}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-100 dark:bg-primary-800/30 text-primary-600 dark:text-primary-300">
                                        {conv.emotion}
                                    </span>
                                </div>
                                <p className="text-sm truncate">{conv.preview}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-xs text-gray-400">{conv.messages.length} messages</span>
                                {expanded === conv.id ? (
                                    <HiChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <HiChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                        </button>

                        <AnimatePresence>
                            {expanded === conv.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-gray-200/50 dark:border-white/5"
                                >
                                    <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                                        {conv.messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${msg.sender === 'user'
                                                            ? 'bg-primary-500 text-white rounded-tr-md'
                                                            : 'bg-gray-100 dark:bg-white/5 rounded-tl-md'
                                                        }`}
                                                >
                                                    <p>{msg.content}</p>
                                                    <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-white/60' : 'text-gray-400'}`}>
                                                        {formatTime(new Date(msg.timestamp))}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                >
                    <p className="text-4xl mb-4">💬</p>
                    <p className="text-gray-500 dark:text-gray-400">
                        {conversations.length === 0
                            ? 'No conversations yet. Start chatting to see your history here!'
                            : 'No conversations match your search.'}
                    </p>
                </motion.div>
            )}
        </div>
    );
}
