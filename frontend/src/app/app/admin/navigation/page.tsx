'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/layout/Shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch'; // Assuming we have or use Checkbox
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigation } from '@/components/providers/NavigationProvider';
import { NavCategory, NavItem } from '@/lib/constants/navigation';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowLeft, Save, Loader2, GripVertical, Plus, Trash2, RotateCcw, Edit2 } from 'lucide-react';

// Sortable Item Component
function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="mb-2">
            <div className="flex items-center gap-2 bg-card border border-border p-3 rounded-md shadow-sm">
                <div {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground">
                    <GripVertical className="w-5 h-5" />
                </div>
                {children}
            </div>
        </div>
    );
}

export default function AdminNavigationPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { categories: globalCategories, updateCategories, resetToDefault, isLoading } = useNavigation();

    // Local state for editing
    const [categories, setCategories] = useState<NavCategory[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    // Sync with global state on load
    useEffect(() => {
        if (globalCategories.length > 0) {
            setCategories(JSON.parse(JSON.stringify(globalCategories))); // Deep copy
            if (!selectedCategoryId && globalCategories.length > 0) {
                // Select first category by default
                setSelectedCategoryId(globalCategories[0].id);
            }
        }
    }, [globalCategories, isLoading]);

    // Admin check
    useEffect(() => {
        if (!loading && user) {
            const isAdmin = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
                .toLowerCase()
                .includes((user.email || '').toLowerCase());
            if (!isAdmin) router.push('/app');
        } else if (!loading && !user) {
            router.push('/');
        }
    }, [loading, user, router]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Handlers
    const handleDragEndCategories = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setCategories((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleDragEndItems = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!selectedCategoryId) return;

        if (active.id !== over?.id) {
            setCategories((cats) => {
                const newCats = [...cats];
                const catIndex = newCats.findIndex(c => c.id === selectedCategoryId);
                if (catIndex === -1) return cats;

                const items = newCats[catIndex].items;
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over?.id);

                newCats[catIndex].items = arrayMove(items, oldIndex, newIndex);
                return newCats;
            });
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        await updateCategories(categories);
        setIsSaving(false);
    };

    const handleReset = async () => {
        if (confirm('Are you sure you want to reset navigation to defaults? This cannot be undone.')) {
            setIsResetting(true);
            await resetToDefault();
            setIsResetting(false);
        }
    };

    const updateCategoryLabel = (id: string, label: string) => {
        setCategories(cats => cats.map(c => c.id === id ? { ...c, label } : c));
    };

    const updateItem = (catId: string, itemId: string, field: keyof NavItem, value: any) => {
        setCategories(cats => cats.map(c => {
            if (c.id !== catId) return c;
            return {
                ...c,
                items: c.items.map(i => i.id === itemId ? { ...i, [field]: value } : i)
            };
        }));
    };

    const selectedCategory = categories.find(c => c.id === selectedCategoryId);

    if (loading || isLoading) {
        return (
            <Shell><div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div></Shell>
        );
    }

    return (
        <Shell title="Navigation Editor">
            <div className="max-w-6xl mx-auto pb-20">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/app/admin">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-primary">Navigation Editor</h1>
                            <p className="text-muted-foreground">Drag and drop to reorder categories and items</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleReset} disabled={isResetting}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset Defaults
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Changes
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Categories List */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold">Categories</h2>
                            {/* Add Category Button could go here */}
                        </div>

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEndCategories}
                        >
                            <SortableContext
                                items={categories.map(c => c.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <SortableItem key={category.id} id={category.id}>
                                            <div
                                                className={`flex-1 flex items-center justify-between cursor-pointer ${selectedCategoryId === category.id ? 'text-primary font-medium' : ''}`}
                                                onClick={() => setSelectedCategoryId(category.id)}
                                            >
                                                <span>{category.label}</span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                    <Edit2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </SortableItem>
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>

                    {/* Right: Selected Category Items */}
                    <div className="lg:col-span-2">
                        <Card className="p-6">
                            {selectedCategory ? (
                                <div className="space-y-6">
                                    <div className="border-b border-border pb-4 mb-4">
                                        <label className="text-sm font-medium mb-1 block">Category Label</label>
                                        <div className="flex gap-4">
                                            <Input
                                                value={selectedCategory.label}
                                                onChange={(e) => updateCategoryLabel(selectedCategory.id, e.target.value)}
                                                className="max-w-xs"
                                            />
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground uppercase">ID: {selectedCategory.id}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-md font-semibold mb-4">Menu Items</h3>
                                        <DndContext
                                            sensors={sensors}
                                            collisionDetection={closestCenter}
                                            onDragEnd={handleDragEndItems}
                                        >
                                            <SortableContext
                                                items={selectedCategory.items.map(i => i.id)}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                <div className="space-y-3">
                                                    {selectedCategory.items.map((item) => (
                                                        <SortableItem key={item.id} id={item.id}>
                                                            <div className="flex-1 grid grid-cols-2 gap-4 items-center">
                                                                <Input
                                                                    value={item.label}
                                                                    onChange={(e) => updateItem(selectedCategory.id, item.id, 'label', e.target.value)}
                                                                    className="h-8"
                                                                />
                                                                <Input
                                                                    value={item.href}
                                                                    onChange={(e) => updateItem(selectedCategory.id, item.id, 'href', e.target.value)}
                                                                    className="h-8 font-mono text-xs text-muted-foreground"
                                                                />
                                                            </div>
                                                        </SortableItem>
                                                    ))}
                                                    {selectedCategory.items.length === 0 && (
                                                        <p className="text-muted-foreground italic text-sm">No items in this category.</p>
                                                    )}
                                                </div>
                                            </SortableContext>
                                        </DndContext>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-10 text-muted-foreground">
                                    Select a category to edit items
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </Shell>
    );
}
