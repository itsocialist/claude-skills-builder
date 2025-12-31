import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days') || '7');

        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Get events from past N days
        const { data: events, error } = await supabase
            .from('analytics_events')
            .select('*')
            .gte('created_at', startDate.toISOString())
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Aggregate stats
        const eventCounts: Record<string, number> = {};
        const dailyUsers = new Map<string, Set<string>>();
        const pageViews: Record<string, number> = {};

        for (const event of events || []) {
            // Count by event type
            eventCounts[event.event_type] = (eventCounts[event.event_type] || 0) + 1;

            // Daily unique users/sessions
            const day = event.created_at.split('T')[0];
            if (!dailyUsers.has(day)) {
                dailyUsers.set(day, new Set());
            }
            dailyUsers.get(day)!.add(event.session_id || event.user_id || 'anon');

            // Page views
            if (event.event_type === 'page_view' && event.event_data?.page) {
                const page = event.event_data.page as string;
                pageViews[page] = (pageViews[page] || 0) + 1;
            }
        }

        // Format daily users for chart
        const dailyActiveUsers = Array.from(dailyUsers.entries())
            .map(([date, users]) => ({ date, count: users.size }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // Top pages
        const topPages = Object.entries(pageViews)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([page, views]) => ({ page, views }));

        return NextResponse.json({
            totalEvents: events?.length || 0,
            eventCounts,
            dailyActiveUsers,
            topPages,
        });
    } catch (error) {
        console.error('Analytics API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}
