'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wand2, ChevronDown, ChevronUp } from 'lucide-react';

interface SnippetItem {
    name: string;
    content: string;
}

const SNIPPETS: SnippetItem[] = [
    {
        name: 'Required Information',
        content: `## Required Information

Ask the user to provide:
- **Field 1** - Description
- **Field 2** - Description
- **Field 3** - Description
`,
    },
    {
        name: 'Output Format',
        content: `## Output Format

Structure your response as follows:

### Section 1
- Details here

### Section 2
- Details here
`,
    },
    {
        name: 'Style Guidelines',
        content: `## Style Guidelines

- Use clear, concise language
- Be professional yet approachable
- Use active voice
- Format for readability
`,
    },
    {
        name: 'Example Exchange',
        content: `## Example

**User Input:**
"Example user request here"

**Expected Output:**
[Provide example response here]
`,
    },
    {
        name: 'Error Handling',
        content: `## Error Handling

If the user provides incomplete information:
1. Politely ask for missing details
2. Provide examples of valid input
3. Offer to help clarify requirements
`,
    },
];

interface SkillSnippetsProps {
    onInsert: (content: string) => void;
}

export function SkillSnippets({ onInsert }: SkillSnippetsProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="mb-4">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <Wand2 className="h-4 w-4" />
                <span>Insert Snippet</span>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {isExpanded && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {SNIPPETS.map((snippet) => (
                        <Button
                            key={snippet.name}
                            variant="outline"
                            size="sm"
                            onClick={() => onInsert(snippet.content)}
                            className="text-xs"
                        >
                            {snippet.name}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}
