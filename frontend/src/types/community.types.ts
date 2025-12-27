
export interface Profile {
    id: string; // References auth.users(id)
    username: string;
    bio?: string;
    website?: string;
    twitter?: string;
    github?: string;
    avatar_url?: string; // From existing profiles table
    full_name?: string; // From existing profiles table
    created_at: string;
    updated_at: string;
}

export interface SkillReview {
    id: string;
    skill_id: string;
    user_id: string;
    rating: number; // 1-5
    comment?: string | null;
    created_at: string;
    updated_at: string;

    // Optional expanded user profile for UI display
    user?: {
        username: string;
        avatar_url?: string;
        full_name?: string;
    };
}

export interface CreateReviewDTO {
    skill_id: string;
    rating: number;
    comment?: string;
}

export interface UpdateReviewDTO {
    rating?: number;
    comment?: string;
}
