-- Migration: 013_community_features.sql
-- Description: Add columns to profiles and create skill_reviews table
-- Sprint: 14 - Community & Polish

-- 1. Modify PROFILES table
-- Add social and community fields
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS username TEXT UNIQUE CHECK (char_length(username) >= 3),
  ADD COLUMN IF NOT EXISTS bio TEXT CHECK (char_length(bio) <= 500),
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS twitter TEXT,
  ADD COLUMN IF NOT EXISTS github TEXT;

-- Create index for username lookup
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- 2. Create SKILL_REVIEWS table
CREATE TABLE IF NOT EXISTS public.skill_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_id UUID REFERENCES public.market_listings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(skill_id, user_id)
);

-- Enable RLS for reviews
ALTER TABLE public.skill_reviews ENABLE ROW LEVEL SECURITY;

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
  ON public.skill_reviews FOR SELECT
  USING ( true );

CREATE POLICY "Authenticated users can create reviews"
  ON public.skill_reviews FOR INSERT
  TO authenticated
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update own reviews"
  ON public.skill_reviews FOR UPDATE
  TO authenticated
  USING ( auth.uid() = user_id )
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can delete own reviews"
  ON public.skill_reviews FOR DELETE
  TO authenticated
  USING ( auth.uid() = user_id );

-- Trigger for updated_at on reviews
-- Ensure the generic update function exists (usually in common/setup, but repeating safely)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_skill_reviews_updated_at ON public.skill_reviews;
CREATE TRIGGER update_skill_reviews_updated_at
    BEFORE UPDATE ON public.skill_reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Utility Functions
CREATE OR REPLACE FUNCTION public.get_average_rating(skill_id_input UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN (
    SELECT ROUND(AVG(rating), 1)
    FROM public.skill_reviews
    WHERE skill_id = skill_id_input
  );
END;
$$;

-- Grant permissions
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT SELECT ON public.skill_reviews TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_average_rating(UUID) TO anon, authenticated;

COMMENT ON TABLE public.skill_reviews IS 'User reviews for marketplace skills';

-- 4. Performance Optimization: Rating Cache
-- Add rating cache columns to market_listings
ALTER TABLE public.market_listings
  ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3, 1) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Function to update rating stats
CREATE OR REPLACE FUNCTION public.update_skill_rating_stats()
RETURNS TRIGGER AS $$
DECLARE
    v_skill_id UUID;
    v_avg NUMERIC;
    v_count INTEGER;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        v_skill_id = OLD.skill_id;
    ELSE
        v_skill_id = NEW.skill_id;
    END IF;

    SELECT COALESCE(AVG(rating), 0), COUNT(*)
    INTO v_avg, v_count
    FROM public.skill_reviews
    WHERE skill_id = v_skill_id;

    UPDATE public.market_listings
    SET average_rating = ROUND(v_avg, 1),
        review_count = v_count
    WHERE id = v_skill_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_review_change ON public.skill_reviews;
CREATE TRIGGER on_review_change
    AFTER INSERT OR UPDATE OR DELETE ON public.skill_reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_skill_rating_stats();

