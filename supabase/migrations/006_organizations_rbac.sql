-- Sprint 10: Organizations + RBAC
-- Creates organization hierarchy above teams

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    owner_id UUID REFERENCES auth.users(id) NOT NULL,
    tier TEXT DEFAULT 'enterprise' CHECK (tier IN ('enterprise')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add org_id to teams (teams belong to organizations)
ALTER TABLE teams ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);

-- Organization members (org-level roles)
CREATE TABLE IF NOT EXISTS org_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(org_id, user_id)
);

-- Extend team_members role options
ALTER TABLE team_members DROP CONSTRAINT IF EXISTS team_members_role_check;
ALTER TABLE team_members ADD CONSTRAINT team_members_role_check 
    CHECK (role IN ('owner', 'admin', 'member', 'viewer'));

-- Audit log (org-scoped)
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id UUID,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_org_date ON audit_log(org_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies (following no-recursion rules from Sprint 9)

-- Organizations: Owner can do everything
CREATE POLICY "Org owner full access" ON organizations
    FOR ALL USING (owner_id = auth.uid());

-- Org members: User can see orgs they belong to
CREATE POLICY "Member can view org" ON organizations
    FOR SELECT USING (
        owner_id = auth.uid()
        OR EXISTS (SELECT 1 FROM org_members WHERE org_id = organizations.id AND user_id = auth.uid())
    );

-- Org members: Can view own membership
CREATE POLICY "User can view own org membership" ON org_members
    FOR SELECT USING (user_id = auth.uid());

-- Org members: Org owner can manage
CREATE POLICY "Org owner can manage members" ON org_members
    FOR ALL USING (
        EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid())
    );

-- Audit log: Org owner/admin can view
CREATE POLICY "Org admin can view audit" ON audit_log
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid())
        OR EXISTS (SELECT 1 FROM org_members WHERE org_id = audit_log.org_id AND user_id = auth.uid() AND role IN ('owner', 'admin'))
    );

-- Audit log: System can insert (no user restriction for inserts)
CREATE POLICY "System can insert audit" ON audit_log
    FOR INSERT WITH CHECK (true);
