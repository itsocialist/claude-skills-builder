# User Guide

> Last updated: 2024-12-26

## Getting Started

### Signing In

1. Visit the application homepage
2. Click **Sign In** in the top navigation
3. Enter your email - you'll receive a magic link
4. Click the link in your email to complete sign-in

---

## Skill Library

Access your saved skills at **Library** (`/app/library`)

### Creating Skills

1. Navigate to **Builder** (`/app/builder`)
2. Fill in skill details: name, description, category, tags
3. Add triggers (example prompts that activate the skill)
4. Write instructions for Claude
5. Click **Save to Library**

### AI-Assisted Building

**Create with AI:** Click to open the AI generator modal:
1. Select an industry (optional)
2. Describe what you want your skill to do
3. Claude generates name, triggers, and instructions
4. Click **Refine** to iterate with feedback, or **Use This Skill** to accept

**Analyze with AI:** Get feedback on manually-created skills:
1. Enter your Claude API Key in the toolbar
2. Click **Analyze with AI**
3. View your score and improvement suggestions

### Managing Skills

From the Library, hover over any skill card to:
- **Edit** - Modify skill details
- **Duplicate** - Create a copy
- **Export** - Download as ZIP
- **Share** - Copy public link to clipboard
- **Delete** - Remove from library

### Sharing Skills

1. Hover over a skill card in Library
2. Click the **Share** icon (visible on hover)
3. Link is copied to clipboard
4. Recipients can view and clone your skill

---

## Templates

Browse pre-built skill templates at **Templates** (`/app/templates`)

### Using Templates

1. Click any template card to view details
2. Review triggers and instructions
3. Click **Use This Template** to load into Builder
4. Customize as needed and save to your Library

### Sharing Templates

1. Open template details
2. Click the **Share** button (next to Download)
3. Template URL is copied to clipboard

### Downloading Templates

Click the **Download** button to get a portable ZIP file.

---

## Skill Inspector

Validate skill files at **Inspector** (`/app/inspector`)

### Validating Files

**Upload a file:**
- Drag and drop `SKILL.md` or `.zip` onto the upload area
- Or click "Select File" to browse

**Paste content:**
- Paste SKILL.md content into the textarea

### Validation Results

- Green checkmarks = valid sections
- Red errors = issues requiring fixes
- Warnings = optional improvements

### AI-Powered Analysis

For deeper feedback powered by Claude:

1. Toggle **AI-Powered Analysis** switch ON
2. Enter your Claude API Key (BYOK)
3. Click **Analyze Skill**
4. View AI suggestions with score (1-10), summary, and actionable recommendations

---

## Exporting Skills

### Single Skill Export

1. Go to Library
2. Hover over skill, open menu
3. Click **Export**
4. ZIP file downloads with SKILL.md

### ZIP Structure

```
skill-name.zip
├── SKILL.md        # Skill definition
└── resources/      # Any attached files
```

---

## Analytics & Insights

View performance metrics for your skills to understand usage patterns.

### Skill Stats
In the **Library** view, each skill card displays:
- **Views**: Total number of times the skill has been viewed or opened.
- **Downloads**: Total number of times the ZIP has been downloaded.

### Detailed Insights
1. Open a skill in the **Builder** (`/app/builder?edit=...`).
2. Click the **Insights** tab in the right-hand Inspector panel.
3. View the **30-Day Trend** chart to see usage over time.
4. Click **Export usage data to CSV** to download a detailed report.

