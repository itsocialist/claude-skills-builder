'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/layout/Shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { Users, FileText, Building2, TrendingUp, Settings, Shield, MessageSquare, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [stats, setStats] = useState({
        users: 0,
        skills: 0,
        settings: 0,
        orgs: 0,
        skills_today: 0,
    });

    useEffect(() => {
        if (!loading && user) {
            // Check admin status (case-insensitive)
            const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
                .toLowerCase()
                .split(',')
                .map(email => email.trim())
                .filter(email => email.length > 0);

            const userEmail = (user.email || '').toLowerCase().trim();
            const adminCheck = adminEmails.includes(userEmail);
            setIsAdmin(adminCheck);

            if (!adminCheck) {
                router.push('/app');
            } else {
                // Fetch stats if admin
                fetch('/api/admin/stats')
                    .then(res => res.json())
                    .then(data => {
                        // Map API response to state keys if they differ
                        setStats(prev => ({ ...prev, ...data }));
                    })
                    .catch(err => console.error('Stats fetch failed', err));
            }
        } else if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading || !isAdmin) {
        return (
            <Shell>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </Shell>
        );
    }

    const statCards = [
        { label: 'Total Users', value: stats.users, icon: Users, href: '/app/admin/users' },
        { label: 'Total Skills', value: stats.skills, icon: FileText, href: '#' },
        { label: 'Organizations', value: stats.orgs, icon: Building2, href: '#' },
        { label: 'Skills Today', value: stats.skills_today, icon: TrendingUp, href: '#' },
    ];

    return (
        <Shell title="Admin">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <Shield className="w-8 h-8 text-primary-500" />
                    <div>
                        <h1 className="text-2xl font-bold text-primary">Site Administration</h1>
                        <p className="text-muted-foreground">Manage users, settings, and monitor usage</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statCards.map((stat) => (
                        <Link key={stat.label} href={stat.href}>
                            <Card className="p-6 hover:border-primary-500/50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-primary-500/10 rounded-lg">
                                        <stat.icon className="w-6 h-6 text-primary-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            User Management
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            View, manage, and moderate user accounts.
                        </p>
                        <Link href="/app/admin/users">
                            <Button>Manage Users</Button>
                        </Link>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            Site Settings
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            Configure site-wide settings and limits.
                        </p>
                        <Link href="/app/admin/settings">
                            <Button>Configure Settings</Button>
                        </Link>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Feature Flags
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            Manage feature rollouts and system status.
                        </p>
                        <Link href="/app/admin/features">
                            <Button variant="outline">Manage Flags</Button>
                        </Link>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Analytics
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            View user activity, page views, and trends.
                        </p>
                        <Link href="/app/admin/analytics">
                            <Button variant="outline">View Analytics</Button>
                        </Link>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            Feedback
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            Review user feedback and bug reports.
                        </p>
                        <Link href="/app/admin/feedback">
                            <Button variant="outline">View Feedback</Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </Shell>
    );
}
