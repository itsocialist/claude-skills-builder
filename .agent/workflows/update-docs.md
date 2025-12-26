---
description: Update documentation after completing a feature
---

# Documentation Update Workflow

After completing and validating any feature, update the relevant documentation:

## Steps

1. Determine if the feature is user-facing or admin-only

2. For **user-facing features**, update `docs/USER_GUIDE.md`:
   - Add a new section or update existing section
   - Include: feature name, location (route), step-by-step instructions
   - Update the "Last updated" date at the top

3. For **admin features**, update `docs/ADMIN_GUIDE.md`:
   - Add a new section or update existing section
   - Include: requirements, location, step-by-step instructions
   - Update the "Last updated" date at the top

4. Commit documentation with feature changes:
   ```bash
   git add docs/USER_GUIDE.md docs/ADMIN_GUIDE.md
   git commit -m "docs: update guides for [feature name]"
   ```

## Documentation Standards

- Keep instructions concise and numbered
- Include route paths in parentheses, e.g., (`/app/library`)
- Use **bold** for UI element names
- Update the date stamp when making changes
