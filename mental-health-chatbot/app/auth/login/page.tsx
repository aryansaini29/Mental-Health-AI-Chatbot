'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiEnvelope, HiShieldCheck, HiSparkles } from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { requestLoginOtp, verifyLoginOtp } = useAuth();
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            showToast('Please enter your email', 'error');
            return;
        }

        setLoading(true);

        if (!otpSent) {
            const result = await requestLoginOtp(email);
            if (result.success) {
                setOtpSent(true);
                showToast('OTP sent to your email', 'success');
            } else {
                showToast(result.error || 'Unable to send OTP', 'error');
            }
        } else {
            const normalizedOtp = otp.replace(/\D/g, '');
            if (!/^\d{8}$/.test(normalizedOtp)) {
                showToast('OTP must be exactly 8 digits', 'error');
                setLoading(false);
                return;
            }

            const result = await verifyLoginOtp(email, normalizedOtp);
            if (result.success) {
                showToast('Welcome back!', 'success');
                router.push('/dashboard/chat');
            } else {
                showToast(result.error || 'Invalid OTP code', 'error');
            }
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">Sign in with a one-time code</p>
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

                        {otpSent && (
                            <div>
                                <label className="block text-sm font-medium mb-2">OTP Code</label>
                                <div className="relative">
                                    <HiShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={8}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                                        placeholder="Enter 8-digit code"
                                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-primary-400 transition-colors text-sm tracking-[0.2em]"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        setLoading(true);
                                        const result = await requestLoginOtp(email);
                                        if (result.success) {
                                            showToast('OTP resent to your email', 'success');
                                        } else {
                                            showToast(result.error || 'Unable to resend OTP', 'error');
                                        }
                                        setLoading(false);
                                    }}
                                    className="mt-2 text-sm text-primary-500 hover:text-primary-600 font-medium"
                                >
                                    Resend OTP
                                </button>
                            </div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow disabled:opacity-60"
                        >
                            {loading ? 'Please wait...' : otpSent ? 'Verify OTP' : 'Send OTP'}
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
