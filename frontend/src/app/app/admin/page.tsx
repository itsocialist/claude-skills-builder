'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/layout/Shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { Users, FileText, Building2, TrendingUp, Settings, Shield } from 'lucide-react';
import Link from 'next/link';

// Admin emails from env (case-insensitive)
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').toLowerCase().split(',');

export default function AdminPage() {
    const router = useRouter();
    const { user, loading, isConfigured } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalSkills: 0,
        totalTeams: 0,
        skillsToday: 0,
    });

    useEffect(() => {
        // Don't do anything while still loading
        if (loading) return;

        // If Supabase isn't configured, show the page anyway (dev mode)
        if (!isConfigured) {
            setIsChecked(true);
            return;
        }

        if (user) {
            // Check admin status (case-insensitive)
            const adminCheck = ADMIN_EMAILS.includes((user.email || '').toLowerCase());
            setIsAdmin(adminCheck);
            setIsChecked(true);

            if (!adminCheck) {
                router.push('/app');
            }
        } else {
            // Only redirect if we're sure there's no user after loading completes
            setIsChecked(true);
            router.push('/');
        }
    }, [user, loading, router, isConfigured]);

    // Show spinner while loading OR before check completes
    if (loading || !isChecked) {
        return (
            <Shell>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </Shell>
        );
    }

    // If checked and not admin, show nothing (redirect is happening)
    if (!isAdmin && isConfigured) {
        return null;
    }

    const statCards = [
        { label: 'Total Users', value: stats.totalUsers, icon: Users, href: '/app/admin/users' },
        { label: 'Total Skills', value: stats.totalSkills, icon: FileText, href: '#' },
        { label: 'Teams', value: stats.totalTeams, icon: Building2, href: '#' },
        { label: 'Skills Today', value: stats.skillsToday, icon: TrendingUp, href: '#' },
    ];

    return (
        <Shell title="Admin">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <Shield className="w-8 h-8 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Site Administration</h1>
                        <p className="text-muted-foreground">Manage users, settings, and monitor usage</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statCards.map((stat) => (
                        <Link key={stat.label} href={stat.href}>
                            <Card className="p-6 hover:border-primary/50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <stat.icon className="w-6 h-6 text-primary" />
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
                </div>
            </div>
        </Shell>
    );
}
