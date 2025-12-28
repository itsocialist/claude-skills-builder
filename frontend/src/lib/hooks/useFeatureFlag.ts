'use client';

import { useState, useEffect } from 'react';
import { FlagKey, FlagState } from '@/lib/flags';

// Simple hook to check if a feature is enabled for the current user
// In a real app, this would fetch from an API that checks the user's role against the flag state
export function useFeatureFlag(key: FlagKey) {
    const [enabled, setEnabled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    // For MVP, we assume public visibility check largely happens server-side or via static props
    // But for client-side navigation, we need to know.
    // We'll implement a simple API route check later.
    // For now, let's just return a safe default (false) while loading,
    // and maybe fetching from a hypothetical endpoint or context.

    // Actually, for the implementation plan, we need "Client-side hook useFeatureFlag reacts to changes".
    // This implies we need an API endpoint to fetch flag status for the *current user*.

    useEffect(() => {
        // Mock implementation for now to unblock UI dev
        // TODO: Connect to /api/features?key=...
        setLoading(false);
    }, [key]);

    return { enabled, loading };
}
