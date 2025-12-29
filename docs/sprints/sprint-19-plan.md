# Sprint 19 Plan

**Sprint Theme:** Growth & Marketing Infrastructure  
**Start Date:** 2025-12-29  
**Status:** 📋 Ready

---

## Sprint Goals
1. Improve organic discoverability (SEO)
2. Enable viral growth (Social Sharing)
3. Activate captured users (Email Sequence)
4. Measure funnel performance (Analytics)
5. Protect platform resources (Rate Limiting)

---

## Backlog

| # | Story | Size | Priority |
|---|-------|------|----------|
| 1 | SEO Optimization | S | 🥇 Critical |
| 2 | Social Sharing (OG Images) | S | 🥈 High |
| 3 | Email Onboarding Sequence | M | 🥉 High |
| 4 | Analytics Dashboard Enhancements | M | Medium |
| 5 | API Rate Limiting | S | Medium |

---

## Story Details

### 1. SEO Optimization [S]
- Meta tags (title, description) per page
- Generate `/sitemap.xml` for marketplace
- JSON-LD structured data for skills
- Canonical URLs
- `robots.txt`

### 2. Social Sharing [S]
- Dynamic OG images via Vercel OG
- Twitter card meta tags
- LinkedIn preview optimization
- Share buttons on skill pages

### 3. Email Onboarding Sequence [M]
- Provider: Resend (recommended)
- 3-email drip sequence:
  1. Welcome (immediate)
  2. Tutorial (Day 1)
  3. Share prompt (Day 3)
- Track opens/clicks

### 4. Analytics Dashboard [M]
- Onboarding funnel visualization
- Historical trend charts (30 days)
- CSV export
- Email capture conversion rate

### 5. API Rate Limiting [S]
- 10 req/min per IP (unauth)
- 30 req/min (authenticated)
- Return 429 with retry-after
- In-memory store (simple)

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Lighthouse SEO Score | > 90 |
| Social shares/week | > 10 |
| Email open rate | > 40% |
| Onboarding completion | > 60% |

---

## Sprint 18 Retrospective

### What Went Well
- ✅ A/B comparison exceeded expectations
- ✅ Parallel streaming worked flawlessly
- ✅ 10 quick-start templates (2x planned)
- ✅ Deployment workflow formalized

### Lessons Learned
- Always test on correct production URL
- Browser testing more efficient on lighter model
- Marketing input early = better prioritization
