/**
 * Centralized theme constants for styling consistency
 * All UI components should reference these values
 */

// Spacing tokens
export const spacing = {
    /** Standard card padding - use for all cards */
    card: 'p-5',
    /** Compact card padding - for dense layouts only */
    cardCompact: 'p-4',
    /** Section vertical padding */
    section: 'py-10',
    /** Feature section padding */
    sectionLarge: 'py-16',
} as const;

// Badge styling
export const badge = {
    /** Category badge styling - use for template categories */
    category: 'inline-block px-2 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full',
} as const;

// Card styling
export const card = {
    /** Standard card classes */
    base: 'hover:shadow-lg transition-shadow border-border',
    /** Template card specific styling */
    template: 'flex flex-col hover:shadow-lg transition-shadow border-border',
} as const;

// Icon container styling
export const iconContainer = {
    /** Standard icon container for feature cards */
    feature: 'h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 text-primary',
} as const;
