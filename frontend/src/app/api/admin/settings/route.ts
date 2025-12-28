import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Service role client for admin operations
let supabaseAdmin: SupabaseClient | null = null;
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

// GET: Publicly accessible settings (site name, colors, etc.)
export async function GET(request: NextRequest) {
    try {
        // Log error and return empty settings if Supabase not configured
        if (!supabaseAdmin) {
            console.error('CRITICAL: Supabase Admin client not configured. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
            return NextResponse.json({});
        }

        const { data, error } = await supabaseAdmin
            .from('site_settings')
            .select('key, value');

        if (error) {
            console.error('Error fetching settings:', error);
            // Return empty settings on error to prevent site breakage
            return NextResponse.json({});
        }

        // Convert array to object
        const settings = data.reduce((acc, row) => {
            acc[row.key] = row.value;
            return acc;
        }, {} as Record<string, any>);

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Settings API error:', error);
        // Return empty settings on error to prevent site breakage
        return NextResponse.json({});
    }
}

// POST: Admin only updates
export async function POST(request: NextRequest) {
    try {
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Admin service not configured' }, { status: 503 });
        }

        // Auth Check
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').toLowerCase().split(',').map(e => e.trim()).filter(Boolean);
        if (!adminEmails.includes((user.email || '').toLowerCase().trim())) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Update Logic
        const body = await request.json();
        const { key, value } = body;

        if (!key || value === undefined) {
            return NextResponse.json({ error: 'Missing key or value' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('site_settings')
            .upsert({
                key,
                value,
                updated_at: new Date().toISOString(),
                updated_by: user.id
            });

        if (error) {
            console.error('Error updating setting:', error);
            return NextResponse.json({ error: 'Update failed' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Settings update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
