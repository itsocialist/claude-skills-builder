'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { User, LogOut, Library, ChevronDown, Users } from 'lucide-react';
import Link from 'next/link';

export function UserMenu() {
    const { user, signOut, loading, isConfigured } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (loading) {
        return (
            <div className="w-8 h-8 rounded-full bg-[#2a2a2a] animate-pulse" />
        );
    }

    if (!isConfigured || !user) {
        return null;
    }

    const displayName = user.email?.split('@')[0] || 'User';

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] transition-colors"
            >
                <div className="w-6 h-6 rounded-full bg-[#C15F3C] flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm text-gray-300 max-w-[120px] truncate">
                    {displayName}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg shadow-xl py-1 z-50">
                    <div className="px-3 py-2 border-b border-[#3a3a3a]">
                        <p className="text-sm text-white truncate">{user.email}</p>
                    </div>

                    <Link
                        href="/app/library"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-[#3a3a3a] transition-colors"
                    >
                        <Library className="w-4 h-4" />
                        My Library
                    </Link>

                    <Link
                        href="/app/settings/team"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-[#3a3a3a] transition-colors"
                    >
                        <Users className="w-4 h-4" />
                        Team Settings
                    </Link>

                    <button
                        onClick={() => {
                            signOut();
                            setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-[#3a3a3a] transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
}
