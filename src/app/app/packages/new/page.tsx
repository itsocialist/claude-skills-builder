'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/layout/Shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { usePackageStore } from '@/lib/store/packageStore';
import { getTemplates } from '@/lib/api/templateApi';
import { generatePackageZip } from '@/lib/utils/package-generator';
import { ResourceManager } from '@/components/builder/ResourceManager';
import { Check, ChevronLeft, ChevronRight, Download, Package } from 'lucide-react';
import type { SkillType } from '@/types/package.types';
import { Template } from '@/types/skill.types';

const STEPS = ['Details', 'Skills', 'Resources', 'Export'];

export default function NewPackagePage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const { pkg, updateField, addSkill, removeSkill, addResource, removeResource, reset } = usePackageStore();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getTemplates();
                setTemplates(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const handleDownload = async () => {
        try {
            const blob = await generatePackageZip(pkg);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${pkg.name || 'skill-bundle'}.zip`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to generate package:', error);
        }
    };

    const isSkillSelected = (templateId: string) => {
        return pkg.skills.some(s => s.skill.name === templates.find(t => t.id === templateId)?.name);
    };

    const toggleSkill = (templateId: string) => {
        const template = templates.find(t => t.id === templateId);
        if (!template) return;

        const existingSkill = pkg.skills.find(s => s.skill.name === template.name);
        if (existingSkill) {
            removeSkill(existingSkill.id);
        } else {
            addSkill({
                name: template.name,
                description: template.description,
                category: template.category,
                tags: template.tags,
                triggers: template.triggers,
                instructions: template.instructions,
            }, 'Structured' as SkillType);
        }
    };

    return (
        <Shell title="New Package">
            <div className="container mx-auto py-8 max-w-3xl">
                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8 gap-2">
                    {STEPS.map((s, i) => (
                        <div key={s} className="flex items-center">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${i < step ? 'bg-primary text-white' :
                                i === step ? 'bg-primary/20 text-primary border-2 border-primary' :
                                    'bg-muted text-muted-foreground'
                                }`}>
                                {i < step ? <Check className="h-4 w-4" /> : i + 1}
                            </div>
                            <span className={`ml-2 text-sm ${i === step ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                                {s}
                            </span>
                            {i < STEPS.length - 1 && <div className="w-8 h-px bg-border mx-4" />}
                        </div>
                    ))}
                </div>

                <Card className="p-6 border-border">
                    {/* Step 1: Details */}
                    {step === 0 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-foreground mb-4">Package Details</h2>
                            <div>
                                <label className="text-sm font-medium text-foreground">Name</label>
                                <Input
                                    value={pkg.name}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    placeholder="My Skill Bundle"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground">Description</label>
                                <Textarea
                                    value={pkg.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                    placeholder="A bundle of skills for..."
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Skills */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-foreground mb-2">Select Skills</h2>
                            <p className="text-sm text-muted-foreground mb-4">
                                Choose skills to bundle ({pkg.skills.length} selected)
                            </p>
                            <div className="grid gap-3 max-h-80 overflow-y-auto">
                                {loading && <div className="text-center p-4">Loading templates...</div>}
                                {!loading && templates.map((template) => (
                                    <div
                                        key={template.id}
                                        onClick={() => toggleSkill(template.id)}
                                        className={`p-3 rounded-lg border cursor-pointer transition ${isSkillSelected(template.id)
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-foreground">{template.name}</h4>
                                                <p className="text-xs text-muted-foreground">{template.category}</p>
                                            </div>
                                            {isSkillSelected(template.id) && (
                                                <Check className="h-5 w-5 text-primary" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Resources */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-foreground mb-2">Add Resources</h2>
                            <p className="text-sm text-muted-foreground mb-4">
                                Attach reference files to include in the bundle ({pkg.resources.length} files)
                            </p>
                            <ResourceManager
                                resources={pkg.resources}
                                onAdd={(resource) => addResource(resource)}
                                onRemove={(id) => removeResource(id)}
                            />
                        </div>
                    )}

                    {/* Step 4: Export */}
                    {step === 3 && (
                        <div className="space-y-4 text-center">
                            <Package className="h-12 w-12 mx-auto text-primary" />
                            <h2 className="text-xl font-bold text-foreground">Ready to Export</h2>
                            <p className="text-muted-foreground">
                                Your package contains {pkg.skills.length} skill{pkg.skills.length !== 1 ? 's' : ''}
                            </p>
                            <Button onClick={handleDownload} size="lg">
                                <Download className="h-4 w-4 mr-2" />
                                Download Package
                            </Button>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between mt-6 pt-6 border-t border-border">
                        <Button
                            variant="outline"
                            onClick={() => step > 0 ? setStep(step - 1) : router.push('/app/packages')}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            {step === 0 ? 'Cancel' : 'Back'}
                        </Button>
                        {step < STEPS.length - 1 && (
                            <Button onClick={() => setStep(step + 1)}>
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        )}
                    </div>
                </Card>
            </div>
        </Shell>
    );
}
