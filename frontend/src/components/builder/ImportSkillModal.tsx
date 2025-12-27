import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, AlertCircle } from 'lucide-react';
import { useSkillStore } from '@/lib/store/skillStore';

export function ImportSkillModal() {
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('');
    const { setSkill } = useSkillStore();
    const [error, setError] = useState<string | null>(null);

    const parseSkill = (text: string) => {
        try {
            // Simple frontmatter parser
            const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
            const match = text.match(frontmatterRegex);

            if (!match) {
                // Assume whole text is instructions if no frontmatter
                setSkill({
                    name: 'Imported Skill',
                    description: '',
                    category: 'Imported',
                    triggers: [],
                    tags: [],
                    instructions: text.trim(),
                    resources: []
                });
                setOpen(false);
                return;
            }

            const yaml = match[1];
            const body = match[2].trim();

            // Simple YAML parser regex
            const nameMatch = yaml.match(/^name:\s*(.+)$/m);
            const descMatch = yaml.match(/^description:\s*(.+)$/m);
            const catMatch = yaml.match(/^category:\s*(.+)$/m);

            // Triggers - look for list
            const triggers: string[] = [];
            const triggersBlock = yaml.match(/triggers:\s*\n((?:  - .+\n?)+)/);
            if (triggersBlock) {
                const lines = triggersBlock[1].split('\n');
                lines.forEach(line => {
                    const tMatch = line.match(/^\s*-\s*"?([^"]+)"?$/);
                    if (tMatch) triggers.push(tMatch[1].replace(/^"|"$/g, ''));
                });
            }

            setSkill({
                name: (nameMatch?.[1] || 'Imported Skill').trim(),
                description: (descMatch?.[1] || '').trim(),
                category: (catMatch?.[1] || 'Imported').trim(),
                tags: [],
                triggers: triggers,
                instructions: body,
                resources: []
            });
            setOpen(false);
            setContent('');
            setError(null);
        } catch (e) {
            console.error(e);
            setError('Failed to parse skill content. Ensure valid YAML frontmatter.');
        }
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setContent(text);
                parseSkill(text);
            };
            reader.readAsText(file);
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Import
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="sm:max-w-[500px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Import Skill</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 py-6">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer relative h-[140px]">
                            <input
                                type="file"
                                accept=".md,.txt"
                                onChange={handleFile}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                            <p className="text-sm font-medium">Upload SKILL.md</p>
                            <p className="text-xs text-muted-foreground">Select a file from your computer</p>
                        </div>
                        <div className="border rounded-lg p-4 bg-muted/20">
                            <h4 className="text-sm font-medium mb-2">Supported Format</h4>
                            <pre className="text-[10px] text-muted-foreground font-mono bg-card p-2 rounded border overflow-x-auto">
                                {`---
name: My Skill
description: ...
triggers:
  - /trigger
---

Instructions...`}
                            </pre>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or paste content</span>
                        </div>
                    </div>

                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Paste skill content here..."
                        className="font-mono text-xs min-h-[200px]"
                    />

                    {error && (
                        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-2 rounded">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <Button onClick={() => parseSkill(content)} disabled={!content.trim()} className="w-full">
                        Import Skill
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
