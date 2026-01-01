import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, AlertTriangle, Lightbulb, Code2, Play } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
    title: 'Skill Best Practices | GetClaudeSkills',
    description: 'Learn how to create high-quality, reliable Claude Skills with our best practices guide.',
    openGraph: {
        title: 'Claude Skill Best Practices',
        description: 'Design, write, and test skills like a pro.',
    },
}

export default function BestPracticesPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-gradient-to-b from-primary/10 to-background py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        Skill Best Practices
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Creating a skill is easy, but creating a <em>great</em> skill takes a little more thought.
                        Follow these guidelines to ensure your skills are reliable, helpful, and easy to use.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Core Principles */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                        <Lightbulb className="w-6 h-6 text-primary" />
                        Core Principles
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="p-6">
                            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                Be Specific
                            </h3>
                            <p className="text-muted-foreground">
                                Vague skills produce vague results. Instead of "Write content", try
                                "Write a LinkedIn post about B2B SaaS trends".
                            </p>
                        </Card>
                        <Card className="p-6">
                            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                Use Examples
                            </h3>
                            <p className="text-muted-foreground">
                                Claude learns best by example. providing 2-3 examples of the input
                                and desired output significantly improves quality.
                            </p>
                        </Card>
                        <Card className="p-6">
                            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                Define Structure
                            </h3>
                            <p className="text-muted-foreground">
                                Tell Claude exactly how to format the response. Do you want markdown?
                                A JSON object? A bulleted list? Be explicit.
                            </p>
                        </Card>
                        <Card className="p-6">
                            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                Handle Edge Cases
                            </h3>
                            <p className="text-muted-foreground">
                                Tell Claude what to do if it doesn't have enough information.
                                Should it ask questions? Make assumptions? Fail gracefully?
                            </p>
                        </Card>
                    </div>
                </section>

                {/* Common Pitfalls */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6 text-primary" />
                        Common Pitfalls to Avoid
                    </h2>
                    <div className="space-y-4">
                        <Card className="p-4 border-l-4 border-l-yellow-500">
                            <h3 className="font-medium text-foreground mb-1">Overloading Constraints</h3>
                            <p className="text-sm text-muted-foreground">
                                Don't give Claude 50 rules to follow at once. Break complex tasks into
                                smaller, chained skills if necessary.
                            </p>
                        </Card>
                        <Card className="p-4 border-l-4 border-l-yellow-500">
                            <h3 className="font-medium text-foreground mb-1">Assuming Context</h3>
                            <p className="text-sm text-muted-foreground">
                                Remember that users might not provide all the background info.
                                Instruct Claude to ask clarifying questions if key details are missing.
                            </p>
                        </Card>
                        <Card className="p-4 border-l-4 border-l-yellow-500">
                            <h3 className="font-medium text-foreground mb-1">Neglecting Tone</h3>
                            <p className="text-sm text-muted-foreground">
                                Without guidance, Claude defaults to a helpful assistant tone.
                                If you need a specific voice (e.g., professional, witty, concise), explicit state it.
                            </p>
                        </Card>
                    </div>
                </section>

                {/* Formatting Guide */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                        <Code2 className="w-6 h-6 text-primary" />
                        Formatting Your Skill
                    </h2>
                    <Card className="p-6 bg-muted/50">
                        <p className="text-muted-foreground mb-4">
                            We recommend using XML tags to structure your skill prompts clearly. This helps
                            Claude separate instructions from data.
                        </p>
                        <pre className="bg-background p-4 rounded-md overflow-x-auto text-sm">
                            {`<instruction>
  You are an expert copywriter. Your goal is to rewrite the user's text
  to be more punchy and concise.
</instruction>

<examples>
  User: "I think that maybe we should consider..."
  Assistant: "We should consider..."
</examples>

<format>
  Return only the rewritten text. Do not include conversational filler.
</format>`}
                        </pre>
                    </Card>
                </section>

                {/* CTA */}
                <div className="text-center">
                    <Card className="p-8 bg-gradient-to-r from-primary/10 to-primary/5">
                        <h2 className="text-2xl font-bold text-foreground mb-4">
                            Ready to apply these practices?
                        </h2>
                        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                            Head over to the Skill Builder and create your next masterpiece.
                        </p>
                        <Link href="/app/builder">
                            <Button size="lg" className="gap-2">
                                <Play className="w-4 h-4" />
                                Open Skill Builder
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    )
}
