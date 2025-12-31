'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Shell } from '@/components/layout/Shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle, Loader2, Sparkles, Lightbulb, Settings, ChevronDown, ChevronRight, Key } from 'lucide-react';
import { useSiteSettings } from '@/lib/contexts/SiteSettingsContext';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLibraryStore } from '@/lib/store/libraryStore';
import { DEFAULT_FLAGS } from '@/lib/flags';
import { Library, ChevronDown as SelectChevron } from 'lucide-react';

interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
    info: {
        name?: string;
        description?: string;
        triggers?: string[];
        resourceCount?: number;
    };
    aiAnalysis?: {
        overallScore: number;
        summary: string;
        suggestions: {
            type: 'error' | 'warning' | 'suggestion';
            area: string;
            message: string;
        }[];
    };
}

interface InspectorPanelProps {
    result: ValidationResult | null;
    analyzing: boolean;
    onAnalyze: () => void;
    canAnalyze: boolean;
    useAI: boolean;
    setUseAI: (val: boolean) => void;
    apiKey: string;
    setApiKey: (val: string) => void;
}

// Inspector Panel Component with tabs
function InspectorPanel({
    result,
    analyzing,
    onAnalyze,
    canAnalyze,
    useAI,
    setUseAI,
    apiKey,
    setApiKey
}: InspectorPanelProps) {
    const [activeTab, setActiveTab] = useState<'results' | 'config'>('results');
    const [showApiKey, setShowApiKey] = useState(true);
    const { user } = useAuth();
    const { settings } = useSiteSettings();

    // Feature Flag Logic for AI
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').toLowerCase().split(',');
    const isAdmin = user?.email && adminEmails.some(e => e.trim() === user.email?.toLowerCase().trim());
    const genFlag = settings.feature_flags?.feature_generations || DEFAULT_FLAGS.feature_generations;
    const canUseAI = genFlag !== 'DISABLED' && (genFlag !== 'ADMIN_ONLY' || isAdmin);

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-border px-4 flex-shrink-0">
                <button
                    onClick={() => setActiveTab('results')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'results' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    Results
                </button>
                <button
                    onClick={() => setActiveTab('config')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'config' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    Config
                </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-auto">
                {activeTab === 'config' && (
                    <div className="p-4 space-y-4">
                        {/* API Key Section */}
                        <div className="border border-border rounded-md">
                            <button
                                onClick={() => setShowApiKey(!showApiKey)}
                                className="w-full flex items-center justify-between p-3 text-sm font-medium text-foreground hover:bg-accent/50 rounded-md transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Key className="w-4 h-4 text-primary" />
                                    <span>API Key</span>
                                    {apiKey && (
                                        <span className="text-xs text-green-500 flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> Configured
                                        </span>
                                    )}
                                </div>
                                {showApiKey ? (
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                )}
                            </button>
                            {showApiKey && (
                                <div className="px-3 pb-3 space-y-2">
                                    <input
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        placeholder="sk-ant-..."
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Your Claude API key for AI-powered analysis
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* AI Toggle */}
                        {canUseAI && (
                            <div className="flex items-center justify-between p-3 border border-border rounded-md">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-[#C15F3C]" />
                                    <span className="text-sm font-medium text-foreground">AI Analysis</span>
                                </div>
                                <button
                                    onClick={() => setUseAI(!useAI)}
                                    className={`w-10 h-5 rounded-full transition-colors ${useAI ? 'bg-[#C15F3C]' : 'bg-muted'}`}
                                >
                                    <span className={`block w-4 h-4 rounded-full bg-white shadow transform transition-transform ${useAI ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'results' && (
                    <div className="p-4 space-y-4">
                        {!result ? (
                            <div className="flex flex-col items-center justify-center text-center py-12">
                                <FileText className="w-10 h-10 text-muted-foreground/50 mb-3" />
                                <p className="text-sm text-muted-foreground">Upload or paste content, then click Analyze</p>
                            </div>
                        ) : (
                            <>
                                {/* Status Header */}
                                <div className="flex items-center gap-3">
                                    {result.valid ? (
                                        <CheckCircle className="w-6 h-6 text-green-500" />
                                    ) : (
                                        <XCircle className="w-6 h-6 text-red-500" />
                                    )}
                                    <div>
                                        <h3 className="font-semibold text-foreground">
                                            {result.valid ? 'Valid Skill' : 'Invalid Skill'}
                                        </h3>
                                        {result.info.name && (
                                            <p className="text-sm text-muted-foreground">{result.info.name}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Errors */}
                                {result.errors.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-2">
                                            <XCircle className="w-4 h-4" />
                                            Errors ({result.errors.length})
                                        </h4>
                                        <ul className="space-y-1">
                                            {result.errors.map((error, i) => (
                                                <li key={i} className="text-sm text-red-300 pl-4">• {error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Warnings */}
                                {result.warnings.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-yellow-400 mb-2 flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4" />
                                            Warnings ({result.warnings.length})
                                        </h4>
                                        <ul className="space-y-1">
                                            {result.warnings.map((warning, i) => (
                                                <li key={i} className="text-sm text-yellow-300 pl-4">• {warning}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Info */}
                                {result.info.description && (
                                    <div className="pt-3 border-t border-border">
                                        <h4 className="text-sm font-medium text-foreground mb-1">Description</h4>
                                        <p className="text-sm text-muted-foreground">{result.info.description}</p>
                                    </div>
                                )}

                                {result.info.triggers && result.info.triggers.length > 0 && (
                                    <div className="pt-3 border-t border-border">
                                        <h4 className="text-sm font-medium text-foreground mb-2">Triggers</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {result.info.triggers.map((trigger, i) => (
                                                <span key={i} className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                                                    {trigger}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* AI Analysis */}
                                {result.aiAnalysis && (
                                    <div className="pt-3 border-t border-[#C15F3C]/30">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-[#C15F3C]" />
                                                <h4 className="text-sm font-medium text-foreground">AI Analysis</h4>
                                            </div>
                                            <span className="px-2 py-0.5 bg-[#C15F3C]/10 text-[#C15F3C] rounded-full text-xs font-medium">
                                                {result.aiAnalysis.overallScore}/10
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">{result.aiAnalysis.summary}</p>

                                        {result.aiAnalysis.suggestions.length > 0 && (
                                            <div className="space-y-2">
                                                <h5 className="text-xs font-medium text-foreground flex items-center gap-1">
                                                    <Lightbulb className="w-3 h-3" />
                                                    Suggestions ({result.aiAnalysis.suggestions.length})
                                                </h5>
                                                <ul className="space-y-2">
                                                    {result.aiAnalysis.suggestions.map((suggestion, i) => (
                                                        <li
                                                            key={i}
                                                            className={`text-xs pl-3 py-1.5 rounded ${suggestion.type === 'error' ? 'bg-red-500/10 text-red-300 border-l-2 border-red-500' :
                                                                suggestion.type === 'warning' ? 'bg-yellow-500/10 text-yellow-300 border-l-2 border-yellow-500' :
                                                                    'bg-blue-500/10 text-blue-300 border-l-2 border-blue-500'
                                                                }`}
                                                        >
                                                            <span className="text-[10px] font-medium uppercase text-muted-foreground mr-1">[{suggestion.area}]</span>
                                                            {suggestion.message}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Analyze Button - Fixed at bottom */}
            <div className="p-4 border-t border-border flex-shrink-0">
                <Button
                    onClick={onAnalyze}
                    disabled={!canAnalyze || analyzing}
                    className="w-full"
                >
                    {analyzing ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        'Analyze Skill'
                    )}
                </Button>
            </div>
        </div>
    );
}

function InspectorPageContent() {
    const { user } = useAuth();
    const { skills, fetchSkills } = useLibraryStore();
    const searchParams = useSearchParams();
    const [file, setFile] = useState<File | null>(null);
    const [skillContent, setSkillContent] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<ValidationResult | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [useAI, setUseAI] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
    const [showSkillPicker, setShowSkillPicker] = useState(false);

    // Fetch user's skills on mount
    useEffect(() => {
        if (user) {
            fetchSkills(user.id);
        }
    }, [user, fetchSkills]);

    // Auto-load skill from URL param (when navigating from My Skills)
    useEffect(() => {
        const urlSkillId = searchParams.get('skillId');
        if (urlSkillId && skills.length > 0 && !selectedSkillId) {
            const skill = skills.find(s => s.id === urlSkillId);
            if (skill) {
                setSelectedSkillId(urlSkillId);
                setSkillContent(`---
name: ${skill.name}
description: ${skill.description || ''}
category: ${skill.category || ''}
triggers: [${skill.triggers.map(t => `"${t}"`).join(', ')}]
---

${skill.instructions || ''}`);
            }
        }
    }, [searchParams, skills, selectedSkillId]);

    // Generate SKILL.md content from a saved skill
    const generateSkillMd = (skill: typeof skills[0]) => {
        return `---
name: ${skill.name}
description: ${skill.description || ''}
category: ${skill.category || ''}
triggers: [${skill.triggers.map(t => `"${t}"`).join(', ')}]
---

${skill.instructions || ''}`;
    };

    // Handle skill selection from dropdown
    const handleSkillSelect = (skillId: string) => {
        const skill = skills.find(s => s.id === skillId);
        if (skill) {
            setSelectedSkillId(skillId);
            setSkillContent(generateSkillMd(skill));
            setFile(null); // Clear any uploaded file
            setResult(null); // Clear previous results
        }
        setShowSkillPicker(false);
    };

    // Clear selected skill
    const clearSelectedSkill = () => {
        setSelectedSkillId(null);
        setSkillContent('');
        setResult(null);
    };

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            // .md files can be read directly; .skill and .zip are archives
            if (droppedFile.name.endsWith('.md')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setSkillContent(event.target?.result as string || '');
                };
                reader.readAsText(droppedFile);
            }
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            // .md files can be read directly; .skill and .zip are archives
            if (selectedFile.name.endsWith('.md')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setSkillContent(event.target?.result as string || '');
                };
                reader.readAsText(selectedFile);
            }
        }
    };

    const analyzeSkill = async () => {
        setAnalyzing(true);
        setResult(null);

        try {
            const formData = new FormData();
            if (file) {
                formData.append('file', file);
            } else if (skillContent) {
                formData.append('content', skillContent);
            }
            if (useAI && apiKey) {
                formData.append('useAI', 'true');
                formData.append('apiKey', apiKey);
            }

            const response = await fetch('/api/inspector', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Analysis error:', error);
            setResult({
                valid: false,
                errors: ['Failed to analyze skill. Please try again.'],
                warnings: [],
                info: {},
            });
        } finally {
            setAnalyzing(false);
        }
    };

    const canAnalyze = !!(file || skillContent);

    const inspectorPanel = (
        <InspectorPanel
            result={result}
            analyzing={analyzing}
            onAnalyze={analyzeSkill}
            canAnalyze={canAnalyze}
            useAI={useAI}
            setUseAI={setUseAI}
            apiKey={apiKey}
            setApiKey={setApiKey}
        />
    );

    return (
        <Shell title="Skill Inspector" inspector={inspectorPanel}>
            <div className="p-6 space-y-4">
                {/* Header - Compact */}
                <div className="mb-2">
                    <h1 className="text-xl font-bold text-foreground">Skill Inspector</h1>
                    <p className="text-sm text-muted-foreground">
                        Validate and analyze SKILL.md files or ZIP packages
                    </p>
                </div>

                {/* Skill Picker - Select from My Skills */}
                {user && skills.length > 0 && (
                    <div className="relative">
                        <button
                            onClick={() => setShowSkillPicker(!showSkillPicker)}
                            className="w-full flex items-center justify-between gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Library className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        {selectedSkillId
                                            ? skills.find(s => s.id === selectedSkillId)?.name
                                            : 'Select from My Skills'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {selectedSkillId
                                            ? 'Click to change'
                                            : `${skills.length} skill${skills.length === 1 ? '' : 's'} available`}
                                    </p>
                                </div>
                            </div>
                            <SelectChevron className={`w-4 h-4 text-muted-foreground transition-transform ${showSkillPicker ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown List */}
                        {showSkillPicker && (
                            <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {skills.map(skill => (
                                    <button
                                        key={skill.id}
                                        onClick={() => handleSkillSelect(skill.id)}
                                        className={`w-full text-left px-4 py-3 text-sm hover:bg-primary/5 border-b border-border last:border-b-0 transition-colors ${skill.id === selectedSkillId ? 'bg-primary/10 text-primary' : 'text-foreground'
                                            }`}
                                    >
                                        <p className="font-medium">{skill.name}</p>
                                        {skill.description && (
                                            <p className="text-xs text-muted-foreground truncate">{skill.description}</p>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Clear selection button */}
                        {selectedSkillId && (
                            <button
                                onClick={clearSelectedSkill}
                                className="absolute right-12 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                )}

                {/* Compact Upload Area */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleFileDrop}
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${dragOver ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                >
                    <div className="flex items-center justify-center gap-4">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                        <div className="text-left">
                            <p className="text-sm text-foreground">
                                Drop a file here or{' '}
                                <label htmlFor="file-input" className="text-primary cursor-pointer hover:underline">
                                    browse
                                </label>
                            </p>
                            <p className="text-xs text-muted-foreground">SKILL.md, .zip, or .skill</p>
                        </div>
                        <input
                            type="file"
                            accept=".md,.zip,.skill"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-input"
                        />
                    </div>
                    {file && (
                        <div className="mt-3 pt-3 border-t border-border flex items-center justify-center gap-2 text-sm">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="text-foreground">{file.name}</span>
                            <span className="text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                            <button
                                onClick={() => { setFile(null); setSkillContent(''); }}
                                className="ml-2 text-xs text-muted-foreground hover:text-foreground"
                            >
                                Clear
                            </button>
                        </div>
                    )}
                </div>

                {/* Paste Content Area - More compact */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Or paste SKILL.md content
                    </label>
                    <textarea
                        value={skillContent}
                        onChange={(e) => setSkillContent(e.target.value)}
                        placeholder="---&#10;name: My Skill&#10;description: A helpful skill&#10;---&#10;&#10;# Instructions..."
                        className="w-full h-96 px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-none font-mono text-sm"
                    />
                </div>
            </div>
        </Shell>
    );
}

export default function InspectorPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        }>
            <InspectorPageContent />
        </Suspense>
    );
}
