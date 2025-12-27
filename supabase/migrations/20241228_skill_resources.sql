-- Migration: Add skill_resources table and full_instructions column
-- Sprint 13: Full Agent Skills Spec Support

-- Add full_instructions to templates for complete SKILL.md content
ALTER TABLE templates ADD COLUMN IF NOT EXISTS full_instructions TEXT;

-- Add full_instructions to user_skills for user-created skills with resources
ALTER TABLE user_skills ADD COLUMN IF NOT EXISTS full_instructions TEXT;

-- Create skill_resources table for scripts/, references/, assets/ folders
CREATE TABLE IF NOT EXISTS skill_resources (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    -- Links to either templates (system) or user_skills (user-created)
    template_id TEXT REFERENCES templates(id) ON DELETE CASCADE,
    user_skill_id UUID REFERENCES user_skills(id) ON DELETE CASCADE,
    -- Folder type per Agent Skills spec
    folder TEXT NOT NULL CHECK (folder IN ('scripts', 'references', 'assets', 'templates', 'examples')),
    filename TEXT NOT NULL,
    -- For text files (md, py, js, html, json, yaml)
    content TEXT,
    -- For binary files stored in Supabase Storage
    storage_path TEXT,
    mime_type TEXT,
    size_bytes INTEGER CHECK (size_bytes <= 1048576), -- 1MB limit per file
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- Ensure at least one parent reference
    CONSTRAINT resource_has_parent CHECK (
        (template_id IS NOT NULL AND user_skill_id IS NULL) OR
        (template_id IS NULL AND user_skill_id IS NOT NULL)
    ),
    -- Unique filename per folder per skill
    CONSTRAINT unique_template_resource UNIQUE (template_id, folder, filename),
    CONSTRAINT unique_user_skill_resource UNIQUE (user_skill_id, folder, filename)
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_skill_resources_template ON skill_resources(template_id) WHERE template_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_skill_resources_user_skill ON skill_resources(user_skill_id) WHERE user_skill_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_skill_resources_folder ON skill_resources(folder);

-- RLS Policies
ALTER TABLE skill_resources ENABLE ROW LEVEL SECURITY;

-- Public read for template resources (system skills are public)
-- Public read for template resources (system skills are public)
DROP POLICY IF EXISTS "Template resources are publicly readable" ON skill_resources;
CREATE POLICY "Template resources are publicly readable"
ON skill_resources FOR SELECT
USING (template_id IS NOT NULL);

-- Users can manage their own skill resources
-- Users can manage their own skill resources
DROP POLICY IF EXISTS "Users can CRUD own skill resources" ON skill_resources;
CREATE POLICY "Users can CRUD own skill resources"
ON skill_resources FOR ALL
USING (user_skill_id IN (SELECT id FROM user_skills WHERE user_id = auth.uid()));

-- Service role bypass for admin operations
-- Service role bypass for admin operations
DROP POLICY IF EXISTS "Service role has full access" ON skill_resources;
CREATE POLICY "Service role has full access"
ON skill_resources FOR ALL
USING (auth.role() = 'service_role');

-- Comments for documentation
COMMENT ON TABLE skill_resources IS 'Stores resource files for skills (scripts/, references/, assets/)';
COMMENT ON COLUMN skill_resources.folder IS 'Resource folder per Agent Skills spec: scripts, references, assets, templates, examples';
COMMENT ON COLUMN skill_resources.content IS 'Text content for non-binary files';
COMMENT ON COLUMN skill_resources.storage_path IS 'Path in Supabase Storage for binary files';
COMMENT ON COLUMN skill_resources.size_bytes IS 'File size in bytes, max 1MB per file';
