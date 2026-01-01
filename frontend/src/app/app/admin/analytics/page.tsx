'use client';

import { useState, useEffect } from 'react';
import { Shell } from '@/components/layout/Shell';
import { useAuth } from '@/components/auth/AuthProvider';
import { Loader2, TrendingUp, Users, MousePointer, FileText, Clock, UserCheck, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    PieChart,
    Pie,
    Cell,
} from 'recharts';

interface AnalyticsData {
    totalEvents: number;
    eventCounts: Record<string, number>;
    dailyActiveUsers: { date: string; count: number }[];
    topPages: { page: string; views: number }[];
    uniqueVisitors: number;
    avgSessionDuration: number;
    totalSessions: number;
}

const COLORS = ['#C15F3C', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

export default function AdminAnalyticsPage() {
    const { user } = useAuth();
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(7);
    const [excludeInternal, setExcludeInternal] = useState(true);

    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').toLowerCase().split(',');
    const isAdmin = user?.email && adminEmails.some(e => e.trim() === user.email?.toLowerCase().trim());

    useEffect(() => {
        async function fetchAnalytics() {
            if (!isAdmin) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/admin/analytics?days=${days}&excludeInternal=${excludeInternal}`);
                if (!response.ok) throw new Error('Failed to fetch');
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        }

        setLoading(true);
        fetchAnalytics();
    }, [isAdmin, days, excludeInternal]);

    // Format duration for display
    const formatDuration = (seconds: number) => {
        if (seconds < 60) return `${seconds}s`;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

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
        skill_view: 'Skills Viewed',
        bundle_download: 'Bundles Downloaded',
    };

    // Prepare event breakdown data - include all events for pie chart
    const eventBreakdownData = Object.entries(data?.eventCounts || {})
        .map(([name, value]) => ({
            name: eventLabels[name] || name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            count: value,
        }))
        .filter(item => item.count > 0)
        .sort((a, b) => b.count - a.count);

    return (
        <Shell title="Analytics Dashboard">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
                        <p className="text-sm text-muted-foreground">
                            {data?.totalEvents.toLocaleString()} events in the last {days} days
                            {excludeInternal && <span className="ml-1 text-primary">(filtered)</span>}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant={excludeInternal ? "default" : "outline"}
                            size="sm"
                            onClick={() => setExcludeInternal(!excludeInternal)}
                            className="gap-2"
                        >
                            <Filter className="h-4 w-4" />
                            {excludeInternal ? 'Filtered' : 'All Traffic'}
                        </Button>
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
                </div>

                {/* Stats Cards - 6 cards in 2 rows */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
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
                                <UserCheck className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{data?.uniqueVisitors || 0}</p>
                                <p className="text-xs text-muted-foreground">Unique Visitors</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-cyan-500/10 rounded-lg">
                                <Users className="w-5 h-5 text-cyan-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{data?.totalSessions || 0}</p>
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
                                <p className="text-2xl font-bold">{data?.eventCounts?.page_view || 0}</p>
                                <p className="text-xs text-muted-foreground">Page Views</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Clock className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{formatDuration(data?.avgSessionDuration || 0)}</p>
                                <p className="text-xs text-muted-foreground">Avg Session Time</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500/10 rounded-lg">
                                <FileText className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{data?.eventCounts?.skill_create || 0}</p>
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

                    {/* Event Breakdown Chart - Pie Chart */}
                    <Card className="p-4">
                        <h3 className="text-sm font-medium mb-4">Event Breakdown</h3>
                        <div className="h-64">
                            {eventBreakdownData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={eventBreakdownData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="count"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {eventBreakdownData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1a1a1a',
                                                border: '1px solid #333',
                                                borderRadius: '8px',
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    <p className="text-sm">No event data available</p>
                                </div>
                            )}
                        </div>
                        {/* Event Legend */}
                        {eventBreakdownData.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {eventBreakdownData.map((entry, index) => (
                                    <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        />
                                        <span className="text-muted-foreground">{entry.name}: {entry.count}</span>
                                    </div>
                                ))}
                            </div>
                        )}
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

                {/* Filter Settings */}
                <Card className="p-4 mt-6">
                    <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Traffic Filter Settings
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Excluded Domains</p>
                            <div className="flex flex-wrap gap-2">
                                {['localhost', '127.0.0.1', 'vercel.app'].map(domain => (
                                    <span key={domain} className="px-2 py-1 bg-muted text-xs rounded font-mono">
                                        {domain}
                                    </span>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Traffic from these domains is excluded when filtering is enabled.
                            </p>
                        </div>
                        <div className="border-t border-border pt-4">
                            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Your Excluded IPs</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded font-mono">
                                    68.7.134.117
                                </span>
                                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded font-mono">
                                    2600:8801:ac00:d:*
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Your traffic from these IPs is excluded. Edit <code className="bg-muted px-1 rounded">ANALYTICS_EXCLUDED_IPS</code> in <code className="bg-muted px-1 rounded">.env.local</code> to modify.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </Shell>
    );
}
