'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { testSkillTrigger } from '@/lib/claude-client';
import { Play, Loader2, CheckCircle, XCircle, ChevronDown, ChevronRight, Key } from 'lucide-react';
import type { Skill } from '@/types/skill.types';
import { ApiKeySettings } from './ApiKeySettings';
import { MarkdownOutput } from '@/components/MarkdownOutput';

interface TestConsoleProps {
    skill: Skill;
    apiKey: string | null;
    onApiKeyChange: (key: string | null) => void;
}

export function TestConsole({ skill, apiKey, onApiKeyChange }: TestConsoleProps) {
    const [apiKeyConfigured, setApiKeyConfigured] = useState(!!apiKey);
    const [showApiKeySettings, setShowApiKeySettings] = useState(!apiKey);
    const [testInput, setTestInput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState<{
        triggered: boolean;
        response: string;
        tokensUsed: number;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleApiKeyChange = (key: string | null) => {
        onApiKeyChange(key);
        if (key) {
            setApiKeyConfigured(true);
            setShowApiKeySettings(false); // Collapse when configured
        }
    };

    const handleRunTest = async () => {
        if (!apiKey || !testInput.trim()) return;

        setIsRunning(true);
        setError(null);
        setResult(null);

        try {
            const res = await testSkillTrigger(apiKey, skill, testInput);
            setResult(res);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to run test';
            setError(message);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-auto p-4 space-y-4">
                {/* Collapsible API Key Section */}
                <div className="border border-border rounded-md">
                    <button
                        onClick={() => setShowApiKeySettings(!showApiKeySettings)}
                        className="w-full flex items-center justify-between p-3 text-sm font-medium text-foreground hover:bg-accent/50 rounded-md transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <Key className="w-4 h-4 text-primary" />
                            <span>API Key</span>
                            {apiKeyConfigured && (
                                <span className="text-xs text-green-500 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> Configured
                                </span>
                            )}
                        </div>
                        {showApiKeySettings ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                    </button>
                    {showApiKeySettings && (
                        <div className="px-3 pb-3">
                            <ApiKeySettings onKeyChange={handleApiKeyChange} />
                        </div>
                    )}
                </div>

                {/* Test Your Skill Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Play className="w-4 h-4 text-primary" />
                        <h4 className="text-sm font-medium text-foreground">Test Your Skill</h4>
                    </div>

                    <Textarea
                        value={testInput}
                        onChange={(e) => setTestInput(e.target.value)}
                        placeholder="Enter your test prompt..."
                        rows={3}
                        className="resize-none"
                        disabled={!apiKey}
                    />

                    <Button
                        onClick={handleRunTest}
                        disabled={isRunning || !testInput.trim() || !apiKey}
                        className="w-full"
                    >
                        {isRunning ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Running...
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 mr-2" />
                                Run Test
                            </>
                        )}
                    </Button>

                    {!apiKey && (
                        <p className="text-xs text-muted-foreground text-center">
                            Add your Claude API key above to test
                        </p>
                    )}
                </div>

                {/* Error Display */}
                {error && (
                    <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                        {error}
                    </div>
                )}

                {/* Result Display */}
                {result && (
                    <Card className="p-4 border-border">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                {result.triggered ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span className="text-sm font-medium text-green-500">
                                            Skill Triggered
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-4 h-4 text-yellow-500" />
                                        <span className="text-sm font-medium text-yellow-500">
                                            Not Triggered
                                        </span>
                                    </>
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {result.tokensUsed} tokens
                            </span>
                        </div>

                        <div className="bg-muted/50 rounded-md p-3 max-h-96 overflow-y-auto">
                            <MarkdownOutput content={result.response} />
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
