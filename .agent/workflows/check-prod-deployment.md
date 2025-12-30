---
description: Verify production deployment via Vercel, GitHub, and Supabase CLI without browser
---

# Check Production Deployment

Confirms that code has been deployed to production by checking deployment systems.

## Steps

// turbo-all

1. **Check GitHub Actions CI status**
   ```bash
   cd /Users/briandawson/workspace/claude-skills-builder && gh run list --limit 3 --json status,conclusion,displayTitle,createdAt | jq '.'
   ```
   - Verify latest run shows `"conclusion": "success"`

2. **Check Vercel deployment status**
   ```bash
   cd /Users/briandawson/workspace/claude-skills-builder && vercel list --prod 2>/dev/null | head -10 || echo "Vercel CLI not configured - check dashboard at https://vercel.com"
   ```

3. **Check latest Git commit matches deployed**
   ```bash
   cd /Users/briandawson/workspace/claude-skills-builder && git log --oneline -3
   ```
   - Note the latest commit hash

4. **Report Status**
   Summarize:
   - GitHub CI: PASS/FAIL
   - Latest commit: [hash]
   - Vercel: Deployed/Unknown

## Expected Output
All CI checks should be green (`"conclusion": "success"`) and the latest commit should match what was pushed.
