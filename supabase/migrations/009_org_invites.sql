-- Create org_invites table
CREATE TABLE IF NOT EXISTS org_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    invited_by UUID REFERENCES auth.users(id),
    token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(org_id, email)
);

-- Enable RLS
ALTER TABLE org_invites ENABLE ROW LEVEL SECURITY;

-- Policy: Org admins/owners can insert invites
CREATE POLICY "Org admins can invite" ON org_invites
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM org_members 
            WHERE org_id = org_invites.org_id 
            AND user_id = auth.uid() 
            AND role IN ('owner', 'admin')
        )
        OR EXISTS (
            SELECT 1 FROM organizations 
            WHERE id = org_invites.org_id 
            AND owner_id = auth.uid()
        )
    );

-- Policy: Org admins/owners can view invites
CREATE POLICY "Org admins can view invites" ON org_invites
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM org_members 
            WHERE org_id = org_invites.org_id 
            AND user_id = auth.uid() 
            AND role IN ('owner', 'admin')
        )
        OR EXISTS (
            SELECT 1 FROM organizations 
            WHERE id = org_invites.org_id 
            AND owner_id = auth.uid()
        )
    );

-- Policy: Org admins/owners can delete invites (cancel)
CREATE POLICY "Org admins can delete invites" ON org_invites
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM org_members 
            WHERE org_id = org_invites.org_id 
            AND user_id = auth.uid() 
            AND role IN ('owner', 'admin')
        )
        OR EXISTS (
            SELECT 1 FROM organizations 
            WHERE id = org_invites.org_id 
            AND owner_id = auth.uid()
        )
    );
