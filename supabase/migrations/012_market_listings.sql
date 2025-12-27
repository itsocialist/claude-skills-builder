-- Migration: 012_market_listings.sql
-- Description: Create market_listings table for public skill marketplace
-- Sprint: 13 - Marketplace MVP

-- Create market_listings table
CREATE TABLE IF NOT EXISTS public.market_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID NOT NULL REFERENCES public.user_skills(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    listing_status TEXT DEFAULT 'active' CHECK (listing_status IN ('active', 'archived', 'pending')),
    install_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_market_listings_slug ON public.market_listings(slug);

-- Create index on creator_id for user's listings
CREATE INDEX IF NOT EXISTS idx_market_listings_creator ON public.market_listings(creator_id);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_market_listings_category ON public.market_listings(category);

-- Create index on listing_status for active listings
CREATE INDEX IF NOT EXISTS idx_market_listings_status ON public.market_listings(listing_status);

-- Enable RLS
ALTER TABLE public.market_listings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can read active listings (public marketplace)
CREATE POLICY "Public can view active listings"
    ON public.market_listings
    FOR SELECT
    USING (listing_status = 'active');

-- RLS Policy: Creators can view all their own listings (including archived)
CREATE POLICY "Creators can view own listings"
    ON public.market_listings
    FOR SELECT
    TO authenticated
    USING (auth.uid() = creator_id);

-- RLS Policy: Only creators can insert their own listings
CREATE POLICY "Creators can insert listings"
    ON public.market_listings
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = creator_id);

-- RLS Policy: Only creators can update their own listings
CREATE POLICY "Creators can update own listings"
    ON public.market_listings
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = creator_id)
    WITH CHECK (auth.uid() = creator_id);

-- RLS Policy: Only creators can delete their own listings
CREATE POLICY "Creators can delete own listings"
    ON public.market_listings
    FOR DELETE
    TO authenticated
    USING (auth.uid() = creator_id);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_market_listings_updated_at ON public.market_listings;
CREATE TRIGGER update_market_listings_updated_at
    BEFORE UPDATE ON public.market_listings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create RPC function for One-Click Install
CREATE OR REPLACE FUNCTION public.install_skill_from_marketplace(listing_slug TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_listing RECORD;
    v_source_skill RECORD;
    v_new_skill_id UUID;
BEGIN
    -- Get the marketplace listing
    SELECT * INTO v_listing
    FROM public.market_listings
    WHERE slug = listing_slug AND listing_status = 'active';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Listing not found or not active';
    END IF;
    
    -- Get the source skill
    SELECT * INTO v_source_skill
    FROM public.user_skills
    WHERE id = v_listing.skill_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Source skill not found';
    END IF;
    
    -- Create a copy for the installing user
    INSERT INTO public.user_skills (
        user_id,
        name,
        description,
        category,
        tags,
        triggers,
        instructions,
        is_public
    ) VALUES (
        auth.uid(),
        v_source_skill.name,
        v_source_skill.description,
        v_source_skill.category,
        v_source_skill.tags,
        v_source_skill.triggers,
        v_source_skill.instructions,
        false -- Private copy for the user
    )
    RETURNING id INTO v_new_skill_id;
    
    -- Increment install count
    UPDATE public.market_listings
    SET install_count = install_count + 1
    WHERE id = v_listing.id;
    
    RETURN v_new_skill_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.install_skill_from_marketplace(TEXT) TO authenticated;

COMMENT ON TABLE public.market_listings IS 'Public skill marketplace listings';
COMMENT ON FUNCTION public.install_skill_from_marketplace IS 'Copy a marketplace skill to the current user library';
