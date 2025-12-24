import { Skill } from './skill.types';

export type SkillType = 'Simple' | 'Structured' | 'Strict';

export interface PackageSkill {
    id: string;
    skill: Skill;
    type: SkillType;
}

export interface PackageResource {
    id: string;
    folder: 'resources' | 'templates' | 'examples' | 'scripts';
    name: string;
    content: string;
}

export interface Package {
    id: string;
    name: string;
    description: string;
    skills: PackageSkill[];
    resources: PackageResource[];
    createdAt: Date;
    updatedAt: Date;
}
