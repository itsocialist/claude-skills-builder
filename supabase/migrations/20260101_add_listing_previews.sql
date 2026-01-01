-- Migration: 20260101_add_listing_previews.sql
-- Description: Add preview image support to marketplace listings
-- Sprint: 23 - Preview Generation

-- Add preview image URL column
ALTER TABLE public.market_listings 
ADD COLUMN IF NOT EXISTS preview_image_url TEXT;

-- Add example output column for storing generated sample content
ALTER TABLE public.market_listings 
ADD COLUMN IF NOT EXISTS example_output TEXT;

-- Create storage bucket for marketplace assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('marketplace-assets', 'marketplace-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to marketplace assets
CREATE POLICY "Public read access for marketplace assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'marketplace-assets');

-- Allow authenticated users to upload assets (admin only in practice)
CREATE POLICY "Authenticated users can upload marketplace assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'marketplace-assets');

COMMENT ON COLUMN public.market_listings.preview_image_url IS 'URL to preview image showing example output';
COMMENT ON COLUMN public.market_listings.example_output IS 'Generated example output text for preview rendering';
