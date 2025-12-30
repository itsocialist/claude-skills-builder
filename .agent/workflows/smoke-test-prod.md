---
description: Browser-based smoke test for production site (getclaudeskills.ai)
---

# Smoke Test Production

Visual verification of production site functionality using browser testing.

## Pre-requisites
- Run `/check-prod-deployment` first to confirm deployment succeeded

## Steps

1. **Homepage Check**
   - Navigate to https://getclaudeskills.ai/
   - Verify branding shows "GetClaudeSkills"
   - Check nav sidebar loads with correct labels

2. **Marketplace Check**
   - Navigate to https://getclaudeskills.ai/marketplace
   - Verify skill cards are visible
   - Click on one skill to verify detail page loads

3. **Power Bundles Check**
   - Navigate to https://getclaudeskills.ai/bundles
   - Verify page title shows "Power Bundles"
   - Test "Get This Bundle" button (should show toast and download)

4. **Skill Inspector Check**
   - Navigate to https://getclaudeskills.ai/app/inspector
   - Verify page title shows "Skill Inspector"
   - Verify upload area mentions supported formats

5. **Capture Evidence**
   - Take screenshots of each page
   - Save to `.antigravity/artifacts/screenshots/`
   - Naming: `YYYY-MM-DD_prod_{page}.png`

## Success Criteria
- All pages load without errors
- Branding is consistent ("GetClaudeSkills")
- Bundle downloads work
- No console errors visible
