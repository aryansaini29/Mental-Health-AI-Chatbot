'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { HiShieldCheck, HiLockClosed } from 'react-icons/hi2';
import { useChat } from '@/context/ChatContext';

export default function PrivacyModal() {
    const { privacyAccepted, acceptPrivacy } = useChat();

    if (privacyAccepted) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="glass rounded-3xl p-8 max-w-md w-full shadow-2xl"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-2xl bg-primary-100 dark:bg-primary-700/30">
                            <HiShieldCheck className="w-8 h-8 text-primary-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Privacy & Consent</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Your safety matters to us</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                            <HiLockClosed className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm">
                                All conversations are stored locally on your device and are never sent to external servers.
                            </p>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            This AI chatbot provides emotional support and is <strong>not a substitute</strong> for
                            professional mental health care. If you&apos;re in crisis, please contact a mental health
                            professional or emergency services immediately.
                        </p>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            By continuing, you acknowledge that your data is encrypted and secure, and you consent
                            to using this tool for supportive conversations.
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={acceptPrivacy}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
                    >
                        I Understand & Agree
                    </motion.button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
