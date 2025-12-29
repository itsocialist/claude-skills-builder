'use client';

import { useState } from 'react';
import { useSkillStore } from '@/lib/store/skillStore';
import Editor from '@monaco-editor/react';
import { Eye, Code, Columns } from 'lucide-react';
import { MarkdownOutput } from '@/components/MarkdownOutput';
import { SkillSnippets } from './SkillSnippets';

type ViewMode = 'editor' | 'preview' | 'split';

export function InstructionsEditor() {
    const { skill, updateField } = useSkillStore();
    const [viewMode, setViewMode] = useState<ViewMode>('editor');

    const renderMarkdown = (text: string) => {
        // Simple markdown rendering for preview
        return text
            .split('\n')
            .map((line, i) => {
                // Headers
                if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold mt-4 mb-2 text-foreground">{line.slice(4)}</h3>;
                if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-6 mb-3 text-foreground">{line.slice(3)}</h2>;
                if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-6 mb-4 text-foreground">{line.slice(2)}</h1>;
                // Lists
                if (line.startsWith('- ')) return <li key={i} className="ml-4 text-muted-foreground">{line.slice(2)}</li>;
                if (/^\d+\.\s/.test(line)) return <li key={i} className="ml-4 list-decimal text-muted-foreground">{line.replace(/^\d+\.\s/, '')}</li>;
                // Bold
                const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>');
                // Empty lines
                if (line.trim() === '') return <br key={i} />;
                // Regular paragraphs
                return <p key={i} className="text-muted-foreground my-1" dangerouslySetInnerHTML={{ __html: boldText }} />;
            });
    };

    const handleInsertSnippet = (content: string) => {
        const currentInstructions = skill.instructions;
        updateField('instructions', currentInstructions + '\n\n' + content);
    };

    return (
        <div className="space-y-2">
            {/* Skill Snippets */}
            <SkillSnippets onInsert={handleInsertSnippet} />

            {/* View Mode Toggle */}
            <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
                <button
                    onClick={() => setViewMode('editor')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${viewMode === 'editor'
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <Code className="h-4 w-4" />
                    Editor
                </button>
                <button
                    onClick={() => setViewMode('split')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${viewMode === 'split'
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <Columns className="h-4 w-4" />
                    Split
                </button>
                <button
                    onClick={() => setViewMode('preview')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${viewMode === 'preview'
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <Eye className="h-4 w-4" />
                    Preview
                </button>
            </div>

            {/* Content Area */}
            <div className={`border border-border rounded-lg overflow-hidden ${viewMode === 'split' ? 'grid grid-cols-2 gap-0' : ''}`}>
                {/* Editor */}
                {(viewMode === 'editor' || viewMode === 'split') && (
                    <div className={`h-[500px] ${viewMode === 'split' ? 'border-r border-border' : ''}`}>
                        <Editor
                            height="100%"
                            defaultLanguage="markdown"
                            value={skill.instructions}
                            onChange={(value) => updateField('instructions', value || '')}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                lineNumbers: 'on',
                                wordWrap: 'on',
                                fontSize: 14,
                                padding: { top: 16 },
                            }}
                        />
                    </div>
                )}

                {/* Preview */}
                {(viewMode === 'preview' || viewMode === 'split') && (
                    <div className="h-[500px] overflow-y-auto p-6 bg-card">
                        <MarkdownOutput content={skill.instructions} />
                    </div>
                )}
            </div>
        </div>
    );
}


