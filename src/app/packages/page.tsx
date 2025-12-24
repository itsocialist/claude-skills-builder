'use client';

import Link from 'next/link';
import { Shell } from '@/components/layout/Shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Plus } from 'lucide-react';

export default function PackagesPage() {
    // TODO: Load saved packages from store/database
    const packages: any[] = [];

    return (
        <Shell title="Packages">
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Skill Packages</h1>
                        <p className="text-muted-foreground">Bundle multiple skills into a single uploadable package.</p>
                    </div>
                    <Link href="/packages/new">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Package
                        </Button>
                    </Link>
                </div>

                {packages.length === 0 ? (
                    <Card className="p-12 text-center border-border">
                        <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No packages yet</h3>
                        <p className="text-muted-foreground mb-4">
                            Create your first skill package to bundle multiple skills together.
                        </p>
                        <Link href="/packages/new">
                            <Button>Create Package</Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packages.map((pkg) => (
                            <Card key={pkg.id} className="p-5 border-border">
                                <h3 className="text-lg font-bold text-foreground mb-1">{pkg.name}</h3>
                                <p className="text-sm text-muted-foreground mb-3">{pkg.description}</p>
                                <p className="text-xs text-muted-foreground">
                                    {pkg.skills.length} skills
                                </p>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </Shell>
    );
}
