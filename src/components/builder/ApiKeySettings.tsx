'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { validateApiKey } from '@/lib/claude-client';
import { Key, Check, X, Eye, EyeOff } from 'lucide-react';

interface ApiKeySettingsProps {
    onKeyChange: (key: string | null) => void;
}

export function ApiKeySettings({ onKeyChange }: ApiKeySettingsProps) {
    const [apiKey, setApiKey] = useState('');
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    const [showKey, setShowKey] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const savedKey = localStorage.getItem('claude-api-key');
        if (savedKey) {
            setApiKey(savedKey);
            onKeyChange(savedKey);
            setIsValid(true); // Assume valid if saved
        }
    }, [onKeyChange]);

    const handleValidate = async () => {
        if (!apiKey.startsWith('sk-ant-')) {
            setIsValid(false);
            return;
        }

        setIsValidating(true);
        try {
            const valid = await validateApiKey(apiKey);
            setIsValid(valid);
            if (valid) {
                localStorage.setItem('claude-api-key', apiKey);
                onKeyChange(apiKey);
            }
        } catch {
            setIsValid(false);
        } finally {
            setIsValidating(false);
        }
    };

    const handleClear = () => {
        setApiKey('');
        setIsValid(null);
        localStorage.removeItem('claude-api-key');
        onKeyChange(null);
    };

    return (
        <Card className="p-4 border-border bg-muted/30">
            <div className="flex items-center gap-2 mb-3">
                <Key className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-medium text-foreground">Claude API Key</h4>
                {isValid === true && <Check className="h-4 w-4 text-green-500" />}
                {isValid === false && <X className="h-4 w-4 text-red-500" />}
            </div>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Input
                        type={showKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-ant-api03-..."
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                <Button
                    size="sm"
                    onClick={handleValidate}
                    disabled={!apiKey || isValidating}
                >
                    {isValidating ? 'Validating...' : 'Save'}
                </Button>
                {isValid && (
                    <Button variant="outline" size="sm" onClick={handleClear}>
                        Clear
                    </Button>
                )}
            </div>

            <p className="text-xs text-muted-foreground mt-2">
                Your key is stored locally and never sent to our servers.
            </p>
        </Card>
    );
}
