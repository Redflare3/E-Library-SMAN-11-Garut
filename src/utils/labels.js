// Label Bahasa Indonesia untuk nilai enum dari backend
export const ROLE_LABELS = {
  LIBRARIAN: 'Pustakawan',
  TEACHER: 'Guru'
}

export const BOOK_TYPE_LABELS = {
  EBOOK: 'E-Book',
  TEACHING_MODULE: 'Modul Ajar',
  QUESTION_BANK: 'Bank Soal',
  SLIDES: 'Bahan Presentasi',
  OTHER: 'Lainnya'
}

export const GRADE_LABELS = {
  X: 'Kelas X',
  XI: 'Kelas XI',
  XII: 'Kelas XII',
  ALL: 'Semua Kelas'
}

export const VISIBILITY_LABELS = {
  PUBLIC: 'Publik',
  STAFF: 'Khusus Staf'
}

// Nilai baru dari /meta/filters tetap tampil walau belum ada labelnya
export function labelFor(map, code) {
  if (code === null || code === undefined || code === '') return ''
  return map[code] ?? String(code)
}

export function formatBytes(bytes) {
  if (bytes === null || bytes === undefined || isNaN(bytes)) return '—'
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let value = bytes / 1024
  let i = 0
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024
    i++
  }
  return `${value.toLocaleString('id-ID', { maximumFractionDigits: value < 10 ? 1 : 0 })} ${units[i]}`
}

export function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d)) return '—'
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatNumber(n) {
  return (n ?? 0).toLocaleString('id-ID')
}

const MIME_EXTENSIONS = {
  'application/pdf': 'PDF',
  'application/epub+zip': 'EPUB',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX'
}

// Ekstensi tampilan, mis. "PDF", dari nama berkas asli atau MIME type
export function fileExtension(name, mime) {
  const match = /\.([a-z0-9]{1,6})$/i.exec(name || '')
  if (match) return match[1].toUpperCase()
  return MIME_EXTENSIONS[mime] || 'BERKAS'
}

// Format yang bisa ditampilkan langsung di pembaca browser.
// Tambahkan MIME type di sini saat backend mendukung pratinjau format lain.
export const INLINE_MIME_TYPES = ['application/pdf']

export function canPreview(mime) {
  return !!mime && INLINE_MIME_TYPES.includes(mime)
}
