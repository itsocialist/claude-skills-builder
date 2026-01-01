'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TemplateCard } from '@/components/ui/template-card';
import { TemplateDetailSheet } from '@/components/ui/template-detail-sheet';
import { getTemplates } from '@/lib/api/templateApi';
import { Template } from '@/types/skill.types';
import { Shell } from '@/components/layout/Shell';
import { Search, X } from 'lucide-react';
import { Card } from '@/components/ui/card';

const CATEGORIES = ['All', 'Real Estate', 'Business', 'Finance', 'Product', 'Marketing', 'Sales'];

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Sheet state for pop-out details
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const data = await getTemplates();
                setTemplates(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

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

    const handleTemplateClick = (template: Template) => {
        setSelectedTemplate(template);
        setSheetOpen(true);
    };

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
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${selectedCategory === category
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <p className="text-sm text-muted-foreground mb-4">
                    {loading ? 'Loading templates...' : `${filteredTemplates.length} template${filteredTemplates.length !== 1 ? 's' : ''} found`}
                </p>

                {/* Templates Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card key={i} className="h-[200px] animate-pulse bg-card/50" />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTemplates.map((template) => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                variant="default"
                                onClick={() => handleTemplateClick(template)}
                            />
                        ))}
                    </div>
                )}

                {!loading && filteredTemplates.length === 0 && (
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

            {/* Template Details Sheet */}
            <TemplateDetailSheet
                template={selectedTemplate}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
            />
        </Shell >
    );
}
