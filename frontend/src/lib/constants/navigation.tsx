'use client';

import { Compass, Wand2, Hammer, GitBranch, LayoutTemplate, Layers, Package, Search, Library, Building2, FlaskConical, CheckCircle2, Sparkles } from 'lucide-react';

export interface NavItem {
    id: string;
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    featureFlag?: string;
    requiresAuth?: boolean;
}

export interface NavCategory {
    id: string;
    label: string;
    featureFlag?: string;
    items: NavItem[];
}

export const NAVIGATION_CATEGORIES: NavCategory[] = [
    {
        id: 'discover',
        label: 'Discover',
        items: [
            { id: 'marketplace', label: 'Discover Skills', href: '/marketplace', icon: Compass, featureFlag: 'feature_marketplace' },
            { id: 'bundles', label: 'Power Bundles', href: '/bundles', icon: Layers, featureFlag: 'feature_bundles' },
            { id: 'templates', label: 'Skill Templates', href: '/app/templates', icon: LayoutTemplate, featureFlag: 'feature_templates' },
        ],
    },
    {
        id: 'create',
        label: 'Create',
        items: [
            { id: 'wizard', label: 'Quick Start', href: '/app/wizard', icon: Wand2, featureFlag: 'feature_generations' },
            { id: 'flow', label: 'Flow', href: '/app/flow', icon: Sparkles, featureFlag: 'feature_flow' },
            { id: 'builder', label: 'Skill Builder', href: '/app/builder', icon: Hammer, featureFlag: 'feature_builder' },
            { id: 'canvas', label: 'Visual Canvas', href: '/app/canvas', icon: GitBranch, featureFlag: 'feature_canvas' },
        ],
    },
    {
        id: 'manage',
        label: 'Manage',
        items: [
            { id: 'library', label: 'My Skills', href: '/app/library', icon: Library, featureFlag: 'feature_myskills', requiresAuth: true },
            { id: 'org', label: 'Organization', href: '/app/org', icon: Building2, featureFlag: 'feature_organization', requiresAuth: true },
            { id: 'packages', label: 'Bundle Builder', href: '/app/packages', icon: Package, featureFlag: 'feature_packages' },
        ],
    },
    {
        id: 'labs',
        label: 'Labs',
        featureFlag: 'feature_labs',
        items: [
            { id: 'ai-assistant', label: 'AI Assistant', href: '/app/assistant', icon: FlaskConical, featureFlag: 'feature_ai_assistant' },
            { id: 'inspector', label: 'Skill Inspector', href: '/app/inspector', icon: Search, featureFlag: 'feature_inspector' },
        ],
    },
    {
        id: 'learn',
        label: 'Learn',
        featureFlag: 'feature_learn',
        items: [
            { id: 'what-is-skill', label: 'What is a Skill?', href: '/app/learn/what-is-a-skill', icon: Compass, featureFlag: 'feature_learn' },
            { id: 'best-practices', label: 'Best Practices', href: '/app/learn/best-practices', icon: CheckCircle2, featureFlag: 'feature_learn' },
        ],
    },
];
