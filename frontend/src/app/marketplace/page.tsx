'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Shell } from '@/components/layout/Shell';
import { bundles } from '@/lib/constants/bundles';
import { MarketplaceHero } from '@/components/marketplace/MarketplaceHero';
import { PublicSkillCard } from '@/components/marketplace/PublicSkillCard';
import { Card } from '@/components/ui/card';
import { Loader2, Layers, Star, Search, FileText, BarChart3, Rocket, ArrowRight } from 'lucide-react';
import { MarketplaceListing } from '@/types/marketplace.types';

// Map icon strings to components for rendering
const iconMap = {
    Search: <Search className="w-8 h-8" />,
    FileText: <FileText className="w-8 h-8" />,
    BarChart3: <BarChart3 className="w-8 h-8" />,
    Rocket: <Rocket className="w-8 h-8" />
};

export default function MarketplacePage() {
    const [listings, setListings] = useState<MarketplaceListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        if (!supabase) {
            setLoading(false);
            return;
        }
        const { data, error } = await supabase
            .from('market_listings')
            .select('*')
            .eq('listing_status', 'active')
            .order('install_count', { ascending: false });

        if (!error && data) {
            setListings(data);
        }
        setLoading(false);
    };

    // Get all unique categories from both listings and bundles
    const categories = useMemo(() => {
        const skillCategories = listings.map(l => l.category).filter(Boolean);
        const bundleCategories = bundles.map(b => b.category).filter(Boolean);
        return Array.from(new Set([...skillCategories, ...bundleCategories])) as string[];
    }, [listings]);

    // Filter listings
    const filteredListings = useMemo(() => {
        return listings.filter(listing => {
            const matchesSearch = !searchQuery ||
                listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                listing.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = !selectedCategory || listing.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [listings, searchQuery, selectedCategory]);

    // Filter bundles by category
    const filteredBundles = useMemo(() => {
        if (!selectedCategory) return bundles;
        return bundles.filter(b => b.category === selectedCategory);
    }, [selectedCategory]);

    // Featured skills (first 3 featured or first 3 overall if none featured)
    const featuredSkills = useMemo(() => {
        const featured = filteredListings.filter(l => l.featured);
        return featured.length > 0 ? featured.slice(0, 3) : filteredListings.slice(0, 3);
    }, [filteredListings]);

    // Featured bundles (first 3 matching filter)
    const featuredBundles = useMemo(() => {
        return filteredBundles.slice(0, 3);
    }, [filteredBundles]);

    return (
        <Shell title="Skill Marketplace" fullWidth>
            <div className="min-h-full">
                {/* Hero Section */}
                <MarketplaceHero
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                {/* Category Filters - Immediately under hero */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${!selectedCategory
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${selectedCategory === cat
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Featured Bundles Section */}
                {featuredBundles.length > 0 && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Layers className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Featured Bundles</h2>
                            </div>
                            <Link href="/bundles" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredBundles.map(bundle => (
                                <Link key={bundle.id} href={`/bundles/${bundle.id}`} className="block group">
                                    <Card className="h-full p-6 border-border group-hover:border-primary/50 transition-all duration-300 bg-card hover:bg-muted/50 hover:shadow-lg">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-2 rounded-lg bg-gradient-to-br ${bundle.color} text-foreground`}>
                                                {/* @ts-ignore - Icon map is safe here */}
                                                {iconMap[bundle.iconName]}
                                            </div>
                                            <div className="flex flex-col items-center justify-center bg-muted rounded-md px-3 py-1.5 min-w-[3.5rem]">
                                                <span className="text-lg font-bold text-foreground leading-none">{bundle.skills.length}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">skills</span>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{bundle.name}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{bundle.tagline}</p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                        <div className="h-px bg-border my-8" />
                    </div>
                )}

                {/* Featured Skills Section */}
                {!loading && featuredSkills.length > 0 && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Star className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Featured Skills
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredSkills.map(listing => (
                                <PublicSkillCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                        <div className="h-px bg-border my-8" />
                    </div>
                )}

                {/* All Skills Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-foreground">
                            {searchQuery ? 'Search Results' : 'All Skills'}
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : filteredListings.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-muted-foreground">
                                {searchQuery
                                    ? 'No skills found matching your search.'
                                    : 'No skills available yet. Be the first to publish!'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredListings.map(listing => (
                                <PublicSkillCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Shell>
    );
}
