---
description: "Feature Kickoff Protocol: Standard process for starting new work"
---

# Feature Kickoff Protocol

Use this workflow to establish a solid foundation before writing any code.

## 1. Governance Check
- [ ] **Review Rules:** Read `.agent/rules.md` to refresh on Anti-Vibe and Technical standards.
- [ ] **Review Task:** Check `task.md` to ensure this work is scheduled and high priority.

## 2. Knowledge Discovery
- [ ] **Check KIs:** Review Knowledge Items summaries for relevant existing patterns.
- [ ] **Check Docs:** Review `REFERENCE-CLAUDE-SKILLS-ARCHITECTURE.md` if architectural changes are likely.

## 3. Planning Phase
- [ ] **Create Plan:** Create or update `implementation_plan.md`.
    - Must include: User Review Required section (if any API changes).
    - Must include: Verification Plan (Automated + Manual).
- [ ] **Anti-Vibe Audit:** explicitly state how the new UI will meet "Density" and "Context" rules.

## 4. User Alignment
- [ ] **Request Review:** Use `notify_user` to present the plan.
- [ ] **Wait for Approval:** Do not proceed to EXECUTION until plan is approved.

## 5. Execution Start
- [ ] **Task Boundary:** Call `task_boundary` with Mode: PLANNING first, then switch to EXECUTION once approved.
