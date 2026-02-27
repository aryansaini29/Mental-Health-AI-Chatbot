'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const MOODS = [
    { emoji: '😄', label: 'Happy', color: 'from-yellow-200 to-amber-300 dark:from-yellow-600 dark:to-amber-700' },
    { emoji: '😌', label: 'Calm', color: 'from-green-200 to-emerald-300 dark:from-green-600 dark:to-emerald-700' },
    { emoji: '😐', label: 'Neutral', color: 'from-gray-200 to-slate-300 dark:from-gray-600 dark:to-slate-700' },
    { emoji: '😢', label: 'Sad', color: 'from-blue-200 to-indigo-300 dark:from-blue-600 dark:to-indigo-700' },
    { emoji: '😰', label: 'Anxious', color: 'from-orange-200 to-amber-300 dark:from-orange-600 dark:to-amber-700' },
    { emoji: '😡', label: 'Angry', color: 'from-red-200 to-rose-300 dark:from-red-600 dark:to-rose-700' },
];

interface Props {
    onSave: (mood: string, emoji: string, note?: string) => void;
}

export default function MoodSelector({ onSave }: Props) {
    const [selected, setSelected] = useState<number | null>(null);
    const [note, setNote] = useState('');

    const handleSave = () => {
        if (selected === null) return;
        const mood = MOODS[selected];
        onSave(mood.label, mood.emoji, note || undefined);
        setSelected(null);
        setNote('');
    };

    return (
        <div className="glass rounded-3xl p-6">
            <h3 className="text-lg font-semibold mb-4">How are you feeling right now?</h3>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
                {MOODS.map((mood, i) => (
                    <motion.button
                        key={mood.label}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelected(i)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${selected === i
                                ? `border-primary-400 bg-gradient-to-br ${mood.color} shadow-lg`
                                : 'border-transparent hover:border-primary-200 dark:hover:border-primary-700 bg-white/40 dark:bg-white/5'
                            }`}
                    >
                        <span className="text-3xl">{mood.emoji}</span>
                        <span className="text-xs font-medium">{mood.label}</span>
                    </motion.button>
                ))}
            </div>

            {selected !== null && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                >
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add a note about how you're feeling (optional)..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none resize-none text-sm focus:border-primary-400 transition-colors"
                    />

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
                    >
                        Save Mood Entry
                    </motion.button>
                </motion.div>
            )}
        </div>
    );
}
