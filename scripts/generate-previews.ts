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

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;
const RENDERER_BASE_URL = process.env.RENDERER_URL || 'http://localhost:3001/internal/preview-renderer';

// Category to visual type mapping
const CATEGORY_TYPE_MAP: Record<string, string> = {
    'Real Estate': 'email',
    'Marketing': 'document',
    'Business': 'document',
    'Content Writing': 'document',
    'Technical': 'code',
    'Personal': 'document',
    'Analytics': 'dashboard',
    'default': 'document'
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
        .is('preview_image_url', null)
        .eq('listing_status', 'active');

    if (error) {
        console.error('❌ Failed to fetch listings:', error);
        process.exit(1);
    }

    if (!listings || listings.length === 0) {
        console.log('✅ All listings already have preview images!');
        return;
    }

    console.log(`📋 Found ${listings.length} listings without previews\n`);

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

    for (const listing of listings as MarketListing[]) {
        console.log(`\n📝 Processing: ${listing.title}`);

        try {
            // Get full skill instructions
            const { data: skill } = await supabase
                .from('user_skills')
                .select('instructions, description')
                .eq('id', listing.skill_id)
                .single();

            if (!skill) {
                console.log(`  ⚠️ Skill not found, skipping`);
                continue;
            }

            // Generate example output if not present
            let exampleOutput = listing.example_output;
            if (!exampleOutput) {
                console.log(`  🤖 Generating example output with Claude...`);
                exampleOutput = await generateExampleOutput(anthropic, listing, skill);

                // Save to database
                await supabase
                    .from('market_listings')
                    .update({ example_output: exampleOutput })
                    .eq('id', listing.id);
            }

            // Determine visual type
            const visualType = CATEGORY_TYPE_MAP[listing.category] || CATEGORY_TYPE_MAP['default'];
            console.log(`  🎨 Using visual type: ${visualType}`);

            // Capture screenshot
            console.log(`  📸 Capturing screenshot...`);
            const screenshotPath = path.join(tempDir, `${listing.id}.png`);
            await capturePreview(browser, exampleOutput, visualType, listing.title, screenshotPath);

            // Upload to Supabase storage
            console.log(`  ☁️ Uploading to storage...`);
            const imageUrl = await uploadToStorage(supabase, screenshotPath, listing.id);

            // Update listing with image URL
            await supabase
                .from('market_listings')
                .update({ preview_image_url: imageUrl })
                .eq('id', listing.id);

            console.log(`  ✅ Done! Preview: ${imageUrl}`);

        } catch (err) {
            console.error(`  ❌ Failed:`, err);
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
        model: 'claude-3-5-sonnet-20241022',
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
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 });

    // Encode content as base64 for URL safety
    const encodedContent = Buffer.from(content).toString('base64');
    const url = `${RENDERER_BASE_URL}?type=${type}&title=${encodeURIComponent(title)}&content=${encodedContent}`;

    await page.goto(url, { waitUntil: 'networkidle0' });

    // Wait for content to render
    await page.waitForSelector('#preview-container', { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 500)); // Extra settle time

    // Capture the preview container
    const element = await page.$('#preview-container > div');
    if (element) {
        await element.screenshot({ path: outputPath, type: 'png' });
    } else {
        await page.screenshot({ path: outputPath, type: 'png' });
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
