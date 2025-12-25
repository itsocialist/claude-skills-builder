import { supabase } from '@/lib/supabase';

export interface Team {
    id: string;
    name: string;
    slug: string;
    owner_id: string;
    created_at: string;
}

export interface TeamMember {
    id: string;
    team_id: string;
    user_id: string;
    role: 'owner' | 'admin' | 'member';
    email?: string;
    joined_at: string | null;
}

// Get user's teams
export async function getUserTeams(userId: string): Promise<Team[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('teams')
        .select('*')
        .or(`owner_id.eq.${userId},id.in.(select team_id from team_members where user_id = '${userId}')`);

    if (error) {
        console.error('Error fetching teams:', error);
        return [];
    }

    return data || [];
}

// Create a new team
export async function createTeam(userId: string, name: string): Promise<Team | null> {
    if (!supabase) return null;

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const { data, error } = await supabase
        .from('teams')
        .insert({
            name,
            slug,
            owner_id: userId,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating team:', error);
        return null;
    }

    // Add owner as a member
    await supabase.from('team_members').insert({
        team_id: data.id,
        user_id: userId,
        role: 'owner',
        joined_at: new Date().toISOString(),
    });

    return data;
}

// Get team members
export async function getTeamMembers(teamId: string): Promise<TeamMember[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId);

    if (error) {
        console.error('Error fetching team members:', error);
        return [];
    }

    return data || [];
}

// Invite member by email
export async function inviteTeamMember(teamId: string, email: string, invitedBy: string): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('team_invites')
        .insert({
            team_id: teamId,
            email,
            invited_by: invitedBy,
        });

    if (error) {
        console.error('Error inviting member:', error);
        return false;
    }

    return true;
}

// Share skill to team
export async function shareSkillToTeam(skillId: string, teamId: string): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('user_skills')
        .update({ team_id: teamId })
        .eq('id', skillId);

    if (error) {
        console.error('Error sharing skill:', error);
        return false;
    }

    return true;
}

// Unshare skill from team
export async function unshareSkillFromTeam(skillId: string): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('user_skills')
        .update({ team_id: null })
        .eq('id', skillId);

    if (error) {
        console.error('Error unsharing skill:', error);
        return false;
    }

    return true;
}

// Get team skills
export async function getTeamSkills(teamId: string) {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('user_skills')
        .select('*')
        .eq('team_id', teamId)
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error fetching team skills:', error);
        return [];
    }

    return data || [];
}
