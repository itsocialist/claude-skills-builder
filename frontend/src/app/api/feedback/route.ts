import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, name, category, message } = body;

        if (!message || message.trim().length === 0) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        if (!category) {
            return NextResponse.json(
                { error: 'Category is required' },
                { status: 400 }
            );
        }

        // Use service role key for inserting feedback (bypasses RLS)
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data, error } = await supabase
            .from('feedback')
            .insert({
                email: email?.trim() || null,
                name: name?.trim() || null,
                category,
                message: message.trim(),
                page_url: request.headers.get('referer') || null,
                user_agent: request.headers.get('user-agent') || null,
            })
            .select('id')
            .single();

        if (error) {
            console.error('Feedback insert error:', error);
            return NextResponse.json(
                { error: 'Failed to submit feedback' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            id: data?.id,
            message: 'Thank you for your feedback!'
        });
    } catch (error) {
        console.error('Feedback API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
