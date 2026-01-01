import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { eventType, eventData = {}, sessionId, userId, pageUrl, userAgent } = body;

        if (!eventType) {
            return NextResponse.json({ error: 'eventType is required' }, { status: 400 });
        }

        // Get IP address from headers (works with Vercel, Cloudflare, etc.)
        const headersList = await headers();
        const forwardedFor = headersList.get('x-forwarded-for');
        const realIp = headersList.get('x-real-ip');
        const cfConnectingIp = headersList.get('cf-connecting-ip');

        const ipAddress = cfConnectingIp || (forwardedFor?.split(',')[0]?.trim()) || realIp || 'unknown';

        // Create Supabase client with service role
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Insert event with IP address
        const { error } = await supabase.from('analytics_events').insert({
            user_id: userId || null,
            session_id: sessionId,
            event_type: eventType,
            event_data: {
                ...eventData,
                ip_address: ipAddress,
            },
            page_url: pageUrl,
            user_agent: userAgent,
        });

        if (error) {
            console.error('Analytics insert error:', error);
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics tracking error:', error);
        return NextResponse.json(
            { error: 'Failed to track event' },
            { status: 500 }
        );
    }
}
