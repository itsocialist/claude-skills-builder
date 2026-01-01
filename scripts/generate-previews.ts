#!/usr/bin/env npx tsx

/**
 * Preview Generation Script
 * 
 * Generates preview images for marketplace listings by:
 * 1. Fetching listings without preview images
 * 2. Using Claude to generate realistic example outputs based on skill instructions
 * 3. Rendering the output through the preview-renderer page
 * 4. Capturing screenshots with Puppeteer
 * 5. Uploading to Supabase storage and updating the listing
 * 
 * Usage: npx tsx scripts/generate-previews.ts
 * 
 * Requirements:
 * - ANTHROPIC_API_KEY environment variable
 * - Supabase credentials in .env
 * - Local dev server running on port 3001
 */

import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from frontend/.env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ANTHROPIC_API_KEY = process.env.NEXT_PUBLIC_PLATFORM_CLAUDE_KEY || process.env.ANTHROPIC_API_KEY!;
const RENDERER_BASE_URL = process.env.RENDERER_URL || 'http://localhost:3001/internal/preview-renderer';

// Category to visual type mapping
const CATEGORY_TYPE_MAP: Record<string, string> = {
    'Real Estate': 'email',
    'Marketing': 'claude',
    'Business': 'word',
    'Content Writing': 'word',
    'Technical': 'ide',
    'Personal': 'browser',
    'Analytics': 'browser',
    'default': 'word'
};

interface MarketListing {
    id: string;
    skill_id: string;
    title: string;
    description: string;
    category: string;
    preview_image_url: string | null;
    example_output: string | null;
}

interface UserSkill {
    id: string;
    instructions: string;
    description: string;
}

async function main() {
    console.log('🚀 Starting preview generation...\n');

    // Initialize clients
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

    // Fetch listings without preview images
    const { data: listings, error } = await supabase
        .from('market_listings')
        .select('id, skill_id, title, description, category, preview_image_url, example_output')
        .eq('listing_status', 'active');

    if (error) {
        console.error('❌ Failed to fetch listings:', error);
        process.exit(1);
    }

    if (!listings || listings.length === 0) {
        console.log('✅ All listings already have preview images!');
        // return; // Don't return yet, we still need to process templates
    }

    // Launch browser
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Create temp directory for screenshots
    const tempDir = path.join(process.cwd(), '.preview-temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    // --- PROCESS LISTINGS ---
    console.log(`Found ${listings?.length || 0} listings to process`);

    /* 
    for (const listing of listings as MarketListing[]) {
        // ... (listings loop commented out for speed)
    }
    */
    console.log('Skipping listings generation to focus on templates...');

    // --- PROCESS TEMPLATES ---
    const { data: templates, error: templatesError } = await supabase
        .from('templates')
        .select('id, name, description, category, sample_output, preview_image_url');

    if (templatesError) {
        console.error('Error fetching templates:', templatesError);
    } else {
        console.log(`Found ${templates?.length || 0} templates to process`);
        for (const template of templates as Template[]) {
            // Skip if already has a preview image
            if (template.preview_image_url) {
                console.log(`\n📝 Processing template: ${template.name} (already has preview, skipping)`);
                continue;
            }

            console.log(`\n📝 Processing template: ${template.name}`);

            try {
                // Generate example output if not present
                let exampleOutput = template.sample_output;
                if (!exampleOutput) {
                    console.log(`  🤖 Generating example output with Claude...`);
                    const prompt = `You are generating a realistic example output for a template.

## Template Information
- **Name**: ${template.name}
- **Description**: ${template.description}
- **Category**: ${template.category}

## Task
Generate a realistic, high-quality example of what this template would produce. 
- For email-type outputs, include subject line and full body
- For documents, use proper markdown formatting with headers
- For technical/code outputs, include actual code or technical content
- For reports/analysis, include data tables and bullet points
- Make it look professional and complete

Generate ONLY the example output content, no explanations or meta-commentary.`;

                    const response = await anthropic.messages.create({
                        model: 'claude-sonnet-4-20250514', // Using the same model as generateExampleOutput
                        max_tokens: 2000,
                        messages: [{ role: 'user', content: prompt }]
                    });

                    const textBlock = response.content.find(block => block.type === 'text');
                    exampleOutput = textBlock ? textBlock.text : '';

                    // Save to database
                    await supabase
                        .from('templates')
                        .update({ sample_output: exampleOutput })
                        .eq('id', template.id);
                }

                // Determine visual type
                const visualType = CATEGORY_TYPE_MAP[template.category] || CATEGORY_TYPE_MAP['default'];
                console.log(`  🎨 Using visual type: ${visualType}`);

                // Capture screenshot
                console.log(`  📸 Capturing screenshot...`);
                const screenshotPath = path.join(tempDir, `${template.id}.png`);
                await capturePreview(browser, exampleOutput, visualType, template.name, screenshotPath);

                // Upload to Supabase storage
                console.log(`  ☁️ Uploading to storage...`);
                const imageUrl = await uploadToStorage(supabase, screenshotPath, template.id);
                const cacheBustedUrl = `${imageUrl}?t=${Date.now()}`;

                // Update template with image URL
                await supabase
                    .from('templates')
                    .update({ preview_image_url: cacheBustedUrl })
                    .eq('id', template.id);

                console.log(`  ✅ Done! Preview: ${cacheBustedUrl}`);

            } catch (err) {
                console.error(`  ❌ Failed:`, err);
            }
        }
    }

    await browser.close();

    // Cleanup temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });

    console.log('\n🎉 Preview generation complete!');
}

async function generateExampleOutput(
    anthropic: Anthropic,
    listing: MarketListing,
    skill: UserSkill
): Promise<string> {
    const prompt = `You are generating a realistic example output for a skill/template.

## Skill Information
- **Title**: ${listing.title}
- **Description**: ${listing.description}
- **Category**: ${listing.category}
- **Instructions**: ${skill.instructions}

## Task
Generate a realistic, high-quality example of what this skill would produce. 
- For email-type outputs, include subject line and full body
- For documents, use proper markdown formatting with headers
- For technical/code outputs, include actual code or technical content
- For reports/analysis, include data tables and bullet points
- Make it look professional and complete

Generate ONLY the example output content, no explanations or meta-commentary.`;

    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
    });

    const textBlock = response.content.find(block => block.type === 'text');
    return textBlock ? textBlock.text : '';
}

async function capturePreview(
    browser: puppeteer.Browser,
    content: string,
    type: string,
    title: string,
    outputPath: string
): Promise<void> {
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 1000, deviceScaleFactor: 3 });
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);

    // Encode content as base64 for URL safety
    const encodedContent = Buffer.from(content).toString('base64');
    const url = `${RENDERER_BASE_URL}?type=${type}&title=${encodeURIComponent(title)}&content=${encodeURIComponent(encodedContent)}`;

    await page.goto(url, { waitUntil: 'networkidle0' });

    // Wait for content to render
    await page.waitForSelector('#preview-container', { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 500)); // Extra settle time

    // Capture the preview container - full height
    const element = await page.$('#preview-container > div');

    if (element) {
        await element.screenshot({ path: outputPath, type: 'png' });
    } else {
        // Fallback to full page if selector fails
        await page.screenshot({ path: outputPath, type: 'png', fullPage: true });
    }

    await page.close();
}

async function uploadToStorage(
    supabase: ReturnType<typeof createClient>,
    filePath: string,
    listingId: string
): Promise<string> {
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = `previews/${listingId}.png`;

    const { error } = await supabase.storage
        .from('marketplace-assets')
        .upload(fileName, fileBuffer, {
            contentType: 'image/png',
            upsert: true
        });

    if (error) {
        throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
        .from('marketplace-assets')
        .getPublicUrl(fileName);

    return publicUrl;
}

// Run the script
main().catch(console.error);
