
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
    featured: boolean; // Mapped from DB "featured"

    // Optional joined fields (for UI)
    average_rating?: number;
    review_count?: number;

    // Preview fields
    preview_image_url?: string | null;
    example_output?: string | null;

    // Optional joined creator info
    creator?: {
        username: string | null;
        full_name: string | null;
        avatar_url: string | null;
    };
}
