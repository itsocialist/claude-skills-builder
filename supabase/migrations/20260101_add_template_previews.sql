-- Add preview_image_url and sample_output to templates table if they don't exist
ALTER TABLE templates 
ADD COLUMN IF NOT EXISTS preview_image_url text,
ADD COLUMN IF NOT EXISTS sample_output text;

-- Ensure templates can be read by public (if RLS is enabled)
-- Generally templates are public read, admin write.
-- Just ensuring the column is exposed is enough for now.
