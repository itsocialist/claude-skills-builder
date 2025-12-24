'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAllTemplates } from '@/lib/templates';
import { Shell } from '@/components/layout/Shell';

export default function TemplatesPage() {
    const templates = getAllTemplates();

    return (
        <Shell>
            <div className="container mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Skill Templates</h1>
                    <p className="text-gray-600">Choose a template to jumpstart your Claude Skill creation.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => (
                        <Card key={template.id} className="flex flex-col p-6 hover:shadow-lg transition-shadow border-gray-200">
                            <div className="mb-4">
                                <span className="inline-block px-2 py-1 text-xs font-semibold text-primary/80 bg-primary/10 rounded-full mb-2">
                                    {template.category}
                                </span>
                                <h3 className="text-xl font-bold text-gray-900">{template.name}</h3>
                            </div>

                            <p className="text-gray-600 mb-6 flex-grow text-sm">
                                {template.description}
                            </p>

                            <div className="pt-4 border-t border-gray-100 mt-auto">
                                <Link href={`/templates/${template.id}`} className="block w-full">
                                    <Button className="w-full bg-white text-primary border border-primary hover:bg-primary/5">
                                        View Details
                                    </Button>
                                </Link>
                                <Link href={`/builder?template=${template.id}`} className="block w-full mt-2">
                                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                                        Use Template
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </Shell>
    );
}
