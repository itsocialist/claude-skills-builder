import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Use service role for admin operations - only create if env is set
let supabaseAdmin: SupabaseClient | null = null;
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

export async function GET(request: NextRequest) {
    try {
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Admin service not configured' }, { status: 503 });
        }

        // Verify the requesting user is an admin
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // Check if user is admin
        const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
        if (!adminEmails.includes(user.email || '')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Get all users using admin API
        const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

        if (error) {
            console.error('Error listing users:', error);
            return NextResponse.json({ error: 'Failed to list users' }, { status: 500 });
        }

        // Get skill counts for each user
        const { data: skills } = await supabaseAdmin
            .from('user_skills')
            .select('user_id');

        const skillCounts = new Map<string, number>();
        skills?.forEach(skill => {
            skillCounts.set(skill.user_id, (skillCounts.get(skill.user_id) || 0) + 1);
        });

        // Map users to admin format
        const adminUsers = users.map(u => {
            // Check if user is banned (different Supabase versions have different properties)
            const userAny = u as unknown as Record<string, unknown>;
            const bannedUntil = userAny.banned_until || userAny.ban_duration;
            const isDisabled = bannedUntil ? (typeof bannedUntil === 'string' && bannedUntil !== 'none') : false;

            return {
                id: u.id,
                email: u.email || 'No email',
                created_at: u.created_at,
                skills_count: skillCounts.get(u.id) || 0,
                disabled: isDisabled,
                last_sign_in: u.last_sign_in_at,
            };
        });

        return NextResponse.json({ users: adminUsers, total: adminUsers.length });
    } catch (error) {
        console.error('Admin users API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Admin service not configured' }, { status: 503 });
        }

        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
        if (!adminEmails.includes(user.email || '')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { userId, action } = await request.json();

        if (action === 'disable') {
            // Ban user for 100 years (effectively permanent)
            const banUntil = new Date();
            banUntil.setFullYear(banUntil.getFullYear() + 100);

            await supabaseAdmin.auth.admin.updateUserById(userId, {
                ban_duration: '876000h', // ~100 years
            });
        } else if (action === 'enable') {
            await supabaseAdmin.auth.admin.updateUserById(userId, {
                ban_duration: 'none',
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Admin user update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
