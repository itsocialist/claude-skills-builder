'use client';

import { useEffect, useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/auth/AuthProvider';
import { getUserTeams, createTeam, getTeamMembers, inviteTeamMember, type Team, type TeamMember } from '@/lib/api/teamApi';
import { Users, Plus, Mail, Crown, Shield, User, Loader2, Building2 } from 'lucide-react';

export default function TeamSettingsPage() {
    const { user } = useAuth();
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isInviting, setIsInviting] = useState(false);

    useEffect(() => {
        if (user) {
            loadTeams();
        }
    }, [user]);

    const loadTeams = async () => {
        if (!user) return;
        setIsLoading(true);
        const data = await getUserTeams(user.id);
        setTeams(data);
        if (data.length > 0) {
            setSelectedTeam(data[0]);
            loadMembers(data[0].id);
        }
        setIsLoading(false);
    };

    const loadMembers = async (teamId: string) => {
        const data = await getTeamMembers(teamId);
        setMembers(data);
    };

    const handleCreateTeam = async () => {
        if (!user || !newTeamName.trim()) return;
        setIsCreating(true);
        const team = await createTeam(user.id, newTeamName);
        if (team) {
            setTeams([...teams, team]);
            setSelectedTeam(team);
            setNewTeamName('');
            setShowCreateModal(false);
            loadMembers(team.id);
        }
        setIsCreating(false);
    };

    const handleInvite = async () => {
        if (!user || !selectedTeam || !inviteEmail.trim()) return;
        setIsInviting(true);
        const success = await inviteTeamMember(selectedTeam.id, inviteEmail, user.id);
        if (success) {
            setInviteEmail('');
            // Show success message
        }
        setIsInviting(false);
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'owner': return <Crown className="w-4 h-4 text-yellow-500" />;
            case 'admin': return <Shield className="w-4 h-4 text-blue-500" />;
            default: return <User className="w-4 h-4 text-muted-foreground" />;
        }
    };

    if (!user) {
        return (
            <Shell>
                <div className="text-center py-20">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-foreground mb-2">Sign in to manage teams</h2>
                </div>
            </Shell>
        );
    }

    return (
        <Shell title="Team Settings">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-primary" />
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Team Settings</h1>
                            <p className="text-muted-foreground">Manage your teams and members</p>
                        </div>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Team
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : teams.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No teams yet</h3>
                        <p className="text-muted-foreground mb-6">
                            Create a team to collaborate with others on skills.
                        </p>
                        <Button onClick={() => setShowCreateModal(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Your First Team
                        </Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Team List */}
                        <Card className="p-4">
                            <h3 className="text-sm font-medium text-muted-foreground mb-3">Your Teams</h3>
                            <div className="space-y-2">
                                {teams.map((team) => (
                                    <button
                                        key={team.id}
                                        onClick={() => {
                                            setSelectedTeam(team);
                                            loadMembers(team.id);
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedTeam?.id === team.id
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-accent text-foreground'
                                            }`}
                                    >
                                        {team.name}
                                    </button>
                                ))}
                            </div>
                        </Card>

                        {/* Team Details */}
                        <Card className="p-6 lg:col-span-2">
                            {selectedTeam ? (
                                <>
                                    <h3 className="text-lg font-semibold text-foreground mb-4">
                                        {selectedTeam.name}
                                    </h3>

                                    {/* Invite Member */}
                                    <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                                        <h4 className="text-sm font-medium text-foreground mb-2">
                                            Invite Member
                                        </h4>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="email@example.com"
                                                value={inviteEmail}
                                                onChange={(e) => setInviteEmail(e.target.value)}
                                            />
                                            <Button onClick={handleInvite} disabled={isInviting}>
                                                {isInviting ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Mail className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Members List */}
                                    <h4 className="text-sm font-medium text-muted-foreground mb-3">
                                        Members ({members.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {members.map((member) => (
                                            <div
                                                key={member.id}
                                                className="flex items-center justify-between p-3 bg-muted/30 rounded-md"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {getRoleIcon(member.role)}
                                                    <span className="text-foreground">
                                                        {member.email || member.user_id}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-muted-foreground capitalize">
                                                    {member.role}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p className="text-muted-foreground">Select a team</p>
                            )}
                        </Card>
                    </div>
                )}

                {/* Create Team Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <Card className="p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Create Team</h3>
                            <Input
                                placeholder="Team name"
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)}
                                className="mb-4"
                            />
                            <div className="flex gap-2 justify-end">
                                <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCreateTeam} disabled={isCreating}>
                                    {isCreating ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : null}
                                    Create
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </Shell>
    );
}
