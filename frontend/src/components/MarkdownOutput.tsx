'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownOutputProps {
  content: string;
  className?: string;
}

export function MarkdownOutput({ content, className = '' }: MarkdownOutputProps) {
  if (!content) return null;

  return (
    <div className={`prose dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-xl font-bold mb-4 mt-6 text-inherit">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold mb-3 mt-5 text-inherit">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-bold mb-2 mt-4 text-inherit">{children}</h3>,
          p: ({ children }) => <p className="mb-4 leading-relaxed text-inherit">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-1 text-inherit">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-1 text-inherit">{children}</ol>,
          li: ({ children }) => <li className="mb-1 text-inherit">{children}</li>,
          strong: ({ children }) => <strong className="font-bold text-inherit">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          code: ({ children }) => (
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary-600 dark:text-primary-400">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 border border-border font-mono text-sm leading-6">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/30 pl-4 py-1 italic mb-4 text-muted-foreground">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-6 border border-border rounded-lg">
              <table className="w-full text-sm text-left">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-muted/50 text-xs uppercase font-semibold text-foreground/70">{children}</thead>,
          th: ({ children }) => <th className="px-4 py-3 border-b border-border">{children}</th>,
          td: ({ children }) => <td className="px-4 py-3 border-b border-border text-foreground">{children}</td>,
          hr: () => <hr className="my-8 border-border" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
