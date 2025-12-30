'use client';

import { create } from 'zustand';
import { fetchUserSkills, saveSkill, deleteSkill as apiDeleteSkill, type SavedSkill } from '@/lib/api/skillsApi';

interface LibraryState {
    skills: SavedSkill[];
    isLoading: boolean;
    error: string | null;
    searchQuery: string;

    // Actions
    fetchSkills: (userId: string) => Promise<void>;
    importFromZip: (userId: string, file: File) => Promise<SavedSkill | null>;
    deleteSkill: (skillId: string) => Promise<void>;
    setSearchQuery: (query: string) => void;
    clearError: () => void;
}

// Parse YAML frontmatter from SKILL.md
function parseSkillMd(content: string): { name: string; description: string; category: string; triggers: string[]; instructions: string } | null {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontmatterMatch) return null;

    const frontmatter = frontmatterMatch[1];
    const body = frontmatterMatch[2].trim();

    // Simple YAML parsing for our expected fields
    const getName = (fm: string) => {
        const match = fm.match(/^name:\s*["']?(.+?)["']?\s*$/m);
        return match ? match[1] : '';
    };
    const getDescription = (fm: string) => {
        const match = fm.match(/^description:\s*["']?(.+?)["']?\s*$/m);
        return match ? match[1] : '';
    };
    const getCategory = (fm: string) => {
        const match = fm.match(/^category:\s*["']?(.+?)["']?\s*$/m);
        return match ? match[1] : '';
    };
    const getTriggers = (fm: string): string[] => {
        const match = fm.match(/^triggers:\s*\[(.*?)\]/m);
        if (match) {
            return match[1].split(',').map(t => t.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
        }
        // Multi-line array format
        const multiMatch = fm.match(/^triggers:\s*\n((?:\s+-\s*.+\n?)+)/m);
        if (multiMatch) {
            return multiMatch[1].split('\n')
                .map(line => line.replace(/^\s*-\s*["']?|["']?\s*$/g, ''))
                .filter(Boolean);
        }
        return [];
    };

    return {
        name: getName(frontmatter),
        description: getDescription(frontmatter),
        category: getCategory(frontmatter),
        triggers: getTriggers(frontmatter),
        instructions: body,
    };
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
    skills: [],
    isLoading: false,
    error: null,
    searchQuery: '',

    fetchSkills: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
            const skills = await fetchUserSkills(userId);
            set({ skills, isLoading: false });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'Failed to fetch skills', isLoading: false });
        }
    },

    importFromZip: async (userId: string, file: File) => {
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            set({ error: 'File size must be less than 5MB' });
            return null;
        }

        try {
            // Dynamic import JSZip to handle potential chunk loading issues
            let JSZip;
            try {
                JSZip = (await import('jszip')).default;
            } catch (chunkError) {
                console.error('Failed to load JSZip:', chunkError);
                set({ error: 'Failed to load zip processor. Please refresh the page and try again.' });
                return null;
            }

            const zip = await JSZip.loadAsync(file);

            // Find SKILL.md in the zip
            let skillMdContent: string | null = null;
            for (const [path, zipEntry] of Object.entries(zip.files)) {
                if (path.endsWith('SKILL.md') && !zipEntry.dir) {
                    skillMdContent = await zipEntry.async('string');
                    break;
                }
            }

            if (!skillMdContent) {
                set({ error: 'No SKILL.md found in zip file' });
                return null;
            }

            // Parse the SKILL.md
            const parsed = parseSkillMd(skillMdContent);
            if (!parsed || !parsed.name) {
                set({ error: 'Invalid SKILL.md format' });
                return null;
            }

            // Save to Supabase
            const saved = await saveSkill(userId, {
                name: parsed.name,
                description: parsed.description,
                category: parsed.category,
                tags: [],
                triggers: parsed.triggers,
                instructions: parsed.instructions,
            });

            if (saved) {
                // Refresh the skills list
                await get().fetchSkills(userId);
                return saved;
            }
            return null;
        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'Failed to import skill' });
            return null;
        }
    },

    deleteSkill: async (skillId: string) => {
        try {
            const success = await apiDeleteSkill(skillId);
            if (success) {
                set(state => ({
                    skills: state.skills.filter(s => s.id !== skillId)
                }));
            }
        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'Failed to delete skill' });
        }
    },

    setSearchQuery: (query: string) => set({ searchQuery: query }),
    clearError: () => set({ error: null }),
}));

// Selector for filtered skills
export function useFilteredSkills() {
    const { skills, searchQuery } = useLibraryStore();

    if (!searchQuery.trim()) return skills;

    const query = searchQuery.toLowerCase();
    return skills.filter(skill =>
        skill.name.toLowerCase().includes(query) ||
        skill.description.toLowerCase().includes(query) ||
        skill.triggers.some(t => t.toLowerCase().includes(query))
    );
}

// Selector for recent skills (for sidebar)
export function useRecentSkills(limit = 5) {
    const { skills } = useLibraryStore();
    return [...skills]
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, limit);
}
