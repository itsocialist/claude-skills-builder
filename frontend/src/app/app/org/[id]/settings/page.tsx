'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/layout/Shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/auth/AuthProvider';
import { getOrganizationById, updateOrganization, Organization, getOrgMembers } from '@/lib/api/organizationApi';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OrgSettingsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params); // Unwrap params
    const router = useRouter();
    const { user } = useAuth();
    const [org, setOrg] = useState<Organization | null>(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        async function load() {
            if (!user) return;
            try {
                // Check if user is member/admin?
                // For now just fetch org
                const data = await getOrganizationById(resolvedParams.id);
                if (data) {
                    setOrg(data);
                    setName(data.name);
                } else {
                    setError('Organization not found');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load organization');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [resolvedParams.id, user]);

    const handleSave = async () => {
        if (!org || !user) return;
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const updated = await updateOrganization(org.id, { name });
            if (updated) {
                setOrg(updated);
                setSuccess('Settings saved successfully');
                // Refresh router to update any sidebar names?
                router.refresh();
            } else {
                setError('Failed to update organization');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Shell title="Settings">
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </Shell>
        );
    }

    if (!org) {
        return (
            <Shell title="Settings">
                <div className="text-center py-20">
                    <h3 className="text-lg font-semibold">{error || 'Organization not found'}</h3>
                    <Link href="/app/org">
                        <Button variant="link" className="mt-4">Back to Organizations</Button>
                    </Link>
                </div>
            </Shell>
        );
    }

    return (
        <Shell title="Organization Settings">
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
                        <h1 className="text-3xl font-bold text-foreground">{org.name}</h1>
                        <p className="text-muted-foreground">Manage organization settings</p>
                    </div>
                </div>

                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">General Settings</h3>

                    <div className="space-y-4 max-w-md">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-foreground">Organization Name</label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Acme Corp"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-muted-foreground">Slug (URL Identifier)</label>
                            <Input
                                value={org.slug}
                                disabled
                                className="bg-muted text-muted-foreground"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Slugs cannot be changed after creation.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-muted-foreground">Tier</label>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase">
                                    {org.tier}
                                </span>
                            </div>
                        </div>

                        {error && (
                            <div className="text-sm text-destructive font-medium">{error}</div>
                        )}
                        {success && (
                            <div className="text-sm text-green-600 font-medium">{success}</div>
                        )}

                        <div className="pt-4">
                            <Button onClick={handleSave} disabled={saving || !name.trim()}>
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </Shell>
    );
}
