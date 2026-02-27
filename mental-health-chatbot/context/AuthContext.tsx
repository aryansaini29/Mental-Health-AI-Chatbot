'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    name: string;
    email: string;
    avatar?: string;
    joinedDate: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => boolean;
    register: (name: string, email: string, password: string) => boolean;
    logout: () => void;
    updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('mhc_user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem('mhc_user');
            }
        }
    }, []);

    const login = (email: string, password: string): boolean => {
        const stored = localStorage.getItem('mhc_users');
        if (stored) {
            try {
                const users = JSON.parse(stored) as Array<{ name: string; email: string; password: string; joinedDate: string }>;
                const found = users.find((u) => u.email === email && u.password === password);
                if (found) {
                    const userData: User = { name: found.name, email: found.email, joinedDate: found.joinedDate };
                    setUser(userData);
                    localStorage.setItem('mhc_user', JSON.stringify(userData));
                    return true;
                }
            } catch {
                return false;
            }
        }
        return false;
    };

    const register = (name: string, email: string, password: string): boolean => {
        const stored = localStorage.getItem('mhc_users');
        let users: Array<{ name: string; email: string; password: string; joinedDate: string }> = [];
        if (stored) {
            try {
                users = JSON.parse(stored);
            } catch {
                users = [];
            }
        }

        if (users.some((u) => u.email === email)) return false;

        const newUser = { name, email, password, joinedDate: new Date().toISOString() };
        users.push(newUser);
        localStorage.setItem('mhc_users', JSON.stringify(users));

        const userData: User = { name, email, joinedDate: newUser.joinedDate };
        setUser(userData);
        localStorage.setItem('mhc_user', JSON.stringify(userData));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('mhc_user');
    };

    const updateProfile = (data: Partial<User>) => {
        if (user) {
            const updated = { ...user, ...data };
            setUser(updated);
            localStorage.setItem('mhc_user', JSON.stringify(updated));
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
