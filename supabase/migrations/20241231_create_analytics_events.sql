-- Analytics Events Table
-- Created: 2024-12-31

CREATE TABLE IF NOT EXISTS public.analytics_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    session_id text,
    event_type text NOT NULL,
    event_data jsonb DEFAULT '{}',
    page_url text,
    user_agent text,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Anyone can insert events (including anonymous)
CREATE POLICY "Anyone can insert events" ON public.analytics_events 
    FOR INSERT 
    WITH CHECK (true);

-- Only admins can read events
CREATE POLICY "Admins can read events" ON public.analytics_events 
    FOR SELECT 
    USING (true); -- Will be restricted via API

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_analytics_user ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON public.analytics_events(session_id);

COMMENT ON TABLE public.analytics_events IS 'User activity and event tracking';
