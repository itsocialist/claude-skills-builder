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

    // Normalize line endings and trim
    const normalizedContent = content.replace(/\r\n/g, '\n').trim();

    // Check for YAML frontmatter - more flexible regex
    const frontmatterMatch = normalizedContent.match(/^---\s*\n([\s\S]*?)\n---/);

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

        // Parse triggers - support both YAML list and inline array formats
        const triggersListMatch = frontmatter.match(/triggers:\s*\n((?:\s+-\s*.+\n?)+)/);
        const triggersInlineMatch = frontmatter.match(/triggers:\s*\[([^\]]+)\]/);

        if (triggersListMatch) {
            // YAML list format: triggers:\n  - "item"
            const triggers = triggersListMatch[1]
                .split('\n')
                .map(line => line.replace(/^\s*-\s*["']?/, '').replace(/["']?\s*$/, ''))
                .filter(t => t.length > 0);
            info.triggers = triggers;

            if (triggers.length === 0) {
                warnings.push('Triggers array is empty');
            }
        } else if (triggersInlineMatch) {
            // Inline array format: triggers: ["item1", "item2"]
            const triggers = triggersInlineMatch[1]
                .split(',')
                .map(t => t.trim().replace(/^["']/, '').replace(/["']$/, ''))
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
            } else if (file.name.endsWith('.zip') || file.name.endsWith('.skill')) {
                // .skill files are just renamed .zip files - extract SKILL.md
                try {
                    const JSZip = (await import('jszip')).default;
                    const arrayBuffer = await file.arrayBuffer();
                    const zip = await JSZip.loadAsync(arrayBuffer);

                    // Look for SKILL.md in the archive (check root and common locations)
                    const possiblePaths = ['SKILL.md', 'skill.md', 'README.md'];
                    let foundContent: string | null = null;

                    for (const path of possiblePaths) {
                        const zipFile = zip.file(path);
                        if (zipFile) {
                            foundContent = await zipFile.async('string');
                            break;
                        }
                    }

                    // If not found at root, look in any subdirectory
                    if (!foundContent) {
                        const files = Object.keys(zip.files);
                        for (const filePath of files) {
                            if (filePath.toLowerCase().endsWith('skill.md')) {
                                const zipFile = zip.file(filePath);
                                if (zipFile) {
                                    foundContent = await zipFile.async('string');
                                    break;
                                }
                            }
                        }
                    }

                    if (foundContent) {
                        skillContent = foundContent;
                    } else {
                        return NextResponse.json({
                            valid: false,
                            errors: ['No SKILL.md found in archive. Archive should contain a SKILL.md file.'],
                            warnings: [],
                            info: { resourceCount: Object.keys(zip.files).length },
                        });
                    }
                } catch (zipError) {
                    console.error('ZIP extraction error:', zipError);
                    return NextResponse.json({
                        valid: false,
                        errors: ['Failed to read archive. Ensure the file is a valid ZIP or .skill archive.'],
                        warnings: [],
                        info: {},
                    });
                }
            } else {
                return NextResponse.json({
                    valid: false,
                    errors: ['Unsupported file type. Please upload a .md, .zip, or .skill file.'],
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

