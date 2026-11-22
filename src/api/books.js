import { request } from './client.js'
import { upload, jsonPart } from './upload.js'

// GET /api/books → Page<BookSummary>. `page` dimulai dari 0, `sort` berupa kata kunci.
export function listBooks({ q, categoryId, grade, type, sort, page = 0, size = 20 } = {}) {
  return request('/books', {
    query: { q: q?.trim(), categoryId, grade, type, sort, page, size }
  })
}

// GET /api/books/{id} → BookDetail (404 bila tidak ada / STAFF untuk anonim)
export function getBook(id) {
  return request(`/books/${encodeURIComponent(id)}`)
}

// URL berkas mentah (dipakai langsung di <img>/<iframe>/<a> untuk item PUBLIC)
export const bookCoverUrl = (id) => `/api/books/${id}/cover`
export const bookFileUrl = (id) => `/api/books/${id}/file`
export const bookDownloadUrl = (id) => `/api/books/${id}/download`

// ---------- Staf (guru & pustakawan) ----------

// GET /api/books/mine → Page<BookSummary> milik pengguna saat ini (terbaru dulu)
export function listMyBooks({ page = 0, size = 10 } = {}) {
  return request('/books/mine', { query: { page, size } })
}

// POST /api/books (multipart: file, cover?, metadata JSON) → { promise, abort }
export function createBook({ file, cover, metadata, onProgress }) {
  return upload('/books', {
    parts: [
      ['file', file],
      ['cover', cover || null],
      ['metadata', jsonPart(metadata)]
    ],
    onProgress
  })
}

// PUT /api/books/{id}: hanya field yang dikirim yang diubah; `title` wajib ada
export function updateBook(id, patch) {
  return request(`/books/${encodeURIComponent(id)}`, { method: 'PUT', body: patch })
}

// PUT /api/books/{id}/file (multipart: file) → { promise, abort }
export function replaceBookFile(id, file, onProgress) {
  return upload(`/books/${encodeURIComponent(id)}/file`, {
    method: 'PUT',
    parts: [['file', file]],
    onProgress
  })
}

// DELETE /api/books/{id} → 204 (soft delete; dipulihkan pustakawan)
export function deleteBook(id) {
  return request(`/books/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
