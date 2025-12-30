-- Feedback table for contact/feedback system (US-10)
-- Created: 2024-12-30

CREATE TABLE IF NOT EXISTS public.feedback (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text,
    name text,
    category text NOT NULL DEFAULT 'general',
    message text NOT NULL,
    page_url text,
    user_agent text,
    user_id uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Anyone can insert feedback (even anonymous users)
CREATE POLICY "Anyone can insert feedback" ON public.feedback 
    FOR INSERT 
    WITH CHECK (true);

-- Only authenticated admins can read feedback
CREATE POLICY "Admins can read feedback" ON public.feedback 
    FOR SELECT 
    USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE email = ANY(string_to_array(current_setting('app.admin_emails', true), ','))
        )
    );

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_category ON public.feedback(category);

COMMENT ON TABLE public.feedback IS 'User feedback and contact form submissions';
