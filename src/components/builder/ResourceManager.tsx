'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/auth/AuthProvider';
import {
    getSkillResources,
    createSkillResource,
    deleteSkillResource,
    getResourceIcon,
    formatFileSize,
    SkillResource,
    GroupedResources
} from '@/lib/api/skillResourcesApi';
import {
    FolderOpen,
    Plus,
    Trash2,
    FileText,
    Code,
    Image,
    ChevronDown,
    ChevronRight,
    Loader2,
    Save,
    X
} from 'lucide-react';

interface ResourceManagerProps {
    skillId: string;
    skillType: 'template' | 'user';
    readOnly?: boolean;
}

const FOLDER_CONFIG = {
    scripts: { icon: Code, label: 'Scripts', description: 'Executable code and automation' },
    references: { icon: FileText, label: 'References', description: 'Documentation and guides' },
    assets: { icon: Image, label: 'Assets', description: 'Templates, images, data files' },
    templates: { icon: FileText, label: 'Templates', description: 'Document templates' },
    examples: { icon: FileText, label: 'Examples', description: 'Usage examples' },
};

export function ResourceManager({ skillId, skillType, readOnly = false }: ResourceManagerProps) {
    const { session } = useAuth();
    const [resources, setResources] = useState<SkillResource[]>([]);
    const [grouped, setGrouped] = useState<GroupedResources>({});
    const [loading, setLoading] = useState(true);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['scripts', 'references', 'assets']));

    // New file form
    const [showNewFile, setShowNewFile] = useState(false);
    const [newFileFolder, setNewFileFolder] = useState<string>('scripts');
    const [newFileName, setNewFileName] = useState('');
    const [newFileContent, setNewFileContent] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadResources();
    }, [skillId, skillType]);

    const loadResources = async () => {
        setLoading(true);
        const data = await getSkillResources(skillId, skillType);
        setResources(data.resources);
        setGrouped(data.grouped);
        setLoading(false);
    };

    const toggleFolder = (folder: string) => {
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(folder)) {
            newExpanded.delete(folder);
        } else {
            newExpanded.add(folder);
        }
        setExpandedFolders(newExpanded);
    };

    const handleCreateFile = async () => {
        if (!session?.access_token || !newFileName.trim()) return;

        setSaving(true);
        setError(null);

        const result = await createSkillResource(
            session.access_token,
            skillId,
            newFileFolder,
            newFileName,
            newFileContent,
            skillType
        );

        if (result.error) {
            setError(result.error);
        } else {
            setShowNewFile(false);
            setNewFileName('');
            setNewFileContent('');
            await loadResources();
        }

        setSaving(false);
    };

    const handleDeleteResource = async (resourceId: string) => {
        if (!session?.access_token || !confirm('Delete this resource?')) return;

        const success = await deleteSkillResource(session.access_token, resourceId);
        if (success) {
            await loadResources();
        }
    };

    const totalSize = resources.reduce((sum, r) => sum + (r.size_bytes || 0), 0);
    const sizePercent = (totalSize / 5242880) * 100;

    if (loading) {
        return (
            <Card className="p-4">
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <FolderOpen className="w-4 h-4" />
                        Skill Resources
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        {resources.length} files • {formatFileSize(totalSize)} / 5 MB
                    </p>
                </div>
                {!readOnly && (
                    <Button size="sm" onClick={() => setShowNewFile(true)} disabled={showNewFile}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add File
                    </Button>
                )}
            </div>

            {/* Size indicator */}
            <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all ${sizePercent > 80 ? 'bg-destructive' : 'bg-primary'}`}
                    style={{ width: `${Math.min(sizePercent, 100)}%` }}
                />
            </div>

            {/* New File Form */}
            {showNewFile && (
                <div className="p-4 bg-accent/50 rounded-lg border border-border space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">New Resource</span>
                        <button onClick={() => setShowNewFile(false)} className="text-muted-foreground hover:text-foreground">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-muted-foreground">Folder</label>
                            <select
                                value={newFileFolder}
                                onChange={(e) => setNewFileFolder(e.target.value)}
                                className="w-full mt-1 bg-background border border-border rounded-md px-3 py-2 text-sm"
                            >
                                {Object.entries(FOLDER_CONFIG).map(([key, config]) => (
                                    <option key={key} value={key}>{config.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground">Filename</label>
                            <Input
                                value={newFileName}
                                onChange={(e) => setNewFileName(e.target.value)}
                                placeholder="example.py"
                                className="mt-1"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-muted-foreground">Content</label>
                        <textarea
                            value={newFileContent}
                            onChange={(e) => setNewFileContent(e.target.value)}
                            placeholder="# File content here..."
                            className="w-full mt-1 bg-background border border-border rounded-md px-3 py-2 text-sm font-mono h-32 resize-none"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}

                    <Button onClick={handleCreateFile} disabled={saving || !newFileName.trim()} size="sm">
                        {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                        Save File
                    </Button>
                </div>
            )}

            {/* Folder Tree */}
            <div className="space-y-2">
                {Object.entries(FOLDER_CONFIG).map(([folderKey, config]) => {
                    const FolderIcon = config.icon;
                    const folderResources = grouped[folderKey] || [];
                    const isExpanded = expandedFolders.has(folderKey);

                    return (
                        <div key={folderKey} className="border border-border rounded-lg overflow-hidden">
                            {/* Folder Header */}
                            <button
                                onClick={() => toggleFolder(folderKey)}
                                className="w-full flex items-center justify-between p-3 bg-accent/30 hover:bg-accent/50 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    <FolderIcon className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium text-sm">{config.label}/</span>
                                    <span className="text-xs text-muted-foreground">({folderResources.length})</span>
                                </div>
                            </button>

                            {/* Folder Contents */}
                            {isExpanded && (
                                <div className="divide-y divide-border">
                                    {folderResources.length === 0 ? (
                                        <p className="text-xs text-muted-foreground p-3 italic">
                                            No files in {config.label.toLowerCase()}
                                        </p>
                                    ) : (
                                        folderResources.map((resource) => (
                                            <div key={resource.id} className="flex items-center justify-between p-3 hover:bg-accent/20">
                                                <div className="flex items-center gap-2">
                                                    <span>{getResourceIcon(resource.filename)}</span>
                                                    <span className="text-sm font-mono">{resource.filename}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatFileSize(resource.size_bytes || 0)}
                                                    </span>
                                                </div>
                                                {!readOnly && (
                                                    <button
                                                        onClick={() => handleDeleteResource(resource.id)}
                                                        className="text-muted-foreground hover:text-destructive p-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
