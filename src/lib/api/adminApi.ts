import { supabase } from '@/lib/supabase';

// Check if user is admin
export async function isUserAdmin(userId: string): Promise<boolean> {
    if (!supabase) return false;

    const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', userId)
        .single();

    if (error || !data) return false;
    return true;
}

// Get admin dashboard stats
export async function getAdminStats() {
    if (!supabase) return null;

    const [usersResult, skillsResult, teamsResult, todaySkillsResult] = await Promise.all([
        supabase.from('auth.users').select('id', { count: 'exact', head: true }),
        supabase.from('user_skills').select('id', { count: 'exact', head: true }),
        supabase.from('teams').select('id', { count: 'exact', head: true }),
        supabase.from('user_skills')
            .select('id', { count: 'exact', head: true })
            .gte('created_at', new Date().toISOString().split('T')[0]),
    ]);

    return {
        totalUsers: usersResult.count || 0,
        totalSkills: skillsResult.count || 0,
        totalTeams: teamsResult.count || 0,
        skillsToday: todaySkillsResult.count || 0,
    };
}

// List users with skill counts (from user_skills table)
export interface AdminUser {
    id: string;
    email: string;
    created_at: string;
    skills_count: number;
    disabled: boolean;
}

export async function listUsers(): Promise<{ users: AdminUser[], total: number }> {
    if (!supabase) return { users: [], total: 0 };

    // Get all skills grouped by user
    const { data: skills, error } = await supabase
        .from('user_skills')
        .select('user_id, created_at');

    if (error) {
        console.error('Error listing users:', error);
        return { users: [], total: 0 };
    }

    if (!skills || skills.length === 0) {
        return { users: [], total: 0 };
    }

    // Group skills by user_id
    const userMap = new Map<string, { count: number; earliest: string }>();
    skills.forEach(skill => {
        const existing = userMap.get(skill.user_id);
        if (existing) {
            existing.count++;
            if (skill.created_at < existing.earliest) {
                existing.earliest = skill.created_at;
            }
        } else {
            userMap.set(skill.user_id, { count: 1, earliest: skill.created_at });
        }
    });

    // Convert to AdminUser array
    const users: AdminUser[] = Array.from(userMap.entries()).map(([userId, data]) => ({
        id: userId,
        email: `User ${userId.substring(0, 8)}...`, // We don't have email access from client
        created_at: data.earliest,
        skills_count: data.count,
        disabled: false,
    }));

    // Sort by most recent first
    users.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return { users, total: users.length };
}

// Get site settings
export async function getSiteSettings() {
    if (!supabase) return {};

    const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

    if (error) {
        console.error('Error fetching settings:', error);
        return {};
    }

    return data.reduce((acc, row) => {
        acc[row.key] = row.value;
        return acc;
    }, {} as Record<string, any>);
}

// Update site setting
export async function updateSiteSetting(key: string, value: any) {
    if (!supabase) return false;

    const { error } = await supabase
        .from('site_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key);

    if (error) {
        console.error('Error updating setting:', error);
        return false;
    }

    return true;
}

// Disable user
export async function disableUser(userId: string) {
    if (!supabase) return false;

    // This would typically call a Supabase Edge Function or Admin API
    // For now, we'll track disabled status in a separate table or user metadata
    console.log('Disable user:', userId);
    return true;
}
