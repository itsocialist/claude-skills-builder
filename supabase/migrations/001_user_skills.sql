-- User Skills table for storing saved skills
CREATE TABLE IF NOT EXISTS user_skills (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    tags TEXT[],
    triggers TEXT[],
    instructions TEXT NOT NULL,
    resources JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (safe)
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

-- Users can only access their own skills
DROP POLICY IF EXISTS "Users can CRUD own skills" ON user_skills;
CREATE POLICY "Users can CRUD own skills" ON user_skills
    FOR ALL USING (auth.uid() = user_id);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_category ON user_skills(category);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_skills_updated_at ON user_skills;
CREATE TRIGGER update_user_skills_updated_at
    BEFORE UPDATE ON user_skills
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
