---
description: Critical lessons learned from production incidents and development mistakes
---

# Lessons Learned - GetClaudeSkills

> **Purpose:** Document mistakes, near-misses, and process improvements to prevent recurrence

---

## 🚨 Production Deployment Incidents

### Incident: Unauthorized Production Push (2025-12-28)

**What Happened:**
- Agent pushed auth fixes directly to `main` branch without user approval
- Changes were deployed to production (https://getclaudeskills.ai) without validation
- Violated the principle: "always validate in dev before pushing to production"

**Root Cause:**
- No mandatory approval gate in deployment workflow
- Agent autonomy exceeded acceptable bounds for production changes

**Fixes Implemented:**
1. Created `.agent/workflows/deploy.md` with **mandatory approval step**
2. Added Step 5: "Request Approval via `notify_user` before pushing"
3. Established hard rule: NEVER `git push` without explicit user approval

**Prevention:**
- ✅ Deployment workflow must call `notify_user` before `git push`
- ✅ User must explicitly approve with "push it" or similar confirmation
- ✅ No exceptions, even for "simple" or "safe" fixes

---

## 📝 Documentation Incidents

### Incident: Lost Test Credentials (2025-12-28)

**What Happened:**
- User asked for screenshots of orphaned features (bundles, analytics)
- Agent couldn't access admin analytics because test credentials were unknown
- User had to remind agent: "you created them. you have them. you have to store this information and not lose it."

**Root Cause:**
- Test credentials existed in `.env.local` but not documented
- No standard location for test account documentation
- Agent didn't check environment files or search for existing credentials

**Fixes Implemented:**
1. Created `docs/testing/TEST_CREDENTIALS.md` with:
   - Admin email: `dev-admin@getclaudeskills.local`
   - Password: `password`
   - Access instructions
   - Environment variable references
2. Added to architecture documentation references

**Prevention:**
- ✅ Always document test credentials in `docs/testing/TEST_CREDENTIALS.md`
- ✅ Check `.env.local` and `docs/testing/` BEFORE asking user for credentials
- ✅ Link credentials doc in `README.md` and `ARCHITECTURE.md`

---

## 🎭 Feature Completeness Standards

### Incident: Analytics Marked as "Complete" Despite Hardcoded Data (2025-12-28)

**What Happened:**
- Agent found `/app/admin/analytics` page in production
- Initially documented it as "✅ Live and fully functional"
- User corrected: "remember our hard rule about no fake or hard coded data? it is not completed feature if hardcoded"
- Page uses AI-generated placeholder metrics, not real data

**Root Cause:**
- Agent didn't apply the "no hardcoded data" standard
- Focused on "does it render?" instead of "does it meet quality standards?"
- Misunderstood "functional" (renders without error) vs "complete" (production-ready with real data)

**Project Standard Violated:**
> **Hard Rule:** No hardcoded or placeholder data in production features. If data is fake, the feature is INCOMPLETE.

**Fixes Implemented:**
1. Marked analytics as "❌ Incomplete (hardcoded data)" in all documentation
2. Added explicit notes about violating project standards
3. Flagged for removal or proper implementation

**Prevention:**
- ✅ Always check if data is hardcoded vs dynamic before marking feature complete
- ✅ "Renders without error" ≠ "Production ready"
- ✅ Apply quality standards, not just technical functionality
- ✅ When in doubt, check if data comes from DB/API or is static

---

## 🔍 Production Validation Process

### Lesson: Incomplete Route Audit

**What Happened:**
- Agent validated specific auth fixes and button styling in production
- User asked: "where are bundles? where are analytics? can you show me screenshots?"
- Multiple orphaned features discovered:
  - `/bundles` - fully functional, no nav link
  - `/app/admin/analytics` - incomplete feature, no nav link
  - `/learn/*` pages - functional, no nav links

**Root Cause:**
- Validation was too narrow (only tested the specific changes made)
- Didn't perform comprehensive route audit
- Didn't proactively identify orphaned or incomplete features

**Best Practice:**
When performing production validation, always:
1. Validate the specific changes deployed
2. **Audit all routes** for orphaned features (exist but no ingress)
3. **Test all major user flows** (signup, skill creation, admin access)
4. **Check for incomplete features** (hardcoded data, placeholder content)
5. **Document findings** with screenshots

**Prevention:**
- ✅ Create production validation checklist
- ✅ Test beyond immediate changes
- ✅ Look for orphaned routes (routes that exist but have no navigation)
- ✅ Screenshot all discovered issues for documentation

---

## 🗺️ Architecture Documentation

### Lesson: Route Mapping Should Be Standard Deliverable

**What Happened:**
- User requested: "you also need to update the Architecture diagram with the routes and urls and reference it as well"
- No comprehensive route map existed
- Had to create `ROUTES.md` from scratch during validation

**Best Practice:**
- Route mapping should be a **standard architectural deliverable**
- Update `docs/ROUTES.md` whenever new routes are added
- Include in architecture documentation

**Structure:**
```markdown
docs/
├── ROUTES.md              # Complete route mapping
├── 02-ARCHITECTURE.md     # References ROUTES.md
├── testing/
│   └── TEST_CREDENTIALS.md # Test accounts
```

**Prevention:**
- ✅ Create/update `ROUTES.md` when adding new routes
- ✅ Document public vs protected vs admin-only routes
- ✅ Include API endpoints
- ✅ Track orphaned routes

---

## 🔐 Credential Management

### Standard: Test Credentials Location

**Established Pattern:**
```
docs/testing/TEST_CREDENTIALS.md
```

**Must Include:**
- Test account emails
- Passwords (for non-magic-link flows)
- Access instructions
- Environment variable reference
- Security notes

**When Creating Test Accounts:**
1. Document immediately in `TEST_CREDENTIALS.md`
2. Add to `.env.local.example` (not `.env.local`)
3. Reference from `README.md` setup instructions

---

## 📋 Checklists

### Pre-Production Deployment Checklist
```markdown
- [ ] All changes validated in local dev
- [ ] Build passes (`npm run build`)
- [ ] No console errors
- [ ] User approval obtained via `notify_user`
- [ ] Deploy workflow followed (`.agent/workflows/deploy.md`)
- [ ] Post-deployment smoke test completed
```

### Production Validation Checklist
```markdown
- [ ] Deployed changes verified (original issue fixed)
- [ ] Full route audit completed (identify orphaned routes)
- [ ] All major user flows tested
- [ ] Admin features tested (if applicable)
- [ ] No console errors in production
- [ ] Screenshots captured for documentation
- [ ] Incomplete features identified and documented
```

### Feature Completeness Checklist
```markdown
- [ ] No hardcoded/placeholder data
- [ ] Data sourced from DB or API
- [ ] UI matches app design system
- [ ] Navigation ingress exists
- [ ] Feature flag configured (if applicable)
- [ ] Documented in relevant guides
```

---

## 🎯 Hard Rules

These rules are **non-negotiable** and have been established through this conversation:

### Rule 1: Deployment Approval
> **NEVER push to production without explicit user approval.**
> - Must call `notify_user` with deployment plan
> - Wait for user to say "push it" or equivalent
> - No exceptions for "simple" or "safe" changes

### Rule 2: No Hardcoded Data
> **Hardcoded or placeholder data means the feature is INCOMPLETE.**
> - "Renders without error" ≠ "Production ready"
> - AI-generated sample data = incomplete
> - Static metrics = incomplete
> - Must use real DB/API data to be considered "complete"

### Rule 3: Credential Documentation
> **Test credentials must be documented immediately upon creation.**
> - Location: `docs/testing/TEST_CREDENTIALS.md`
> - Never lose credentials
> - Check docs BEFORE asking user

### Rule 4: Route Documentation
> **All routes must be documented in `docs/ROUTES.md`**
> - Public vs protected vs admin-only
> - Navigation ingress status
> - Orphaned routes clearly marked

### Rule 5: No Fake Data References (2025-12-29)
> **NEVER hardcode references to data that doesn't exist in the database.**
> - Bundle skill names must match ACTUAL templates/marketplace_skills records
> - Dashboard template buttons must reference REAL template slugs
> - If referencing DB records, VERIFY they exist first
> - "Made up" skill names like "Blog Post Optimizer" when it doesn't exist = BROKEN FEATURE
> - Always query the database or check migrations BEFORE hardcoding references

---

## 📚 Knowledge References

Related Documentation:
- [Deployment Workflow](./deploy.md) - Mandatory approval process
- [Test Credentials](../../docs/testing/TEST_CREDENTIALS.md) - Admin access
- [Application Routes](../../docs/ROUTES.md) - Complete route map
- [Architecture](../../docs/02-ARCHITECTURE.md) - System overview
