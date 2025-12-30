# Application Routes & URLs

**Last Updated:** 2025-12-28  
**Purpose:** Complete route mapping for GetClaudeSkills platform

---

## Route Categories

### 🌐 Public Routes (No Auth Required)

| Route | Description | Status | Ingress |
|-------|-------------|--------|---------|
| `/` | Marketing landing page | ✅ Live | Direct URL |
| `/bundles` | Power Bundles showcase | ✅ Live | ⚠️ No nav link |
| `/learn/installation-guide` | Installation guide | ✅ Live | ⚠️ No nav link |
| `/learn/what-is-a-skill` | Skill concept explainer | ✅ Live | ⚠️ No nav link |

### 🔓 Semi-Public Routes (Accessible, Shows Login Modal if Not Authenticated)

| Route | Description | Status | Ingress |
|-------|-------------|--------|---------|
| `/app` | Dashboard / Home | ✅ Live | Shell nav |
| `/app/builder` | Skill Builder | ✅ Live | Shell nav |
| `/app/templates` | Template Gallery | ✅ Live | Shell nav |
| `/app/wizard` | Onboarding Wizard | ✅ Live | First-visit auto |
| `/app/canvas` | Visual Canvas Builder | ✅ Live | Shell nav |
| `/marketplace` | Public Marketplace | ✅ Live | Shell nav |

### 🔒 Protected Routes (Auth Required)

| Route | Description | Status | Ingress |
|-------|-------------|--------|---------|
| `/app/library` | User's Skill Library | ✅ Live | Shell nav |
| `/app/inspector` | Skill Inspector/Debugger | ✅ Live | Shell nav |
| `/app/settings` | User Profile & Settings | ✅ Live | User menu → Settings |

### 👑 Admin-Only Routes (Requires `NEXT_PUBLIC_ADMIN_EMAILS`)

| Route | Description | Status | Ingress | Notes |
|-------|-------------|--------|---------|-------|
| `/app/admin` | Admin Dashboard | ✅ Live | User menu → Admin | Main hub |
| `/app/admin/features` | Feature Flags Management | ✅ Live | Admin sidebar | Control PUBLIC/ADMIN_ONLY/DISABLED |
| `/app/admin/users` | User Management | ✅ Live | Admin sidebar | Invite, enable/disable, delete |
| `/app/admin/settings` | Site Settings | ✅ Live | Admin sidebar | Brand, colors, menu |
| `/app/admin/analytics` | Analytics Dashboard | ❌ Incomplete | ❌ No link | **Hardcoded data - not a real feature** |

---

## API Routes

### Public APIs
- `GET /api/skills/public` - List public skills
- `GET /api/marketplace/listings` - Marketplace listings
- `GET /api/site-settings` - Site configuration

### Authenticated APIs
- `GET /api/skills/[id]` - Get skill details
- `POST /api/skills` - Create skill
- `PUT /api/skills/[id]` - Update skill
- `DELETE /api/skills/[id]` - Delete skill
- `GET /api/user/profile` - User profile
- `PUT /api/user/profile` - Update profile

### Admin APIs
- `GET /api/admin/users` - List all users
- `POST /api/admin/users/invite` - Invite user
- `PUT /api/admin/users/[id]` - Update user status
- `DELETE /api/admin/users/[id]` - Delete user
- `GET /api/admin/features` - Get feature flags
- `PUT /api/admin/features` - Update feature flags
- `GET /api/admin/settings` - Get site settings
- `PUT /api/admin/settings` - Update site settings

---

## Authentication Redirect Logic

### Middleware Rules
**File:** `frontend/src/lib/utils/supabase/middleware.ts`

```typescript
// Public Routes (no auth needed, no redirect)
const isPublicRoute =
    path === '/app' ||              // Dashboard shows login modal
    path.startsWith('/app/builder') ||
    path.startsWith('/app/templates') ||
    path.startsWith('/marketplace') ||
    path.startsWith('/app/wizard') ||
    path.startsWith('/app/canvas');

// Protected Routes (requires authentication)
if (path.startsWith('/app') && !isPublicRoute && !user) {
    // Redirect to /app with returnTo parameter
    const url = new URL('/app', request.url);
    url.searchParams.set('returnTo', path);
    return NextResponse.redirect(url);
}
```

**Example Redirects:**
- Unauthenticated user visits `/app/library` → Redirect to `/app?returnTo=/app/library`
- Unauthenticated user visits `/app/builder` → Allow access (shows login modal if needed)
- Non-admin visits `/app/admin` → Redirect to `/app`

---

## Feature Flag Integration

Routes can be dynamically enabled/disabled via Feature Flags stored in `site_settings.feature_flags`:

### Flag States
- **PUBLIC:** Available to all users
- **ADMIN_ONLY:** Visible only to admin emails
- **DISABLED:** Completely inaccessible (redirects)

### Flag Keys
| Flag Key | Affects Routes | Default |
|----------|----------------|---------|
| `feature_builder` | `/app/builder`, `/app/canvas` | PUBLIC |
| `feature_marketplace` | `/marketplace` | PUBLIC |
| `feature_admin` | `/app/admin/*` | ADMIN_ONLY |
| `feature_templates` | `/app/templates` | PUBLIC |
| `feature_library` | `/app/library` | PUBLIC |

**Emergency Override:**
```env
# Force admin access if locked out
OVERRIDE_FEATURE_FLAGS={"feature_admin":"ADMIN_ONLY"}
```

---

## Navigation Hierarchy

### Shell Navigation (Logged In)
```
GetClaudeSkills
├── Home (/app)
├── Builder (/app/builder)
├── Templates (/app/templates)
├── Library (/app/library)
├── Inspector (/app/inspector)
├── Canvas (/app/canvas)
└── Marketplace (/marketplace)
```

### User Menu
```
👤 User Avatar
├── Settings (/app/settings)
├── Admin (/app/admin) [if admin]
└── Sign Out
```

### Admin Sidebar
```
Admin Dashboard (/app/admin)
├── Features (/app/admin/features)
├── Users (/app/admin/users)
├── Settings (/app/admin/settings)
└── [Analytics - missing link]
```

---

## Orphaned Routes (Exist but No Navigation)

### Priority: High
1. **`/app/admin/analytics`** - Analytics dashboard exists but not linked in admin sidebar
2. **`/bundles`** - Power Bundles page exists but not linked anywhere

### Priority: Medium
3. **`/learn/installation-guide`** - Learn Hub content exists but no nav
4. **`/learn/what-is-a-skill`** - Learn Hub content exists but no nav

**Recommendation:** Create "Learn Hub" nav section or add to footer.

---

## Access Control Summary

### Admin Access
Controlled by environment variable:
```env
NEXT_PUBLIC_ADMIN_EMAILS=brianvdawson@gmail.com,dev-admin@getclaudeskills.local
```

### Test Admin Credentials
**Email:** `dev-admin@getclaudeskills.local`  
**Password:** `password`

See [`TEST_CREDENTIALS.md`](file:///Users/briandawson/workspace/claude-skills-builder/docs/testing/TEST_CREDENTIALS.md) for full details.

---

## Route Validation Checklist

- [x] All `/app/*` routes protected by middleware
- [x] Admin routes verify email whitelist
- [x] Feature flags control route visibility
- [x] Redirect preserves `returnTo` parameter
- [ ] All routes have valid navigation ingress
- [ ] Analytics page uses real data (currently placeholder)
- [ ] Learn Hub pages accessible via navigation
