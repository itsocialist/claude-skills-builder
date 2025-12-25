import { supabase } from '@/lib/supabase';

export interface Organization {
    id: string;
    name: string;
    slug: string;
    owner_id: string;
    tier: 'enterprise';
    settings: Record<string, unknown>;
    created_at: string;
}

export interface OrgMember {
    id: string;
    org_id: string;
    user_id: string;
    role: 'owner' | 'admin' | 'member';
    email?: string;
    created_at: string;
}

// Get user's organizations
export async function getUserOrganizations(userId: string): Promise<Organization[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .or(`owner_id.eq.${userId}`);

    if (error) {
        console.error('Error fetching organizations:', error);
        return [];
    }

    return data || [];
}

// Create organization
export async function createOrganization(userId: string, name: string): Promise<Organization | null> {
    if (!supabase) {
        console.error('Supabase not initialized');
        return null;
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const { data, error } = await supabase
        .from('organizations')
        .insert({
            name,
            slug,
            owner_id: userId,
            tier: 'enterprise',
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating organization:', error);
        return null;
    }

    // Add owner as org member
    await supabase.from('org_members').insert({
        org_id: data.id,
        user_id: userId,
        role: 'owner',
    });

    // Log audit event
    await logAuditEvent(data.id, null, userId, 'org.created', { name });

    return data;
}

// Get organization members
export async function getOrgMembers(orgId: string): Promise<OrgMember[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('org_members')
        .select('*')
        .eq('org_id', orgId);

    if (error) {
        console.error('Error fetching org members:', error);
        return [];
    }

    return data || [];
}

// Update member role
export async function updateOrgMemberRole(orgId: string, userId: string, newRole: 'admin' | 'member'): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('org_members')
        .update({ role: newRole })
        .eq('org_id', orgId)
        .eq('user_id', userId);

    if (error) {
        console.error('Error updating member role:', error);
        return false;
    }

    return true;
}

// Invite member to org
export async function inviteOrgMember(orgId: string, email: string, role: 'admin' | 'member'): Promise<boolean> {
    // TODO: Implement invite flow with email
    console.log('Invite:', { orgId, email, role });
    return true;
}

// Log audit event
export async function logAuditEvent(
    orgId: string,
    teamId: string | null,
    userId: string,
    action: string,
    details: Record<string, unknown> = {}
): Promise<void> {
    if (!supabase) return;

    await supabase.from('audit_log').insert({
        org_id: orgId,
        team_id: teamId,
        user_id: userId,
        action,
        details,
    });
}

// Get audit log
export async function getAuditLog(orgId: string, limit = 50): Promise<unknown[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('audit_log')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching audit log:', error);
        return [];
    }

    return data || [];
}

// Check user tier (Individual vs Enterprise)
export async function getUserTier(userId: string): Promise<'individual' | 'enterprise'> {
    if (!supabase) return 'individual';

    const { data } = await supabase
        .from('org_members')
        .select('org_id')
        .eq('user_id', userId)
        .limit(1);

    return data && data.length > 0 ? 'enterprise' : 'individual';
}
