# Deployment Workflow

## HARD RULES - NEVER VIOLATE

### 🛑 Rule 1: NEVER Push Directly to Main
- **All changes** must be validated in local dev before pushing
- No exceptions, even for "obvious" fixes

### 🛑 Rule 2: Always Validate in Dev First
```
1. npm run dev
2. Open browser to localhost:3000
3. Navigate using UI (not direct URLs)
4. Verify the fix works
5. ONLY THEN push to main
```

### 🛑 Rule 3: Auth Changes Require Full Flow Test
Before pushing ANY auth-related changes:
- [ ] Login flow works
- [ ] Logout flow works  
- [ ] Protected route redirect works
- [ ] No redirect loops
- [ ] returnTo parameter preserved

---

## Workflow Steps

### Step 1: Make Changes Locally
```bash
# Make code changes
```

### Step 2: Start Dev Server
```bash
cd frontend && npm run dev
```

### Step 3: Validate in Browser
- Use UI navigation, NOT direct URL jumps
- Test the actual user flow
- Check for console errors

### Step 4: Run Build Check
```bash
npm run build
```

### Step 5: 🛑 REQUEST APPROVAL (MANDATORY)
**STOP HERE. DO NOT PROCEED WITHOUT USER APPROVAL.**

Use `notify_user` to:
- Show what was fixed
- Show validation results (screenshots/recordings)
- Ask: "Ready to push to production?"

**NEVER auto-push. ALWAYS wait for explicit approval.**

### Step 6: Push to Main (Only After Approval)
```bash
git add -A && git commit -m "description" && git push origin main
```

### Step 7: Verify Production
- Wait for Vercel deployment
- Test in production browser
- If still broken, investigate prod-specific issues

---

## Auth-Specific Checklist

| Test | Command/Action |
|------|----------------|
| Protected route while logged out | Navigate via UI to My Skills |
| Redirect URL | Should be `/app?returnTo=/app/library` |
| No redirect loops | Page should load, not error |
| Login completes | OAuth flow returns to app |
| returnTo works | After login, returns to intended page |

---

## Files That Affect Auth

```
lib/utils/supabase/middleware.ts    -- Route protection (CRITICAL)
middleware.ts                        -- Main middleware entry
components/auth/AuthProvider.tsx     -- Client auth context
```

> [!CAUTION]
> Changes to middleware.ts can break ALL user access to the app.
> Always test the full login/logout flow before pushing.
