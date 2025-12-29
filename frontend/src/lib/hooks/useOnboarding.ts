'use client';

import { useState, useEffect } from 'react';

const ONBOARDING_KEY = 'hasSeenOnboarding';

export function useOnboarding() {
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true); // Default true to avoid flash

    useEffect(() => {
        // Check if user has seen onboarding
        const seen = localStorage.getItem(ONBOARDING_KEY);
        setHasSeenOnboarding(seen === 'true');
    }, []);

    const markAsComplete = () => {
        localStorage.setItem(ONBOARDING_KEY, 'true');
        setHasSeenOnboarding(true);
    };

    const reset = () => {
        localStorage.removeItem(ONBOARDING_KEY);
        setHasSeenOnboarding(false);
    };

    return {
        hasSeenOnboarding,
        markAsComplete,
        reset
    };
}
