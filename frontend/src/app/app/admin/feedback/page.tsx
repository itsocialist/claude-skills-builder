'use client';

import { useState, useEffect } from 'react';
import { Shell } from '@/components/layout/Shell';
import { useAuth } from '@/components/auth/AuthProvider';
import { createClient } from '@supabase/supabase-js';
import { Loader2, MessageSquare, Bug, Lightbulb, HelpCircle, Mail, Clock, Globe } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

interface FeedbackItem {
    id: string;
    category: string;
    message: string;
    email: string | null;
    page_url: string | null;
    created_at: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    bug: <Bug className="w-4 h-4 text-red-400" />,
    feature: <Lightbulb className="w-4 h-4 text-yellow-400" />,
    question: <HelpCircle className="w-4 h-4 text-blue-400" />,
    other: <MessageSquare className="w-4 h-4 text-gray-400" />,
};

const CATEGORY_LABELS: Record<string, string> = {
    bug: 'Bug Report',
    feature: 'Feature Request',
    question: 'Question',
    other: 'Other',
};

export default function AdminFeedbackPage() {
    const { user } = useAuth();
    const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check admin status
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').toLowerCase().split(',');
    const isAdmin = user?.email && adminEmails.some(e => e.trim() === user.email?.toLowerCase().trim());

    useEffect(() => {
        async function fetchFeedback() {
            if (!isAdmin) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/admin/feedback');
                if (!response.ok) {
                    throw new Error('Failed to fetch feedback');
                }
                const data = await response.json();
                setFeedback(data.feedback || []);
            } catch (err) {
                setError('Failed to load feedback');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchFeedback();
    }, [isAdmin]);

    if (!isAdmin) {
        return (
            <Shell title="Access Denied">
                <div className="flex items-center justify-center h-[60vh]">
                    <p className="text-muted-foreground">Admin access required</p>
                </div>
            </Shell>
        );
    }

    if (loading) {
        return (
            <Shell title="Feedback">
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            </Shell>
        );
    }

    return (
        <Shell title="User Feedback">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">User Feedback</h1>
                        <p className="text-sm text-muted-foreground">{feedback.length} submissions</p>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-6">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}

                {feedback.length === 0 ? (
                    <div className="text-center py-12">
                        <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No feedback yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {feedback.map((item) => (
                            <div
                                key={item.id}
                                className="p-4 bg-card border border-border rounded-lg"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        {CATEGORY_ICONS[item.category] || CATEGORY_ICONS.other}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-medium px-2 py-0.5 bg-muted rounded">
                                                {CATEGORY_LABELS[item.category] || item.category}
                                            </span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-foreground whitespace-pre-wrap">{item.message}</p>
                                        <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                                            {item.email && (
                                                <span className="flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {item.email}
                                                </span>
                                            )}
                                            {item.page_url && (
                                                <span className="flex items-center gap-1">
                                                    <Globe className="w-3 h-3" />
                                                    {item.page_url.replace(/^https?:\/\/[^/]+/, '')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Shell>
    );
}
