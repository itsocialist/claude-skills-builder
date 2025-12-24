import Anthropic from '@anthropic-ai/sdk';
import type { Skill } from '@/types/skill.types';

const SKILL_SYSTEM_PROMPT = `You are Claude with the following skill loaded. When the user's message matches one of the trigger phrases, execute the skill instructions. Otherwise, respond normally.`;

/**
 * Test if a phrase triggers a skill
 */
export async function testSkillTrigger(
    apiKey: string,
    skill: Skill,
    testPhrase: string
): Promise<{ triggered: boolean; response: string; tokensUsed: number }> {
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

    const skillContext = `
## SKILL: ${skill.name}
**Triggers:** ${skill.triggers.map(t => `"${t}"`).join(', ')}
**Instructions:**
${skill.instructions}

## TASK
Analyze the user's message below. If it matches any trigger phrase (exact or close semantic match), execute the skill and respond. Otherwise, say "SKILL_NOT_TRIGGERED" and explain why.
`;

    const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SKILL_SYSTEM_PROMPT + '\n\n' + skillContext,
        messages: [{ role: 'user', content: testPhrase }],
    });

    const responseText = response.content[0].type === 'text'
        ? response.content[0].text
        : '';

    const triggered = !responseText.includes('SKILL_NOT_TRIGGERED');
    const tokensUsed = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);

    return { triggered, response: responseText, tokensUsed };
}

/**
 * Run a skill with sample input and get output
 */
export async function runSkillPreview(
    apiKey: string,
    skill: Skill,
    userMessage: string
): Promise<{ response: string; tokensUsed: number }> {
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

    const skillContext = `
## SKILL: ${skill.name}
${skill.description}

## INSTRUCTIONS
${skill.instructions}

Execute this skill for the user's request.
`;

    const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: skillContext,
        messages: [{ role: 'user', content: userMessage }],
    });

    const responseText = response.content[0].type === 'text'
        ? response.content[0].text
        : '';

    const tokensUsed = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);

    return { response: responseText, tokensUsed };
}

/**
 * Validate API key by making a minimal request
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
    try {
        const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
        await client.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 10,
            messages: [{ role: 'user', content: 'Hi' }],
        });
        return true;
    } catch {
        return false;
    }
}

/**
 * Industry presets for skill generation
 */
export const INDUSTRY_PRESETS = {
    'real-estate': {
        name: 'Real Estate',
        context: 'Property listings, client summaries, market analysis, open house prep',
        examples: ['property descriptions', 'listing generator', 'buyer summary']
    },
    'legal': {
        name: 'Legal',
        context: 'Client intake, contract review, case summaries, legal research',
        examples: ['contract clause generator', 'client intake form', 'case brief']
    },
    'financial': {
        name: 'Financial Services',
        context: 'Financial analysis, investment summaries, client reports',
        examples: ['financial statement analysis', 'investment memo', 'quarterly report']
    },
    'e-commerce': {
        name: 'E-Commerce',
        context: 'Product descriptions, social media posts, SEO content',
        examples: ['product listing', 'Instagram caption', 'SEO description']
    },
    'professional-services': {
        name: 'Professional Services',
        context: 'Proposals, meeting notes, client communications',
        examples: ['proposal generator', 'meeting summary', 'follow-up email']
    }
} as const;

export type IndustryPreset = keyof typeof INDUSTRY_PRESETS;

interface GeneratedSkill {
    name: string;
    description: string;
    category: string;
    triggers: string[];
    instructions: string;
}

/**
 * Generate a skill from a natural language description
 */
export async function generateSkillFromDescription(
    apiKey: string,
    description: string,
    industry?: IndustryPreset
): Promise<{ skill: GeneratedSkill; tokensUsed: number }> {
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

    const industryContext = industry && INDUSTRY_PRESETS[industry]
        ? `\n\nIndustry context: ${INDUSTRY_PRESETS[industry].name} - ${INDUSTRY_PRESETS[industry].context}`
        : '';

    const systemPrompt = `You are a Claude Skills expert. Generate a professional Claude Skill based on the user's description.

Output a JSON object with this exact structure:
{
  "name": "skill-name-slug",
  "description": "A clear 1-2 sentence description of what the skill does",
  "category": "Category name",
  "triggers": ["trigger phrase 1", "trigger phrase 2", "trigger phrase 3"],
  "instructions": "Detailed markdown instructions for Claude to follow..."
}

Guidelines:
- name: lowercase, hyphenated, max 50 chars (e.g., "property-listing-generator")
- description: Clear value proposition, 50-150 chars
- category: One of: Real Estate, Business, Finance, Marketing, Legal, Product, Development
- triggers: 3-5 natural phrases users would say (e.g., "create a listing", "draft a property description")
- instructions: Detailed markdown with:
  - Clear role/persona for Claude
  - Step-by-step process
  - Input requirements (use {{placeholders}})
  - Output format expectations
  - Any constraints or guidelines${industryContext}

Respond ONLY with valid JSON. No markdown code blocks.`;

    const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: 'user', content: description }],
    });

    const responseText = response.content[0].type === 'text'
        ? response.content[0].text
        : '';

    const tokensUsed = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);

    // Parse the JSON response
    try {
        const skill = JSON.parse(responseText) as GeneratedSkill;
        return { skill, tokensUsed };
    } catch {
        // If parsing fails, try to extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const skill = JSON.parse(jsonMatch[0]) as GeneratedSkill;
            return { skill, tokensUsed };
        }
        throw new Error('Failed to parse skill from AI response');
    }
}
