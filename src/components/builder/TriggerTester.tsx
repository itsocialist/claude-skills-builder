'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { testSkillTrigger } from '@/lib/claude-client';
import { Zap, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import type { Skill } from '@/types/skill.types';

interface TriggerTesterProps {
    skill: Skill;
    apiKey: string | null;
}

export function TriggerTester({ skill, apiKey }: TriggerTesterProps) {
    const [testPhrase, setTestPhrase] = useState('');
    const [isTesting, setIsTesting] = useState(false);
    const [result, setResult] = useState<{
        triggered: boolean;
        response: string;
        tokensUsed: number;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleTest = async () => {
        if (!apiKey || !testPhrase) return;

        setIsTesting(true);
        setError(null);
        setResult(null);

        try {
            const res = await testSkillTrigger(apiKey, skill, testPhrase);
            setResult(res);
        } catch (err: any) {
            setError(err.message || 'Failed to test trigger');
        } finally {
            setIsTesting(false);
        }
    };

    if (!apiKey) {
        return (
            <div className="text-center py-6 text-muted-foreground text-sm">
                Add your Claude API key above to test triggers.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-medium text-foreground">Trigger Tester</h4>
            </div>

            <div className="flex gap-2">
                <Input
                    value={testPhrase}
                    onChange={(e) => setTestPhrase(e.target.value)}
                    placeholder="Type a test phrase..."
                    onKeyDown={(e) => e.key === 'Enter' && handleTest()}
                />
                <Button onClick={handleTest} disabled={isTesting || !testPhrase}>
                    {isTesting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Test'}
                </Button>
            </div>

            {error && (
                <div className="p-3 rounded-md bg-red-500/10 text-red-500 text-sm">
                    {error}
                </div>
            )}

            {result && (
                <Card className="p-4 border-border">
                    <div className="flex items-center gap-2 mb-3">
                        {result.triggered ? (
                            <>
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span className="font-medium text-green-500">Skill Triggered</span>
                            </>
                        ) : (
                            <>
                                <XCircle className="h-5 w-5 text-yellow-500" />
                                <span className="font-medium text-yellow-500">Not Triggered</span>
                            </>
                        )}
                        <span className="text-xs text-muted-foreground ml-auto">
                            {result.tokensUsed} tokens
                        </span>
                    </div>

                    <div className="bg-muted/50 rounded-md p-3 text-sm text-foreground whitespace-pre-wrap max-h-48 overflow-y-auto">
                        {result.response}
                    </div>
                </Card>
            )}
        </div>
    );
}
