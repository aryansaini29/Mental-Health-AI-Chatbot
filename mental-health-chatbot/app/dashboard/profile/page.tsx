'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import {
    HiUserCircle,
    HiPencilSquare,
    HiLockClosed,
    HiTrash,
    HiShieldCheck,
    HiXMark,
    HiEnvelope,
    HiUser,
} from 'react-icons/hi2';
import { formatDate } from '@/lib/utils';

export default function ProfilePage() {
    const { user, updateProfile } = useAuth();
    const { showToast } = useToast();
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [editName, setEditName] = useState(user?.name || '');
    const [editEmail, setEditEmail] = useState(user?.email || '');

    const handleSaveProfile = () => {
        if (!editName || !editEmail) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        updateProfile({ name: editName, email: editEmail });
        showToast('Profile updated successfully!', 'success');
        setShowEditModal(false);
    };

    const handleChangePassword = () => {
        showToast('Password updated successfully!', 'success');
        setShowPasswordModal(false);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold mb-1">Profile</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account and preferences.</p>
            </motion.div>

            {/* User Info Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-3xl p-6"
            >
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="text-center sm:text-left flex-1">
                        <h2 className="text-xl font-bold">{user?.name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Member since {user?.joinedDate ? formatDate(new Date(user.joinedDate)) : 'N/A'}
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowEditModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary-500 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <HiPencilSquare className="w-4 h-4" />
                        Edit Profile
                    </motion.button>
                </div>
            </motion.div>

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid sm:grid-cols-2 gap-4"
            >
                <button
                    onClick={() => setShowPasswordModal(true)}
                    className="glass rounded-2xl p-5 flex items-center gap-4 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors text-left group"
                >
                    <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <HiLockClosed className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Change Password</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Update your security credentials</p>
                    </div>
                </button>

                <button className="glass rounded-2xl p-5 flex items-center gap-4 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors text-left group">
                    <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <HiTrash className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <p className="font-semibold text-sm text-red-600 dark:text-red-400">Delete Account</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Permanently remove your account</p>
                    </div>
                </button>
            </motion.div>

            {/* Privacy & Data */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-3xl p-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <HiShieldCheck className="w-6 h-6 text-emerald-500" />
                    <h3 className="text-lg font-semibold">Privacy & Data Protection</h3>
                </div>
                <div className="space-y-3">
                    {[
                        'All your conversations are stored locally on your device.',
                        'No personal data is sent to external servers.',
                        'You can delete all your data at any time by clearing your browser storage.',
                        'We use encryption standards to keep your information secure.',
                    ].map((text, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-900/10">
                            <span className="text-emerald-500 mt-0.5 text-sm">✓</span>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{text}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {showEditModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass rounded-3xl p-6 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold">Edit Profile</h3>
                                <button onClick={() => setShowEditModal(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">
                                    <HiXMark className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Full Name</label>
                                    <div className="relative">
                                        <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-primary-400 transition-colors text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email</label>
                                    <div className="relative">
                                        <HiEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={editEmail}
                                            onChange={(e) => setEditEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-primary-400 transition-colors text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-white/10 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSaveProfile}
                                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-lg"
                                >
                                    Save Changes
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Change Password Modal */}
            <AnimatePresence>
                {showPasswordModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass rounded-3xl p-6 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold">Change Password</h3>
                                <button onClick={() => setShowPasswordModal(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">
                                    <HiXMark className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Current Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-primary-400 transition-colors text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">New Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-primary-400 transition-colors text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-primary-400 transition-colors text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-white/10 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleChangePassword}
                                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-lg"
                                >
                                    Update Password
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
