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
    const [newCategory, setNewCategory] = useState('');
    const [newMenuItem, setNewMenuItem] = useState({ label: '', href: '' });

    const [settings, setSettings] = useState<LocalSiteSettings>({
        site_name: 'ClaudeSkillsFacet',
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

    const addCategory = () => {
        if (newCategory.trim() && !settings.categories.includes(newCategory.trim())) {
            setSettings(prev => ({
                ...prev,
                categories: [...prev.categories, newCategory.trim()]
            }));
            setNewCategory('');
        }
    };

    const removeCategory = (cat: string) => {
        setSettings(prev => ({
            ...prev,
            categories: prev.categories.filter(c => c !== cat)
        }));
    };

    const addMenuItem = () => {
        if (newMenuItem.label && newMenuItem.href) {
            setSettings(prev => ({
                ...prev,
                menu_items: [...prev.menu_items, newMenuItem]
            }));
            setNewMenuItem({ label: '', href: '' });
        }
    };

    const removeMenuItem = (index: number) => {
        setSettings(prev => ({
            ...prev,
            menu_items: prev.menu_items.filter((_, i) => i !== index)
        }));
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
                        <h1 className="text-2xl font-bold text-foreground">Site Settings</h1>
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
                                placeholder="ClaudeSkillsFacet"
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

                    {/* Skill Categories */}
                    <Card className="p-6 space-y-6">
                        <h3 className="text-lg font-semibold border-b border-border pb-2">Skill Categories</h3>

                        <div className="flex gap-2">
                            <Input
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Add new category"
                                onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                            />
                            <Button onClick={addCategory} size="sm" variant="secondary">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {settings.categories.map((cat) => (
                                <div key={cat} className="flex items-center gap-1 px-3 py-1 bg-accent rounded-full text-sm">
                                    <span>{cat}</span>
                                    <button onClick={() => removeCategory(cat)} className="text-muted-foreground hover:text-destructive">
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            {settings.categories.length === 0 && (
                                <p className="text-sm text-muted-foreground italic">No categories defined</p>
                            )}
                        </div>
                    </Card>

                    {/* Menu Items */}
                    <Card className="p-6 space-y-6 md:col-span-2">
                        <h3 className="text-lg font-semibold border-b border-border pb-2">Custom Menu Items</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-card/50 p-4 rounded-lg border border-border">
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Label</label>
                                <Input
                                    value={newMenuItem.label}
                                    onChange={(e) => setNewMenuItem({ ...newMenuItem, label: e.target.value })}
                                    placeholder="e.g. Help Center"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">URL</label>
                                <Input
                                    value={newMenuItem.href}
                                    onChange={(e) => setNewMenuItem({ ...newMenuItem, href: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                            <Button onClick={addMenuItem} variant="secondary">Add Item</Button>
                        </div>

                        <div className="space-y-2">
                            {settings.menu_items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg border border-border">
                                    <div className="flex items-center gap-4">
                                        <span className="font-medium">{item.label}</span>
                                        <span className="text-xs text-muted-foreground font-mono">{item.href}</span>
                                    </div>
                                    <button onClick={() => removeMenuItem(index)} className="text-muted-foreground hover:text-destructive">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {settings.menu_items.length === 0 && (
                                <p className="text-sm text-muted-foreground italic">No custom menu items.</p>
                            )}
                        </div>
                    </Card>

                    {/* Access Policies (Legacy) */}
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
