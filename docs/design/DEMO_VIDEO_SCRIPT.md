# Demo Video Script: "The Spreadsheet That Built Itself"

**Length**: 30 seconds
**Core Principle**: Show the Cake first. The "baking" is a 3-second footnote.

---

## Shot Breakdown

| Timecode | Visual | Voiceover / Text |
|----------|--------|------------------|
| 0:00-0:03 | **COLD OPEN**: A beautiful, formatted spreadsheet (Budget Tracker) zooms into frame. Charts, conditional formatting, cell formulas visible. | *(No voiceover, just subtle sound design)* |
| 0:03-0:06 | Camera slowly pans across the spreadsheet. "Q4 Marketing Budget" header, expense categories, totals auto-calculating. | "This spreadsheet just built itself." |
| 0:06-0:10 | A finger taps "Download" on screen. The `.xlsx` file appears in a macOS Downloads folder. User opens it in Excel. | "Fully editable. Real formulas. Yours in seconds." |
| 0:10-0:15 | Cut to: A PDF research report appearing. Then a Pitch Deck. Then a social media image set. Quick montage (1.5s each). | "Spreadsheets. Reports. Decks. Graphics." |
| 0:15-0:18 | Cut back to the GetClaudeSkills homepage. The "What do you want to make?" UI is visible. | "What will you make?" |
| 0:18-0:22 | A user types a single sentence prompt: "Create a Q4 marketing budget for a SaaS startup." Then clicks "Generate". | *(Sound of keyboard, then satisfying click)* |
| 0:22-0:25 | The same beautiful spreadsheet from 0:00 appears, completing the loop. | "That's it. That's the whole thing." |
| 0:25-0:30 | Logo + URL: **GetClaudeSkills.ai** + Tagline: "The output, not the effort." | *(Music sting)* |

---

## Key Metrics
- **Output on screen**: 22 of 30 seconds (73%)
- **Prompt/UI on screen**: 8 seconds
- **Goal**: Viewer remembers the *spreadsheet*, not the chat.

---

## Automated Production Plan

### Infrastructure (Already Exists)
- **Playwright**: Installed at `frontend/node_modules/playwright/`
- **E2E Config**: `playwright.config.ts` with Chromium browser configured.
- **Base URL**: `http://127.0.0.1:3000`

### Recording Strategy
1.  **Enable Video in Playwright Config**:
    Add `video: 'on'` to `playwright.config.ts`:
    ```typescript
    use: {
      baseURL: 'http://127.0.0.1:3000',
      video: 'on', // Records all tests as WebM
      // viewport: { width: 1920, height: 1080 }, // Full HD for marketing
    },
    ```
2.  **Create Dedicated Script**: `e2e/demo-video.spec.ts`
    - Orchestrates the exact user flow from the shot breakdown.
    - Includes deliberate `page.waitForTimeout()` pauses for pacing.
    - Uses `page.screenshot()` for key frames if needed.

### Production Steps (CLI)
```bash
# 1. Start dev server (if not running)
npm run dev &

# 2. Run the dedicated demo spec
npx playwright test e2e/demo-video.spec.ts --project=chromium

# 3. Output is saved to:
#    test-results/demo-video-Demo-Video-Script-chromium/video.webm

# 4. Convert to MP4 (for wider compatibility)
ffmpeg -i video.webm -c:v libx264 -crf 20 demo_video_v1.mp4
```

### Post-Production
- **Music/Voiceover**: Layer audio track using FFmpeg or a simple editor like iMovie/Clipchamp.
- **Intro/Outro Cards**: Stitch logo frames using FFmpeg concat filter.

### GitHub Action (CI/CD - Future)
A dedicated workflow `.github/workflows/generate-demo.yml` could be created to:
1.  Build the app.
2.  Run `e2e/demo-video.spec.ts` with video recording.
3.  Upload `demo_video_v1.mp4` as an artifact.

