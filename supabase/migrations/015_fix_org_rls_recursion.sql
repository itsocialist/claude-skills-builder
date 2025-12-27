-- Migration: 015_fix_org_rls_recursion.sql
-- Description: Fix infinite recursion in org_members RLS policies
-- Sprint: 14 - Production Hotfix

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Member can view org" ON organizations;
DROP POLICY IF EXISTS "User can view own org membership" ON org_members;
DROP POLICY IF EXISTS "Org owner can manage members" ON org_members;
DROP POLICY IF EXISTS "Org admin can view audit" ON audit_log;

-- Create helper function to check org ownership (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_org_owner(org_id_input UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM organizations 
        WHERE id = org_id_input AND owner_id = auth.uid()
    );
$$;

-- Create helper function to check org membership (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_org_member(org_id_input UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM org_members 
        WHERE org_id = org_id_input AND user_id = auth.uid()
    );
$$;

-- Create helper function to check org admin status
CREATE OR REPLACE FUNCTION public.is_org_admin(org_id_input UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM org_members 
        WHERE org_id = org_id_input AND user_id = auth.uid() AND role IN ('owner', 'admin')
    );
$$;

-- Recreate policies using helper functions (no more cross-table recursion)

-- Organizations: Users can view orgs they own or are members of
CREATE POLICY "Users can view accessible orgs" ON organizations
    FOR SELECT USING (
        owner_id = auth.uid()
        OR public.is_org_member(id)
    );

-- Org members: Users can view their own memberships
CREATE POLICY "Users can view own membership" ON org_members
    FOR SELECT USING (user_id = auth.uid());

-- Org members: Org owners can manage all members
CREATE POLICY "Org owners can manage members" ON org_members
    FOR ALL USING (
        public.is_org_owner(org_id)
    );

-- Audit log: Org owner or admin can view
CREATE POLICY "Org admins can view audit log" ON audit_log
    FOR SELECT USING (
        public.is_org_owner(org_id) OR public.is_org_admin(org_id)
    );

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_org_owner(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_member(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_admin(UUID) TO anon, authenticated;
