# Test Credentials & Access Guide

> **Last Updated:** 2025-12-28  
> **Purpose:** Document test accounts and access methods for development and testing

---

## Admin Access

### Admin Emails (Whitelisted)
Admin access is controlled via the `NEXT_PUBLIC_ADMIN_EMAILS` environment variable.

**Production Admin Emails:**
- `brianvdawson@gmail.com` (Owner)
- `dev-admin@getclaudeskills.local` (Test Admin)

**To Grant Admin Access:**
1. Add email to `NEXT_PUBLIC_ADMIN_EMAILS` in `.env.local`
2. Restart dev server or redeploy
3. User must sign up/in with that exact email

---

## Authentication Method

GetClaudeSkills uses **Supabase Auth** with both OAuth and email/password options.

### Signing In
1. Navigate to https://getclaudeskills.ai or `http://localhost:3000`
2. Click "Sign In"
3. Choose authentication method:
   - **Google OAuth** (recommended for personal accounts)
   - **Email + Password** (for test accounts and regular users)

### Test Admin Account Credentials
**Email:** `dev-admin@getclaudeskills.local`  
**Password:** `password`

**Steps to Access:**
1. Click "Sign In with Email"
2. Enter email: `dev-admin@getclaudeskills.local`
3. Enter password: `password`
4. Click "Sign In"
5. You will be redirected to dashboard with admin privileges

---

## Admin-Only Features

Once authenticated as an admin, you can access:

### Admin Dashboard
- **URL:** `/app/admin`
- **Features:**
  - Platform statistics
  - User metrics
  - Content analytics
  - System health

### Admin Analytics
- **URL:** `/app/admin/analytics`
- **Features:**
  - Detailed usage analytics
  - User behavior tracking
  - Feature adoption metrics

### Feature Flags Management
- **URL:** `/app/admin/features`
- **Features:**
  - Toggle feature availability (PUBLIC, ADMIN_ONLY, DISABLED)
  - Emergency feature shutdowns
  - Beta feature rollouts

### User Management
- **URL:** `/app/admin/users`
- **Features:**
  - View all platform users
  - Invite new users
  - Enable/disable accounts
  - Delete users

### Site Settings
- **URL:** `/app/admin/settings`
- **Features:**
  - Brand configuration
  - Color customization
  - Custom menu items
  - Access policies

---

## Environment Variables Reference

### Required for Admin**
```env
# Admin email whitelist (comma-separated)
NEXT_PUBLIC_ADMIN_EMAILS=brianvdawson@gmail.com,dev-admin@getclaudeskills.local

# Service role key for backend operations
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Platform Claude API key for onboarding
NEXT_PUBLIC_PLATFORM_CLAUDE_KEY=sk-ant-api03-...
```

### Supabase Config
```env
NEXT_PUBLIC_SUPABASE_URL=https://dojfhspxqutusfegiwet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

---

## Testing Workflows

### Test Admin Features
1. Set up `dev-admin@getclaudeskills.local` in `.env.local`
2. Start dev server: `npm run dev`
3. Authenticate using magic link
4. Navigate to `/app/admin/*` routes
5. Verify admin-only UI elements appear

### Test Non-Admin Experience
1. Sign in with a different email (not in whitelist)
2. Verify admin links do NOT appear in navigation
3. Attempt to access `/app/admin` directly
4. Should redirect to `/app` dashboard

### Test Feature Flags
1. Navigate to `/app/admin/features`
2. Set a feature to `DISABLED`
3. Sign out
4. Attempt to access the disabled feature
5. Should redirect or show "feature unavailable"

---

## Security Notes

⚠️ **Never commit credentials to version control**
- Keep `.env.local` in `.gitignore`
- Rotate `SUPABASE_SERVICE_ROLE_KEY` quarterly
- Use environment-specific keys (dev/staging/prod)

🔒 **Service Role Key**
- Bypasses Row Level Security (RLS)
- Never expose in client-side code
- Only use in server-side API routes

📧 **Magic Links**
- Expire after 24 hours
- Single-use only
- Sent to Supabase-configured email service
