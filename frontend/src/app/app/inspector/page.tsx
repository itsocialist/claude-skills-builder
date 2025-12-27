'use client';

import { useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle, Loader2, Sparkles, Lightbulb } from 'lucide-react';

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

export default function InspectorPage() {
    const [file, setFile] = useState<File | null>(null);
    const [skillContent, setSkillContent] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<ValidationResult | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [useAI, setUseAI] = useState(false);
    const [apiKey, setApiKey] = useState('');

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
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

    return (
        <Shell title="Skill Inspector">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground mb-2">Skill Inspector</h1>
                    <p className="text-muted-foreground">
                        Upload a SKILL.md file or ZIP package to validate and analyze its contents.
                    </p>
                </div>

                {/* Upload Area */}
                <Card className="p-6 mb-6">
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleFileDrop}
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragOver ? 'border-primary bg-primary/5' : 'border-border'
                            }`}
                    >
                        <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-foreground mb-2">
                            Drag and drop a SKILL.md or ZIP file here
                        </p>
                        <p className="text-muted-foreground text-sm mb-4">
                            or click to select a file
                        </p>
                        <input
                            type="file"
                            accept=".md,.zip"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-input"
                        />
                        <label htmlFor="file-input">
                            <Button variant="outline" className="cursor-pointer" asChild>
                                <span>Select File</span>
                            </Button>
                        </label>
                    </div>

                    {file && (
                        <div className="mt-4 flex items-center gap-2 text-sm">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground">{file.name}</span>
                            <span className="text-muted-foreground">
                                ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                        </div>
                    )}
                </Card>

                {/* Or Paste Content */}
                <Card className="p-6 mb-6">
                    <h3 className="text-sm font-medium text-foreground mb-3">Or paste SKILL.md content</h3>
                    <textarea
                        value={skillContent}
                        onChange={(e) => setSkillContent(e.target.value)}
                        placeholder="---&#10;name: My Skill&#10;description: A helpful skill&#10;---&#10;&#10;# Instructions..."
                        className="w-full h-40 px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-none font-mono text-sm"
                    />
                </Card>

                {/* AI Analysis Options */}
                <Card className="p-6 mb-6 border-l-4 border-l-[#C15F3C]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-[#C15F3C]" />
                            <h3 className="text-sm font-medium text-foreground">AI-Powered Analysis</h3>
                        </div>
                        <button
                            onClick={() => setUseAI(!useAI)}
                            className={`w-10 h-5 rounded-full transition-colors ${useAI ? 'bg-[#C15F3C]' : 'bg-muted'}`}
                        >
                            <span className={`block w-4 h-4 rounded-full bg-white shadow transform transition-transform ${useAI ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </button>
                    </div>
                    {useAI && (
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Claude API Key (BYOK)</label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="sk-ant-..."
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm"
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                                Get deep AI-powered suggestions for improving your skill.
                            </p>
                        </div>
                    )}
                </Card>

                {/* Analyze Button */}
                <Button
                    onClick={analyzeSkill}
                    disabled={(!file && !skillContent) || analyzing}
                    className="w-full mb-6"
                    size="lg"
                >
                    {analyzing ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        'Analyze Skill'
                    )}
                </Button>

                {/* Results */}
                {result && (
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            {result.valid ? (
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            ) : (
                                <XCircle className="w-8 h-8 text-red-500" />
                            )}
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">
                                    {result.valid ? 'Valid Skill' : 'Invalid Skill'}
                                </h3>
                                {result.info.name && (
                                    <p className="text-muted-foreground">{result.info.name}</p>
                                )}
                            </div>
                        </div>

                        {/* Errors */}
                        {result.errors.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-2">
                                    <XCircle className="w-4 h-4" />
                                    Errors ({result.errors.length})
                                </h4>
                                <ul className="space-y-1">
                                    {result.errors.map((error, i) => (
                                        <li key={i} className="text-sm text-red-300 pl-6">
                                            • {error}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Warnings */}
                        {result.warnings.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-yellow-400 mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Warnings ({result.warnings.length})
                                </h4>
                                <ul className="space-y-1">
                                    {result.warnings.map((warning, i) => (
                                        <li key={i} className="text-sm text-yellow-300 pl-6">
                                            • {warning}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Info */}
                        {result.info.description && (
                            <div className="pt-4 border-t border-border">
                                <h4 className="text-sm font-medium text-foreground mb-2">Description</h4>
                                <p className="text-sm text-muted-foreground">{result.info.description}</p>
                            </div>
                        )}

                        {result.info.triggers && result.info.triggers.length > 0 && (
                            <div className="pt-4 border-t border-border mt-4">
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
                    </Card>
                )}

                {/* AI Suggestions (Show when AI analysis is present) */}
                {result?.aiAnalysis && (
                    <Card className="p-6 mt-6 border-l-4 border-l-[#C15F3C]">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-[#C15F3C]" />
                                <h3 className="text-lg font-semibold text-foreground">AI Analysis</h3>
                            </div>
                            <span className="px-3 py-1 bg-[#C15F3C]/10 text-[#C15F3C] rounded-full text-sm font-medium">
                                Score: {result.aiAnalysis.overallScore}/10
                            </span>
                        </div>
                        <p className="text-muted-foreground mb-4">{result.aiAnalysis.summary}</p>

                        {result.aiAnalysis.suggestions.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4" />
                                    Suggestions ({result.aiAnalysis.suggestions.length})
                                </h4>
                                <ul className="space-y-2">
                                    {result.aiAnalysis.suggestions.map((suggestion, i) => (
                                        <li
                                            key={i}
                                            className={`text-sm pl-4 py-2 rounded-lg ${suggestion.type === 'error' ? 'bg-red-500/10 text-red-300 border-l-2 border-red-500' :
                                                    suggestion.type === 'warning' ? 'bg-yellow-500/10 text-yellow-300 border-l-2 border-yellow-500' :
                                                        'bg-blue-500/10 text-blue-300 border-l-2 border-blue-500'
                                                }`}
                                        >
                                            <span className="text-xs font-medium uppercase text-muted-foreground mr-2">[{suggestion.area}]</span>
                                            {suggestion.message}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </Card>
                )}
            </div>
        </Shell>
    );
}
