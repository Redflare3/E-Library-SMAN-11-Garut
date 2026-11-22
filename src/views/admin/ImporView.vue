<template>
  <div class="space-y-5">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-black tracking-tight text-slate-900">Unggah Massal</h1>
      <p class="text-sm text-slate-500 mt-1">
        Pilih banyak berkas sekaligus. Setiap berkas menjadi satu baris yang diunggah satu per satu dengan pengaturan yang sama.
      </p>
    </div>

    <!-- Target -->
    <div class="flex flex-wrap items-center gap-3">
      <div class="inline-flex gap-1 p-1 bg-slate-100 rounded-xl text-xs" role="tablist" aria-label="Jenis unggahan">
        <button
          v-for="t in TARGETS"
          :key="t.value"
          type="button"
          role="tab"
          :aria-selected="target === t.value"
          :disabled="running"
          :class="[
            'px-4 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed',
            target === t.value ? 'bg-white text-[#005B70] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
          ]"
          @click="switchTarget(t.value)"
        >
          {{ t.label }}
        </button>
      </div>
      <p v-if="target === 'book'" class="text-[11px] text-slate-400">
        Unggah massal tidak menyertakan sampul, dan sampul tidak dapat ditambahkan kemudian. Gunakan Unggah Buku biasa untuk buku bersampul.
      </p>
    </div>

    <!-- Pengaturan bersama -->
    <section class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
      <h2 class="text-xs font-bold text-slate-700">Pengaturan untuk semua berkas</h2>
      <fieldset :disabled="running" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        <template v-if="target === 'book'">
          <div class="space-y-1">
            <label for="bulk-type" class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jenis</label>
            <select id="bulk-type" v-model="defaults.bookType" :class="selectClass()">
              <option v-for="t in options.bookTypes" :key="t" :value="t">{{ labelFor(BOOK_TYPE_LABELS, t) }}</option>
            </select>
          </div>
          <div class="space-y-1">
            <label for="bulk-grade" class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kelas</label>
            <select id="bulk-grade" v-model="defaults.gradeLevel" :class="selectClass()">
              <option v-for="g in options.gradeLevels" :key="g" :value="g">{{ labelFor(GRADE_LABELS, g) }}</option>
            </select>
          </div>
          <div class="space-y-1">
            <label for="bulk-curr" class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kurikulum</label>
            <select id="bulk-curr" v-model="defaults.curriculum" :class="selectClass()">
              <option value="">— Tidak ditentukan —</option>
              <option v-for="c in options.curricula" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
        </template>
        <div class="space-y-1">
          <label for="bulk-cat" class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategori</label>
          <select id="bulk-cat" v-model="defaults.categoryId" :class="selectClass()">
            <option value="">— Tanpa kategori —</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ '  '.repeat(c.depth * 2) }}{{ c.name }}</option>
          </select>
        </div>
        <div v-if="target === 'archive'" class="space-y-1">
          <label for="bulk-date" class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tanggal Kegiatan</label>
          <input id="bulk-date" v-model="defaults.eventDate" type="date" :class="selectClass()" />
        </div>
        <div class="space-y-1">
          <label for="bulk-vis" class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Akses</label>
          <select id="bulk-vis" v-model="defaults.visibility" :class="selectClass()">
            <option value="PUBLIC">Publik</option>
            <option value="STAFF">Khusus Staf</option>
          </select>
        </div>
      </fieldset>
      <p class="text-[11px] text-slate-400">Detail lain (deskripsi, penerbit, dll.) dapat diubah per item setelahnya di Semua Buku / Semua Arsip.</p>
    </section>

    <!-- Zona berkas -->
    <label
      :class="[
        'flex flex-col items-center justify-center gap-1.5 px-4 py-8 rounded-2xl border-2 border-dashed text-center transition-colors',
        running || rows.length >= MAX_ROWS ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
        isDragging ? 'border-[#005B70] bg-[#EAF5F8]' : 'border-slate-200 bg-white hover:border-[#005B70]/50'
      ]"
      @dragover.prevent="!running && (isDragging = true)"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      <svg class="w-7 h-7 text-[#005B70]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      <span class="text-sm font-semibold text-slate-700">Tarik &amp; lepas banyak berkas, atau <span class="text-[#005B70] underline">pilih berkas</span></span>
      <span class="text-[11px] text-slate-400">{{ acceptLabel }} · maks. {{ formatBytes(MAX_UPLOAD_BYTES) }} per berkas · maks. {{ MAX_ROWS }} berkas per antrean</span>
      <input type="file" multiple class="sr-only" :accept="accept" :disabled="running || rows.length >= MAX_ROWS" @change="onPick" />
    </label>

    <!-- Berkas ditolak -->
    <div v-if="rejected.length" class="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 space-y-1">
      <div class="flex items-center justify-between gap-2">
        <strong>{{ rejected.length }} berkas ditolak</strong>
        <button type="button" class="text-[11px] font-semibold hover:underline cursor-pointer" @click="rejected = []">Tutup</button>
      </div>
      <ul class="max-h-28 overflow-y-auto space-y-0.5">
        <li v-for="(r, i) in rejected" :key="i">ditolak: <span class="font-semibold">{{ r.name }}</span> ({{ r.reason }})</li>
      </ul>
    </div>

    <!-- Antrean -->
    <section v-if="rows.length" class="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      <div class="px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="text-xs text-slate-600 space-y-1 min-w-0 flex-1">
          <template v-if="running">
            <strong class="text-[#005B70]">Mengunggah {{ processedCount + 1 }} dari {{ batchTotal }}</strong>
            <span class="block h-1.5 rounded-full bg-slate-100 overflow-hidden max-w-sm">
              <span class="block h-full bg-[#005B70] rounded-full transition-[width]" :style="{ width: `${batchPercent}%` }"></span>
            </span>
          </template>
          <template v-else>
            <strong>{{ rows.length }} berkas</strong> ·
            {{ counts.waiting }} menunggu · {{ counts.done }} berhasil · {{ counts.skipped }} dilewati · {{ counts.failed }} gagal
          </template>
        </div>
        <div class="flex flex-wrap gap-2 shrink-0">
          <template v-if="running">
            <BaseButton variant="danger" size="sm" @click="cancelBatch">Batalkan</BaseButton>
          </template>
          <template v-else>
            <BaseButton v-if="counts.failed" variant="outline" size="sm" @click="retryFailed">Coba Lagi yang Gagal</BaseButton>
            <BaseButton v-if="counts.done + counts.skipped" variant="outline" size="sm" @click="clearFinished">Bersihkan yang Selesai</BaseButton>
            <BaseButton size="sm" :disabled="!counts.waiting || hasEmptyTitle" @click="startBatch">
              Mulai Unggah ({{ counts.waiting }})
            </BaseButton>
          </template>
        </div>
      </div>

      <div v-if="batchError" class="mx-4 mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs" role="alert">
        {{ batchError }}
      </div>

      <div v-if="summary" class="mx-4 mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex flex-wrap items-center gap-2">
        <span>{{ summary }}</span>
        <router-link :to="target === 'archive' ? '/admin/arsip' : '/admin/buku'" class="font-bold underline">
          Buka {{ target === 'archive' ? 'Semua Arsip' : 'Semua Buku' }}
        </router-link>
      </div>

      <div class="hidden md:grid grid-cols-[2rem_minmax(0,1.1fr)_minmax(0,1.6fr)_10rem_2rem] gap-3 px-3 py-2 mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
        <span>#</span><span>Berkas</span><span>Judul{{ target === 'book' ? ' · Penulis' : '' }}</span><span>Status</span><span></span>
      </div>
      <ul>
        <BulkFileRow
          v-for="(row, i) in rows"
          :key="row.key"
          :row="row"
          :index="i"
          :target="target"
          :show-author="target === 'book'"
          :locked="running"
          :progress="row.key === currentKey ? progress : undefined"
          @update="Object.assign(row, $event)"
          @remove="removeRow(row)"
        />
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import BaseButton from '../../components/ui/BaseButton.vue'
import BulkFileRow from '../../components/admin/BulkFileRow.vue'
import { selectClass } from '../../components/staff/formUtils.js'
import { createBook } from '../../api/books.js'
import { createArchive } from '../../api/archive.js'
import { listCategories, flattenCategories } from '../../api/categories.js'
import { getFilters } from '../../api/meta.js'
import { useUploadTask, LEAVE_WHILE_UPLOADING } from '../../composables/uploadTask.js'
import { useToast } from '../../composables/toast.js'
import { errorMessage } from '../../utils/errors.js'
import {
  BOOK_TYPE_LABELS,
  GRADE_LABELS,
  BOOK_FILE_ACCEPT,
  ARCHIVE_FILE_ACCEPT,
  MAX_UPLOAD_BYTES,
  labelFor,
  formatBytes,
  fileMatchesAccept,
  titleFromFileName
} from '../../utils/labels.js'

const TARGETS = [
  { value: 'book', label: 'Buku' },
  { value: 'archive', label: 'Arsip' }
]
const MAX_ROWS = 200
// Error ini akan sama untuk semua berkas berikutnya → hentikan antrean
const BATCH_STOP_CODES = new Set(['STORAGE_FULL', 'STORAGE_UNAVAILABLE', 'NETWORK_ERROR', 'SERVER_UNREACHABLE'])

const toast = useToast()
const { progress, run, abort } = useUploadTask()

// ---------- Target & pengaturan bersama ----------
const target = ref('book')
const accept = computed(() => (target.value === 'archive' ? ARCHIVE_FILE_ACCEPT : BOOK_FILE_ACCEPT))
const acceptLabel = computed(() => accept.value.split(',').map((a) => a.replace('.', '').toUpperCase()).join(', '))

const bookDefaults = () => ({ bookType: 'EBOOK', gradeLevel: 'ALL', curriculum: '', categoryId: '', visibility: 'PUBLIC', eventDate: '' })
const archiveDefaults = () => ({ bookType: 'EBOOK', gradeLevel: 'ALL', curriculum: '', categoryId: '', visibility: 'STAFF', eventDate: '' })
const defaults = reactive(bookDefaults())

const options = reactive({
  bookTypes: Object.keys(BOOK_TYPE_LABELS),
  gradeLevels: Object.keys(GRADE_LABELS),
  curricula: []
})
const categories = ref([])

async function loadCategories() {
  try {
    categories.value = flattenCategories(await listCategories(target.value === 'archive' ? 'ARCHIVE' : 'BOOK'))
  } catch {
    categories.value = []
  }
}

onMounted(async () => {
  loadCategories()
  try {
    const meta = await getFilters()
    if (meta.bookTypes?.length) options.bookTypes = meta.bookTypes
    if (meta.gradeLevels?.length) options.gradeLevels = meta.gradeLevels
    options.curricula = meta.curricula || []
  } catch {
    /* tetap pakai bawaan */
  }
})

function switchTarget(value) {
  if (value === target.value || running.value) return
  if (rows.value.length && !window.confirm('Ganti jenis unggahan? Antrean saat ini akan dikosongkan.')) return
  target.value = value
  rows.value = []
  rejected.value = []
  summary.value = ''
  batchError.value = ''
  Object.assign(defaults, value === 'archive' ? archiveDefaults() : bookDefaults())
  loadCategories()
}

// ---------- Antrean ----------
const rows = ref([])
const rejected = ref([])
const isDragging = ref(false)
let keySeq = 0

const fileKey = (f) => `${f.name}|${f.size}|${f.lastModified}`

function addFiles(fileList) {
  const known = new Set(rows.value.map((r) => fileKey(r.file)))
  for (const file of Array.from(fileList || [])) {
    if (rows.value.length >= MAX_ROWS) {
      rejected.value.push({ name: file.name, reason: `antrean sudah ${MAX_ROWS} berkas` })
      continue
    }
    if (!fileMatchesAccept(file, accept.value)) {
      rejected.value.push({ name: file.name, reason: 'jenis berkas tidak didukung' })
      continue
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      rejected.value.push({ name: file.name, reason: `lebih dari ${formatBytes(MAX_UPLOAD_BYTES)}` })
      continue
    }
    if (file.size === 0) {
      rejected.value.push({ name: file.name, reason: 'berkas kosong' })
      continue
    }
    const key = fileKey(file)
    if (known.has(key)) continue // berkas yang sama dipilih dua kali
    known.add(key)
    rows.value.push({
      key: `r${++keySeq}`,
      file,
      title: titleFromFileName(file.name),
      author: '',
      status: 'waiting',
      message: '',
      resultId: null
    })
  }
  summary.value = ''
}

function onPick(e) {
  addFiles(e.target.files)
  e.target.value = ''
}
function onDrop(e) {
  isDragging.value = false
  if (!running.value) addFiles(e.dataTransfer?.files)
}

function removeRow(row) {
  rows.value = rows.value.filter((r) => r.key !== row.key)
}

const counts = computed(() => {
  const c = { waiting: 0, done: 0, skipped: 0, failed: 0 }
  for (const r of rows.value) {
    if (r.status === 'waiting') c.waiting++
    else if (r.status === 'done') c.done++
    else if (r.status === 'skipped') c.skipped++
    else if (r.status === 'failed' || r.status === 'cancelled') c.failed++
  }
  return c
})

const hasEmptyTitle = computed(() => rows.value.some((r) => r.status === 'waiting' && !r.title.trim()))

function retryFailed() {
  for (const r of rows.value) {
    if (r.status === 'failed' || r.status === 'cancelled') {
      r.status = 'waiting'
      r.message = ''
    }
  }
  batchError.value = ''
}

function clearFinished() {
  rows.value = rows.value.filter((r) => r.status !== 'done' && r.status !== 'skipped')
  summary.value = ''
}

// ---------- Unggah berurutan ----------
const running = ref(false)
const currentKey = ref(null)
const batchError = ref('')
const summary = ref('')
const batchTotal = ref(0)
const processedCount = ref(0)
let stopRequested = false

const batchPercent = computed(() => {
  if (!batchTotal.value) return 0
  const current = progress.total ? progress.loaded / progress.total : 0
  return Math.min(100, Math.round(((processedCount.value + current) / batchTotal.value) * 100))
})

function buildMetadata(row) {
  const meta = { title: row.title.trim(), visibility: defaults.visibility }
  if (defaults.categoryId !== '') meta.categoryId = Number(defaults.categoryId)
  if (target.value === 'book') {
    meta.bookType = defaults.bookType
    meta.gradeLevel = defaults.gradeLevel
    if (defaults.curriculum) meta.curriculum = defaults.curriculum
    if (row.author.trim()) meta.author = row.author.trim()
  } else if (defaults.eventDate) {
    meta.eventDate = defaults.eventDate
  }
  return meta
}

async function startBatch() {
  if (running.value || hasEmptyTitle.value) return
  const queue = rows.value.filter((r) => r.status === 'waiting')
  if (!queue.length) return

  running.value = true
  stopRequested = false
  batchError.value = ''
  summary.value = ''
  batchTotal.value = queue.length
  processedCount.value = 0
  const before = { ...counts.value }

  for (const row of queue) {
    if (stopRequested || !rows.value.includes(row)) break
    currentKey.value = row.key
    row.status = 'uploading'
    row.message = ''
    try {
      const metadata = buildMetadata(row)
      const detail = await run((onProgress) => {
        const wrapped = (p) => {
          onProgress(p)
          if (p.total && p.loaded >= p.total) row.status = 'processing'
        }
        return target.value === 'archive'
          ? createArchive({ file: row.file, metadata, onProgress: wrapped })
          : createBook({ file: row.file, metadata, onProgress: wrapped })
      })
      row.status = 'done'
      row.resultId = detail?.id ?? null
    } catch (err) {
      if (err.code === 'ABORTED') {
        row.status = 'cancelled'
        break
      }
      if (err.status === 401) {
        row.status = 'waiting' // sesi habis; handler global mengarahkan ke login
        break
      }
      if (err.code === 'DUPLICATE_FILE') {
        row.status = 'skipped'
        row.message = 'Sudah ada di perpustakaan (mungkin di tempat sampah).'
      } else {
        row.status = 'failed'
        row.message = errorMessage(err)
        if (BATCH_STOP_CODES.has(err.code)) {
          batchError.value = `Unggahan dihentikan: ${errorMessage(err)} Berkas yang tersisa tetap menunggu.`
          break
        }
      }
    } finally {
      processedCount.value++
    }
  }

  running.value = false
  currentKey.value = null

  const after = counts.value
  const done = after.done - before.done
  const skipped = after.skipped - before.skipped
  const failed = after.failed - before.failed
  if (done + skipped + failed > 0) {
    summary.value = `${done} berhasil, ${skipped} dilewati, ${failed} gagal.`
    toast.show(`Unggah massal selesai: ${summary.value}`, { tone: failed ? 'info' : 'success', duration: 5000 })
  }
}

function cancelBatch() {
  stopRequested = true
  abort()
}

// Meninggalkan halaman saat antrean berjalan: konfirmasi, lalu XHR dibatalkan saat unmount
onBeforeRouteLeave(() => {
  if (!running.value) return true
  const ok = window.confirm(LEAVE_WHILE_UPLOADING)
  if (ok) stopRequested = true
  return ok
})
</script>
