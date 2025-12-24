import { create } from 'zustand';
import type { Skill } from '@/types/skill.types';

interface SkillStore {
    skill: Skill;
    setSkill: (skill: Skill) => void;
    updateField: (field: keyof Skill, value: any) => void;
    addTrigger: (trigger: string) => void;
    removeTrigger: (index: number) => void;
    reset: () => void;
}

const emptySkill: Skill = {
    name: '',
    description: '',
    category: '',
    tags: [],
    triggers: [],
    instructions: '',
};

export const useSkillStore = create<SkillStore>((set) => ({
    skill: emptySkill,

    setSkill: (skill) => set({ skill }),

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

    reset: () => set({ skill: emptySkill }),
}));
