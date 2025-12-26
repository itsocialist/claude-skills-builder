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

// List users with skill counts (from server API with real auth data)
export interface AdminUser {
    id: string;
    email: string;
    created_at: string;
    skills_count: number;
    disabled: boolean;
    last_sign_in?: string;
}

export async function listUsers(token: string): Promise<{ users: AdminUser[], total: number }> {
    try {
        const response = await fetch('/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error('Error listing users:', response.statusText);
            return { users: [], total: 0 };
        }

        return await response.json();
    } catch (error) {
        console.error('Error listing users:', error);
        return { users: [], total: 0 };
    }
}

export async function toggleUserStatus(token: string, userId: string, disable: boolean): Promise<boolean> {
    try {
        const response = await fetch('/api/admin/users', {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                action: disable ? 'disable' : 'enable',
            }),
        });

        return response.ok;
    } catch (error) {
        console.error('Error toggling user status:', error);
        return false;
    }
}

// Site Settings Types
export interface SiteSettings {
    site_name: string;
    primary_color: string;
    categories: string[];
    menu_items: { label: string; href: string }[];
    [key: string]: any;
}

// Get site settings
export async function getSiteSettings(): Promise<SiteSettings> {
    try {
        const response = await fetch('/api/admin/settings');
        if (!response.ok) return {} as SiteSettings;
        return await response.json();
    } catch (error) {
        console.error('Error fetching settings:', error);
        return {} as SiteSettings;
    }
}

// Update site setting
export async function updateSiteSetting(token: string, key: string, value: any): Promise<boolean> {
    try {
        const response = await fetch('/api/admin/settings', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key, value }),
        });

        return response.ok;
    } catch (error) {
        console.error('Error updating setting:', error);
        return false;
    }
}

// Disable user
export async function disableUser(userId: string) {
    if (!supabase) return false;

    // This would typically call a Supabase Edge Function or Admin API
    // For now, we'll track disabled status in a separate table or user metadata
    console.log('Disable user:', userId);
    return true;
}
