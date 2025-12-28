
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { FLAG_KEYS, FlagKey, FlagState, DEFAULT_FLAGS } from '@/lib/flags';

export async function GET() {
    try {
        const cookieStore = await cookies();

        // 1. Auth Client (For verifying user session)
        const authClient = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll() },
                    setAll() { }
                }
            }
        );

        // 2. Check Admin Auth
        const { data: { user }, error: authError } = await authClient.auth.getUser();
        if (authError || !user) {
            console.error('[Flags API] Auth Error:', authError);
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').toLowerCase().split(',').map(e => e.trim());
        if (!adminEmails.includes(user.email?.toLowerCase().trim() || '')) {
            console.warn('[Flags API] Forbidden Access Attempt:', user.email);
            return new NextResponse('Forbidden', { status: 403 });
        }

        // 3. Admin Client (For bypassing RLS to read settings)
        // Use standard supabase-js client for service role ops
        const adminClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: { persistSession: false }
            }
        );

        // 4. Fetch Flags
        const { data, error } = await adminClient
            .from('site_settings')
            .select('value')
            .eq('key', 'feature_flags')
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
            console.error('[Flags API] Database Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Merge DB flags with Defaults
        const dbFlags = data?.value || {};
        const effectiveFlags = { ...DEFAULT_FLAGS, ...dbFlags };

        return NextResponse.json(effectiveFlags);
    } catch (e) {
        console.error('[Flags API] Unexpected Error:', e);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();

        // 1. Auth Client
        const authClient = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll() },
                    setAll() { }
                }
            }
        );

        // 2. Check Admin Auth
        const { data: { user }, error: authError } = await authClient.auth.getUser();
        if (authError || !user) {
            console.error('[Flags API] Auth Error:', authError);
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').toLowerCase().split(',').map(e => e.trim());
        if (!adminEmails.includes(user.email?.toLowerCase().trim() || '')) {
            console.warn('[Flags API] Forbidden Access Attempt:', user.email);
            return new NextResponse('Forbidden', { status: 403 });
        }

        // 3. Validate Body
        const body = await request.json();
        const newFlags: Partial<Record<FlagKey, FlagState>> = {};

        // Handle { key: "feature_x", value: "STATE" } format from client
        if (body.key && body.value && FLAG_KEYS.includes(body.key as FlagKey)) {
            if (['PUBLIC', 'ADMIN_ONLY', 'DISABLED'].includes(body.value)) {
                newFlags[body.key as FlagKey] = body.value as FlagState;
            }
        }
        // Fallback: Handle { feature_x: "STATE" } bulk format if needed
        else {
            for (const key of FLAG_KEYS) {
                if (body[key]) {
                    if (['PUBLIC', 'ADMIN_ONLY', 'DISABLED'].includes(body[key])) {
                        newFlags[key] = body[key];
                    }
                }
            }
        }


        // 4. Admin Client
        const adminClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: { persistSession: false }
            }
        );

        // Fetch current
        const { data: currentData } = await adminClient
            .from('site_settings')
            .select('value')
            .eq('key', 'feature_flags')
            .single();

        const currentFlags = currentData?.value || {};


        const mergedFlags = { ...currentFlags, ...newFlags };

        // 5. Save
        const { error } = await adminClient
            .from('site_settings')
            .upsert({
                key: 'feature_flags',
                value: mergedFlags
            });

        if (error) {
            console.error('[Flags API] Save Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, flags: mergedFlags });
    } catch (e) {
        console.error('[Flags API] Unexpected Error:', e);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
