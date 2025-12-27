'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/StarRating';
import { ReviewModal } from '@/components/marketplace/ReviewModal';
import { MarketplaceListing } from '@/types/marketplace.types';
import { Profile, SkillReview } from '@/types/community.types';
import { getProfileByUsername } from '@/lib/profiles';
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
    const [creatorProfile, setCreatorProfile] = useState<Profile | null>(null);
    const [skillDetails, setSkillDetails] = useState<SkillDetails | null>(null);
    const [reviews, setReviews] = useState<SkillReview[]>([]);
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
            setListing(listingData as MarketplaceListing);

            // Fetch skill details
            const { data: skillData } = await supabase
                .from('user_skills')
                .select('triggers, instructions')
                .eq('id', listingData.skill_id)
                .single();
            if (skillData) setSkillDetails(skillData);

            // Fetch creator profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', listingData.creator_id)
                .single();
            if (profileData) setCreatorProfile(profileData);

            fetchReviews(listingData.id);
        }
        setLoading(false);
    };

    const fetchReviews = async (listingId: string) => {
        const { data } = await supabase
            .from('skill_reviews')
            .select(`
                *,
                profiles:user_id (
                    username,
                    avatar_url
                )
            `)
            .eq('skill_id', listingId)
            .order('created_at', { ascending: false });

        if (data) {
            // Transform to match SkillReview type structure with nested user
            const shapedReviews = data.map(r => ({
                ...r,
                user: Array.isArray(r.profiles) ? r.profiles[0] : r.profiles
            }));
            setReviews(shapedReviews as unknown as SkillReview[]);
        }
    };

    const handleInstall = async () => {
        if (!user) {
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
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                        {listing.category && (
                            <span className="inline-block px-3 py-1 bg-muted rounded-full text-foreground/80 font-medium">
                                {listing.category}
                            </span>
                        )}
                        {creatorProfile?.username && (
                            <Link href={`/creator/${creatorProfile.username}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                                <span>by @{creatorProfile.username}</span>
                            </Link>
                        )}
                    </div>
                    {listing.average_rating !== undefined && listing.average_rating > 0 && (
                        <div className="flex items-center gap-2 mb-2">
                            <StarRating rating={listing.average_rating} size={18} readOnly />
                            <span className="text-sm text-muted-foreground font-medium">
                                {listing.average_rating} ({listing.review_count || 0} reviews)
                            </span>
                        </div>
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
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
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
                <Card className="p-6 mb-6">
                    <h2 className="text-lg font-semibold text-foreground mb-3">Instructions Preview</h2>
                    <div className="bg-muted rounded-lg p-4 max-h-64 overflow-y-auto">
                        <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
                            {skillDetails.instructions.slice(0, 500)}
                            {skillDetails.instructions.length > 500 && '...'}
                        </pre>
                    </div>
                </Card>
            )}

            {/* Reviews Section */}
            <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Reviews</h2>
                    {user && <ReviewModal skillId={listing.id} onReviewSubmitted={() => fetchListing()} />}
                </div>

                {reviews.length === 0 ? (
                    <Card className="p-8 text-center text-muted-foreground bg-muted/20 border-dashed">
                        No reviews yet. Be the first to share your experience!
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <Card key={review.id} className="p-6">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold overflow-hidden">
                                            {review.user?.avatar_url ? (
                                                <img src={review.user.avatar_url} alt={review.user.username} className="w-full h-full object-cover" />
                                            ) : (
                                                review.user?.username?.[0]?.toUpperCase() || '?'
                                            )}
                                        </div>
                                        <div>
                                            <span className="font-semibold text-sm">@{review.user?.username || 'user'}</span>
                                            <div className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <StarRating rating={review.rating} size={14} readOnly />
                                </div>
                                {review.comment && (
                                    <p className="text-sm text-foreground/90 mt-2">{review.comment}</p>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

