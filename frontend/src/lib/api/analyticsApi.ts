import { supabase } from '@/lib/supabase';
import { AnalyticsEventType, SkillStats } from '@/types/skill.types';

export const analyticsApi = {
    // Log an event (view, download, copy)
    logEvent: async (skillId: string, eventType: AnalyticsEventType, metadata: Record<string, any> = {}) => {
        if (!supabase) return;
        const { error } = await supabase
            .from('skill_analytics_events')
            .insert({
                skill_id: skillId,
                event_type: eventType,
                metadata
            });

        if (error) {
            console.error('Failed to log analytics event:', error);
        }
    },

    // Get aggregated stats for a specific skill
    getSkillStats: async (skillId: string): Promise<SkillStats | null> => {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('skill_stats')
            .select('*')
            .eq('skill_id', skillId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // No stats yet
            console.error('Failed to fetch skill stats:', error);
            return null;
        }

        return data as SkillStats;
    },

    // Get stats for multiple skills (for the list view)
    getStatsForSkills: async (skillIds: string[]): Promise<Record<string, SkillStats>> => {
        if (!skillIds.length || !supabase) return {};

        const { data, error } = await supabase
            .from('skill_stats')
            .select('*')
            .in('skill_id', skillIds);

        if (error) {
            console.error('Failed to fetch bulk stats:', error);
            return {};
        }

        // Convert array to map for O(1) lookup
        const statsMap: Record<string, SkillStats> = {};
        data?.forEach((stat: any) => {
            statsMap[stat.skill_id] = stat;
        });

        return statsMap;
    },

    // Get daily view trend for the sparkline (last 30 days)
    getSkillTrend: async (skillId: string, days = 30) => {
        if (!supabase) return [];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Note: Grouping by date usually requires a Postgres function or complex query.
        // For MVP, on free tier, we'll fetch raw events and aggregate client-side 
        // to avoid heavy DB aggregations. Limit to 1000 events to prevent abuse.
        const { data, error } = await supabase
            .from('skill_analytics_events')
            .select('created_at, event_type')
            .eq('skill_id', skillId)
            .eq('event_type', 'view')
            .gte('created_at', startDate.toISOString())
            .order('created_at', { ascending: true })
            .limit(2000);

        if (error) {
            console.error('Failed to fetch trend type:', error);
            return [];
        }

        return data;
    }
};
