-- Sprint 9: Team Sharing + Site Admin
-- Run this migration in Supabase SQL Editor

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    owner_id UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    joined_at TIMESTAMPTZ,
    UNIQUE(team_id, user_id)
);

-- Team invites
CREATE TABLE IF NOT EXISTS team_invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    invited_by UUID REFERENCES auth.users(id),
    token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add team_id to user_skills for sharing
ALTER TABLE user_skills ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id);

-- Site settings table (for admin)
CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES 
    ('site_name', '"ClaudeSkillsFacet"'),
    ('max_skills_per_user', '100'),
    ('require_email_confirmation', 'true'),
    ('allowed_email_domains', '[]')
ON CONFLICT (key) DO NOTHING;

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Teams: owners and members can view
CREATE POLICY "Team members can view their teams" ON teams
    FOR SELECT USING (
        owner_id = auth.uid() 
        OR id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
    );

-- Teams: only owner can update
CREATE POLICY "Team owner can update" ON teams
    FOR UPDATE USING (owner_id = auth.uid());

-- Teams: authenticated users can create
CREATE POLICY "Authenticated users can create teams" ON teams
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Team members: team members can view
CREATE POLICY "Team members can view members" ON team_members
    FOR SELECT USING (
        team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
    );

-- Team members: team admin/owner can insert
CREATE POLICY "Team admin can add members" ON team_members
    FOR INSERT WITH CHECK (
        team_id IN (
            SELECT id FROM teams WHERE owner_id = auth.uid()
            UNION
            SELECT team_id FROM team_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- User skills: add policy for team access
CREATE POLICY "Team members can view team skills" ON user_skills
    FOR SELECT USING (
        user_id = auth.uid()
        OR team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
    );

-- Site settings: only admins can view/modify
CREATE POLICY "Admins can view settings" ON site_settings
    FOR SELECT USING (
        auth.uid() IN (SELECT user_id FROM admin_users)
    );

CREATE POLICY "Admins can update settings" ON site_settings
    FOR UPDATE USING (
        auth.uid() IN (SELECT user_id FROM admin_users)
    );

-- Admin users: only super_admin can view
CREATE POLICY "Super admin can view admins" ON admin_users
    FOR SELECT USING (
        auth.uid() IN (SELECT user_id FROM admin_users WHERE role = 'super_admin')
    );
