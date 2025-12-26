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

## Troubleshooting

### User Invitation Fails

1. Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
2. Check Supabase email settings are configured
3. Ensure the email address is valid

### Admin Panel Not Visible

1. Verify your email is in `NEXT_PUBLIC_ADMIN_EMAILS`
2. Sign out and sign back in
3. Check for typos in the email list
