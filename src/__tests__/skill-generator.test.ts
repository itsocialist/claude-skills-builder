import { describe, it, expect } from 'vitest';
import { generateSkillZip } from '../lib/utils/skill-generator';
import type { Skill } from '@/types/skill.types';
import JSZip from 'jszip';
import yaml from 'js-yaml';

describe('skill-generator', () => {
    const mockSkill: Skill = {
        name: 'Test Skill',
        description: 'A test description',
        category: 'Testing',
        tags: ['test', 'unit'],
        triggers: ['run test'],
        instructions: '# Test Instructions',
    };

    it('generates a valid zip file with Agent Skills spec compliant frontmatter', async () => {
        const blob = await generateSkillZip(mockSkill);
        expect(blob).toBeDefined();
        expect(blob.type).toBe('application/zip');

        const zip = await JSZip.loadAsync(blob);

        // Check for SKILL.md
        const skillFile = zip.file('SKILL.md');
        expect(skillFile).not.toBeNull();

        const skillContent = await skillFile?.async('string');
        const frontmatterMatch = skillContent?.match(/^---\n([\s\S]*?)\n---/);
        expect(frontmatterMatch).not.toBeNull();

        // Parse frontmatter
        const parsed = yaml.load(frontmatterMatch![1]) as any;

        // Verify name is slugified (lowercase, hyphens)
        expect(parsed.name).toBe('test-skill');
        expect(parsed.description).toBe('A test description');

        // Verify ONLY name and description are at root (per Agent Skills spec)
        expect(Object.keys(parsed)).toEqual(['name', 'description']);

        // Verify no metadata or other unauthorized keys
        expect(parsed.metadata).toBeUndefined();
        expect(parsed.triggers).toBeUndefined();
        expect(parsed.category).toBeUndefined();
        expect(parsed.tags).toBeUndefined();

        expect(skillContent).toContain('# Test Instructions');

        // Check for README.md
        const readmeFile = zip.file('README.md');
        expect(readmeFile).not.toBeNull();
    });
});
