import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import JSZip from 'jszip';
import yaml from 'js-yaml';

// Use service role to bypass RLS
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function slugifyName(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 64);
}

function generateTriggerIndex(skills: { name: string; triggers?: string[] }[]): string {
    const rows = skills.map((skill) => {
        const triggers = skill.triggers?.map(t => `"${t}"`).join(', ') || 'N/A';
        const id = slugifyName(skill.name);
        return `| ${triggers} | ${id} |`;
    });

    return `| Triggers | Skill ID |
|----------|----------|
${rows.join('\n')}`;
}

function generateSkillSection(skill: {
    name: string;
    category?: string;
    triggers?: string[];
    instructions?: string;
}): string {
    const id = slugifyName(skill.name);
    const triggers = skill.triggers?.map(t => `"${t}"`).join(', ') || 'N/A';

    return `### Skill: ${skill.name} (${id})
**Category:** ${skill.category || 'General'}
**Triggers:** ${triggers}

**Instructions:**
${skill.instructions || 'No instructions provided.'}

---`;
}

export async function POST(request: NextRequest) {
    try {
        const { bundleName, skillNames } = await request.json();

        if (!bundleName || !skillNames || !Array.isArray(skillNames)) {
            return NextResponse.json(
                { error: 'bundleName and skillNames array required' },
                { status: 400 }
            );
        }

        console.log('[Bundle API] Generating bundle:', bundleName, 'with skills:', skillNames);

        // Fetch skills using service role (bypasses RLS)
        const { data: skillsData, error } = await supabase
            .from('user_skills')
            .select('name, description, category, tags, triggers, instructions')
            .in('name', skillNames);

        console.log('[Bundle API] Query result:', { count: skillsData?.length, error });

        if (error) {
            return NextResponse.json(
                { error: `Failed to fetch skills: ${error.message}` },
                { status: 500 }
            );
        }

        if (!skillsData || skillsData.length === 0) {
            return NextResponse.json(
                { error: 'No skills found for this bundle' },
                { status: 404 }
            );
        }

        // Generate SKILL.md content
        const slugName = slugifyName(bundleName);
        const frontmatter = yaml.dump({
            name: slugName,
            description: `${bundleName} - A bundle of ${skillsData.length} skills`,
        }, { indent: 2, lineWidth: 80 });

        const triggerIndex = generateTriggerIndex(skillsData);
        const skillDefinitions = skillsData.map(generateSkillSection).join('\n\n');

        const skillMd = `---
${frontmatter}---

# ${bundleName}

A curated bundle of ${skillsData.length} skills designed to work together.

## USAGE INSTRUCTIONS

This skill bundle contains ${skillsData.length} skills. Claude will automatically route your request to the appropriate skill based on trigger phrases.

## MASTER TRIGGER INDEX

${triggerIndex}

## SKILL DEFINITIONS

${skillDefinitions}

---

*Generated with GetClaudeSkills*
`;

        // Generate README
        const readme = `# ${bundleName}

A curated bundle of ${skillsData.length} skills.

## Included Skills

${skillsData.map(s => `- **${s.name}** - ${s.description || 'No description'}`).join('\n')}

## Installation

1. Go to [Claude.ai](https://claude.ai)
2. Navigate to Skills
3. Click "Add Skill"
4. Upload the \`SKILL.md\` file from this folder (or the .skill file directly)

---

*Generated with GetClaudeSkills*
`;

        // Create ZIP
        const zip = new JSZip();
        zip.file('SKILL.md', skillMd);
        zip.file('README.md', readme);

        const zipBlob = await zip.generateAsync({ type: 'arraybuffer' });

        return new NextResponse(zipBlob, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="${slugName}.skill"`,
            },
        });
    } catch (err) {
        console.error('[Bundle API] Error:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
