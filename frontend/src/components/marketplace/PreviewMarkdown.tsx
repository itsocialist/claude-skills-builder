import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PreviewMarkdownProps {
    content: string;
    className?: string; // Additional classes if needed, but we will enforce text color internally
    theme?: 'light' | 'dark';
}

/**
 * A specialized Markdown renderer for generating high-contrast preview images.
 * This component intentionally ignores most app-wide theme inheritance to ensure
 * text is strictly black/dark (or white in dark mode) for optimal readability in screenshots.
 */
export function PreviewMarkdown({ content, className = '', theme = 'light' }: PreviewMarkdownProps) {
    const isDark = theme === 'dark';
    const textColor = isDark ? 'text-gray-100' : 'text-black';
    const headingColor = isDark ? 'text-white' : 'text-black';
    const mutedColor = isDark ? 'text-gray-400' : 'text-gray-500';
    const codeBg = isDark ? 'bg-[#2b2b2b]' : 'bg-gray-100';
    const codeText = isDark ? 'text-blue-300' : 'text-pink-600';
    const blockQuoteBorder = isDark ? 'border-gray-600' : 'border-gray-300';
    const blockQuoteBg = isDark ? 'bg-[#2b2b2b]' : 'bg-gray-50';
    const blockQuoteText = isDark ? 'text-gray-300' : 'text-gray-700';

    return (
        <div className={`preview-markdown ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ children }) => <h1 className={`text-xl font-bold mb-4 mt-6 ${headingColor}`}>{children}</h1>,
                    h2: ({ children }) => <h2 className={`text-lg font-bold mb-3 mt-5 ${headingColor}`}>{children}</h2>,
                    h3: ({ children }) => <h3 className={`text-base font-bold mb-2 mt-4 ${headingColor}`}>{children}</h3>,
                    h4: ({ children }) => <h4 className={`text-sm font-bold mb-2 mt-3 ${headingColor}`}>{children}</h4>,
                    p: ({ children }) => <p className={`mb-4 leading-relaxed font-medium text-base ${textColor}`}>{children}</p>,
                    ul: ({ children }) => <ul className={`list-disc pl-5 mb-4 space-y-1 font-medium ${textColor}`}>{children}</ul>,
                    ol: ({ children }) => <ol className={`list-decimal pl-5 mb-4 space-y-1 font-medium ${textColor}`}>{children}</ol>,
                    li: ({ children }) => <li className={`mb-1 ${textColor}`}>{children}</li>,
                    strong: ({ children }) => <strong className={`font-bold ${headingColor}`}>{children}</strong>,
                    em: ({ children }) => <em className={`italic ${textColor}`}>{children}</em>,
                    blockquote: ({ children }) => (
                        <blockquote className={`border-l-4 pl-4 py-1 mb-4 italic rounded-r ${blockQuoteBorder} ${blockQuoteBg} ${blockQuoteText}`}>
                            {children}
                        </blockquote>
                    ),
                    code: ({ children, className }) => {
                        // Inline code
                        return (
                            <code className={`px-1.5 py-0.5 rounded text-sm font-mono font-medium ${codeBg} ${codeText} ${className || ''}`}>
                                {children}
                            </code>
                        );
                    },
                    pre: ({ children }) => (
                        // Block code - specialized for high contrast
                        <pre className="bg-[#1e1e1e] p-4 rounded-md overflow-x-auto mb-4 border border-gray-700">
                            {/* Ensure code block text is light enough to read on dark bg */}
                            <div className="font-mono text-sm text-gray-200">
                                {children}
                            </div>
                        </pre>
                    ),
                    table: ({ children }) => (
                        <div className={`overflow-x-auto mb-4 border rounded-lg ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                            <table className={`min-w-full divide-y ${isDark ? 'divide-gray-700 bg-[#1e1e1e]' : 'divide-gray-300 bg-white'}`}>
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => <thead className={isDark ? 'bg-[#2b2b2b]' : 'bg-gray-100'}>{children}</thead>,
                    tbody: ({ children }) => <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>{children}</tbody>,
                    tr: ({ children }) => <tr className={`${isDark ? 'hover:bg-[#2b2b2b]' : 'hover:bg-gray-50'} transition-colors`}>{children}</tr>,
                    th: ({ children }) => (
                        <th className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider border-b ${headingColor} ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className={`px-4 py-3 text-sm whitespace-pre-wrap font-medium border-r last:border-r-0 ${textColor} ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                            {children}
                        </td>
                    ),
                    hr: () => <hr className={`my-6 ${isDark ? 'border-gray-700' : 'border-gray-300'}`} />,
                    a: ({ children }) => <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-2">{children}</span>,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
