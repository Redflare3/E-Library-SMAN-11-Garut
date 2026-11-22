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

export const MEDIA_TYPE_LABELS = {
  IMAGE: 'Foto',
  VIDEO: 'Video',
  DOCUMENT: 'Dokumen'
}

export const ARCHIVE_SORT_OPTIONS = [
  { value: 'newest', label: 'Terbaru Diunggah' },
  { value: 'date', label: 'Tanggal Kegiatan' },
  { value: 'title', label: 'Judul (A - Z)' },
  { value: 'popular', label: 'Paling Banyak Diunduh' }
]

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

const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

// "2025-08-17" → "17 Agustus 2025". Dipecah manual: new Date('YYYY-MM-DD') dibaca sebagai UTC
// sehingga tanggal bisa bergeser sehari di zona waktu tertentu.
export function formatEventDate(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '')
  if (!m) return ''
  const month = MONTHS_ID[Number(m[2]) - 1]
  if (!month) return ''
  return `${Number(m[3])} ${month} ${m[1]}`
}

const pad2 = (n) => String(n).padStart(2, '0')
const toIsoDay = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`

// n hari kalender terakhir (zona waktu lokal), berakhir hari ini: ['YYYY-MM-DD', ...]
export function lastNDays(n, today = new Date()) {
  const days = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)
    days.push(toIsoDay(d))
  }
  return days
}

const SHORT_DAYS_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

// "2026-11-17" → "Sel 17/11" (dibangun dari bagian tanggal lokal, tanpa geser UTC)
export function formatShortDay(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '')
  if (!m) return ''
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return `${SHORT_DAYS_ID[d.getDay()]} ${Number(m[3])}/${Number(m[2])}`
}

// 5 → "0:05", 222 → "3:42", 3730 → "1:02:10"
export function formatDuration(seconds) {
  if (seconds === null || seconds === undefined || isNaN(seconds) || seconds < 0) return ''
  const total = Math.round(seconds)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

// Instant ISO → "22 Nov 2026, 14.05" (zona waktu lokal)
export function formatDateTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d)) return '—'
  return d.toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function formatNumber(n) {
  return (n ?? 0).toLocaleString('id-ID')
}

const MIME_EXTENSIONS = {
  'application/pdf': 'PDF',
  'application/epub+zip': 'EPUB',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
  'image/webp': 'WEBP',
  'image/gif': 'GIF',
  'video/mp4': 'MP4',
  'video/webm': 'WEBM',
  'video/x-matroska': 'MKV'
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

// ---------- Unggahan (frontend-guide §6.2) ----------
export const BOOK_FILE_ACCEPT = '.pdf,.epub,.docx,.pptx,.xlsx'
export const COVER_ACCEPT = '.jpg,.jpeg,.png'
export const ARCHIVE_FILE_ACCEPT = '.jpg,.jpeg,.png,.webp,.gif,.mp4,.webm,.mkv,.pdf,.epub,.docx,.pptx,.xlsx'
export const MAX_UPLOAD_BYTES = 2 * 1024 ** 3

// Cek ekstensi terhadap daftar accept (mis. ".pdf,.docx"); isi berkas tetap dicek server
export function fileMatchesAccept(file, accept) {
  if (!file) return false
  if (!accept) return true
  const name = (file.name || '').toLowerCase()
  return accept
    .split(',')
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean)
    .some((ext) => name.endsWith(ext))
}
