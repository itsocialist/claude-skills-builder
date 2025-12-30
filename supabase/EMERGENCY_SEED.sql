-- Quick fix: Insert seed data directly via SQL Editor in Supabase
-- This bypasses the FK constraint issue by using a system approach

-- Step 1: Get first user ID (or create placeholder)
DO $$
DECLARE
    v_system_user_id UUID;
BEGIN
    -- Get any existing user
    SELECT id INTO v_system_user_id FROM auth.users LIMIT 1;
    
    -- If no users, check profiles
    IF v_system_user_id IS NULL THEN
        SELECT user_id INTO v_system_user_id FROM profiles LIMIT 1;
    END IF;
    
    -- Verify user exists
    IF v_system_user_id IS NULL THEN
        RAISE EXCEPTION 'No users found. Create an account first, then re-run this script.';
    END IF;
    
    RAISE NOTICE 'Using user ID: %', v_system_user_id;
    
    -- Delete existing if any
    DELETE FROM market_listings WHERE slug IN (
        'property-listing-pro', 'open-house-follow-up', 'cma-report-generator',
        'social-media-content-calendar', 'email-campaign-writer', 'brand-voice-guide-creator',
        'business-proposal-writer', 'meeting-notes-to-actions', 'competitor-analysis-framework',
        'blog-post-optimizer', 'case-study-writer', 'product-description-writer',
        'api-documentation-writer', 'code-review-assistant', 'resume-optimizer', 'weekly-review-facilitator'
    );
    
    DELETE FROM user_skills WHERE name IN (
        'Property Listing Pro', 'Open House Follow-Up', 'CMA Report Generator',
        'Social Media Content Calendar', 'Email Campaign Writer', 'Brand Voice Guide Creator',
        'Business Proposal Writer', 'Meeting Notes to Action Items', 'Competitor Analysis Framework',
        'Blog Post Optimizer', 'Case Study Writer', 'Product Description Writer',
        'API Documentation Writer', 'Code Review Assistant', 'Resume Optimizer', 'Weekly Review Facilitator'
    );
    
    -- Now run the full seed (copy from 20241229000000_seed_marketplace_skills.sql starting at line 32)
    -- Just copy lines 32-308 from that file here
    
END $$;
