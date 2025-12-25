'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, FileText, FolderOpen, Upload } from 'lucide-react';
import type { SkillResource, ResourceFolder } from '@/types/skill.types';

interface ResourceManagerProps {
    resources: SkillResource[];
    onAdd: (resource: Omit<SkillResource, 'id'>) => void;
    onRemove: (id: string) => void;
}

const FOLDERS: { value: ResourceFolder; label: string; icon: string }[] = [
    { value: 'resources', label: 'Resources', icon: '📁' },
    { value: 'templates', label: 'Templates', icon: '📄' },
    { value: 'examples', label: 'Examples', icon: '💡' },
    { value: 'scripts', label: 'Scripts', icon: '⚙️' },
];

export function ResourceManager({ resources, onAdd, onRemove }: ResourceManagerProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [folder, setFolder] = useState<ResourceFolder>('resources');
    const [name, setName] = useState('');
    const [content, setContent] = useState('');

    const handleAdd = () => {
        if (name && content) {
            onAdd({ folder, name, content });
            setName('');
            setContent('');
            setIsAdding(false);
        }
    };

    const groupedResources = FOLDERS.map(f => ({
        ...f,
        files: resources.filter(r => r.folder === f.value)
    }));

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">Attached Files</h3>
                <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add File
                </Button>
            </div>

            {/* Add File Form */}
            {isAdding && (
                <Card className="p-4 border-border bg-muted/30">
                    <div className="space-y-3">
                        <div className="flex gap-2 items-center">
                            <div className="flex-1 flex gap-2">
                                <select
                                    value={folder}
                                    onChange={(e) => setFolder(e.target.value as ResourceFolder)}
                                    className="px-3 py-2 rounded-md border border-border bg-background text-sm"
                                >
                                    {FOLDERS.map(f => (
                                        <option key={f.value} value={f.value}>{f.icon} {f.label}</option>
                                    ))}
                                </select>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="filename.md"
                                    className="flex-1"
                                />
                            </div>
                            <div>
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setName(file.name);
                                            const reader = new FileReader();
                                            reader.onload = (e) => setContent(e.target?.result as string || '');
                                            reader.readAsText(file);
                                        }
                                    }}
                                />
                                <Button variant="outline" size="sm" asChild>
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <Upload className="h-4 w-4 mr-1" />
                                        Upload
                                    </label>
                                </Button>
                            </div>
                        </div>
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="File content..."
                            rows={4}
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => setIsAdding(false)}>
                                Cancel
                            </Button>
                            <Button size="sm" onClick={handleAdd} disabled={!name || !content}>
                                Add
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* File List */}
            {resources.length === 0 && !isAdding ? (
                <div className="text-center py-6 border-2 border-dashed border-border rounded-lg">
                    <FolderOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No files attached</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {groupedResources.filter(g => g.files.length > 0).map(group => (
                        <div key={group.value}>
                            <p className="text-xs text-muted-foreground mb-1">
                                {group.icon} {group.label}/
                            </p>
                            {group.files.map(file => (
                                <div key={file.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-md mb-1">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{file.name}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => onRemove(file.id)}>
                                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
