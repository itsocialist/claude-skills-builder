import { flag } from '@vercel/flags/next';

export type FlagState = 'DISABLED' | 'ADMIN_ONLY' | 'PUBLIC';

export const FLAG_KEYS = [
    'feature_dashboard',
    'feature_builder',
    'feature_canvas',
    'feature_templates',
    'feature_packages',
    'feature_bundles',
    'feature_inspector',
    'feature_marketplace',
    'feature_generations',
    'feature_organization',
    'feature_myskills',
    'feature_admin',
    'feature_labs',
    'feature_ai_assistant',
    'feature_learn',
    'feature_flow',
] as const;

export type FlagKey = typeof FLAG_KEYS[number];

export const DEFAULT_FLAGS: Record<FlagKey, FlagState> = {
    feature_dashboard: 'PUBLIC',
    feature_builder: 'ADMIN_ONLY',
    feature_canvas: 'ADMIN_ONLY',
    feature_templates: 'PUBLIC',
    feature_packages: 'ADMIN_ONLY',
    feature_bundles: 'PUBLIC',
    feature_inspector: 'PUBLIC',
    feature_marketplace: 'PUBLIC',
    feature_generations: 'PUBLIC',
    feature_organization: 'ADMIN_ONLY',
    feature_myskills: 'PUBLIC',
    feature_admin: 'PUBLIC',
    feature_labs: 'PUBLIC',
    feature_ai_assistant: 'ADMIN_ONLY',
    feature_learn: 'PUBLIC',
    feature_flow: 'PUBLIC',
};

// Emergency Override via Env Var
// Format: OVERRIDE_FEATURE_FLAGS={"feature_builder":"PUBLIC"}
const getOverrideFlags = (): Partial<Record<FlagKey, FlagState>> => {
    try {
        const envVal = process.env.OVERRIDE_FEATURE_FLAGS;
        if (!envVal) return {};
        return JSON.parse(envVal);
    } catch (e) {
        console.error('Failed to parse OVERRIDE_FEATURE_FLAGS', e);
        return {};
    }
};

import { createClient } from '@supabase/supabase-js';

// Setup Supabase Client for Flag Fetching (Service Role for Edge/Middleware access)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Lazy init to avoid issues if envs missing during build
const getSupabase = () => {
    if (!supabaseUrl || !serviceKey) return null;
    return createClient(supabaseUrl, serviceKey, {
        auth: { persistSession: false }
    });
};

export const getFlagValue = async (key: FlagKey): Promise<FlagState> => {
    const overrides = getOverrideFlags();
    if (overrides[key]) return overrides[key]!;

    // Fetch from DB (MVP: Direct fetch, Cache later)
    try {
        const supabase = getSupabase();
        if (!supabase) return DEFAULT_FLAGS[key];

        const { data } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'feature_flags')
            .single();

        const dbFlags = data?.value || {};
        // Merge: DB overwrites Default
        return (dbFlags[key] as FlagState) || DEFAULT_FLAGS[key];

    } catch (e) {
        console.warn(`[Flags] Failed to fetch flag ${key}, utilizing default.`);
        return DEFAULT_FLAGS[key];
    }
};

export const isFeatureEnabled = async (key: FlagKey, isAdmin: boolean): Promise<boolean> => {
    const value = await getFlagValue(key);
    if (value === 'DISABLED') return false;
    if (value === 'ADMIN_ONLY') return isAdmin;
    return true; // PUBLIC
};
