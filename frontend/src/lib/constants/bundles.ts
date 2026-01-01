import { Search, FileText, BarChart3, Rocket } from 'lucide-react';

export interface Bundle {
    id: string;
    name: string;
    tagline: string;
    description?: string;
    iconName: 'Search' | 'FileText' | 'BarChart3' | 'Rocket';
    color: string;
    skills: string[];
    outputExample: string;
    outputType: string;
    category: string;
}

export const bundles: Bundle[] = [
    {
        id: 'research-studio',
        name: 'Research Studio',
        tagline: 'Turn hours of research into actionable insights in minutes',
        iconName: 'Search',
        color: 'from-blue-500/20 to-cyan-500/20',
        skills: ['Competitor Analysis Framework', 'CMA Report Generator', 'Meeting Notes to Action Items'],
        category: 'Business',
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
        iconName: 'FileText',
        color: 'from-purple-500/20 to-pink-500/20',
        skills: ['Social Media Content Calendar', 'Blog Post Optimizer', 'Email Campaign Writer', 'Brand Voice Guide Creator'],
        category: 'Marketing',
        outputExample: `## Week 1 Content Calendar

### Monday - LinkedIn
**Type:** Carousel (5 slides)
**Topic:** "5 Mistakes Killing Your Conversion Rate"
**CTA:** Download our free audit checklist
**Best time:** 8:00 AM

### Tuesday - Twitter/X
**Thread (7 tweets)**
**Topic:** "Here's what 6 months of A/B testing taught us about landing pages..."

### Wednesday - Instagram
**Reel (30 sec)**
**Topic:** Behind-the-scenes: How we increased signups by 47%

### Thursday - Email
**Subject:** The one metric you're probably ignoring
**Preview:** It's not what you think...`,
        outputType: 'Content Calendar'
    },
    {
        id: 'data-analyst',
        name: 'Data Analyst',
        tagline: 'Transform raw data into clear, actionable dashboards',
        iconName: 'BarChart3',
        color: 'from-green-500/20 to-emerald-500/20',
        skills: ['Code Review Assistant', 'API Documentation Writer', 'Competitor Analysis Framework'],
        category: 'Technical',
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
        iconName: 'Rocket',
        color: 'from-orange-500/20 to-red-500/20',
        skills: ['Business Proposal Writer', 'Meeting Notes to Action Items', 'Case Study Writer', 'Product Description Writer'],
        category: 'Business',
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
];
