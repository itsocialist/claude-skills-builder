---
description: Critical lessons learned from production incidents and development mistakes
---

# Lessons Learned - GetClaudeSkills

> **Purpose:** Quick reference to governance rules. Full details in the knowledge base.

---

## 🎯 Hard Rules (Non-Negotiable)

### Rule 1: Deployment Approval
> **NEVER push to production without explicit user approval.**
> - Must call `notify_user` with deployment plan
> - Wait for user to say "push it" or equivalent
> - No exceptions for "simple" or "safe" changes

### Rule 2: No Hardcoded Data
> **Hardcoded or placeholder data means the feature is INCOMPLETE.**
> - "Renders without error" ≠ "Production ready"
> - AI-generated sample data = incomplete
> - Must use real DB/API data to be considered "complete"

### Rule 3: Credential Documentation
> **Test credentials must be documented immediately upon creation.**
> - Location: `docs/testing/TEST_CREDENTIALS.md`
> - Check docs BEFORE asking user

### Rule 4: Route Documentation
> **All routes must be documented in `docs/ROUTES.md`**
> - Public vs protected vs admin-only
> - Orphaned routes clearly marked

### Rule 5: No Fake Data References
> **NEVER hardcode references to data that doesn't exist in the database.**
> - Bundle skill names must match ACTUAL database records
> - Always query the database or check migrations BEFORE hardcoding references

---

## 📋 Quick Checklists

### Pre-Production Deployment
- [ ] Changes validated in local dev
- [ ] Build passes (`npm run build`)
- [ ] User approval obtained via `notify_user`
- [ ] Deploy workflow followed (`.agent/workflows/deploy.md`)

### Feature Completeness
- [ ] No hardcoded/placeholder data
- [ ] Data sourced from DB or API
- [ ] Navigation ingress exists
- [ ] Documented in relevant guides

---

## 📚 Full Documentation

For complete incident history, root cause analysis, and detailed checklists, see:
- **Knowledge Base**: `getclaudeskills_platform/artifacts/governance/lessons_learned.md`
- **Deploy Workflow**: `.agent/workflows/deploy.md`
- **Test Credentials**: `docs/testing/TEST_CREDENTIALS.md`
- **Route Map**: `docs/ROUTES.md`
