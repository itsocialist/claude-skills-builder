import JSZip from 'jszip';
import yaml from 'js-yaml';
import type { Package, PackageSkill } from '@/types/package.types';

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
 * Generate the Master Trigger Index table
 */
function generateTriggerIndex(skills: PackageSkill[]): string {
    const rows = skills.map((ps) => {
        const triggers = ps.skill.triggers.map(t => `"${t}"`).join(', ');
        const id = slugifyName(ps.skill.name);
        return `| ${triggers} | ${id} | ${ps.type} |`;
    });

    return `| Triggers | Skill ID | Type |
|----------|----------|------|
${rows.join('\n')}`;
}

/**
 * Generate a single skill definition section
 */
function generateSkillSection(ps: PackageSkill): string {
    const id = slugifyName(ps.skill.name);
    return `### Skill: ${ps.skill.name} (${id})
**Type:** ${ps.type}
**Category:** ${ps.skill.category}
**Triggers:** ${ps.skill.triggers.map(t => `"${t}"`).join(', ')}

**Instructions:**
${ps.skill.instructions}

---`;
}

/**
 * Generate the combined SKILL.md for a package
 */
function generatePackageSkillMd(pkg: Package): string {
    const slugName = slugifyName(pkg.name || 'skill-bundle');

    // YAML frontmatter
    const frontmatter = yaml.dump({
        name: slugName,
        description: pkg.description || `A bundle of ${pkg.skills.length} skills`,
    }, { indent: 2, lineWidth: 80 });

    // Trigger index
    const triggerIndex = generateTriggerIndex(pkg.skills);

    // Skill definitions
    const skillDefinitions = pkg.skills.map(generateSkillSection).join('\n\n');

    return `---
${frontmatter}---

# ${pkg.name}

${pkg.description}

## USAGE INSTRUCTIONS

This skill bundle contains ${pkg.skills.length} skills. Claude will automatically route your request to the appropriate skill based on trigger phrases.

## MASTER TRIGGER INDEX

${triggerIndex}

## SKILL DEFINITIONS

${skillDefinitions}

---

*Generated with ClaudeSkillsFacet*
`;
}

/**
 * Generate README for the package
 */
function generatePackageReadme(pkg: Package): string {
    return `# ${pkg.name}

${pkg.description}

## Included Skills

${pkg.skills.map(ps => `- **${ps.skill.name}** (${ps.type})`).join('\n')}

## Installation

1. Go to [Claude.ai](https://claude.ai)
2. Navigate to Skills
3. Click "Add Skill"
4. Upload the \`SKILL.md\` file from this folder

## Folder Structure

- \`SKILL.md\` - Main skill file (required)
- \`resources/\` - Reference data
- \`templates/\` - Output format templates
- \`examples/\` - Input/output examples

---

*Generated with ClaudeSkillsFacet*
`;
}

/**
 * Generate config.yaml for the package
 */
function generatePackageConfig(pkg: Package): string {
    const slugName = slugifyName(pkg.name || 'skill-bundle');
    return yaml.dump({
        name: slugName,
        version: '1.0.0',
        description: pkg.description,
        skills_count: pkg.skills.length,
        skills: pkg.skills.map(ps => ({
            name: slugifyName(ps.skill.name),
            type: ps.type,
            category: ps.skill.category,
        })),
        compatibility: {
            claude_web: true,
            claude_code: true,
        },
    }, { indent: 2 });
}

/**
 * Generate a ZIP package containing bundled skills and resources
 */
export async function generatePackageZip(pkg: Package): Promise<Blob> {
    const zip = new JSZip();

    // Add SKILL.md
    zip.file('SKILL.md', generatePackageSkillMd(pkg));

    // Add README
    zip.file('README.md', generatePackageReadme(pkg));

    // Add config.yaml
    zip.file('config.yaml', generatePackageConfig(pkg));

    // Add package-level resources
    for (const resource of pkg.resources) {
        zip.file(`${resource.folder}/${resource.filename}`, resource.content || '');
    }

    // Add individual skill resources
    for (const ps of pkg.skills) {
        if (ps.skill.resources && ps.skill.resources.length > 0) {
            for (const resource of ps.skill.resources) {
                zip.file(`${resource.folder}/${resource.filename}`, resource.content || '');
            }
        }
    }

    return await zip.generateAsync({ type: 'blob' });
}
