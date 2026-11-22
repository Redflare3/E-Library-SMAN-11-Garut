import { request } from './client.js'

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
