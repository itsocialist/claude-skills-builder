import { create } from 'zustand';
import type { Skill, SkillResource, ResourceFolder } from '@/types/skill.types';

interface SkillStore {
    skill: Skill;
    setSkill: (skill: Skill) => void;
    updateField: (field: keyof Skill, value: any) => void;
    addTrigger: (trigger: string) => void;
    removeTrigger: (index: number) => void;
    addResource: (resource: Omit<SkillResource, 'id'>) => void;
    removeResource: (id: string) => void;
    reset: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const emptySkill: Skill = {
    name: '',
    description: '',
    category: '',
    tags: [],
    triggers: [],
    instructions: '',
    resources: [],
};

export const useSkillStore = create<SkillStore>((set) => ({
    skill: emptySkill,

    setSkill: (skill) => set({ skill: { ...emptySkill, ...skill } }),

    updateField: (field, value) =>
        set((state) => ({
            skill: { ...state.skill, [field]: value }
        })),

    addTrigger: (trigger) =>
        set((state) => ({
            skill: {
                ...state.skill,
                triggers: [...state.skill.triggers, trigger],
            },
        })),

    removeTrigger: (index) =>
        set((state) => ({
            skill: {
                ...state.skill,
                triggers: state.skill.triggers.filter((_, i) => i !== index),
            },
        })),

    addResource: (resource) =>
        set((state) => ({
            skill: {
                ...state.skill,
                resources: [...(state.skill.resources || []), { ...resource, id: generateId() }],
            },
        })),

    removeResource: (id) =>
        set((state) => ({
            skill: {
                ...state.skill,
                resources: (state.skill.resources || []).filter((r) => r.id !== id),
            },
        })),

    reset: () => set({ skill: emptySkill }),
}));
