import { supabase } from '@/lib/supabase';
import type { Skill } from '@/types/skill.types';

export interface SavedSkill extends Skill {
    id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

/**
 * Fetch all skills for a user
 */
export async function fetchUserSkills(userId: string): Promise<SavedSkill[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error fetching skills:', error);
        return [];
    }

    return data || [];
}

/**
 * Save a new skill
 */
export async function saveSkill(userId: string, skill: Skill): Promise<SavedSkill | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('user_skills')
        .insert({
            user_id: userId,
            name: skill.name,
            description: skill.description,
            category: skill.category,
            tags: skill.tags,
            triggers: skill.triggers,
            instructions: skill.instructions,
            resources: skill.resources || [],
        })
        .select()
        .single();

    if (error) {
        console.error('Error saving skill:', error);
        return null;
    }

    return data;
}

/**
 * Update an existing skill
 */
export async function updateSkill(skillId: string, skill: Partial<Skill>): Promise<SavedSkill | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('user_skills')
        .update({
            ...skill,
            updated_at: new Date().toISOString(),
        })
        .eq('id', skillId)
        .select()
        .single();

    if (error) {
        console.error('Error updating skill:', error);
        return null;
    }

    return data;
}

/**
 * Delete a skill
 */
export async function deleteSkill(skillId: string): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('user_skills')
        .delete()
        .eq('id', skillId);

    if (error) {
        console.error('Error deleting skill:', error);
        return false;
    }

    return true;
}

/**
 * Duplicate a skill
 */
export async function duplicateSkill(skillId: string, userId: string): Promise<SavedSkill | null> {
    if (!supabase) return null;

    // Fetch the original skill
    const { data: original, error: fetchError } = await supabase
        .from('user_skills')
        .select('*')
        .eq('id', skillId)
        .single();

    if (fetchError || !original) {
        console.error('Error fetching skill to duplicate:', fetchError);
        return null;
    }

    // Create a copy
    const { data, error } = await supabase
        .from('user_skills')
        .insert({
            user_id: userId,
            name: `${original.name} (Copy)`,
            description: original.description,
            category: original.category,
            tags: original.tags,
            triggers: original.triggers,
            instructions: original.instructions,
            resources: original.resources,
        })
        .select()
        .single();

    if (error) {
        console.error('Error duplicating skill:', error);
        return null;
    }

    return data;
}
