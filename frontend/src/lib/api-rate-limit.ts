import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, createRateLimitResponse, getRateLimitHeaders } from '@/lib/rate-limit'
import { createClient } from '@supabase/supabase-js'

type ApiHandler = (request: NextRequest, context: unknown) => Promise<Response>

/**
 * Wrap an API route handler with rate limiting
 * Automatically detects auth status from Supabase session
 */
export function withRateLimit(handler: ApiHandler): ApiHandler {
    return async (request: NextRequest, context: unknown) => {
        // Get identifier (IP address or forwarded IP)
        const forwarded = request.headers.get('x-forwarded-for')
        const ip = forwarded?.split(',')[0]?.trim() || 'unknown'

        // Check if user is authenticated
        let isAuthenticated = false
        let userId = ip // Default to IP for unauth users

        try {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
            const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

            if (supabaseUrl && supabaseKey) {
                const authHeader = request.headers.get('authorization')
                if (authHeader?.startsWith('Bearer ')) {
                    const token = authHeader.substring(7)
                    const supabase = createClient(supabaseUrl, supabaseKey, {
                        global: { headers: { Authorization: `Bearer ${token}` } }
                    })
                    const { data: { user } } = await supabase.auth.getUser()
                    if (user) {
                        isAuthenticated = true
                        userId = user.id
                    }
                }
            }
        } catch {
            // Auth check failed, treat as unauthenticated
        }

        // Check rate limit
        const rateLimitResult = checkRateLimit(userId, isAuthenticated)

        if (!rateLimitResult.success) {
            return createRateLimitResponse(rateLimitResult)
        }

        // Call the original handler
        const response = await handler(request, context)

        // Clone response and add rate limit headers
        const newHeaders = new Headers(response.headers)
        const rateLimitHeaders = getRateLimitHeaders(rateLimitResult)
        Object.entries(rateLimitHeaders).forEach(([key, value]) => {
            newHeaders.set(key, value)
        })

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
        })
    }
}
