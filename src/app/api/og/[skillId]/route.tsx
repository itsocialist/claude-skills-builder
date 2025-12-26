import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ skillId: string }> }
) {
    const { skillId } = await params;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: skill } = await supabase
        .from('user_skills')
        .select('name, description, category')
        .eq('id', skillId)
        .single();

    const name = skill?.name || 'Claude Skill';
    const description = skill?.description || 'A custom skill for Claude AI';
    const category = skill?.category || 'General';
    const truncatedDesc = description.length > 120 ? description.substring(0, 120) + '...' : description;

    return new ImageResponse(
        (
            <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end', backgroundColor: '#1a1a1a', padding: '60px', fontFamily: 'system-ui, sans-serif' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <span style={{ backgroundColor: '#C15F3C', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '24px', fontWeight: 600 }}>{category}</span>
                </div>
                <div style={{ fontSize: '64px', fontWeight: 700, color: 'white', marginBottom: '16px', lineHeight: 1.1 }}>{name}</div>
                <div style={{ fontSize: '28px', color: '#a0a0a0', lineHeight: 1.4, maxWidth: '900px' }}>{truncatedDesc}</div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '40px', gap: '12px' }}>
                    <span style={{ fontSize: '24px', color: '#666' }}>GetClaudeSkills.ai</span>
                </div>
            </div>
        ),
        { width: 1200, height: 630 }
    );
}
