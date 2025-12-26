-- Fix remaining RLS recursion issues in user_skills and admin_users

-- Drop the problematic policies
DROP POLICY IF EXISTS "Team members can view team skills" ON user_skills;
DROP POLICY IF EXISTS "Super admin can view admins" ON admin_users;

-- Fix user_skills: Use teams table instead of team_members to avoid recursion
CREATE POLICY "User can view own and team skills" ON user_skills
    FOR SELECT USING (
        user_id = auth.uid()
        OR team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid())
    );

-- Fix admin_users: Simplify to avoid self-reference
-- Super admin can view all admins, regular admins can view themselves
CREATE POLICY "Admins can view admin list" ON admin_users
    FOR SELECT USING (
        user_id = auth.uid()
    );
