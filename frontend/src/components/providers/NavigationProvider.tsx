'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { NavCategory, NAVIGATION_CATEGORIES, NavItem } from '@/lib/constants/navigation';
import { getSiteSettings, updateSiteSetting } from '@/lib/api/adminApi';
import { useAuth } from '@/components/auth/AuthProvider';

interface NavigationContextType {
    categories: NavCategory[];
    updateCategories: (newCategories: NavCategory[]) => Promise<void>;
    resetToDefault: () => Promise<void>;
    isLoading: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
    const [categories, setCategories] = useState<NavCategory[]>(NAVIGATION_CATEGORIES);
    const [isLoading, setIsLoading] = useState(true);
    const { session, user } = useAuth();
    const isAdmin = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
        .toLowerCase()
        .split(',')
        .includes((user?.email || '').toLowerCase().trim());

    // Helper to merge saved config with local constants (to preserve Icons)
    const mergeConfigWithConstants = (savedConfig: NavCategory[]): NavCategory[] => {
        if (!Array.isArray(savedConfig) || savedConfig.length === 0) return NAVIGATION_CATEGORIES;

        return savedConfig.map(savedCat => {
            // Map items and restore icons from constants
            const mergedItems = savedCat.items
                .map(savedItem => {
                    // Find original item in ANY category in the constant to find its icon
                    // This allows items to be moved between categories and still keep their icon
                    let constantItem: NavItem | undefined;
                    for (const cat of NAVIGATION_CATEGORIES) {
                        const found = cat.items.find(i => i.id === savedItem.id);
                        if (found) {
                            constantItem = found;
                            break;
                        }
                    }

                    // Skip items we can't find icons for (orphaned items)
                    if (!constantItem) {
                        console.warn(`Navigation item "${savedItem.id}" not found in constants, skipping.`);
                        return null;
                    }

                    return {
                        ...savedItem,
                        icon: constantItem.icon, // Always use constant's icon
                    };
                })
                .filter((item): item is NavItem => item !== null); // Filter out nulls

            return {
                ...savedCat,
                items: mergedItems,
            };
        });
    };

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const settings = await getSiteSettings();
                if (settings && settings.navigation_config) {
                    const merged = mergeConfigWithConstants(settings.navigation_config);
                    setCategories(merged);
                }
            } catch (error) {
                console.error('Failed to load navigation config:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadConfig();
    }, []);

    const updateCategories = async (newCategories: NavCategory[]) => {
        // Optimistic update
        setCategories(newCategories);

        if (isAdmin && session?.access_token) {
            try {
                // Strip icons before saving to avoid circular structure/function serialization issues
                const configToSave = newCategories.map(cat => ({
                    ...cat,
                    items: cat.items.map(item => {
                        const { icon, ...rest } = item; // Exclude icon
                        return rest;
                    })
                }));

                await updateSiteSetting(session.access_token, 'navigation_config', configToSave);
            } catch (error) {
                console.error('Failed to save navigation config:', error);
                // Revert on error? For now, we just log.
            }
        }
    };

    const resetToDefault = async () => {
        setCategories(NAVIGATION_CATEGORIES);
        if (isAdmin && session?.access_token) {
            try {
                await updateSiteSetting(session.access_token, 'navigation_config', null); // Or delete
            } catch (error) {
                console.error('Failed to reset navigation:', error);
            }
        }
    };

    return (
        <NavigationContext.Provider value={{ categories, updateCategories, resetToDefault, isLoading }}>
            {children}
        </NavigationContext.Provider>
    );
}

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    // Graceful fallback if used outside provider (e.g., non-/app routes)
    if (context === undefined) {
        return {
            categories: NAVIGATION_CATEGORIES,
            updateCategories: async () => { },
            resetToDefault: async () => { },
            isLoading: false,
        };
    }
    return context;
};
