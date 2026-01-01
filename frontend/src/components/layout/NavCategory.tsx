'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NavCategory as NavCategoryType } from '@/lib/constants/navigation';
import { FlagKey } from '@/lib/flags';

interface NavCategoryProps {
    category: NavCategoryType;
    isAdmin: boolean;
    user: any;
    shouldShow: (key: FlagKey) => boolean;
    defaultOpen?: boolean;
}

export function NavCategory({ category, isAdmin, user, shouldShow, defaultOpen = true }: NavCategoryProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(defaultOpen);

    // Check if category-level flag exists and is enabled
    if (category.featureFlag && !shouldShow(category.featureFlag as FlagKey)) {
        return null;
    }

    // Filter items based on feature flags and auth requirements
    const visibleItems = category.items.filter(item => {
        if (item.featureFlag && !shouldShow(item.featureFlag as FlagKey)) return false;
        if (item.requiresAuth && !user) return false;
        return true;
    });

    // Don't render category if no visible items
    if (visibleItems.length === 0) return null;

    // Check if any item in this category is active
    const hasActiveItem = visibleItems.some(item =>
        pathname === item.href || pathname?.startsWith(item.href + '/')
    );

    return (
        <div className="mb-2">
            {/* Category Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors",
                    hasActiveItem ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
            >
                <span>{category.label}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-4 h-4" />
                </motion.div>
            </button>

            {/* Category Items with Animation */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                    >
                        <nav className="mt-1 space-y-0.5">
                            {visibleItems.map((item, index) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.03, duration: 0.15 }}
                                    >
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                                                isActive
                                                    ? "text-primary bg-primary/10"
                                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                            )}
                                        >
                                            {Icon ? <Icon className="w-4 h-4" /> : <span className="w-4 h-4" />}
                                            {item.label}
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

