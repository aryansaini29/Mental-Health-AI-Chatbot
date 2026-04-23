'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiEnvelope, HiLockClosed, HiEye, HiEyeSlash, HiSparkles } from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        setLoading(true);
        const result = await login(email, password);
        if (result.success) {
            showToast('Welcome back!', 'success');
            router.push('/dashboard/chat');
        } else {
            showToast(result.error || 'Invalid email or password', 'error');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 gradient-bg opacity-30" />
            <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-primary-300/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary-300/20 rounded-full blur-3xl" />

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
                        <h2 className="text-2xl font-bold mb-1">Welcome Back</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to continue your journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
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
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-primary-400 transition-colors text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                >
                                    {showPassword ? (
                                        <HiEyeSlash className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <HiEye className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                                />
                                <span className="text-sm text-gray-500">Remember me</span>
                            </label>
                            <button type="button" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
                                Forgot Password?
                            </button>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow disabled:opacity-60"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </motion.button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/register" className="text-primary-500 font-semibold hover:text-primary-600">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
