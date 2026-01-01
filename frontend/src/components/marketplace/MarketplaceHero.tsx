'use client';

import { Search, Sparkles } from 'lucide-react';

interface MarketplaceHeroProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    categories: string[];
    selectedCategory: string | null;
    onCategoryChange: (category: string | null) => void;
}

export function MarketplaceHero({
    searchQuery,
    onSearchChange,
    categories,
    selectedCategory,
    onCategoryChange
}: MarketplaceHeroProps) {
    return (
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50 transition-all duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col items-center gap-6">
                    {/* Top Row: Title & Headline */}
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Give Claude New Capabilities
                        </h1>
                    </div>

                    {/* Search Bar - Centered & Compact */}
                    <div className="relative w-full max-w-lg">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search for skills..."
                            className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all"
                        />
                    </div>

                    {/* Bottom Row: Categories */}
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        <button
                            onClick={() => onCategoryChange(null)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${!selectedCategory
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => onCategoryChange(cat)}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${selectedCategory === cat
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
