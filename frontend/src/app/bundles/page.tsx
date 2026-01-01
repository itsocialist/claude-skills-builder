'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shell } from '@/components/layout/Shell'
import { Download, Package, Sparkles, Search, FileText, BarChart3, Rocket, ChevronDown, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MarkdownOutput } from '@/components/MarkdownOutput'
import { cn } from '@/lib/utils'
import { saveAs } from 'file-saver'
import { toast } from 'sonner'

interface Bundle {
    id: string
    name: string
    tagline: string
    icon: React.ReactNode
    color: string
    skills: string[]
    outputExample: string
    outputType: string
}

const bundles: Bundle[] = [
    {
        id: 'research-studio',
        name: 'Research Studio',
        tagline: 'Turn hours of research into actionable insights in minutes',
        icon: <Search className="w-8 h-8" />,
        color: 'from-blue-500/20 to-cyan-500/20',
        skills: ['Competitor Analysis Framework', 'CMA Report Generator', 'Meeting Notes to Action Items'],
        outputExample: `## Competitive Analysis: [Your Industry]

### Market Position Matrix
| Company | Pricing | Features | Market Share |
|---------|---------|----------|--------------|
| You     | $$$     | ★★★★☆   | 15%          |
| Comp A  | $$      | ★★★☆☆   | 35%          |
| Comp B  | $$$$    | ★★★★★   | 25%          |

### Key Opportunities
1. **Price positioning gap** between Comp A and B
2. **Feature parity** achievable in Q2
3. **Underserved segment**: SMB market

### Recommended Actions
- Launch mid-tier pricing within 30 days
- Develop 3 differentiating features
- Target SMB with focused campaign`,
        outputType: 'Strategic Report'
    },
    {
        id: 'content-engine',
        name: 'Content Engine',
        tagline: 'Create a month of content in a single afternoon',
        icon: <FileText className="w-8 h-8" />,
        color: 'from-purple-500/20 to-pink-500/20',
        skills: ['Social Media Content Calendar', 'Blog Post Optimizer', 'Email Campaign Writer', 'Brand Voice Guide Creator'],
        outputExample: `## Week 1 Content Calendar

### Monday - LinkedIn
**Type:** Carousel (5 slides)
**Topic:** "5 Mistakes Killing Your Conversion Rate"
**CTA:** Download our free audit checklist
**Best time:** 8:00 AM

### Tuesday - Twitter/X
**Thread (7 tweets)**
"Here's what 6 months of A/B testing taught us about landing pages..."

### Wednesday - Instagram
**Reel (30 sec)**
Behind-the-scenes: How we increased signups by 47%

### Thursday - Email
**Subject:** The one metric you're probably ignoring
**Preview:** It's not what you think...`,
        outputType: 'Content Calendar'
    },
    {
        id: 'data-analyst',
        name: 'Data Analyst',
        tagline: 'Transform raw data into clear, actionable dashboards',
        icon: <BarChart3 className="w-8 h-8" />,
        color: 'from-green-500/20 to-emerald-500/20',
        skills: ['Code Review Assistant', 'API Documentation Writer', 'Competitor Analysis Framework'],
        outputExample: `## Q4 Performance Dashboard

### Revenue Metrics
📈 **MRR:** $127,450 (+12% MoM)
📊 **ARR Run Rate:** $1.53M
💰 **ARPU:** $89 (+$7 from Q3)

### User Acquisition
| Channel    | Users  | CAC    | LTV/CAC |
|------------|--------|--------|---------|
| Organic    | 1,247  | $0     | ∞       |
| Paid       | 892    | $45    | 4.2x    |
| Referral   | 445    | $12    | 8.1x    |

### Churn Analysis
- **Monthly churn:** 3.2% (down from 4.1%)
- **Primary driver:** Feature gaps (42%)
- **At-risk accounts:** 23 flagged`,
        outputType: 'Analytics Dashboard'
    },
    {
        id: 'project-kickstart',
        name: 'Project Kickstart',
        tagline: 'Go from idea to execution-ready in one session',
        icon: <Rocket className="w-8 h-8" />,
        color: 'from-orange-500/20 to-red-500/20',
        skills: ['Business Proposal Writer', 'Meeting Notes to Action Items', 'Case Study Writer', 'Product Description Writer'],
        outputExample: `## Project: [Your Next Big Thing]

### Executive Summary
Launch a targeted MVP in 6 weeks that validates our core hypothesis with minimal resource investment.

### Sprint Breakdown
**Week 1-2:** Discovery & Design
- User interviews (10 target customers)
- Competitive audit
- MVP feature set definition

**Week 3-4:** Build Phase
- Core functionality development
- Integration with existing systems
- Internal testing

**Week 5-6:** Launch Prep
- Beta user onboarding
- Feedback collection system
- Success metrics dashboard

### Resource Allocation
| Role        | Hours/Week | Duration |
|-------------|------------|----------|
| Product     | 20         | 6 weeks  |
| Engineering | 40         | 4 weeks  |
| Design      | 15         | 3 weeks  |`,
        outputType: 'Project Brief'
    }
]

export default function PowerBundlesPage() {
    const [expandedBundle, setExpandedBundle] = useState<string | null>(null)

    const handleDownload = async (bundle: Bundle) => {
        const toastId = toast.loading(`Preparing ${bundle.name} bundle...`);
        try {
            // Use server API to bypass RLS
            const response = await fetch('/api/bundles/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bundleName: bundle.name,
                    skillNames: bundle.skills,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate bundle');
            }

            const blob = await response.blob();
            const slugName = bundle.name.toLowerCase().replace(/\s+/g, '-');
            saveAs(blob, `${slugName}.skill`);
            toast.success(`${bundle.name} bundle ready!`, { id: toastId });
        } catch (error: any) {
            console.error('Bundle download failed:', error);
            toast.error(error.message || 'Failed to generate bundle', { id: toastId });
        }
    }

    return (
        <Shell title="Power Bundles">
            <div className="container mx-auto py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Package className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-bold text-foreground">Power Bundles</h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl">
                        Curated skill collections designed for specific outcomes.
                        Get multiple skills working together in one download.
                    </p>
                </div>

                {/* Bundles Grid */}
                <div className="py-8">
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {bundles.map((bundle) => (
                            <Card
                                key={bundle.id}
                                className={cn(
                                    "overflow-hidden transition-all duration-300",
                                    expandedBundle === bundle.id && "ring-2 ring-primary"
                                )}
                            >
                                {/* Bundle Header */}
                                <div className="p-5 border-b border-border">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                {bundle.icon}
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-foreground">{bundle.name}</h2>
                                                <p className="text-sm text-muted-foreground">{bundle.tagline}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                                            {bundle.skills.length} skills
                                        </span>
                                    </div>
                                </div>

                                {/* Skills List */}
                                <div className="p-4 border-b border-border">
                                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                                        Included Skills
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {bundle.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="text-xs bg-muted px-2 py-1 rounded flex items-center gap-1"
                                            >
                                                <Check className="w-3 h-3 text-green-500" />
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Output Preview Toggle */}
                                <button
                                    onClick={() => setExpandedBundle(expandedBundle === bundle.id ? null : bundle.id)}
                                    className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-medium text-foreground">
                                            See Example {bundle.outputType}
                                        </span>
                                    </div>
                                    <ChevronDown
                                        className={cn(
                                            "w-5 h-5 text-muted-foreground transition-transform",
                                            expandedBundle === bundle.id && "rotate-180"
                                        )}
                                    />
                                </button>

                                {/* Expanded Output Example */}
                                {expandedBundle === bundle.id && (
                                    <div className="p-4 bg-muted/30 border-t border-border">
                                        <div className="bundle-output-preview bg-card rounded-lg p-6 overflow-x-auto">
                                            <MarkdownOutput content={bundle.outputExample} />
                                        </div>
                                    </div>
                                )}

                                {/* CTA */}
                                <div className="p-4 bg-card">
                                    <Button
                                        className="w-full gap-2"
                                        size="lg"
                                        onClick={() => handleDownload(bundle)}
                                    >
                                        <Download className="w-4 h-4" />
                                        Get This Bundle
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-12 text-center">
                        <p className="text-muted-foreground mb-4">
                            Want to create your own bundle? Build custom skills and package them together.
                        </p>
                        <Link href="/app/packages/new">
                            <Button variant="outline" className="gap-2">
                                <Sparkles className="w-4 h-4" />
                                Build Your Own
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Shell>
    )
}
