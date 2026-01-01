'use client';

import Link from 'next/link';
import { Download, BadgeCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { MarketplaceListing } from '@/types/marketplace.types';
import { StarRating } from '@/components/ui/StarRating';

interface PublicSkillCardProps {
    listing: MarketplaceListing;
}

export function PublicSkillCard({ listing }: PublicSkillCardProps) {
    return (
        <Link href={`/marketplace/${listing.slug}`}>
            <Card className="p-0 h-full hover:border-primary/50 transition-colors cursor-pointer group flex flex-col overflow-hidden">
                {/* Preview Image - Floating Paper Effect */}
                <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
                    {listing.preview_image_url ? (
                        <div
                            className="absolute -bottom-4 -right-4 w-[95%] h-[95%] rounded-md transition-all duration-300 group-hover:-translate-y-1"
                            style={{
                                transform: 'rotate(-3deg)',
                                boxShadow: '-8px 8px 20px rgba(0, 0, 0, 0.25), -2px 2px 6px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <img
                                src={listing.preview_image_url}
                                alt={`Preview of ${listing.title}`}
                                className="w-full h-full object-cover object-top rounded-md ring-1 ring-black/5"
                            />
                        </div>
                    ) : (
                        <div
                            className="absolute -bottom-4 -right-4 w-[95%] h-[95%] bg-card rounded-md shadow-xl flex items-center justify-center ring-1 ring-border"
                            style={{
                                transform: 'rotate(-3deg)',
                            }}
                        >
                            <span className="text-4xl opacity-30">📄</span>
                        </div>
                    )}
                </div>

                <div className="p-5 flex flex-col flex-1">
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
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                        {listing.description || 'No description provided.'}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <Download className="w-4 h-4" />
                                <span className="text-xs">{listing.install_count}</span>
                            </div>
                            {listing.average_rating !== undefined && listing.average_rating > 0 && (
                                <div className="flex items-center gap-1">
                                    <StarRating rating={listing.average_rating} size={12} readOnly />
                                    <span className="text-xs text-muted-foreground">({listing.review_count || 0})</span>
                                </div>
                            )}
                        </div>

                        {listing.featured && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 rounded-full">
                                <BadgeCheck className="w-3 h-3 text-primary" />
                                <span className="text-[10px] font-semibold text-primary">Staff Pick</span>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </Link>
    );
}

