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

// List users with pagination
export async function listUsers(page = 0, limit = 20) {
    if (!supabase) return { users: [], total: 0 };

    const { data, error, count } = await supabase
        .rpc('get_users_with_stats', { page_num: page, page_size: limit });

    if (error) {
        console.error('Error listing users:', error);
        return { users: [], total: 0 };
    }

    return { users: data || [], total: count || 0 };
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
