'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, FileText, MoreHorizontal, Eye } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLibraryStore, useRecentSkills } from '@/lib/store/libraryStore';
import { trackSkillView } from '@/lib/api/skillsApi';

export function RecentSkills() {
    const { user } = useAuth();
    const { fetchSkills, isLoading } = useLibraryStore();
    const recentSkills = useRecentSkills(5);
    const [isExpanded, setIsExpanded] = useState(true);

    // Fetch skills on mount if user is logged in
    useEffect(() => {
        if (user) {
            fetchSkills(user.id);
        }
    }, [user, fetchSkills]);

    const handleSkillClick = (skillId: string) => {
        // Track view in background
        trackSkillView(skillId);
    };

    if (!user) return null;

    return (
        <div className="mt-4 pt-4 border-t border-border">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground"
            >
                {isExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                ) : (
                    <ChevronRight className="w-3 h-3" />
                )}
                Recent Skills
            </button>

            {/* Skills List */}
            {isExpanded && (
                <div className="space-y-0.5">
                    {isLoading ? (
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                            Loading...
                        </div>
                    ) : recentSkills.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                            No skills yet
                        </div>
                    ) : (
                        <>
                            {recentSkills.map((skill) => (
                                <Link
                                    key={skill.id}
                                    href={`/app/builder?edit=${skill.id}`}
                                    onClick={() => handleSkillClick(skill.id)}
                                    className="flex items-center gap-2 px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md mx-2 group"
                                >
                                    <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span className="truncate flex-1">{skill.name}</span>
                                    {skill.view_count && skill.view_count > 0 && (
                                        <span className="flex items-center gap-0.5 text-xs text-muted-foreground/60">
                                            <Eye className="w-3 h-3" />
                                            {skill.view_count}
                                        </span>
                                    )}
                                </Link>
                            ))}

                            {/* View All Link */}
                            <Link
                                href="/app/library"
                                className="flex items-center gap-2 px-4 py-1.5 text-sm text-primary hover:text-primary/80 hover:bg-accent rounded-md mx-2"
                            >
                                <MoreHorizontal className="w-3.5 h-3.5" />
                                View all
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

