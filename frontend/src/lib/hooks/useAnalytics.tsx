'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

// Generate or retrieve session ID
function getSessionId(): string {
    if (typeof window === 'undefined') return '';

    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
}

export type AnalyticsEventType =
    | 'page_view'
    | 'skill_create'
    | 'skill_update'
    | 'skill_export'
    | 'skill_delete'
    | 'template_use'
    | 'template_view'
    | 'feedback_submit'
    | 'login'
    | 'logout'
    | 'search';

interface TrackEventOptions {
    eventType: AnalyticsEventType;
    eventData?: Record<string, unknown>;
}

export function useAnalytics() {
    const { user } = useAuth();
    const pathname = usePathname();
    const lastPathRef = useRef<string | null>(null);

    const trackEvent = useCallback(async ({ eventType, eventData = {} }: TrackEventOptions) => {
        if (!supabase) return;

        try {
            await supabase.from('analytics_events').insert({
                user_id: user?.id || null,
                session_id: getSessionId(),
                event_type: eventType,
                event_data: eventData,
                page_url: typeof window !== 'undefined' ? window.location.pathname : null,
                user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
            });
        } catch (error) {
            // Silently fail - don't break app for analytics
            console.debug('Analytics event failed:', error);
        }
    }, [user?.id]);

    // Track page views on route change
    useEffect(() => {
        if (pathname && pathname !== lastPathRef.current) {
            lastPathRef.current = pathname;
            trackEvent({
                eventType: 'page_view',
                eventData: { page: pathname },
            });
        }
    }, [pathname, trackEvent]);

    return { trackEvent };
}

// Provider component to enable automatic page tracking
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    useAnalytics(); // Initialize tracking
    return <>{ children } </>;
}
