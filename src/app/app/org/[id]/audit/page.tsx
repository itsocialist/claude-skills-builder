'use client';

import { use } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card } from '@/components/ui/card';
import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AuditLogPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);

    return (
        <Shell title="Audit Log">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href="/app/org">
                        <Button variant="ghost" className="pl-0 gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Organizations
                        </Button>
                    </Link>
                </div>

                <h1 className="text-3xl font-bold text-foreground mb-2">Audit Log</h1>
                <p className="text-muted-foreground mb-8">View activity within your organization.</p>

                <Card className="p-12 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon</h3>
                    <p className="text-muted-foreground">
                        Audit logging is currently being implemented. Check back later.
                    </p>
                </Card>
            </div>
        </Shell>
    );
}
