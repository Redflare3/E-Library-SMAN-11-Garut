import { request } from './client.js'

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
