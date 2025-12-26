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
    // === ENTERPRISE & COMMUNICATION ===
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

1. **Identify the communication type** from the request
2. **Choose the appropriate format**:
    - 3P Updates - For Progress/Plans/Problems team updates
    - Company Newsletter - For company-wide newsletters
    - FAQ Answers - For answering frequently asked questions
    - General Comms - For anything else
3. **Follow best practices** for formatting, tone, and content gathering

## Keywords
3P updates, company newsletter, company comms, weekly update, faqs, internal comms`
    },
    {
        id: crypto.randomUUID(),
        name: 'Doc Co-Authoring',
        description: 'Structured workflow for guiding users through collaborative document creation. Walks users through three stages: Context Gathering, Refinement & Structure, and Reader Testing.',
        category: 'Enterprise',
        tags: ['writing', 'collaboration', 'documents', 'workflow'],
        triggers: ['Help me write a document', 'Co-author with me', 'Collaborative writing'],
        instructions: `# Doc Co-Authoring Workflow

This skill provides a structured workflow for collaborative document creation with three stages:

## Stage 1: Context Gathering
- Ask initial questions about purpose, audience, and goals
- Encourage "info dumping" - let users share all relevant context
- Capture requirements and constraints

## Stage 2: Refinement & Structure
1. **Clarifying Questions** - Fill information gaps
2. **Brainstorming** - Generate ideas and approaches
3. **Curation** - Select best elements
4. **Gap Check** - Identify missing pieces
5. **Drafting** - Create initial content
6. **Iterative Refinement** - Polish and improve
7. **Quality Checking** - Ensure standards are met

## Stage 3: Reader Testing
- Predict reader questions
- Test with simulated readers
- Run additional checks
- Iterate based on results

## Tips for Effective Guidance
- Act as an active guide, not passive assistant
- Ask probing questions to draw out context
- Suggest structure and organization
- Maintain focus on reader experience`
    },

    // === DESIGN & CREATIVE ===
    {
        id: crypto.randomUUID(),
        name: 'Brand Guidelines',
        description: "Applies official brand colors and typography to artifacts that benefit from company look-and-feel. Use when brand colors, style guidelines, visual formatting, or company design standards apply.",
        category: 'Design',
        tags: ['branding', 'design', 'visual', 'typography'],
        triggers: ['Apply brand guidelines', 'Use company branding', 'Format with brand colors'],
        instructions: `# Brand Styling

## Overview
Apply official brand identity and style resources to any artifact.

**Keywords**: branding, corporate identity, visual identity, styling, brand colors, typography

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
- Smart font application based on text size
- Automatic fallback to system fonts
- Maintains visual hierarchy and formatting
- Shape accents cycle through brand colors`
    },
    {
        id: crypto.randomUUID(),
        name: 'Frontend Design',
        description: 'Create distinctive, production-grade frontend interfaces with high design quality. Use for web components, pages, dashboards, React components, HTML/CSS layouts, or when styling any web UI. Generates creative, polished code that avoids generic AI aesthetics.',
        category: 'Design',
        tags: ['frontend', 'ui', 'web', 'react', 'css'],
        triggers: ['Build a web interface', 'Create a landing page', 'Design a dashboard'],
        instructions: `# Frontend Design

Create distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, etc.
- **Constraints**: Technical requirements (framework, performance, accessibility)
- **Differentiation**: What makes this UNFORGETTABLE?

## Frontend Aesthetics Guidelines

- **Typography**: Choose distinctive fonts. Avoid Inter, Arial, Roboto. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables. Dominant colors with sharp accents outperform timid palettes.
- **Motion**: Use animations for effects and micro-interactions. CSS-only for HTML, Motion library for React.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements.
- **Backgrounds**: Create atmosphere with gradient meshes, noise textures, geometric patterns, layered transparencies.

NEVER use: overused fonts (Inter, Roboto, Arial), cliched purple gradients, predictable layouts, cookie-cutter design.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Elegance comes from executing the vision well.`
    },
    {
        id: crypto.randomUUID(),
        name: 'Theme Factory',
        description: 'Toolkit for styling artifacts with professional themes. Apply to slides, docs, reports, or HTML pages. Includes 10 pre-set themes with colors/fonts, or generate custom themes on-the-fly.',
        category: 'Design',
        tags: ['themes', 'styling', 'colors', 'fonts', 'presentations'],
        triggers: ['Apply a theme', 'Style my presentation', 'Choose a color scheme'],
        instructions: `# Theme Factory Skill

Apply consistent, professional styling to presentations and artifacts.

## Available Themes

1. **Ocean Depths** - Professional and calming maritime theme
2. **Sunset Boulevard** - Warm and vibrant sunset colors
3. **Forest Canopy** - Natural and grounded earth tones
4. **Modern Minimalist** - Clean and contemporary grayscale
5. **Golden Hour** - Rich and warm autumnal palette
6. **Arctic Frost** - Cool and crisp winter-inspired theme
7. **Desert Rose** - Soft and sophisticated dusty tones
8. **Tech Innovation** - Bold and modern tech aesthetic
9. **Botanical Garden** - Fresh and organic garden colors
10. **Midnight Galaxy** - Dramatic and cosmic deep tones

## Usage Instructions

1. **Show theme options** to allow users to see available themes
2. **Ask for their choice** - Get explicit confirmation
3. **Apply the theme** - Colors and fonts consistently throughout

## Application Process
1. Apply specified colors and fonts consistently
2. Ensure proper contrast and readability
3. Maintain visual identity across all elements

## Create Custom Theme
If no existing theme fits, generate a custom theme based on provided inputs with appropriate colors/fonts.`
    },
    {
        id: crypto.randomUUID(),
        name: 'Algorithmic Art',
        description: 'Create algorithmic art pieces using p5.js with computational processes, emergent behavior, and mathematical beauty. Generates code-based generative art with seeded randomness, noise fields, particles, and parametric variation.',
        category: 'Creative',
        tags: ['generative-art', 'p5js', 'creative-coding', 'algorithms'],
        triggers: ['Create generative art', 'Make algorithmic art', 'Generate p5.js artwork'],
        instructions: `# Algorithmic Art Creation

## ALGORITHMIC PHILOSOPHY CREATION

Create an ALGORITHMIC PHILOSOPHY (not static images or templates) interpreted through:
- Computational processes, emergent behavior, mathematical beauty
- Seeded randomness, noise fields, organic systems
- Particles, flows, fields, forces
- Parametric variation and controlled chaos

## Essential Principles
- Focus on process over product
- Embrace controlled randomness
- Find beauty in mathematical relationships
- Create interactive experiences

## p5.js Implementation

### Technical Requirements
- Use p5.js for rendering
- Implement responsive canvas sizing
- Include seed-based randomness for reproducibility
- Build in controls for parameter adjustment

### Craftsmanship Requirements
- Clean, well-commented code
- Modular structure for easy modification
- Performance optimization for smooth animation
- Consider accessibility and user interaction

## The Creative Process
1. Define philosophical concept
2. Translate to mathematical relationships
3. Implement with p5.js primitives
4. Iterate and refine the aesthetic`
    },
    {
        id: crypto.randomUUID(),
        name: 'Canvas Design',
        description: 'Create visual philosophy designs through form, space, color, and composition. Generates artistic canvas-based visuals with images, graphics, shapes, patterns, and minimal text as visual accent.',
        category: 'Creative',
        tags: ['canvas', 'visual-design', 'graphics', 'composition'],
        triggers: ['Create a canvas design', 'Design visual art', 'Make graphic composition'],
        instructions: `# Canvas Design

## DESIGN PHILOSOPHY CREATION

Create a VISUAL PHILOSOPHY (not layouts or templates) interpreted through:
- Form, space, color, composition
- Images, graphics, shapes, patterns
- Minimal text as visual accent

## Essential Principles
- Lead with visual impact
- Embrace negative space
- Create hierarchy through size and position
- Use color intentionally

## The Creative Process

1. **Define the philosophy** - What visual story are you telling?
2. **Choose your palette** - Select colors that evoke the right emotion
3. **Compose the space** - Balance elements within the canvas
4. **Add detail layers** - Build depth through texture and pattern
5. **Refine** - Remove anything that doesn't serve the philosophy

## Multi-Page Option
For multi-page designs, maintain visual consistency while varying specific elements.`
    },

    // === DEVELOPMENT & TECHNICAL ===
    {
        id: crypto.randomUUID(),
        name: 'Web Application Testing',
        description: 'Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and viewing browser logs.',
        category: 'Engineering',
        tags: ['testing', 'playwright', 'automation', 'qa'],
        triggers: ['Test my web application', 'Run Playwright tests', 'Debug UI behavior'],
        instructions: `# Web Application Testing

Test local web applications with native Python Playwright scripts.

## Decision Tree

\`\`\`
User task → Is it static HTML?
    ├─ Yes → Read HTML file directly to identify selectors
    │         └─ Write Playwright script using selectors
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
   page.locator('button').all()
   \`\`\`

2. **Identify selectors** from inspection results
3. **Execute actions** using discovered selectors

## Best Practices

- Use \`sync_playwright()\` for synchronous scripts
- Always close the browser when done
- Use descriptive selectors: \`text=\`, \`role=\`, CSS, or IDs
- Add appropriate waits: \`wait_for_selector()\` or \`wait_for_timeout()\`
- Wait for \`networkidle\` before inspecting dynamic apps`
    },
    {
        id: crypto.randomUUID(),
        name: 'MCP Server Builder',
        description: 'Create MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. Guides the full development process from research to testing.',
        category: 'Engineering',
        tags: ['mcp', 'servers', 'api', 'integrations'],
        triggers: ['Build an MCP server', 'Create MCP tools', 'Develop model integrations'],
        instructions: `# MCP Server Development Guide

## Overview

Create MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. Quality is measured by how well it enables LLMs to accomplish real-world tasks.

## High-Level Workflow

### Phase 1: Deep Research and Planning
- Understand the external service's API
- Identify key use cases and user needs
- Design tool interfaces

### Phase 2: Implementation
- Set up project structure
- Implement tool handlers
- Add error handling and validation

### Phase 3: Review and Test
- Test each tool thoroughly
- Handle edge cases
- Ensure clean error messages

### Phase 4: Create Evaluations
- Build test cases for each tool
- Document expected behaviors
- Create integration tests

## Key Principles
- Design tools that are intuitive for LLMs to use
- Provide clear, actionable error messages
- Document all parameters thoroughly
- Test with real-world scenarios`
    },
    {
        id: crypto.randomUUID(),
        name: 'Skill Creator',
        description: 'Guidance for creating effective Claude skills. Skills are modular, self-contained packages that extend Claude\'s capabilities by providing specialized knowledge, workflows, and tools for specific domains or tasks.',
        category: 'Engineering',
        tags: ['skills', 'claude', 'development', 'meta'],
        triggers: ['Create a skill', 'Build a Claude skill', 'Design skill instructions'],
        instructions: `# Skill Creator

Guidance for creating effective skills that extend Claude's capabilities.

## About Skills

Skills are modular, self-contained packages that extend Claude's capabilities by providing specialized knowledge, workflows, and tools. Think of them as "onboarding guides" for specific domains or tasks - they transform Claude from a general-purpose agent into a specialized agent equipped with procedural knowledge.

## Core Principles

### Concise is Key
Skills should be focused and specific. Include only what's necessary for the task at hand.

### Set Appropriate Degrees of Freedom
Balance structure with flexibility. Some tasks need strict procedures; others benefit from creative latitude.

### Anatomy of a Skill
- **Frontmatter**: name and description
- **When to use**: Clear trigger conditions
- **How to use**: Step-by-step instructions
- **Examples**: Concrete usage patterns
- **Guidelines**: Best practices and constraints

## Skill Creation Process

1. **Understanding**: Identify concrete examples of the skill in action
2. **Planning**: Design reusable skill contents
3. **Initializing**: Create the SKILL.md structure
4. **Editing**: Refine instructions and examples
5. **Packaging**: Bundle with any resources
6. **Iterating**: Test and improve based on usage`
    }
];

async function seed() {
    console.log('Connecting to Supabase...');
    console.log(`URL: ${supabaseUrl}`);
    console.log('Seeding with OFFICIAL Anthropic skill examples from https://github.com/anthropics/skills');
    console.log(`Total skills to import: ${examples.length}`);

    let inserted = 0;
    let skipped = 0;

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
                console.error(`❌ Failed to insert ${example.name}:`, insertError);
            } else {
                console.log(`✅ Inserted ${example.name}`);
                inserted++;
            }
        } else {
            console.log(`ℹ️ Skipping ${example.name} (Already exists)`);
            skipped++;
        }
    }
    console.log(`\nSeed complete: ${inserted} inserted, ${skipped} skipped.`);
}

seed().catch(console.error);
