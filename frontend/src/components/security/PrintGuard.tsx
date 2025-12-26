'use client';

interface PrintGuardProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Wrapper component that hides content when printing
 * and disables text selection for basic IP protection
 */
export function PrintGuard({ children, className = '' }: PrintGuardProps) {
    return (
        <div className={`print:hidden select-none ${className}`}>
            {children}
        </div>
    );
}
