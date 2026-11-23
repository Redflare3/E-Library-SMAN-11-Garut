<template>
  <div>
    <!-- Memuat -->
    <div v-if="state === 'loading'" class="grid gap-8 md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr] animate-pulse" aria-busy="true">
      <div class="aspect-[3/4] rounded-lg bg-slate-100 max-w-[260px]"></div>
      <div class="space-y-4">
        <div class="h-4 w-32 rounded bg-slate-100"></div>
        <div class="h-8 w-4/5 rounded bg-slate-100"></div>
        <div class="h-4 w-1/3 rounded bg-slate-100"></div>
        <div class="h-10 w-56 rounded-lg bg-slate-100"></div>
        <div class="h-24 rounded bg-slate-100"></div>
      </div>
    </div>

    <!-- Tidak ditemukan (404: tidak ada, terhapus, atau STAFF untuk anonim) -->
    <StateBlock
      v-else-if="state === 'notFound'"
      plain
      state="empty"
      title="Buku tidak ditemukan"
      message="Buku ini tidak tersedia atau sudah dihapus dari perpustakaan."
    >
      <router-link to="/" class="text-sm font-medium text-brand hover:underline">Kembali ke katalog</router-link>
    </StateBlock>

    <!-- Error lain -->
    <StateBlock
      v-else-if="state === 'error'"
      plain
      state="error"
      title="Gagal memuat buku"
      :message="loadError"
      @retry="loadBook"
    />

    <template v-else-if="book">
      <button
        type="button"
        class="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 cursor-pointer"
        @click="goBack"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        Kembali
      </button>

      <!-- Kepala: sampul + info -->
      <section class="mt-6 grid gap-8 md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr] items-start">
        <div class="relative aspect-[3/4] w-full max-w-[220px] md:max-w-none rounded-lg overflow-hidden bg-slate-100 ring-1 ring-slate-200">
          <BookCover :book="book" />
        </div>

        <div class="min-w-0">
          <p class="text-sm text-slate-500">
            {{ labelFor(BOOK_TYPE_LABELS, book.bookType) }}
            <template v-if="book.categoryName">
              ·
              <router-link
                :to="{ name: 'Katalog', query: { categoryId: String(book.categoryId) } }"
                class="hover:text-brand hover:underline"
              >
                {{ book.categoryName }}
              </router-link>
            </template>
          </p>

          <h1 class="mt-1 text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight leading-tight break-words">
            {{ book.title }}
          </h1>
          <p v-if="book.author" class="mt-2 text-base text-slate-600">{{ book.author }}</p>

          <p v-if="book.visibility === 'STAFF'" class="mt-3 inline-block px-2 py-0.5 rounded bg-amber-50 text-xs font-medium text-amber-700">
            {{ VISIBILITY_LABELS.STAFF }}
          </p>

          <!-- Aksi -->
          <div class="mt-6 flex flex-wrap items-center gap-2">
            <button
              v-if="previewable"
              type="button"
              :class="[btnPrimary]"
              @click="scrollToReader"
            >
              Baca
            </button>
            <a
              v-if="book.visibility !== 'STAFF'"
              :href="bookDownloadUrl(book.id)"
              :class="[previewable ? btnSecondary : btnPrimary]"
              @click="onPublicDownload"
            >
              Unduh {{ extension }}
            </a>
            <button
              v-else
              type="button"
              :class="[previewable ? btnSecondary : btnPrimary, 'disabled:opacity-60']"
              :disabled="isDownloading"
              @click="downloadStaffBook"
            >
              {{ isDownloading ? 'Mengunduh…' : `Unduh ${extension}` }}
            </button>
            <button type="button" :class="btnGhost" @click="handleShare">Salin tautan</button>
            <button type="button" :class="btnGhost" @click="copyCitation">Salin sitasi</button>
          </div>
          <p v-if="!previewable" class="mt-3 text-sm text-slate-500">
            Format {{ extension }} tidak bisa dibaca langsung di browser. Unduh berkas untuk membukanya.
          </p>

          <p v-if="book.description" class="mt-8 max-w-prose text-[15px] leading-relaxed text-slate-700 whitespace-pre-line break-words">
            {{ book.description }}
          </p>

          <dl class="mt-8 pt-6 border-t border-slate-200 grid grid-cols-[max-content_1fr] gap-x-8 gap-y-2.5 text-sm">
            <template v-for="row in details" :key="row.label">
              <dt class="text-slate-500">{{ row.label }}</dt>
              <dd class="text-slate-800 min-w-0 break-words">{{ row.value }}</dd>
            </template>
          </dl>
        </div>
      </section>

      <!-- Pembaca di browser -->
      <section v-if="previewable" id="baca" class="mt-14 scroll-mt-24">
        <div class="flex items-center justify-between gap-3 mb-3">
          <h2 class="text-lg font-semibold text-slate-900">Baca</h2>
          <div v-if="readerSrc" class="flex items-center gap-1">
            <a :href="readerSrc" target="_blank" rel="noopener" :class="btnGhost">Buka di tab baru</a>
            <button type="button" :class="btnGhost" @click="isFullscreen = true">Layar penuh</button>
          </div>
        </div>

        <div
          :class="[
            'overflow-hidden',
            isFullscreen ? 'fixed inset-0 z-50 bg-slate-900 p-2 sm:p-4' : 'h-[80vh] min-h-[480px] rounded-lg ring-1 ring-slate-200 bg-slate-100'
          ]"
        >
          <button
            v-if="isFullscreen"
            type="button"
            class="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-lg bg-white text-slate-800 text-sm font-medium shadow-md cursor-pointer"
            @click="isFullscreen = false"
          >
            Tutup
          </button>

          <iframe
            v-if="readerSrc"
            :key="readerSrc"
            :src="readerSrc"
            :title="`Pembaca: ${book.title}`"
            class="w-full h-full bg-white"
          ></iframe>
          <div v-else-if="readerError" class="h-full flex flex-col items-center justify-center gap-1 text-center p-6">
            <p class="text-sm font-medium text-slate-800">Berkas tidak dapat dimuat</p>
            <p class="text-sm text-slate-500">{{ errorMessage(readerError) }}</p>
          </div>
          <div v-else class="h-full flex items-center justify-center text-sm text-slate-500">
            Memuat dokumen…
          </div>
        </div>
      </section>

      <!-- Buku terkait -->
      <section v-if="relatedBooks.length" class="mt-16">
        <div class="flex items-baseline justify-between gap-3 mb-5">
          <h2 class="text-lg font-semibold text-slate-900">
            {{ book.categoryName ? `Lainnya di ${book.categoryName}` : 'Buku lainnya' }}
          </h2>
          <router-link
            :to="book.categoryId ? { name: 'Katalog', query: { categoryId: String(book.categoryId) } } : { name: 'Katalog' }"
            class="text-sm text-brand hover:underline shrink-0"
          >
            Lihat semua
          </router-link>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-8">
          <BookCard v-for="item in relatedBooks" :key="item.id" :book="item" />
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BookCard from '../components/BookCard.vue'
import BookCover from '../components/BookCover.vue'
import StateBlock from '../components/StateBlock.vue'
import { getBook, listBooks, bookFileUrl, bookDownloadUrl } from '../api/books.js'
import { useMediaUrl, downloadAuthed } from '../api/media.js'
import { useToast } from '../composables/toast.js'
import { errorMessage } from '../utils/errors.js'
import {
  BOOK_TYPE_LABELS,
  GRADE_LABELS,
  VISIBILITY_LABELS,
  labelFor,
  formatBytes,
  formatDate,
  fileExtension,
  canPreview
} from '../utils/labels.js'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const btnBase = 'inline-flex items-center justify-center h-10 px-5 rounded-lg text-sm font-medium transition-colors cursor-pointer'
const btnPrimary = `${btnBase} bg-brand hover:bg-brand-dark text-white`
const btnSecondary = `${btnBase} border border-slate-300 bg-white hover:bg-slate-50 text-slate-800`
const btnGhost = 'inline-flex items-center h-10 px-3 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer'

// ---------- Memuat buku ----------
const book = ref(null)
const state = ref('loading') // loading | ready | notFound | error
const loadError = ref('')
let bookRequest = 0

async function loadBook() {
  const id = ++bookRequest
  const bookId = route.params.id
  state.value = 'loading'
  isFullscreen.value = false
  relatedBooks.value = []
  try {
    const data = await getBook(bookId)
    if (id !== bookRequest) return
    book.value = data
    state.value = 'ready'
    document.title = `${data.title} - E-Library SMAN 11 Garut`
    loadRelated(data)
    if (route.hash === '#baca') {
      await nextTick()
      scrollToReader()
    }
  } catch (err) {
    if (id !== bookRequest) return
    book.value = null
    if (err.status === 404 || err.code === 'NOT_FOUND') {
      state.value = 'notFound'
    } else {
      loadError.value = errorMessage(err)
      state.value = 'error'
    }
  }
}

// Kembali ke halaman sebelumnya (mis. katalog dengan filternya); tanpa riwayat → katalog
function goBack() {
  if (window.history.state?.back) router.back()
  else router.push('/')
}

// ---------- Turunan tampilan ----------
const extension = computed(() => (book.value ? fileExtension(book.value.originalName, book.value.mimeType) : ''))
const previewable = computed(() => !!book.value && canPreview(book.value.mimeType))

const details = computed(() => {
  const b = book.value
  const rows = [
    { label: 'Penerbit', value: b.publisher },
    { label: 'Tahun terbit', value: b.publicationYear },
    { label: 'Kurikulum', value: b.curriculum },
    { label: 'Kelas', value: labelFor(GRADE_LABELS, b.gradeLevel) },
    { label: 'Berkas', value: `${extension.value} · ${formatBytes(b.fileSize)}` },
    { label: 'Diunggah oleh', value: b.uploadedByName || 'Impor massal' },
    { label: 'Ditambahkan', value: formatDate(b.createdAt) }
  ]
  return rows.filter((r) => r.value !== null && r.value !== undefined && r.value !== '')
})

// ---------- Pembaca ----------
const isFullscreen = ref(false)

// PUBLIC → URL biasa (streaming + Range); STAFF → blob URL ber-Authorization. Hanya bila bisa dipratinjau.
const { src: readerSrc, error: readerError } = useMediaUrl(() =>
  previewable.value ? { url: bookFileUrl(book.value.id), visibility: book.value.visibility } : null
)

function scrollToReader() {
  document.getElementById('baca')?.scrollIntoView({ behavior: 'smooth' })
}

function onKeydown(e) {
  if (e.key === 'Escape' && isFullscreen.value) isFullscreen.value = false
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

// ---------- Unduh ----------
const isDownloading = ref(false)

function onPublicDownload() {
  toast.show(`Mengunduh ${book.value.originalName}…`, { tone: 'info' })
}

async function downloadStaffBook() {
  isDownloading.value = true
  try {
    await downloadAuthed(bookDownloadUrl(book.value.id), book.value.originalName)
    toast.show(`Mengunduh ${book.value.originalName}…`, { tone: 'info' })
  } catch (err) {
    toast.show(errorMessage(err), { tone: 'error' })
  } finally {
    isDownloading.value = false
  }
}

// ---------- Buku terkait ----------
const relatedBooks = ref([])

async function loadRelated(current) {
  const id = bookRequest
  try {
    const page = await listBooks(
      current.categoryId
        ? { categoryId: current.categoryId, size: 5 }
        : { sort: 'popular', size: 5 }
    )
    if (id !== bookRequest) return
    relatedBooks.value = page.content.filter((b) => b.id !== current.id).slice(0, 4)
  } catch {
    relatedBooks.value = [] // bagian ini opsional, sembunyikan bila gagal
  }
}

// ---------- Sitasi & bagikan ----------
// navigator.clipboard hanya ada di konteks aman (HTTPS/localhost); LAN sekolah bisa HTTP biasa
async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* lanjut ke fallback */
  }
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  ta.remove()
  return ok
}

function buildCitation(b) {
  const author = b.author || 'Anonim'
  const year = b.publicationYear || 't.t.'
  const publisher = b.publisher ? ` ${b.publisher}.` : ''
  return `${author}. (${year}). ${b.title}.${publisher} E-Library SMAN 11 Garut.`
}

async function copyCitation() {
  const ok = await copyText(buildCitation(book.value))
  toast.show(ok ? 'Sitasi (format APA) disalin.' : 'Gagal menyalin sitasi.', { tone: ok ? 'success' : 'error' })
}

async function handleShare() {
  const ok = await copyText(window.location.href.split('#')[0])
  toast.show(ok ? 'Tautan buku disalin.' : 'Gagal menyalin tautan.', { tone: ok ? 'success' : 'error' })
}

// /buku/:id memakai ulang komponen saat membuka buku terkait → muat ulang saat id berubah
watch(
  () => route.params.id,
  (id) => {
    if (id !== undefined) loadBook()
  },
  { immediate: true }
)
</script>
