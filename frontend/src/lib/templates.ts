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
        sampleOutput: `## Stunning Family Home in Prime Location

### Description

Welcome to this beautifully updated **3-bedroom, 2-bathroom** home nestled on Oak Street. The recently renovated chef's kitchen features granite countertops, stainless steel appliances, and custom cabinetry—perfect for entertaining.

The open floor plan creates a seamless flow between the living areas, with natural light pouring through the oversized windows. Step outside to your private oasis: a **spacious backyard** with mature trees and endless possibilities for outdoor living.

### Key Details

| Feature | Value |
|---------|-------|
| **Price** | $450,000 |
| **Bedrooms** | 3 |
| **Bathrooms** | 2 |
| **Square Feet** | 1,800 |

### Features

- ✓ Updated gourmet kitchen with granite counters
- ✓ Large, landscaped backyard
- ✓ Hardwood floors throughout
- ✓ Central air conditioning
- ✓ Attached 2-car garage
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
        sampleOutput: `## Meeting Notes: Q1 Planning Session

**Date:** January 15, 2025  
**Attendees:** Sarah Chen, Mike Johnson, Lisa Park  
**Duration:** 45 minutes

### Key Discussion Points

1. Budget allocation for Q1 marketing campaigns
2. New product launch timeline (March 15 target)
3. Team hiring priorities

### Decisions Made

- ✅ Approved $50K budget for digital marketing
- ✅ March 15 launch date confirmed
- ✅ Will hire 2 additional engineers

### Action Items

| Task | Owner | Due Date | Priority |
|------|-------|----------|----------|
| Draft marketing brief | Sarah | Jan 22 | High |
| Finalize tech specs | Mike | Jan 18 | High |
| Post job listings | Lisa | Jan 17 | Medium |

### Next Steps

- Follow-up meeting scheduled for January 22
- Review marketing draft before next sync
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
        sampleOutput: `## Financial Analysis: Q4 2024

### Executive Summary

The company shows **strong revenue growth** of 23% YoY, but operating margins have declined from 18% to 14% due to increased marketing spend. Cash position remains healthy.

### Key Metrics

| Metric | Q4 2024 | Q4 2023 | Change |
|--------|---------|---------|--------|
| Revenue | $2.4M | $1.95M | +23% |
| Gross Margin | 68% | 71% | -3pts |
| Operating Margin | 14% | 18% | -4pts |
| Cash | $850K | $620K | +37% |

### Recommendations

1. **Review marketing ROI** - Spending up 45% but revenue only up 23%
2. **Investigate COGS increase** - Gross margin decline needs attention
3. **Maintain cash reserves** - Strong position for Q1 investments
`,
    },

    'prd-generator': {
        id: 'prd-generator',
        name: 'Product Requirements Document',
        description: 'Generate comprehensive PRDs from product ideas, including features, requirements, and success metrics',
        category: 'Product',
        tags: ['product', 'management', 'planning'],
        triggers: [
            'create prd',
            'write prd',
            'product requirements',
        ],
        instructions: `# Product Requirements Document (PRD) Generator

You are an expert Product Manager. Your goal is to generate a comprehensive Product Requirements Document (PRD) based on a product idea or brief provided by the user.

## Required Input
Ask the user for:
- **Product Name/Codename**
- **Problem Statement** (What are we solving?)
- **Target Audience** (Who are we solving it for?)
- **Key Features** (High-level capabilities)

## Output Sections

1.  **Problem Statement**: Clear, concise articulation of the user problem.
2.  **Goals & Success Metrics**: 
    - Business Goals (e.g., revenue, adoption)
    - User Goals (e.g., efficiency, satisfaction)
    - Key Performance Indicators (KPIs)
3.  **User Personas**: Brief archetypes of the target users.
4.  **Functional Requirements** (The "What"):
    - Detailed breakdown of features.
    - User stories (As a [user], I want to [action] so that [benefit]).
5.  **Non-Functional Requirements** (The "How"):
    - Performance, Security, Scalability, Reliability constraints.
6.  **User Experience (UX) Flow**: High-level description of the user journey.
7.  **Go-to-Market (GTM) Strategy** (Optional): Brief launch notes.

## Tone & Style
- Professional, structured, and clear.
- Use bullet points for readability.
- Prioritize clarity over jargon.
`,
        sampleOutput: `# PRD: TaskFlow Mobile App

## Problem Statement

Remote teams struggle to track daily tasks across time zones, leading to missed deadlines and duplicated work.

## Goals & Success Metrics

| Goal | Metric | Target |
|------|--------|--------|
| Adoption | DAU | 10K in 90 days |
| Engagement | Tasks completed/user | 5/day |
| Satisfaction | NPS | 50+ |

## User Stories

- As a **team lead**, I want to assign tasks with due dates so that my team knows priorities
- As a **remote worker**, I want timezone-aware reminders so I never miss deadlines

## Non-Functional Requirements

- **Performance**: App loads in <2 seconds
- **Security**: SOC 2 compliant
- **Availability**: 99.9% uptime
`,
    },

    'brand-identity': {
        id: 'brand-identity',
        name: 'Brand Identity Guide',
        description: 'Define your brand voice, tone, and visual guidelines to ensure consistency across all communications',
        category: 'Marketing',
        tags: ['brand', 'marketing', 'design'],
        triggers: [
            'brand guidelines',
            'brand voice',
            'style guide',
        ],
        instructions: `# Brand Identity Guide Generator

You are a Brand Strategist. Your goal is to create a concise Brand Identity Guide for a company or project.

## Required Input
Ask the user for:
- **Company Name**
- **Mission Statement**
- **Target Audience**
- **Core Values** (3-5 keywords)

## Output Sections

1.  **Brand Essence**: A single sentence defining the soul of the brand.
2.  **Voice & Tone**:
    - **Voice**: The steady personality (e.g., "Helpful, Authoritative, Witty").
    - **Tone**: How the voice adapts to context (e.g., "Empathetic in support, Energetic in marketing").
3.  **Core Values**: Definitions of the values and how they manifest in behavior.
4.  **Target Audience**: Description of the primary customer profile.
5.  **Writing Style**:
    - Do's and Don'ts (e.g., "Do use active voice", "Don't use slang").
6.  **Visual Hints** (Text-based):
    - Color palette suggestions (e.g., "Trustworthy Blue", "Energetic Orange").
    - Typography style (e.g., "Modern Sans-Serif").

## Tone & Style
- Inspiring yet practical.
- Use examples to illustrate voice/tone.
`,
        sampleOutput: `# TechFlow Brand Identity Guide

## Brand Essence

*"Empowering teams to build faster, together."*

## Voice & Tone

| Context | Voice | Tone |
|---------|-------|------|
| Marketing | Confident, Inspiring | Energetic, Bold |
| Support | Helpful, Clear | Empathetic, Patient |
| Documentation | Authoritative, Precise | Neutral, Professional |

## Core Values

- **Innovation** — We push boundaries and question the status quo
- **Transparency** — We communicate openly and honestly
- **Collaboration** — We believe the best work happens together

## Writing Style

### Do's ✓
- Use active voice ("We built" not "It was built")
- Keep sentences under 20 words
- Lead with benefits, not features

### Don'ts ✗
- Avoid jargon and buzzwords
- Never use passive aggressive language
- Don't over-promise or use superlatives
`,
    },

    'email-drafter': {
        id: 'email-drafter',
        name: 'Professional Email Drafter',
        description: 'Draft polished, professional emails for various contexts including sales, follow-ups, and announcements',
        category: 'Sales',
        tags: ['email', 'writing', 'communication'],
        triggers: [
            'draft email',
            'write email',
            'send email to',
        ],
        instructions: `# Professional Email Drafter

You are a professional Communications Expert. Draft high-quality emails based on the user's intent.

## Required Input
Ask the user for:
- **Recipient** (Name/Role)
- **Purpose** (e.g., Sales outreach, Meeting follow-up, Resignation, Project update)
- **Key Points to Cover**
- **Desired Tone** (e.g., Formal, Casual, Persuasive, Apologetic)

## Output Structure

1.  **Subject Line**: Provide 3 options (concise, engaging).
2.  **Email Body**:
    - **Salutation**
    - **Opening**: Contextual and polite.
    - **Body**: clear, concise paragraphs covering key points.
    - **Call to Action (CTA)**: Specific next step.
    - **Sign-off**

## Best Practices
- Keep it concise.
- Use active voice.
- Proofread for clarity and tone.
- Ensure the "Ask" is clear.
`,
        sampleOutput: `**Subject Line Options:**
1. Quick question about our Q1 partnership
2. Following up on our conversation
3. Next steps for the Smith project

---

**Email:**

Hi Sarah,

I hope this finds you well. I wanted to follow up on our call last Tuesday about the Q1 marketing partnership.

After reviewing internally, we're excited to move forward with the co-branded campaign. Our team can commit to:
- 3 joint webinars
- Shared social media promotion
- Cross-listing in our newsletters

**Next step:** Could you share your team's availability for a kickoff call next week?

Looking forward to working together.

Best,
Alex
`,
    },
},
'business-proposal': {
    id: 'business-proposal',
        name: 'Client Project Brief',
            description: 'Create detailed project briefs for clients, outlining scope, deliverables, and timelines',
                category: 'Consulting',
                    tags: ['consulting', 'project', 'proposal'],
                        triggers: [
                            'create brief',
                            'project proposal',
                            'client brief',
                        ],
                            instructions: `# Client Project Brief Generator

You are a Senior Project Manager. Create a comprehensive project brief based on the client's requirements.

## Required Input
Ask the user for:
- **Client Name**
- **Project Goal**
- **Key Deliverables**
- **Timeline**
- **Budget (Optional)**

## Output Structure

1. **Executive Summary**: One paragraph overview.
2. **Project Objectives**: Bulleted list of goals.
3. **Scope of Work**:
    - **In Scope**: What we will do.
    - **Out of Scope**: What we won't do.
4. **Deliverables & Milestones**: Table of key dates and outputs.
5. **Timeline**: High-level schedule.
6. **Budget Estimate**: If provided.
7. **Next Steps**: Action items to kick off.

## Tone & Style
- Professional, clear, and reassuring.
- Focus on value and clarity.
`,
                                sampleOutput: `# Project Brief: Website Redesign

**Client:** Acme Corp  
**Date:** January 2025

## Executive Summary

Redesign Acme Corp's marketing website to improve conversion rates and modernize the brand presence.

## Scope of Work

### In Scope
- Homepage redesign
- 5 product pages
- Mobile optimization
- CMS integration

### Out of Scope
- E-commerce functionality
- Blog migration

## Milestones

| Milestone | Deliverable | Date |
|-----------|-------------|------|
| Kickoff | Project plan | Jan 15 |
| Design | Wireframes | Feb 1 |
| Development | Staging site | Mar 1 |
| Launch | Go-live | Mar 15 |

## Budget Estimate

**Total:** $45,000
`,
    },
    },

'competitor-analysis': {
    id: 'competitor-analysis',
        name: 'Market Competitor Analysis',
            description: 'Analyze competitors to identify market gaps, strengths, and opportunities for your business',
                category: 'Business',
                    tags: ['business', 'strategy', 'analysis'],
                        triggers: [
                            'analyze competitors',
                            'market analysis',
                            'competitive landscape',
                        ],
                            instructions: `# Competitor Analysis Generator

You are a Market Strategy Consultant. Analyze the competitive landscape for the user.

## Required Input
Ask the user for:
- **My Business**: Name/Description
- **Key Competitors**: Names (3-5)
- **Market Segment**: Target audience
- **Key Differentiators**: What makes you unique?

## Output Structure

1. **Market Overview**: Brief summary of the current landscape.
2. **Competitor Breakdown** (Repeat for each):
    - **Name**: [Competitor Name]
    - **Strengths**: What they do well.
    - **Weaknesses**: Where they struggle.
    - **Positioning**: How they sell themselves.
3. **SWOT Analysis** (For your business):
    - **Strengths**: Internal advantages.
    - **Weaknesses**: Internal disadvantages.
    - **Opportunities**: External potential.
    - **Threats**: External risks.
4. **Strategic Recommendations**: 3-5 actionable steps to win.

## Tone & Style
- Objective, analytical, and strategic.
- Focus on actionable insights.
`,
                                sampleOutput: `## Competitive Analysis: Project Management Tools

### Market Overview

The project management SaaS market is valued at $6.5B with 12% YoY growth. Key players include Asana, Monday.com, and Notion.

### Competitor Breakdown

| Competitor | Strengths | Weaknesses |
|------------|-----------|------------|
| Asana | Enterprise features, integrations | Complex UI, expensive |
| Monday.com | Visual workflows, marketing | Limited free tier |
| Notion | Flexibility, docs + tasks | Steep learning curve |

### SWOT Analysis (Your Business)

- **Strengths**: Simple UI, competitive pricing
- **Weaknesses**: Limited integrations
- **Opportunities**: SMB market underserved
- **Threats**: Enterprise players moving downmarket

### Strategic Recommendations

1. Focus on SMB segment (10-50 employees)
2. Build top 5 integrations (Slack, Google, Zoom)
3. Emphasize simplicity in marketing
`,
    },
    },
};

/** @deprecated Use getTemplateById from @/lib/api/templateApi instead */
export function getTemplateById(id: string): Template | undefined {
    return TEMPLATES[id];
}

/** @deprecated Use getTemplates from @/lib/api/templateApi instead */
export function getAllTemplates(): Template[] {
    return Object.values(TEMPLATES);
}
