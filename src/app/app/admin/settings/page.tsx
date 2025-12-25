'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/layout/Shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/auth/AuthProvider';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];

interface SiteSettings {
    site_name: string;
    max_skills_per_user: number;
    require_email_confirmation: boolean;
    allowed_email_domains: string;
}

export default function AdminSettingsPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [settings, setSettings] = useState<SiteSettings>({
        site_name: 'ClaudeSkillsFacet',
        max_skills_per_user: 100,
        require_email_confirmation: true,
        allowed_email_domains: '',
    });

    useEffect(() => {
        if (!loading && user) {
            const adminCheck = ADMIN_EMAILS.includes(user.email || '');
            setIsAdmin(adminCheck);

            if (!adminCheck) {
                router.push('/app');
            }
        } else if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    const handleSave = async () => {
        setIsSaving(true);
        setSaveSuccess(false);

        // Would call updateSiteSetting for each setting
        await new Promise(resolve => setTimeout(resolve, 500));

        setIsSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
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
            <div className="max-w-2xl mx-auto">
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
                        <p className="text-muted-foreground">Configure platform-wide settings</p>
                    </div>
                </div>

                {/* Settings Form */}
                <Card className="p-6 space-y-6">
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
                        <p className="text-xs text-muted-foreground mt-1">
                            Displayed in the header and emails
                        </p>
                    </div>

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
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Limit how many skills a user can create
                        </p>
                    </div>

                    {/* Email Confirmation */}
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-medium text-foreground">
                                Require Email Confirmation
                            </label>
                            <p className="text-xs text-muted-foreground">
                                Users must verify email before accessing features
                            </p>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, require_email_confirmation: !settings.require_email_confirmation })}
                            className={`relative w-12 h-6 rounded-full transition-colors ${settings.require_email_confirmation ? 'bg-primary' : 'bg-muted'
                                }`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.require_email_confirmation ? 'translate-x-7' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>

                    {/* Allowed Domains */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Allowed Email Domains
                        </label>
                        <Input
                            value={settings.allowed_email_domains}
                            onChange={(e) => setSettings({ ...settings, allowed_email_domains: e.target.value })}
                            placeholder="Leave empty for all domains, or: company.com, partner.org"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Restrict signups to specific domains (comma-separated)
                        </p>
                    </div>

                    {/* Save Button */}
                    <div className="flex items-center gap-4 pt-4 border-t border-border">
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            Save Settings
                        </Button>
                        {saveSuccess && (
                            <span className="text-sm text-green-500">Settings saved!</span>
                        )}
                    </div>
                </Card>
            </div>
        </Shell>
    );
}
