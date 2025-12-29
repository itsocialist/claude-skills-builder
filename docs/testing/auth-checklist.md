# Authentication Testing Checklist

## CRITICAL: Auth Must Never Break

This checklist MUST be completed before any auth-related code changes are merged.

## Pre-Merge Testing

### 1. Local Testing
- [ ] `npm run dev` starts without errors
- [ ] Login flow works on localhost:3000
- [ ] Protected routes redirect correctly
- [ ] returnTo parameter preserves intended destination
- [ ] Admin routes only accessible to admin emails

### 2. Build Verification
- [ ] `npm run build` completes without errors
- [ ] No TypeScript errors in auth-related files

### 3. Production Smoke Test (Post-Deploy)
- [ ] Homepage loads: https://getclaudeskills.ai
- [ ] Login button visible
- [ ] OAuth flow completes (Google)
- [ ] /app accessible after login
- [ ] /app/admin accessible for admin users
- [ ] /app/library shows user's skills

## Redirect Rules

| Route | Unauthenticated Behavior | Redirect Target |
|-------|-------------------------|-----------------|
| `/app` | Show login modal | N/A (public route) |
| `/app/library` | Redirect | `/app?returnTo=/app/library` |
| `/app/admin/*` | Redirect | `/app?returnTo=/app/admin/*` |
| `/app/builder` | Public access | N/A |
| `/app/wizard` | Public access | N/A |
| `/marketplace/*` | Public access | N/A |

## Files That Affect Auth

```
lib/utils/supabase/middleware.ts    -- Route protection
middleware.ts                        -- Main middleware entry
components/auth/AuthProvider.tsx     -- Client auth context
lib/supabase.ts                      -- Supabase client
```

## Known Issues Fixed

| Date | Issue | Fix |
|------|-------|-----|
| 2025-12-29 | `/?login=true` invalid redirect | Changed to `/app?returnTo=...` |
