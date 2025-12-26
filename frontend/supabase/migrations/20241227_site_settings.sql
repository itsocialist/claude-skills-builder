-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID
);

-- RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for site title, theme, etc.)
CREATE POLICY "Public read access" ON site_settings
    FOR SELECT USING (true);

-- Allow service role full access (for admin updates via API)
-- No explicit policy needed for service role as it bypasses RLS,
-- but we ensure no other roles can write.

-- Initial Seed Data
INSERT INTO site_settings (key, value) VALUES
    ('site_name', '"ClaudeSkillsFacet"'::jsonb),
    ('primary_color', '"#C15F3C"'::jsonb),
    ('categories', '["Marketing", "HR", "Engineering", "Sales", "Product", "Operations", "Finance"]'::jsonb),
    ('menu_items', '[]'::jsonb),
    ('social_links', '{"twitter": "", "github": "", "linkedin": ""}'::jsonb)
ON CONFLICT (key) DO NOTHING;
