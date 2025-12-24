'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${selectedCategory === category
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
                                    }`}
                            >
                                {category}
                            </button>
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
                        <Card key={template.id} className="flex flex-col p-5 hover:shadow-lg transition-shadow border-border">
                            <div className="mb-2">
                                <span className="inline-block px-2 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full mb-1">
                                    {template.category}
                                </span>
                                <h3 className="text-xl font-bold text-foreground">{template.name}</h3>
                            </div>

                            <p className="text-muted-foreground mb-4 flex-grow text-sm">
                                {template.description}
                            </p>

                            <div className="pt-3 border-t border-border mt-auto">
                                <Link href={`/templates/${template.id}`} className="block w-full">
                                    <Button variant="outline" className="w-full">
                                        View Details
                                    </Button>
                                </Link>
                                <Link href={`/builder?template=${template.id}`} className="block w-full mt-2">
                                    <Button className="w-full">
                                        Use Template
                                    </Button>
                                </Link>
                            </div>
                        </Card>
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


