'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/layout/Shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/auth/AuthProvider';
import { getSiteSettings, updateSiteSetting } from '@/lib/api/adminApi';
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
    .toLowerCase()
    .split(',')
    .map(email => email.trim())
    .filter(email => email.length > 0);

interface LocalSiteSettings {
    site_name: string;
    primary_color: string;
    background_color: string;
    accent_color: string;
    muted_color: string;
    categories: string[];
    menu_items: { label: string; href: string }[];
    max_skills_per_user: number;
    require_email_confirmation: boolean;
    allowed_email_domains: string;
}

export default function AdminSettingsPage() {
    const router = useRouter();
    const { user, session, loading } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);


    const [settings, setSettings] = useState<LocalSiteSettings>({
        site_name: 'GetClaudeSkills',
        primary_color: '#C15F3C',
        background_color: '#1a1a1a',
        accent_color: '#2a2a2a',
        muted_color: '#6b6b6b',
        categories: [],
        menu_items: [],
        max_skills_per_user: 100,
        require_email_confirmation: true,
        allowed_email_domains: '',
    });

    useEffect(() => {
        if (!loading && user) {
            const adminCheck = ADMIN_EMAILS.includes((user.email || '').toLowerCase().trim());
            setIsAdmin(adminCheck);

            if (!adminCheck) {
                router.push('/app');
            }
        } else if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    // Load settings
    useEffect(() => {
        if (isAdmin) {
            getSiteSettings().then(data => {
                console.log('Loaded settings:', data);
                setSettings(prev => ({
                    ...prev,
                    ...data,
                    // Ensure arrays are properly parsed
                    categories: Array.isArray(data.categories) ? data.categories : prev.categories,
                    menu_items: Array.isArray(data.menu_items) ? data.menu_items : prev.menu_items,
                    primary_color: data.primary_color || prev.primary_color,
                    background_color: data.background_color || prev.background_color,
                    accent_color: data.accent_color || prev.accent_color,
                    muted_color: data.muted_color || prev.muted_color,
                }));
            }).catch(err => console.error('Failed to load settings:', err));
        }
    }, [isAdmin]);

    const handleSave = async () => {
        if (!session?.access_token) return;
        setIsSaving(true);
        setSaveSuccess(false);

        try {
            // Save each setting key
            for (const [key, value] of Object.entries(settings)) {
                await updateSiteSetting(session.access_token, key, value);
            }
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Save failed', error);
        } finally {
            setIsSaving(false);
        }
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
        <Shell title="Settings">
            <div className="max-w-4xl mx-auto pb-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/app/admin">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-primary">Site Settings</h1>
                        <p className="text-muted-foreground">Configure branding, content, and policies</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* General Settings */}
                    <Card className="p-6 space-y-6">
                        <h3 className="text-lg font-semibold border-b border-border pb-2">Branding</h3>

                        {/* Site Name */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Site Name
                            </label>
                            <Input
                                value={settings.site_name}
                                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                                placeholder="GetClaudeSkills"
                            />
                        </div>

                        {/* Theme Colors */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Primary Color */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Primary Color
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border shadow-sm">
                                        <input
                                            type="color"
                                            value={settings.primary_color}
                                            onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                                            className="absolute -top-2 -left-2 w-14 h-14 p-0 cursor-pointer border-0"
                                        />
                                    </div>
                                    <Input
                                        value={settings.primary_color}
                                        onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                                        className="w-24 font-mono uppercase text-xs"
                                    />
                                </div>
                            </div>

                            {/* Background Color */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Background
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border shadow-sm">
                                        <input
                                            type="color"
                                            value={settings.background_color}
                                            onChange={(e) => setSettings({ ...settings, background_color: e.target.value })}
                                            className="absolute -top-2 -left-2 w-14 h-14 p-0 cursor-pointer border-0"
                                        />
                                    </div>
                                    <Input
                                        value={settings.background_color}
                                        onChange={(e) => setSettings({ ...settings, background_color: e.target.value })}
                                        className="w-24 font-mono uppercase text-xs"
                                    />
                                </div>
                            </div>

                            {/* Accent Color */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Accent Color
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border shadow-sm">
                                        <input
                                            type="color"
                                            value={settings.accent_color}
                                            onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                                            className="absolute -top-2 -left-2 w-14 h-14 p-0 cursor-pointer border-0"
                                        />
                                    </div>
                                    <Input
                                        value={settings.accent_color}
                                        onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                                        className="w-24 font-mono uppercase text-xs"
                                    />
                                </div>
                            </div>

                            {/* Muted Color */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Muted Text
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border shadow-sm">
                                        <input
                                            type="color"
                                            value={settings.muted_color}
                                            onChange={(e) => setSettings({ ...settings, muted_color: e.target.value })}
                                            className="absolute -top-2 -left-2 w-14 h-14 p-0 cursor-pointer border-0"
                                        />
                                    </div>
                                    <Input
                                        value={settings.muted_color}
                                        onChange={(e) => setSettings({ ...settings, muted_color: e.target.value })}
                                        className="w-24 font-mono uppercase text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                    {/* Access Policies (Legacy) - Moved up to fill space */}
                    <Card className="p-6 space-y-6 md:col-span-2 opacity-75">
                        <h3 className="text-lg font-semibold border-b border-border pb-2">Access Policies</h3>

                        {/* Max Skills */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Max Skills Per User
                            </label>
                            <Input
                                type="number"
                                value={settings.max_skills_per_user}
                                onChange={(e) => setSettings({ ...settings, max_skills_per_user: parseInt(e.target.value) || 0 })}
                                min={1}
                                max={1000}
                                className="max-w-xs"
                            />
                        </div>

                        {/* Allowed Domains */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Allowed Email Domains
                            </label>
                            <Input
                                value={settings.allowed_email_domains}
                                onChange={(e) => setSettings({ ...settings, allowed_email_domains: e.target.value })}
                                placeholder="Leave empty for all domains"
                            />
                        </div>
                    </Card>
                </div>

                {/* Floating Save Button */}
                <div className="fixed bottom-6 right-6 z-50">
                    <Button onClick={handleSave} disabled={isSaving} size="lg" className="shadow-xl">
                        {isSaving ? (
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5 mr-2" />
                        )}
                        Save Changes
                    </Button>
                    {saveSuccess && (
                        <div className="absolute top-full mt-2 right-0 bg-green-500 text-white text-xs px-3 py-1 rounded shadow-lg">
                            Saved!
                        </div>
                    )}
                </div>
            </div>
        </Shell>
    );
}
