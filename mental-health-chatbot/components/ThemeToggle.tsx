'use client';

import { motion } from 'framer-motion';
import { HiSun, HiMoon } from 'react-icons/hi2';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
    const { isDark, toggle } = useTheme();

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            onClick={toggle}
            className="relative p-2 rounded-xl bg-primary-100/50 dark:bg-primary-700/30 hover:bg-primary-200/60 dark:hover:bg-primary-600/40 transition-colors"
            aria-label="Toggle theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                {isDark ? (
                    <HiMoon className="w-5 h-5 text-primary-300" />
                ) : (
                    <HiSun className="w-5 h-5 text-primary-600" />
                )}
            </motion.div>
        </motion.button>
    );
}
