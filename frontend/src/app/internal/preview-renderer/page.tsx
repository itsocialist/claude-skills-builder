'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { MarkdownOutput } from '@/components/MarkdownOutput';

// Visual wrapper components for different output types
function EmailWindow({ children, subject = 'Re: Your Request', from = 'assistant@example.com', to = 'user@company.com' }: {
    children: React.ReactNode;
    subject?: string;
    from?: string;
    to?: string;
}) {
    return (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden" style={{ width: 800, minHeight: 500 }}>
            {/* Mac-style window chrome */}
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="ml-4 text-sm text-gray-600 font-medium">Mail</span>
            </div>
            {/* Email header */}
            <div className="bg-gray-50 px-6 py-4 border-b space-y-2">
                <div className="flex gap-2 text-sm">
                    <span className="text-gray-500 w-16">From:</span>
                    <span className="text-gray-800">{from}</span>
                </div>
                <div className="flex gap-2 text-sm">
                    <span className="text-gray-500 w-16">To:</span>
                    <span className="text-gray-800">{to}</span>
                </div>
                <div className="flex gap-2 text-sm">
                    <span className="text-gray-500 w-16">Subject:</span>
                    <span className="text-gray-800 font-semibold">{subject}</span>
                </div>
            </div>
            {/* Email body */}
            <div className="p-6 text-gray-800">
                {children}
            </div>
        </div>
    );
}

function DocumentWindow({ children, title = 'Document' }: { children: React.ReactNode; title?: string }) {
    return (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden" style={{ width: 800, minHeight: 600 }}>
            {/* Mac-style window chrome */}
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="ml-4 text-sm text-gray-600 font-medium">{title}</span>
            </div>
            {/* Toolbar */}
            <div className="bg-gray-50 px-4 py-2 border-b flex items-center gap-4">
                <div className="flex gap-1">
                    {['B', 'I', 'U'].map(btn => (
                        <button key={btn} className="w-7 h-7 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded">
                            {btn}
                        </button>
                    ))}
                </div>
                <div className="h-5 w-px bg-gray-300" />
                <select className="text-xs text-gray-600 bg-transparent">
                    <option>Normal</option>
                </select>
                <select className="text-xs text-gray-600 bg-transparent">
                    <option>Arial</option>
                </select>
            </div>
            {/* Document body */}
            <div className="p-8 text-gray-800 bg-white" style={{ minHeight: 500 }}>
                {children}
            </div>
        </div>
    );
}

function CodeWindow({ children, filename = 'output.md' }: { children: React.ReactNode; filename?: string }) {
    return (
        <div className="bg-[#1e1e1e] rounded-lg shadow-xl overflow-hidden" style={{ width: 800, minHeight: 500 }}>
            {/* VS Code style title bar */}
            <div className="bg-[#323233] px-4 py-2 flex items-center gap-2">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="ml-4 text-xs text-gray-400">{filename}</span>
            </div>
            {/* Tab bar */}
            <div className="bg-[#252526] px-2 py-1 flex items-center border-b border-[#1e1e1e]">
                <div className="bg-[#1e1e1e] px-3 py-1 text-xs text-gray-300 rounded-t">
                    {filename}
                </div>
            </div>
            {/* Code area */}
            <div className="p-4 text-gray-300 font-mono text-sm overflow-auto" style={{ minHeight: 450 }}>
                {children}
            </div>
        </div>
    );
}

function DashboardWindow({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-slate-900 rounded-lg shadow-xl overflow-hidden" style={{ width: 900, minHeight: 600 }}>
            {/* Dashboard header */}
            <div className="bg-slate-800 px-6 py-4 flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        A
                    </div>
                    <span className="text-white font-semibold">Analytics Dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Last updated: Just now</span>
                </div>
            </div>
            {/* Dashboard content */}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}

function PreviewContent() {
    const searchParams = useSearchParams();
    const content = searchParams.get('content') || '';
    const type = searchParams.get('type') || 'document';
    const title = searchParams.get('title') || 'Untitled';

    // Decode content if it was base64 encoded
    let decodedContent = content;
    try {
        if (content && !content.includes(' ')) {
            decodedContent = atob(content);
        }
    } catch {
        // Not base64, use as-is
    }

    const renderContent = () => (
        <MarkdownOutput content={decodedContent} className="text-inherit" />
    );

    switch (type) {
        case 'email':
            return (
                <EmailWindow subject={title}>
                    {renderContent()}
                </EmailWindow>
            );
        case 'code':
            return (
                <CodeWindow filename={title}>
                    {renderContent()}
                </CodeWindow>
            );
        case 'dashboard':
            return (
                <DashboardWindow>
                    {renderContent()}
                </DashboardWindow>
            );
        case 'document':
        default:
            return (
                <DocumentWindow title={title}>
                    {renderContent()}
                </DocumentWindow>
            );
    }
}

export default function PreviewRendererPage() {
    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-8"
            id="preview-container"
        >
            <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
                <PreviewContent />
            </Suspense>
        </div>
    );
}
