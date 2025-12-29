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

    // Agent Skills Architecture alignment:
    // Skills are injected as ephemeral USER messages (hidden via isMeta: true), not System messages.
    // To simulate this via the public API, we prepend the instruction to the user's message.
    const fullUserMessage = `${SKILL_SYSTEM_PROMPT}\n\n${skillContext}\n\n--- User Message ---\n${testPhrase}`;

    const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        // System prompt removed to better simulate skill behavior
        messages: [{ role: 'user', content: fullUserMessage }],
    });

    const responseText = response.content[0].type === 'text'
        ? response.content[0].text
        : '';

    const triggered = !responseText.includes('SKILL_NOT_TRIGGERED');
    const tokensUsed = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);

    return { triggered, response: responseText, tokensUsed };
}

/**
 * Run a skill with sample input and get output (DEMO MODE - generates sample data)
 * Now with STREAMING for real-time output!
 */
export async function runSkillPreview(
    apiKey: string,
    skill: Skill,
    userMessage: string,
    onChunk?: (text: string) => void
): Promise<{ response: string; tokensUsed: number }> {
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

    const skillContext = `
## DEMO MODE - Skill Preview
You are demonstrating the skill: **${skill.name}**
${skill.description}

## INSTRUCTIONS
${skill.instructions}

## IMPORTANT - DEMONSTRATION RULES:
- This is a PREVIEW/DEMO to show the user what the skill will produce
- Generate REALISTIC sample data as if you had access to all necessary tools, databases, and APIs
- Do NOT say you don't have access to data - instead, CREATE convincing sample data
- Make the output look professional and production-ready
- If the skill needs external data (real estate listings, financial data, etc.), GENERATE plausible examples
- Format the output exactly as the skill would in production

Execute this skill for the user's request below and generate a complete, realistic output.
`;

    const fullUserMessage = `${skillContext}\n\n--- User Request ---\n${userMessage}`;

    const stream = client.messages.stream({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [{ role: 'user', content: fullUserMessage }],
    });

    let fullText = '';
    let inputTokens = 0;
    let outputTokens = 0;

    for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            fullText += event.delta.text;
            if (onChunk) {
                onChunk(fullText); // Send incremental updates to UI
            }
        } else if (event.type === 'message_start') {
            inputTokens = event.message.usage.input_tokens;
        } else if (event.type === 'message_delta') {
            outputTokens = event.usage.output_tokens;
        }
    }

    const tokensUsed = inputTokens + outputTokens;

    return { response: fullText, tokensUsed };
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

/**
 * AI Analysis result structure
 */
export interface AIAnalysisResult {
    overallScore: number; // 1-10
    summary: string;
    suggestions: {
        type: 'error' | 'warning' | 'suggestion';
        area: 'triggers' | 'instructions' | 'structure' | 'clarity' | 'security';
        message: string;
    }[];
}

/**
 * Analyze a skill's content using Claude AI
 */
export async function analyzeSkillContent(
    apiKey: string,
    skillContent: string
): Promise<{ analysis: AIAnalysisResult; tokensUsed: number }> {
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

    const systemPrompt = `You are a Claude Skills expert and code reviewer. Analyze the provided skill content and provide actionable feedback.

Output a JSON object with this exact structure:
{
  "overallScore": 7,
  "summary": "Brief 1-2 sentence overall assessment",
  "suggestions": [
    {
      "type": "warning",
      "area": "triggers",
      "message": "Consider adding more specific trigger phrases to reduce false positives"
    }
  ]
}

Evaluation criteria:
- **Triggers (triggers):** Are they specific enough? Too generic? Missing common variations?
- **Instructions (instructions):** Clear? Has examples? Proper formatting?
- **Structure (structure):** Valid YAML? Correct frontmatter? Well-organized?
- **Clarity (clarity):** Easy to understand? Ambiguous wording?
- **Security (security):** Any risky patterns (eval, external URLs, credential requests)?

Types:
- "error": Critical issues that must be fixed
- "warning": Issues that should be addressed
- "suggestion": Optional improvements

Respond ONLY with valid JSON. No markdown code blocks.`;

    const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: `Analyze this Claude Skill:\n\n${skillContent}` }],
    });

    const responseText = response.content[0].type === 'text'
        ? response.content[0].text
        : '';

    const tokensUsed = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);

    try {
        const analysis = JSON.parse(responseText) as AIAnalysisResult;
        return { analysis, tokensUsed };
    } catch {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]) as AIAnalysisResult;
            return { analysis, tokensUsed };
        }
        throw new Error('Failed to parse AI analysis response');
    }
}

/**
 * Refine a generated skill based on user feedback
 */
export async function refineSkillWithFeedback(
    apiKey: string,
    currentSkill: {
        name: string;
        description: string;
        category: string;
        triggers: string[];
        instructions: string;
    },
    feedback: string
): Promise<{ skill: GeneratedSkill; tokensUsed: number }> {
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

    const systemPrompt = `You are a Claude Skills expert. The user has generated a skill but wants changes.
Apply their feedback to refine the skill.

Current Skill:
${JSON.stringify(currentSkill, null, 2)}

User Feedback:
${feedback}

Output a JSON object with this exact structure:
{
  "name": "skill-name-slug",
  "description": "Updated description",
  "category": "Category name",
  "triggers": ["updated trigger 1", "updated trigger 2"],
  "instructions": "Refined markdown instructions..."
}

Respond ONLY with valid JSON. No markdown code blocks.`;

    const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: 'user', content: 'Refine this skill based on my feedback.' }],
    });

    const responseText = response.content[0].type === 'text'
        ? response.content[0].text
        : '';

    const tokensUsed = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);

    try {
        const skill = JSON.parse(responseText) as GeneratedSkill;
        return { skill, tokensUsed };
    } catch {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const skill = JSON.parse(jsonMatch[0]) as GeneratedSkill;
            return { skill, tokensUsed };
        }
        throw new Error('Failed to parse refined skill from AI response');
    }
}
// Cache bust: 1766820444
