'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSiteSettings, type SiteSettings } from '@/lib/api/adminApi';

interface SiteSettingsContextType {
    settings: SiteSettings;
    loading: boolean;
    refreshSettings: () => Promise<void>;
}

const DEFAULT_SETTINGS: SiteSettings = {
    site_name: 'GetClaudeSkills',
    primary_color: '#C15F3C',
    categories: ['Marketing', 'HR', 'Engineering', 'Sales', 'Product'],
    menu_items: [],
};

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);

    const refreshSettings = async () => {
        try {
            const data = await getSiteSettings();
            if (data && Object.keys(data).length > 0) {
                setSettings(prev => ({
                    ...prev,
                    ...data,
                    // Ensure arrays are arrays (in case of partial data)
                    categories: Array.isArray(data.categories) ? data.categories : prev.categories,
                    menu_items: Array.isArray(data.menu_items) ? data.menu_items : prev.menu_items,
                }));

                // Update primary color CSS variable
                if (data.primary_color) {
                    document.documentElement.style.setProperty('--primary', data.primary_color);
                    // Update accent color (lighter version) if needed, but Shadcn uses --primary
                }
            }
        } catch (error) {
            console.error('Failed to load site settings', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshSettings();
    }, []);

    return (
        <SiteSettingsContext.Provider value={{ settings, loading, refreshSettings }}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export function useSiteSettings() {
    const context = useContext(SiteSettingsContext);
    if (context === undefined) {
        throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
    }
    return context;
}


