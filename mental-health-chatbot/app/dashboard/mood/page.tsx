'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { useChat } from '@/context/ChatContext';
import MoodSelector from '@/components/MoodSelector';
import { formatDate } from '@/lib/utils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const MOOD_VALUES: Record<string, number> = {
    Happy: 5,
    Calm: 4,
    Neutral: 3,
    Anxious: 2,
    Sad: 1,
    Angry: 0,
};

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.4 },
    }),
};

export default function MoodPage() {
    const { moodHistory, saveMood } = useChat();

    const chartData = useMemo(() => {
        const last7 = [...moodHistory].reverse().slice(-7);
        return {
            labels: last7.map((e) => formatDate(new Date(e.date))),
            datasets: [
                {
                    label: 'Mood Level',
                    data: last7.map((e) => MOOD_VALUES[e.mood] ?? 3),
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#8b5cf6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                },
            ],
        };
    }, [moodHistory]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                min: 0,
                max: 5,
                ticks: {
                    stepSize: 1,
                    callback: function (value: string | number) {
                        const labels = ['😡', '😢', '😰', '😐', '😌', '😄'];
                        return labels[Number(value)] || '';
                    },
                    font: { size: 16 },
                },
                grid: {
                    color: 'rgba(139, 92, 246, 0.08)',
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: { size: 11 },
                },
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e1b4b',
                titleFont: { size: 12 },
                bodyFont: { size: 12 },
                padding: 12,
                cornerRadius: 12,
            },
        },
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold mb-1">Mood Tracker</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Track your emotional patterns and build self-awareness.
                </p>
            </motion.div>

            {/* Mood Selector */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <MoodSelector onSave={saveMood} />
            </motion.div>

            {/* Chart */}
            {moodHistory.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-3xl p-6"
                >
                    <h3 className="text-lg font-semibold mb-4">Weekly Mood Trends</h3>
                    <div className="h-64">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </motion.div>
            )}

            {/* History */}
            {moodHistory.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-4">Mood History</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {moodHistory.slice(0, 10).map((entry, i) => (
                            <motion.div
                                key={entry.id}
                                custom={i}
                                initial="hidden"
                                animate="visible"
                                variants={fadeUp}
                                whileHover={{ y: -3, scale: 1.01 }}
                                className="glass rounded-2xl p-4 flex items-center gap-4"
                            >
                                <span className="text-3xl">{entry.emoji}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm">{entry.mood}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatDate(new Date(entry.date))}
                                    </p>
                                    {entry.note && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-1">{entry.note}</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {moodHistory.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <p className="text-4xl mb-4">📊</p>
                    <p className="text-gray-500 dark:text-gray-400">
                        No mood entries yet. Select your mood above to get started!
                    </p>
                </motion.div>
            )}
        </div>
    );
}
