import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Service role client for admin operations
let supabaseAdmin: SupabaseClient | null = null;
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

// GET: List resources for a skill
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
        }

        const { id: skillId } = await params;
        const searchParams = request.nextUrl.searchParams;
        const type = searchParams.get('type') || 'template'; // 'template' or 'user'

        let query = supabaseAdmin
            .from('skill_resources')
            .select('*');

        if (type === 'template') {
            query = query.eq('template_id', skillId);
        } else {
            query = query.eq('user_skill_id', skillId);
        }

        const { data, error } = await query.order('folder').order('filename');

        if (error) {
            console.error('Error fetching resources:', error);
            return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
        }

        // Group by folder
        const grouped = data.reduce((acc, resource) => {
            if (!acc[resource.folder]) {
                acc[resource.folder] = [];
            }
            acc[resource.folder].push(resource);
            return acc;
        }, {} as Record<string, typeof data>);

        return NextResponse.json({ resources: data, grouped });
    } catch (error) {
        console.error('Resources API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST: Upload a new resource
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
        }

        // Auth check
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { id: skillId } = await params;
        const body = await request.json();
        const { folder, filename, content, type = 'user' } = body;

        // Validate folder
        const validFolders = ['scripts', 'references', 'assets', 'templates', 'examples'];
        if (!validFolders.includes(folder)) {
            return NextResponse.json({ error: 'Invalid folder type' }, { status: 400 });
        }

        // Check file size (1MB limit)
        const sizeBytes = new TextEncoder().encode(content || '').length;
        if (sizeBytes > 1048576) {
            return NextResponse.json({ error: 'File exceeds 1MB limit' }, { status: 400 });
        }

        // Check total skill size (5MB limit)
        const { data: existingResources } = await supabaseAdmin
            .from('skill_resources')
            .select('size_bytes')
            .eq(type === 'template' ? 'template_id' : 'user_skill_id', skillId);

        const totalSize = (existingResources || []).reduce((sum, r) => sum + (r.size_bytes || 0), 0);
        if (totalSize + sizeBytes > 5242880) {
            return NextResponse.json({ error: 'Skill exceeds 5MB total limit' }, { status: 400 });
        }

        // Insert resource
        const resourceData: any = {
            folder,
            filename,
            content,
            size_bytes: sizeBytes,
            mime_type: guessMimeType(filename),
        };

        if (type === 'template') {
            // Admin check for templates
            const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
            if (!adminEmails.includes(user.email || '')) {
                return NextResponse.json({ error: 'Admin access required for template resources' }, { status: 403 });
            }
            resourceData.template_id = skillId;
        } else {
            // Verify user owns the skill
            const { data: skill } = await supabaseAdmin
                .from('user_skills')
                .select('user_id')
                .eq('id', skillId)
                .single();

            if (!skill || skill.user_id !== user.id) {
                return NextResponse.json({ error: 'Not authorized to modify this skill' }, { status: 403 });
            }
            resourceData.user_skill_id = skillId;
        }

        const { data, error } = await supabaseAdmin
            .from('skill_resources')
            .upsert(resourceData, { onConflict: type === 'template' ? 'template_id,folder,filename' : 'user_skill_id,folder,filename' })
            .select()
            .single();

        if (error) {
            console.error('Error creating resource:', error);
            return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 });
        }

        return NextResponse.json({ resource: data });
    } catch (error) {
        console.error('Resource creation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE: Remove a resource
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
        }

        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { id: resourceId } = await params;

        // Get resource to check ownership
        const { data: resource } = await supabaseAdmin
            .from('skill_resources')
            .select('*, user_skills!user_skill_id(user_id)')
            .eq('id', resourceId)
            .single();

        if (!resource) {
            return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
        }

        // Authorization check
        if (resource.template_id) {
            const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
            if (!adminEmails.includes(user.email || '')) {
                return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
            }
        } else if (resource.user_skills?.user_id !== user.id) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const { error } = await supabaseAdmin
            .from('skill_resources')
            .delete()
            .eq('id', resourceId);

        if (error) {
            console.error('Error deleting resource:', error);
            return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Resource deletion error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Helper: Guess MIME type from filename
function guessMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
        'md': 'text/markdown',
        'txt': 'text/plain',
        'js': 'application/javascript',
        'ts': 'application/typescript',
        'py': 'text/x-python',
        'json': 'application/json',
        'yaml': 'application/x-yaml',
        'yml': 'application/x-yaml',
        'html': 'text/html',
        'css': 'text/css',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        'pdf': 'application/pdf',
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
}
