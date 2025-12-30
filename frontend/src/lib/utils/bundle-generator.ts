import JSZip from 'jszip';
import yaml from 'js-yaml';
import { supabase } from '@/lib/supabase';
import type { Skill } from '@/types/skill.types';

/**
 * Slugify a name for Claude Skills spec compliance
 */
function slugifyName(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 64);
}

/**
 * Generate the Master Trigger Index table (ciq-facets pattern)
 */
function generateTriggerIndex(skills: Skill[]): string {
    const rows = skills.map((skill) => {
        const triggers = skill.triggers?.map(t => `"${t}"`).join(', ') || 'N/A';
        const id = slugifyName(skill.name);
        return `| ${triggers} | ${id} |`;
    });

    return `| Triggers | Skill ID |
|----------|----------|
${rows.join('\n')}`;
}

/**
 * Generate a single skill definition section
 */
function generateSkillSection(skill: Skill): string {
    const id = slugifyName(skill.name);
    const triggers = skill.triggers?.map(t => `"${t}"`).join(', ') || 'N/A';

    return `### Skill: ${skill.name} (${id})
**Category:** ${skill.category || 'General'}
**Triggers:** ${triggers}

**Instructions:**
${skill.instructions}

---`;
}

/**
 * Generate the combined SKILL.md for a bundle (single file, ciq-facets pattern)
 */
function generateBundleSkillMd(bundleName: string, skills: Skill[]): string {
    const slugName = slugifyName(bundleName);

    // YAML frontmatter
    const frontmatter = yaml.dump({
        name: slugName,
        description: `${bundleName} - A bundle of ${skills.length} skills`,
    }, { indent: 2, lineWidth: 80 });

    // Trigger index
    const triggerIndex = generateTriggerIndex(skills);

    // Skill definitions
    const skillDefinitions = skills.map(generateSkillSection).join('\n\n');

    return `---
${frontmatter}---

# ${bundleName}

A curated bundle of ${skills.length} skills designed to work together.

## USAGE INSTRUCTIONS

This skill bundle contains ${skills.length} skills. Claude will automatically route your request to the appropriate skill based on trigger phrases.

## MASTER TRIGGER INDEX

${triggerIndex}

## SKILL DEFINITIONS

${skillDefinitions}

---

*Generated with GetClaudeSkills*
`;
}

/**
 * Generate README for the bundle
 */
function generateBundleReadme(bundleName: string, skills: Skill[]): string {
    return `# ${bundleName}

A curated bundle of ${skills.length} skills.

## Included Skills

${skills.map(s => `- **${s.name}** - ${s.description || 'No description'}`).join('\n')}

## Installation

1. Go to [Claude.ai](https://claude.ai)
2. Navigate to Skills
3. Click "Add Skill"
4. Upload the \`SKILL.md\` file from this folder (or the .skill file directly)

## Folder Structure

- \`SKILL.md\` - Main skill file (required)
- \`README.md\` - This file

---

*Generated with GetClaudeSkills*
`;
}

/**
 * Generates a single ZIP containing bundled skills as ONE SKILL.md
 * Uses the ciq-facets pattern with Master Trigger Index
 * @returns Blob with .skill extension (same as .zip, just renamed)
 */
export async function generateBundleZip(bundleName: string, skillNames: string[]): Promise<Blob> {
    const zip = new JSZip();

    if (!supabase) {
        throw new Error('Supabase not configured');
    }

    // Fetch skill data from user_skills table (where seed data lives)
    console.log('[Bundle Generator] Searching for skills:', skillNames);
    const { data: skillsData, error } = await supabase
        .from('user_skills')
        .select('*')
        .in('name', skillNames);

    console.log('[Bundle Generator] Query result:', { count: skillsData?.length, error });

    if (error) {
        throw new Error(`Failed to fetch bundle skills: ${error.message}`);
    }

    if (!skillsData || skillsData.length === 0) {
        throw new Error('No skills found for this bundle');
    }

    // Convert to Skill type
    const skills: Skill[] = skillsData.map(s => ({
        name: s.name,
        description: s.description,
        category: s.category,
        tags: s.tags || [],
        triggers: s.triggers || [],
        instructions: s.instructions,
        resources: s.resources || [],
    }));

    // Generate SINGLE SKILL.md with all skills combined (ciq-facets pattern)
    zip.file('SKILL.md', generateBundleSkillMd(bundleName, skills));

    // Generate README
    zip.file('README.md', generateBundleReadme(bundleName, skills));

    // Add resources from all skills
    for (const skill of skills) {
        if (skill.resources && skill.resources.length > 0) {
            for (const resource of skill.resources) {
                zip.file(`${resource.folder}/${resource.filename}`, resource.content || '');
            }
        }
    }

    return await zip.generateAsync({ type: 'blob' });
}

/**
 * Get the correct filename for a bundle download
 * Uses .skill extension instead of .zip
 */
export function getBundleFilename(bundleName: string): string {
    const slugName = slugifyName(bundleName);
    return `${slugName}.skill`;
}
