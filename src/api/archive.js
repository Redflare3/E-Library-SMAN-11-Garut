import { request } from './client.js'
import { upload, jsonPart } from './upload.js'

// GET /api/archive → Page<ArchiveSummary>. `page` dimulai dari 0, `sort` berupa kata kunci
// (newest, title, popular, date). `from`/`to` = rentang tanggal kegiatan "YYYY-MM-DD".
export function listArchive({ q, categoryId, mediaType, from, to, sort, page = 0, size = 24 } = {}) {
  return request('/archive', {
    query: { q: q?.trim(), categoryId, mediaType, from, to, sort, page, size }
  })
}

// GET /api/archive/{id} → ArchiveDetail (404 bila tidak ada / STAFF untuk anonim)
export function getArchive(id) {
  return request(`/archive/${encodeURIComponent(id)}`)
}

// URL berkas mentah (dipakai langsung di <img>/<video>/<iframe>/<a> untuk item PUBLIC)
export const archiveThumbnailUrl = (id) => `/api/archive/${id}/thumbnail`
export const archiveFileUrl = (id) => `/api/archive/${id}/file`
export const archiveDownloadUrl = (id) => `/api/archive/${id}/download`

// ---------- Staf (guru & pustakawan) ----------

// GET /api/archive/mine → Page<ArchiveSummary> milik pengguna saat ini (terbaru dulu)
export function listMyArchive({ page = 0, size = 10 } = {}) {
  return request('/archive/mine', { query: { page, size } })
}

// POST /api/archive (multipart: file, metadata JSON) → { promise, abort }. mediaType dideteksi server.
export function createArchive({ file, metadata, onProgress }) {
  return upload('/archive', {
    parts: [
      ['file', file],
      ['metadata', jsonPart(metadata)]
    ],
    onProgress
  })
}

// PUT /api/archive/{id}: hanya field yang dikirim yang diubah
export function updateArchive(id, patch) {
  return request(`/archive/${encodeURIComponent(id)}`, { method: 'PUT', body: patch })
}

// DELETE /api/archive/{id} → 204 (soft delete)
export function deleteArchive(id) {
  return request(`/archive/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
