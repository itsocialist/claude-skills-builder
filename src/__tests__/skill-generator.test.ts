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

    it('generates a valid zip file', async () => {
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
        expect(parsed.name).toBe('Test Skill');
        expect(parsed.description).toBe('A test description');

        // Verify metadata nesting
        expect(parsed.metadata).toBeDefined();
        expect(parsed.metadata.triggers).toContain('run test');
        expect(parsed.metadata.category).toBe('Testing');
        expect(parsed.metadata.tags).toContain('unit');

        // Verify root does not contain unauthorized keys
        expect(parsed.triggers).toBeUndefined();
        expect(parsed.category).toBeUndefined();
        expect(parsed.tags).toBeUndefined();

        expect(skillContent).toContain('# Test Instructions');

        // Check for README.md
        const readmeFile = zip.file('README.md');
        expect(readmeFile).not.toBeNull();
    });
});
