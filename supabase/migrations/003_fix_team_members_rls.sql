-- Fix infinite recursion in team_members RLS policy
-- The original policy referenced team_members from within a team_members policy, causing recursion

-- Drop the problematic policies
DROP POLICY IF EXISTS "Team members can view members" ON team_members;
DROP POLICY IF EXISTS "Team admin can add members" ON team_members;

-- Create new policies that reference the teams table instead (no recursion)
-- Team members can view their own membership and their team's members via team ownership
CREATE POLICY "Team members can view members" ON team_members
    FOR SELECT USING (
        user_id = auth.uid()
        OR team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid())
    );

-- Team owner can add members (simplified to avoid recursion)
CREATE POLICY "Team admin can add members" ON team_members
    FOR INSERT WITH CHECK (
        team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid())
    );

-- Allow users to delete their own membership (leave team)
CREATE POLICY "Members can leave team" ON team_members
    FOR DELETE USING (user_id = auth.uid());
