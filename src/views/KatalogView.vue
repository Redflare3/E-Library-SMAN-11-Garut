<template>
  <div class="space-y-6">
    <header>
      <h1 class="text-2xl font-semibold text-slate-900 tracking-tight">Katalog Buku</h1>
      <p class="mt-1 text-sm text-slate-500">
        Buku teks, modul ajar, bank soal, dan bahan presentasi SMAN 11 Garut.
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
        aria-label="Cari buku"
        placeholder="Cari judul, penulis, atau topik"
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

    <!-- Filter + urutan -->
    <div class="flex flex-wrap items-center gap-2">
      <FilterSelect
        :model-value="filters.categoryId"
        :options="categoryOptions"
        label="Kategori"
        all-label="Semua kategori"
        @update:model-value="setFilter('categoryId', $event)"
      />
      <FilterSelect
        :model-value="filters.grade"
        :options="gradeOptions"
        label="Kelas"
        all-label="Semua kelas"
        @update:model-value="setFilter('grade', $event)"
      />
      <FilterSelect
        :model-value="filters.type"
        :options="typeOptions"
        label="Jenis bahan"
        all-label="Semua jenis"
        @update:model-value="setFilter('type', $event)"
      />
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
          {{ formatNumber(results.totalElements) }} buku
        </span>
        <FilterSelect
          :model-value="filters.sort"
          :options="SORT_OPTIONS"
          label="Urutkan"
          @update:model-value="setFilter('sort', $event)"
        />
      </div>
    </div>

    <!-- Hasil -->
    <StateBlock
      v-if="results.state !== 'ready'"
      plain
      :state="results.state"
      :title="results.state === 'error' ? 'Gagal memuat katalog' : 'Tidak ada buku yang cocok'"
      :message="results.state === 'error' ? results.error : hasFilters ? 'Coba kata kunci lain atau hapus filter.' : 'Belum ada buku di perpustakaan.'"
      :reset-label="hasFilters ? 'Hapus filter' : ''"
      :skeleton-count="10"
      :grid-class="GRID"
      @retry="loadResults"
      @reset="resetFilters"
    />

    <div v-else :class="['grid gap-x-5 gap-y-8', GRID]">
      <BookCard v-for="buku in results.items" :key="buku.id" :book="buku" />
    </div>

    <div
      v-if="results.state === 'ready' && results.totalPages > 1"
      class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-sm text-slate-500"
    >
      <span>Halaman {{ filters.page + 1 }} dari {{ results.totalPages }}</span>
      <Pagination :page="filters.page" :total-pages="results.totalPages" @update:page="setPage" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BookCard from '../components/BookCard.vue'
import FilterSelect from '../components/FilterSelect.vue'
import Pagination from '../components/Pagination.vue'
import StateBlock from '../components/StateBlock.vue'
import { listBooks } from '../api/books.js'
import { listCategories, flattenCategories } from '../api/categories.js'
import { getFilters } from '../api/meta.js'
import { errorMessage } from '../utils/errors.js'
import { BOOK_TYPE_LABELS, GRADE_LABELS, labelFor, formatNumber } from '../utils/labels.js'

const route = useRoute()
const router = useRouter()

const PAGE_SIZE = 20
const DEBOUNCE_MS = 300
const GRID = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
const SORT_OPTIONS = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'popular', label: 'Terpopuler' },
  { value: 'title', label: 'Judul A–Z' }
]
const SORTS = SORT_OPTIONS.map((o) => o.value)

// ---------- Opsi filter dari API ----------
const categories = ref([]) // datar, dengan depth
const gradeLevels = ref([])
const bookTypes = ref([])

const categoryOptions = computed(() =>
  categories.value.map((c) => ({ value: c.id, label: `${'   '.repeat(c.depth)}${c.name}` }))
)
const gradeOptions = computed(() => gradeLevels.value.map((g) => ({ value: g, label: labelFor(GRADE_LABELS, g) })))
const typeOptions = computed(() => bookTypes.value.map((t) => ({ value: t, label: labelFor(BOOK_TYPE_LABELS, t) })))

// ---------- State filter = query string URL ----------
// URL: ?q=&categoryId=&grade=&type=&sort=&page=  (page mulai dari 1 di URL, 0 di API)
function str(v) {
  return typeof v === 'string' && v.trim() ? v.trim() : null
}

const filters = computed(() => {
  const q = route.query
  const categoryId = Number.parseInt(q.categoryId, 10)
  const page = Number.parseInt(q.page, 10)
  return {
    q: str(q.q),
    categoryId: Number.isFinite(categoryId) ? categoryId : null,
    grade: str(q.grade),
    type: str(q.type),
    sort: SORTS.includes(q.sort) ? q.sort : 'newest',
    page: Number.isFinite(page) && page > 1 ? page - 1 : 0
  }
})

const hasFilters = computed(() => {
  const f = filters.value
  return !!(f.q || f.categoryId !== null || f.grade || f.type)
})

function buildQuery(next) {
  const query = {}
  if (next.q) query.q = next.q
  if (next.categoryId !== null && next.categoryId !== undefined) query.categoryId = String(next.categoryId)
  if (next.grade) query.grade = next.grade
  if (next.type) query.type = next.type
  if (next.sort && next.sort !== 'newest') query.sort = next.sort
  if (next.page > 0) query.page = String(next.page + 1)
  return query
}

function navigate(patch, { replace = false } = {}) {
  const query = buildQuery({ ...filters.value, page: 0, ...patch })
  const target = { name: 'Katalog', query }
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
  router.push({ name: 'Katalog', query: filters.value.sort !== 'newest' ? { sort: filters.value.sort } : {} })
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

// Sinkronkan input bila q berubah dari luar (Back/Forward, hapus filter)
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
  const id = ++resultsRequest
  const f = filters.value
  results.state = 'loading'
  try {
    const page = await listBooks({
      q: f.q,
      categoryId: f.categoryId,
      grade: f.grade,
      type: f.type,
      sort: f.sort,
      page: f.page,
      size: PAGE_SIZE
    })
    if (id !== resultsRequest) return // respons lama, abaikan
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

// Muat ulang setiap kali query string berubah (selama masih di halaman ini)
watch(
  () => route.fullPath,
  () => {
    if (route.name === 'Katalog') loadResults()
  },
  { immediate: true }
)

onMounted(async () => {
  const [tree, meta] = await Promise.allSettled([listCategories('BOOK'), getFilters()])
  if (tree.status === 'fulfilled') categories.value = flattenCategories(tree.value)
  if (meta.status === 'fulfilled') {
    gradeLevels.value = meta.value.gradeLevels || []
    bookTypes.value = meta.value.bookTypes || []
  }
})
</script>
