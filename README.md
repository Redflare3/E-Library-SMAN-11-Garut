# E-Library SMAN 11 Garut — Frontend

Vue 3 frontend for the SMAN 11 Garut digital library, used on the school's offline LAN. It talks to the Spring Boot backend through `/api`.

## Features
- **Public:** book catalog, search with filters, book detail with an in-browser PDF reader, and the school archive (photos, videos, documents) with a lightbox.
- **Staff** (`/unggahan`, teachers and librarians): upload, edit and delete their own books and archive items.
- **Librarian** (`/admin`): statistics, all books and archive items, users, categories, bulk upload, storage and trash.

## Tech
Vue 3 (`<script setup>`), Vue Router 4, Vite 6, Tailwind CSS v4, Chart.js via vue-chartjs. No state library: auth lives in a small reactive store (`src/stores/auth.js`).

## Getting started
Requires Node.js 18+ and the backend running on `http://localhost:8081` (dev profile).

```bash
npm install
npm run dev      # http://localhost:5173, /api is proxied to :8081 (vite.config.js)
npm run build    # production build in dist/
npm run preview  # serve the build locally
```

Dev login: `admin` / `admin123` (created by the backend when no librarian exists).

## Project structure
```
src/
  api/          backend calls: client.js (fetch + ApiError), upload.js (XHR with progress), one module per area
  stores/       auth store (JWT, session expiry)
  router/       routes and role guards
  layouts/      StaffLayout (sidebar for /unggahan and /admin)
  views/        public pages; staff/ and admin/ screens
  components/   shared UI; staff/ forms and modals; admin/ admin-only parts; ui/ base components
  composables/  toast, upload task, paged lists, thumbnail polling
  utils/        labels and formatters (Indonesian), error messages, chart setup
```

## Production
Serve `dist/` and the API from the **same origin**, with Nginx proxying `/api` to Spring Boot:
- An SPA fallback (`try_files $uri /index.html`), because the router uses HTML5 history.
- `client_max_body_size 2g;` and raised proxy timeouts (about 600 s) for large uploads.

## Docs
- `frontend .md/`: the stage-by-stage implementation plans and manual testing guides (`frontend-plan.md` is the overview).
- `scripts/seed-books.py`: optional script that fills a dev backend with test books.
