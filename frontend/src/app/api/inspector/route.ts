import { NextRequest, NextResponse } from 'next/server';
import { analyzeSkillContent } from '@/lib/claude-client';

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
    aiAnalysis?: {
        overallScore: number;
        summary: string;
        suggestions: {
            type: 'error' | 'warning' | 'suggestion';
            area: string;
            message: string;
        }[];
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
        const apiKey = formData.get('apiKey') as string | null;
        const useAI = formData.get('useAI') === 'true';

        let skillContent = '';

        if (file) {
            if (file.name.endsWith('.md')) {
                skillContent = await file.text();
            } else if (file.name.endsWith('.zip')) {
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

        // If AI analysis requested and API key provided
        if (useAI && apiKey) {
            try {
                const { analysis } = await analyzeSkillContent(apiKey, skillContent);
                result.aiAnalysis = analysis;
            } catch (aiError) {
                console.error('AI analysis error:', aiError);
                result.warnings.push('AI analysis failed. Check your API key.');
            }
        }

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

