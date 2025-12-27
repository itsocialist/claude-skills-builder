import { useCallback } from 'react';
import { analyticsApi } from '@/lib/api/analyticsApi';
import { AnalyticsEventType } from '@/types/skill.types';

export function useAnalytics() {

    // Track a page view, distinct per session to avoid inflation
    const trackView = useCallback((skillId: string) => {
        const key = `viewed_${skillId}`;
        const hasViewed = sessionStorage.getItem(key);

        if (!hasViewed) {
            analyticsApi.logEvent(skillId, 'view', { source: 'web_app' });
            sessionStorage.setItem(key, 'true');
        }
    }, []);

    const trackAction = useCallback((skillId: string, action: Exclude<AnalyticsEventType, 'view'>) => {
        analyticsApi.logEvent(skillId, action, { source: 'web_app' });
    }, []);

    return {
        trackView,
        trackAction
    };
}
