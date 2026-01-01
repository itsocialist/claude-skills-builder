export interface LessonModule {
    id: string;
    title: string;
    description: string;
    skillTemplate: {
        name: string;
        description: string;
        triggers: string[];
        instructions: string;
    };
}

export interface LessonPlan {
    id: string;
    title: string;
    description: string;
    modules: LessonModule[];
    role?: string;
    goal?: string;
}

// Pre-defined templates for the "AI" to "generate"
const PLANS: Record<string, LessonPlan> = {
    'marketer-content': {
        id: 'marketer-content',
        title: 'Viral Content Engine',
        description: 'A masterclass in automating high-conversion social content. You will build a system that turns raw ideas into polished posts.',
        modules: [
            {
                id: 'm1',
                title: 'The Viral Hook Generator',
                description: 'Teach Claude to write scroll-stopping openings based on proven psychological triggers.',
                skillTemplate: {
                    name: 'Viral Hook Generator',
                    description: 'Generates 5 variations of scroll-stopping hooks for any topic using psychological triggers (Curiosity, Urgency, Benefit).',
                    triggers: ['Write hooks for', 'Create headlines for', 'Hook me up'],
                    instructions: `You are an expert copywriter specializing in viral social media hooks.

When I ask you to write hooks for a topic:
1.  Analyze the topic for its core emotional appeal.
2.  Generate 5 distinct hook variations using these patterns:
    *   **The "How I"**: Personal story angle.
    *   **The "Negative"**: "Stop doing X".
    *   **The "Listicle"**: "7 ways to...".
    *   **The "Secret"**: "Most people don't know...".
    *   **The "Benefit"**: "Get X without Y".

Output format:
- Bold the pattern name.
- Provide the hook in quotes.
- Briefly explain why it works.`
                }
            },
            {
                id: 'm2',
                title: 'SEO Blog Post Architect',
                description: 'Scale your long-form content with a structure that ranks and reads well.',
                skillTemplate: {
                    name: 'SEO Blog Architect',
                    description: 'Drafts comprehensive SEO-optimized blog outlines with keyword integration.',
                    triggers: ['Outline a blog post about', 'SEO structure for'],
                    instructions: 'Create a detailed SEO blog post outline...'
                }
            }
        ]
    },
    'developer-automate': {
        id: 'developer-automate',
        title: 'DevOps Automation Suite',
        description: 'Streamline your deployment pipeline and automate repetitive coding tasks.',
        modules: [
            {
                id: 'd1',
                title: 'The PR Description Writer',
                description: 'Never write a manual PR description again. parsing diffs into summaries.',
                skillTemplate: {
                    name: 'PR Auto-Describer',
                    description: 'Generates comprehensive Pull Request descriptions from git diffs or component summaries.',
                    triggers: ['Draft PR description', 'Summarize these changes'],
                    instructions: `You are a Senior DevOps Engineer.

When provided with a code summary or git diff:
1.  Identify the core changes (Features, Fixes, Chores).
2.  Draft a clean, markdown-formatted PR description.
3.  Include a "Testing Plan" section.

Format:
## 🚀 Changes
- [List of changes]

## 🧪 Verification
- [Steps to verify]`
                }
            }
        ]
    },
    'default': {
        id: 'general-mastery',
        title: 'Claude Mastery Path',
        description: 'A foundational path to mastering prompt engineering and system prompts.',
        modules: [
            {
                id: 'g1',
                title: 'The Universal Translator',
                description: 'Teach Claude to translate complex jargon into simple, clear explanations.',
                skillTemplate: {
                    name: 'Jargon Simplifier',
                    description: 'Rewrites complex text into an "Explain Like I\'m 5" format.',
                    triggers: ['Explain simply', 'ELI5', 'Translate to plain english'],
                    instructions: `You are a master communicator.

Rule: Rewrite the provided text so a 5-year-old could understand it.
- Use simple analogies.
- Avoid passive voice.
- Keep sentences short.`
                }
            }
        ]
    }
};

/**
 * Heuristically generates a lesson plan based on user profile.
 * Simulates AI "thinking" time in the UI.
 */
export async function generateLessonPlan(role: string, goal: string, experience: number): Promise<LessonPlan> {
    // Artificial delay to simulate "AI processing"
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Simple mapping logic
    const key = `${role}-${goal}`.toLowerCase();

    let plan = PLANS['default'];

    // Partial matches
    if (role === 'marketer' || goal === 'content') plan = PLANS['marketer-content'];
    if (role === 'developer' || goal === 'automate') plan = PLANS['developer-automate'];

    // Inject context
    return {
        ...plan,
        role,
        goal
    };
}
