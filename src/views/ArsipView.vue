<template>
  <div class="space-y-6">
    <header>
      <h1 class="text-2xl font-semibold text-slate-900 tracking-tight">Arsip Sekolah</h1>
      <p class="mt-1 text-sm text-slate-500">
        Foto, video, dan dokumen kegiatan, prestasi, serta dokumen resmi SMAN 11 Garut.
      </p>
    </header>

    <!-- Pencarian -->
    <form class="relative" role="search" @submit.prevent="submitSearch">
      <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        v-model="searchInput"
        type="search"
        aria-label="Cari arsip"
        placeholder="Cari judul atau deskripsi arsip"
        class="w-full h-11 pl-10 pr-10 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 [&::-webkit-search-cancel-button]:hidden"
      />
      <button
        v-if="searchInput"
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
        aria-label="Hapus pencarian"
        @click="clearSearch"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>
    </form>

    <!-- Filter -->
    <div class="space-y-2">
      <div class="flex flex-wrap items-center gap-2">
        <div class="inline-flex p-0.5 rounded-lg bg-slate-100 text-sm" role="tablist" aria-label="Jenis media">
          <button
            v-for="opt in mediaTypeOptions"
            :key="opt.value ?? 'all'"
            type="button"
            role="tab"
            :aria-selected="filters.mediaType === opt.value"
            :class="[
              'px-3 h-8 rounded-md transition-colors cursor-pointer',
              filters.mediaType === opt.value ? 'bg-white text-slate-900 font-medium shadow-xs' : 'text-slate-600 hover:text-slate-900'
            ]"
            @click="setFilter('mediaType', opt.value)"
          >
            {{ opt.label }}
          </button>
        </div>

        <FilterSelect
          :model-value="filters.categoryId"
          :options="categoryOptions"
          label="Kategori"
          all-label="Semua kategori"
          @update:model-value="setFilter('categoryId', $event)"
        />

        <div class="flex items-center gap-1.5">
          <input
            type="date"
            aria-label="Dari tanggal kegiatan"
            title="Dari tanggal kegiatan"
            :value="filters.from || ''"
            :max="filters.to || undefined"
            :class="[dateClass, filters.from ? 'border-brand text-brand' : 'border-slate-300 text-slate-700', rangeInvalid && 'border-rose-400']"
            @change="setFilter('from', $event.target.value || null)"
          />
          <span class="text-slate-400 text-sm">–</span>
          <input
            type="date"
            aria-label="Sampai tanggal kegiatan"
            title="Sampai tanggal kegiatan"
            :value="filters.to || ''"
            :min="filters.from || undefined"
            :class="[dateClass, filters.to ? 'border-brand text-brand' : 'border-slate-300 text-slate-700', rangeInvalid && 'border-rose-400']"
            @change="setFilter('to', $event.target.value || null)"
          />
        </div>

        <button
          v-if="hasFilters"
          type="button"
          class="px-2 h-9 text-sm text-slate-500 hover:text-slate-900 cursor-pointer"
          @click="resetFilters"
        >
          Hapus filter
        </button>

        <div class="w-full sm:w-auto sm:ml-auto flex items-center justify-between sm:justify-end gap-3">
          <span v-if="results.state === 'ready'" class="text-sm text-slate-500 tabular-nums">
            {{ formatNumber(results.totalElements) }} item
          </span>
          <FilterSelect
            :model-value="filters.sort"
            :options="ARCHIVE_SORT_OPTIONS"
            label="Urutkan"
            @update:model-value="setFilter('sort', $event)"
          />
        </div>
      </div>

      <p v-if="rangeInvalid" class="text-sm text-rose-600" role="alert">
        Tanggal awal tidak boleh setelah tanggal akhir.
      </p>
    </div>

    <!-- Hasil -->
    <StateBlock
      v-if="results.state !== 'ready'"
      plain
      :state="results.state"
      :title="results.state === 'error' ? 'Gagal memuat arsip' : 'Tidak ada arsip yang cocok'"
      :message="results.state === 'error' ? results.error : hasFilters ? 'Coba kata kunci lain atau hapus filter.' : 'Belum ada arsip.'"
      :reset-label="hasFilters ? 'Hapus filter' : ''"
      :skeleton-count="12"
      :grid-class="GRID"
      aspect-class="aspect-[4/3]"
      @retry="retry"
      @reset="resetFilters"
    />

    <div v-else :class="['grid gap-x-4 gap-y-6', GRID]">
      <button
        v-for="item in results.items"
        :key="item.id"
        type="button"
        :data-archive-id="item.id"
        class="group text-left min-w-0 cursor-pointer focus:outline-none"
        @click="openItem(item.id)"
      >
        <div class="relative aspect-[4/3] rounded-lg overflow-hidden ring-1 ring-slate-200 transition-shadow group-hover:ring-slate-300 group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-brand">
          <ArchiveThumb :item="item" quiet />
        </div>
        <h3 class="mt-2.5 text-sm font-medium text-slate-900 leading-snug line-clamp-2 break-words group-hover:text-brand transition-colors">
          {{ item.title }}
        </h3>
        <p class="mt-0.5 text-xs text-slate-500 truncate">
          {{ formatEventDate(item.eventDate) || 'Tanpa tanggal' }}<template v-if="item.categoryName"> · {{ item.categoryName }}</template>
        </p>
      </button>
    </div>

    <div
      v-if="results.state === 'ready' && results.totalPages > 1"
      class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-sm text-slate-500"
    >
      <span>Halaman {{ filters.page + 1 }} dari {{ results.totalPages }}</span>
      <Pagination :page="filters.page" :total-pages="results.totalPages" @update:page="setPage" />
    </div>

    <!-- Lightbox -->
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
      @notify="toast.show($event, { tone: 'info' })"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ArchiveThumb from '../components/ArchiveThumb.vue'
import ArchiveLightbox from '../components/ArchiveLightbox.vue'
import FilterSelect from '../components/FilterSelect.vue'
import Pagination from '../components/Pagination.vue'
import StateBlock from '../components/StateBlock.vue'
import { listArchive } from '../api/archive.js'
import { listCategories, flattenCategories } from '../api/categories.js'
import { getFilters } from '../api/meta.js'
import { useToast } from '../composables/toast.js'
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
const toast = useToast()

const PAGE_SIZE = 24
const SORTS = ARCHIVE_SORT_OPTIONS.map((o) => o.value)
const DEBOUNCE_MS = 300
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const GRID = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
const dateClass = 'h-9 w-[9.5rem] rounded-lg border bg-white px-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand'

// ---------- Opsi filter dari API ----------
const categories = ref([])
const mediaTypes = ref(['IMAGE', 'VIDEO', 'DOCUMENT'])

const mediaTypeOptions = computed(() => [
  { value: null, label: 'Semua' },
  ...mediaTypes.value.map((t) => ({ value: t, label: labelFor(MEDIA_TYPE_LABELS, t) }))
])
const categoryOptions = computed(() =>
  categories.value.map((c) => ({ value: c.id, label: `${'   '.repeat(c.depth)}${c.name}` }))
)

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

const hasFilters = computed(() => {
  const f = filters.value
  return !!(f.q || f.categoryId !== null || f.mediaType || f.from || f.to)
})

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

onBeforeUnmount(() => clearTimeout(debounceTimer))

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
  toast.show('Item arsip tidak ditemukan', { tone: 'error' })
}

// ---------- Data pendukung ----------
async function loadSupport() {
  const [tree, meta] = await Promise.allSettled([
    categories.value.length ? Promise.resolve(null) : listCategories('ARCHIVE'),
    getFilters()
  ])
  if (tree.status === 'fulfilled' && tree.value) categories.value = flattenCategories(tree.value)
  if (meta.status === 'fulfilled' && meta.value.mediaTypes?.length) mediaTypes.value = meta.value.mediaTypes
}

// Coba lagi: muat ulang hasil, serta kategori bila tadi gagal
function retry() {
  loadResults()
  if (!categories.value.length) loadSupport()
}

onMounted(loadSupport)
</script>
