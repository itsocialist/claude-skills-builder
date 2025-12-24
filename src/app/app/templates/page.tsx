'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TemplateCard } from '@/components/ui/template-card';
import { getAllTemplates } from '@/lib/templates';
import { Shell } from '@/components/layout/Shell';
import { Search, X } from 'lucide-react';

const CATEGORIES = ['All', 'Real Estate', 'Business', 'Finance', 'Product', 'Marketing', 'Sales'];

export default function TemplatesPage() {
    const templates = getAllTemplates();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredTemplates = useMemo(() => {
        return templates.filter((template) => {
            const matchesSearch = searchQuery === '' ||
                template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesCategory = selectedCategory === 'All' ||
                template.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [templates, searchQuery, selectedCategory]);

    return (
        <Shell title="Templates">
            <div className="container mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Skill Templates</h1>
                    <p className="text-muted-foreground">Choose a template to jumpstart your Claude Skill creation.</p>
                </div>

                {/* Search & Filter */}
                <div className="mb-6 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search templates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-muted"
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setSelectedCategory(category)}
                                className="rounded-full"
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <p className="text-sm text-muted-foreground mb-4">
                    {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
                </p>

                {/* Templates Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template) => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            variant="default"
                        />
                    ))}
                </div>

                {filteredTemplates.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No templates match your search.</p>
                        <Button
                            variant="ghost"
                            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                            className="mt-2"
                        >
                            Clear filters
                        </Button>
                    </div>
                )}
            </div>
        </Shell>
    );
}


