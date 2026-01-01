'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shell } from '@/components/layout/Shell'
import { Download, Layers, Sparkles, Search, FileText, BarChart3, Rocket, ChevronDown, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MarkdownOutput } from '@/components/MarkdownOutput'
import { cn } from '@/lib/utils'
import { saveAs } from 'file-saver'
import { toast } from 'sonner'

import { bundles as sharedBundles } from '@/lib/constants/bundles'

// Map icon strings to components for rendering
const iconMap = {
    Search: <Search className="w-8 h-8" />,
    FileText: <FileText className="w-8 h-8" />,
    BarChart3: <BarChart3 className="w-8 h-8" />,
    Rocket: <Rocket className="w-8 h-8" />
};

const bundles = sharedBundles.map(b => ({
    ...b,
    icon: iconMap[b.iconName]
}));

// Re-export specific local interface if needed for strict typing in this file, or rely on shared type
interface Bundle {
    id: string
    name: string
    tagline: string
    icon: React.ReactNode // Local override because we hydrated the icon
    color: string
    skills: string[]
    outputExample: string
    outputType: string
}

export default function PowerBundlesPage() {
    const [expandedBundle, setExpandedBundle] = useState<string | null>(null)

    const handleDownload = async (bundle: Bundle) => {
        const toastId = toast.loading(`Preparing ${bundle.name} bundle...`);
        try {
            // Use server API to bypass RLS
            const response = await fetch('/api/bundles/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bundleName: bundle.name,
                    skillNames: bundle.skills,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate bundle');
            }

            const blob = await response.blob();
            const slugName = bundle.name.toLowerCase().replace(/\s+/g, '-');
            saveAs(blob, `${slugName}.skill`);
            toast.success(`${bundle.name} bundle ready!`, { id: toastId });
        } catch (error: any) {
            console.error('Bundle download failed:', error);
            toast.error(error.message || 'Failed to generate bundle', { id: toastId });
        }
    }

    return (
        <Shell title="Power Bundles">
            <div className="container mx-auto py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Layers className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-bold text-foreground">Power Bundles</h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl">
                        Curated skill collections designed for specific outcomes.
                        Get multiple skills working together in one download.
                    </p>
                </div>

                {/* Bundles Grid */}
                <div className="py-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {bundles.map((bundle) => (
                            <Card
                                key={bundle.id}
                                className={cn(
                                    "overflow-hidden transition-all duration-300",
                                    expandedBundle === bundle.id && "ring-2 ring-primary"
                                )}
                            >
                                {/* Bundle Header */}
                                <div className="p-5 border-b border-border">
                                    <div className="flex items-start justify-between">
                                        <Link href={`/bundles/${bundle.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                {bundle.icon}
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-foreground">{bundle.name}</h2>
                                                <p className="text-sm text-muted-foreground">{bundle.tagline}</p>
                                            </div>
                                        </Link>
                                        <div className="flex flex-col items-center justify-center bg-muted badge-rect px-3 py-1.5 min-w-[3.5rem]">
                                            <span className="text-lg font-bold text-foreground leading-none">
                                                {bundle.skills.length}
                                            </span>
                                            <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                                                skills
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills List */}
                                <div className="p-4 border-b border-border">
                                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                                        Included Skills
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {bundle.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="text-xs bg-muted px-2 py-1 rounded flex items-center gap-1"
                                            >
                                                <Check className="w-3 h-3 text-green-500" />
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Output Preview Toggle */}
                                <button
                                    onClick={() => setExpandedBundle(expandedBundle === bundle.id ? null : bundle.id)}
                                    className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-medium text-foreground">
                                            See Example {bundle.outputType}
                                        </span>
                                    </div>
                                    <ChevronDown
                                        className={cn(
                                            "w-5 h-5 text-muted-foreground transition-transform",
                                            expandedBundle === bundle.id && "rotate-180"
                                        )}
                                    />
                                </button>

                                {/* Expanded Output Example */}
                                {expandedBundle === bundle.id && (
                                    <div className="p-4 bg-muted/30 border-t border-border">
                                        <div className="bundle-output-preview bg-card rounded-lg p-6 overflow-x-auto">
                                            <MarkdownOutput content={bundle.outputExample} />
                                        </div>
                                    </div>
                                )}

                                {/* CTA */}
                                <div className="p-4 bg-card">
                                    <Button className="w-full" onClick={() => handleDownload(bundle)}>
                                        <Download className="w-4 h-4 mr-2" />
                                        Get This Bundle
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-12 text-center">
                        <p className="text-muted-foreground mb-4">
                            Want to create your own bundle? Build custom skills and package them together.
                        </p>
                        <Link href="/app/packages/new">
                            <Button variant="outline" className="gap-2">
                                <Sparkles className="w-4 h-4" />
                                Build Your Own
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Shell>
    )
}
