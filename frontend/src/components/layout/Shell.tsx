'use client';

import { ReactNode, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Library, LogIn, Building2, Menu, PanelRightOpen, Wand2, LayoutTemplate, Package, Hammer, Search, Compass, GitBranch, Layers } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useSiteSettings } from '@/lib/contexts/SiteSettingsContext';
import { UserMenu } from '@/components/auth/UserMenu';
import { LoginModal } from '@/components/auth/LoginModal';
import { RecentSkills } from '@/components/library/RecentSkills';
import { Button } from '@/components/ui/button';
import { DEFAULT_FLAGS, FlagKey } from '@/lib/flags';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

interface ShellProps {
    children: ReactNode;
    inspector?: ReactNode;
    title?: string;
    onTitleChange?: (newTitle: string) => void;
    validation?: {
        status: 'valid' | 'warning' | 'error';
        message: string;
    };
}

export function Shell({ children, inspector, title, onTitleChange, validation }: ShellProps) {
    const { user, isConfigured } = useAuth();
    const { settings } = useSiteSettings();
    const pathname = usePathname();
    const [isEditing, setIsEditing] = useState(false);
    // Calculate Admin Status - Memoized
    const isAdmin = useMemo(() => {
        if (!user?.email) return false;
        const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').toLowerCase().split(',').map(e => e.trim());
        return adminEmails.includes(user.email.toLowerCase());
    }, [user?.email]);

    const [editedTitle, setEditedTitle] = useState(title || 'New Skill');
    const [saveStatus, setSaveStatus] = useState<'saved' | 'editing'>('saved');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [mobileInspectorOpen, setMobileInspectorOpen] = useState(false);

    // Feature Flag Check Helper
    const shouldShow = (key: FlagKey): boolean => {
        const flagState = settings.feature_flags?.[key] || DEFAULT_FLAGS[key];
        if (flagState === 'DISABLED') return false;
        if (flagState === 'ADMIN_ONLY') return isAdmin;
        return true;
    };

    useEffect(() => {
        setEditedTitle(title || 'New Skill');
    }, [title]);

    const handleTitleSubmit = () => {
        setIsEditing(false);
        if (onTitleChange && editedTitle !== title) {
            onTitleChange(editedTitle);
        }
        setSaveStatus('saved');
    };

    const handleTitleChange = (value: string) => {
        setEditedTitle(value);
        setSaveStatus('editing');
    };

    const statusColors = {
        valid: 'bg-green-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500',
    };

    const statusMessages = {
        valid: 'Ready to export',
        warning: 'Has warnings',
        error: 'Has errors',
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Unified Header Row - Transparent with blur */}
            <header className="h-14 bg-background/80 backdrop-blur-md border-b border-border/50 flex items-stretch sticky top-0 z-20">
                {/* Mobile Menu Trigger */}
                <div className="lg:hidden flex items-center px-4 border-r border-border">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-64">
                            <div className="h-14 flex items-center px-6 border-b border-border">
                                <Link href="/app">
                                    <Image
                                        src="/branding/logo-full-light.svg"
                                        alt="GetClaudeSkills"
                                        width={140}
                                        height={28}
                                        className="dark:hidden"
                                    />
                                    <Image
                                        src="/branding/logo-full-dark.svg"
                                        alt="GetClaudeSkills"
                                        width={140}
                                        height={28}
                                        className="hidden dark:block"
                                    />
                                </Link>
                            </div>
                            <nav className="p-4 space-y-1">
                                {shouldShow('feature_marketplace') && (
                                    <Link href="/marketplace" className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${pathname?.startsWith('/marketplace') ? 'text-primary-500 bg-primary-500/10' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                                        <Compass className="w-4 h-4" />
                                        Discover
                                    </Link>
                                )}
                                {shouldShow('feature_generations') && (
                                    <Link href="/app/wizard" className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${pathname === '/app/wizard' ? 'text-primary-500 bg-primary-500/10' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                                        <Wand2 className="w-4 h-4" />
                                        Quick Start
                                    </Link>
                                )}
                                {shouldShow('feature_builder') && (
                                    <Link href="/app/builder" className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${pathname === '/app/builder' ? 'text-primary-500 bg-primary-500/10' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                                        <Hammer className="w-4 h-4" />
                                        Skill Builder
                                    </Link>
                                )}
                                {shouldShow('feature_templates') && (
                                    <Link href="/app/templates" className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${pathname?.startsWith('/app/templates') ? 'text-primary-500 bg-primary-500/10' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                                        <LayoutTemplate className="w-4 h-4" />
                                        Templates
                                    </Link>
                                )}
                                {/* Bundles - Public page */}
                                <Link href="/bundles" className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${pathname === '/bundles' ? 'text-primary-500 bg-primary-500/10' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                                    <Layers className="w-4 h-4" />
                                    Bundles
                                </Link>
                                {shouldShow('feature_packages') && (
                                    <Link href="/app/packages" className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${pathname?.startsWith('/app/packages') ? 'text-primary-500 bg-primary-500/10' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                                        <Package className="w-4 h-4" />
                                        Packages
                                    </Link>
                                )}
                                {shouldShow('feature_inspector') && (
                                    <Link href="/app/inspector" className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${pathname === '/app/inspector' ? 'text-primary-500 bg-primary-500/10' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                                        <Search className="w-4 h-4" />
                                        Inspector
                                    </Link>
                                )}
                                {user && shouldShow('feature_organization') && (
                                    <Link href="/app/org" className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded-md">
                                        <span className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4" />
                                            Organization
                                        </span>
                                    </Link>
                                )}
                                {user && shouldShow('feature_myskills') && (
                                    <Link href="/app/library" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded-md">
                                        <Library className="w-4 h-4" />
                                        My Skills
                                    </Link>
                                )}
                                {/* Dynamic Custom Menu Items (Mobile) */}
                                {settings.menu_items.map((item, i) => (
                                    <Link key={`mobile-${i}`} href={item.href} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
                                        <span className="w-4 h-4" /> {/* Spacer */}
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Sidebar Header (Desktop) */}
                <div className="hidden lg:flex w-64 items-center px-6 border-r border-border flex-shrink-0">
                    <Link href="/app">
                        <Image
                            src="/branding/logo-full-light.svg"
                            alt="GetClaudeSkills"
                            width={160}
                            height={32}
                            className="dark:hidden"
                        />
                        <Image
                            src="/branding/logo-full-dark.svg"
                            alt="GetClaudeSkills"
                            width={160}
                            height={32}
                            className="hidden dark:block"
                        />
                    </Link>
                </div>

                {/* Main Header */}
                <div className="flex-1 flex items-center justify-between px-6">
                    {/* Title Section - Display only */}
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg font-medium text-foreground truncate max-w-[150px] md:max-w-md">
                            {title || 'Skill Builder'}
                        </h1>
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center gap-3">
                        {isConfigured && !user ? (
                            <button
                                onClick={() => setShowLoginModal(true)}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                            >
                                <LogIn className="w-4 h-4" />
                                <span className="hidden sm:inline">Sign In</span>
                            </button>
                        ) : (
                            <UserMenu />
                        )}
                    </div>
                </div>

                {/* Inspector Header */}
                {inspector && (
                    <div className="hidden lg:flex w-[300px] items-center px-6 border-l border-border flex-shrink-0">
                        <span className="text-lg font-medium text-foreground">Inspector</span>
                    </div>
                )}
            </header>

            {/* Body Row */}
            <div className="flex flex-1 pb-10">
                {/* Sidebar Navigation (Desktop) */}
                <aside className="hidden lg:block w-64 bg-card border-r border-border flex-shrink-0">
                    <nav className="p-4 space-y-1">
                        {shouldShow('feature_marketplace') && (
                            <Link href="/marketplace" className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${pathname?.startsWith('/marketplace') ? 'text-primary-500 bg-primary-500/10' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                                <Compass className="w-4 h-4" />
                                Discover
                            </Link>
                        )}
                        {shouldShow('feature_generations') && (
                            <Link href="/app/wizard" className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${pathname === '/app/wizard' ? 'text-primary-500 bg-primary-500/10' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                                <Wand2 className="w-4 h-4" />
                                Quick Start
                            </Link>
                        )}
                        {shouldShow('feature_builder') && (
                            <Link href="/app/builder" className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${pathname === '/app/builder' ? 'text-primary-500 bg-primary-500/10' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                                <Hammer className="w-4 h-4" />
                                Skill Builder
                            </Link>
                        )}
                        {shouldShow('feature_canvas') && (
                            <Link href="/app/canvas" className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${pathname === '/app/canvas' ? 'text-primary-500 bg-primary-500/10' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                                <GitBranch className="w-4 h-4" />
                                Visual Canvas
                            </Link>
                        )}
                        {shouldShow('feature_templates') && (
                            <Link href="/app/templates" className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${pathname?.startsWith('/app/templates') ? 'text-primary-500 bg-primary-500/10' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                                <LayoutTemplate className="w-4 h-4" />
                                Templates
                            </Link>
                        )}
                        {/* Bundles - Public page */}
                        <Link href="/bundles" className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${pathname === '/bundles' ? 'text-primary-500 bg-primary-500/10' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                            <Layers className="w-4 h-4" />
                            Bundles
                        </Link>
                        {shouldShow('feature_packages') && (
                            <Link href="/app/packages" className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${pathname?.startsWith('/app/packages') ? 'text-primary-500 bg-primary-500/10' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                                <Package className="w-4 h-4" />
                                Packages
                            </Link>
                        )}
                        {shouldShow('feature_inspector') && (
                            <Link href="/app/inspector" className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${pathname === '/app/inspector' ? 'text-primary-500 bg-primary-500/10' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                                <Search className="w-4 h-4" />
                                Inspector
                            </Link>
                        )}
                        {user && shouldShow('feature_organization') && (
                            <Link href="/app/org" className={`block px-4 py-2 text-sm font-medium rounded-md ${pathname === '/app/org' ? 'text-primary-500 bg-primary-500/10' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                                <span className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    Organization
                                </span>
                            </Link>
                        )}
                        {user && shouldShow('feature_myskills') && (
                            <Link href="/app/library" className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${pathname === '/app/library' ? 'text-primary-500 bg-primary-500/10' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                                <Library className="w-4 h-4" />
                                My Skills
                            </Link>
                        )}
                        {/* Dynamic Custom Menu Items (Desktop) */}
                        {settings.menu_items.map((item, i) => (
                            <Link key={`desktop-${i}`} href={item.href} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
                                <span className="w-4 h-4" /> {/* Spacer */}
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Recent Skills (authenticated users) */}
                    <RecentSkills />
                </aside>

                {/* Main Content - Centered when no inspector on desktop */}
                <main className={`flex-1 min-w-0 overflow-y-auto bg-background relative ${inspector ? '' : 'lg:flex lg:justify-center'}`}>
                    <div className={`p-4 md:p-8 ${inspector ? '' : 'lg:max-w-4xl lg:w-full'}`}>
                        {children}
                    </div>
                </main>

                {/* Inspector Panel */}
                {inspector && (
                    <aside className="hidden lg:block w-[300px] bg-card border-l border-border flex-shrink-0 h-[calc(100vh-96px)] overflow-hidden">
                        <div className="h-full">
                            {inspector}
                        </div>
                    </aside>
                )}

                {/* Mobile Inspector Sheet */}
                {inspector && (
                    <Sheet open={mobileInspectorOpen} onOpenChange={setMobileInspectorOpen}>
                        <SheetContent side="bottom" className="h-[70vh] p-0">
                            <div className="h-full overflow-y-auto">
                                {inspector}
                            </div>
                        </SheetContent>
                    </Sheet>
                )}
            </div>

            {/* Mobile Inspector Floating Button */}
            {inspector && (
                <button
                    onClick={() => setMobileInspectorOpen(true)}
                    className="lg:hidden fixed bottom-14 right-4 z-30 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                    aria-label="Open Inspector"
                >
                    <PanelRightOpen className="w-5 h-5" />
                </button>
            )}

            {/* Fixed Bottom Status Bar */}
            <footer className="fixed bottom-0 left-0 right-0 h-10 bg-card border-t border-border flex items-center px-4 md:px-6 z-20">
                <div className="flex items-center gap-4 lg:ml-64">
                    {/* Validation Status */}
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusColors[validation?.status || 'valid']}`}></div>
                        <span className="text-sm text-muted-foreground">
                            {validation?.message || statusMessages[validation?.status || 'valid']}
                        </span>
                    </div>

                    {/* Save Status - only on builder */}
                    {inspector && (
                        <>
                            <div className="w-px h-4 bg-border"></div>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${saveStatus === 'saved' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                <span className="text-sm text-muted-foreground">
                                    {saveStatus === 'saved' ? 'Saved' : 'Editing...'}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </footer>

            {/* Login Modal */}
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </div>
    );
}

