import type { Skill } from '@/types/skill.types';

export interface ValidationIssue {
    field: string;
    type: 'error' | 'warning';
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationIssue[];
    warnings: ValidationIssue[];
}

/**
 * Validates a skill against Claude Agent Skills specification
 * See: https://agentskills.io/specification
 */
export function validateSkill(skill: Skill): ValidationResult {
    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];

    // Name validation (required, alphanumeric + hyphens, max 64 chars)
    if (!skill.name || skill.name.trim() === '') {
        errors.push({
            field: 'name',
            type: 'error',
            message: 'Skill name is required',
        });
    } else {
        const slugName = skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        if (slugName.length > 64) {
            errors.push({
                field: 'name',
                type: 'error',
                message: 'Skill name must be 64 characters or less when slugified',
            });
        }
        if (slugName.length === 0) {
            errors.push({
                field: 'name',
                type: 'error',
                message: 'Skill name must contain at least one alphanumeric character',
            });
        }
    }

    // Description validation (required, 1-1024 chars)
    if (!skill.description || skill.description.trim() === '') {
        warnings.push({
            field: 'description',
            type: 'warning',
            message: 'Description is recommended for better discoverability',
        });
    } else if (skill.description.length > 1024) {
        errors.push({
            field: 'description',
            type: 'error',
            message: 'Description must be 1024 characters or less',
        });
    } else if (skill.description.length < 20) {
        warnings.push({
            field: 'description',
            type: 'warning',
            message: 'Consider a more detailed description (at least 20 characters)',
        });
    }

    // Instructions validation
    if (!skill.instructions || skill.instructions.trim() === '') {
        errors.push({
            field: 'instructions',
            type: 'error',
            message: 'Instructions are required',
        });
    } else if (skill.instructions.length < 50) {
        warnings.push({
            field: 'instructions',
            type: 'warning',
            message: 'Instructions seem short. Consider adding more detail.',
        });
    }

    // Context size estimation
    const totalContent = (skill.description || '') + (skill.instructions || '');
    const estimatedTokens = Math.ceil(totalContent.length / 4); // Rough token estimate
    if (estimatedTokens > 10000) {
        warnings.push({
            field: 'instructions',
            type: 'warning',
            message: `Estimated ${estimatedTokens.toLocaleString()} tokens. Consider reducing for better performance.`,
        });
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}

/**
 * Gets a simple status for the sidebar indicator
 */
export function getValidationStatus(result: ValidationResult): 'valid' | 'warning' | 'error' {
    if (result.errors.length > 0) return 'error';
    if (result.warnings.length > 0) return 'warning';
    return 'valid';
}
