import { NextRequest, NextResponse } from 'next/server';

interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
    info: {
        name?: string;
        description?: string;
        triggers?: string[];
        resourceCount?: number;
    };
}

function parseSkillContent(content: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const info: ValidationResult['info'] = {};

    // Check for YAML frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

    if (!frontmatterMatch) {
        errors.push('Missing YAML frontmatter (---...---)');
    } else {
        const frontmatter = frontmatterMatch[1];

        // Parse name
        const nameMatch = frontmatter.match(/name:\s*["']?([^"'\n]+)["']?/);
        if (nameMatch) {
            info.name = nameMatch[1].trim();
        } else {
            errors.push('Missing required field: name');
        }

        // Parse description
        const descMatch = frontmatter.match(/description:\s*["']?([^"'\n]+)["']?/);
        if (descMatch) {
            info.description = descMatch[1].trim();
        } else {
            warnings.push('Missing recommended field: description');
        }

        // Parse triggers
        const triggersMatch = frontmatter.match(/triggers:\s*\n((?:\s+-\s*.+\n?)+)/);
        if (triggersMatch) {
            const triggers = triggersMatch[1]
                .split('\n')
                .map(line => line.replace(/^\s*-\s*["']?/, '').replace(/["']?\s*$/, ''))
                .filter(t => t.length > 0);
            info.triggers = triggers;

            if (triggers.length === 0) {
                warnings.push('Triggers array is empty');
            }
        } else {
            warnings.push('Missing recommended field: triggers');
        }
    }

    // Check for instructions section
    const instructionsMatch = content.match(/^#\s*(Instructions|Overview|Usage)/im);
    if (!instructionsMatch) {
        warnings.push('No clear instructions section found (expected # Instructions heading)');
    }

    // Check content length
    if (content.length < 100) {
        warnings.push('Skill content is very short - consider adding more detail');
    }

    // Security checks
    if (content.includes('eval(') || content.includes('exec(')) {
        errors.push('Security issue: Dynamic code execution detected');
    }

    if (content.includes('document.cookie') || content.includes('localStorage')) {
        warnings.push('Security note: Client-side storage access detected');
    }

    const urlPattern = /https?:\/\/[^\s"']+/g;
    const urls = content.match(urlPattern);
    if (urls && urls.length > 0) {
        warnings.push(`External URLs detected (${urls.length}): Review for security`);
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        info,
    };
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const content = formData.get('content') as string | null;

        let skillContent = '';

        if (file) {
            if (file.name.endsWith('.md')) {
                skillContent = await file.text();
            } else if (file.name.endsWith('.zip')) {
                // For ZIP files, we'd need to extract and find SKILL.md
                // For now, return a placeholder response
                return NextResponse.json({
                    valid: false,
                    errors: ['ZIP file analysis coming soon. Please upload SKILL.md directly for now.'],
                    warnings: [],
                    info: {},
                });
            } else {
                return NextResponse.json({
                    valid: false,
                    errors: ['Unsupported file type. Please upload a .md or .zip file.'],
                    warnings: [],
                    info: {},
                });
            }
        } else if (content) {
            skillContent = content;
        } else {
            return NextResponse.json({
                valid: false,
                errors: ['No file or content provided'],
                warnings: [],
                info: {},
            }, { status: 400 });
        }

        const result = parseSkillContent(skillContent);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Inspector error:', error);
        return NextResponse.json({
            valid: false,
            errors: ['Internal server error during analysis'],
            warnings: [],
            info: {},
        }, { status: 500 });
    }
}
