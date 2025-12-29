import JSZip from 'jszip';
import { supabase } from '@/lib/supabase';
import { generateSkillZip } from './skill-generator';
import type { Skill } from '@/types/skill.types';

/**
 * Generates a single ZIP containing multiple skills as separate folders
 */
export async function generateBundleZip(bundleName: string, skillNames: string[]): Promise<Blob> {
    const zip = new JSZip();
    const bundleFolder = zip.folder(bundleName.toLowerCase().replace(/\s+/g, '-'));

    if (!supabase) {
        throw new Error('Supabase not configured');
    }

    // Fetch skill data from Supabase
    const { data: skillsData, error } = await supabase
        .from('user_skills')
        .select('*')
        .in('name', skillNames);

    if (error) {
        throw new Error(`Failed to fetch bundle skills: ${error.message}`);
    }

    if (!skillsData || skillsData.length === 0) {
        throw new Error('No skills found for this bundle');
    }

    for (const skillData of skillsData) {
        const skill: Skill = {
            name: skillData.name,
            description: skillData.description,
            category: skillData.category,
            tags: skillData.tags || [],
            triggers: skillData.triggers || [],
            instructions: skillData.instructions,
            resources: skillData.resources || [],
        };

        // We can't easily reuse generateSkillZip directly because it returns a Blob
        // Let's create a helper that returns the JSZip instance or adds to one
        await addSkillToZip(bundleFolder!, skill);
    }

    return await zip.generateAsync({ type: 'blob' });
}

async function addSkillToZip(zip: JSZip, skill: Skill) {
    const safeName = skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const skillFolder = zip.folder(safeName);

    if (!skillFolder) return;

    // Frontmatter instructions (SKILL.md)
    const frontmatter = `---
name: ${safeName}
description: ${skill.description || ''}
---

${skill.instructions}`;

    skillFolder.file('SKILL.md', frontmatter);

    // Basic README
    const readme = `# ${skill.name}\n\n${skill.description}\n\nGenerated with GetClaudeSkills`;
    skillFolder.file('README.md', readme);

    // Resources
    if (skill.resources && skill.resources.length > 0) {
        for (const res of skill.resources) {
            skillFolder.file(`${res.folder}/${res.filename}`, res.content || '');
        }
    }
}
