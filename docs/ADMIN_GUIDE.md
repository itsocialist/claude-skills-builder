# Admin Guide

> Last updated: 2024-12-26

## Requirements

Admin access requires your email to be listed in `NEXT_PUBLIC_ADMIN_EMAILS` environment variable.

---

## Admin Dashboard

Access admin features at **Admin** (`/app/admin`)

---

## User Management

Manage platform users at **Admin > Users** (`/app/admin/users`)

### Viewing Users

The user management page displays:
- Email addresses
- Sign-up dates
- Last active timestamps
- Account status (active/inactive)

### Searching Users

Use the search bar to filter users by email address.

### Inviting New Users

1. Click **Add User** button (top right)
2. Enter the user's email address
3. Click **Send Invitation**
4. User receives an email with signup instructions

### Toggling User Status

Click the status toggle to activate or deactivate a user account.

---

## Skill Analytics

View skill usage data from the database:

- `view_count` - Times a skill's public page was viewed
- `download_count` - Times a skill was cloned/downloaded

---

## AI Features (Sprint 12)

AI features use a **Bring Your Own Key (BYOK)** model:
- Users provide their own Claude API keys
- No server-side secrets required for AI
- Costs are borne by the user

### Features
- **Inspector AI Analysis**: Validate uploaded skills with AI feedback
- **Builder "Analyze with AI"**: Get improvement suggestions for skills
- **Generator "Iterate with AI"**: Refine AI-generated skills with feedback

### Cost Estimate
- ~$0.02-$0.05 per AI analysis/refine call (user's Anthropic budget)

---

## Environment Configuration

### Required Admin Variables

```env
# Comma-separated list of admin email addresses
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com,admin2@example.com

# Required for user invitations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Public App URL

```env
# Used for generating share links and email redirects
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## Marketplace Management (Sprint 13)

The Marketplace enables skill sharing and discovery.

### Database: `market_listings` Table

Skills are published to the marketplace via the `market_listings` table:
- `skill_id` - References the source skill
- `creator_id` - The user who published it
- `slug` - URL-friendly identifier
- `listing_status` - `active`, `pending`, or `removed`
- `is_verified` - Admin-verified badge

### Publishing Skills

Users can publish skills from the Builder:
1. Save skill to Library
2. Click "Publish to Marketplace" in Export tab
3. Skill appears in `/marketplace`

### Moderation

To remove inappropriate listings, update `listing_status`:
```sql
UPDATE market_listings 
SET listing_status = 'removed' 
WHERE slug = 'skill-slug';
```

### RLS Policies

- **SELECT**: Public (anyone can browse)
- **INSERT**: Authenticated users (own skills only)
- **UPDATE/DELETE**: Owner or admin only

---

## Troubleshooting

### User Invitation Fails

1. Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly in Vercel (Production) or `.env.local`
2. Check Supabase email settings are configured
3. Ensure the email address is valid with no trailing spaces

### Admin Panel Not Visible

1. Verify your email is in `NEXT_PUBLIC_ADMIN_EMAILS`
2. **Production Note:** Ensure environment variables in Vercel do NOT have trailing newlines/spaces.
3. Sign out and sign back in to refresh claims.

### Admin Stats Dashboard

Currently, the stats dashboard uses placeholder data. Real-time analytics are scheduled for Sprint 16 (STORY-041).


