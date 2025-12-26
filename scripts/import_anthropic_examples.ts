import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Official Anthropic Skills from https://github.com/anthropics/skills
const examples = [
    {
        id: crypto.randomUUID(),
        name: 'Internal Communications',
        description: 'A set of resources to help write all kinds of internal communications, using standard professional formats. Use this skill for status reports, leadership updates, 3P updates, company newsletters, FAQs, incident reports, and project updates.',
        category: 'Enterprise',
        tags: ['internal-comms', 'writing', 'business', 'reports'],
        triggers: ['Write an internal communication', 'Create a status report', 'Draft a 3P update'],
        instructions: `## When to use this skill
To write internal communications, use this skill for:
- 3P updates (Progress, Plans, Problems)
- Company newsletters
- FAQ responses
- Status reports
- Leadership updates
- Project updates
- Incident reports

## How to use this skill

To write any internal communication:

1. **Identify the communication type** from the request
2. **Choose the appropriate format**:
    - 3P Updates - For Progress/Plans/Problems team updates
    - Company Newsletter - For company-wide newsletters
    - FAQ Answers - For answering frequently asked questions
    - General Comms - For anything else that doesn't explicitly match
3. **Follow best practices** for formatting, tone, and content gathering

If the communication type doesn't match any existing format, ask for clarification or more context about the desired format.

## Keywords
3P updates, company newsletter, company comms, weekly update, faqs, common questions, updates, internal comms`
    },
    {
        id: crypto.randomUUID(),
        name: 'Brand Guidelines',
        description: "Applies official brand colors and typography to artifacts that benefit from company look-and-feel. Use when brand colors, style guidelines, visual formatting, or company design standards apply.",
        category: 'Design',
        tags: ['branding', 'design', 'visual', 'typography'],
        triggers: ['Apply brand guidelines', 'Use company branding', 'Format with brand colors'],
        instructions: `# Brand Styling

## Overview

To apply official brand identity and style resources, use this skill.

**Keywords**: branding, corporate identity, visual identity, post-processing, styling, brand colors, typography, visual formatting, visual design

## Brand Guidelines

### Colors

**Main Colors:**
- Dark: \`#141413\` - Primary text and dark backgrounds
- Light: \`#faf9f5\` - Light backgrounds and text on dark
- Mid Gray: \`#b0aea5\` - Secondary elements
- Light Gray: \`#e8e6dc\` - Subtle backgrounds

**Accent Colors:**
- Orange: \`#d97757\` - Primary accent
- Blue: \`#6a9bcc\` - Secondary accent
- Green: \`#788c5d\` - Tertiary accent

### Typography
- **Headings**: Poppins (with Arial fallback)
- **Body Text**: Lora (with Georgia fallback)

## Features

### Smart Font Application
- Applies Poppins font to headings (24pt and larger)
- Applies Lora font to body text
- Automatically falls back to Arial/Georgia if custom fonts unavailable

### Text Styling
- Headings (24pt+): Poppins font
- Body text: Lora font
- Smart color selection based on background
- Preserves text hierarchy and formatting

### Shape and Accent Colors
- Non-text shapes use accent colors
- Cycles through orange, blue, and green accents
- Maintains visual interest while staying on-brand`
    },
    {
        id: crypto.randomUUID(),
        name: 'Web Application Testing',
        description: 'Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and viewing browser logs.',
        category: 'Engineering',
        tags: ['testing', 'playwright', 'automation', 'qa'],
        triggers: ['Test my web application', 'Run Playwright tests', 'Debug UI behavior'],
        instructions: `# Web Application Testing

To test local web applications, write native Python Playwright scripts.

## Decision Tree: Choosing Your Approach

\`\`\`
User task → Is it static HTML?
    ├─ Yes → Read HTML file directly to identify selectors
    │         ├─ Success → Write Playwright script using selectors
    │         └─ Fails/Incomplete → Treat as dynamic (below)
    │
    └─ No (dynamic webapp) → Is the server already running?
        ├─ No → Start the server first, then automate
        │
        └─ Yes → Reconnaissance-then-action:
            1. Navigate and wait for networkidle
            2. Take screenshot or inspect DOM
            3. Identify selectors from rendered state
            4. Execute actions with discovered selectors
\`\`\`

## Reconnaissance-Then-Action Pattern

1. **Inspect rendered DOM**:
   \`\`\`python
   page.screenshot(path='/tmp/inspect.png', full_page=True)
   content = page.content()
   page.locator('button').all()
   \`\`\`

2. **Identify selectors** from inspection results

3. **Execute actions** using discovered selectors

## Common Pitfall

❌ **Don't** inspect the DOM before waiting for \`networkidle\` on dynamic apps
✅ **Do** wait for \`page.wait_for_load_state('networkidle')\` before inspection

## Best Practices

- Use \`sync_playwright()\` for synchronous scripts
- Always close the browser when done
- Use descriptive selectors: \`text=\`, \`role=\`, CSS selectors, or IDs
- Add appropriate waits: \`page.wait_for_selector()\` or \`page.wait_for_timeout()\``
    }
];

async function seed() {
    console.log('Connecting to Supabase...');
    console.log(`URL: ${supabaseUrl}`);
    console.log('Seeding with OFFICIAL Anthropic skill examples from https://github.com/anthropics/skills');

    for (const example of examples) {
        // Check if exists
        const { data } = await supabase
            .from('templates')
            .select('id')
            .eq('name', example.name)
            .single();

        if (!data) {
            const { error: insertError } = await supabase
                .from('templates')
                .insert(example);

            if (insertError) {
                console.error(`Failed to insert ${example.name}:`, insertError);
            } else {
                console.log(`✅ Inserted ${example.name}`);
            }
        } else {
            console.log(`ℹ️ Skipping ${example.name} (Already exists)`);
        }
    }
    console.log('Seed initialization complete.');
}

seed().catch(console.error);
