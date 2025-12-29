# Sprint 20: User Engagement & Feedback

**Theme**: Create feedback loops and improve user engagement to drive retention and product improvements.

---

## User Stories

### US-1: Contact & Feedback System [M] — Issue TBD

**As a** user with questions or feedback,  
**I want** an easy way to contact the team or submit ideas,  
**So that** I can get help and contribute to the product's improvement.

**Acceptance Criteria:**
- [ ] Contact page at `/contact` with form
- [ ] Support form: Name, Email, Type (Bug/Feature/General), Message
- [ ] Emails sent to team inbox via Resend
- [ ] Auto-response confirmation to user
- [ ] Feedback stored in Supabase `feedback` table
- [ ] Admin view of submitted feedback

**Technical Notes:**
- Reuse Resend infrastructure from Sprint 19
- Create `feedback` table in Supabase
- Options: Contact form vs. embedded Crisp/Intercom widget

**Recommended Approach**: Start with simple contact form (no external dependencies), add live chat widget later if needed.

---

### US-2: User Dashboard Improvements [S]

**As a** returning user,  
**I want** to see my activity summary,  
**So that** I can track my skill creation progress.

**Acceptance Criteria:**
- [ ] Skills created count on dashboard
- [ ] Recent downloads list
- [ ] Quick action buttons (Create, Browse, Share)

---

### US-3: Skill Reviews & Ratings [M]

**As a** marketplace user,  
**I want** to see ratings and reviews for skills,  
**So that** I can make informed download decisions.

**Acceptance Criteria:**
- [ ] 1-5 star rating system
- [ ] Text reviews with author attribution
- [ ] Average rating displayed on skill cards
- [ ] Review moderation by admin

---

### US-4: Notification System [M]

**As a** skill creator,  
**I want** to know when someone downloads my skill,  
**So that** I feel recognized and can track engagement.

**Acceptance Criteria:**
- [ ] In-app notification badge
- [ ] Notification drawer with recent activity
- [ ] Email digest option (weekly summary)

---

### US-5: User Preferences [S]

**As a** user,  
**I want** to customize my experience,  
**So that** the platform works the way I prefer.

**Acceptance Criteria:**
- [ ] Email notification preferences
- [ ] Default skill visibility (public/private)
- [ ] Theme preference persistence

---

## Contact/Feedback Solution Options

| Option | Pros | Cons | Effort |
|--------|------|------|--------|
| **Custom Form** | Full control, no cost, data ownership | Build from scratch | 1-2 days |
| **Crisp** | Live chat, free tier, easy setup | External dependency | 2 hours |
| **Intercom** | Full support suite, AI assist | Expensive, overkill for MVP | 2 hours |
| **Tally Forms** | Beautiful, embeddable, free | Limited customization | 30 min |

**Recommendation**: Build custom contact form using existing Resend infrastructure. This provides:
- Data ownership (feedback stored in your DB)
- No external dependencies or costs
- Consistent branding
- Admin visibility into all feedback

---

## Sprint Capacity

| Size | Count | Total Points |
|------|-------|--------------|
| Small [S] | 2 | 2 |
| Medium [M] | 3 | 9 |
| **Total** | 5 | 11 |

Estimated duration: 1 week (similar to Sprint 19)

---

## Dependencies

- RESEND_API_KEY configured (from Sprint 19)
- Supabase `feedback` table migration

---

## Success Metrics

- Contact form submission rate
- Average response time to feedback
- User engagement increase (return visits)
- Review submission rate for marketplace skills
