'use client';

import { useParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Shell } from '@/components/layout/Shell';
import { bundles as sharedBundles } from '@/lib/constants/bundles';
import { Package, Download, Check, ArrowLeft, Layers, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MarkdownOutput } from '@/components/MarkdownOutput';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import { Search, FileText, BarChart3, Rocket } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SkillPreview {
    title: string;
    preview_image_url: string | null;
    slug: string;
}

// Map icon strings to components for rendering (reused)
const iconMap: Record<string, React.ReactNode> = {
    Search: <Search className="w-12 h-12" />,
    FileText: <FileText className="w-12 h-12" />,
    BarChart3: <BarChart3 className="w-12 h-12" />,
    Rocket: <Rocket className="w-12 h-12" />
};

export default function BundleDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const [skillPreviews, setSkillPreviews] = useState<Record<string, SkillPreview>>({});

    const bundle = sharedBundles.find(b => b.id === id);

    // Fetch preview images for skills in this bundle
    useEffect(() => {
        async function fetchSkillPreviews() {
            if (!bundle) return;

            const { data, error } = await supabase
                .from('market_listings')
                .select('title, preview_image_url, slug')
                .in('title', bundle.skills);

            if (data && !error) {
                const previewMap: Record<string, SkillPreview> = {};
                data.forEach(skill => {
                    previewMap[skill.title] = skill;
                });
                setSkillPreviews(previewMap);
            }
        }
        fetchSkillPreviews();
    }, [bundle]);

    if (!bundle) {
        notFound();
    }

    const { name, tagline, description, iconName, skills, outputExample, outputType } = bundle;
    const Icon = iconMap[iconName] || <Layers className="w-12 h-12" />;

    const handleDownload = async () => {
        const toastId = toast.loading(`Preparing ${name} bundle...`);
        try {
            const response = await fetch('/api/bundles/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bundleName: name,
                    skillNames: skills,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate bundle');
            }

            const blob = await response.blob();
            const slugName = name.toLowerCase().replace(/\s+/g, '-');
            saveAs(blob, `${slugName}.skill`);
            toast.success(`${name} bundle ready!`, { id: toastId });
        } catch (error: any) {
            console.error('Bundle download failed:', error);
            toast.error(error.message || 'Failed to generate bundle', { id: toastId });
        }
    };

    return (
        <Shell title={name}>
            <div className="container mx-auto py-8 max-w-5xl">
                {/* Back Link */}
                <div className="mb-6">
                    <Link href="/bundles" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Bundles
                    </Link>
                </div>

                {/* Hero Section */}
                <div className="grid md:grid-cols-[1fr_300px] gap-8 mb-12">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                {Icon}
                            </div>
                            <h1 className="text-4xl font-bold text-foreground">{name}</h1>
                        </div>
                        <p className="text-xl text-muted-foreground mb-6">
                            {tagline}
                        </p>
                        <p className="text-foreground/80 leading-relaxed mb-8">
                            {description || "This power bundle combines multiple high-performance skills into a single, cohesive workflow. Perfect for users looking to accelerate their productivity in this domain."}
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" onClick={handleDownload} className="gap-2">
                                <Download className="w-5 h-5" />
                                Get This Bundle
                            </Button>
                        </div>
                    </div>

                    {/* Stats / Info Card */}
                    <Card className="p-6 h-fit">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                            Bundle Contents
                        </h3>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex flex-col items-center justify-center bg-muted/50 rounded-lg p-3 min-w-[4rem]">
                                <span className="text-2xl font-bold text-foreground leading-none">
                                    {skills.length}
                                </span>
                                <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mt-1">
                                    skills
                                </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                All skills optimized to work together seamlessly.
                            </div>
                        </div>
                        <div className="space-y-3">
                            {skills.map(skill => {
                                const preview = skillPreviews[skill];
                                const hasPreview = preview?.preview_image_url;

                                const skillContent = (
                                    <div
                                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${preview?.slug ? 'hover:bg-muted/50 cursor-pointer' : ''}`}
                                    >
                                        {/* Thumbnail or fallback */}
                                        <div className="relative w-12 h-9 rounded overflow-hidden bg-muted/50 flex-shrink-0 border border-border/50">
                                            {hasPreview ? (
                                                <Image
                                                    src={preview.preview_image_url!}
                                                    alt={skill}
                                                    fill
                                                    sizes="48px"
                                                    className="object-cover object-top"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Check className="w-4 h-4 text-green-500" />
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium">{skill}</span>
                                    </div>
                                );

                                return preview?.slug ? (
                                    <Link key={skill} href={`/marketplace/${preview.slug}`}>
                                        {skillContent}
                                    </Link>
                                ) : (
                                    <div key={skill}>{skillContent}</div>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* Example Output Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <h2 className="text-2xl font-bold text-foreground">
                            See Example {outputType}
                        </h2>
                    </div>
                    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                        <div className="p-8 overflow-x-auto">
                            <MarkdownOutput content={outputExample} />
                        </div>
                    </div>
                </div>

            </div>
        </Shell>
    );
}
