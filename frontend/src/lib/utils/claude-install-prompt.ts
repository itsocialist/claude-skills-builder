'use client';

import { toast } from 'sonner';
import { ExternalLink } from 'lucide-react';

/**
 * Claude Install Prompt Utility
 * 
 * Shows a toast notification after skill/bundle downloads with option
 * to open Claude.ai settings to install the skill.
 * 
 * Smart timing:
 * - First 3 downloads: Show toast for 15 seconds
 * - After 3 downloads: Show for 8 seconds  
 * - After 5 downloads: Show "Don't show again" option
 * - Preference persisted in localStorage
 */

const STORAGE_KEY = 'claude_install_prompt';
const CLAUDE_SETTINGS_URL = 'https://claude.ai/settings/capabilities';

interface PromptState {
    downloadCount: number;
    dismissed: boolean;
}

function getState(): PromptState {
    if (typeof window === 'undefined') {
        return { downloadCount: 0, dismissed: false };
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return { downloadCount: 0, dismissed: false };
        }
    }
    return { downloadCount: 0, dismissed: false };
}

function setState(state: PromptState): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
}

function incrementDownloadCount(): number {
    const state = getState();
    state.downloadCount++;
    setState(state);
    return state.downloadCount;
}

function dismissPermanently(): void {
    const state = getState();
    state.dismissed = true;
    setState(state);
}

/**
 * Opens Claude settings directly
 */
export function openClaudeSettings(): void {
    window.open(CLAUDE_SETTINGS_URL, '_blank', 'noopener,noreferrer');
}

/**
 * Shows the Claude install prompt toast after a download
 * Uses sonner toast library with custom action buttons
 * 
 * @param skillName - Name of the downloaded skill/bundle
 */
export function showClaudeInstallPrompt(skillName: string): void {
    const state = getState();

    // Don't show if user permanently dismissed
    if (state.dismissed) {
        return;
    }

    const count = incrementDownloadCount();

    // Determine duration based on download count
    const duration = count <= 3 ? 15000 : 8000;
    const showDontAsk = count >= 5;

    toast.success(`Downloaded "${skillName}"`, {
        description: 'Ready to install in Claude?',
        duration,
        action: {
            label: 'Open Claude Settings',
            onClick: () => {
                openClaudeSettings();
            },
        },
        cancel: showDontAsk ? {
            label: "Don't show again",
            onClick: () => {
                dismissPermanently();
            },
        } : undefined,
    });
}

/**
 * Resets the prompt state (for testing/admin purposes)
 */
export function resetClaudePromptState(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
    }
}
