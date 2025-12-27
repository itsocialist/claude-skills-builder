'use client';

import { useState } from 'react';
import { Edit3, Trash2, Copy, Download, MoreVertical, Eye, Share2 } from 'lucide-react';
import type { SavedSkill } from '@/lib/api/skillsApi';

interface SkillCardProps {
    skill: SavedSkill;
    onEdit: (skill: SavedSkill) => void;
    onDelete: (skillId: string) => void;
    onDuplicate: (skillId: string) => void;
    onExport: (skill: SavedSkill) => void;
}

export function SkillCard({ skill, onEdit, onDelete, onDuplicate, onExport }: SkillCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        const shareUrl = `${window.location.origin}/s/${skill.id}`;
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-4 hover:border-[#C15F3C]/50 transition-all group">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{skill.name}</h3>
                    {skill.category && (
                        <span className="text-xs text-[#C15F3C] bg-[#C15F3C]/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                            {skill.category}
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    {/* Share button - always visible on hover */}
                    <button
                        onClick={handleShare}
                        className={`p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${copied
                            ? 'text-green-400 bg-green-400/10'
                            : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                            }`}
                        title={copied ? 'Copied!' : 'Copy share link'}
                    >
                        <Share2 className="w-4 h-4" />
                    </button>

                    {/* Menu button */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#3a3a3a] rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>

                        {showMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowMenu(false)}
                                />
                                <div className="absolute right-0 mt-1 w-36 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg shadow-xl py-1 z-20">
                                    <button
                                        onClick={() => {
                                            onEdit(skill);
                                            setShowMenu(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-[#3a3a3a]"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            onDuplicate(skill.id);
                                            setShowMenu(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-[#3a3a3a]"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                        Duplicate
                                    </button>
                                    <button
                                        onClick={() => {
                                            onExport(skill);
                                            setShowMenu(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-[#3a3a3a]"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        Export
                                    </button>
                                    <button
                                        onClick={() => {
                                            const shareUrl = `${window.location.origin}/s/${skill.id}`;
                                            navigator.clipboard.writeText(shareUrl);
                                            setShowMenu(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-[#3a3a3a]"
                                    >
                                        <Share2 className="w-3.5 h-3.5" />
                                        Share Link
                                    </button>
                                    <hr className="my-1 border-[#3a3a3a]" />
                                    <button
                                        onClick={() => {
                                            onDelete(skill.id);
                                            setShowMenu(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-[#3a3a3a]"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                {skill.description || 'No description'}
            </p>

            {/* Footer with Analytics */}
            <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                    <span>{skill.triggers.length} trigger{skill.triggers.length !== 1 ? 's' : ''}</span>
                    {(skill.stats?.view_count ?? 0) >= 0 && (
                        <span className="flex items-center gap-1" title="Total Views">
                            <Eye className="w-3 h-3" />
                            {skill.stats?.view_count}
                        </span>
                    )}
                    {(skill.stats?.download_count ?? 0) >= 0 && (
                        <span className="flex items-center gap-1" title="Total Downloads">
                            <Download className="w-3 h-3" />
                            {skill.stats?.download_count}
                        </span>
                    )}
                </div>
                <span>Updated {formatDate(skill.updated_at)}</span>
            </div>
        </div>
    );
}

