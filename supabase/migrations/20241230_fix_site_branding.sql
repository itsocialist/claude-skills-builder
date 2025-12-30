-- Migration: Fix site_settings branding
-- Description: Update site_name from legacy "ClaudeSkillsFacet" to "GetClaudeSkills"
-- Sprint: 20 - BUG-015 Resolution

-- Force update the site_name to the correct branding
UPDATE site_settings 
SET value = '"GetClaudeSkills"'::jsonb,
    updated_at = NOW()
WHERE key = 'site_name';

-- Also update in 002_teams_and_admin if it exists there
-- (This ensures the correct value is used regardless of which table is read)
