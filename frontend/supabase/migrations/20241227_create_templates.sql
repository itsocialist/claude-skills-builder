-- Templates table (Backfill to match Prod)
CREATE TABLE IF NOT EXISTS templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    triggers TEXT[] DEFAULT '{}',
    instructions TEXT NOT NULL,
    sample_output TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read templates
CREATE POLICY "Public read access" ON templates
    FOR SELECT USING (true);

-- Policy: Only service role can insert/update (Implicit)
