'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/layout/Shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/auth/AuthProvider';
import { ArrowLeft, Search, UserX, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { listUsers, toggleUserStatus, AdminUser } from '@/lib/api/adminApi';

const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];

export default function AdminUsersPage() {
    const router = useRouter();
    const { user, session, loading } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [togglingUser, setTogglingUser] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && user && session) {
            const adminCheck = ADMIN_EMAILS.includes(user.email || '');
            setIsAdmin(adminCheck);

            if (!adminCheck) {
                router.push('/app');
            } else {
                loadUsers();
            }
        } else if (!loading && !user) {
            router.push('/');
        }
    }, [user, session, loading, router]);

    const loadUsers = async () => {
        if (!session?.access_token) return;

        setIsLoading(true);
        setError(null);
        try {
            const result = await listUsers(session.access_token);
            setUsers(result.users);
        } catch (err) {
            setError('Failed to load users');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleToggleUser = async (userId: string, currentlyDisabled: boolean) => {
        if (!session?.access_token) return;

        setTogglingUser(userId);
        const success = await toggleUserStatus(session.access_token, userId, !currentlyDisabled);

        if (success) {
            setUsers(users.map(u =>
                u.id === userId ? { ...u, disabled: !currentlyDisabled } : u
            ));
        }
        setTogglingUser(null);
    };

    if (loading || !isAdmin) {
        return (
            <Shell>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </Shell>
        );
    }

    return (
        <Shell title="Users">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/app/admin">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
                        <p className="text-muted-foreground">{users.length} registered users</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Users Table */}
                <Card className="overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr className="text-left text-sm text-muted-foreground">
                                <th className="px-4 py-3 font-medium">Email</th>
                                <th className="px-4 py-3 font-medium">Joined</th>
                                <th className="px-4 py-3 font-medium">Skills</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        Loading...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-muted/30">
                                        <td className="px-4 py-3 text-foreground">{u.email}</td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">{u.skills_count}</td>
                                        <td className="px-4 py-3">
                                            {u.disabled ? (
                                                <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded">
                                                    Disabled
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                                                    Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleToggleUser(u.id, u.disabled)}
                                                disabled={togglingUser === u.id}
                                            >
                                                {togglingUser === u.id ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <UserX className="w-4 h-4 mr-2" />
                                                )}
                                                {u.disabled ? 'Enable' : 'Disable'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </Card>
            </div>
        </Shell>
    );
}
