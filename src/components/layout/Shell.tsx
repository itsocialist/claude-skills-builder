import { ReactNode } from 'react';
import Link from 'next/link';

interface ShellProps {
    children: ReactNode;
    inspector?: ReactNode;
    title?: string;
    validation?: {
        status: 'valid' | 'warning' | 'error';
        message: string;
    };
}

export function Shell({ children, inspector, title, validation }: ShellProps) {
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
                <div className="h-16 flex items-center px-6 border-b border-border">
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
                <div className="h-16 bg-primary flex items-center justify-between px-8 sticky top-0 z-10">
                    <h1 className="text-lg font-medium text-primary-foreground">
                        {title || 'New Skill'}
                    </h1>
                    <div className="flex gap-2">
                        {/* Toolbar items can go here */}
                    </div>
                </div>
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

