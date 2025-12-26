import { supabase } from '@/lib/supabase';
import { Template } from '@/types/skill.types';

export async function getTemplates(): Promise<Template[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching templates:', error);
        return [];
    }

    return (data || []).map(row => ({
        id: row.id,
        name: row.name,
        description: row.description || '',
        category: row.category || 'Other',
        tags: row.tags || [],
        triggers: row.triggers || [],
        instructions: row.instructions || '',
        sampleOutput: row.sample_output || undefined,
    }));
}

export async function getTemplateById(id: string): Promise<Template | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;

    return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        category: data.category || 'Other',
        tags: data.tags || [],
        triggers: data.triggers || [],
        instructions: data.instructions || '',
        sampleOutput: data.sample_output || undefined,
    };
}
