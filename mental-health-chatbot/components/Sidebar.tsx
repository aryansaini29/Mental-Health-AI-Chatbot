'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
    HiChatBubbleLeftRight,
    HiFaceSmile,
    HiClock,
    HiUserCircle,
    HiArrowRightOnRectangle,
    HiXMark,
    HiSparkles,
} from 'react-icons/hi2';

const NAV_ITEMS = [
    { href: '/dashboard/chat', label: 'Chat', icon: HiChatBubbleLeftRight },
    { href: '/dashboard/mood', label: 'Mood Tracker', icon: HiFaceSmile },
    { href: '/dashboard/history', label: 'Chat History', icon: HiClock },
    { href: '/dashboard/profile', label: 'Profile', icon: HiUserCircle },
];

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: Props) {
    const pathname = usePathname();
    const { logout } = useAuth();

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200/50 dark:border-white/5">
                <Link href="/dashboard/chat" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center shadow-lg">
                        <HiSparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-base">MindfulAI</h1>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500">AI Assistant</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1.5">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} onClick={onClose}>
                            <motion.div
                                whileHover={{ x: 4 }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${isActive
                                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                                        : 'hover:bg-primary-50 dark:hover:bg-primary-900/20 text-gray-600 dark:text-gray-300'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{item.label}</span>
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Security Banner */}
            <div className="px-4 pb-2">
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-700/30">
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                        🔒 Your data is encrypted and secure
                    </p>
                </div>
            </div>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200/50 dark:border-white/5">
                <button
                    onClick={async () => {
                        await logout();
                        onClose();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                >
                    <HiArrowRightOnRectangle className="w-5 h-5" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 flex-shrink-0 h-screen sticky top-0 flex-col bg-white/50 dark:bg-white/[0.02] border-r border-gray-200/50 dark:border-white/5">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed left-0 top-0 z-50 w-72 h-screen bg-white dark:bg-[#1a1625] shadow-2xl lg:hidden"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            >
                                <HiXMark className="w-5 h-5" />
                            </button>
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
