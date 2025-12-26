-- Complete RLS policy rewrite to fix all recursion issues
-- The problem was cross-table references causing infinite loops

-- First, drop ALL existing policies on these tables
DROP POLICY IF EXISTS "Team members can view their teams" ON teams;
DROP POLICY IF EXISTS "Team owner can update" ON teams;
DROP POLICY IF EXISTS "Authenticated users can create teams" ON teams;
DROP POLICY IF EXISTS "Team members can view members" ON team_members;
DROP POLICY IF EXISTS "Team admin can add members" ON team_members;
DROP POLICY IF EXISTS "Members can leave team" ON team_members;

-- TEAMS: Simple policies that don't reference other tables
-- Anyone authenticated can create a team
CREATE POLICY "Anyone can create teams" ON teams
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND owner_id = auth.uid());

-- Owner can view their own teams
CREATE POLICY "Owner can view teams" ON teams
    FOR SELECT USING (owner_id = auth.uid());

-- Owner can update their own teams
CREATE POLICY "Owner can update teams" ON teams
    FOR UPDATE USING (owner_id = auth.uid());

-- Owner can delete their own teams
CREATE POLICY "Owner can delete teams" ON teams
    FOR DELETE USING (owner_id = auth.uid());

-- TEAM_MEMBERS: Simple policies
-- Anyone can view team_members rows where they are the user
CREATE POLICY "User can view own membership" ON team_members
    FOR SELECT USING (user_id = auth.uid());

-- Team owners can insert members (check ownership via direct query, no recursion)
CREATE POLICY "Owner can add members" ON team_members
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM teams WHERE teams.id = team_id AND teams.owner_id = auth.uid())
    );

-- Users can delete their own membership
CREATE POLICY "User can remove own membership" ON team_members
    FOR DELETE USING (user_id = auth.uid());
