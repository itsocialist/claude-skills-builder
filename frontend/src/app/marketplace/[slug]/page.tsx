'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Download,
    BadgeCheck,
    ArrowLeft,
    Copy,
    Loader2,
    Share2,
    Calendar,
    User
} from 'lucide-react';
import Link from 'next/link';
import {
    TwitterShareButton,
    LinkedinShareButton,
    TwitterIcon,
    LinkedinIcon
} from 'react-share';

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
    skill_id: string;
}

interface SkillDetails {
    triggers: string[];
    instructions: string;
}

export default function SkillDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const slug = params.slug as string;

    const [listing, setListing] = useState<MarketplaceListing | null>(null);
    const [skillDetails, setSkillDetails] = useState<SkillDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [installing, setInstalling] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);

    useEffect(() => {
        fetchListing();
    }, [slug]);

    const fetchListing = async () => {
        if (!supabase) {
            setLoading(false);
            return;
        }
        const { data: listingData } = await supabase
            .from('market_listings')
            .select('*')
            .eq('slug', slug)
            .eq('listing_status', 'active')
            .single();

        if (listingData) {
            setListing(listingData);
            // Fetch skill details for triggers/instructions preview
            const { data: skillData } = await supabase
                .from('user_skills')
                .select('triggers, instructions')
                .eq('id', listingData.skill_id)
                .single();
            if (skillData) {
                setSkillDetails(skillData);
            }
        }
        setLoading(false);
    };

    const handleInstall = async () => {
        if (!user) {
            // Redirect to sign in with return URL
            router.push(`/app?returnTo=/marketplace/${slug}`);
            return;
        }

        setInstalling(true);
        if (!supabase) {
            alert('Database not configured');
            setInstalling(false);
            return;
        }

        const { data, error } = await supabase.rpc('install_skill_from_marketplace', {
            listing_slug: slug
        });

        if (!error && data) {
            router.push(`/app/builder?edit=${data}`);
        } else {
            console.error('Install error:', error);
            alert('Failed to install skill. Please try again.');
        }
        setInstalling(false);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setShowShareMenu(false);
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-foreground mb-4">Skill Not Found</h1>
                <p className="text-muted-foreground mb-8">This skill may have been removed or is no longer public.</p>
                <Link href="/marketplace">
                    <Button>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Marketplace
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Link */}
            <Link
                href="/marketplace"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Marketplace
            </Link>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-foreground">{listing.title}</h1>
                        {listing.is_verified && (
                            <BadgeCheck className="w-6 h-6 text-primary" />
                        )}
                    </div>
                    {listing.category && (
                        <span className="inline-block px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                            {listing.category}
                        </span>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    {/* Share Menu */}
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setShowShareMenu(!showShareMenu)}
                        >
                            <Share2 className="w-4 h-4" />
                        </Button>
                        {showShareMenu && (
                            <div className="absolute right-0 mt-2 p-2 bg-card border border-border rounded-lg shadow-lg z-10 flex items-center gap-2">
                                <TwitterShareButton url={shareUrl} title={listing.title}>
                                    <TwitterIcon size={32} round />
                                </TwitterShareButton>
                                <LinkedinShareButton url={shareUrl} title={listing.title}>
                                    <LinkedinIcon size={32} round />
                                </LinkedinShareButton>
                                <button
                                    onClick={handleCopyLink}
                                    className="p-2 hover:bg-muted rounded-full transition-colors"
                                    title="Copy link"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Install Button */}
                    <Button onClick={handleInstall} disabled={installing} className="gap-2">
                        {installing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Download className="w-4 h-4" />
                        )}
                        {user ? 'Install to Library' : 'Sign in to Install'}
                    </Button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
                <div className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>{listing.install_count} installs</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Added {new Date(listing.created_at).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Description */}
            <Card className="p-6 mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-3">Description</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">
                    {listing.description || 'No description provided.'}
                </p>
            </Card>

            {/* Triggers */}
            {skillDetails?.triggers && skillDetails.triggers.length > 0 && (
                <Card className="p-6 mb-6">
                    <h2 className="text-lg font-semibold text-foreground mb-3">Example Prompts</h2>
                    <div className="flex flex-wrap gap-2">
                        {skillDetails.triggers.map((trigger, i) => (
                            <span
                                key={i}
                                className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm"
                            >
                                {trigger}
                            </span>
                        ))}
                    </div>
                </Card>
            )}

            {/* Instructions Preview */}
            {skillDetails?.instructions && (
                <Card className="p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-3">Instructions Preview</h2>
                    <div className="bg-muted rounded-lg p-4 max-h-64 overflow-y-auto">
                        <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
                            {skillDetails.instructions.slice(0, 500)}
                            {skillDetails.instructions.length > 500 && '...'}
                        </pre>
                    </div>
                </Card>
            )}
        </div>
    );
}
