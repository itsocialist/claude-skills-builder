import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { Pencil, Download, Check } from 'lucide-react';

interface ShellProps {
    children: ReactNode;
    inspector?: ReactNode;
    title?: string;
    onTitleChange?: (newTitle: string) => void;
    validation?: {
        status: 'valid' | 'warning' | 'error';
        message: string;
    };
}

export function Shell({ children, inspector, title, onTitleChange, validation }: ShellProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title || 'New Skill');
    const [saveStatus, setSaveStatus] = useState<'saved' | 'editing'>('saved');

    useEffect(() => {
        setEditedTitle(title || 'New Skill');
    }, [title]);

    const handleTitleSubmit = () => {
        setIsEditing(false);
        if (onTitleChange && editedTitle !== title) {
            onTitleChange(editedTitle);
        }
        setSaveStatus('saved');
    };

    const handleTitleChange = (value: string) => {
        setEditedTitle(value);
        setSaveStatus('editing');
    };

    const statusColors = {
        valid: 'bg-green-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500',
    };

    const statusMessages = {
        valid: 'Ready to export',
        warning: 'Has warnings',
        error: 'Has errors',
    };

    return (
        <div className="flex min-h-screen bg-background flex-col md:flex-row">
            {/* Sidebar - 240px */}
            <aside className="w-full md:w-64 bg-card border-r border-border flex-shrink-0">
                <div className="h-14 flex items-center px-6 border-b border-border">
                    <Link href="/" className="font-bold text-xl tracking-tight text-primary">
                        ClaudeSkills
                    </Link>
                </div>
                <nav className="p-4 space-y-1">
                    <Link href="/builder" className="block px-4 py-2 text-sm font-medium text-foreground bg-accent rounded-md">
                        Skill Builder
                    </Link>
                    <Link href="/templates" className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded-md">
                        Templates
                    </Link>
                    <div className="pt-4 mt-4 border-t border-border">
                        <span className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Validation
                        </span>
                        <div className="mt-2 px-4 flex items-center gap-2 cursor-pointer hover:bg-accent p-2 rounded">
                            <div className={`w-2 h-2 rounded-full ${statusColors[validation?.status || 'valid']}`}></div>
                            <span className="text-sm text-muted-foreground">
                                {validation?.message || statusMessages[validation?.status || 'valid']}
                            </span>
                        </div>
                    </div>
                </nav>
            </aside>

            {/* Main Content - Flexible */}
            <main className="flex-1 min-w-0 overflow-y-auto bg-background">
                {/* Redesigned Header */}
                <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
                    {/* Title Section */}
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <input
                                value={editedTitle}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                onBlur={handleTitleSubmit}
                                onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                                autoFocus
                                className="bg-transparent text-lg font-medium text-foreground 
                                           focus:outline-none border-b-2 border-primary px-1"
                            />
                        ) : (
                            <h1
                                className="text-lg font-medium text-foreground cursor-pointer hover:text-primary transition-colors"
                                onClick={() => setIsEditing(true)}
                            >
                                {editedTitle}
                            </h1>
                        )}
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Status + Actions */}
                    <div className="flex items-center gap-3">
                        <span className={`text-sm flex items-center gap-1.5 ${saveStatus === 'saved' ? 'text-green-500' : 'text-muted-foreground'
                            }`}>
                            {saveStatus === 'saved' && <Check className="h-3.5 w-3.5" />}
                            {saveStatus === 'saved' ? 'Saved' : 'Editing...'}
                        </span>
                        <button
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium 
                                       bg-primary text-primary-foreground rounded-md 
                                       hover:bg-primary/90 transition-colors"
                        >
                            <Download className="h-4 w-4" />
                            Export
                        </button>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>

            {/* Inspector Panel - 320px */}
            {inspector && (
                <aside className="w-full md:w-80 bg-card border-l border-border flex-shrink-0 overflow-y-auto">
                    <div className="p-6">
                        {inspector}
                    </div>
                </aside>
            )}
        </div>
    );
}


