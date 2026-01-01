import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// IPs to exclude
const EXCLUDED_IPS = ['127.0.0.1', '::1'];
const EXCLUDED_USER_IPS = (process.env.ANALYTICS_EXCLUDED_IPS || '').split(',').filter(Boolean);

// Sessions with more than this many events in the period are flagged as potential dev sessions
const DEV_SESSION_THRESHOLD = 10;

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days') || '7');
        const excludeInternal = searchParams.get('excludeInternal') !== 'false';

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

        let filteredEvents = events || [];
        let excludedSessionIds = new Set<string>();

        if (excludeInternal) {
            // Step 1: Count events per session to identify power users (likely devs)
            const sessionEventCounts = new Map<string, number>();
            for (const event of filteredEvents) {
                if (event.session_id) {
                    sessionEventCounts.set(
                        event.session_id,
                        (sessionEventCounts.get(event.session_id) || 0) + 1
                    );
                }
            }

            // Step 2: Identify dev sessions (high event count OR has excluded IP)
            for (const event of filteredEvents) {
                if (!event.session_id) continue;

                // Check IP exclusion
                const ip = event.event_data?.ip_address;
                if (ip) {
                    const allExcludedIps = [...EXCLUDED_IPS, ...EXCLUDED_USER_IPS];
                    for (const excludedIp of allExcludedIps) {
                        if (ip === excludedIp || ip.startsWith(excludedIp.split('/')[0])) {
                            excludedSessionIds.add(event.session_id);
                            break;
                        }
                    }
                }

                // Check high event count (likely dev session)
                const eventCount = sessionEventCounts.get(event.session_id) || 0;
                if (eventCount > DEV_SESSION_THRESHOLD) {
                    excludedSessionIds.add(event.session_id);
                }
            }

            // Step 3: Filter out dev sessions
            filteredEvents = filteredEvents.filter(event => {
                if (event.session_id && excludedSessionIds.has(event.session_id)) {
                    return false;
                }
                return true;
            });
        }

        // Aggregate stats
        const eventCounts: Record<string, number> = {};
        const dailyUsers = new Map<string, Set<string>>();
        const pageViews: Record<string, number> = {};
        const uniqueVisitors = new Set<string>();
        const sessionFirstEvent = new Map<string, Date>();
        const sessionLastEvent = new Map<string, Date>();

        for (const event of filteredEvents) {
            eventCounts[event.event_type] = (eventCounts[event.event_type] || 0) + 1;

            const day = event.created_at.split('T')[0];
            if (!dailyUsers.has(day)) {
                dailyUsers.set(day, new Set());
            }
            const sessionId = event.session_id || event.user_id || 'anon';
            dailyUsers.get(day)!.add(sessionId);

            const visitorId = event.user_id || event.event_data?.fingerprint || event.session_id;
            if (visitorId) {
                uniqueVisitors.add(visitorId);
            }

            if (event.session_id) {
                const eventTime = new Date(event.created_at);
                if (!sessionFirstEvent.has(event.session_id) || eventTime < sessionFirstEvent.get(event.session_id)!) {
                    sessionFirstEvent.set(event.session_id, eventTime);
                }
                if (!sessionLastEvent.has(event.session_id) || eventTime > sessionLastEvent.get(event.session_id)!) {
                    sessionLastEvent.set(event.session_id, eventTime);
                }
            }

            if (event.event_type === 'page_view' && event.event_data?.page) {
                const page = event.event_data.page as string;
                pageViews[page] = (pageViews[page] || 0) + 1;
            }
        }

        // Calculate session durations
        const sessionDurations: number[] = [];
        for (const [sessionId, firstEvent] of sessionFirstEvent.entries()) {
            const lastEvent = sessionLastEvent.get(sessionId);
            if (lastEvent && firstEvent) {
                const duration = (lastEvent.getTime() - firstEvent.getTime()) / 1000;
                if (duration > 0 && duration < 3600) {
                    sessionDurations.push(duration);
                }
            }
        }

        const avgSessionDuration = sessionDurations.length > 0
            ? Math.round(sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length)
            : 0;

        const dailyActiveUsers = Array.from(dailyUsers.entries())
            .map(([date, users]) => ({ date, count: users.size }))
            .sort((a, b) => a.date.localeCompare(b.date));

        const topPages = Object.entries(pageViews)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([page, views]) => ({ page, views }));

        return NextResponse.json({
            totalEvents: filteredEvents.length,
            eventCounts,
            dailyActiveUsers,
            topPages,
            uniqueVisitors: uniqueVisitors.size,
            avgSessionDuration,
            totalSessions: sessionFirstEvent.size || dailyActiveUsers.reduce((sum, d) => sum + d.count, 0),
            _debug: {
                totalRawEvents: events?.length || 0,
                excludedEvents: (events?.length || 0) - filteredEvents.length,
                excludedSessionCount: excludedSessionIds.size,
                devSessionThreshold: DEV_SESSION_THRESHOLD,
            }
        });
    } catch (error) {
        console.error('Analytics API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}
