'use client';

import { useState, useEffect } from 'react';
import { Shell } from '@/components/layout/Shell';
import { useAuth } from '@/components/auth/AuthProvider';
import { Loader2, TrendingUp, Users, MousePointer, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts';

interface AnalyticsData {
    totalEvents: number;
    eventCounts: Record<string, number>;
    dailyActiveUsers: { date: string; count: number }[];
    topPages: { page: string; views: number }[];
}

export default function AdminAnalyticsPage() {
    const { user } = useAuth();
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(7);

    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').toLowerCase().split(',');
    const isAdmin = user?.email && adminEmails.some(e => e.trim() === user.email?.toLowerCase().trim());

    useEffect(() => {
        async function fetchAnalytics() {
            if (!isAdmin) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/admin/analytics?days=${days}`);
                if (!response.ok) throw new Error('Failed to fetch');
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchAnalytics();
    }, [isAdmin, days]);

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
            <Shell title="Analytics">
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            </Shell>
        );
    }

    const eventLabels: Record<string, string> = {
        page_view: 'Page Views',
        skill_create: 'Skills Created',
        skill_export: 'Skills Exported',
        template_use: 'Templates Used',
        feedback_submit: 'Feedback Sent',
    };

    return (
        <Shell title="Analytics Dashboard">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
                        <p className="text-sm text-muted-foreground">
                            {data?.totalEvents.toLocaleString()} events in the last {days} days
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {[7, 14, 30].map((d) => (
                            <button
                                key={d}
                                onClick={() => setDays(d)}
                                className={`px-3 py-1 text-sm rounded ${days === d
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {d}d
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{data?.totalEvents.toLocaleString() || 0}</p>
                                <p className="text-xs text-muted-foreground">Total Events</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Users className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {data?.dailyActiveUsers.reduce((sum, d) => sum + d.count, 0) || 0}
                                </p>
                                <p className="text-xs text-muted-foreground">Total Sessions</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <MousePointer className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{data?.eventCounts.page_view || 0}</p>
                                <p className="text-xs text-muted-foreground">Page Views</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500/10 rounded-lg">
                                <FileText className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{data?.eventCounts.skill_create || 0}</p>
                                <p className="text-xs text-muted-foreground">Skills Created</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Daily Active Users Chart */}
                    <Card className="p-4">
                        <h3 className="text-sm font-medium mb-4">Daily Active Sessions</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data?.dailyActiveUsers || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#666"
                                        fontSize={12}
                                        tickFormatter={(v) => v.slice(5)}
                                    />
                                    <YAxis stroke="#666" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1a1a1a',
                                            border: '1px solid #333',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#C15F3C"
                                        strokeWidth={2}
                                        dot={{ fill: '#C15F3C' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Event Breakdown Chart */}
                    <Card className="p-4">
                        <h3 className="text-sm font-medium mb-4">Event Breakdown</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={Object.entries(data?.eventCounts || {})
                                        .filter(([key]) => key !== 'page_view')
                                        .map(([name, value]) => ({
                                            name: eventLabels[name] || name,
                                            count: value,
                                        }))}
                                    layout="vertical"
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis type="number" stroke="#666" fontSize={12} />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        stroke="#666"
                                        fontSize={12}
                                        width={100}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1a1a1a',
                                            border: '1px solid #333',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Bar dataKey="count" fill="#C15F3C" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Top Pages */}
                <Card className="p-4">
                    <h3 className="text-sm font-medium mb-4">Top Pages</h3>
                    <div className="space-y-2">
                        {data?.topPages.map((page, i) => (
                            <div key={page.page} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-muted-foreground w-6">{i + 1}.</span>
                                    <span className="text-sm font-mono">{page.page}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">{page.views} views</span>
                            </div>
                        ))}
                        {(!data?.topPages || data.topPages.length === 0) && (
                            <p className="text-sm text-muted-foreground text-center py-4">No page views yet</p>
                        )}
                    </div>
                </Card>
            </div>
        </Shell>
    );
}
