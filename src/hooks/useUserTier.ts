'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { getUserTier } from '@/lib/api/organizationApi';

export type UserTier = 'individual' | 'enterprise';

export function useUserTier(): { tier: UserTier; loading: boolean } {
    const { user } = useAuth();
    const [tier, setTier] = useState<UserTier>('individual');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkTier() {
            if (!user?.id) {
                setTier('individual');
                setLoading(false);
                return;
            }

            try {
                const userTier = await getUserTier(user.id);
                setTier(userTier);
            } catch (error) {
                console.error('Error checking user tier:', error);
                setTier('individual');
            } finally {
                setLoading(false);
            }
        }

        checkTier();
    }, [user?.id]);

    return { tier, loading };
}
