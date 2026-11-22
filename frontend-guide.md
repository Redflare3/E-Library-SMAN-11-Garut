# Frontend Guide: Perpustakaan Digital Lokal SMAN 11 Garut

> How to build the front-end against this API: auth, response shapes, files, uploads, errors and the traps to avoid. The endpoint list and error code catalog live in [backend-spec.md](backend-spec.md); this guide links to them instead of repeating them.

## 1. Basics

| Topic | Rule |
|---|---|
| Base URL | Same origin. Call `/api/...` with a relative path. Nginx serves the front-end and proxies `/api`, so there is no CORS in production. |
| Dev backend | `http://localhost:8081` (proxy `/api` to it from the dev server, e.g. Vite `server.proxy`). |
| Interactive docs | `http://localhost:8081/swagger-ui.html` and the raw spec at `/v3/api-docs` (dev only). |
| Format | JSON, UTF-8. Uploads are `multipart/form-data`. |
| Dates | `Instant` fields (`createdAt`, `updatedAt`, `startedAt`...) are ISO-8601 UTC strings: `"2026-11-22T03:15:00Z"`. `LocalDate` fields (`eventDate`, `from`, `to`) are `"YYYY-MM-DD"`. |
| IDs | Numbers. Books, archive items, users and jobs use `Long`; categories use `Integer`. |
| Nulls | Optional fields come back as `null`, not omitted. Exceptions: `ApiError.fieldErrors` and `CategoryDto.children` are omitted when empty. |

---

## 2. Auth

### 2.1 Flow

1. Students never log in. Every page works anonymously and shows only `PUBLIC` content.
2. Staff log in with `POST /api/auth/login`:
   ```json
   { "username": "admin", "password": "admin123" }
   ```
   Response `200`:
   ```json
   {
     "token": "eyJhbGciOi...",
     "user": { "id": 1, "username": "admin", "fullName": "Administrator", "role": "LIBRARIAN", "active": true, "createdAt": "2026-11-01T00:00:00Z" }
   }
   ```
3. Store the token (`localStorage` is fine on this offline LAN) and send it on **every** request, public ones included: `Authorization: Bearer <token>`. On public endpoints it unlocks `STAFF` items.
4. On app start, call `GET /api/auth/me` to restore the session. A `401` means the token is no longer valid: clear it.
5. Logout is client-side only: delete the token. There is no logout endpoint.

### 2.2 Things that differ from most APIs

| Behavior | What to do |
|---|---|
| A wrong password returns **`400 INVALID_CREDENTIALS`**, not `401`. | Show "Wrong username or password" on `400`. Don't run your global "session expired" logic for the login call. |
| After 5 failed attempts within 15 minutes the username is locked for 5 minutes: `400 ACCOUNT_TEMPORARILY_LOCKED`. | Show the server's `message`, which says how long to wait. |
| **An expired or invalid token on a public endpoint is silently ignored.** The request runs as anonymous, so `STAFF` items return `404` and lists shrink to `PUBLIC` items. No `401` is sent. | Decode the JWT `exp` claim (no library needed: `JSON.parse(atob(token.split('.')[1])).exp`) and log out proactively when it passes. Don't wait for a `401`. |
| Tokens last 8 hours and cannot be refreshed. | When `exp` is near, ask the user to log in again. |
| A deactivated user's token stops working at once (protected endpoints return `401`). | Same handling as an expired session. |

### 2.3 Roles

`user.role` is `TEACHER` or `LIBRARIAN`. Use it to show or hide UI. The server enforces everything anyway.

| UI | Anonymous | TEACHER | LIBRARIAN |
|---|---|---|---|
| Browse, read, download | `PUBLIC` only | all | all |
| Upload buttons, "My uploads" | hidden | shown | shown |
| Edit / delete on an item | hidden | only when `uploadedById === me.id` | always |
| Admin menu (users, categories, import, stats, storage, restore) | hidden | hidden | shown |

Bulk-imported items have `uploadedById: null`, so only librarians can edit them.

---

## 3. Lists, search and paging

`GET /api/books` and `GET /api/archive` return a page:

```json
{
  "content": [ ... ],
  "page": 0,
  "size": 20,
  "totalElements": 134,
  "totalPages": 7,
  "last": false
}
```

| Parameter | Books | Archive | Notes |
|---|---|---|---|
| `page` | yes | yes | **0-based.** Default `0`. |
| `size` | yes | yes | Default `20`. |
| `q` | yes | yes | Full-text search. 3+ characters use FULLTEXT (word matching); 1–2 characters use a substring match. Debounce input (~300 ms). |
| `categoryId` | yes | yes | Category id from `GET /api/categories`. |
| `grade` | yes | | `X`, `XI`, `XII`, `ALL` |
| `type` | yes | | `EBOOK`, `TEACHING_MODULE`, `QUESTION_BANK`, `SLIDES`, `OTHER` |
| `mediaType` | | yes | `IMAGE`, `VIDEO`, `DOCUMENT` |
| `from`, `to` | | yes | Event date range, `YYYY-MM-DD`. |
| `sort` | yes | yes | A **keyword**, not Spring's `field,dir`: `newest` (default), `title`, `popular`; archive also has `date` (event date, newest first). |

- `GET /api/books/mine` and `/api/archive/mine` take `page` and `size` only and return the same page shape.
- Admin lists (`/admin/users`, `/admin/import`) and `/categories` return plain arrays, not pages.
- Enum values in query strings must be uppercase as shown. An unknown value returns `400`.

### 3.1 Filter dropdowns

`GET /api/meta/filters` gives the values to show, so don't hard-code them:

```json
{
  "gradeLevels": ["X", "XI", "XII", "ALL"],
  "bookTypes": ["EBOOK", "TEACHING_MODULE", "QUESTION_BANK", "SLIDES", "OTHER"],
  "mediaTypes": ["IMAGE", "VIDEO", "DOCUMENT"],
  "curricula": ["Kurikulum Merdeka", "K13"]
}
```

The values are codes; map them to Indonesian labels in the front-end (`TEACHING_MODULE` → "Modul Ajar"). `curricula` lists the free-text values already in use.

### 3.2 Categories

`GET /api/categories?type=BOOK` (default) or `?type=ARCHIVE` returns a tree of root categories:

```json
[
  { "id": 1, "name": "Sains", "parentId": null, "children": [
      { "id": 4, "name": "Fisika", "parentId": 1 }
  ] }
]
```

`children` is **omitted** on leaves, so use `cat.children ?? []`.

---

## 4. Response shapes

TypeScript definitions to copy into the front-end. For generated types, run `npx openapi-typescript http://localhost:8081/v3/api-docs -o src/api/schema.d.ts`.

```ts
type Visibility = 'PUBLIC' | 'STAFF';
type Role = 'TEACHER' | 'LIBRARIAN';
type BookType = 'EBOOK' | 'TEACHING_MODULE' | 'QUESTION_BANK' | 'SLIDES' | 'OTHER';
type GradeLevel = 'X' | 'XI' | 'XII' | 'ALL';
type MediaType = 'IMAGE' | 'VIDEO' | 'DOCUMENT';

interface Page<T> {
  content: T[]; page: number; size: number;
  totalElements: number; totalPages: number; last: boolean;
}

interface User {
  id: number; username: string; fullName: string;
  role: Role; active: boolean; createdAt: string;
}

interface BookSummary {
  id: number; title: string; author: string | null; publisher: string | null;
  publicationYear: number | null; bookType: BookType;
  categoryId: number | null; categoryName: string | null;
  gradeLevel: GradeLevel; curriculum: string | null; visibility: Visibility;
  hasCover: boolean; downloadCount: number; createdAt: string;
}

interface BookDetail extends BookSummary {
  description: string | null;
  originalName: string; mimeType: string; fileSize: number; checksumSha256: string;
  uploadedById: number | null; uploadedByName: string | null; updatedAt: string;
}

interface ArchiveSummary {
  id: number; title: string; mediaType: MediaType;
  eventDate: string | null; visibility: Visibility;
  thumbnailPath: string | null;              // internal, don't use it (see §5.2)
  width: number | null; height: number | null; durationSeconds: number | null;
  viewCount: number; categoryId: number | null; categoryName: string | null;
  createdAt: string;
}

interface ArchiveDetail extends ArchiveSummary {
  description: string | null;
  originalName: string; mimeType: string; fileSize: number; checksumSha256: string;
  uploadedById: number | null; uploadedByName: string | null; updatedAt: string;
}

interface Category { id: number; name: string; parentId: number | null; children?: Category[]; }

interface ApiError {
  status: number; code: string; message: string;
  fieldErrors?: Record<string, string>;
}

interface Health {
  status: 'UP' | 'DEGRADED' | 'DOWN';
  database: 'UP' | 'DOWN';
  storage: 'UP' | 'LOW_SPACE' | 'UNAVAILABLE';
}

interface ImportJob {
  id: number; target: 'BOOK' | 'ARCHIVE'; status: 'RUNNING' | 'COMPLETED' | 'FAILED';
  totalRows: number; succeeded: number; skipped: number; failed: number;
  errors: string[]; startedBy: number | null; startedAt: string; finishedAt: string | null;
}

interface AdminStats {
  totalBooks: number; totalArchiveItems: number; totalDownloads: number;
  downloadsToday: number; downloadsThisWeek: number;
  booksByType: Record<string, number>; archiveByMediaType: Record<string, number>;
  topBooks: { id: number; title: string; author: string | null; downloadCount: number }[];
  dailyDownloads: { date: string; count: number }[];   // 7 days, "YYYY-MM-DD"
}

interface StorageBucket { count: number; bytes: number; trashCount: number; trashBytes: number; }
interface StorageReport {
  available: boolean;
  totalBytes: number | null; usedBytes: number | null; freeBytes: number | null;  // null while the drive is unplugged
  minFreeBytes: number;
  books: StorageBucket;
  archive: Record<MediaType, StorageBucket>;
  thumbnailsBytes: number | null; tempBytes: number | null;
}
```

---

## 5. Files: reading, playing, downloading

### 5.1 Which URL for what

| Need | URL | Use in |
|---|---|---|
| Book cover | `/api/books/{id}/cover` | `<img>`. Always returns an image: the cover, or an SVG placeholder when `hasCover` is false. |
| Archive thumbnail | `/api/archive/{id}/thumbnail` | `<img>`. Placeholder SVG per media type until one is generated. |
| Read a PDF in the page | `/api/books/{id}/file` | `<iframe>` or PDF.js. The server allows same-origin framing. |
| Play a video | `/api/archive/{id}/file` | `<video controls>`. Range support makes seeking work. |
| Show a full image | `/api/archive/{id}/file` | `<img>` in a lightbox. |
| Download | `/api/books/{id}/download`, `/api/archive/{id}/download` | `<a href>`. The server sends `Content-Disposition: attachment` with the original file name (non-ASCII names are fine). This is the only URL that counts a download or view. |

- Only PDFs (and images and videos) display inline in a browser. For `epub`, `docx`, `pptx` and `xlsx` (check `mimeType`), show a download button instead of a reader.
- Videos the browser can't decode (often `.mkv`) fail to play. The server doesn't transcode, so on the `<video>` element's `error` event, show "Can't play in the browser" with a download button.
- Prefer `width`/`height` for the image aspect ratio (avoids layout shift) and `durationSeconds` for a "3:42" badge. All three are `null` until processing finishes, and stay `null` for videos if the server has no `ffmpeg`.

### 5.2 Thumbnails are generated in the background

- After an archive upload, the thumbnail and media fields are filled a few seconds later. The `201` response still has `width`, `height` and `durationSeconds` as `null`.
- Don't build image URLs from `thumbnailPath`. It's an internal disk path; always use `/api/archive/{id}/thumbnail`.
- To show the real thumbnail after an upload, reload the item after a few seconds and add a cache buster to the image URL: `/thumbnail?v=<timestamp>`.

### 5.3 Known limitation: `STAFF` media in `<img>` and `<video>`

The server reads the token **only** from the `Authorization` header. `<img src>`, `<video src>`, `<iframe src>` and `<a href>` can't send that header, so for a `STAFF` item they request as anonymous and get `404`.

| Media | Workaround |
|---|---|
| Covers, thumbnails, images, PDFs | `fetch` with the header, then `URL.createObjectURL(await res.blob())`. Call `URL.revokeObjectURL` when the component unmounts. |
| Downloads | Same blob approach, then click a temporary `<a download="originalName">`. |
| `STAFF` videos | No good workaround: a blob loads the whole file into memory and gives up streaming. Offer download only, or ask the backend for a fix (for example a short-lived signed URL or a cookie). |

`PUBLIC` items have none of these problems: use plain URLs.

```ts
async function authedObjectUrl(url: string, token: string): Promise<string> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw await res.json();
  return URL.createObjectURL(await res.blob());
}
```

---

## 6. Uploads

### 6.1 Multipart format

`POST /api/books` takes the parts `file` (required), `cover` (optional, jpg or png) and `metadata`. `POST /api/archive` takes `file` and `metadata`.

**`metadata` must be a JSON part with `Content-Type: application/json`.** A plain string field fails. Wrap it in a `Blob`:

```ts
const form = new FormData();
form.append('file', file);
if (cover) form.append('cover', cover);
form.append('metadata', new Blob([JSON.stringify({
  title: 'Matematika Kelas X',
  author: 'Tim Penulis',
  bookType: 'EBOOK',
  gradeLevel: 'X',
  categoryId: 4,
  visibility: 'PUBLIC',
})], { type: 'application/json' }));
// Do NOT set Content-Type yourself; the browser adds the multipart boundary.
```

| Book `metadata` field | Required | Default |
|---|---|---|
| `title` | yes (max 255) | |
| `author`, `publisher` | no (max 255) | |
| `publicationYear` | no | |
| `description`, `curriculum` | no | |
| `bookType` | no | `EBOOK` |
| `gradeLevel` | no | `ALL` |
| `categoryId` | no | |
| `visibility` | no | `PUBLIC` |

| Archive `metadata` field | Required | Default |
|---|---|---|
| `title` | yes (max 255) | |
| `description`, `categoryId` | no | |
| `eventDate` | no | `YYYY-MM-DD` |
| `visibility` | no | **`STAFF`** (note: unlike books) |

`mediaType` is detected from the file, so don't send it. Success is `201` with the full detail object.

### 6.2 Accepted files

| Area | Types |
|---|---|
| Books | pdf, epub, docx, pptx, xlsx |
| Covers | jpg, png |
| Archive | images jpg, png, webp, gif; videos mp4, webm, mkv; documents as for books |

- Max 2 GB per request. Check `file.size` before uploading.
- The server checks file **content**, not just the extension. A renamed file returns `400 INVALID_FILE_TYPE`.
- Set `accept` on the file input to match, e.g. `accept=".pdf,.epub,.docx,.pptx,.xlsx"`.

### 6.3 Progress and large files

`fetch` can't report upload progress. For files over a few MB (videos especially), use `XMLHttpRequest` (`xhr.upload.onprogress`) or axios (`onUploadProgress`). After the last byte the server still hashes and moves the file, so show "Processing..." at 100% until the response arrives.

### 6.4 Editing

- `PUT /api/books/{id}` and `PUT /api/archive/{id}` take JSON (same fields as `metadata`) and **update only the fields you send**. `null` or a missing field means "leave unchanged", so a field **can't be cleared** (e.g. removing a category) this way.
- Book updates **must include `title`** (`400 VALIDATION_FAILED` otherwise). Archive updates don't.
- Replace a book's file with `PUT /api/books/{id}/file` (multipart, part `file`). There is no endpoint to replace a cover or an archive file.
- `DELETE` returns `204` and moves the item to the trash. Librarians undo it with `POST /api/admin/books/{id}/restore` or `/api/admin/archive/{id}/restore`.

---

## 7. Errors

Every error has the same body (catalog: [backend-spec.md §4](backend-spec.md#4-errors)):

```json
{ "status": 400, "code": "VALIDATION_FAILED", "message": "Some fields are invalid",
  "fieldErrors": { "title": "Title is required" } }
```

Branch on `code`, not on `message`. Messages are English and meant for developers. Map codes to Indonesian text in the UI.

### 7.1 How the UI should react

| Code | UI |
|---|---|
| `VALIDATION_FAILED` | Show each `fieldErrors[field]` under its form input. |
| `INVALID_CREDENTIALS`, `ACCOUNT_TEMPORARILY_LOCKED` | Error on the login form. |
| `INVALID_OLD_PASSWORD`, `SAME_PASSWORD` | Error on the change-password form. |
| `FILE_REQUIRED`, `INVALID_FILE_TYPE` | Error on the file picker: "File type not supported". |
| `DUPLICATE_FILE` | "This file is already in the library." It may be in the trash, so tell teachers to ask the librarian. |
| `DUPLICATE_USERNAME`, `DUPLICATE_CATEGORY` | Error on the name field. |
| `CATEGORY_IN_USE` | "Move the items out of this category first." |
| `CANNOT_DEACTIVATE_SELF`, `CANNOT_DEACTIVATE_LAST_LIBRARIAN` | Toast with the reason. |
| `IMPORT_ALREADY_RUNNING` | Open the running job instead (see §8). |
| `UNAUTHORIZED` (401) | Session over: clear the token, go to login, then return to the page. |
| `FORBIDDEN` (403) | "You don't have access." Usually means the UI showed a button it shouldn't. |
| `NOT_FOUND` (404) | "Not found" page. For a logged-in user with an expired token, it may be a `STAFF` item (see §2.2). |
| `STORAGE_FULL` (503) | "Server storage is full, contact the librarian." |
| `STORAGE_UNAVAILABLE` (503) | "Files are temporarily unavailable." Browsing still works. |
| `BAD_REQUEST` and other HTTP status names | Spring rejected the request before validation (missing part, bad JSON, wrong enum). A front-end bug: log it and show a generic error. |
| `INTERNAL_ERROR`, `STORAGE_WRITE_FAILED` (500) | Generic "Something went wrong, try again." |

### 7.2 Responses that aren't JSON

- If Nginx or the network fails (upload over `client_max_body_size`, timeout, backend restarting), the body is HTML or empty. Guard `res.json()` with a try/catch and fall back to a generic error by status: `413` too large, `502`/`504` server unreachable.
- A file request with a bad range returns `416` with no JSON body. Browsers handle this themselves.

---

## 8. Admin screens

| Screen | Endpoints | Notes |
|---|---|---|
| Users | `GET/POST /api/admin/users`, `GET/PUT /api/admin/users/{id}` | Create: `{username (3–50), password (6+), fullName, role?}`, role defaults to `TEACHER`. Update: any of `{fullName, password, role, active}`; send only what changed. Deactivate with `{active: false}`; there is no delete. |
| Categories | `POST /api/admin/categories`, `PUT/DELETE /api/admin/categories/{id}` | Create: `{type: "BOOK"\|"ARCHIVE", name (max 100), parentId?}`. **For archive categories, `PUT` and `DELETE` need `?type=ARCHIVE`**, or the server looks in book categories and returns `404`. |
| Stats | `GET /api/admin/stats` | `dailyDownloads` is ready for a 7-day line chart; `booksByType` and `archiveByMediaType` for bar charts. |
| Storage | `GET /api/admin/storage` | Show `freeBytes` against `minFreeBytes` (uploads stop below it). When `available` is false, show "Drive not connected" and hide the disk bar. |
| Import | `POST /api/admin/import` `{target}` → `202` + job; `GET /api/admin/import/{id}`; `GET /api/admin/import` | Poll the job every 2 s while `status === 'RUNNING'`; stop on `COMPLETED` or `FAILED`. Show `succeeded` / `skipped` (duplicates) / `failed` counts and list `errors`. |

---

## 9. Health and offline banner

Poll `GET /api/health` every 30–60 s (and on the window `online` event):

| `status` | HTTP | Show |
|---|---|---|
| `UP` | 200 | Nothing. If `storage === 'LOW_SPACE'`, librarians see "Storage almost full". |
| `DEGRADED` | 200 | Banner: "Files temporarily unavailable." Disable read, play, download and upload buttons; keep browsing on. |
| `DOWN` | 503 | Full-page "Server is having a problem." |
| fetch fails | | "Can't reach the library server. Check the school Wi-Fi." |

---

## 10. Checklist

- [ ] Send the token on every request, public ones included.
- [ ] Log out on the JWT `exp`, not only on `401`.
- [ ] Treat a login `400` as wrong credentials; don't treat it as an expired session.
- [ ] `page` is 0-based; `sort` is a keyword.
- [ ] `metadata` is sent as an `application/json` Blob; `Content-Type` is not set manually.
- [ ] Upload progress uses XHR or axios, not `fetch`.
- [ ] Images use the `/cover` and `/thumbnail` URLs, never `thumbnailPath`.
- [ ] `STAFF` media is loaded via blob URLs (§5.3).
- [ ] Non-PDF books show a download button instead of a reader.
- [ ] Archive category edits and deletes send `?type=ARCHIVE`.
- [ ] Errors branch on `code`, with `fieldErrors` under inputs.
- [ ] `res.json()` on errors is guarded for non-JSON proxy errors.
