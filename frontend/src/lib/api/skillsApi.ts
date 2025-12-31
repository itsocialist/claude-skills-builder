import { supabase } from '@/lib/supabase';
import type { Skill, SkillResource } from '@/types/skill.types';

export interface SavedSkill extends Skill {
    id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
    // Analytics fields
    view_count?: number;
    download_count?: number;
    last_used_at?: string;
}

/**
 * Fetch all skills for a user
 */
export async function fetchUserSkills(userId: string): Promise<SavedSkill[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('user_skills')
        .select(`
            *,
            stats:skill_stats(view_count, download_count, copy_count, updated_at)
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error fetching skills:', error);
        return [];
    }

    return data || [];
}

/**
 * Get a single skill by ID
 */
export async function getSkillById(skillId: string): Promise<SavedSkill | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('user_skills')
        .select(`
            *,
            stats:skill_stats(view_count, download_count, copy_count, updated_at)
        `)
        .eq('id', skillId)
        .single();

    if (error) {
        console.error('Error fetching skill:', error);
        return null;
    }

    return data;
}

/**
 * Save a new skill
 */
export async function saveSkill(userId: string, skill: Skill): Promise<SavedSkill | null> {
    if (!supabase) return null;

    // ---------- Validation ----------
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB per file
    const MAX_TOTAL_SIZE = 5 * 1024 * 1024; // 5 MB per skill
    let totalSize = 0;
    if (skill.resources) {
        for (const r of skill.resources) {
            const size = r.size_bytes ?? (r.content ? new TextEncoder().encode(r.content).length : 0);
            if (size > MAX_FILE_SIZE) {
                console.error(`Resource ${r.filename} exceeds per‑file limit of 1 MB`);
                return null;
            }
            totalSize += size;
        }
        if (totalSize > MAX_TOTAL_SIZE) {
            console.error('Total resources size exceeds 5 MB limit');
            return null;
        }
    }

    // ---------- Upload resources ----------
    const uploadedResources: SkillResource[] = [];
    if (skill.resources) {
        for (const r of skill.resources) {
            // If already uploaded, keep existing info
            if (r.storage_path) {
                uploadedResources.push(r);
                continue;
            }
            const bucket = supabase.storage.from('skill_resources');
            const filePath = `${userId}/${skill.name}/${r.filename}`;
            const { error: uploadError } = await bucket.upload(filePath, r.content ?? '', {
                upsert: true,
                contentType: r.mime_type ?? 'application/octet-stream',
            });
            if (uploadError) {
                console.error('Error uploading resource', r.filename, uploadError);
                return null;
            }
            const storagePath = `skill_resources/${filePath}`;
            uploadedResources.push({
                ...r,
                storage_path: storagePath,
                size_bytes: r.size_bytes ?? (r.content ? new TextEncoder().encode(r.content).length : 0),
            });
        }
    }

    // ---------- Insert skill record ----------
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
            resources: uploadedResources,
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

    // Only include fields that exist in the database table
    const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
    };

    // Valid database columns for user_skills table
    if (skill.name !== undefined) updateData.name = skill.name;
    if (skill.description !== undefined) updateData.description = skill.description;
    if (skill.category !== undefined) updateData.category = skill.category;
    if (skill.tags !== undefined) updateData.tags = skill.tags;
    if (skill.triggers !== undefined) updateData.triggers = skill.triggers;
    if (skill.instructions !== undefined) updateData.instructions = skill.instructions;
    if (skill.resources !== undefined) updateData.resources = skill.resources;

    const { data, error } = await supabase
        .from('user_skills')
        .update(updateData)
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

/**
 * Track skill view - increment view count and update last_used_at
 */
export async function trackSkillView(skillId: string): Promise<void> {
    if (!supabase) return;

    // Use RPC for atomic increment, or simple update
    const { error } = await supabase.rpc('increment_skill_view', { skill_id: skillId });

    // Fallback if RPC doesn't exist yet
    if (error && error.message.includes('function')) {
        await supabase
            .from('user_skills')
            .update({ last_used_at: new Date().toISOString() })
            .eq('id', skillId);
    }
}

/**
 * Track skill download - increment download count and update last_used_at
 */
export async function trackSkillDownload(skillId: string): Promise<void> {
    if (!supabase) return;

    // Use RPC for atomic increment, or simple update
    const { error } = await supabase.rpc('increment_skill_download', { skill_id: skillId });

    // Fallback if RPC doesn't exist yet
    if (error && error.message.includes('function')) {
        await supabase
            .from('user_skills')
            .update({ last_used_at: new Date().toISOString() })
            .eq('id', skillId);
    }
}
