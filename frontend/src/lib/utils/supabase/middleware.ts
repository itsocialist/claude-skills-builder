import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isFeatureEnabled, getFlagValue } from '@/lib/flags'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                        response = NextResponse.next({
                            request,
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        // Refresh session if expired - required for Server Components
        const {
            data: { user },
        } = await supabase.auth.getUser()

        // --- ROUTE PROTECTION & FEATURE FLAGS ---
        const path = request.nextUrl.pathname;

        // 1. Protected Routes (require auth)
        // Exempt public tools (Builder, Templates) and Marketplace from blanket auth
        // These are controlled by their specific Feature Flags below
        const isPublicRoute =
            path.startsWith('/app/builder') ||
            path.startsWith('/app/templates') ||
            path.startsWith('/marketplace') ||
            path.startsWith('/app/wizard') ||
            path.startsWith('/app/canvas');

        if (path.startsWith('/app') && !isPublicRoute && !user) {
            // Redirect to /app which will show login modal
            // Preserve intended destination for post-login redirect
            const url = new URL('/app', request.url);
            url.searchParams.set('returnTo', path);
            return NextResponse.redirect(url);
        }

        // 2. Admin Routes (require checking admin status - usually metadata or email)
        if (path.startsWith('/app/admin')) {
            if (!user) {
                // Redirect to /app with returnTo for post-login redirect
                const url = new URL('/app', request.url);
                url.searchParams.set('returnTo', path);
                return NextResponse.redirect(url);
            }

            // Simple email check for MVP (can be expanded to RBAC)
            const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [])
                .map(e => e.toLowerCase().trim());

            if (user.email && !adminEmails.includes(user.email.toLowerCase().trim())) {
                // Not authorized - redirect to main app dashboard
                console.log(`[Middleware] Admin access denied for: ${user.email}`);
                return NextResponse.redirect(new URL('/app', request.url));
            }

            // Feature Flag Check: feature_admin
            const adminFlag = await getFlagValue('feature_admin');
            if (adminFlag === 'DISABLED') {
                return NextResponse.redirect(new URL('/app', request.url));
            }
        }

        // Feature Flag Route Protection Map
        const protectedRoutes: { prefix: string; flag: import('@/lib/flags').FlagKey; fallback: string }[] = [
            { prefix: '/app/builder', flag: 'feature_builder', fallback: '/app' },
            { prefix: '/app/canvas', flag: 'feature_canvas', fallback: '/app' },
            { prefix: '/app/templates', flag: 'feature_templates', fallback: '/app' },
            { prefix: '/app/packages', flag: 'feature_packages', fallback: '/app' },
            { prefix: '/app/inspector', flag: 'feature_inspector', fallback: '/app' },

            { prefix: '/app/wizard', flag: 'feature_generations', fallback: '/app' },

            { prefix: '/marketplace', flag: 'feature_marketplace', fallback: '/' },

            { prefix: '/app/library', flag: 'feature_myskills', fallback: '/app' },
            { prefix: '/app/org', flag: 'feature_organization', fallback: '/app' },
        ];

        for (const route of protectedRoutes) {
            if (path.startsWith(route.prefix)) {
                const flagValue = await getFlagValue(route.flag);

                if (flagValue === 'DISABLED') {
                    // Redirect to safe fallback
                    return NextResponse.redirect(new URL(route.fallback, request.url));
                }


                // if (!isAdmin) {
                //    return NextResponse.redirect(new URL(route.fallback, request.url));
                // }
            }
        }
    } catch (e) {
        // If supabase client fails creation (env vars missing?), just pass
        console.error('Middleware Supabase error:', e);
    }

    return response
}
