# GetClaudeSkills Platform

**Tagline:** "Claude Skills: Find, Build and Bundle"  
**Production:** [https://getclaudeskills.ai](https://getclaudeskills.ai)

## Overview
A comprehensive enterprise skill management platform for building, testing, and sharing Claude AI skills. Features include a visual node-based builder, template library, and organization management.

## Documentation
- **User Guide:** [docs/USER_GUIDE.md](docs/USER_GUIDE.md)
- **Architecture:** [docs/02-ARCHITECTURE.md](docs/02-ARCHITECTURE.md)
- **Current Status:** [docs/00-CURRENT-STATUS.md](docs/00-CURRENT-STATUS.md)

## Tech Stack
- **Frontend:** Next.js 16 (App Router), Tailwind CSS v4, Shadcn/UI
- **Backend:** Supabase (Auth, DB, RLS)
- **State:** Zustand
- **Tooling:** Biome, Vitest, Playwright

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Copy `.env.local.example` to `.env.local` and populate Supabase keys.

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## Governance
This project follows strict engineering and design standards.
- **Rules:** `.agent/rules.md`
- **Workflows:** `.agent/workflows/`
