import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.substring(7);

        // Verify the requesting user is an admin
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { data: { user: adminUser }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !adminUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
        if (!adminEmails.includes(adminUser.email || '')) {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
        }

        // Parse request body
        const body = await request.json();
        const { email, role } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Create user invitation using Supabase Admin API
        const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
            data: {
                role: role || 'user',
                invited_by: adminUser.email,
            },
        });

        if (error) {
            console.error('Error inviting user:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            user: {
                id: data.user.id,
                email: data.user.email,
            },
            message: `Invitation sent to ${email}`,
        });
    } catch (error) {
        console.error('Invite user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
