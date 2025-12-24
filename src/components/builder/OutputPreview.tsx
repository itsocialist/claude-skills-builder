'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { runSkillPreview } from '@/lib/claude-client';
import { Play, Loader2 } from 'lucide-react';
import type { Skill } from '@/types/skill.types';

interface OutputPreviewProps {
    skill: Skill;
    apiKey: string | null;
}

export function OutputPreview({ skill, apiKey }: OutputPreviewProps) {
    const [userMessage, setUserMessage] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState<{
        response: string;
        tokensUsed: number;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleRun = async () => {
        if (!apiKey || !userMessage) return;

        setIsRunning(true);
        setError(null);
        setResult(null);

        try {
            const res = await runSkillPreview(apiKey, skill, userMessage);
            setResult(res);
        } catch (err: any) {
            setError(err.message || 'Failed to run skill');
        } finally {
            setIsRunning(false);
        }
    };

    if (!apiKey) {
        return (
            <div className="text-center py-6 text-muted-foreground text-sm">
                Add your Claude API key above to preview output.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-medium text-foreground">Output Preview</h4>
            </div>

            <Textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Enter sample input to test skill..."
                rows={3}
            />

            <Button onClick={handleRun} disabled={isRunning || !userMessage} className="w-full">
                {isRunning ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Running...
                    </>
                ) : (
                    <>
                        <Play className="h-4 w-4 mr-2" />
                        Run Skill
                    </>
                )}
            </Button>

            {error && (
                <div className="p-3 rounded-md bg-red-500/10 text-red-500 text-sm">
                    {error}
                </div>
            )}

            {result && (
                <Card className="p-4 border-border">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-foreground">Claude's Response</span>
                        <span className="text-xs text-muted-foreground">
                            {result.tokensUsed} tokens used
                        </span>
                    </div>

                    <div className="bg-muted/50 rounded-md p-3 text-sm text-foreground whitespace-pre-wrap max-h-64 overflow-y-auto">
                        {result.response}
                    </div>
                </Card>
            )}
        </div>
    );
}
