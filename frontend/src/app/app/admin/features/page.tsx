'use client';


import { useState, useEffect } from 'react';
import { FLAG_KEYS, FlagKey, FlagState } from '@/lib/flags';
import { Shell } from '@/components/layout/Shell';
import { ArrowLeft, Loader2, Shield, Globe, Lock, AlertTriangle, LayoutDashboard, Hammer, ShoppingBag, Wand2, Settings, TrendingUp, GitBranch, LayoutTemplate, Package, Search, Building2, Library, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

const FLAG_META: Record<FlagKey, { label: string; description: string; icon: any }> = {
    feature_dashboard: { label: 'Dashboard', description: 'Main application landing.', icon: LayoutDashboard },
    feature_builder: { label: 'Skill Builder', description: 'Core flow builder.', icon: Hammer },
    feature_canvas: { label: 'Visual Canvas', description: 'Interactive node editor.', icon: GitBranch },
    feature_templates: { label: 'Templates', description: 'Skill templates library.', icon: LayoutTemplate },
    feature_packages: { label: 'Packages', description: 'Skill package management.', icon: Package },
    feature_bundles: { label: 'Power Bundles', description: 'Curated skill bundles.', icon: Layers },
    feature_inspector: { label: 'Inspector', description: 'Skill testing & debug.', icon: Search },
    feature_marketplace: { label: 'Marketplace', description: 'Public skill discovery.', icon: ShoppingBag },
    feature_generations: { label: 'Generations', description: 'AI generation tools.', icon: Wand2 },
    feature_organization: { label: 'Organization', description: 'Org & Team settings.', icon: Building2 },
    feature_myskills: { label: 'My Skills', description: 'User library access.', icon: Library },
    feature_admin: { label: 'Admin Panel', description: 'System administration.', icon: TrendingUp },
};

export default function FeaturesPage() {
    const [flags, setFlags] = useState<Record<FlagKey, FlagState> | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<FlagKey | null>(null);

    const fetchFlags = async () => {
        try {
            const res = await fetch('/api/admin/features', {
                credentials: 'include' // Important for middleware session
            });
            if (res.ok) {
                const data = await res.json();
                setFlags(data);
            }
        } catch (error) {
            console.error('Failed to fetch flags:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlags();
    }, []);

    const updateFlag = async (key: FlagKey, newState: FlagState) => {
        setSaving(key);
        try {
            const res = await fetch('/api/admin/features', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value: newState }),
            });

            if (res.ok) {
                setFlags(prev => prev ? { ...prev, [key]: newState } : null);
            }
        } catch (error) {
            console.error('Failed to update flag:', error);
        } finally {
            setSaving(null);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <Shell title="Admin">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/app/admin">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">Feature Management</h1>
                            <p className="text-muted-foreground mt-2">
                                Control feature availability across the platform. Changes apply immediately.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 text-xs font-mono text-muted-foreground">
                        ENV: {process.env.NODE_ENV}
                    </div>
                </div>
// ...

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(FLAG_KEYS).map((key) => {
                        const meta = FLAG_META[key];
                        const Icon = meta.icon;
                        const currentState = flags?.[key] || 'DISABLED';

                        return (
                            <Card key={key} className="relative overflow-hidden transition-all hover:shadow-md border-muted">
                                <div className={`absolute top-0 right-0 w-16 h-16 -mt-6 -mr-6 rounded-full opacity-5 ${getStateColor(currentState)}`} />

                                <CardHeader className="pb-2 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <Badge state={currentState} />
                                    </div>
                                    <CardTitle className="text-sm font-medium">{meta.label}</CardTitle>
                                    <CardDescription className="text-xs line-clamp-1">{meta.description}</CardDescription>
                                </CardHeader>

                                <CardContent className="p-4 pt-0">
                                    <Select
                                        value={currentState}
                                        onValueChange={(val) => updateFlag(key, val as FlagState)}
                                        disabled={saving === key}
                                    >
                                        <SelectTrigger className="w-full h-8 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PUBLIC" className="text-xs">
                                                <div className="flex items-center gap-2">
                                                    <Globe className="w-3 h-3 text-green-500" />
                                                    <span>Public</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="ADMIN_ONLY" className="text-xs">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="w-3 h-3 text-yellow-500" />
                                                    <span>Admin Only</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="DISABLED" className="text-xs">
                                                <div className="flex items-center gap-2">
                                                    <Lock className="w-3 h-3 text-red-500" />
                                                    <span>Disabled</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 p-4 flex gap-3 items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>Warning:</strong> Disabling "Admin Panel" will lock you out of this page immediately.
                        You will need to use the emergency env var override to regain access properly.
                    </div>
                </div>
            </div>
        </Shell>
    );
}

function getStateColor(state: FlagState) {
    if (state === 'PUBLIC') return 'bg-green-500';
    if (state === 'ADMIN_ONLY') return 'bg-yellow-500';
    return 'bg-red-500';
}

function Badge({ state }: { state?: FlagState }) {
    if (!state) return null;
    const styles = {
        DISABLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-900',
        ADMIN_ONLY: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-900',
        PUBLIC: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-900',
    };
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${styles[state]}`}>
            {state}
        </span>
    );
}
