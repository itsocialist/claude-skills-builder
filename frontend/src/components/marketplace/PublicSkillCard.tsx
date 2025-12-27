'use client';

import Link from 'next/link';
import { Download, BadgeCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MarketplaceListing {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    category: string | null;
    is_verified: boolean;
    is_featured: boolean;
    install_count: number;
    created_at: string;
    creator_id: string;
}

interface PublicSkillCardProps {
    listing: MarketplaceListing;
}

export function PublicSkillCard({ listing }: PublicSkillCardProps) {
    return (
        <Link href={`/marketplace/${listing.slug}`}>
            <Card className="p-5 h-full hover:border-primary/50 transition-colors cursor-pointer group">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                {listing.title}
                            </h3>
                            {listing.is_verified && (
                                <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />
                            )}
                        </div>
                        {listing.category && (
                            <span className="text-xs text-muted-foreground">
                                {listing.category}
                            </span>
                        )}
                    </div>
                </div>

                {/* Description - 2 lines max */}
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {listing.description || 'No description provided.'}
                </p>

                {/* Stats - Icons only */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Download className="w-4 h-4" />
                        <span className="text-xs">{listing.install_count}</span>
                    </div>
                    {listing.is_featured && (
                        <span className="text-xs font-medium text-primary">Featured</span>
                    )}
                </div>
            </Card>
        </Link>
    );
}
