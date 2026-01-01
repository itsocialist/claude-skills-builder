import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ANTHROPIC_API_KEY = process.env.NEXT_PUBLIC_PLATFORM_CLAUDE_KEY || process.env.ANTHROPIC_API_KEY!;

// Category to visual type mapping
const CATEGORY_TYPE_MAP: Record<string, string> = {
    'Real Estate': 'email',
    'Marketing': 'claude',
    'Business': 'word',
    'Content Writing': 'word',
    'Technical': 'ide',
    'Personal': 'browser',
    'Analytics': 'browser',
    'Engineering': 'ide',
    'Sales': 'word',
    'Product': 'word',
    'default': 'word'
};

async function capturePreview(
    browser: puppeteer.Browser,
    output: string,
    visualType: string,
    title: string,
    outputPath: string
) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 3 });

    const rendererUrl = process.env.RENDERER_URL || 'http://localhost:3001/internal/preview-renderer';
    const params = new URLSearchParams({
        output,
        type: visualType,
        title,
    });

    await page.goto(`${rendererUrl}?${params}`, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.screenshot({ path: outputPath, type: 'png' });
    await page.close();
}

async function uploadToStorage(
    supabase: ReturnType<typeof createClient>,
    imagePath: string,
    skillId: string
): Promise<string> {
    const fileBuffer = fs.readFileSync(imagePath);
    const fileName = `previews/skill-${skillId}.png`;

    const { error } = await supabase.storage
        .from('marketplace-assets')
        .upload(fileName, fileBuffer, {
            contentType: 'image/png',
            upsert: true,
        });

    if (error) throw error;

    const { data: urlData } = supabase.storage
        .from('marketplace-assets')
        .getPublicUrl(fileName);

    return urlData.publicUrl;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { skillId } = body;

        if (!skillId) {
            return NextResponse.json({ error: 'skillId is required' }, { status: 400 });
        }

        // Initialize Supabase with service role
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

        // Fetch the skill
        const { data: skill, error: fetchError } = await supabase
            .from('user_skills')
            .select('id, name, description, category, instructions, sample_output')
            .eq('id', skillId)
            .single();

        if (fetchError || !skill) {
            return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
        }

        // Generate sample output if not present
        let sampleOutput = skill.sample_output;
        if (!sampleOutput && ANTHROPIC_API_KEY) {
            const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

            const prompt = `You are generating a realistic example output for a Claude skill.
            
Skill Name: ${skill.name}
Skill Description: ${skill.description}
Category: ${skill.category}

Based on the skill's purpose, generate a realistic, professional example of what this skill would produce.
Keep it concise but substantive (2-4 paragraphs or equivalent structured content).
Use markdown formatting where appropriate.`;

            const response = await anthropic.messages.create({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1024,
                messages: [{ role: 'user', content: prompt }],
            });

            const textBlock = response.content.find(block => block.type === 'text');
            sampleOutput = textBlock ? (textBlock as { type: 'text'; text: string }).text : '';

            // Save sample output to skill
            await supabase
                .from('user_skills')
                .update({ sample_output: sampleOutput })
                .eq('id', skillId);
        }

        if (!sampleOutput) {
            return NextResponse.json({ error: 'Could not generate sample output' }, { status: 500 });
        }

        // Determine visual type based on category
        const visualType = CATEGORY_TYPE_MAP[skill.category] || CATEGORY_TYPE_MAP['default'];

        // Launch browser and capture screenshot
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'preview-'));
        const screenshotPath = path.join(tempDir, `${skillId}.png`);

        try {
            await capturePreview(browser, sampleOutput, visualType, skill.name, screenshotPath);

            // Upload to storage
            const imageUrl = await uploadToStorage(supabase, screenshotPath, skillId);
            const cacheBustedUrl = `${imageUrl}?t=${Date.now()}`;

            // Update skill with preview URL
            await supabase
                .from('user_skills')
                .update({ preview_image_url: cacheBustedUrl })
                .eq('id', skillId);

            return NextResponse.json({
                success: true,
                preview_image_url: cacheBustedUrl,
            });
        } finally {
            await browser.close();
            // Cleanup temp files
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    } catch (error) {
        console.error('Error generating preview:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to generate preview' },
            { status: 500 }
        );
    }
}
