# Sumaq CMS Agent Guidelines

Workspace instructions for developing Sumaq CMS—a Nuxt 4 admin panel with authentication, role-based access, and GitHub integration.

## Project Overview

Sumaq CMS is a multi-user admin panel built with Nuxt 4 + Nitro server routes, Drizzle ORM, and Nuxthub. The project combines frontend pages/components with backend API routes, supports PostgreSQL and PGlite for local development, and integrates with GitHub App for repository access.

**Current scope**: Authentication, user management, admin dashboard, GitHub integration, and infrastructure for site management modules.

## Build and Test

**Installation**
```bash
pnpm install
```

**Development**
```bash
pnpm dev              # Start on http://localhost:3000
pnpm lint             # ESLint
pnpm typecheck        # TypeScript strict validation
```

**Testing**
```bash
pnpm test             # All tests
pnpm test:unit        # Unit tests (Vitest, node env)
pnpm test:nuxt        # Component tests (happy-dom)
pnpm test:e2e         # Playwright
```

**Production**
```bash
pnpm build
pnpm preview
```

## Code Style

- **Quotes**: Single (JS/TS), double (Vue templates) — enforced by ESLint
- **Semicolons**: None — enforced by ESLint  
- **Formatting**: Trailing commas never — ESLint config in `nuxt.config.ts`
- **Components & Composables**: Use `<script setup>` syntax; auto-import enabled
- **Styling**: Tailwind CSS 4 + Nuxt UI components only; no custom CSS except `app/assets/css/main.css`
- **Types**: TypeScript strict mode; shared types in `shared/types/`, API types in route handler files

## Architecture

```
app/
  ├─ pages/          File-based routing + layouts (protected via middleware)
  ├─ components/     Reusable Vue components + base subdirectory
  ├─ composables/    useRole, useGitHub + Nuxt auto-imports
  ├─ middleware/     Route guards (auth.global.ts, admin.global.ts)
  ├─ layouts/        main, site, editor, default
  └─ stores/         Pinia store for user preferences

server/
  ├─ api/            Auto-routed Nitro endpoints
  │  ├─ auth/        Login, logout, password recovery
  │  ├─ admin/       User and GitHub management (role-gated)
  │  ├─ github/      OAuth, repos, status, disconnect
  │  └─ health/      DB and blob storage health checks
  ├─ db/             Drizzle schema + migrations
  ├─ middleware/     Server auth guard (currently minimal)
  └─ utils/          audit.ts, encryption.ts, oauth-state.ts

shared/
  ├─ types/          auth.d.ts, clerk.d.ts, db.ts, github.d.ts
  └─ utils/          Shared utilities (date/number formatting, etc.)
```

**Database**: Drizzle ORM with PostgreSQL (Neon HTTP in prod, PGlite in dev); migrations in `server/db/migrations/`.

**Authentication**: `nuxt-auth-utils` with encrypted session cookies. Session managed server-side; client accesses via `useUserSession()`.

**Roles**: `admin`, `owner`, `editor`, `partner`. Protected via middleware and API-level `requireUserSession()` + role checks.

## Conventions

### File Naming
- API routes: `[name].METHOD.ts` (e.g., `login.post.ts`, `users.get.ts`)
- Files/folders: kebab-case (`auth.global.ts`, `main-sidebar.vue`)
- Components: PascalCase (`MainPanelNavbar.vue`)
- Composables: `use*` prefix (`useRole.ts`, `useGitHub.ts`)

### API Route Pattern
1. Validation with Zod
2. `requireUserSession()` to enforce authentication
3. Role checks → throw 403 if insufficient
4. Database operations via `useDrizzle()`
5. `createAuditLog()` for sensitive actions
6. Return response or throw error

### Protected Routes
- **Client**: `auth.global.ts` redirects unauthenticated users to `/login`; authenticated users on `/login` redirect to `/dashboard`
- **Server**: Each API endpoint starts with `requireUserSession()` and role validation
- **Admin only**: `/admin/**` routes gated by `admin.global.ts` middleware

### Database Schema
Edit `server/db/schema.ts` only. Migrations auto-apply on startup. Do not manually edit `server/db/migrations/`.

### i18n
Locales: English, Spanish, German. Strategy: `no_prefix` with browser detection and cookie persistence (`i18n_locale`). Use `$t('key')` in templates, `t('key')` in scripts.

## Key Patterns

**Protected API Route** (`server/api/admin/users.post.ts`)
```typescript
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)   // Enforce auth
  if (session.user.role !== 'admin') throw createError({ statusCode: 403 })  // Role check
  
  const body = await readBody(event)
  const data = yourSchema.parse(body)               // Validate
  
  const db = useDrizzle()
  const result = await db.insert(...).values(data)  // Store
  
  await createAuditLog(session.user.id, 'action', {...}, event)  // Log
  return result
})
```

**Client Composable** (`app/composables/useRole.ts`)
```typescript
const { user } = useUserSession()
const role = computed(() => user.value?.role)
const isAdmin = computed(() => role.value === 'admin')
```

**Route Middleware** (`app/middleware/auth.global.ts`)
- Regex pattern matching for protected routes
- Redirect logic based on `loggedIn` state

## Environment Variables

Required for local dev (can be empty; unused services will auto-fall back):
```bash
NUXT_SESSION_PASSWORD=              # Any string; seals encrypted session cookie
GITHUB_TOKEN_ENCRYPTION_KEY=        # 64-char hex for AES-256-GCM (if using GitHub)
GITHUB_APP_ID=
GITHUB_PRIVATE_KEY=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
DATABASE_URL=                       # Empty = PGlite auto-used
BLOB_READ_WRITE_TOKEN=              # Empty = filesystem auto-used
```

**Note**: If `DATABASE_URL` is unset, PGlite is used automatically. If `BLOB_READ_WRITE_TOKEN` is unset, blob storage uses filesystem (creates `.data/` folder). Both default behaviors work for local development.

## Potential Pitfalls

1. **Database migrations are auto-applied** — Do not manually edit `->`migration files. Only edit `server/db/schema.ts`, then run `npx nuxt db generate` and restart dev.

2. **Session is encrypted and HTTP-only** — Cannot read from client JS. Use `const { user, loggedIn } = useUserSession()` instead.

3. **Role validation must happen in every protected endpoint** — Even if middleware runs server-side, each route handler must explicitly check roles via `requireUserSession()` + comparison.

4. **GitHub encryption key must be hex** — If `GITHUB_TOKEN_ENCRYPTION_KEY` is set, it must be a valid 64-character hex string for AES-256-GCM. Invalid format causes immediate runtime error.

5. **Blob storage creates local `.data/` folder** — Git-ignore this. It's created automatically for local Vercel Blob emulation and filesystem fallback.

6. **i18n translations are not auto-loaded** — Make sure keys exist in `locales/en.json`, `locales/es.json`, `locales/de.json` before using in templates; missing keys will show the key name.

## Documentation Reference

- **Authentication Details**: See `docs/AUTH.md` for composables, API examples, and password recovery flow
- **Database**: See `.github/agents/nuxthub.agent.md` for Nuxthub-specific schema and migration guidance
- **Migrations**: See `docs/UUID_MIGRATION.md` for context on UUID transition
- **Project Overview**: See `README.md` for functionality, stack, and deployment info (Spanish)

## Testing Strategy

- **Unit tests**: Test utilities, helpers, non-UI logic via Vitest in `test/unit/`
- **Component tests**: Test Vue components with `@vue/test-utils` and happy-dom in `test/nuxt/`
- **E2E**: Critical user flows via Playwright in `tests/`

Run `pnpm test:watch` during development to validate changes.

## Common Commands for Agents

```bash
pnpm dev                        # Start dev server
pnpm lint                       # Check code style
pnpm typecheck                  # Validate TypeScript
pnpm test:unit                  # Run unit tests only
pnpm test:e2e                   # Run Playwright tests
pnpm build                      # Production build
npx nuxt db generate            # Generate migration from schema changes
```
