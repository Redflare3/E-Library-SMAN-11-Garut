import { request } from './client.js'

// ---------- Endpoint khusus pustakawan (/api/admin/*) ----------

// GET /api/admin/stats → AdminStats (total, unduhan, tren harian, buku teratas, jumlah per jenis)
export function getStats() {
  return request('/admin/stats')
}

// POST /api/admin/books/{id}/restore → BookDetail yang dipulihkan dari tempat sampah
export function restoreBook(id) {
  return request(`/admin/books/${encodeURIComponent(id)}/restore`, { method: 'POST' })
}

// POST /api/admin/archive/{id}/restore → ArchiveDetail yang dipulihkan
export function restoreArchive(id) {
  return request(`/admin/archive/${encodeURIComponent(id)}/restore`, { method: 'POST' })
}

// ---------- Tempat sampah (backend fase 9) ----------
// kind: 'book' | 'archive'
const trashBase = (kind) => (kind === 'archive' ? '/admin/archive/trash' : '/admin/books/trash')

// GET → Page<TrashItem> { id, title, kind, originalName, mimeType, fileSize, uploadedByName, deletedAt, purgeAt }
export function listTrash(kind, { page = 0, size = 20 } = {}) {
  return request(trashBase(kind), { query: { page, size } })
}

// DELETE /{id} → 204. Hapus permanen satu item (404 bila tidak ada di tempat sampah)
export function purgeTrashItem(kind, id) {
  return request(`${trashBase(kind)}/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

// DELETE → { purged: n }. Kosongkan tempat sampah satu area
export function emptyTrash(kind) {
  return request(trashBase(kind), { method: 'DELETE' })
}

export function restoreItem(kind, id) {
  return kind === 'archive' ? restoreArchive(id) : restoreBook(id)
}
