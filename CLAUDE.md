# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Vue 3 frontend for the SMAN 11 Garut digital library, used on the school's **offline LAN**. It talks to a separate Spring Boot backend through `/api`. Stack: Vue 3 (`<script setup>`), Vue Router 4, Vite 6, Tailwind CSS v4 (via `@tailwindcss/vite`, no config file), Chart.js via vue-chartjs. Plain JavaScript, no TypeScript, no Pinia.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173; /api is proxied to http://localhost:8081 (vite.config.js)
npm run build    # production build in dist/
npm run preview  # serve the build
```

There is no linter and no test suite. Verify changes with `npm run build` and manual testing against a running backend (dev profile on :8081; dev login `admin` / `admin123`). `scripts/seed-books.py` optionally fills a dev backend with test books.

## Language conventions

UI text, route names/paths (`/unggahan`, `/arsip`, `/admin/pengguna`), view file names (`BukuSayaView`, `PenyimpananView`) and code comments are in **Indonesian**. Keep new UI strings and comments in Indonesian. User-facing labels and formatters live in `src/utils/labels.js`; error messages per backend `code` live in `src/utils/errors.js` (`errorMessage(err)`).

## Backend contract

`frontend-guide.md` is the authoritative API contract (auth, response shapes, files, uploads, error codes). Read the relevant section before touching API code; code comments cite it as `frontend-guide §N`. Non-obvious rules the code depends on:

- A wrong password is `400 INVALID_CREDENTIALS`, not `401` — the login call uses `skipAuthRedirect`.
- An expired/invalid token on a **public** endpoint is silently treated as anonymous (no `401`), so the client decodes the JWT `exp` and logs out proactively.
- `<img>/<video>/<iframe>/<a>` can't send the `Authorization` header, so `STAFF`-visibility media must be fetched as blobs (`src/api/media.js`, `useMediaUrl`). `PUBLIC` items use plain URLs. Never build URLs from `thumbnailPath`.
- Multipart `metadata` must be a `Blob` of type `application/json` (`jsonPart()` in `src/api/upload.js`); never set `Content-Type` manually on multipart.
- `PUT` updates only the fields sent (`null` = unchanged, fields can't be cleared); book updates must include `title`. Archive `visibility` defaults to `STAFF`, books to `PUBLIC`.
- `DELETE` moves items to the trash; librarians restore via `/api/admin/.../restore`.
- Archive thumbnails/dimensions are filled in the background after upload (`useThumbnailPolling` polls and adds a `?v=` cache buster).

## Architecture

**API layer (`src/api/`)**
- `client.js`: `request(path, { method, query, body, auth, skipAuthRedirect })` wraps `fetch`, prefixes `/api`, attaches the bearer token on every call (public ones too, it unlocks `STAFF` items), drops empty query params, and throws a normalized `ApiError { status, code, message, fieldErrors }`. Non-JSON error bodies (Nginx/proxy) map to fallback codes (`FILE_TOO_LARGE`, `SERVER_UNREACHABLE`, `NETWORK_ERROR`). A `401` calls a global handler registered from `main.js` (so the client doesn't import the router).
- `upload.js`: XHR-based multipart upload (fetch can't report upload progress); returns `{ promise, abort }`, rejects with `ApiError` code `ABORTED` on cancel.
- `token.js`: localStorage access for token/user, kept separate so `client.js` and `stores/auth.js` don't import each other (avoid circular imports).
- One module per backend area: `auth`, `books`, `archive`, `categories`, `meta`, `admin`, `media`.

**Auth (`src/stores/auth.js`)**: a module-level reactive store (exported `auth` / `useAuth()`). `init()` restores the session once via `GET /auth/me` (keeps the cached session if the backend is merely unreachable), schedules a logout timer at the JWT `exp`, and re-checks on `visibilitychange`. Exposes `isLoggedIn`, `isLibrarian`, `isTeacher`, `isStaff`, `canEdit(item)` (librarian always; teacher only if `uploadedById === me.id`; bulk-imported items have `uploadedById: null`) and `homePath()`. Roles are `TEACHER` and `LIBRARIAN` (librarian = admin).

**Routing (`src/router/index.js`)**: all views lazy-loaded. Route `meta` drives behavior: `requiresAuth`, `roles`, `guestOnly`, `hideNavbar`, `title`. The `beforeEach` guard awaits `auth.init()` before checking. `/unggahan/*` (TEACHER, LIBRARIAN) and `/admin/*` (LIBRARIAN) both render inside `layouts/StaffLayout.vue` (sidebar, no public header/footer). The archive lightbox state lives in the `?item=` query, and `scrollBehavior` skips scrolling when only that changes.

**Composables (`src/composables/`)**
- `staffList.js` (`useStaffList`): the paged-list engine for staff and admin tables. Page and filters live in the URL query (`?page=` is 1-based, API is 0-based); it reloads on query change, guards against stale responses, steps back a page when a delete empties the last one, and provides `replaceItem`/`afterCreate`.
- `uploadTask.js`: one upload with progress, "processing" state after the last byte, abort, and a global active-upload counter that installs a `beforeunload` warning; views use `confirmLeaveIfUploading()` in `onBeforeRouteLeave`.
- `toast.js`: a single shared toast shown by `<ToastHost />`, with an optional action (e.g. "Urungkan" undo after delete).

**Components**: `components/ui/` holds base components (`BaseButton`, `BaseModal`, `BaseTable`, ...); `components/staff/` holds forms and modals shared by staff and admin screens (`BookFormModal`, `ArchiveFormModal`, `FilePicker`, `VisibilityField`, `formUtils.js`); `components/admin/` is librarian-only.

## Production

`dist/` and the API are served from the **same origin** by Nginx, which proxies `/api` to Spring Boot. It needs an SPA fallback (`try_files $uri /index.html`, HTML5 history routing), `client_max_body_size 2g;` and ~600 s proxy timeouts for large uploads.

## Docs

`frontend .md/` holds the stage-by-stage implementation plans (`frontend-plan.md` is the overview; all stages are done, each doc has an "As built" note) plus deployment notes for the LAN router and Ubuntu server. `frontend-guide.md` references a `backend-spec.md` that lives in the backend repo, not here.
