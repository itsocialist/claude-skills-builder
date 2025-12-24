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
        <div className="flex flex-col min-h-screen bg-background">
            {/* Unified Header Row */}
            <header className="h-14 bg-card border-b border-border flex items-stretch sticky top-0 z-20">
                {/* Sidebar Header */}
                <div className="w-64 flex items-center px-6 border-r border-border flex-shrink-0">
                    <Link href="/" className="font-bold text-xl tracking-tight text-primary">
                        ClaudeSkills
                    </Link>
                </div>

                {/* Main Header */}
                <div className="flex-1 flex items-center justify-between px-6">
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
                        <div className="w-px h-5 bg-primary"></div>
                        <button className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors">
                            <Download className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Inspector Header */}
                {inspector && (
                    <div className="w-[400px] flex items-center px-6 border-l border-border flex-shrink-0">
                        <span className="text-lg font-medium text-foreground">Inspector</span>
                    </div>
                )}
            </header>

            {/* Body Row */}
            <div className="flex flex-1 pb-10">
                {/* Sidebar Navigation */}
                <aside className="w-64 bg-card border-r border-border flex-shrink-0">
                    <nav className="p-4 space-y-1">
                        <Link href="/builder" className="block px-4 py-2 text-sm font-medium text-foreground bg-accent rounded-md">
                            Skill Builder
                        </Link>
                        <Link href="/templates" className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded-md">
                            Templates
                        </Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0 overflow-y-auto bg-background">
                    <div className="p-8">
                        {children}
                    </div>
                </main>

                {/* Inspector Panel */}
                {inspector && (
                    <aside className="w-[400px] bg-card border-l border-border flex-shrink-0 h-[calc(100vh-96px)] overflow-hidden">
                        <div className="h-full">
                            {inspector}
                        </div>
                    </aside>
                )}
            </div>

            {/* Fixed Bottom Status Bar */}
            <footer className="fixed bottom-0 left-0 right-0 h-10 bg-card border-t border-border flex items-center px-6 z-20">
                <div className="flex items-center gap-2 ml-64">
                    <div className={`w-2 h-2 rounded-full ${statusColors[validation?.status || 'valid']}`}></div>
                    <span className="text-sm text-muted-foreground">
                        {validation?.message || statusMessages[validation?.status || 'valid']}
                    </span>
                </div>
            </footer>
        </div>
    );
}

