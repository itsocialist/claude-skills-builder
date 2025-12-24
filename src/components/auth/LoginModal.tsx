'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { X, Mail, Lock, Loader2 } from 'lucide-react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const { signIn, signUp, isConfigured } = useAuth();
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            if (mode === 'login') {
                const { error } = await signIn(email, password);
                if (error) {
                    setError(error.message);
                } else {
                    onClose();
                }
            } else {
                const { error } = await signUp(email, password);
                if (error) {
                    setError(error.message);
                } else {
                    setSuccess('Check your email to confirm your account!');
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <h2 className="text-xl font-semibold text-white mb-6">
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                </h2>

                {!isConfigured ? (
                    <div className="text-center py-8">
                        <p className="text-gray-400">
                            Authentication is not configured yet.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Set up Supabase to enable user accounts.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#C15F3C]"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#C15F3C]"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {/* Error/Success messages */}
                        {error && (
                            <p className="text-red-400 text-sm">{error}</p>
                        )}
                        {success && (
                            <p className="text-green-400 text-sm">{success}</p>
                        )}

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#C15F3C] hover:bg-[#a84e31] disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {mode === 'login' ? 'Sign In' : 'Create Account'}
                        </button>

                        {/* Toggle mode */}
                        <p className="text-center text-sm text-gray-400">
                            {mode === 'login' ? (
                                <>
                                    Don&apos;t have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setMode('signup')}
                                        className="text-[#C15F3C] hover:underline"
                                    >
                                        Sign up
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setMode('login')}
                                        className="text-[#C15F3C] hover:underline"
                                    >
                                        Sign in
                                    </button>
                                </>
                            )}
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
