'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/layout/Shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/auth/AuthProvider';
import { useUserTier } from '@/hooks/useUserTier';
import { Building2, Users, FileText, Shield, Plus } from 'lucide-react';
import {
    getUserOrganizations,
    createOrganization,
    Organization,
} from '@/lib/api/organizationApi';
import Link from 'next/link';

export default function OrgPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { tier, loading: tierLoading } = useUserTier();
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newOrgName, setNewOrgName] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        async function load() {
            if (!user?.id) return;
            const data = await getUserOrganizations(user.id);
            setOrgs(data);
            setLoading(false);
        }
        if (!authLoading && user) {
            load();
        }
    }, [user, authLoading]);

    // Redirect individual users
    useEffect(() => {
        if (!tierLoading && tier === 'individual') {
            router.push('/app');
        }
    }, [tier, tierLoading, router]);

    const handleCreate = async () => {
        if (!user?.id || !newOrgName.trim()) return;
        setCreating(true);
        const org = await createOrganization(user.id, newOrgName.trim());
        if (org) {
            setOrgs([...orgs, org]);
            setNewOrgName('');
            setShowCreate(false);
        }
        setCreating(false);
    };

    if (authLoading || tierLoading || loading) {
        return (
            <Shell title="Organization">
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </Shell>
        );
    }

    return (
        <Shell title="Organization">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-primary" />
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Organization</h1>
                            <p className="text-muted-foreground">Manage your enterprise organization</p>
                        </div>
                    </div>
                    <Button onClick={() => setShowCreate(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Organization
                    </Button>
                </div>

                {/* Create Modal */}
                {showCreate && (
                    <Card className="p-6 mb-8">
                        <h3 className="text-lg font-semibold mb-4">Create Organization</h3>
                        <div className="flex gap-4">
                            <Input
                                value={newOrgName}
                                onChange={(e) => setNewOrgName(e.target.value)}
                                placeholder="Organization name"
                                className="flex-1"
                            />
                            <Button onClick={handleCreate} disabled={creating || !newOrgName.trim()}>
                                {creating ? 'Creating...' : 'Create'}
                            </Button>
                            <Button variant="outline" onClick={() => setShowCreate(false)}>
                                Cancel
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Organizations List */}
                {orgs.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No organizations yet</h3>
                        <p className="text-muted-foreground mb-4">
                            Create an organization to manage teams and collaborate.
                        </p>
                        <Button onClick={() => setShowCreate(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Organization
                        </Button>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {orgs.map((org) => (
                            <Card key={org.id} className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-primary/10 rounded-lg">
                                            <Building2 className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">{org.name}</h3>
                                            <p className="text-sm text-muted-foreground">/{org.slug}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link href={`/app/org/${org.id}/members`}>
                                            <Button variant="outline" size="sm">
                                                <Users className="w-4 h-4 mr-2" />
                                                Members
                                            </Button>
                                        </Link>
                                        <Link href={`/app/org/${org.id}/audit`}>
                                            <Button variant="outline" size="sm">
                                                <FileText className="w-4 h-4 mr-2" />
                                                Audit Log
                                            </Button>
                                        </Link>
                                        <Link href={`/app/org/${org.id}/settings`}>
                                            <Button variant="outline" size="sm">
                                                <Shield className="w-4 h-4 mr-2" />
                                                Settings
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </Shell>
    );
}
