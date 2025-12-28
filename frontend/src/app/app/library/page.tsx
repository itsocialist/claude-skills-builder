'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { SkillCard } from '@/components/library/SkillCard';
import { SkillUploader } from '@/components/library/SkillUploader';
import { Shell } from '@/components/layout/Shell';
import { fetchUserSkills, deleteSkill, duplicateSkill, type SavedSkill } from '@/lib/api/skillsApi';
import { generateSkillZip } from '@/lib/utils/skill-generator';
import { Search, Plus, Library, Loader2 } from 'lucide-react';
import { useSiteSettings } from '@/lib/contexts/SiteSettingsContext';
import { DEFAULT_FLAGS } from '@/lib/flags';

export default function LibraryPage() {
    const router = useRouter();
    const { user, loading: authLoading, isConfigured } = useAuth();
    const [skills, setSkills] = useState<SavedSkill[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const { settings } = useSiteSettings();

    // Feature Flag Logic
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').toLowerCase().split(',');
    const isAdmin = user?.email && adminEmails.some(e => e.trim() === user.email?.toLowerCase().trim());
    const builderFlag = settings.feature_flags?.feature_builder || DEFAULT_FLAGS.feature_builder;
    const canUseBuilder = builderFlag !== 'DISABLED' && (builderFlag !== 'ADMIN_ONLY' || isAdmin);

    // Fetch skills on mount
    useEffect(() => {
        if (!authLoading && user) {
            loadSkills();
        } else if (!authLoading && !user) {
            setLoading(false);
        }
    }, [user, authLoading]);

    const loadSkills = async () => {
        if (!user) return;
        setLoading(true);
        const data = await fetchUserSkills(user.id);
        setSkills(data);
        setLoading(false);
    };

    const handleEdit = (skill: SavedSkill) => {
        router.push(`/app/builder?edit=${skill.id}`);
    };

    const handleDelete = async (skillId: string) => {
        if (!confirm('Are you sure you want to delete this skill?')) return;
        const success = await deleteSkill(skillId);
        if (success) {
            setSkills(skills.filter(s => s.id !== skillId));
        }
    };

    const handleDuplicate = async (skillId: string) => {
        if (!user) return;
        const newSkill = await duplicateSkill(skillId, user.id);
        if (newSkill) {
            setSkills([newSkill, ...skills]);
        }
    };

    const handleExport = async (skill: SavedSkill) => {
        const blob = await generateSkillZip(skill);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${skill.name.toLowerCase().replace(/\s+/g, '-')}.zip`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Get unique categories
    const categories = ['all', ...new Set(skills.map(s => s.category).filter(Boolean))];

    // Filter skills
    const filteredSkills = skills.filter(skill => {
        const matchesSearch = !searchQuery ||
            skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            skill.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || skill.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    if (authLoading) {
        return (
            <Shell>
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="w-8 h-8 text-[#C15F3C] animate-spin" />
                </div>
            </Shell>
        );
    }

    if (!isConfigured) {
        return (
            <Shell>
                <div className="max-w-md mx-auto text-center py-20">
                    <Library className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2">Library Not Available</h2>
                    <p className="text-gray-400">
                        Authentication is not configured. Set up Supabase to enable the skill library.
                    </p>
                </div>
            </Shell>
        );
    }

    if (!user) {
        return (
            <Shell>
                <div className="max-w-md mx-auto text-center py-20">
                    <Library className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2">Sign In to View Your Library</h2>
                    <p className="text-gray-400 mb-6">
                        Create an account or sign in to save and manage your skills.
                    </p>
                    <button
                        onClick={() => router.push('/app')}
                        className="bg-[#C15F3C] hover:bg-[#a84e31] text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                    >
                        Go to Home
                    </button>
                </div>
            </Shell>
        );
    }

    return (
        <Shell>
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">My Skills</h1>
                        <p className="text-gray-400 mt-1">
                            {skills.length} skill{skills.length !== 1 ? 's' : ''} saved
                        </p>
                    </div>
                </div>
                {canUseBuilder && (
                    <button
                        onClick={() => router.push('/app/builder')}
                        className="flex items-center gap-2 bg-[#C15F3C] hover:bg-[#a84e31] text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        New Skill
                    </button>
                )}

                {/* Upload Zone */}
                <SkillUploader />

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search skills..."
                            className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#C15F3C]"
                        />
                    </div>

                    {/* Category filter */}
                    {categories.length > 1 && (
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C15F3C]"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === 'all' ? 'All Categories' : cat}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Skills Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-[#C15F3C] animate-spin" />
                    </div>
                ) : filteredSkills.length === 0 ? (
                    <div className="text-center py-20">
                        {skills.length === 0 ? (
                            <>
                                <Library className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white mb-2">No skills yet</h3>
                                <p className="text-gray-400 mb-6">
                                    Create your first skill to get started!
                                </p>
                                {canUseBuilder && (
                                    <button
                                        onClick={() => router.push('/app/builder')}
                                        className="bg-[#C15F3C] hover:bg-[#a84e31] text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                                    >
                                        Create Skill
                                    </button>
                                )}
                            </>
                        ) : (
                            <>
                                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white mb-2">No matching skills</h3>
                                <p className="text-gray-400">
                                    Try adjusting your search or filters.
                                </p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSkills.map(skill => (
                            <SkillCard
                                key={skill.id}
                                skill={skill}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onDuplicate={handleDuplicate}
                                onExport={handleExport}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Shell>
    );
}
