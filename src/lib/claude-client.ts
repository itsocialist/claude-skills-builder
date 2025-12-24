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
