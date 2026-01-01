import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Upload, FolderOpen, MessageSquare, CheckCircle, Monitor, Laptop } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
    title: 'How to Install a Claude Skill | GetClaudeSkills',
    description: 'Step-by-step guide to installing Claude Skills in your Claude.ai account. Takes less than 2 minutes!',
}

export default function InstallationGuidePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-gradient-to-b from-primary/10 to-background py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/learn/what-is-a-skill"
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        What is a Claude Skill?
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        Installation Guide
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Get your new skill running in Claude.ai in under 2 minutes.
                        No technical knowledge required!
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Prerequisites */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-foreground mb-4">Before You Start</h2>
                    <Card className="p-6">
                        <div className="flex items-start gap-4">
                            <Monitor className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-foreground font-medium mb-2">You&apos;ll need:</p>
                                <ul className="text-sm text-muted-foreground space-y-2">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        A Claude.ai account (Free, Pro, or Team)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        A downloaded skill (.zip file)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        The Claude desktop app or claude.ai website
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Method 1: Projects */}
                <section className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-sm font-bold text-primary-foreground">1</span>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">Method: Claude Projects</h2>
                        <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">Recommended</span>
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6">
                            <div className="flex items-start gap-4">
                                <FolderOpen className="w-6 h-6 text-primary flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-foreground mb-2">Step 1: Create a New Project</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        In Claude.ai, click the <strong>&quot;Projects&quot;</strong> tab in the sidebar,
                                        then click <strong>&quot;Create Project&quot;</strong>.
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Name it something descriptive, like &quot;Real Estate Assistant&quot; or
                                        &quot;Marketing Writer&quot;.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-start gap-4">
                                <Upload className="w-6 h-6 text-primary flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-foreground mb-2">Step 2: Upload the Skill</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        <strong>Unzip</strong> your downloaded skill file first. Then drag the
                                        <code className="mx-1 px-1.5 py-0.5 bg-muted rounded text-primary">SKILL.md</code>
                                        file into the Project&apos;s &quot;Project Knowledge&quot; section.
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        💡 <strong>Pro tip:</strong> You can also upload any README or template files
                                        that came with the skill.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-start gap-4">
                                <MessageSquare className="w-6 h-6 text-primary flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-foreground mb-2">Step 3: Start Chatting!</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Click &quot;Start Chat&quot; in your new project. Claude now has all the
                                        knowledge and instructions from your skill!
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Try asking Claude to do what the skill is designed for. For example:
                                        &quot;Write me a property listing for a 3-bedroom house&quot;
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* Method 2: Quick Upload */}
                <section className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-sm font-bold text-foreground">2</span>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">Alternative: Quick Upload</h2>
                    </div>

                    <Card className="p-6">
                        <div className="flex items-start gap-4">
                            <Laptop className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">For One-Time Use</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    If you just want to try a skill quickly without creating a project:
                                </p>
                                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                                    <li>Start a new chat in Claude.ai</li>
                                    <li>Click the paperclip icon to attach a file</li>
                                    <li>Upload your SKILL.md file</li>
                                    <li>In your message, type: &quot;Use the attached skill to help me with...&quot;</li>
                                </ol>
                                <p className="text-sm text-muted-foreground mt-4 text-amber-600">
                                    ⚠️ Note: The skill won&apos;t persist between chats with this method.
                                </p>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Troubleshooting */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-foreground mb-4">Troubleshooting</h2>
                    <div className="space-y-4">
                        <Card className="p-4">
                            <h3 className="font-semibold text-foreground mb-2">
                                Claude isn&apos;t following the skill instructions
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Make sure you uploaded the SKILL.md file (not the .zip file). If using Projects,
                                verify the file appears in the Project Knowledge section.
                            </p>
                        </Card>
                        <Card className="p-4">
                            <h3 className="font-semibold text-foreground mb-2">
                                I can&apos;t find the Projects feature
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Projects require a Claude Pro or Team subscription. With the free tier,
                                use the Quick Upload method instead.
                            </p>
                        </Card>
                    </div>
                </section>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-8 border-t border-border">
                    <Link href="/learn/what-is-a-skill">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            What is a Skill?
                        </Button>
                    </Link>
                    <Link href="/marketplace">
                        <Button className="gap-2">
                            Browse Skills
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
