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
                    document.documentElement.style.setProperty('--primary', hexToHsl(data.primary_color));
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

// Helper to convert HEX to HSL format expected by Shadcn (e.g. "222.2 47.4% 11.2%")
// Note: This is a rough approximation. Shadcn expects space separated H S% L%
function hexToHsl(hex: string): string {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '11 80% 50%'; // Fallback (Orange-ish)

    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    // Return H S% L%
    return `${(h * 360).toFixed(1)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`;
}
