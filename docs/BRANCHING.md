# Branch Strategy

## Overview

We use a two-branch workflow to separate development from production.

## Branches

| Branch | Purpose | Deployment |
|--------|---------|------------|
| `main` | Production-ready code | Auto-deploys to **getclaudeskills.ai** |
| `develop` | Active development | Vercel preview deployments |

## Workflow

### Daily Development
1. Work on `develop` branch
2. Push changes → Vercel creates preview deployment
3. Test on preview URL
4. CI runs on all pushes

### Releasing to Production
1. Create PR from `develop` → `main`
2. Review changes
3. Merge PR
4. Auto-deploys to production

### Hotfixes
1. Create branch from `main`: `hotfix/description`
2. Fix and test
3. PR to `main` (urgent) AND `develop` (sync)

## Commands

```bash
# Switch to develop for new work
git checkout develop
git pull origin develop

# Create feature branch (optional)
git checkout -b feature/my-feature

# When ready, merge to develop
git checkout develop
git merge feature/my-feature
git push origin develop

# Release to production
gh pr create --base main --head develop --title "Release v1.x.x"
```

## Vercel Configuration

Vercel automatically:
- Deploys `main` to production domain
- Creates preview URLs for `develop` and PRs
- No additional configuration needed

## Environment Variables

Both branches use the same Supabase production database.
For staging-specific data isolation (future), create a separate Supabase project.
