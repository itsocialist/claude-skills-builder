import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Download, Sparkles, BookOpen, Zap, Package } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
    title: 'What is a Claude Skill? | GetClaudeSkills',
    description: 'Learn what Claude Skills are, how they enhance your AI assistant, and how to install them in under 2 minutes.',
    openGraph: {
        title: 'What is a Claude Skill?',
        description: 'Transform Claude into a specialized expert with downloadable skill packs.',
    },
}

export default function WhatIsAClaudeSkillPage() {
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
                        What is a Claude Skill?
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Think of Claude Skills as &quot;brain upgrades&quot; for your AI assistant.
                        They transform Claude from a general-purpose helper into a specialized expert
                        for your specific needs.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* The Simple Explanation */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-primary" />
                        The Simple Explanation
                    </h2>
                    <Card className="p-6 bg-muted/30">
                        <p className="text-lg text-foreground/90 leading-relaxed">
                            A Claude Skill is a <strong>pre-written set of instructions</strong> that tells
                            Claude exactly how to help you with specific tasks. When you install a skill,
                            Claude learns new abilities—like how to write real estate listings, create
                            marketing copy, or analyze business data in your preferred style.
                        </p>
                    </Card>
                </section>

                {/* How It Works */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-primary" />
                        How It Works
                    </h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="p-6 text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-primary">1</span>
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">Browse</h3>
                            <p className="text-sm text-muted-foreground">
                                Find a skill in our marketplace that matches your needs
                            </p>
                        </Card>
                        <Card className="p-6 text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-primary">2</span>
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">Download</h3>
                            <p className="text-sm text-muted-foreground">
                                Click download to get a .zip file containing the skill
                            </p>
                        </Card>
                        <Card className="p-6 text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-primary">3</span>
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">Install</h3>
                            <p className="text-sm text-muted-foreground">
                                Upload to Claude.ai or drag to your Projects folder
                            </p>
                        </Card>
                    </div>
                </section>

                {/* What's In a Skill */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                        <Package className="w-6 h-6 text-primary" />
                        What&apos;s Inside a Skill?
                    </h2>
                    <div className="space-y-4">
                        <Card className="p-4">
                            <div className="flex items-start gap-4">
                                <code className="text-primary font-mono text-sm bg-muted px-2 py-1 rounded">SKILL.md</code>
                                <div>
                                    <p className="text-foreground font-medium">The brain of the skill</p>
                                    <p className="text-sm text-muted-foreground">
                                        Contains instructions, formatting rules, and examples that tell Claude how to behave
                                    </p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-4">
                            <div className="flex items-start gap-4">
                                <code className="text-primary font-mono text-sm bg-muted px-2 py-1 rounded">README.md</code>
                                <div>
                                    <p className="text-foreground font-medium">Quick start guide</p>
                                    <p className="text-sm text-muted-foreground">
                                        Explains what the skill does and how to use it effectively
                                    </p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-4 border-dashed">
                            <div className="flex items-start gap-4">
                                <code className="text-muted-foreground font-mono text-sm bg-muted px-2 py-1 rounded">templates/</code>
                                <div>
                                    <p className="text-muted-foreground font-medium">Optional extras</p>
                                    <p className="text-sm text-muted-foreground">
                                        Some skills include example templates, data formats, or reference files
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* FAQ */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-primary" />
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-foreground mb-2">Do I need to be technical to use skills?</h3>
                            <p className="text-muted-foreground">
                                Not at all! If you can upload a file and send a message, you can use skills.
                                No coding or technical knowledge required.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground mb-2">Are skills free?</h3>
                            <p className="text-muted-foreground">
                                Most skills in our marketplace are free! Creators can optionally set a price
                                for premium skills, but there&apos;s plenty of free options to get started.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground mb-2">Will skills work with my Claude subscription?</h3>
                            <p className="text-muted-foreground">
                                Yes! Skills work with any Claude.ai account—Free, Pro, or Team. You just need
                                to be able to create Projects or upload files.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground mb-2">Can I create my own skills?</h3>
                            <p className="text-muted-foreground">
                                Absolutely! Use our Skill Builder to create custom skills in minutes.
                                Answer a few questions, and we&apos;ll generate a professional skill pack for you.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <div className="text-center">
                    <Card className="p-8 bg-gradient-to-r from-primary/10 to-primary/5">
                        <h2 className="text-2xl font-bold text-foreground mb-4">
                            Ready to supercharge your Claude?
                        </h2>
                        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                            Browse our marketplace to find skills created by professionals, or build
                            your own custom skill in under 5 minutes.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/marketplace">
                                <Button size="lg" className="gap-2">
                                    <Download className="w-4 h-4" />
                                    Browse Skills
                                </Button>
                            </Link>
                            <Link href="/app/builder">
                                <Button variant="outline" size="lg" className="gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Build Your Own
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
