'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import { useSkillStore } from '@/lib/store/skillStore';
import { Template } from '@/types/skill.types';
import { CheckCircle, ChevronDown, ChevronUp, Download, ExternalLink, Share2 } from 'lucide-react';
import { useState } from 'react';
import { PreviewMarkdown } from '@/components/marketplace/PreviewMarkdown';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { copyToClipboard } from '@/lib/utils/clipboard';

interface TemplateDetailSheetProps {
    template: Template | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// Generate benefits based on template content
function generateBenefits(template: Template): string[] {
    const benefits: string[] = [];
    if (template.triggers.length > 0) {
        benefits.push(`${template.triggers.length} ready-to-use prompt${template.triggers.length > 1 ? 's' : ''}`);
    }
    if (template.instructions.length > 200) {
        benefits.push('Detailed, comprehensive instructions');
    }
    if (template.tags.length > 0) {
        benefits.push(`Optimized for ${template.tags.slice(0, 2).join(' and ')}`);
    }
    benefits.push('Customizable in the Builder');
    benefits.push('Download as portable ZIP');
    return benefits;
}

export function TemplateDetailSheet({ template, open, onOpenChange }: TemplateDetailSheetProps) {
    const router = useRouter();
    const { setSkill } = useSkillStore();
    const [showInstructions, setShowInstructions] = useState(false);
    const [showSampleOutput, setShowSampleOutput] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!template) return null;

    const handleShare = () => {
        const shareUrl = `${window.location.origin}/app/templates/${template.id}`;
        copyToClipboard(shareUrl, 'Share link');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleUseTemplate = () => {
        setSkill({
            name: template.name,
            description: template.description,
            category: template.category,
            tags: template.tags,
            triggers: template.triggers,
            instructions: template.instructions,
        });
        onOpenChange(false);
        router.push('/app/builder');
    };

    const handleDownloadZip = async () => {
        const zip = new JSZip();
        const skillContent = `---
name: ${template.name}
description: ${template.description}
category: ${template.category}
tags: [${template.tags.map(t => `"${t}"`).join(', ')}]
---

# ${template.name}

${template.description}

## Triggers

${template.triggers.map(t => `- "${t}"`).join('\n')}

## Instructions

${template.instructions}
`;
        zip.file('SKILL.md', skillContent);
        const blob = await zip.generateAsync({ type: 'blob' });
        const safeName = template.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        saveAs(blob, `${safeName}.zip`);
    };

    const handleViewFullPage = () => {
        onOpenChange(false);
        router.push(`/app/templates/${template.id}`);
    };

    const benefits = generateBenefits(template);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto px-6">
                <SheetHeader className="text-left pb-4 border-b border-border">
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{template.category}</Badge>
                    </div>
                    <SheetTitle className="text-2xl">{template.name}</SheetTitle>
                    <SheetDescription className="text-base leading-relaxed">
                        {template.description}
                    </SheetDescription>
                </SheetHeader>

                <div className="py-6 space-y-5">
                    {/* Preview Thumbnail */}
                    {template.preview_image_url && (
                        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-muted/30 border border-border/50">
                            <Image
                                src={template.preview_image_url}
                                alt={`Preview of ${template.name}`}
                                fill
                                sizes="(max-width: 640px) 100vw, 400px"
                                className="object-cover object-top"
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button onClick={handleUseTemplate} size="lg" className="flex-1">
                            Use This Template
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleShare}
                            className={copied ? 'text-green-500 border-green-500/50' : ''}
                        >
                            <Share2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="lg" onClick={handleDownloadZip}>
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Tags */}
                    {template.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {template.tags.map((tag, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* What You Get */}
                    <Card className="p-4">
                        <h4 className="font-semibold mb-3 text-foreground">What You Get</h4>
                        <ul className="space-y-2">
                            {benefits.map((benefit, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-foreground">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    {/* Example Prompts */}
                    {template.triggers.length > 0 && (
                        <Card className="p-4">
                            <h4 className="font-semibold mb-3 text-foreground">Example Prompts</h4>
                            <div className="space-y-2">
                                {template.triggers.slice(0, 3).map((trigger, i) => (
                                    <div key={i} className="text-sm bg-muted px-3 py-2 rounded-lg text-foreground">
                                        &ldquo;{trigger}&rdquo;
                                    </div>
                                ))}
                                {template.triggers.length > 3 && (
                                    <p className="text-xs text-muted-foreground">
                                        +{template.triggers.length - 3} more prompts
                                    </p>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Sample Output (Collapsible) */}
                    {template.sampleOutput && (
                        <Card className="p-4">
                            <button
                                onClick={() => setShowSampleOutput(!showSampleOutput)}
                                className="w-full flex items-center justify-between text-left"
                            >
                                <h4 className="font-semibold text-foreground">Sample Output</h4>
                                {showSampleOutput ? (
                                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                )}
                            </button>
                            {showSampleOutput && (
                                <div className="mt-3 bg-white text-black rounded-lg p-6 shadow-sm border border-gray-200 overflow-x-auto">
                                    <PreviewMarkdown content={template.sampleOutput} theme="light" />
                                </div>
                            )}
                        </Card>
                    )}

                    {/* Full Instructions (Collapsible) */}
                    <Card className="p-4">
                        <button
                            onClick={() => setShowInstructions(!showInstructions)}
                            className="w-full flex items-center justify-between text-left"
                        >
                            <h4 className="font-semibold text-foreground">Full Instructions</h4>
                            {showInstructions ? (
                                <ChevronUp className="w-4 h-4 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            )}
                        </button>
                        {showInstructions && (
                            <div className="mt-3 bg-zinc-900 border border-zinc-700 rounded-lg p-3 overflow-x-auto max-h-[300px] overflow-y-auto">
                                <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap">{template.instructions}</pre>
                            </div>
                        )}
                    </Card>

                    {/* View Full Page Link */}
                    <Button
                        variant="ghost"
                        className="w-full text-muted-foreground"
                        onClick={handleViewFullPage}
                    >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Full Details Page
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
