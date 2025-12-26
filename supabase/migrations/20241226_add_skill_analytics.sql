-- Add analytics columns to user_skills table
ALTER TABLE user_skills
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMPTZ;

-- Create index for sorting by usage
CREATE INDEX IF NOT EXISTS idx_user_skills_last_used ON user_skills(last_used_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_user_skills_view_count ON user_skills(view_count DESC);

-- RPC function to atomically increment view count
CREATE OR REPLACE FUNCTION increment_skill_view(skill_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE user_skills 
    SET view_count = COALESCE(view_count, 0) + 1,
        last_used_at = NOW()
    WHERE id = skill_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC function to atomically increment download count
CREATE OR REPLACE FUNCTION increment_skill_download(skill_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE user_skills 
    SET download_count = COALESCE(download_count, 0) + 1,
        last_used_at = NOW()
    WHERE id = skill_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
