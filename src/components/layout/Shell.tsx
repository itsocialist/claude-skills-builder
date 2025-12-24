import { ReactNode } from 'react';
import Link from 'next/link';

interface ShellProps {
    children: ReactNode;
    inspector?: ReactNode;
}

export function Shell({ children, inspector }: ShellProps) {
    return (
        <div className="flex min-h-screen bg-gray-50 flex-col md:flex-row">
            {/* Sidebar - 240px */}
            <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0">
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <Link href="/" className="font-bold text-xl tracking-tight text-primary">
                        ClaudeSkills
                    </Link>
                </div>
                <nav className="p-4 space-y-1">
                    <Link href="/builder" className="block px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-md">
                        Skill Builder
                    </Link>
                    <Link href="/templates" className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
                        Templates
                    </Link>
                    <div className="pt-4 mt-4 border-t border-gray-100">
                        <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Validation
                        </span>
                        <div className="mt-2 px-4 flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm text-gray-600">Schema Valid</span>
                        </div>
                    </div>
                </nav>
            </aside>

            {/* Main Content - Flexible */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                <div className="h-16 bg-primary flex items-center justify-between px-8 sticky top-0 z-10">
                    <h1 className="text-lg font-medium text-primary-foreground">Untitled Skill</h1>
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
                <aside className="w-full md:w-80 bg-white border-l border-gray-200 flex-shrink-0 overflow-y-auto">
                    <div className="p-6">
                        {inspector}
                    </div>
                </aside>
            )}
        </div>
    );
}
