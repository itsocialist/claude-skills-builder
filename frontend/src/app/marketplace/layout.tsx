'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Search, Sparkles } from 'lucide-react';
import { useSiteSettings } from '@/lib/contexts/SiteSettingsContext';

interface MarketplaceLayoutProps {
    children: ReactNode;
}

export default function MarketplaceLayout({ children }: MarketplaceLayoutProps) {
    const { settings } = useSiteSettings();

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-primary" />
                            <span className="font-bold text-xl text-foreground">
                                {settings.site_name}
                            </span>
                        </Link>

                        {/* Search (Desktop) */}
                        <div className="hidden md:flex flex-1 max-w-lg mx-8">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search skills..."
                                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <Link
                                href="/app"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Build Skills
                            </Link>
                            <Link
                                href="/app/library"
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                            >
                                My Skills
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-border py-8 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>© 2025 {settings.site_name}</span>
                        <div className="flex gap-4">
                            <Link href="/app" className="hover:text-foreground transition-colors">
                                Builder
                            </Link>
                            <Link href="/app/templates" className="hover:text-foreground transition-colors">
                                Templates
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
