<template>
  <div class="space-y-6 pb-12 text-slate-800">

    <!-- 1. HERO + PENCARIAN -->
    <section class="bg-gradient-to-r from-[#005B70] via-[#004B5C] to-[#003845] rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-200 border border-white/15 text-[11px] font-semibold">
            <MediaTypeIcon type="IMAGE" class="w-3.5 h-3.5 text-cyan-300" />
            <span>Repositori Dokumentasi Sekolah</span>
          </div>
          <h1 class="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight leading-snug">Arsip Sekolah</h1>
          <p class="text-xs sm:text-sm text-cyan-100/80 max-w-2xl leading-relaxed">
            Dokumentasi kegiatan, prestasi dan dokumen resmi SMAN 11 Garut dalam bentuk foto, video, dan dokumen.
          </p>
        </div>
        <div v-if="totalAll !== null" class="shrink-0 bg-white/10 border border-white/15 rounded-2xl px-5 py-3 text-center">
          <div class="text-2xl font-black tabular-nums">{{ formatNumber(totalAll) }}</div>
          <div class="text-[11px] text-cyan-100/80 font-medium">Item Arsip</div>
        </div>
      </div>

      <form
        class="relative z-10 mt-6 bg-white rounded-2xl p-2 sm:p-2.5 shadow-md flex flex-col md:flex-row items-center gap-2 text-slate-800"
        role="search"
        @submit.prevent="submitSearch"
      >
        <div class="flex-1 w-full flex items-center gap-2 px-2">
          <svg class="w-5 h-5 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model="searchInput"
            type="search"
            aria-label="Kata kunci pencarian arsip"
            placeholder="Cari judul atau deskripsi arsip..."
            class="w-full bg-transparent py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
          />
          <button
            v-if="searchInput"
            type="button"
            class="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs cursor-pointer transition-colors shrink-0"
            title="Hapus pencarian"
            @click="clearSearch"
          >
            ✕
          </button>
        </div>
        <button
          type="submit"
          class="w-full md:w-auto bg-[#005B70] hover:bg-[#004859] active:bg-[#003845] text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap shadow-xs transition-colors cursor-pointer"
        >
          Cari Arsip
        </button>
      </form>
    </section>

    <!-- 2. BILAH FILTER -->
    <section class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-4 text-xs">
      <div class="flex flex-col lg:flex-row lg:items-end gap-4">
        <!-- Tab jenis media -->
        <div class="space-y-1.5">
          <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jenis Media</span>
          <div class="inline-flex flex-wrap gap-1 p-1 bg-slate-100 rounded-xl" role="tablist" aria-label="Jenis media">
            <button
              v-for="opt in mediaTypeOptions"
              :key="opt.value ?? 'all'"
              type="button"
              role="tab"
              :aria-selected="filters.mediaType === opt.value"
              :class="[
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer',
                filters.mediaType === opt.value ? 'bg-white text-[#005B70] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              ]"
              @click="setFilter('mediaType', opt.value)"
            >
              <MediaTypeIcon v-if="opt.value" :type="opt.value" class="w-3.5 h-3.5" />
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-1 lg:justify-end gap-3">
          <!-- Kategori -->
          <div class="space-y-1.5 lg:w-48">
            <label for="arsip-kategori" class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategori</label>
            <select
              id="arsip-kategori"
              :value="filters.categoryId ?? ''"
              class="w-full bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold px-2.5 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005B70] cursor-pointer"
              @change="setFilter('categoryId', $event.target.value ? Number($event.target.value) : null)"
            >
              <option value="">Semua Kategori</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ '  '.repeat(cat.depth * 2) }}{{ cat.name }}
              </option>
            </select>
          </div>

          <!-- Urutkan -->
          <div class="space-y-1.5 lg:w-44">
            <label for="arsip-sort" class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Urutkan</label>
            <select
              id="arsip-sort"
              :value="filters.sort"
              class="w-full bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold px-2.5 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005B70] cursor-pointer"
              @change="setFilter('sort', $event.target.value)"
            >
              <option v-for="opt in ARCHIVE_SORT_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>

          <!-- Rentang tanggal kegiatan -->
          <div class="space-y-1.5 sm:col-span-2 lg:col-span-1">
            <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tanggal Kegiatan</span>
            <div class="flex items-center gap-2">
              <input
                type="date"
                aria-label="Dari tanggal"
                :value="filters.from || ''"
                :max="filters.to || undefined"
                :class="['flex-1 min-w-0 bg-slate-50 border text-xs text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005B70]', rangeInvalid ? 'border-rose-300' : 'border-slate-200']"
                @change="setFilter('from', $event.target.value || null)"
              />
              <span class="text-slate-400">–</span>
              <input
                type="date"
                aria-label="Sampai tanggal"
                :value="filters.to || ''"
                :min="filters.from || undefined"
                :class="['flex-1 min-w-0 bg-slate-50 border text-xs text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005B70]', rangeInvalid ? 'border-rose-300' : 'border-slate-200']"
                @change="setFilter('to', $event.target.value || null)"
              />
            </div>
          </div>
        </div>
      </div>

      <p v-if="rangeInvalid" class="text-xs font-semibold text-rose-600" role="alert">
        Tanggal "Dari" tidak boleh setelah tanggal "Sampai".
      </p>

      <!-- Chip filter aktif + info hasil -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Filter Aktif:</span>
          <span
            v-for="chip in activeChips"
            :key="chip.key"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-[#005B70] border border-sky-200"
          >
            <span>{{ chip.label }}</span>
            <button
              type="button"
              class="hover:text-rose-600 cursor-pointer font-bold ml-0.5"
              :aria-label="`Hapus filter ${chip.label}`"
              @click="navigate(chip.clear)"
            >
              ✕
            </button>
          </span>
          <button
            v-if="activeChips.length"
            type="button"
            class="text-xs font-semibold text-slate-400 hover:text-rose-600 ml-2 transition-colors cursor-pointer"
            @click="resetFilters"
          >
            Reset Semua
          </button>
          <span v-else class="text-xs text-slate-400 italic">Tidak ada filter aktif</span>
        </div>
        <div v-if="results.state === 'ready'" class="text-slate-500 font-medium shrink-0">
          Menampilkan <strong class="text-slate-800">{{ rangeStart }}–{{ rangeEnd }}</strong> dari
          <strong class="text-slate-800">{{ formatNumber(results.totalElements) }}</strong> item
        </div>
      </div>
    </section>

    <!-- 3. GRID HASIL -->
    <StateBlock
      v-if="results.state !== 'ready'"
      :state="results.state"
      :title="results.state === 'error' ? 'Gagal memuat arsip' : 'Tidak ada arsip yang sesuai'"
      :message="results.state === 'error'
        ? results.error
        : 'Tidak ditemukan arsip dengan kata kunci atau filter yang Anda pilih. Coba sesuaikan kata kunci atau bersihkan filter.'"
      :reset-label="activeChips.length ? 'Reset Semua Filter' : ''"
      :skeleton-count="PAGE_SIZE"
      grid-class="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      aspect-class="aspect-[4/3]"
      @retry="retry"
      @reset="resetFilters"
    />

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
      <button
        v-for="item in results.items"
        :key="item.id"
        type="button"
        :data-archive-id="item.id"
        class="text-left bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-200/80 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#005B70]"
        @click="openItem(item.id)"
      >
        <div class="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-200/80">
          <ArchiveThumb :item="item" />
        </div>
        <div class="pt-2.5 space-y-1 min-w-0">
          <h3 class="font-bold text-xs text-slate-800 line-clamp-2 leading-snug group-hover:text-[#005B70] transition-colors break-words">
            {{ item.title }}
          </h3>
          <p class="text-[11px] text-slate-400 truncate">
            {{ formatEventDate(item.eventDate) || 'Tanpa tanggal' }}<template v-if="item.categoryName"> · {{ item.categoryName }}</template>
          </p>
        </div>
      </button>
    </div>

    <!-- 4. PAGINASI -->
    <div
      v-if="results.state === 'ready' && results.totalPages > 1"
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 text-xs text-slate-400 border-t border-slate-100"
    >
      <div>Halaman {{ filters.page + 1 }} dari {{ results.totalPages }}</div>
      <Pagination :page="filters.page" :total-pages="results.totalPages" @update:page="setPage" />
    </div>

    <!-- LIGHTBOX -->
    <ArchiveLightbox
      v-if="lightboxItem"
      :item="lightboxItem"
      :has-prev="lightboxIndex > 0"
      :has-next="lightboxIndex >= 0 && lightboxIndex < results.items.length - 1"
      :show-nav="lightboxIndex >= 0"
      @close="closeItem"
      @prev="stepItem(-1)"
      @next="stepItem(1)"
      @not-found="onItemNotFound"
      @notify="triggerToast"
    />

    <!-- Toast -->
    <transition name="toast">
      <div
        v-if="showToast"
        class="fixed bottom-6 right-6 z-[70] bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 text-xs max-w-[calc(100vw-3rem)]"
        role="status"
      >
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ArchiveThumb from '../components/ArchiveThumb.vue'
import ArchiveLightbox from '../components/ArchiveLightbox.vue'
import MediaTypeIcon from '../components/MediaTypeIcon.vue'
import Pagination from '../components/Pagination.vue'
import StateBlock from '../components/StateBlock.vue'
import { listArchive } from '../api/archive.js'
import { listCategories, flattenCategories } from '../api/categories.js'
import { getFilters } from '../api/meta.js'
import { errorMessage } from '../utils/errors.js'
import {
  MEDIA_TYPE_LABELS,
  ARCHIVE_SORT_OPTIONS,
  labelFor,
  formatNumber,
  formatEventDate
} from '../utils/labels.js'

const route = useRoute()
const router = useRouter()

const PAGE_SIZE = 24
const SORTS = ARCHIVE_SORT_OPTIONS.map((o) => o.value)
const DEBOUNCE_MS = 300
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

// ---------- Opsi filter dari API ----------
const categories = ref([])
const mediaTypes = ref(['IMAGE', 'VIDEO', 'DOCUMENT'])
const totalAll = ref(null)

const mediaTypeOptions = computed(() => [
  { value: null, label: 'Semua' },
  ...mediaTypes.value.map((t) => ({ value: t, label: labelFor(MEDIA_TYPE_LABELS, t) }))
])

// ---------- State filter = query string URL ----------
// URL: ?q=&categoryId=&mediaType=&from=&to=&sort=&page=&item=  (page mulai dari 1 di URL)
function str(v) {
  return typeof v === 'string' && v.trim() ? v.trim() : null
}
function dateParam(v) {
  return typeof v === 'string' && DATE_RE.test(v) ? v : null
}

const filters = computed(() => {
  const q = route.query
  const categoryId = Number.parseInt(q.categoryId, 10)
  const page = Number.parseInt(q.page, 10)
  return {
    q: str(q.q),
    categoryId: Number.isFinite(categoryId) ? categoryId : null,
    mediaType: str(q.mediaType),
    from: dateParam(q.from),
    to: dateParam(q.to),
    sort: SORTS.includes(q.sort) ? q.sort : 'newest',
    page: Number.isFinite(page) && page > 1 ? page - 1 : 0
  }
})

const itemId = computed(() => {
  const id = Number.parseInt(route.query.item, 10)
  return Number.isFinite(id) ? id : null
})

const rangeInvalid = computed(() => !!(filters.value.from && filters.value.to && filters.value.from > filters.value.to))

function buildQuery(next) {
  const query = {}
  if (next.q) query.q = next.q
  if (next.categoryId !== null && next.categoryId !== undefined) query.categoryId = String(next.categoryId)
  if (next.mediaType) query.mediaType = next.mediaType
  if (next.from) query.from = next.from
  if (next.to) query.to = next.to
  if (next.sort && next.sort !== 'newest') query.sort = next.sort
  if (next.page > 0) query.page = String(next.page + 1)
  return query
}

function navigate(patch, { replace = false } = {}) {
  const query = buildQuery({ ...filters.value, page: 0, ...patch })
  const target = { name: 'Arsip', query }
  return replace ? router.replace(target) : router.push(target)
}

function setFilter(key, value) {
  navigate({ [key]: value })
}

function setPage(page) {
  navigate({ page })
}

function resetFilters() {
  clearTimeout(debounceTimer)
  searchInput.value = ''
  router.push({ name: 'Arsip', query: filters.value.sort !== 'newest' ? { sort: filters.value.sort } : {} })
}

// ---------- Kotak pencarian (debounce → router.replace) ----------
const searchInput = ref(filters.value.q || '')
let debounceTimer = null

watch(searchInput, (value) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const q = value.trim() || null
    if (q !== filters.value.q) navigate({ q }, { replace: true })
  }, DEBOUNCE_MS)
})

function submitSearch() {
  clearTimeout(debounceTimer)
  const q = searchInput.value.trim() || null
  if (q !== filters.value.q) navigate({ q })
}

function clearSearch() {
  clearTimeout(debounceTimer)
  searchInput.value = ''
  if (filters.value.q) navigate({ q: null })
}

watch(
  () => filters.value.q,
  (q) => {
    if ((q || '') !== searchInput.value.trim()) {
      clearTimeout(debounceTimer)
      searchInput.value = q || ''
    }
  }
)

// ---------- Chip filter aktif ----------
const categoryName = (id) => categories.value.find((c) => c.id === id)?.name ?? `Kategori #${id}`

const activeChips = computed(() => {
  const f = filters.value
  const chips = []
  if (f.q) chips.push({ key: 'q', label: `Kata Kunci: "${f.q}"`, clear: { q: null } })
  if (f.mediaType) chips.push({ key: 'mediaType', label: `Jenis: ${labelFor(MEDIA_TYPE_LABELS, f.mediaType)}`, clear: { mediaType: null } })
  if (f.categoryId !== null) chips.push({ key: 'categoryId', label: `Kategori: ${categoryName(f.categoryId)}`, clear: { categoryId: null } })
  if (f.from || f.to) {
    const label = f.from && f.to
      ? `${formatEventDate(f.from)} – ${formatEventDate(f.to)}`
      : f.from ? `Sejak ${formatEventDate(f.from)}` : `Sampai ${formatEventDate(f.to)}`
    chips.push({ key: 'date', label: `Tanggal: ${label}`, clear: { from: null, to: null } })
  }
  return chips
})

// ---------- Hasil ----------
const results = reactive({ state: 'loading', items: [], totalElements: 0, totalPages: 0, error: '' })
let resultsRequest = 0

async function loadResults() {
  const f = filters.value
  if (rangeInvalid.value) {
    resultsRequest++ // batalkan request yang sedang berjalan; grid dibiarkan apa adanya
    if (results.state === 'loading') results.state = results.items.length ? 'ready' : 'empty'
    return
  }
  const id = ++resultsRequest
  results.state = 'loading'
  try {
    const page = await listArchive({
      q: f.q,
      categoryId: f.categoryId,
      mediaType: f.mediaType,
      from: f.from,
      to: f.to,
      sort: f.sort,
      page: f.page,
      size: PAGE_SIZE
    })
    if (id !== resultsRequest) return
    results.items = page.content
    results.totalElements = page.totalElements
    results.totalPages = page.totalPages
    results.state = page.content.length ? 'ready' : 'empty'
  } catch (err) {
    if (id !== resultsRequest) return
    results.error = errorMessage(err)
    results.state = 'error'
  }
}

const rangeStart = computed(() => (results.items.length ? filters.value.page * PAGE_SIZE + 1 : 0))
const rangeEnd = computed(() => filters.value.page * PAGE_SIZE + results.items.length)

// Muat ulang hanya bila filter berubah; perubahan `item` (lightbox) tidak memicu request daftar
const listKey = computed(() => JSON.stringify(filters.value))
watch(
  listKey,
  () => {
    if (route.name === 'Arsip') loadResults()
  },
  { immediate: true }
)

// ---------- Lightbox (?item=ID) ----------
const lightboxIndex = computed(() =>
  itemId.value === null ? -1 : results.items.findIndex((i) => i.id === itemId.value)
)
const lightboxItem = computed(() => {
  if (itemId.value === null) return null
  return lightboxIndex.value >= 0 ? results.items[lightboxIndex.value] : { id: itemId.value }
})

function withItem(id) {
  const query = { ...route.query }
  if (id === null) delete query.item
  else query.item = String(id)
  return { name: 'Arsip', query }
}

function openItem(id) {
  router.replace(withItem(id))
}

function closeItem() {
  const id = itemId.value
  router.replace(withItem(null)).then(() => {
    nextTick(() => document.querySelector(`[data-archive-id="${id}"]`)?.focus())
  })
}

function stepItem(delta) {
  const next = results.items[lightboxIndex.value + delta]
  if (next) router.replace(withItem(next.id))
}

function onItemNotFound() {
  router.replace(withItem(null))
  triggerToast('Item arsip tidak ditemukan')
}

// ---------- Toast ----------
const showToast = ref(false)
const toastMessage = ref('')
let toastTimer = null

function triggerToast(msg) {
  toastMessage.value = msg
  showToast.value = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    showToast.value = false
  }, 3000)
}

onBeforeUnmount(() => {
  clearTimeout(debounceTimer)
  clearTimeout(toastTimer)
})

// ---------- Data pendukung ----------
async function loadSupport() {
  const [tree, meta, total] = await Promise.allSettled([
    categories.value.length ? Promise.resolve(null) : listCategories('ARCHIVE'),
    getFilters(),
    listArchive({ size: 1 })
  ])
  if (tree.status === 'fulfilled' && tree.value) categories.value = flattenCategories(tree.value)
  if (meta.status === 'fulfilled' && meta.value.mediaTypes?.length) mediaTypes.value = meta.value.mediaTypes
  if (total.status === 'fulfilled') totalAll.value = total.value.totalElements
}

// Coba Lagi: muat ulang hasil, serta data pendukung yang tadi gagal
function retry() {
  loadResults()
  if (totalAll.value === null || !categories.value.length) loadSupport()
}

onMounted(loadSupport)
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.95);
}
</style>
