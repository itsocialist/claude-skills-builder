'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Wand2, ChevronDown } from 'lucide-react';

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
    return (
        <div className="mb-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors hover:bg-white/10"
                    >
                        <Wand2 className="h-4 w-4" />
                        <span>Insert Template</span>
                        <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-black/80 backdrop-blur-xl border-white/10 text-white">
                    <DropdownMenuLabel className="text-white/50 text-xs uppercase tracking-wider">Templates</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    {SNIPPETS.map((snippet) => (
                        <DropdownMenuItem
                            key={snippet.name}
                            onClick={() => onInsert(snippet.content)}
                            className="text-white/80 focus:text-white focus:bg-white/20 cursor-pointer"
                        >
                            {snippet.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
