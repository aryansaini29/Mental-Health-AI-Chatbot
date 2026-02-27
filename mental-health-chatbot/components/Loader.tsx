'use client';

import { motion } from 'framer-motion';

export default function Loader() {
    return (
        <div className="flex items-center justify-center py-12">
            <motion.div
                className="flex gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-3 h-3 rounded-full bg-primary-400"
                        animate={{
                            y: [0, -12, 0],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </motion.div>
        </div>
    );
}
