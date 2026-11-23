<template>
  <div
    class="fixed inset-0 z-[60] bg-slate-950/95 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden"
    role="dialog"
    aria-modal="true"
    :aria-label="info.title || 'Pratinjau arsip'"
  >
    <!-- ===================== AREA MEDIA ===================== -->
    <div
      class="relative h-[60vh] lg:h-auto lg:flex-1 shrink-0 lg:shrink min-w-0 min-h-0 flex items-center justify-center p-4 sm:p-8"
      @click.self="$emit('close')"
    >
      <!-- Memuat detail (item dari tautan langsung belum diketahui jenisnya) -->
      <div v-if="!info.mediaType" class="flex flex-col items-center gap-3 text-slate-400 text-xs">
        <span class="w-8 h-8 border-2 border-slate-600 border-t-white rounded-full animate-spin"></span>
        <span>Memuat arsip…</span>
      </div>

      <!-- FOTO -->
      <div v-else-if="info.mediaType === 'IMAGE'" class="relative w-full h-full flex items-center justify-center" @click.self="$emit('close')">
        <img
          v-if="thumbSrc && !imageLoaded"
          :src="thumbSrc"
          alt=""
          aria-hidden="true"
          class="absolute inset-0 m-auto max-w-full max-h-full object-contain blur-sm opacity-60"
        />
        <img
          v-if="fileSrc && !imageFailed"
          :key="info.id"
          :src="fileSrc"
          :alt="info.title"
          :width="info.width || undefined"
          :height="info.height || undefined"
          :class="['relative max-w-full max-h-full w-auto h-auto object-contain rounded-md shadow-2xl transition-opacity', imageLoaded ? 'opacity-100' : 'opacity-0']"
          @load="imageLoaded = true"
          @error="imageFailed = true"
        />
        <MediaFallback
          v-if="imageFailed || fileError"
          :type="info.mediaType"
          title="Gambar tidak dapat ditampilkan"
          :message="fileError ? errorMessage(fileError) : 'Berkas gambar gagal dimuat. Anda tetap dapat mengunduhnya.'"
          @download="download"
        />
      </div>

      <!-- VIDEO -->
      <template v-else-if="info.mediaType === 'VIDEO'">
        <!-- Video STAFF: hanya unduh (blob akan memuat seluruh berkas ke memori) -->
        <div v-if="info.visibility === 'STAFF'" class="relative w-full max-w-3xl rounded-xl overflow-hidden bg-black" :style="videoBoxStyle">
          <img v-if="thumbSrc" :src="thumbSrc" alt="" aria-hidden="true" class="absolute inset-0 w-full h-full object-contain opacity-40" />
          <div class="relative h-full flex items-center justify-center p-4">
            <MediaFallback
              :type="info.mediaType"
              title="Video khusus staf hanya dapat diunduh"
              message="Video berstatus Khusus Staf tidak dapat diputar langsung di browser. Unduh berkas untuk menontonnya."
              @download="download"
            />
          </div>
        </div>

        <MediaFallback
          v-else-if="videoFailed"
          :type="info.mediaType"
          title="Tidak bisa diputar di browser"
          :message="`Format video ${extension} tidak didukung oleh browser ini. Unduh berkas untuk menontonnya di pemutar video.`"
          @download="download"
        />

        <video
          v-else
          :key="info.id"
          controls
          preload="metadata"
          playsinline
          :poster="thumbSrc || undefined"
          :src="videoUrl"
          :width="info.width || undefined"
          :height="info.height || undefined"
          class="max-w-full max-h-full rounded-md shadow-2xl bg-black"
          :style="info.width && info.height ? null : { aspectRatio: '16 / 9', width: '100%' }"
          @error="videoFailed = true"
          @loadedmetadata="onVideoMetadata"
        ></video>
      </template>

      <!-- DOKUMEN -->
      <template v-else>
        <div v-if="detailState === 'loading'" class="flex flex-col items-center gap-3 text-slate-400 text-xs">
          <span class="w-8 h-8 border-2 border-slate-600 border-t-white rounded-full animate-spin"></span>
          <span>Memuat dokumen…</span>
        </div>
        <template v-else-if="previewable">
          <iframe
            v-if="fileSrc"
            :key="info.id"
            :src="fileSrc"
            :title="info.title"
            class="w-full h-full max-w-5xl bg-white rounded-md shadow-2xl"
          ></iframe>
          <MediaFallback
            v-else-if="fileError"
            :type="info.mediaType"
            title="Dokumen tidak dapat ditampilkan"
            :message="errorMessage(fileError)"
            @download="download"
          />
          <span v-else class="w-8 h-8 border-2 border-slate-600 border-t-white rounded-full animate-spin"></span>
        </template>
        <MediaFallback
          v-else
          :type="info.mediaType"
          :title="`Pratinjau tidak tersedia untuk format ${extension}`"
          message="Dokumen ini tidak dapat ditampilkan langsung di browser. Unduh berkas untuk membukanya."
          @download="download"
        />
      </template>

      <!-- Navigasi sebelumnya / berikutnya -->
      <template v-if="showNav">
        <button
          type="button"
          class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="!hasPrev"
          aria-label="Arsip sebelumnya"
          @click="$emit('prev')"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <button
          type="button"
          class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="!hasNext"
          aria-label="Arsip berikutnya"
          @click="$emit('next')"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </template>
    </div>

    <!-- ===================== PANEL INFO ===================== -->
    <aside class="relative bg-white lg:w-96 shrink-0 lg:h-full lg:overflow-y-auto p-5 sm:p-6 space-y-5 text-slate-800">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0 space-y-1">
          <p v-if="info.mediaType" class="text-sm text-slate-500">
            {{ labelFor(MEDIA_TYPE_LABELS, info.mediaType) }}<span v-if="info.visibility === 'STAFF'" class="text-amber-700"> · Khusus Staf</span>
          </p>
          <h2 class="text-lg font-semibold text-slate-900 leading-snug break-words">
            <template v-if="info.title">{{ info.title }}</template>
            <span v-else class="block h-5 w-48 rounded bg-slate-100 animate-pulse"></span>
          </h2>
        </div>
        <button
          ref="closeButton"
          type="button"
          class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
          aria-label="Tutup pratinjau"
          @click="$emit('close')"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>

      <!-- Unduh -->
      <div>
        <a
          v-if="info.visibility === 'PUBLIC'"
          :href="archiveDownloadUrl(info.id)"
          class="w-full h-10 bg-brand hover:bg-brand-dark text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
          @click="$emit('notify', `Mengunduh ${info.originalName || info.title}…`)"
        >
          <DownloadIcon />
          <span>Unduh Berkas</span>
        </a>
        <button
          v-else
          type="button"
          class="w-full h-10 bg-brand hover:bg-brand-dark text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait"
          :disabled="downloading || !info.visibility"
          @click="download"
        >
          <DownloadIcon />
          <span>{{ downloading ? 'Menyiapkan unduhan…' : 'Unduh Berkas' }}</span>
        </button>
      </div>

      <!-- Error detail (selain 404) -->
      <div v-if="detailState === 'error'" class="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 space-y-2">
        <p>{{ detailError }}</p>
        <button type="button" class="font-bold underline cursor-pointer" @click="loadDetail">Coba Lagi</button>
      </div>

      <!-- Metadata -->
      <!-- Deskripsi -->
      <div v-if="detailState === 'loading'" class="space-y-2 animate-pulse">
        <div class="h-3 rounded bg-slate-100"></div>
        <div class="h-3 rounded bg-slate-100 w-4/5"></div>
      </div>
      <p v-else-if="detail?.description" class="text-sm text-slate-700 leading-relaxed whitespace-pre-line break-words">
        {{ detail.description }}
      </p>

      <dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm pt-4 border-t border-slate-100">
        <dt class="text-slate-500">Tanggal</dt>
        <dd class="text-slate-800">{{ formatEventDate(info.eventDate) || 'Tanpa tanggal' }}</dd>

        <template v-if="info.categoryName">
          <dt class="text-slate-500">Kategori</dt>
          <dd class="text-slate-800">{{ info.categoryName }}</dd>
        </template>

        <template v-if="dimensions">
          <dt class="text-slate-500">Resolusi</dt>
          <dd class="text-slate-800 tabular-nums">{{ dimensions }}</dd>
        </template>

        <template v-if="duration">
          <dt class="text-slate-500">Durasi</dt>
          <dd class="text-slate-800 tabular-nums">{{ duration }}</dd>
        </template>

        <template v-if="detail">
          <dt class="text-slate-500">Berkas</dt>
          <dd class="text-slate-800">{{ extension }} · {{ formatBytes(detail.fileSize) }}</dd>

          <dt class="text-slate-500">Diunggah oleh</dt>
          <dd class="text-slate-800">{{ detail.uploadedByName || 'Impor massal' }}</dd>

          <dt class="text-slate-500">Ditambahkan</dt>
          <dd class="text-slate-800">{{ formatDate(detail.createdAt) }}</dd>
        </template>
      </dl>

      <p v-if="showNav" class="hidden lg:block text-xs text-slate-400 pt-2 border-t border-slate-100">
        Gunakan tombol ← → untuk berpindah, Esc untuk menutup.
      </p>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, h } from 'vue'
import { getArchive, archiveFileUrl, archiveThumbnailUrl, archiveDownloadUrl } from '../api/archive.js'
import { useMediaUrl, downloadAuthed } from '../api/media.js'
import { errorMessage } from '../utils/errors.js'
import {
  MEDIA_TYPE_LABELS,
  labelFor,
  formatBytes,
  formatDate,
  formatEventDate,
  formatDuration,
  fileExtension,
  canPreview
} from '../utils/labels.js'
import MediaTypeIcon from './MediaTypeIcon.vue'

const props = defineProps({
  // ArchiveSummary dari grid, atau { id } saja bila dibuka dari tautan langsung
  item: { type: Object, required: true },
  hasPrev: { type: Boolean, default: false },
  hasNext: { type: Boolean, default: false },
  showNav: { type: Boolean, default: false }
})
const emit = defineEmits(['close', 'prev', 'next', 'not-found', 'notify'])

// ---------- Komponen kecil lokal ----------
const DownloadIcon = () =>
  h('svg', { class: 'w-4 h-4', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
    h('polyline', { points: '7 10 12 15 17 10' }),
    h('line', { x1: '12', y1: '15', x2: '12', y2: '3' })
  ])

const MediaFallback = (p, { emit: e }) =>
  h('div', { class: 'max-w-sm text-center space-y-3 text-slate-300 px-4' }, [
    h('div', { class: 'w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto' }, [
      h(MediaTypeIcon, { type: p.type, class: 'w-7 h-7 text-white/80' })
    ]),
    h('h3', { class: 'text-sm font-bold text-white' }, p.title),
    p.message ? h('p', { class: 'text-xs text-slate-400 leading-relaxed' }, p.message) : null,
    h(
      'button',
      {
        type: 'button',
        class: 'inline-flex items-center gap-2 px-4 h-10 rounded-lg bg-white text-slate-900 text-sm font-medium hover:bg-slate-100 transition-colors cursor-pointer',
        onClick: () => e('download')
      },
      [h(DownloadIcon), 'Unduh Berkas']
    )
  ])
MediaFallback.props = ['type', 'title', 'message']
MediaFallback.emits = ['download']

// ---------- Detail ----------
const detail = ref(null)
const detailState = ref('loading') // loading | ready | error
const detailError = ref('')
let detailRequest = 0

const info = computed(() => ({ ...props.item, ...(detail.value || {}) }))

async function loadDetail() {
  const id = ++detailRequest
  const itemId = props.item.id
  detailState.value = 'loading'
  detailError.value = ''
  try {
    const data = await getArchive(itemId)
    if (id !== detailRequest) return
    detail.value = data
    detailState.value = 'ready'
  } catch (err) {
    if (id !== detailRequest) return
    if (err?.status === 404) {
      emit('not-found')
      return
    }
    detailError.value = errorMessage(err)
    detailState.value = 'error'
  }
}

// ---------- Media ----------
const imageLoaded = ref(false)
const imageFailed = ref(false)
const videoFailed = ref(false)
const downloading = ref(false)

watch(
  () => props.item.id,
  () => {
    detail.value = null
    imageLoaded.value = false
    imageFailed.value = false
    videoFailed.value = false
    loadDetail()
  },
  { immediate: true }
)

const extension = computed(() => fileExtension(detail.value?.originalName, detail.value?.mimeType))
const previewable = computed(() => canPreview(detail.value?.mimeType))
const duration = computed(() => formatDuration(info.value.durationSeconds))
const dimensions = computed(() =>
  info.value.width && info.value.height ? `${info.value.width} × ${info.value.height} px` : ''
)
const videoBoxStyle = computed(() => ({
  aspectRatio: info.value.width && info.value.height ? `${info.value.width} / ${info.value.height}` : '16 / 9'
}))

// Thumbnail: latar saat foto dimuat & poster video
const { src: thumbSrc } = useMediaUrl(() =>
  info.value.mediaType && info.value.visibility
    ? { url: archiveThumbnailUrl(info.value.id), visibility: info.value.visibility }
    : null
)

// Berkas penuh untuk foto & dokumen yang bisa dipratinjau (blob untuk STAFF)
const { src: fileSrc, error: fileError } = useMediaUrl(() => {
  const i = info.value
  if (!i.visibility) return null
  if (i.mediaType === 'IMAGE') return { url: archiveFileUrl(i.id), visibility: i.visibility }
  if (i.mediaType === 'DOCUMENT' && previewable.value) return { url: archiveFileUrl(i.id), visibility: i.visibility }
  return null
})

// Video PUBLIC memakai URL biasa agar streaming & seek (Range) tetap berfungsi
const videoUrl = computed(() => archiveFileUrl(info.value.id))

// Kontainer dikenali tetapi codec video tidak: browser hanya memutar audio (lebar 0)
function onVideoMetadata(e) {
  if (e.target.videoWidth === 0) videoFailed.value = true
}

async function download() {
  const i = info.value
  if (i.visibility === 'PUBLIC') {
    // Sama dengan tautan <a>: biarkan server memberi nama berkas
    const a = document.createElement('a')
    a.href = archiveDownloadUrl(i.id)
    document.body.appendChild(a)
    a.click()
    a.remove()
    emit('notify', `Mengunduh ${i.originalName || i.title}…`)
    return
  }
  downloading.value = true
  try {
    await downloadAuthed(archiveDownloadUrl(i.id), i.originalName || i.title)
    emit('notify', `Mengunduh ${i.originalName || i.title}…`)
  } catch (err) {
    emit('notify', errorMessage(err))
  } finally {
    downloading.value = false
  }
}

// ---------- Keyboard, scroll lock, fokus ----------
const closeButton = ref(null)

function onKeydown(e) {
  if (e.key === 'Escape') {
    e.preventDefault()
    emit('close')
    return
  }
  // Panah pada <video>/<input> yang sedang fokus dipakai untuk seek, jangan dibajak
  const tag = e.target?.tagName
  if (tag === 'VIDEO' || tag === 'INPUT' || tag === 'TEXTAREA') return
  if (e.key === 'ArrowLeft' && props.showNav && props.hasPrev) {
    e.preventDefault()
    emit('prev')
  } else if (e.key === 'ArrowRight' && props.showNav && props.hasNext) {
    e.preventDefault()
    emit('next')
  }
}

let previousOverflow = ''
onMounted(() => {
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  document.addEventListener('keydown', onKeydown)
  nextTick(() => closeButton.value?.focus())
})
onBeforeUnmount(() => {
  detailRequest++
  document.body.style.overflow = previousOverflow
  document.removeEventListener('keydown', onKeydown)
})
</script>
