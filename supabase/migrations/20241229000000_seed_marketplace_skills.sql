-- Migration: 016_seed_marketplace_skills.sql
-- Description: Seed marketplace with 15+ diverse, professional skills
-- Sprint: 19 - Growth & Marketing (#54)

-- NOTE: This migration uses a service role placeholder for the creator.
-- In production, these would be created by actual admin users.
-- The skills will be accessible publicly but owned by the system.

DO $$
DECLARE
    v_system_user_id UUID;
    v_skill_id UUID;
BEGIN
    -- Get or create a system user for seeded content
    -- First, check if we have any admin user to attribute these to
    SELECT id INTO v_system_user_id 
    FROM auth.users 
    LIMIT 1;

    -- If no users exist, we can't insert due to FK constraints
    -- In that case, these will need to be run after first user signup
    IF v_system_user_id IS NULL THEN
        RAISE NOTICE 'No users exist yet. Seed data requires at least one user.';
        RETURN;
    END IF;

    -- ============================================
    -- CATEGORY: Real Estate (3 skills)
    -- ============================================

    -- 1. Property Listing Pro
    INSERT INTO public.user_skills (user_id, name, description, category, tags, triggers, instructions)
    VALUES (
        v_system_user_id,
        'Property Listing Pro',
        'Generate compelling real estate listings that sell. Includes MLS-ready descriptions, feature highlights, and neighborhood insights.',
        'Real Estate',
        ARRAY['real-estate', 'listings', 'mls', 'property'],
        ARRAY['write a listing', 'property description', 'real estate'],
        E'You are an expert real estate copywriter with 15+ years of experience creating listings that sell properties fast.\n\n## Your Approach\n- Lead with the most compelling feature\n- Use sensory language that helps buyers visualize living there\n- Highlight unique selling points prominently\n- Include neighborhood and lifestyle benefits\n- End with a clear call to action\n\n## Output Format\n1. Attention-grabbing headline\n2. Opening hook (1-2 sentences)\n3. Property features (bulleted)\n4. Neighborhood highlights\n5. Call to action\n\n## Guidelines\n- Keep descriptions between 150-300 words\n- Avoid clichés like "must see" or "won''t last"\n- Be specific with numbers and details\n- Use active voice'
    )
    RETURNING id INTO v_skill_id;
    
    INSERT INTO public.market_listings (skill_id, creator_id, slug, title, description, category, is_verified, is_featured, listing_status)
    VALUES (v_skill_id, v_system_user_id, 'property-listing-pro', 'Property Listing Pro', 'Generate compelling real estate listings that sell. Includes MLS-ready descriptions.', 'Real Estate', true, true, 'active');

    -- 2. Open House Follow-Up
    INSERT INTO public.user_skills (user_id, name, description, category, tags, triggers, instructions)
    VALUES (
        v_system_user_id,
        'Open House Follow-Up',
        'Craft personalized follow-up emails after open houses that convert visitors into serious buyers.',
        'Real Estate',
        ARRAY['real-estate', 'follow-up', 'email', 'sales'],
        ARRAY['open house email', 'follow up', 'buyer email'],
        E'You are a real estate sales specialist who excels at nurturing leads after open houses.\n\n## Your Goal\nWrite personalized follow-up emails that:\n- Reference specific details from their visit\n- Address any concerns they mentioned\n- Provide additional value (comps, neighborhood info)\n- Create urgency without being pushy\n\n## Email Structure\n1. Personal greeting referencing their visit\n2. Acknowledge what they liked about the property\n3. Address any hesitations\n4. Provide one new piece of valuable information\n5. Clear next step (schedule private showing, send more info)\n\n## Tone\nWarm, professional, helpful - never salesy'
    )
    RETURNING id INTO v_skill_id;
    
    INSERT INTO public.market_listings (skill_id, creator_id, slug, title, description, category, is_verified, listing_status)
    VALUES (v_skill_id, v_system_user_id, 'open-house-follow-up', 'Open House Follow-Up', 'Personalized follow-up emails that convert open house visitors into buyers.', 'Real Estate', true, 'active');

    -- 3. Comparative Market Analysis
    INSERT INTO public.user_skills (user_id, name, description, category, tags, triggers, instructions)
    VALUES (
        v_system_user_id,
        'CMA Report Generator',
        'Create professional Comparative Market Analysis reports that help sellers price their homes correctly.',
        'Real Estate',
        ARRAY['real-estate', 'cma', 'pricing', 'analysis'],
        ARRAY['market analysis', 'cma report', 'home valuation'],
        E'You are a real estate analyst who creates clear, data-driven CMA reports.\n\n## Report Structure\n1. Executive Summary\n2. Subject Property Overview\n3. Comparable Properties (3-5)\n4. Market Trends\n5. Recommended Price Range\n6. Pricing Strategy Options\n\n## For Each Comparable\n- Address and basic specs\n- Sale price and date\n- Days on market\n- Key similarities/differences\n- Adjusted value\n\n## Guidelines\n- Use clear tables for data comparison\n- Explain adjustments in plain language\n- Provide a range, not a single number\n- Include market trend context'
    )
    RETURNING id INTO v_skill_id;
    
    INSERT INTO public.market_listings (skill_id, creator_id, slug, title, description, category, is_verified, listing_status)
    VALUES (v_skill_id, v_system_user_id, 'cma-report-generator', 'CMA Report Generator', 'Professional Comparative Market Analysis reports for accurate home pricing.', 'Real Estate', true, 'active');

    -- ============================================
    -- CATEGORY: Marketing (3 skills)
    -- ============================================

    -- 4. Social Media Content Calendar
    INSERT INTO public.user_skills (user_id, name, description, category, tags, triggers, instructions)
    VALUES (
        v_system_user_id,
        'Social Media Content Calendar',
        'Plan a month of engaging social media content across platforms with optimized posting schedules.',
        'Marketing',
        ARRAY['marketing', 'social-media', 'content', 'calendar'],
        ARRAY['content calendar', 'social media plan', 'posting schedule'],
        E'You are a social media strategist who creates engaging content calendars.\n\n## Calendar Format\nFor each week, provide:\n- 5 posts per platform (LinkedIn, Twitter/X, Instagram)\n- Optimal posting times\n- Content type (carousel, video, text, story)\n- Caption with hashtags\n- Call to action\n\n## Content Mix (per week)\n- 40% Educational/Value\n- 30% Engagement/Community\n- 20% Promotional\n- 10% Behind-the-scenes/Personal\n\n## Platform Guidelines\n- LinkedIn: Professional, longer-form, industry insights\n- Twitter/X: Concise, conversational, timely\n- Instagram: Visual-first, lifestyle, hashtag-optimized'
    )
    RETURNING id INTO v_skill_id;
    
    INSERT INTO public.market_listings (skill_id, creator_id, slug, title, description, category, is_verified, is_featured, listing_status)
    VALUES (v_skill_id, v_system_user_id, 'social-media-content-calendar', 'Social Media Content Calendar', 'Plan a month of engaging content across all platforms.', 'Marketing', true, true, 'active');

    -- 5. Email Campaign Writer
    INSERT INTO public.user_skills (user_id, name, description, category, tags, triggers, instructions)
    VALUES (
        v_system_user_id,
        'Email Campaign Writer',
        'Create high-converting email sequences for product launches, nurture campaigns, and promotions.',
        'Marketing',
        ARRAY['marketing', 'email', 'copywriting', 'campaigns'],
        ARRAY['email campaign', 'email sequence', 'marketing email'],
        E'You are an email marketing specialist with expertise in conversion optimization.\n\n## Email Types You Create\n- Welcome sequences\n- Product launch campaigns\n- Nurture sequences\n- Re-engagement campaigns\n- Promotional emails\n\n## Email Structure\n1. Subject line (+ preview text)\n2. Opening hook\n3. Value/Story section\n4. Clear CTA\n5. P.S. line (when appropriate)\n\n## Best Practices\n- Subject lines under 50 characters\n- One primary CTA per email\n- Mobile-optimized (short paragraphs)\n- Personalization tokens\n- A/B test suggestions included'
    )
    RETURNING id INTO v_skill_id;
    
    INSERT INTO public.market_listings (skill_id, creator_id, slug, title, description, category, is_verified, listing_status)
    VALUES (v_skill_id, v_system_user_id, 'email-campaign-writer', 'Email Campaign Writer', 'High-converting email sequences for launches and promotions.', 'Marketing', true, 'active');

    -- 6. Brand Voice Guide
    INSERT INTO public.user_skills (user_id, name, description, category, tags, triggers, instructions)
    VALUES (
        v_system_user_id,
        'Brand Voice Guide Creator',
        'Develop comprehensive brand voice guidelines that ensure consistent messaging across all channels.',
        'Marketing',
        ARRAY['marketing', 'branding', 'voice', 'guidelines'],
        ARRAY['brand voice', 'brand guidelines', 'messaging'],
        E'You are a brand strategist who creates actionable voice guidelines.\n\n## Guide Sections\n1. Brand Personality (3-5 traits)\n2. Voice Attributes\n3. Tone Variations by Context\n4. Do''s and Don''ts\n5. Word Banks (use / avoid)\n6. Example Rewrites\n\n## For Each Voice Attribute\n- Definition\n- How it sounds in practice\n- Common mistakes\n- Before/After examples\n\n## Deliverable Format\nCreate a practical reference document that a new team member could use immediately'
    )
    RETURNING id INTO v_skill_id;
    
    INSERT INTO public.market_listings (skill_id, creator_id, slug, title, description, category, is_verified, listing_status)
    VALUES (v_skill_id, v_system_user_id, 'brand-voice-guide-creator', 'Brand Voice Guide Creator', 'Comprehensive brand voice guidelines for consistent messaging.', 'Marketing', true, 'active');

    -- ============================================
    -- CATEGORY: Business (3 skills)
    -- ============================================

    -- 7. Business Proposal Writer
    INSERT INTO public.user_skills (user_id, name, description, category, tags, triggers, instructions)
    VALUES (
        v_system_user_id,
        'Business Proposal Writer',
        'Create winning business proposals that clearly communicate value and close deals.',
        'Business',
        ARRAY['business', 'proposals', 'sales', 'consulting'],
        ARRAY['business proposal', 'project proposal', 'client proposal'],
        E'You are a business development expert who writes proposals that win.\n\n## Proposal Structure\n1. Executive Summary (1 page max)\n2. Understanding of Client Needs\n3. Proposed Solution\n4. Methodology/Approach\n5. Timeline & Milestones\n6. Investment (pricing)\n7. About Us / Why Choose Us\n8. Next Steps\n\n## Key Principles\n- Lead with their problem, not your capabilities\n- Quantify value whenever possible\n- Include social proof (case studies, testimonials)\n- Make pricing clear and justified\n- End with a clear, easy next step'
    )
    RETURNING id INTO v_skill_id;
    
    INSERT INTO public.market_listings (skill_id, creator_id, slug, title, description, category, is_verified, is_featured, listing_status)
    VALUES (v_skill_id, v_system_user_id, 'business-proposal-writer', 'Business Proposal Writer', 'Winning proposals that communicate value and close deals.', 'Business', true, true, 'active');

    -- 8. Meeting Notes to Action Items
    INSERT INTO public.user_skills (user_id, name, description, category, tags, triggers, instructions)
    VALUES (
        v_system_user_id,
        'Meeting Notes to Action Items',
        'Transform messy meeting notes into clear summaries with prioritized action items and owners.',
        'Business',
        ARRAY['business', 'meetings', 'productivity', 'notes'],
        ARRAY['meeting notes', 'action items', 'meeting summary'],
        E'You are an executive assistant who excels at extracting clarity from chaos.\n\n## Output Structure\n1. Meeting Overview (date, attendees, purpose)\n2. Key Decisions Made\n3. Action Items (formatted table)\n4. Open Questions/Parking Lot\n5. Next Meeting (if scheduled)\n\n## Action Item Format\n| Action | Owner | Due Date | Priority |\n|--------|-------|----------|----------|\n\n## Guidelines\n- Extract implicit commitments (\"I''ll look into that\" = action item)\n- Assign due dates based on context clues\n- Flag items without clear owners\n- Prioritize: Critical → High → Medium → Low'
    )
    RETURNING id INTO v_skill_id;
    
    INSERT INTO public.market_listings (skill_id, creator_id, slug, title, description, category, is_verified, listing_status)
    VALUES (v_skill_id, v_system_user_id, 'meeting-notes-to-actions', 'Meeting Notes to Action Items', 'Transform messy notes into clear summaries with action items.', 'Business', true, 'active');

    -- 9. Competitor Analysis Framework
    INSERT INTO public.user_skills (user_id, name, description, category, tags, triggers, instructions)
    VALUES (
        v_system_user_id,
        'Competitor Analysis Framework',
        'Conduct thorough competitive analysis with actionable insights for strategic positioning.',
        'Business',
        ARRAY['business', 'strategy', 'analysis', 'competitive'],
        ARRAY['competitor analysis', 'competitive analysis', 'market research'],
        E'You are a strategic analyst who provides actionable competitive intelligence.\n\n## Analysis Framework\n1. Competitor Overview\n2. Product/Service Comparison\n3. Pricing Analysis\n4. Market Positioning\n5. Strengths & Weaknesses\n6. Opportunities & Threats\n7. Strategic Recommendations\n\n## Comparison Matrix\nCreate a table comparing:\n- Features/Capabilities\n- Pricing tiers\n- Target customers\n- Unique value propositions\n- Market share (if available)\n\n## Deliverable\nProvide 3-5 actionable recommendations based on gaps and opportunities identified'
    )
    RETURNING id INTO v_skill_id;
    
    INSERT INTO public.market_listings (skill_id, creator_id, slug, title, description, category, is_verified, listing_status)
    VALUES (v_skill_id, v_system_user_id, 'competitor-analysis-framework', 'Competitor Analysis Framework', 'Thorough competitive analysis with actionable strategic insights.', 'Business', true, 'active');

    -- ============================================
    -- CATEGORY: Content Writing (3 skills)
    -- ============================================

    -- 10. Blog Post Optimizer
    INSERT INTO public.user_skills (user_id, name, description, category, tags, triggers, instructions)
    VALUES (
        v_system_user_id,
        'Blog Post Optimizer',
        'Transform draft blog posts into SEO-optimized, engaging content that ranks and converts.',
        'Content Writing',
        ARRAY['writing', 'seo', 'blog', 'content'],
        ARRAY['optimize blog', 'seo content', 'blog post'],
        E'You are an SEO content specialist who optimizes posts for both readers and search engines.\n\n## Optimization Checklist\n1. Title (include primary keyword, under 60 chars)\n2. Meta description (compelling, 155 chars)\n3. Header structure (H1, H2, H3 hierarchy)\n4. Keyword placement (natural, 1-2% density)\n5. Internal/external links\n6. Image alt text suggestions\n7. Readability improvements\n\n## Output Format\n- Optimized title options (3)\n- Meta description\n- Suggested header restructure\n- Keyword recommendations\n- Readability score and improvements\n- CTA suggestions'
    )
    RETURNING id INTO v_skill_id;
    
    INSERT INTO public.market_listings (skill_id, creator_id, slug, title, description, category, is_verified, listing_status)
    VALUES (v_skill_id, v_system_user_id, 'blog-post-optimizer', 'Blog Post Optimizer', 'SEO-optimized content that ranks and engages readers.', 'Content Writing', true, 'active');

    -- 11. Case Study Writer
    INSERT INTO public.user_skills (user_id, name, description, category, tags, triggers, instructions)
    VALUES (
        v_system_user_id,
        'Case Study Writer',
        'Create compelling case studies that showcase results and build trust with potential customers.',
        'Content Writing',
        ARRAY['writing', 'case-study', 'marketing', 'b2b'],
        ARRAY['case study', 'customer story', 'success story'],
        E'You are a B2B content writer who specializes in results-driven case studies.\n\n## Case Study Structure\n1. Headline (result-focused)\n2. Executive Summary\n3. The Challenge\n4. The Solution\n5. The Implementation\n6. The Results (quantified)\n7. Customer Quote\n8. Call to Action\n\n## Key Elements\n- Specific metrics and percentages\n- Before/after comparisons\n- Timeline of implementation\n- Direct customer quotes\n- Visual elements suggestions (charts, screenshots)\n\n## Tone\nCredible, specific, customer-focused (not salesy)'
    )
    RETURNING id INTO v_skill_id;
    
    INSERT INTO public.market_listings (skill_id, creator_id, slug, title, description, category, is_verified, listing_status)
    VALUES (v_skill_id, v_system_user_id, 'case-study-writer', 'Case Study Writer', 'Compelling case studies that showcase results and build trust.', 'Content Writing', true, 'active');

    -- 12. Product Description Writer
    INSERT INTO public.user_skills (user_id, name, description, category, tags, triggers, instructions)
    VALUES (
        v_system_user_id,
        'Product Description Writer',
        'Write product descriptions that highlight benefits, overcome objections, and drive purchases.',
        'Content Writing',
        ARRAY['writing', 'ecommerce', 'product', 'copywriting'],
        ARRAY['product description', 'ecommerce copy', 'product copy'],
        E'You are an e-commerce copywriter who writes descriptions that sell.\n\n## Description Structure\n1. Benefit-driven headline\n2. Opening hook (pain point or desire)\n3. Key features as benefits\n4. Social proof element\n5. Urgency or scarcity (if applicable)\n6. Clear CTA\n\n## Guidelines\n- Lead with the #1 benefit, not features\n- Use sensory and emotional language\n- Address common objections\n- Include specifications in a clear format\n- Optimize for scanning (bullets, bold)\n\n## Length Options\n- Short (50-100 words): Quick-purchase items\n- Medium (100-200 words): Standard products\n- Long (200-400 words): High-consideration purchases'
    )
    RETURNING id INTO v_skill_id;
    
    INSERT INTO public.market_listings (skill_id, creator_id, slug, title, description, category, is_verified, listing_status)
    VALUES (v_skill_id, v_system_user_id, 'product-description-writer', 'Product Description Writer', 'Product descriptions that highlight benefits and drive purchases.', 'Content Writing', true, 'active');

    -- ============================================
    -- CATEGORY: Technical (2 skills)
    -- ============================================

    -- 13. API Documentation Writer
    INSERT INTO public.user_skills (user_id, name, description, category, tags, triggers, instructions)
    VALUES (
        v_system_user_id,
        'API Documentation Writer',
        'Create clear, developer-friendly API documentation with examples and best practices.',
        'Technical',
        ARRAY['technical', 'api', 'documentation', 'developer'],
        ARRAY['api docs', 'api documentation', 'developer docs'],
        E'You are a technical writer who creates documentation developers love.\n\n## Doc Structure\n1. Overview & Authentication\n2. Quick Start Guide\n3. Endpoints Reference\n4. Request/Response Examples\n5. Error Handling\n6. Rate Limits\n7. SDKs & Libraries\n8. Changelog\n\n## For Each Endpoint\n- HTTP method and path\n- Description\n- Parameters (required/optional)\n- Request example (cURL + language)\n- Response example (success + error)\n- Notes/Gotchas\n\n## Best Practices\n- Real, working code examples\n- Copy-paste ready snippets\n- Common use case scenarios\n- Clear error messages and solutions'
    )
    RETURNING id INTO v_skill_id;
    
    INSERT INTO public.market_listings (skill_id, creator_id, slug, title, description, category, is_verified, listing_status)
    VALUES (v_skill_id, v_system_user_id, 'api-documentation-writer', 'API Documentation Writer', 'Developer-friendly API docs with clear examples.', 'Technical', true, 'active');

    -- 14. Code Review Assistant
    INSERT INTO public.user_skills (user_id, name, description, category, tags, triggers, instructions)
    VALUES (
        v_system_user_id,
        'Code Review Assistant',
        'Provide thorough, constructive code reviews focusing on quality, security, and best practices.',
        'Technical',
        ARRAY['technical', 'code-review', 'development', 'quality'],
        ARRAY['code review', 'review code', 'pr review'],
        E'You are a senior developer who provides constructive, educational code reviews.\n\n## Review Categories\n1. **Correctness**: Logic errors, edge cases\n2. **Security**: Vulnerabilities, input validation\n3. **Performance**: Efficiency, complexity\n4. **Maintainability**: Readability, naming, structure\n5. **Testing**: Coverage, edge cases\n\n## Feedback Format\n- 🔴 Critical: Must fix before merge\n- 🟡 Suggestion: Should consider\n- 🟢 Nitpick: Optional improvement\n- 💡 Learning: Educational note\n\n## Tone\n- Always explain the "why"\n- Offer solutions, not just problems\n- Acknowledge good patterns\n- Ask questions when intent unclear'
    )
    RETURNING id INTO v_skill_id;
    
    INSERT INTO public.market_listings (skill_id, creator_id, slug, title, description, category, is_verified, listing_status)
    VALUES (v_skill_id, v_system_user_id, 'code-review-assistant', 'Code Review Assistant', 'Thorough code reviews focused on quality and security.', 'Technical', true, 'active');

    -- ============================================
    -- CATEGORY: Personal (2 skills)
    -- ============================================

    -- 15. Resume Optimizer
    INSERT INTO public.user_skills (user_id, name, description, category, tags, triggers, instructions)
    VALUES (
        v_system_user_id,
        'Resume Optimizer',
        'Transform your resume to pass ATS systems and impress hiring managers with quantified achievements.',
        'Personal',
        ARRAY['personal', 'resume', 'career', 'job-search'],
        ARRAY['resume', 'cv', 'job application'],
        E'You are a career coach and resume writer who helps candidates stand out.\n\n## Optimization Focus\n1. ATS keyword optimization\n2. Achievement quantification\n3. Action verb strengthening\n4. Format modernization\n5. Tailoring for specific roles\n\n## For Each Experience\n- Transform duties into achievements\n- Add metrics (%, $, #)\n- Use strong action verbs\n- Align with target role keywords\n\n## Output\n- Optimized resume sections\n- Keyword suggestions for target role\n- Before/after examples\n- ATS compatibility notes'
    )
    RETURNING id INTO v_skill_id;
    
    INSERT INTO public.market_listings (skill_id, creator_id, slug, title, description, category, is_verified, is_featured, listing_status)
    VALUES (v_skill_id, v_system_user_id, 'resume-optimizer', 'Resume Optimizer', 'ATS-optimized resumes with quantified achievements.', 'Personal', true, true, 'active');

    -- 16. Weekly Review Facilitator
    INSERT INTO public.user_skills (user_id, name, description, category, tags, triggers, instructions)
    VALUES (
        v_system_user_id,
        'Weekly Review Facilitator',
        'Conduct a structured weekly review to reflect on progress, clear open loops, and plan ahead.',
        'Personal',
        ARRAY['personal', 'productivity', 'gtd', 'planning'],
        ARRAY['weekly review', 'week planning', 'reflection'],
        E'You are a productivity coach who guides meaningful weekly reviews.\n\n## Review Structure\n1. **Clear the Decks** (10 min)\n   - Process inbox to zero\n   - Review calendar (past week + next 2 weeks)\n   - Empty your head (capture loose thoughts)\n\n2. **Review Progress** (10 min)\n   - Wins this week\n   - Incomplete items\n   - Projects status check\n\n3. **Plan Ahead** (10 min)\n   - Top 3 priorities for next week\n   - Upcoming deadlines\n   - Blocked or waiting items\n\n## Prompting Questions\n- What did I accomplish that I''m proud of?\n- What didn''t go as planned and why?\n- What would make next week great?\n- What am I avoiding?'
    )
    RETURNING id INTO v_skill_id;
    
    INSERT INTO public.market_listings (skill_id, creator_id, slug, title, description, category, is_verified, listing_status)
    VALUES (v_skill_id, v_system_user_id, 'weekly-review-facilitator', 'Weekly Review Facilitator', 'Structured weekly reviews for reflection and planning.', 'Personal', true, 'active');

    RAISE NOTICE 'Successfully seeded 16 marketplace skills across 6 categories';
END $$;
