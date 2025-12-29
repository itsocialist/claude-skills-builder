'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Mail, Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface EmailCaptureModalProps {
    onClose: () => void;
    onSkip: () => void;
    onSuccess: () => void;
}

export function EmailCaptureModal({ onClose, onSkip, onSuccess }: EmailCaptureModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setError('Please enter your email');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            if (!supabase) {
                throw new Error('Authentication not configured');
            }

            // Auto-generate a random password for simplified signup
            const autoPassword = password || Math.random().toString(36).slice(-12) + 'Aa1!';

            // Sign up the user
            const { data, error: signupError } = await supabase.auth.signUp({
                email: email.trim(),
                password: autoPassword,
                options: {
                    emailRedirectTo: `${window.location.origin}/app`,
                }
            });

            if (signupError) {
                // If user already exists, that's okay - we still captured the email
                if (signupError.message.includes('already registered')) {
                    setError('You already have an account! Please sign in from the app.');

                    // Still counts as success - we know this user
                    setTimeout(() => {
                        onSuccess();
                    }, 2000);
                    return;
                }
                throw signupError;
            }

            if (data.user) {
                // Success! User created and email captured
                onSuccess();
            }
        } catch (err) {
            console.error('Email capture error:', err);
            setError(err instanceof Error ? err.message : 'Failed to save email');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-card border-border shadow-2xl p-8">
                <div className="flex justify-end mb-4">
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="text-center mb-6">
                    <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                        <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        Love what you created?
                    </h2>
                    <p className="text-muted-foreground">
                        Save it to your library and create unlimited skills
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                            Email address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="pl-10"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || !email.trim()}
                    >
                        {isSubmitting ? (
                            'Creating account...'
                        ) : (
                            <>
                                Create Free Account
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={onSkip}
                        disabled={isSubmitting}
                    >
                        Maybe later
                    </Button>
                </form>

                <p className="text-xs text-muted-foreground text-center mt-4">
                    We'll send you a confirmation email. No spam, ever.
                </p>
            </Card>
        </div>
    );
}
