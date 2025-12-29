---
description: Template for sprint planning documents with user stories and acceptance criteria
---

# Sprint Planning Template

When creating a new sprint plan, use this structure:

## 1. Header
```markdown
# Sprint [N] Plan

**Sprint Theme:** [Theme Name]  
**Start Date:** YYYY-MM-DD  
**Status:** 📋 Planning | 📋 Ready | 🚧 Active | ✅ Complete
```

## 2. Sprint Goals
List 3-5 high-level goals as bullet points.

## 3. User Stories Format

For EACH story, use this format:

```markdown
### US-[N]: [Story Title] [Size] — Issue #[N]

**As a** [persona/role],  
**I want** [feature/capability],  
**So that** [benefit/value].

**Acceptance Criteria:**
- [ ] Specific, testable criterion 1
- [ ] Specific, testable criterion 2
- [ ] ...

**Technical Notes:**
- Files to modify
- Dependencies
- Implementation hints
```

### Size Estimates
- **[S]** = Small (< 4 hours)
- **[M]** = Medium (4-8 hours)
- **[L]** = Large (> 8 hours, consider splitting)

## 4. Definition of Done
Standard checklist (copy to each sprint):
```markdown
## Definition of Done
- [ ] Code reviewed and merged to `main`
- [ ] Deployed to production
- [ ] Acceptance criteria verified
- [ ] Documentation updated if needed
```

## 5. Success Metrics
Table with measurable targets.

## 6. Retrospective
Previous sprint learnings (what went well, lessons learned).

---

## Example User Story

```markdown
### US-1: User Login [S] — Issue #42

**As a** returning user,  
**I want** to log in with my email,  
**So that** I can access my saved skills.

**Acceptance Criteria:**
- [ ] Magic link email sent within 5 seconds
- [ ] Link expires after 1 hour
- [ ] User redirected to /app after login
- [ ] "Welcome back" toast displayed

**Technical Notes:**
- Uses Supabase Auth
- Files: `AuthProvider.tsx`, `callback/route.ts`
```
