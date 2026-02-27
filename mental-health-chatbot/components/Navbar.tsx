'use client';

import { useAuth } from '@/context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { HiBell, HiBars3 } from 'react-icons/hi2';
import { motion } from 'framer-motion';

interface Props {
    onMenuToggle: () => void;
}

export default function Navbar({ onMenuToggle }: Props) {
    const { user } = useAuth();

    return (
        <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 z-30 glass border-b border-gray-200/50 dark:border-white/5"
        >
            <div className="flex items-center justify-between px-4 sm:px-6 py-3">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden p-2 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-700/30 transition-colors"
                    >
                        <HiBars3 className="w-6 h-6" />
                    </button>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back,</p>
                        <p className="font-semibold text-sm">{user?.name || 'User'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="relative p-2 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-700/30 transition-colors"
                    >
                        <HiBell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-500" />
                    </motion.button>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold text-sm ml-1">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
