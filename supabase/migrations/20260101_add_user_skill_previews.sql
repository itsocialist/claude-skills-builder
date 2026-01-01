-- Add preview_image_url to user_skills table
-- This allows previews for non-published skills (not just marketplace listings)

ALTER TABLE user_skills
ADD COLUMN IF NOT EXISTS preview_image_url text,
ADD COLUMN IF NOT EXISTS sample_output text;

-- Index for faster preview lookups
CREATE INDEX IF NOT EXISTS idx_user_skills_preview ON user_skills(preview_image_url) WHERE preview_image_url IS NOT NULL;
