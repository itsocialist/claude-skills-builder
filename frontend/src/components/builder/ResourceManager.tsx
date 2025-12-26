'use client';

import { useState, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    FolderOpen,
    Plus,
    Trash2,
    FileText,
    Code,
    Image,
    ChevronDown,
    ChevronRight,
    Upload,
    File,
    X
} from 'lucide-react';
import type { SkillResource, ResourceFolder } from '@/types/skill.types';

// Folder configuration
const FOLDER_CONFIG: Record<ResourceFolder, { icon: typeof Code; label: string; description: string }> = {
    scripts: { icon: Code, label: 'Scripts', description: 'Executable code and automation' },
    references: { icon: FileText, label: 'References', description: 'Documentation and guides' },
    assets: { icon: Image, label: 'Assets', description: 'Templates, images, data files' },
    templates: { icon: FileText, label: 'Templates', description: 'Document templates' },
    examples: { icon: FileText, label: 'Examples', description: 'Usage examples' },
};

// File type to folder mapping
const EXTENSION_TO_FOLDER: Record<string, ResourceFolder> = {
    'py': 'scripts',
    'js': 'scripts',
    'ts': 'scripts',
    'sh': 'scripts',
    'md': 'references',
    'txt': 'references',
    'html': 'assets',
    'css': 'assets',
    'json': 'assets',
    'yaml': 'assets',
    'yml': 'assets',
    'png': 'assets',
    'jpg': 'assets',
    'jpeg': 'assets',
    'gif': 'assets',
    'svg': 'assets',
};

interface ResourceManagerProps {
    resources: SkillResource[];
    onAdd: (resource: Omit<SkillResource, 'id'>) => void;
    onRemove: (id: string) => void;
    readOnly?: boolean;
}

// Helper: Get file icon
function getResourceIcon(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const iconMap: Record<string, string> = {
        'md': '📝', 'txt': '📄', 'js': '🟨', 'ts': '🔷', 'py': '🐍',
        'json': '📋', 'yaml': '⚙️', 'yml': '⚙️', 'html': '🌐', 'css': '🎨',
        'png': '🖼️', 'jpg': '🖼️', 'jpeg': '🖼️', 'gif': '🖼️', 'svg': '🖼️', 'pdf': '📕',
    };
    return iconMap[ext || ''] || '📎';
}

// Helper: Format file size
function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// Helper: Determine folder from extension
function getFolderForFile(filename: string): ResourceFolder {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    return EXTENSION_TO_FOLDER[ext] || 'assets';
}

export function ResourceManager({ resources, onAdd, onRemove, readOnly = false }: ResourceManagerProps) {
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['scripts', 'references', 'assets']));
    const [showAddForm, setShowAddForm] = useState(false);
    const [newFileName, setNewFileName] = useState('');
    const [newFileFolder, setNewFileFolder] = useState<ResourceFolder>('scripts');
    const [newFileContent, setNewFileContent] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const toggleFolder = (folder: string) => {
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(folder)) {
            newExpanded.delete(folder);
        } else {
            newExpanded.add(folder);
        }
        setExpandedFolders(newExpanded);
    };

    // Group resources by folder
    const grouped = resources.reduce((acc, resource) => {
        const folder = resource.folder || 'assets';
        if (!acc[folder]) acc[folder] = [];
        acc[folder].push(resource);
        return acc;
    }, {} as Record<string, SkillResource[]>);

    // Handle file upload
    const handleFileUpload = useCallback(async (files: FileList | null) => {
        if (!files) return;

        for (const file of Array.from(files)) {
            // Check size (1MB limit)
            if (file.size > 1048576) {
                alert(`File ${file.name} exceeds 1MB limit`);
                continue;
            }

            const folder = getFolderForFile(file.name);

            // Read file content
            const content = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string || '');

                // For text files, read as text
                if (file.type.startsWith('text/') ||
                    ['application/json', 'application/javascript', 'application/x-yaml'].includes(file.type) ||
                    /\.(md|txt|py|js|ts|json|yaml|yml|html|css|xml)$/i.test(file.name)) {
                    reader.readAsText(file);
                } else {
                    // For binary, read as base64
                    reader.readAsDataURL(file);
                }
            });

            onAdd({
                folder,
                filename: file.name,
                content,
                size_bytes: file.size,
                mime_type: file.type,
            });
        }
    }, [onAdd]);

    // Handle manual add
    const handleManualAdd = () => {
        if (!newFileName.trim()) return;

        const size = new TextEncoder().encode(newFileContent).length;
        if (size > 1048576) {
            alert('Content exceeds 1MB limit');
            return;
        }

        onAdd({
            folder: newFileFolder,
            filename: newFileName,
            content: newFileContent,
            size_bytes: size,
            mime_type: 'text/plain',
        });

        setNewFileName('');
        setNewFileContent('');
        setShowAddForm(false);
    };

    // Drag and drop handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        handleFileUpload(e.dataTransfer.files);
    };

    const totalSize = resources.reduce((sum, r) => sum + (r.size_bytes || 0), 0);
    const sizePercent = (totalSize / 5242880) * 100;

    return (
        <Card
            className={`p-4 space-y-4 transition-colors ${dragOver ? 'border-primary bg-primary/5' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <FolderOpen className="w-4 h-4" />
                        Skill Resources
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        {resources.length} file{resources.length !== 1 ? 's' : ''} • {formatFileSize(totalSize)} / 5 MB
                    </p>
                </div>
                {!readOnly && (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-4 h-4 mr-1" />
                            Upload
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => setShowAddForm(!showAddForm)}
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            New
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileUpload(e.target.files)}
                        />
                    </div>
                )}
            </div>

            {/* Size indicator */}
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all ${sizePercent > 80 ? 'bg-destructive' : 'bg-primary'}`}
                    style={{ width: `${Math.min(sizePercent, 100)}%` }}
                />
            </div>

            {/* Drop zone hint */}
            {dragOver && (
                <div className="border-2 border-dashed border-primary rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 mx-auto text-primary mb-2" />
                    <p className="text-primary font-medium">Drop files here</p>
                </div>
            )}

            {/* Manual Add Form */}
            {showAddForm && !dragOver && (
                <div className="p-4 bg-accent/50 rounded-lg border border-border space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Create New File</span>
                        <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-muted-foreground">Folder</label>
                            <select
                                value={newFileFolder}
                                onChange={(e) => setNewFileFolder(e.target.value as ResourceFolder)}
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

                    <Button onClick={handleManualAdd} disabled={!newFileName.trim()} size="sm">
                        <File className="w-4 h-4 mr-1" />
                        Add File
                    </Button>
                </div>
            )}

            {/* Empty state */}
            {resources.length === 0 && !showAddForm && !dragOver && (
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                        Drag & drop files here, or use the buttons above
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Supports scripts, documents, templates, and assets (max 1MB each)
                    </p>
                </div>
            )}

            {/* Folder Tree */}
            {resources.length > 0 && !dragOver && (
                <div className="space-y-2">
                    {Object.entries(FOLDER_CONFIG).map(([folderKey, config]) => {
                        const FolderIcon = config.icon;
                        const folderResources = grouped[folderKey] || [];
                        const isExpanded = expandedFolders.has(folderKey);

                        // Only show folders with resources or that are expanded
                        if (folderResources.length === 0 && !isExpanded) return null;

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
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <span>{getResourceIcon(resource.filename)}</span>
                                                        <span className="text-sm font-mono truncate">{resource.filename}</span>
                                                        <span className="text-xs text-muted-foreground flex-shrink-0">
                                                            {formatFileSize(resource.size_bytes || 0)}
                                                        </span>
                                                    </div>
                                                    {!readOnly && (
                                                        <button
                                                            onClick={() => onRemove(resource.id)}
                                                            className="text-muted-foreground hover:text-destructive p-1 flex-shrink-0"
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
            )}
        </Card>
    );
}
