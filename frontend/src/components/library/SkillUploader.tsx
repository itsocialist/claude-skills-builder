'use client';

import { useState, useCallback } from 'react';
import { Upload, FileArchive, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useLibraryStore } from '@/lib/store/libraryStore';
import { useAuth } from '@/components/auth/AuthProvider';

interface SkillUploaderProps {
    compact?: boolean;
}

export function SkillUploader({ compact = false }: SkillUploaderProps) {
    const { user } = useAuth();
    const { importFromZip, error, clearError } = useLibraryStore();
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (!user) return;

        const files = Array.from(e.dataTransfer.files);
        const zipFile = files.find(f => f.name.endsWith('.zip'));

        if (!zipFile) {
            return;
        }

        setIsUploading(true);
        setSuccess(null);
        clearError();

        const result = await importFromZip(user.id, zipFile);

        setIsUploading(false);
        if (result) {
            setSuccess(`Imported "${result.name}" successfully!`);
            setTimeout(() => setSuccess(null), 3000);
        }
    }, [user, importFromZip, clearError]);

    const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user || !e.target.files?.length) return;

        const file = e.target.files[0];
        if (!file.name.endsWith('.zip')) return;

        setIsUploading(true);
        setSuccess(null);
        clearError();

        const result = await importFromZip(user.id, file);

        setIsUploading(false);
        if (result) {
            setSuccess(`Imported "${result.name}" successfully!`);
            setTimeout(() => setSuccess(null), 3000);
        }

        // Reset input
        e.target.value = '';
    }, [user, importFromZip, clearError]);

    return (
        <div className={compact ? '' : 'mb-6'}>
            {/* Drop Zone */}
            <label
                htmlFor="skill-upload"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    block border-2 border-dashed rounded-xl transition-all cursor-pointer
                    ${compact ? 'p-6 h-full' : 'p-8 text-center'}
                    ${isDragging
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50 bg-card hover:bg-primary/5'
                    }
                    ${isUploading ? 'opacity-50 pointer-events-none' : ''}
                `}
            >
                <input
                    type="file"
                    accept=".zip,.skill"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="skill-upload"
                />

                <div className={compact ? 'flex items-start gap-4' : 'flex flex-col items-center gap-3'}>
                    {isUploading ? (
                        <>
                            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-muted-foreground">Importing skill...</p>
                        </>
                    ) : (
                        <>
                            <div className={`w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center ${compact ? 'flex-shrink-0 group-hover:bg-primary/20 transition-colors' : ''}`}>
                                {isDragging ? (
                                    <FileArchive className="w-6 h-6 text-primary" />
                                ) : (
                                    <Upload className="w-6 h-6 text-primary" />
                                )}
                            </div>
                            <div className={compact ? '' : 'text-center'}>
                                <p className={compact ? 'text-lg font-semibold text-foreground mb-1' : 'text-foreground font-medium'}>
                                    {isDragging ? 'Drop to import' : 'Import Skill'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {compact ? 'Drop .zip or .skill file, or click to browse' : (
                                        <>
                                            Drag & drop a .zip file or{' '}
                                            <span className="text-primary hover:underline">
                                                browse
                                            </span>
                                        </>
                                    )}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </label>

            {/* Success Message */}
            {success && (
                <div className="mt-3 flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-500 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    {success}
                    <button onClick={() => setSuccess(null)} className="ml-auto hover:text-green-400">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mt-3 flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                    <button onClick={clearError} className="ml-auto hover:text-red-400">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
