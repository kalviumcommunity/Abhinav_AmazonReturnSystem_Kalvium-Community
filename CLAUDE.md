# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

An Amazon-style returns management system, split into two **independent Next.js apps** in this monorepo:

- `backend/` — Next.js App Router used purely as a REST API (route handlers under `src/app/api`), backed by Postgres via Prisma.
- `frontend/` — Next.js App Router seller dashboard UI. Currently renders entirely from static mock data in `frontend/app/data/mockData.ts` — no `fetch` calls to `backend/` exist yet. When wiring the UI to real data, that's the integration point to build.

Each app has its own `package.json`, `node_modules`, and dev server (both default to port 3000, so don't run both `next dev` commands simultaneously without changing one's port).

## Commands

Run from inside `backend/` or `frontend/` respectively — there is no root-level package.json or workspace tooling tying them together.

```bash
npm run dev     # start dev server (next dev)
npm run build   # production build
npm run start   # run production build
npm run lint    # eslint
```

Backend-only (Prisma):

```bash
npx prisma generate       # regenerate client into src/generated/prisma (gitignored)
npx prisma migrate dev    # create/apply a migration (no migrations exist yet — schema.prisma has not been migrated)
npx prisma studio         # inspect the DB
```

The backend requires `DATABASE_URL` (Postgres) and `JWT_SECRET` env vars — see `backend/.env.example`, `backend/prisma.config.ts`, `backend/src/lib/prisma.ts`, and `backend/src/lib/auth.ts`.

Seed a test user (`seller@example.com` / `password123`) via `npx prisma db seed` (wired through `prisma.config.ts` → `prisma/seed.ts`, run with `tsx`).

There is no test runner configured in either app.

## Backend architecture

- Prisma schema: `backend/prisma/schema.prisma`. Models: `ReturnRequest` (status is an enum: `PENDING`, `APPROVED`, `REJECTED`, `AUTO_APPROVED`), `AuditLog` (1-to-many off `ReturnRequest`), and `User` (email/passwordHash/role, for auth). Every state change on a `ReturnRequest` should be paired with an `AuditLog` row written in the same `prisma.$transaction`.
- Prisma client is generated to `backend/src/generated/prisma` (gitignored) and imported from `@/lib/prisma` (`backend/src/lib/prisma.ts`), which wraps it in a `PrismaPg` adapter and caches the instance on `globalThis` in dev to avoid connection exhaustion from hot-reload.
- **Auth**: `backend/src/lib/auth.ts` issues/verifies JWT sessions (`signSession`/`verifySession`, `SESSION_TTL_SECONDS` 24h). `POST /api/auth/login` (`backend/src/app/api/auth/login/route.ts`) checks email/bcrypt-hashed password against `User`, then both sets an httpOnly `session` cookie and returns the token in the JSON body (for `Authorization: Bearer <token>` clients). Route handlers guard themselves with `requireSession(request)`, which reads the token from the `session` cookie or a `Bearer` header and returns either `{ session }` or a ready-to-return 401 `{ response }` — always check `if (auth.response) return auth.response;` first. All routes under `backend/src/app/api/returns/` (list, detail, approve, reject) are guarded this way; `decidedBy`/`actor` on approve/reject now come from `auth.session.email` instead of a hardcoded value.
- API routes live under `backend/src/app/api/returns/` — `route.ts` (list), `[id]/route.ts` (detail), `[id]/approve/route.ts`, `[id]/reject/route.ts`. Approve/reject follow the same pattern: look up the `ReturnRequest`, 404 if missing, 409 if `status !== "PENDING"`, then `$transaction([update, auditLog.create])` and return the updated record + audit log as JSON. `reject` additionally requires and validates a non-empty `reason` string in the JSON body.
- `backend/src/app/health/route.ts` is still a stub/placeholder handler (returns static JSON) and is intentionally unauthenticated.
- `backend/src/lib/errors.ts` defines an `ApiError` class that is not currently used by any route (routes catch errors ad hoc and return `{ error: message }` inline) — follow the existing ad hoc pattern in new routes unless asked to refactor towards `ApiError`.

## Frontend architecture

- App Router pages: `frontend/app/dashboard/page.tsx` (seller dashboard) and `frontend/app/returns/page.tsx` + `frontend/app/returns/[id]/page.tsx` (returns list/detail).
- All data currently comes from `frontend/app/data/mockData.ts`, which defines the shapes (`ReturnRequest`, `ReturnStatus` as UI-facing strings like `"Pending"`/`"Auto Approved"`, `SummaryCard`, `DailyActivity`) that components consume. Note the UI's `ReturnStatus` strings differ in casing/format from the Prisma enum (`PENDING` vs `"Pending"`) — a real integration needs a mapping layer.
- Shared layout/chrome components (`TopNav`, `Sidebar`) live in `frontend/app/components/` alongside presentational components (`SummaryCard`, `ReturnActivityChart`, `RecentReturnsTable`, `QuickActions`, `StatusBadge`).
- Styling is plain CSS via `frontend/app/globals.css` with BEM-ish class names (e.g. `dashboard-layout__body`, `summary-cards-grid`) — no CSS-in-JS or component-scoped stylesheets; Tailwind is present as a devDependency but the existing components don't use utility classes.

## Notes

- `backend/AGENTS.md` and `frontend/AGENTS.md` (auto-generated by `next dev`, re-created on every dev server start) warn that this Next.js version may differ from training data — check `node_modules/next/dist/docs/` in the respective app before relying on assumed Next.js APIs/conventions.
- This is a Kalvium community team project (see `README.md`); PRs merge into `main` via GitHub, no direct pushes to `main`.
