'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { Pencil, Download, Library, LogIn } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { UserMenu } from '@/components/auth/UserMenu';
import { LoginModal } from '@/components/auth/LoginModal';
import { RecentSkills } from '@/components/library/RecentSkills';

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
    const { user, isConfigured } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title || 'New Skill');
    const [saveStatus, setSaveStatus] = useState<'saved' | 'editing'>('saved');
    const [showLoginModal, setShowLoginModal] = useState(false);

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
            {/* Unified Header Row - Brighter with accent */}
            <header className="h-14 bg-card border-b-2 border-primary flex items-stretch sticky top-0 z-20 shadow-sm">
                {/* Sidebar Header */}
                <div className="w-64 flex items-center px-6 border-r border-border flex-shrink-0">
                    <Link href="/app" className="font-bold text-xl tracking-tight text-primary">
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

                    {/* User Actions */}
                    <div className="flex items-center gap-3">
                        {inspector && (
                            <>
                                <button className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors">
                                    <Download className="h-4 w-4" />
                                </button>
                                <div className="w-px h-5 bg-border"></div>
                            </>
                        )}
                        {isConfigured && !user ? (
                            <button
                                onClick={() => setShowLoginModal(true)}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                            >
                                <LogIn className="w-4 h-4" />
                                Sign In
                            </button>
                        ) : (
                            <UserMenu />
                        )}
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
                        <Link href="/app/builder" className="block px-4 py-2 text-sm font-medium text-foreground bg-accent rounded-md">
                            Skill Builder
                        </Link>
                        <Link href="/app/templates" className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded-md">
                            Templates
                        </Link>
                        <Link href="/app/packages" className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded-md">
                            Packages
                        </Link>
                        {user && (
                            <Link href="/app/library" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded-md">
                                <Library className="w-4 h-4" />
                                My Library
                            </Link>
                        )}
                    </nav>

                    {/* Recent Skills (authenticated users) */}
                    <RecentSkills />
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
                <div className="flex items-center gap-4 ml-64">
                    {/* Validation Status */}
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusColors[validation?.status || 'valid']}`}></div>
                        <span className="text-sm text-muted-foreground">
                            {validation?.message || statusMessages[validation?.status || 'valid']}
                        </span>
                    </div>

                    {/* Save Status - only on builder */}
                    {inspector && (
                        <>
                            <div className="w-px h-4 bg-border"></div>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${saveStatus === 'saved' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                <span className="text-sm text-muted-foreground">
                                    {saveStatus === 'saved' ? 'Saved' : 'Editing...'}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </footer>

            {/* Login Modal */}
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </div>
    );
}

