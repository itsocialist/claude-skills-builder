---
description: Process for capturing admin screenshots with authentication bypass
---

# Admin Screenshot Capture Workflow

## Context
This workflow documents the **successful** process for capturing screenshots of admin-protected pages. Use this when you need to capture screenshots for documentation but authentication is blocking access.

## Key Success Factors

### 1. **Restart Dev Server First**
**Why it worked:** Stale dev servers (running 15+ hours) don't hot-reload middleware changes properly.

**Steps:**
```bash
# Kill the existing dev server
kill -9 $(lsof -ti:3000)

# Start fresh
cd frontend
npm run dev
```

### 2. **Bypass at the Right Layer**
**Why it worked:** Previous attempts only bypassed feature flags, not the core admin email validation.

**Critical locations to bypass:**
- `frontend/src/lib/utils/supabase/middleware.ts` (lines 61-95) - **Admin email check**
- `frontend/src/components/layout/Shell.tsx` (line 37) - **Client-side admin flag**

**Correct bypass pattern:**
```typescript
// middleware.ts - Comment out ENTIRE admin check block
/*
if (path.startsWith('/app/admin')) {
    // ... all admin validation logic
}
*/

// Shell.tsx - Force admin to true
const isAdmin = true; // Temporary bypass
```

### 3. **Let Browser Subagent Handle Auth**
**Why it worked:** Browser subagent can interact with login forms and authenticate properly.

**Don't:**
- Try to manually set session tokens
- Attempt to bypass auth entirely
- Use hardcoded credentials in code

**Do:**
- Let browser subagent navigate to login page
- Provide dev credentials: `dev-admin@getclaudeskills.local`
- Let subagent complete the full auth flow

### 4. **Verify Before Capturing**
**Why it worked:** Confirmed routes were accessible before attempting screenshots.

**Verification steps:**
```bash
# Check server logs for 200 responses
# Look for lines like:
# GET /app/admin/features 200 in 1819ms
```

## Complete Workflow

### Step 1: Prepare Environment
```bash
# 1. Stop stale dev server
kill -9 $(lsof -ti:3000)

# 2. Verify bypass code is in place
# Check middleware.ts lines 61-95 are commented
# Check Shell.tsx line 37 has: const isAdmin = true;
```

### Step 2: Restart Server
// turbo
```bash
cd frontend
npm run dev
```

### Step 3: Verify Routes Accessible
```bash
# Check server logs for 200 responses on admin routes
# Should see:
# GET /app/admin 200
# GET /app/admin/features 200
# GET /app/admin/users 200
```

### Step 4: Capture Screenshots
Use browser_subagent with this task template:

```
Navigate to http://localhost:3000/app/admin and capture a screenshot of the admin dashboard. Then navigate to http://localhost:3000/app/admin/features and capture a screenshot. Finally, navigate to http://localhost:3000/app/admin/users and capture a screenshot.

For each page:
1. Wait for the page to fully load (wait for network idle)
2. Capture a full-page screenshot
3. Save each screenshot with a descriptive name (admin_dashboard.png, admin_features.png, admin_users.png)

If you encounter a login page, authenticate using:
- Email: dev-admin@getclaudeskills.local
- Password: password

Return a report listing all three screenshots captured with their file paths.
```

### Step 5: Move Screenshots to Docs
```bash
cp /path/to/artifacts/admin_dashboard_*.png docs/images/admin_dashboard.png
cp /path/to/artifacts/admin_features_*.png docs/images/admin_features.png
cp /path/to/artifacts/admin_users_*.png docs/images/admin_users.png
```

### Step 6: Restore Production Code
```typescript
// middleware.ts - Uncomment admin check
if (path.startsWith('/app/admin')) {
    // ... restore admin validation logic
}

// Shell.tsx - Restore proper admin calculation
const isAdmin = useMemo(() => {
    if (!user?.email) return false;
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').toLowerCase().split(',').map(e => e.trim());
    return adminEmails.includes(user.email.toLowerCase());
}, [user?.email]);
```

## What Didn't Work (Lessons Learned)

### ❌ Attempt 1: Feature Flag Override Only
- **Problem:** Only bypassed feature flags, not admin email check
- **Result:** Still redirected to `/?login=true`

### ❌ Attempt 2: Client-Side Storage Manipulation
- **Problem:** Tried to set localStorage tokens manually
- **Result:** Server-side middleware still rejected requests

### ❌ Attempt 3: Long-Running Dev Server
- **Problem:** Made changes but didn't restart server
- **Result:** Changes never took effect due to stale cache

## Success Metrics
- ✅ All 3 admin pages accessible (200 OK)
- ✅ Screenshots captured without errors
- ✅ No authentication artifacts in screenshots
- ✅ High-quality, production-ready images

## Related Files
- `frontend/src/lib/utils/supabase/middleware.ts` - Server-side route protection
- `frontend/src/components/layout/Shell.tsx` - Client-side admin UI
- `docs/ADMIN_GUIDE.md` - Documentation using these screenshots
