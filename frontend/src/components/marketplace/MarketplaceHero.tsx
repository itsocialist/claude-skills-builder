'use client';

import { Search, Sparkles } from 'lucide-react';

interface MarketplaceHeroProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

export function MarketplaceHero({ searchQuery, onSearchChange }: MarketplaceHeroProps) {
    return (
        <div className="bg-gradient-to-b from-card to-background py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Tagline */}
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-primary uppercase tracking-wider">
                        Skill Marketplace
                    </span>
                </div>

                {/* Headline */}
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                    Give Claude New Capabilities
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Discover community-built skills to enhance your Claude experience.
                    Install with one click and start using immediately.
                </p>

                {/* Search Bar - Command Bar Style */}
                <div className="relative max-w-xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search for skills..."
                        autoFocus
                        className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-lg"
                    />
                </div>
            </div>
        </div>
    );
}
