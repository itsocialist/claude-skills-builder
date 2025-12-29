---
description: Pre-production deployment checklist with required testing and approval
---

# Deployment Workflow

**CRITICAL: NEVER deploy directly to production without following these steps.**

## 1. Build Verification
// turbo
```bash
cd frontend && npm run build
```
- Must pass without errors
- Note any warnings

## 2. Dev Testing (REQUIRED)
```bash
# Ensure dev server is running
npm run dev
```

**Manual browser verification:**
1. Open http://localhost:3000
2. Test the feature end-to-end
3. Check console for errors (F12 → Console)
4. Verify on mobile viewport (F12 → Toggle device)

## 3. Screenshot/Recording Evidence
**Agent:** Capture screenshot or recording of feature working:
```
Use browser_subagent to:
- Navigate to feature
- Perform actions
- Capture screenshot with SaveScreenshot: true
```

## 4. User Validation Checkpoint ⚠️
**STOP HERE - Request user approval:**
```
notify_user with:
- Summary of changes
- Screenshot/recording link
- Request explicit "proceed with deployment" confirmation
```

**DO NOT PROCEED without user saying "deploy" or "proceed".**

## 5. Git Commit
```bash
git add -A && git commit -m "feat: description"
git push origin main
```

## 6. Production Deployment
// turbo
```bash
cd /path/to/repo && vercel --prod
```

## 7. Post-Deploy Verification
**Agent:** Capture screenshot of production:
- Test feature in production URL
- Compare with dev screenshot
- Report any differences

## 8. Final Report
```
notify_user with:
- ✅ Deployed to production
- Production URL
- Verification screenshot
```

---

## When to Use This Workflow
- Any feature deployment
- Bug fixes affecting production
- Configuration changes

## Exceptions
- Urgent hotfixes (document exception)
- User explicitly says "skip testing, deploy now"
