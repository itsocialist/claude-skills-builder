'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

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
    | 'skill_view'
    | 'template_use'
    | 'template_view'
    | 'bundle_download'
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
        try {
            // Use server API to capture IP address
            await fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventType,
                    eventData,
                    sessionId: getSessionId(),
                    userId: user?.id || null,
                    pageUrl: typeof window !== 'undefined' ? window.location.pathname : null,
                    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
                }),
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
    return <>{children} </>;
}
