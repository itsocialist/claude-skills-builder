import { create } from 'zustand';
import type { Package, PackageSkill, PackageResource, SkillType } from '@/types/package.types';
import type { Skill } from '@/types/skill.types';

interface PackageStore {
    pkg: Package;
    setPackage: (pkg: Package) => void;
    updateField: (field: keyof Package, value: any) => void;

    // Skills management
    addSkill: (skill: Skill, type: SkillType) => void;
    removeSkill: (id: string) => void;
    updateSkillType: (id: string, type: SkillType) => void;

    // Resources management
    addResource: (resource: Omit<PackageResource, 'id'>) => void;
    removeResource: (id: string) => void;

    reset: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const emptyPackage: Package = {
    id: '',
    name: '',
    description: '',
    skills: [],
    resources: [],
    createdAt: new Date(),
    updatedAt: new Date(),
};

export const usePackageStore = create<PackageStore>((set) => ({
    pkg: { ...emptyPackage, id: generateId() },

    setPackage: (pkg) => set({ pkg }),

    updateField: (field, value) =>
        set((state) => ({
            pkg: { ...state.pkg, [field]: value, updatedAt: new Date() }
        })),

    addSkill: (skill, type) =>
        set((state) => ({
            pkg: {
                ...state.pkg,
                skills: [...state.pkg.skills, { id: generateId(), skill, type }],
                updatedAt: new Date(),
            },
        })),

    removeSkill: (id) =>
        set((state) => ({
            pkg: {
                ...state.pkg,
                skills: state.pkg.skills.filter((s) => s.id !== id),
                updatedAt: new Date(),
            },
        })),

    updateSkillType: (id, type) =>
        set((state) => ({
            pkg: {
                ...state.pkg,
                skills: state.pkg.skills.map((s) =>
                    s.id === id ? { ...s, type } : s
                ),
                updatedAt: new Date(),
            },
        })),

    addResource: (resource) =>
        set((state) => ({
            pkg: {
                ...state.pkg,
                resources: [...state.pkg.resources, { ...resource, id: generateId() }],
                updatedAt: new Date(),
            },
        })),

    removeResource: (id) =>
        set((state) => ({
            pkg: {
                ...state.pkg,
                resources: state.pkg.resources.filter((r) => r.id !== id),
                updatedAt: new Date(),
            },
        })),

    reset: () => set({ pkg: { ...emptyPackage, id: generateId() } }),
}));
