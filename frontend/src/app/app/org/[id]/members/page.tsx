'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/layout/Shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/auth/AuthProvider';
import { getOrgMembersWithDetails, OrgMemberWithProfile, inviteOrgMember, updateOrgMemberRole, getOrgInvites, OrgInvite, cancelOrgInvite } from '@/lib/api/organizationApi';
import { Loader2, UserPlus, ArrowLeft, MoreHorizontal, Shield, Trash2, Users } from 'lucide-react';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function OrgMembersPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { user } = useAuth();
    const [members, setMembers] = useState<OrgMemberWithProfile[]>([]);
    const [invites, setInvites] = useState<OrgInvite[]>([]);
    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviting, setInviting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Check if current user is admin/owner
    const currentUserRole = members.find(m => m.user_id === user?.id)?.role;
    const canManage = currentUserRole === 'owner' || currentUserRole === 'admin';

    useEffect(() => {
        async function load() {
            if (!user) return;
            try {
                const [membersData, invitesData] = await Promise.all([
                    getOrgMembersWithDetails(resolvedParams.id),
                    getOrgInvites(resolvedParams.id)
                ]);
                setMembers(membersData);
                setInvites(invitesData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [resolvedParams.id, user]);

    const handleInvite = async () => {
        if (!inviteEmail.trim()) return;
        setInviting(true);
        // TODO: Implement actual invite
        const success = await inviteOrgMember(resolvedParams.id, inviteEmail, 'member');

        if (success) {
            setSuccessMessage(`Invitation sent to ${inviteEmail}`);
            // Refresh invites list
            const updatedInvites = await getOrgInvites(resolvedParams.id);
            setInvites(updatedInvites);
            setInviteEmail('');
            setTimeout(() => setSuccessMessage(''), 5000);
        } else {
            alert('Failed to send invite');
        }
        setInviting(false);
    };

    const handleCancelInvite = async (inviteId: string) => {
        if (confirm('Are you sure you want to cancel this invitation?')) {
            const success = await cancelOrgInvite(inviteId);
            if (success) {
                setInvites(invites.filter(i => i.id !== inviteId));
            }
        }
    };

    const handleRoleChange = async (userId: string, newRole: 'admin' | 'member') => {
        const success = await updateOrgMemberRole(resolvedParams.id, userId, newRole);
        if (success) {
            setMembers(members.map(m => m.user_id === userId ? { ...m, role: newRole } : m));
        }
    };

    if (loading) {
        return (
            <Shell title="Members">
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </Shell>
        );
    }

    return (
        <Shell title="Organization Members">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href="/app/org">
                        <Button variant="ghost" className="pl-0 gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Organizations
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Members</h1>
                        <p className="text-muted-foreground">Manage who has access to this organization</p>
                    </div>
                </div>

                {/* Invite Section */}
                {canManage && (
                    <Card className="p-6 mb-8">
                        <h3 className="text-lg font-semibold mb-4">Invite Member</h3>
                        <div className="flex gap-4">
                            <Input
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                placeholder="colleague@company.com"
                                className="flex-1"
                            />
                            <Button onClick={handleInvite} disabled={inviting || !inviteEmail.trim()}>
                                {inviting ? 'Sending...' : (
                                    <>
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Invite
                                    </>
                                )}
                            </Button>
                        </div>

                        {successMessage && (
                            <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">{successMessage}</p>
                        )}
                    </Card>
                )
                }

                {/* Pending Invites */}
                {
                    invites.length > 0 && (
                        <Card className="mb-8 p-6">
                            <h3 className="text-lg font-semibold mb-4 text-foreground">Pending Invitations</h3>
                            <div className="space-y-4">
                                {invites.map((invite) => (
                                    <div key={invite.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                @
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground">{invite.email}</div>
                                                <div className="text-xs text-muted-foreground mr-2">
                                                    Role: {invite.role} • Expires: {new Date(invite.expires_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        {canManage && (
                                            <Button variant="ghost" size="sm" onClick={() => handleCancelInvite(invite.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )
                }

                {/* Members List */}
                <Card>
                    <div className="divide-y divide-border">
                        {members.map((member) => (
                            <div key={member.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={member.profile?.avatar_url || ''} />
                                        <AvatarFallback>
                                            {member.profile?.full_name?.charAt(0) || member.user_id.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium text-foreground">
                                            {member.profile?.full_name || 'Unknown User'}
                                            {member.user_id === user?.id && <span className="ml-2 text-xs text-muted-foreground">(You)</span>}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {member.profile?.email || member.user_id}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${member.role === 'owner' ? 'bg-primary/20 text-primary' :
                                        member.role === 'admin' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                            'bg-muted text-muted-foreground'
                                        }`}>
                                        {member.role}
                                    </span>

                                    {canManage && member.role !== 'owner' && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleRoleChange(member.user_id, 'admin')}>
                                                    <Shield className="w-4 h-4 mr-2" />
                                                    Make Admin
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleRoleChange(member.user_id, 'member')}>
                                                    <Users className="w-4 h-4 mr-2" />
                                                    Make Member
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Remove Member
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div >
        </Shell >
    );
}
