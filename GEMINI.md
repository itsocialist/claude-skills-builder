# Antigravity Agent Protocols

**SYSTEM INSTRUCTION**: This file contains MANDATORY protocols for all agent operations. You must adhere to these rules when using tools.

## 🟢 Browser Workflow (MANDATORY)

**Trigger**: When asked to "open browser", "test", "verify", "debug UI", or "take screenshot".

### Headless by Default
- **ALWAYS** assume the user wants `headless: true` unless they explicitly type "Watch Mode".
- Do **NOT** bring the window to focus.

### Session Hygiene
- **Check First**: Before calling `browser.launch()`, check `browser.contexts()` for an active session.
- **Limit**: Max 2 tabs open at once. If >2, call `page.close()` on the oldest non-active tab.
- **Cleanup**: Upon task completion, you **MUST** close any tab you opened unless the user asked to "keep it open".

### Navigation Robustness (Anti-Flake)
- You are using `gemini-2.5-computer-use` (or `claude-3-5-sonnet`).
- **Wait Step**: After every `click()` or `goto()`, you **MUST** wait for `networkIdle` or a specific selector.
- **Scroll**: You cannot click what you cannot see. Always `scrollIntoView` before clicking.
- **Retry**: If a selector fails, do **NOT** guess. Dump the HTML to a log file and stop.

## 📸 Documentation & Verification

**Trigger**: When asked to "document" or "capture".

### Screenshots
- **Save to**: `.antigravity/artifacts/screenshots/`
- **Naming**: `YYYY-MM-DD_{feature_name}.png`
- **Constraint**: Do not take screenshots of blank loading screens. Wait 1000ms after load.

### Clean Screenshot Mode (Marketing/Documentation Only)
When capturing screenshots for **marketing** or **documentation** purposes, inject this CSS before capture to remove focus indicators:
```javascript
await page.addStyleTag({
  content: `
    *:focus { outline: none !important; box-shadow: none !important; }
    *::selection { background: transparent !important; }
  `
});
```
- **Trigger**: User says "marketing", "documentation", "clean screenshot", or "for docs"
- **Do NOT** use during debugging or interactive testing (the focus indicator helps verify clicks)

### Video Recording
- Only record if the user says "record" or "video".
- **Save to**: `.antigravity/artifacts/recordings/`

## 🛡️ User Validation

When a task is done, you must generate a verification report in the chat:

```
✅ Task Complete
URL: [Link]
Status: ✅ Success / ❌ Fail
Artifact: [Link to Screenshot]
```
