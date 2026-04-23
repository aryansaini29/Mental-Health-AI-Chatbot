'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiUser, HiEnvelope, HiLockClosed, HiEye, HiEyeSlash, HiSparkles } from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import { getPasswordStrength } from '@/lib/utils';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { register } = useAuth();
    const { showToast } = useToast();

    const strength = getPasswordStrength(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password || !confirmPassword) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        if (password.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }
        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        setLoading(true);
        const result = await register(name, email, password);

        if (result.success && result.requiresEmailVerification) {
            showToast('Check your email to confirm your account, then sign in.', 'success');
            router.push('/auth/login');
            setLoading(false);
            return;
        }

        if (result.success) {
            showToast('Account created successfully!', 'success');
            router.push('/dashboard/chat');
        } else {
            showToast(result.error || 'Unable to create account', 'error');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 gradient-bg opacity-30" />
            <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-accent-200/30 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary-300/20 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="glass rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center shadow-lg">
                                <HiSparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl">MindfulAI</span>
                        </Link>
                        <h2 className="text-2xl font-bold mb-1">Create Account</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Start your wellness journey today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Full Name</label>
                            <div className="relative">
                                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-primary-400 transition-colors text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min 6 characters"
                                    className="w-full pl-12 pr-12 py-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-primary-400 transition-colors text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                >
                                    {showPassword ? <HiEyeSlash className="w-5 h-5 text-gray-400" /> : <HiEye className="w-5 h-5 text-gray-400" />}
                                </button>
                            </div>
                            {password && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength.score ? strength.color : 'bg-gray-200 dark:bg-gray-700'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500">{strength.label}</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Confirm Password</label>
                            <div className="relative">
                                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter password"
                                    className="w-full pl-12 pr-12 py-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-primary-400 transition-colors text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                >
                                    {showConfirm ? <HiEyeSlash className="w-5 h-5 text-gray-400" /> : <HiEye className="w-5 h-5 text-gray-400" />}
                                </button>
                            </div>
                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                            )}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow disabled:opacity-60 mt-2"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </motion.button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-primary-500 font-semibold hover:text-primary-600">
                            Sign In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
