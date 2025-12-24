import { describe, it, expect } from 'vitest';
import { generateSkillZip } from '../lib/utils/skill-generator';
import type { Skill } from '@/types/skill.types';
import JSZip from 'jszip';

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
        expect(skillContent).toContain('name: Test Skill');
        expect(skillContent).toContain('triggers:');
        expect(skillContent).toContain('- run test');
        expect(skillContent).toContain('# Test Instructions');

        // Check for README.md
        const readmeFile = zip.file('README.md');
        expect(readmeFile).not.toBeNull();
    });
});
