'use client';

import { useSkillStore } from '@/lib/store/skillStore';
import Editor from '@monaco-editor/react';

export function InstructionsEditor() {
    const { skill, updateField } = useSkillStore();

    return (
        <div className="border border-border rounded-lg overflow-hidden h-[500px]">
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
    );
}

