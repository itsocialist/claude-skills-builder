# GetClaudeSkills Route Documentation

## Public Routes (No Auth Required)

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing Page | Marketing homepage |
| `/marketplace` | Marketplace | Browse public skills |
| `/marketplace/[slug]` | Skill Detail | View skill details |
| `/bundles` | Power Bundles | Curated skill collections |
| `/learn/*` | Learn Hub | Educational content |

## App Routes (Auth Optional/Required)

### Dashboard & Core Features
| Route | Page | Auth | Feature Flag | Description |
|-------|------|------|--------------|-------------|
| `/app` | Dashboard | Optional | - | Main app dashboard |
| `/app/builder` | Skill Builder | Required | `feature_builder` | Visual skill builder |
| `/app/templates` | Templates List | Optional | `feature_templates` | Browse templates |
| `/app/templates/[slug]` | Template Detail | Optional | `feature_templates` | View/use template |
| `/app/inspector` | Inspector | Optional | `feature_inspector` | Validate .skill files |
| `/app/packages` | Packages List | Public | `feature_packages` | Browse packages |
| `/app/packages/new` | Create Package | Required | `feature_packages` | Create new package |

### User Features
| Route | Page | Auth | Feature Flag | Description |
|-------|------|------|--------------|-------------|
| `/app/library` | My Skills | Required | `feature_myskills` | User's skill library |
| `/app/settings/team` | Team Settings | Required | - | Team management |

### Organization
| Route | Page | Auth | Feature Flag | Description |
|-------|------|------|--------------|-------------|
| `/app/org` | Org Dashboard | Required | `feature_organization` | Organization overview |
| `/app/org/[id]/members` | Org Members | Required | `feature_organization` | Manage members |
| `/app/org/[id]/settings` | Org Settings | Required | `feature_organization` | Org configuration |
| `/app/org/[id]/audit` | Audit Log | Required | `feature_organization` | Activity history |

### Admin Routes (Admin Only)
| Route | Page | Auth | Description |
|-------|------|------|-------------|
| `/app/admin` | Admin Dashboard | Admin | Main admin interface |
| `/app/admin/users` | User Management | Admin | Manage users |
| `/app/admin/features` | Feature Flags | Admin | Toggle features |
| `/app/admin/settings` | Site Settings | Admin | Configure site |

## API Routes

### Inspector API
| Route | Method | Description |
|-------|--------|-------------|
| `/api/inspector` | POST | Validate skill files (.md, .zip, .skill) |

### Template API
| Route | Method | Description |
|-------|--------|-------------|
| `/api/templates` | GET | Fetch templates from database |

## Common 404 Issues

### Wrong Routes (These DO NOT exist)
- ❌ `/inspector` → Use `/app/inspector` instead
- ❌ `/admin` → Use `/app/admin` instead
- ❌ `/templates` → Use `/app/templates` instead

### Navigation Links
All Shell sidebar links use `/app/*` paths. Direct navigation to root-level routes will 404 unless explicitly defined.

## Route Testing Checklist

Before deploying:
- [ ] Verify all `/app/*` routes render correctly
- [ ] Check feature flag gating works
- [ ] Test auth redirects for protected routes
- [ ] Verify 404 page shows for invalid routes
- [  ] Test dynamic routes (marketplace/[slug], templates/[slug])

## Adding New Routes

1. Create page file: `src/app/[route]/page.tsx`
2. Add to Shell navigation (if needed): `src/components/layout/Shell.tsx`
3. Update feature flags (if feature-gated): `src/lib/flags.ts`
4. Add to this documentation
5. Test route access and auth behavior
