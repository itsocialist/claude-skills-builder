'use client';

import { useState, useCallback } from 'react';
import { bundles as allBundles, Bundle } from '@/lib/constants/bundles';

/**
 * AI Recommendation Hook
 * Returns personalized bundle recommendations based on user preferences
 * Currently uses heuristic matching; can be extended to call Claude API
 */

interface UserPreferences {
    role: string;
    goal: string;
    experience: number;
}

interface RecommendationResult {
    bundles: Bundle[];
    reasoning?: string;
    isLoading: boolean;
    error: string | null;
}

// Goal → Bundle category mapping
const GOAL_CATEGORY_MAP: Record<string, string[]> = {
    content: ['Marketing', 'Business'],
    research: ['Business', 'Technical'],
    automate: ['Technical', 'Business'],
    learn: ['Technical', 'Marketing'],
};

// Role → Bundle affinity
const ROLE_BUNDLE_AFFINITY: Record<string, string[]> = {
    marketer: ['content-engine', 'research-studio'],
    developer: ['data-analyst', 'project-kickstart'],
    manager: ['research-studio', 'project-kickstart'],
    creator: ['content-engine', 'project-kickstart'],
    researcher: ['research-studio', 'data-analyst'],
    other: ['project-kickstart', 'content-engine'],
};

/**
 * Score a bundle based on user preferences
 */
function scoreBundleMatch(bundle: Bundle, preferences: UserPreferences): number {
    let score = 0;

    // Role affinity
    const affineBundles = ROLE_BUNDLE_AFFINITY[preferences.role] || [];
    if (affineBundles.includes(bundle.id)) {
        score += 3;
    }

    // Goal category match
    const goalCategories = GOAL_CATEGORY_MAP[preferences.goal] || [];
    if (goalCategories.includes(bundle.category)) {
        score += 2;
    }

    // Experience level adjustment
    // Beginners prefer simpler bundles (fewer skills)
    // Experts prefer comprehensive bundles (more skills)
    const experienceNormalized = preferences.experience / 100;
    const skillComplexity = bundle.skills.length / 4; // Normalize to ~0-1

    if (experienceNormalized < 0.3 && skillComplexity < 0.5) {
        score += 1; // Beginners like simpler bundles
    } else if (experienceNormalized > 0.7 && skillComplexity > 0.5) {
        score += 1; // Experts like comprehensive bundles
    }

    return score;
}

/**
 * Get recommended bundles using heuristic scoring
 */
function getHeuristicRecommendations(preferences: UserPreferences, count: number = 2): Bundle[] {
    const scored = allBundles.map(bundle => ({
        bundle,
        score: scoreBundleMatch(bundle, preferences),
    }));

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, count).map(s => s.bundle);
}

/**
 * Hook for getting AI-powered recommendations
 * 
 * @example
 * const { getRecommendations, bundles, isLoading } = useAIRecommendations();
 * await getRecommendations({ role: 'developer', goal: 'automate', experience: 75 });
 */
export function useAIRecommendations() {
    const [result, setResult] = useState<RecommendationResult>({
        bundles: [],
        reasoning: undefined,
        isLoading: false,
        error: null,
    });

    const getRecommendations = useCallback(async (
        preferences: UserPreferences,
        options?: { useAI?: boolean; count?: number }
    ) => {
        const { useAI = false, count = 2 } = options || {};

        setResult(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            if (useAI) {
                // Future: Call Claude API for personalized recommendations
                // const response = await fetch('/api/ai/recommend-bundles', {
                //     method: 'POST',
                //     body: JSON.stringify(preferences),
                // });
                // const data = await response.json();
                // setResult({ bundles: data.bundles, reasoning: data.reasoning, isLoading: false, error: null });

                // For now, fall back to heuristic
                console.log('[useAIRecommendations] AI mode not yet implemented, using heuristics');
            }

            // Use heuristic matching
            const recommended = getHeuristicRecommendations(preferences, count);
            setResult({
                bundles: recommended,
                reasoning: `Based on your ${preferences.role} role and ${preferences.goal} goals`,
                isLoading: false,
                error: null,
            });

            return recommended;
        } catch (error: any) {
            setResult(prev => ({
                ...prev,
                isLoading: false,
                error: error.message || 'Failed to get recommendations',
            }));
            return [];
        }
    }, []);

    return {
        ...result,
        getRecommendations,
    };
}

export default useAIRecommendations;
