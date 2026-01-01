'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { PreviewMarkdown } from '@/components/marketplace/PreviewMarkdown';
import {
    Terminal,
    Search,
    MessageSquare,
    FileText,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Shield,
    Layout,
    Menu,
    Smile,
    Paperclip
} from 'lucide-react';

// --- Window Components ---

function BrowserWindow({ children, url = 'https://skills.anthropic.com' }: { children: React.ReactNode; url?: string }) {
    return (
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200" style={{ width: 1000, minHeight: 800 }}>
            {/* Browser Chrome */}
            <div className="bg-gray-100 border-b border-gray-300">
                <div className="flex items-center px-4 py-3 gap-4">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex gap-3 text-gray-500">
                        <ChevronLeft size={18} />
                        <ChevronRight size={18} />
                        <RefreshCw size={16} />
                    </div>
                    <div className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-1.5 flex items-center gap-2 text-sm text-gray-600 shadow-sm">
                        <Shield size={12} className="text-gray-400" />
                        <span>{url}</span>
                    </div>
                    <MoreHorizontal size={18} className="text-gray-500" />
                </div>
            </div>
            {/* Browser Content */}
            <div className="bg-white h-full">
                <div className="max-w-4xl mx-auto p-8 text-black">
                    <PreviewMarkdown content={children as string} />
                </div>
            </div>
        </div>
    );
}

function IDEWindow({ children, filename = 'script.ts' }: { children: React.ReactNode; filename?: string }) {
    return (
        <div className="bg-[#1e1e1e] rounded-lg shadow-2xl overflow-hidden border border-gray-800" style={{ width: 1000, minHeight: 800 }}>
            <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-12 bg-[#333333] border-r border-[#2b2b2b] flex flex-col items-center py-4 gap-4">
                    <FileText className="text-white opacity-80" size={24} />
                    <Search className="text-gray-400" size={24} />
                    <Layout className="text-gray-400" size={24} />
                    <div className="flex-1" />
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">U</div>
                </div>
                {/* File Tree (Simplified) */}
                <div className="w-48 bg-[#252526] border-r border-[#2b2b2b] hidden md:block">
                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Explorer</div>
                    <div className="px-2 py-1 text-sm text-blue-400 flex items-center gap-2 bg-[#37373d]">
                        <span className="w-4 text-center shrink-0">TS</span>
                        <span className="truncate">{filename}</span>
                    </div>
                    {['utils.ts', 'types.ts', 'config.json', 'README.md'].map(f => (
                        <div key={f} className="px-2 py-1 text-sm text-gray-400 flex items-center gap-2 pl-6">
                            {f}
                        </div>
                    ))}
                </div>
                {/* Main Editor */}
                <div className="flex-1 flex flex-col bg-[#1e1e1e]">
                    {/* Tabs */}
                    <div className="flex bg-[#252526]">
                        <div className="px-4 py-2 text-sm text-white bg-[#1e1e1e] border-t-2 border-blue-500 flex items-center gap-2 max-w-[200px]">
                            <span className="text-blue-400 font-bold shrink-0">TS</span>
                            <span className="truncate">{filename}</span>
                        </div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 p-6 overflow-auto font-mono text-gray-300">
                        <PreviewMarkdown content={children as string} />
                    </div>
                    {/* Status Bar */}
                    <div className="bg-[#007acc] text-white px-3 py-1 text-xs flex justify-between items-center">
                        <div className="flex gap-4">
                            <span>main*</span>
                            <span>0 errors</span>
                        </div>
                        <div className="flex gap-4">
                            <span>Ln 12, Col 45</span>
                            <span>UTF-8</span>
                            <span>TypeScript React</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ClaudeWindow({ children }: { children: React.ReactNode }) {
    // Dark mode Project UI colors
    const bgMain = 'bg-[#21211f]'; // Dark grey main background
    const bgSidebar = 'bg-[#191919]'; // Darker sidebar
    const border = 'border-[#2b2b2b]';
    const textPrimary = 'text-[#ececec]';
    const textSecondary = 'text-[#9e9e9e]';

    return (
        <div className={`${bgMain} rounded-lg shadow-2xl overflow-hidden border ${border}`} style={{ width: 1000, minHeight: 800 }}>
            {/* Sidebar */}
            <div className="flex h-full font-sans antialiased">
                <div className={`w-64 ${bgSidebar} border-r ${border} hidden md:flex flex-col p-3`}>
                    {/* Top User/Team */}
                    <div className="flex items-center gap-2 mb-6 px-2 py-1 hover:bg-[#2b2b2b] rounded-lg cursor-pointer transition-colors">
                        <div className="w-5 h-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded text-[10px] text-white flex items-center justify-center font-bold">
                            U
                        </div>
                        <span className={`font-medium ${textPrimary} text-sm`}>Brian Dawson</span>
                        <ChevronRight size={14} className="ml-auto text-gray-500" />
                    </div>

                    {/* Nav Items */}
                    <div className="space-y-1 mb-6">
                        <div className={`flex items-center gap-3 px-3 py-2 bg-[#2b2b2b] rounded-lg ${textPrimary} text-sm font-medium`}>
                            <MessageSquare size={16} />
                            <span>Recents</span>
                        </div>
                        <div className={`flex items-center gap-3 px-3 py-2 hover:bg-[#2b2b2b]/50 rounded-lg ${textSecondary} text-sm`}>
                            <Search size={16} />
                            <span>Search</span>
                        </div>
                    </div>

                    <div className={`text-xs font-bold ${textSecondary} uppercase tracking-wider mb-2 px-3`}>Your Projects</div>
                    <div className="space-y-1">
                        <div className={`group flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#2b2b2b] cursor-pointer ${textSecondary} hover:${textPrimary} text-sm`}>
                            <span className="truncate">CIQ Stacks Platform</span>
                            <MoreHorizontal size={14} className="opacity-0 group-hover:opacity-100" />
                        </div>
                        <div className={`group flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#2b2b2b] cursor-pointer ${textSecondary} hover:${textPrimary} text-sm`}>
                            <span className="truncate">Marketing Q1 2026</span>
                            <MoreHorizontal size={14} className="opacity-0 group-hover:opacity-100" />
                        </div>
                    </div>

                    <div className="flex-1" />

                    {/* Bottom Utility */}
                    <div className={`flex items-center gap-2 px-3 py-2 ${textSecondary} text-xs`}>
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Professional Plan</span>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className={`flex-1 flex flex-col ${bgMain}`}>
                    {/* Top Bar (Breadcrumb) */}
                    <div className={`h-14 border-b ${border} flex items-center px-6 justify-between`}>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="hover:text-gray-200 cursor-pointer">CIQ Stacks Platform</span>
                            <span className="text-gray-600">/</span>
                            <span className={`${textPrimary} font-medium`}>Stack strategy validation</span>
                            <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-green-900/30 text-green-400 border border-green-800/50">Project</span>
                        </div>
                        <div className="flex gap-4 text-gray-400">
                            <ShareIcon />
                        </div>
                    </div>

                    {/* Chat Scroll Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="max-w-3xl mx-auto px-4 py-8">
                            {/* User Message */}
                            <div className="flex justify-end mb-8">
                                <div className="bg-[#2b2b2b] px-5 py-4 rounded-3xl rounded-tr-sm max-w-2xl text-gray-100 leading-relaxed shadow-sm">
                                    Can you review this output and tell me if it aligns with our strategic pillars?
                                </div>
                            </div>

                            {/* Claude Response */}
                            <div className="flex gap-5">
                                <div className="w-8 h-8 rounded-lg bg-[#d97757] flex-shrink-0 mt-1 shadow-sm flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-[#ececec]">Claude</span>
                                        <span className="text-xs text-gray-500 font-medium px-1.5 py-0.5 rounded border border-gray-700">Sonnet 3.5</span>
                                    </div>
                                    <div className="prose prose-invert prose-p:text-[#d1d5db] prose-headings:text-white max-w-none font-serif leading-relaxed">
                                        <PreviewMarkdown content={children as string} theme="dark" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className={`p-6 ${bgMain}`}>
                        <div className="max-w-3xl mx-auto">
                            <div className={`bg-[#2b2b2b] rounded-2xl p-4 border ${border} shadow-lg relative min-h-[100px]`}>
                                <div className={`text-gray-500 text-base mb-8 font-light ${textSecondary}`}>Reply to Claude...</div>
                                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <div className="p-2 hover:bg-[#383838] rounded-lg cursor-pointer text-gray-400">
                                            <Paperclip size={18} />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500 font-medium">Use Project context</span>
                                        <div className="w-8 h-8 bg-[#d97757] rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                                            <ChevronRight size={18} className="text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center mt-3 text-xs text-[#525252]">
                                Claude can make mistakes. Please double-check responses.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ShareIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>; }

function WordWindow({ children, title = 'Document' }: { children: React.ReactNode; title?: string }) {
    return (
        <div className="bg-[#f9fbfd] rounded-lg shadow-2xl overflow-hidden border border-gray-200" style={{ width: 1000, minHeight: 800 }}>
            {/* GDocs Header */}
            <div className="bg-white px-4 py-2 border-b border-gray-200 flex flex-col gap-2">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-lg">W</div>
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-800 text-lg">{title}</span>
                        <div className="flex gap-3 text-sm text-gray-500">
                            <span>File</span>
                            <span>Edit</span>
                            <span>View</span>
                            <span>Insert</span>
                            <span>Format</span>
                            <span>Tools</span>
                        </div>
                    </div>
                    <div className="flex-1" />
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">B</div>
                    <div className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full font-medium text-sm">Share</div>
                </div>
                {/* Toolbar */}
                <div className="bg-[#edf2fa] rounded-full px-4 py-1.5 flex items-center gap-4 mx-auto w-full max-w-3xl justify-between text-gray-600">
                    <div className="flex gap-2">
                        <Search size={16} />
                        <div className="w-px h-4 bg-gray-300 mx-2" />
                        <span className="font-serif">Normal text</span>
                        <div className="w-px h-4 bg-gray-300 mx-2" />
                        <span className="font-sans">Arial</span>
                        <div className="w-px h-4 bg-gray-300 mx-2" />
                        <span>11</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-bold">B</span>
                        <span className="italic">I</span>
                        <span className="underline">U</span>
                        <span className="text-blue-600">A</span>
                    </div>
                </div>
            </div>
            {/* Page Canvas */}
            <div className="p-8 flex justify-center bg-[#f9fbfd] overflow-y-auto h-full">
                <div className="bg-white w-[816px] min-h-[1056px] shadow-sm border border-gray-200 p-[96px] text-black">
                    <PreviewMarkdown content={children as string} />
                </div>
            </div>
        </div>
    );
}

function EmailWindow({ children, subject = 'Re: Output', from = 'assistant@example.com', to = 'user@company.com' }: {
    children: React.ReactNode;
    subject?: string;
    from?: string;
    to?: string;
}) {
    return (
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200" style={{ width: 1000, minHeight: 800 }}>
            {/* Mac Mail Chrome */}
            <div className="bg-[#f6f6f6] px-4 py-3 flex items-center justify-between border-b border-gray-300">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex gap-4 text-gray-400">
                    <TrashIcon />
                    <ArchiveIcon />
                    <ReplyIcon />
                </div>
            </div>
            {/* Email Header */}
            <div className="bg-white px-8 py-6 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-black mb-4">{subject}</h1>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        {from.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-bold text-black">{from}</div>
                        <div className="text-gray-500 text-sm">To: {to}</div>
                    </div>
                    <div className="flex-1" />
                    <div className="text-gray-400 text-sm">Today at 10:42 AM</div>
                </div>
            </div>
            {/* Body */}
            <div className="p-8 bg-white h-full">
                <div className="max-w-3xl text-black">
                    <PreviewMarkdown content={children as string} />
                </div>
            </div>
        </div>
    );
}

// Icons
function TrashIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>; }
function ArchiveIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>; }
function ReplyIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>; }

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

    switch (type.toLowerCase()) {
        case 'email':
            return <EmailWindow subject={title} from="assistant@claude.ai" to="user@company.com">{decodedContent}</EmailWindow>;
        case 'ide':
        case 'code':
            return <IDEWindow filename={title.toLowerCase().replace(/\s+/g, '-') + '.ts'}>{decodedContent}</IDEWindow>;
        case 'browser':
        case 'web':
            return <BrowserWindow url={`https://skills.anthropic.com/${title.toLowerCase().replace(/\s+/g, '-')}`}>{decodedContent}</BrowserWindow>;
        case 'claude':
        case 'chat':
            // Using implicit dark mode theme handled inside ClaudeWindow via PreviewMarkdown theme="dark"
            return <ClaudeWindow>{decodedContent}</ClaudeWindow>;
        case 'word':
        case 'doc':
        case 'document':
        default:
            return <WordWindow title={title}>{decodedContent}</WordWindow>;
    }
}

export default function PreviewRendererPage() {
    return (
        <div
            className="min-h-screen bg-transparent flex items-start justify-start"
            id="preview-container"
        >
            <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
                <PreviewContent />
            </Suspense>
        </div>
    );
}
