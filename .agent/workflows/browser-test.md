---
description: Headless browser testing workflow with anti-flake protocols
---

# Browser Test Workflow

**Pre-requisites**: Ensure `GEMINI.md` protocols are loaded (via `gemini.context.alwaysInclude`).

## Steps

1. **Confirm Test Target**
   - Ask user for the URL or page to test (default: `http://localhost:3000`)
   - Ask what specific element or flow to verify

2. **Launch Browser Session**
   - Use `headless: true` unless user specified "Watch Mode"
   - Check for existing browser context before launching new one
   - Set viewport to 1280x800

3. **Navigate to Target**
   // turbo
   - Call `goto(url)`
   - Wait for `networkIdle` or specific selector
   - Wait 1000ms after load to avoid blank screenshots

4. **Perform Verification**
   - If testing an element: `scrollIntoView` before interacting
   - If clicking: wait for `networkIdle` after click
   - If selector fails: dump HTML to `.antigravity/logs/` and STOP

5. **Clean Screenshot Mode** (Marketing/Documentation Only)
   If user mentioned "marketing", "documentation", "clean", or "for docs":
   // turbo
   - Inject CSS to remove focus indicators:
     ```javascript
     await page.addStyleTag({
       content: `*:focus { outline: none !important; box-shadow: none !important; }`
     });
     ```
   - Wait 100ms for styles to apply
   - Skip this step for debugging/testing (focus indicators help verify clicks)

6. **Capture Screenshot**
   // turbo
   - Save to: `.antigravity/artifacts/screenshots/`
   - Naming: `YYYY-MM-DD_{feature_name}.png`
   - Example: `2025-12-28_login_form.png`

6. **Cleanup**
   // turbo
   - Close all tabs opened during this session
   - Exception: if user said "keep it open"

7. **Generate Verification Report**
   Output in chat:
   ```
   ✅ Task Complete
   URL: [tested URL]
   Status: ✅ Success / ❌ Fail
   Artifact: [link to screenshot]
   ```

## Quick Reference

| Trigger | Action |
|---------|--------|
| "test [url]" | Run full workflow |
| "verify [element]" | Navigate + check element exists |
| "screenshot [page]" | Navigate + capture only |
| "Watch Mode" | Run with `headless: false` |
