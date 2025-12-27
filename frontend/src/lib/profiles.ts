import { supabase } from './supabase';
import { Profile } from '@/types/community.types';
import { MarketplaceListing } from '@/types/marketplace.types';

export async function getProfileByUsername(username: string): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
    return data;
}

export async function getProfileListings(userId: string): Promise<MarketplaceListing[]> {
    const { data, error } = await supabase
        .from('market_listings')
        .select('*')
        .eq('creator_id', userId)
        .eq('listing_status', 'active')
        .order('install_count', { ascending: false });

    if (error) {
        console.error('Error fetching listings:', error);
        return [];
    }
    return data as MarketplaceListing[];
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

    if (error) throw error;
}
