'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    joinedDate: string;
}

interface AuthActionResult {
    success: boolean;
    error?: string;
    requiresEmailVerification?: boolean;
}

interface AuthContextType {
    user: User | null;
    isAuthLoading: boolean;
    isAuthenticated: boolean;
    requestLoginOtp: (email: string) => Promise<AuthActionResult>;
    verifyLoginOtp: (email: string, otp: string) => Promise<AuthActionResult>;
    register: (name: string, email: string, password: string) => Promise<AuthActionResult>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<AuthActionResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toAppUser(supabaseUser: SupabaseUser): User {
    const metadata = supabaseUser.user_metadata || {};
    const fallbackName = supabaseUser.email?.split('@')[0] || 'User';

    return {
        id: supabaseUser.id,
        name: metadata.full_name || fallbackName,
        email: supabaseUser.email || '',
        avatar: metadata.avatar_url,
        joinedDate: supabaseUser.created_at || new Date().toISOString(),
    };
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    useEffect(() => {
        const supabase = getSupabaseBrowserClient();

        if (!supabase) {
            setIsAuthLoading(false);
            return;
        }

        const initializeSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (!error && data.session?.user) {
                setUser(toAppUser(data.session.user));
            }
            setIsAuthLoading(false);
        };

        initializeSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(toAppUser(session.user));
            } else {
                setUser(null);
            }
            setIsAuthLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const requestLoginOtp = async (email: string): Promise<AuthActionResult> => {
        const supabase = getSupabaseBrowserClient();

        if (!supabase) {
            return { success: false, error: 'Supabase is not configured. Add env variables and restart the app.' };
        }

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: false,
            },
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    };

    const verifyLoginOtp = async (email: string, otp: string): Promise<AuthActionResult> => {
        const supabase = getSupabaseBrowserClient();
        const normalizedOtp = otp.replace(/\D/g, '');

        if (!/^\d{8}$/.test(normalizedOtp)) {
            return { success: false, error: 'OTP must be exactly 8 digits.' };
        }

        if (!supabase) {
            return { success: false, error: 'Supabase is not configured. Add env variables and restart the app.' };
        }

        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: normalizedOtp,
            type: 'email',
        });

        if (error || !data.user) {
            return { success: false, error: error?.message || 'Invalid verification code.' };
        }

        setUser(toAppUser(data.user));
        return { success: true };
    };

    const register = async (name: string, email: string, password: string): Promise<AuthActionResult> => {
        const supabase = getSupabaseBrowserClient();

        if (!supabase) {
            return { success: false, error: 'Supabase is not configured. Add env variables and restart the app.' };
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
            },
        });

        if (error) {
            return { success: false, error: error.message };
        }

        if (!data.session) {
            return {
                success: true,
                requiresEmailVerification: true,
            };
        }

        if (data.user) {
            setUser(toAppUser(data.user));
        }

        return { success: true };
    };

    const logout = async () => {
        const supabase = getSupabaseBrowserClient();
        if (supabase) {
            await supabase.auth.signOut();
        }
        setUser(null);
    };

    const updateProfile = async (data: Partial<User>): Promise<AuthActionResult> => {
        const supabase = getSupabaseBrowserClient();

        if (!supabase) {
            return { success: false, error: 'Supabase is not configured. Add env variables and restart the app.' };
        }

        const updatePayload: {
            email?: string;
            data?: {
                full_name?: string;
            };
        } = {};

        if (data.email) {
            updatePayload.email = data.email;
        }

        if (data.name) {
            updatePayload.data = {
                full_name: data.name,
            };
        }

        const { data: updatedUserData, error } = await supabase.auth.updateUser(updatePayload);

        if (error) {
            return { success: false, error: error.message };
        }

        if (updatedUserData.user) {
            setUser(toAppUser(updatedUserData.user));
        }

        return { success: true };
    };

    return (
        <AuthContext.Provider
            value={{ user, isAuthLoading, isAuthenticated: !!user, requestLoginOtp, verifyLoginOtp, register, logout, updateProfile }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
