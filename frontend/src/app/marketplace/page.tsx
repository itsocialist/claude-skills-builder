'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MarketplaceHero } from '@/components/marketplace/MarketplaceHero';
import { PublicSkillCard } from '@/components/marketplace/PublicSkillCard';
import { Loader2, BadgeCheck } from 'lucide-react';

import { MarketplaceListing } from '@/types/marketplace.types';

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

    const filteredListings = listings.filter(listing => {
        const matchesSearch = !searchQuery ||
            listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || listing.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = Array.from(new Set(listings.map(l => l.category).filter(Boolean))) as string[];

    return (
        <div>
            {/* Hero Section */}
            <MarketplaceHero
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            {/* Category Filters */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!selectedCategory
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
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Featured Section */}
            {!searchQuery && !selectedCategory && listings.some(l => l.featured) && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <BadgeCheck className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Staff Picks
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.filter(l => l.featured).map(listing => (
                            <PublicSkillCard key={listing.id} listing={listing} />
                        ))}
                    </div>
                    <div className="h-px bg-border my-8" />
                </div>
            )}

            {/* Skills Grid */}
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
    );
}
