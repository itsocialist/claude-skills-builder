/**
 * In-memory rate limiter for API routes
 * 10 req/min for unauthenticated users
 * 30 req/min for authenticated users
 */

interface RateLimitEntry {
    count: number
    resetAt: number
}

// In-memory store - Note: This resets on server restart
// For production scale, consider Redis
const rateLimitStore = new Map<string, RateLimitEntry>()

const WINDOW_MS = 60 * 1000 // 1 minute
const UNAUTH_LIMIT = 10
const AUTH_LIMIT = 30

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetAt < now) {
            rateLimitStore.delete(key)
        }
    }
}, 5 * 60 * 1000)

export interface RateLimitResult {
    success: boolean
    limit: number
    remaining: number
    resetAt: number
}

/**
 * Check and update rate limit for a given identifier
 * @param identifier - IP address or user ID
 * @param isAuthenticated - Whether the request is from an authenticated user
 */
export function checkRateLimit(
    identifier: string,
    isAuthenticated: boolean = false
): RateLimitResult {
    const limit = isAuthenticated ? AUTH_LIMIT : UNAUTH_LIMIT
    const now = Date.now()
    const key = `${isAuthenticated ? 'auth' : 'unauth'}:${identifier}`

    let entry = rateLimitStore.get(key)

    // Create new entry or reset if window expired
    if (!entry || entry.resetAt < now) {
        entry = {
            count: 0,
            resetAt: now + WINDOW_MS,
        }
    }

    entry.count++
    rateLimitStore.set(key, entry)

    const remaining = Math.max(0, limit - entry.count)
    const success = entry.count <= limit

    return {
        success,
        limit,
        remaining,
        resetAt: entry.resetAt,
    }
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): HeadersInit {
    const headers: HeadersInit = {
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': Math.ceil(result.resetAt / 1000).toString(),
    }

    if (!result.success) {
        headers['Retry-After'] = Math.ceil((result.resetAt - Date.now()) / 1000).toString()
    }

    return headers
}

/**
 * Create a 429 Too Many Requests response
 */
export function createRateLimitResponse(result: RateLimitResult): Response {
    return new Response(
        JSON.stringify({
            error: 'Too Many Requests',
            message: 'Rate limit exceeded. Please try again later.',
            retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000),
        }),
        {
            status: 429,
            headers: {
                'Content-Type': 'application/json',
                ...getRateLimitHeaders(result),
            },
        }
    )
}
