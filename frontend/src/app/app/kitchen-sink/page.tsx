'use client';

import { useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MarkdownOutput } from '@/components/MarkdownOutput';
import {
    Plus, Search, Download, Edit3, Trash2, Copy, Settings,
    ChevronDown, Check, X, Loader2, Sparkles, Package,
    FileText, BarChart3, Rocket, Eye, Share2, AlertCircle,
    Info, CheckCircle, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

export default function KitchenSinkPage() {
    const [inputValue, setInputValue] = useState('');
    const [textareaValue, setTextareaValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Example markdown for preview
    const exampleMarkdown = `## Sample Markdown Output

This is an example of **bold text** and *italic text*.

### Features
- List item one
- List item two
- List item three

\`\`\`javascript
const example = "code block";
console.log(example);
\`\`\`
`;

    return (
        <Shell title="Kitchen Sink">
            <div className="py-8 space-y-12">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Kitchen Sink</h1>
                    <p className="text-muted-foreground">
                        Component and style reference for GetClaudeSkills. Use this page to audit and maintain consistency.
                    </p>
                </div>

                {/* Color Palette */}
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">Color Palette</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <div className="space-y-2">
                            <div className="h-16 rounded-lg bg-primary"></div>
                            <p className="text-xs text-muted-foreground">Primary (#C15F3C)</p>
                        </div>
                        <div className="space-y-2">
                            <div className="h-16 rounded-lg bg-primary/20"></div>
                            <p className="text-xs text-muted-foreground">Primary/20</p>
                        </div>
                        <div className="space-y-2">
                            <div className="h-16 rounded-lg bg-background border border-border"></div>
                            <p className="text-xs text-muted-foreground">Background</p>
                        </div>
                        <div className="space-y-2">
                            <div className="h-16 rounded-lg bg-card border border-border"></div>
                            <p className="text-xs text-muted-foreground">Card</p>
                        </div>
                        <div className="space-y-2">
                            <div className="h-16 rounded-lg bg-muted"></div>
                            <p className="text-xs text-muted-foreground">Muted</p>
                        </div>
                        <div className="space-y-2">
                            <div className="h-16 rounded-lg bg-destructive"></div>
                            <p className="text-xs text-muted-foreground">Destructive</p>
                        </div>
                    </div>
                </section>

                {/* Typography */}
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">Typography</h2>
                    <div className="space-y-4">
                        <div>
                            <h1 className="text-4xl font-bold text-foreground">Heading 1 - 4xl Bold</h1>
                            <p className="text-xs text-muted-foreground mt-1">text-4xl font-bold text-foreground</p>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-foreground">Heading 2 - 3xl Bold</h2>
                            <p className="text-xs text-muted-foreground mt-1">text-3xl font-bold text-foreground</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-foreground">Heading 3 - 2xl Semibold</h3>
                            <p className="text-xs text-muted-foreground mt-1">text-2xl font-semibold text-foreground</p>
                        </div>
                        <div>
                            <h4 className="text-xl font-semibold text-foreground">Heading 4 - xl Semibold</h4>
                            <p className="text-xs text-muted-foreground mt-1">text-xl font-semibold text-foreground</p>
                        </div>
                        <div>
                            <h5 className="text-lg font-medium text-foreground">Heading 5 - lg Medium</h5>
                            <p className="text-xs text-muted-foreground mt-1">text-lg font-medium text-foreground</p>
                        </div>
                        <div>
                            <p className="text-base text-foreground">Body text - base foreground</p>
                            <p className="text-xs text-muted-foreground mt-1">text-base text-foreground</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Secondary text - sm muted</p>
                            <p className="text-xs text-muted-foreground mt-1">text-sm text-muted-foreground</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Caption text - xs muted</p>
                            <p className="text-xs text-muted-foreground mt-1">text-xs text-muted-foreground</p>
                        </div>
                    </div>
                </section>

                {/* Buttons */}
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">Buttons</h2>
                    <div className="space-y-6">
                        {/* Default variants */}
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-3">Variants</h3>
                            <div className="flex flex-wrap gap-3">
                                <Button>Default</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="outline">Outline</Button>
                                <Button variant="ghost">Ghost</Button>
                                <Button variant="destructive">Destructive</Button>
                                <Button variant="link">Link</Button>
                            </div>
                        </div>

                        {/* Sizes */}
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-3">Sizes</h3>
                            <div className="flex flex-wrap items-center gap-3">
                                <Button size="sm">Small</Button>
                                <Button>Default</Button>
                                <Button size="lg">Large</Button>
                                <Button size="icon"><Plus className="w-4 h-4" /></Button>
                            </div>
                        </div>

                        {/* With icons */}
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-3">With Icons</h3>
                            <div className="flex flex-wrap gap-3">
                                <Button><Plus className="w-4 h-4 mr-2" />Create</Button>
                                <Button variant="outline"><Download className="w-4 h-4 mr-2" />Download</Button>
                                <Button variant="ghost"><Settings className="w-4 h-4 mr-2" />Settings</Button>
                            </div>
                        </div>

                        {/* States */}
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-3">States</h3>
                            <div className="flex flex-wrap gap-3">
                                <Button disabled>Disabled</Button>
                                <Button disabled><Loader2 className="w-4 h-4 mr-2 animate-spin" />Loading</Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Form Elements */}
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">Form Elements</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Input</label>
                                <Input
                                    placeholder="Enter text..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Input with Icon</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input className="pl-10" placeholder="Search..." />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Disabled Input</label>
                                <Input disabled placeholder="Disabled" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Textarea</label>
                                <Textarea
                                    placeholder="Enter longer text..."
                                    value={textareaValue}
                                    onChange={(e) => setTextareaValue(e.target.value)}
                                    rows={4}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Cards */}
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">Cards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Basic Card */}
                        <Card className="p-4">
                            <h3 className="font-medium text-foreground mb-1">Basic Card</h3>
                            <p className="text-sm text-muted-foreground">Standard card component with padding.</p>
                        </Card>

                        {/* Skill Card Style */}
                        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-4 hover:border-[#C15F3C]/50 transition-all">
                            <div className="flex items-start justify-between mb-1">
                                <div>
                                    <h3 className="text-white font-medium">Skill Card Style</h3>
                                    <span className="text-xs text-[#C15F3C] bg-[#C15F3C]/10 px-2 py-0.5 rounded-full mt-0.5 inline-block">
                                        Category
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-400 line-clamp-2">
                                This is the My Skills card style with reduced spacing.
                            </p>
                            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#3a3a3a]/50 text-xs text-gray-400">
                                <span className="flex items-center gap-1.5">
                                    <Eye className="w-3.5 h-3.5" />
                                    <span className="font-medium text-gray-300">42</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Download className="w-3.5 h-3.5" />
                                    <span className="font-medium text-gray-300">12</span>
                                </span>
                            </div>
                        </div>

                        {/* Action Card */}
                        <button className="group p-6 border-2 border-dashed border-border rounded-xl bg-card hover:border-primary/50 hover:bg-primary/5 transition-all text-left">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                    <Plus className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-1">Action Card</h3>
                                    <p className="text-sm text-muted-foreground">Dashed border with hover effect</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </section>

                {/* Badges & Tags */}
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">Badges & Tags</h2>
                    <div className="flex flex-wrap gap-3">
                        <span className="text-xs text-[#C15F3C] bg-[#C15F3C]/10 px-2 py-0.5 rounded-full">Primary Badge</span>
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">Muted Badge</span>
                        <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Success
                        </span>
                        <span className="text-xs bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <X className="w-3 h-3" /> Error
                        </span>
                        <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Warning
                        </span>
                    </div>
                </section>

                {/* Alerts */}
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">Alerts</h2>
                    <div className="space-y-3">
                        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-blue-500">Information</p>
                                <p className="text-sm text-blue-400/80">This is an informational alert message.</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-green-500">Success</p>
                                <p className="text-sm text-green-400/80">Your action was completed successfully.</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-yellow-500">Warning</p>
                                <p className="text-sm text-yellow-400/80">Please review before proceeding.</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-red-500">Error</p>
                                <p className="text-sm text-red-400/80">Something went wrong. Please try again.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Icons */}
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">Common Icons</h2>
                    <div className="flex flex-wrap gap-4">
                        {[
                            { icon: Plus, name: 'Plus' },
                            { icon: Search, name: 'Search' },
                            { icon: Download, name: 'Download' },
                            { icon: Edit3, name: 'Edit3' },
                            { icon: Trash2, name: 'Trash2' },
                            { icon: Copy, name: 'Copy' },
                            { icon: Settings, name: 'Settings' },
                            { icon: Sparkles, name: 'Sparkles' },
                            { icon: Package, name: 'Package' },
                            { icon: FileText, name: 'FileText' },
                            { icon: BarChart3, name: 'BarChart3' },
                            { icon: Rocket, name: 'Rocket' },
                            { icon: Eye, name: 'Eye' },
                            { icon: Share2, name: 'Share2' },
                            { icon: Loader2, name: 'Loader2' },
                        ].map(({ icon: Icon, name }) => (
                            <div key={name} className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50">
                                <Icon className="w-5 h-5 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Markdown Output */}
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">Markdown Output</h2>
                    <Card className="p-4">
                        <MarkdownOutput content={exampleMarkdown} />
                    </Card>
                </section>

                {/* Toast Examples */}
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">Toasts (Sonner)</h2>
                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" onClick={() => toast.success('Success toast!')}>
                            Success Toast
                        </Button>
                        <Button variant="outline" onClick={() => toast.error('Error toast!')}>
                            Error Toast
                        </Button>
                        <Button variant="outline" onClick={() => toast.info('Info toast!')}>
                            Info Toast
                        </Button>
                        <Button variant="outline" onClick={() => toast.loading('Loading...')}>
                            Loading Toast
                        </Button>
                    </div>
                </section>

                {/* Spacing Reference */}
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">Spacing Reference</h2>
                    <div className="space-y-2">
                        {[0.5, 1, 2, 3, 4, 6, 8, 12].map((size) => (
                            <div key={size} className="flex items-center gap-4">
                                <span className="text-xs text-muted-foreground w-12">gap-{size}</span>
                                <div className={`h-4 bg-primary/50 rounded`} style={{ width: `${size * 4}px` }}></div>
                                <span className="text-xs text-muted-foreground">{size * 4}px</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </Shell>
    );
}
