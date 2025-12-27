
export interface MarketplaceListing {
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
    listing_status: 'active' | 'archived' | 'pending';

    // Optional joined fields (for UI)
    average_rating?: number;
    review_count?: number;

    // Optional joined creator info
    creator?: {
        username: string | null;
        full_name: string | null;
        avatar_url: string | null;
    };
}
