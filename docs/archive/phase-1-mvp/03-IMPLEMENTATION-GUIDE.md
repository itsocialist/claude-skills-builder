# Implementation Guide - ClaudeSkillsFacet MVP

> **Full implementation details in ship-ape memory:**  
> `search_context(project_name="claude-skills-builder", query="implementation")`

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Code editor (VS Code recommended)
- Access to Figma project (for design extraction)
- figmadev MCP configured

## Phase 1: Weekend MVP Implementation

**Goal:** Launch functional skill builder by end of weekend

**Timeline:**
- Day 1 (Saturday): 8 hours - Setup + Components + Form
- Day 2 (Sunday): 8 hours - Generator + Templates + Landing
- Day 3 (Monday): 2 hours - Polish + Deploy (optional)

---

## Day 1: Setup + Components + Form (8 hours)

### Hour 1-2: Project Setup

```bash
# Create Next.js project
npx create-next-app@latest frontend --typescript --tailwind --app --src-dir
cd frontend

# Install dependencies
npm install zustand @monaco-editor/react js-yaml jszip
npm install -D @types/js-yaml

# Install shadcn/ui
npx shadcn-ui@latest init

# Install core components
npx shadcn-ui@latest add button input textarea card select badge
```

### Hour 2-3: Configure Tailwind with Design Tokens

**File: `frontend/tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#FF6B35',
          600: '#E55A2B',
        },
        secondary: {
          500: '#5B4CFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
```

### Hour 3-4: Extract Components from Figma

```bash
# Use figmadev MCP to extract components
# Connect to Figma project 521820865
# Extract Button, Input, Card components
# Copy color styles and spacing values
```

**Reference:** See `docs/01-DESIGN-SYSTEM.md` for design tokens

### Hour 4-6: Build Skill Builder Form

**File: `frontend/src/types/skill.types.ts`**

```typescript
export interface Skill {
  name: string;
  description: string;
  category: string;
  tags: string[];
  triggers: string[];
  instructions: string;
  examples?: Example[];
}

export interface Example {
  input: string;
  output: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  triggers: string[];
  instructions: string;
}
```

**File: `frontend/src/lib/store/skillStore.ts`**

```typescript
import { create } from 'zustand';
import type { Skill } from '@/types/skill.types';

interface SkillStore {
  skill: Skill;
  setSkill: (skill: Skill) => void;
  updateField: (field: keyof Skill, value: any) => void;
  addTrigger: (trigger: string) => void;
  removeTrigger: (index: number) => void;
  reset: () => void;
}

const emptySkill: Skill = {
  name: '',
  description: '',
  category: '',
  tags: [],
  triggers: [],
  instructions: '',
};

export const useSkillStore = create<SkillStore>((set) => ({
  skill: emptySkill,
  
  setSkill: (skill) => set({ skill }),
  
  updateField: (field, value) => 
    set((state) => ({ 
      skill: { ...state.skill, [field]: value } 
    })),
  
  addTrigger: (trigger) =>
    set((state) => ({
      skill: {
        ...state.skill,
        triggers: [...state.skill.triggers, trigger],
      },
    })),
  
  removeTrigger: (index) =>
    set((state) => ({
      skill: {
        ...state.skill,
        triggers: state.skill.triggers.filter((_, i) => i !== index),
      },
    })),
  
  reset: () => set({ skill: emptySkill }),
}));
```

**File: `frontend/src/app/builder/page.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { useSkillStore } from '@/lib/store/skillStore';
import { generateSkillZip } from '@/lib/utils/skill-generator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { TriggerEditor } from '@/components/builder/TriggerEditor';
import { InstructionsEditor } from '@/components/builder/InstructionsEditor';

export default function BuilderPage() {
  const { skill, updateField, reset } = useSkillStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateSkillZip(skill);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${skill.name.toLowerCase().replace(/\s+/g, '-')}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate skill. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Create New Skill</h1>
      
      {/* Basic Information */}
      <Card className="mb-6 p-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Skill Name *
            </label>
            <Input
              value={skill.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g., Property Listing Generator"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <Textarea
              value={skill.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="What does this skill do?"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Category
            </label>
            <Input
              value={skill.category}
              onChange={(e) => updateField('category', e.target.value)}
              placeholder="e.g., Real Estate, Legal, Finance"
            />
          </div>
        </div>
      </Card>
      
      {/* Triggers */}
      <Card className="mb-6 p-6">
        <h2 className="text-xl font-semibold mb-4">Skill Triggers</h2>
        <p className="text-sm text-gray-600 mb-4">
          When should this skill activate?
        </p>
        <TriggerEditor />
      </Card>
      
      {/* Instructions */}
      <Card className="mb-6 p-6">
        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
        <InstructionsEditor />
      </Card>
      
      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={reset}>
          Reset
        </Button>
        <div className="space-x-4">
          <Button variant="outline">
            Save Draft
          </Button>
          <Button 
            onClick={handleGenerate}
            disabled={!skill.name || !skill.instructions || isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Skill'}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### Hour 6-8: Build Supporting Components

**File: `frontend/src/components/builder/TriggerEditor.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { useSkillStore } from '@/lib/store/skillStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export function TriggerEditor() {
  const { skill, addTrigger, removeTrigger } = useSkillStore();
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      addTrigger(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., create property listing"
        />
        <Button onClick={handleAdd} type="button">
          Add
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {skill.triggers.map((trigger, index) => (
          <Badge key={index} variant="secondary" className="px-3 py-1">
            {trigger}
            <button
              onClick={() => removeTrigger(index)}
              className="ml-2 hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
```

**File: `frontend/src/components/builder/InstructionsEditor.tsx`**

```typescript
'use client';

import { useSkillStore } from '@/lib/store/skillStore';
import Editor from '@monaco-editor/react';

export function InstructionsEditor() {
  const { skill, updateField } = useSkillStore();

  return (
    <div className="border rounded-lg overflow-hidden">
      <Editor
        height="500px"
        defaultLanguage="markdown"
        value={skill.instructions}
        onChange={(value) => updateField('instructions', value || '')}
        theme="vs-light"
        options={{
          minimap: { enabled: false },
          lineNumbers: 'on',
          wordWrap: 'on',
          fontSize: 14,
        }}
      />
    </div>
  );
}
```

---

## Day 2: Generator + Templates + Landing (8 hours)

### Hour 1-2: Build Generator Logic

**File: `frontend/src/lib/utils/skill-generator.ts`**

```typescript
import JSZip from 'jszip';
import yaml from 'js-yaml';
import type { Skill } from '@/types/skill.types';

export async function generateSkillZip(skill: Skill): Promise<Blob> {
  // 1. Generate YAML frontmatter
  const frontmatter = yaml.dump({
    name: skill.name,
    description: skill.description,
    triggers: skill.triggers,
    category: skill.category,
    tags: skill.tags || [],
  }, {
    indent: 2,
    lineWidth: 80,
  });
  
  // 2. Combine with markdown instructions
  const skillMd = `---\n${frontmatter}---\n\n${skill.instructions}`;
  
  // 3. Create README
  const readme = generateReadme(skill);
  
  // 4. Create zip file
  const zip = new JSZip();
  zip.file('SKILL.md', skillMd);
  zip.file('README.md', readme);
  
  // 5. Generate blob
  return await zip.generateAsync({ type: 'blob' });
}

function generateReadme(skill: Skill): string {
  return `# ${skill.name}

${skill.description}

## Installation

1. Go to [Claude.ai](https://claude.ai)
2. Navigate to Skills
3. Click "Add Skill"
4. Upload the \`SKILL.md\` file from this folder

## Triggers

This skill activates when you use these phrases:

${skill.triggers.map(t => `- \`${t}\``).join('\n')}

## Category

${skill.category}

---

Generated with [ClaudeSkillsFacet](https://claudeskillsfacet.com)
`;
}
```

### Hour 2-4: Create Templates

**File: `frontend/src/lib/templates.ts`**

```typescript
import type { Template } from '@/types/skill.types';

export const TEMPLATES: Record<string, Template> = {
  'property-listing': {
    id: 'property-listing',
    name: 'Property Listing Generator',
    description: 'Generate professional real estate listings with key details and compelling descriptions',
    category: 'Real Estate',
    tags: ['real-estate', 'marketing', 'listings'],
    triggers: [
      'create property listing',
      'generate listing',
      'list property',
    ],
    instructions: `# Property Listing Generator

You are a professional real estate listing writer. Create compelling property listings that highlight key features and appeal to potential buyers.

## Required Information

When the user provides property details, include:

1. **Property Address** - Full street address
2. **Price** - Listing price
3. **Bedrooms/Bathrooms** - Number of each
4. **Square Footage** - Interior square footage
5. **Key Features** - Notable amenities and upgrades
6. **Neighborhood** - Area highlights

## Output Format

Structure the listing as follows:

### Headline
Create an attention-grabbing headline (max 10 words)

### Description
Write 3-4 paragraphs:
- Opening hook highlighting the best feature
- Detailed description of interior spaces
- Outdoor spaces and special features
- Neighborhood and location benefits

### Key Details
- Price: $XXX,XXX
- Bedrooms: X
- Bathrooms: X
- Square Feet: X,XXX
- Lot Size: X acres/sqft
- Year Built: XXXX
- Property Type: [Single Family/Condo/etc]

### Features
- Bulleted list of key features
- Include upgrades and special amenities
- Mention recent renovations

### Style Guidelines

- Use vivid, descriptive language
- Highlight unique selling points
- Be honest but emphasize positives
- Keep tone professional yet warm
- Avoid real estate jargon
- Use active voice

## Examples

**User Input:**
"Create listing for 123 Oak Street, 3 bed, 2 bath, 1800 sqft, $450,000, updated kitchen, large backyard"

**Generated Listing:**
[Example output would go here]
`,
  },

  'meeting-notes': {
    id: 'meeting-notes',
    name: 'Meeting Notes & Action Items',
    description: 'Convert meeting discussions into organized notes with clear action items and next steps',
    category: 'Business',
    tags: ['productivity', 'meetings', 'collaboration'],
    triggers: [
      'create meeting notes',
      'summarize meeting',
      'meeting action items',
    ],
    instructions: `# Meeting Notes & Action Items

You are an executive assistant who creates clear, organized meeting notes. Transform meeting discussions into actionable summaries.

## Required Information

Ask the user to provide:
- Meeting date and attendees
- Discussion points
- Decisions made
- Action items

## Output Format

Structure notes as follows:

### Meeting Details
- **Date:** [Date]
- **Attendees:** [List]
- **Duration:** [Time]
- **Purpose:** [Meeting objective]

### Key Discussion Points
- Numbered list of main topics discussed
- Include key arguments and perspectives
- Note any data or metrics shared

### Decisions Made
- Clear list of decisions reached
- Include rationale when provided
- Note any dissenting opinions

### Action Items
Format each as:
- [ ] **Action**: [Clear description]
  - **Owner**: [Person responsible]
  - **Due Date**: [Date]
  - **Priority**: [High/Medium/Low]

### Next Steps
- Next meeting date (if scheduled)
- Topics to revisit
- Follow-up required

### Notes
- Additional context
- Parking lot items
- Questions to resolve

## Style Guidelines

- Use clear, concise language
- Focus on outcomes and actions
- Be objective, not interpretive
- Organize logically
- Highlight time-sensitive items
- Use consistent formatting
`,
  },

  'financial-analysis': {
    id: 'financial-analysis',
    name: 'Financial Statement Analysis',
    description: 'Analyze financial statements and provide insights on performance, trends, and recommendations',
    category: 'Finance',
    tags: ['finance', 'analysis', 'business'],
    triggers: [
      'analyze financials',
      'financial analysis',
      'review financial statements',
    ],
    instructions: `# Financial Statement Analysis

You are a financial analyst. Analyze financial data and provide clear insights on company performance, trends, and recommendations.

## Required Information

Ask the user to provide:
- Financial statements (P&L, Balance Sheet, Cash Flow)
- Time period being analyzed
- Prior period for comparison (if available)
- Any specific concerns or questions

## Analysis Framework

### 1. Executive Summary
- Overall financial health (1-2 paragraphs)
- Key findings and recommendations
- Critical issues requiring attention

### 2. Profitability Analysis
- Revenue trends and growth rates
- Gross margin analysis
- Operating margin analysis
- Net profit margin analysis
- Compare to prior periods

### 3. Liquidity Analysis
- Current ratio
- Quick ratio
- Working capital position
- Cash flow adequacy

### 4. Key Metrics
Calculate and explain:
- Revenue growth rate
- Gross profit margin
- Operating profit margin
- Net profit margin
- Return on assets (if data available)
- Burn rate (for startups)

### 5. Trends & Patterns
- Identify positive trends
- Flag concerning patterns
- Note seasonality or anomalies

### 6. Recommendations
Provide specific, actionable recommendations for:
- Cost optimization opportunities
- Revenue growth strategies
- Cash flow management
- Risk mitigation

## Output Format

Use tables for financial data
Use bullet points for findings
Use clear headings and sections
Highlight key numbers
Explain jargon in plain language

## Style Guidelines

- Be objective and data-driven
- Explain "why" behind numbers
- Use percentage changes
- Compare to benchmarks when possible
- Flag both positives and concerns
- Provide actionable insights
`,
  },
};

export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES[id];
}

export function getAllTemplates(): Template[] {
  return Object.values(TEMPLATES);
}
```

### Hour 4-6: Landing Page

**File: `frontend/src/app/page.tsx`**

```typescript
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getAllTemplates } from '@/lib/templates';

export default function HomePage() {
  const templates = getAllTemplates();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Build Claude Skills in Minutes, Not Hours
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            The fastest way to create custom Claude Skills for your business workflows.
            No coding required.
          </p>
          <Link href="/builder">
            <Button size="lg" variant="secondary">
              Start Building Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Simple Form Builder</h3>
              <p className="text-gray-600">
                No coding required. Fill out a simple form and generate your skill instantly.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Industry Templates</h3>
              <p className="text-gray-600">
                Start with pre-built templates for real estate, legal, finance, and more.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Instant Download</h3>
              <p className="text-gray-600">
                Get your skill as a ready-to-upload .zip file. Upload to Claude.ai immediately.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Start with a Template
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {templates.map((template) => (
              <Card key={template.id} className="p-6">
                <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                <div className="mb-4">
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {template.category}
                  </span>
                </div>
                <Link href={`/templates/${template.id}`}>
                  <Button variant="outline" className="w-full">
                    Use Template
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
```

### Hour 6-8: Template Detail Pages + Blog Structure

**File: `frontend/src/app/templates/[slug]/page.tsx`**

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getTemplateById } from '@/lib/templates';
import { useSkillStore } from '@/lib/store/skillStore';

export default function TemplatePage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { setSkill } = useSkillStore();
  const template = getTemplateById(params.slug);

  if (!template) {
    return <div>Template not found</div>;
  }

  const handleUseTemplate = () => {
    setSkill({
      name: template.name,
      description: template.description,
      category: template.category,
      tags: template.tags,
      triggers: template.triggers,
      instructions: template.instructions,
    });
    router.push('/builder');
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card className="p-8">
        <h1 className="text-3xl font-bold mb-4">{template.name}</h1>
        <p className="text-lg text-gray-600 mb-6">{template.description}</p>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Category:</h3>
          <span className="bg-gray-200 px-3 py-1 rounded">{template.category}</span>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Example Triggers:</h3>
          <ul className="list-disc list-inside">
            {template.triggers.map((trigger, i) => (
              <li key={i}>{trigger}</li>
            ))}
          </ul>
        </div>
        
        <Button onClick={handleUseTemplate} className="w-full">
          Use This Template
        </Button>
      </Card>
    </div>
  );
}
```

---

## Day 3: Polish + Deploy (2 hours)

### Hour 1: Final Testing

- Test form with all fields
- Test all 3 templates
- Test download functionality
- Cross-browser testing
- Mobile responsive check

### Hour 2: Deploy to Vercel

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit - ClaudeSkillsFacet MVP"

# Create GitHub repo and push
# (Follow GitHub instructions)

# Deploy to Vercel
# 1. Go to vercel.com
# 2. Import from GitHub
# 3. Select repository
# 4. Deploy (auto-detected Next.js config)
```

---

## Success Checklist

Before launch, verify:

- ✅ Form accepts all inputs
- ✅ Monaco editor works
- ✅ Trigger editor adds/removes tags
- ✅ Generate button creates .zip
- ✅ Downloaded .zip contains SKILL.md and README.md
- ✅ SKILL.md has correct YAML frontmatter
- ✅ All 3 templates load into form
- ✅ Landing page renders correctly
- ✅ Template detail pages work
- ✅ Mobile responsive
- ✅ Deployed to Vercel
- ✅ Custom domain configured (optional)

---

## Troubleshooting

### Monaco Editor not loading
```bash
npm install --save-exact @monaco-editor/react@4.6.0
```

### YAML generation errors
Check that all required fields are provided before generating

### Zip download not working
Ensure file name doesn't have special characters

---

## Next Steps After MVP

1. **Analytics:** Add Vercel Analytics
2. **SEO:** Create 5 blog posts
3. **Feedback:** Add feedback form
4. **Phase 2:** Plan user authentication and database

---

## Additional Resources

- **Full specifications:** Query ship-ape memory
- **Design system:** See `docs/01-DESIGN-SYSTEM.md`
- **Architecture:** See `docs/02-ARCHITECTURE.md`
- **CIQ Facets reference:** `/Users/briandawson/workspace/ciq-facets`
- **Figma project:** https://www.figma.com/files/team/1276196716415315936/project/521820865
