import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Service role client for bypassing RLS - only for public sharing
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface RouteContext {
    params: Promise<{ id: string }>;
}

export async function GET(
    request: NextRequest,
    context: RouteContext
): Promise<NextResponse> {
    try {
        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                { error: 'Skill ID required' },
                { status: 400 }
            );
        }

        const { data: skill, error } = await supabase
            .from('user_skills')
            .select('id, name, description, category, tags, triggers, instructions, created_at')
            .eq('id', id)
            .single();

        if (error || !skill) {
            return NextResponse.json(
                { error: 'Skill not found' },
                { status: 404 }
            );
        }

        // Return only public-safe fields (no user_id)
        return NextResponse.json({ skill });
    } catch (error) {
        console.error('[ShareAPI] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
