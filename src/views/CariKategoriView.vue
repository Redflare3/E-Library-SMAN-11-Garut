<template>
  <div class="space-y-6 pb-12 text-slate-800">

    <!-- 1. HERO SEARCH SECTION (DARK TEAL BANNER CARD) -->
    <section class="bg-gradient-to-r from-[#005B70] via-[#004B5C] to-[#003845] rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
      <!-- Subtle Radial Glow Background -->
      <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Top Badge Pill -->
      <div class="relative z-10 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-200 border border-white/15 text-[11px] font-semibold">
        <svg class="w-3.5 h-3.5 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
        <span>E-Katalog Perpustakaan Digital SMAN 11 Garut</span>
      </div>

      <!-- Big Title & Description -->
      <div class="relative z-10 mt-3 space-y-1.5">
        <h1 class="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-white leading-snug">
          Eksplorasi Koleksi &amp; Literatur Digital
        </h1>
        <p class="text-xs sm:text-sm text-cyan-100/80 max-w-3xl leading-relaxed">
          Cari buku teks, modul ajar, bank soal, dan bahan presentasi berdasarkan judul, penulis, atau deskripsi.
        </p>
      </div>

      <!-- Main Search Bar Container -->
      <form
        class="relative z-10 mt-6 bg-white rounded-2xl p-2 sm:p-2.5 shadow-md flex flex-col md:flex-row items-center gap-2 text-slate-800"
        role="search"
        @submit.prevent="submitSearch"
      >
        <!-- Input Text Keyword with Search Icon & Clear Button -->
        <div class="flex-1 w-full flex items-center gap-2 px-2">
          <svg class="w-5 h-5 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model="searchInput"
            type="search"
            aria-label="Kata kunci pencarian"
            placeholder="Ketik judul buku, penulis, atau topik..."
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

        <!-- Primary Button: Cari Buku -->
        <button
          type="submit"
          class="w-full md:w-auto bg-[#005B70] hover:bg-[#004859] active:bg-[#003845] text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap shadow-xs transition-colors cursor-pointer"
        >
          <span>Cari Buku</span>
          <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </form>

      <!-- Quick Category Chips -->
      <div v-if="quickCategories.length" class="relative z-10 flex flex-wrap items-center gap-2 pt-3 text-xs">
        <span class="text-cyan-200/90 text-[11px] font-medium mr-1">Kategori:</span>
        <button
          v-for="cat in quickCategories"
          :key="cat.id"
          type="button"
          :class="[
            'px-3 py-1 rounded-full border text-[11px] font-medium cursor-pointer transition-colors shadow-2xs',
            filters.categoryId === cat.id
              ? 'bg-white text-[#005B70] border-white'
              : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
          ]"
          @click="setFilter('categoryId', cat.id)"
        >
          {{ cat.name }}
        </button>
      </div>
    </section>

    <!-- 2. ACTIVE FILTER BAR & RESULTS HEADER -->
    <section class="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">

      <!-- Filter Aktif Chips -->
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
          FILTER AKTIF:
        </span>

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
            @click="setFilter(chip.key, null)"
          >
            ✕
          </button>
        </span>

        <!-- Reset Button -->
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

      <!-- Result Info & Sort Dropdown -->
      <div class="flex flex-wrap items-center gap-3 self-end md:self-auto">
        <div v-if="results.state === 'ready'" class="text-slate-500 font-medium">
          Menampilkan <strong class="text-slate-800 font-bold">{{ results.items.length }}</strong> dari <strong class="text-slate-800 font-bold">{{ formatNumber(results.totalElements) }}</strong> Koleksi
        </div>

        <div class="flex items-center gap-1.5">
          <label for="sort-select" class="text-slate-400 text-[11px]">Urutkan:</label>
          <select
            id="sort-select"
            :value="filters.sort"
            class="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005B70] cursor-pointer"
            @change="setFilter('sort', $event.target.value)"
          >
            <option value="newest">Terbaru Diunggah</option>
            <option value="popular">Paling Banyak Diunduh</option>
            <option value="title">Judul (A - Z)</option>
          </select>
        </div>
      </div>

    </section>

    <!-- 3. MAIN 2-COLUMN LAYOUT (SIDEBAR FILTER VS SEARCH RESULTS GRID) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      <!-- ===================== KOLOM KIRI: SIDEBAR FILTER ===================== -->
      <aside class="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-5 text-xs text-slate-700">

        <!-- Accordion 1: Kategori -->
        <div class="space-y-3 pb-4 border-b border-slate-100">
          <button
            type="button"
            class="w-full flex items-center justify-between font-bold text-slate-800 cursor-pointer"
            :aria-expanded="accordionState.kategori"
            @click="accordionState.kategori = !accordionState.kategori"
          >
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 text-[#005B70]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Kategori</span>
            </span>
            <svg
              class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200"
              :class="{ 'rotate-180': !accordionState.kategori }"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>

          <div v-show="accordionState.kategori" class="space-y-2 pl-1 max-h-72 overflow-y-auto">
            <label class="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer">
              <input
                type="radio"
                name="filter-kategori"
                :checked="filters.categoryId === null"
                class="border-slate-300 text-[#005B70] focus:ring-[#005B70]"
                @change="setFilter('categoryId', null)"
              />
              <span :class="{ 'font-bold text-slate-800': filters.categoryId === null }">Semua Kategori</span>
            </label>
            <label
              v-for="cat in categories"
              :key="cat.id"
              class="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer"
              :style="{ paddingLeft: `${cat.depth * 14}px` }"
            >
              <input
                type="radio"
                name="filter-kategori"
                :checked="filters.categoryId === cat.id"
                class="border-slate-300 text-[#005B70] focus:ring-[#005B70]"
                @change="setFilter('categoryId', cat.id)"
              />
              <span :class="{ 'font-bold text-slate-800': filters.categoryId === cat.id }">{{ cat.name }}</span>
            </label>
          </div>
        </div>

        <!-- Accordion 2: Kelas -->
        <div class="space-y-3 pb-4 border-b border-slate-100">
          <button
            type="button"
            class="w-full flex items-center justify-between font-bold text-slate-800 cursor-pointer"
            :aria-expanded="accordionState.kelas"
            @click="accordionState.kelas = !accordionState.kelas"
          >
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 text-[#005B70]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <span>Kelas</span>
            </span>
            <svg
              class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200"
              :class="{ 'rotate-180': !accordionState.kelas }"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>

          <div v-show="accordionState.kelas" class="space-y-2 pl-1">
            <label
              v-for="opt in gradeOptions"
              :key="opt.value ?? 'all'"
              class="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <input
                type="radio"
                name="filter-kelas"
                :checked="filters.grade === opt.value"
                class="border-slate-300 text-[#005B70] focus:ring-[#005B70]"
                @change="setFilter('grade', opt.value)"
              />
              <span :class="{ 'font-bold text-slate-800': filters.grade === opt.value }">{{ opt.label }}</span>
            </label>
          </div>
        </div>

        <!-- Accordion 3: Jenis Bahan -->
        <div class="space-y-3">
          <button
            type="button"
            class="w-full flex items-center justify-between font-bold text-slate-800 cursor-pointer"
            :aria-expanded="accordionState.jenis"
            @click="accordionState.jenis = !accordionState.jenis"
          >
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 text-[#005B70]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>Jenis Bahan</span>
            </span>
            <svg
              class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200"
              :class="{ 'rotate-180': !accordionState.jenis }"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>

          <div v-show="accordionState.jenis" class="space-y-2 pl-1">
            <label
              v-for="opt in typeOptions"
              :key="opt.value ?? 'all'"
              class="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <input
                type="radio"
                name="filter-jenis"
                :checked="filters.type === opt.value"
                class="border-slate-300 text-[#005B70] focus:ring-[#005B70]"
                @change="setFilter('type', opt.value)"
              />
              <span :class="{ 'font-bold text-slate-800': filters.type === opt.value }">{{ opt.label }}</span>
            </label>
          </div>
        </div>

      </aside>

      <!-- ===================== KOLOM KANAN: GRID HASIL PENCARIAN BUKU ===================== -->
      <main class="lg:col-span-9 space-y-5 min-w-0">

        <!-- Header Info Query -->
        <div class="bg-[#EAF5F8] border border-[#CFE7EE] rounded-2xl p-4 flex items-center gap-3 text-xs shadow-2xs">
          <div class="w-9 h-9 rounded-xl bg-white border border-[#CFE7EE] text-[#005B70] flex items-center justify-center shrink-0 shadow-2xs">
            <svg class="w-5 h-5 text-[#005B70]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div class="min-w-0">
            <h2 class="font-extrabold text-[#005B70] text-xs sm:text-sm tracking-tight leading-snug break-words">
              Hasil Pencarian: {{ resultsHeading }}
            </h2>
            <p class="text-[11px] text-slate-500 mt-1">
              <template v-if="results.state === 'ready'">{{ formatNumber(results.totalElements) }} judul ditemukan</template>
              <template v-else-if="results.state === 'loading'">Memuat koleksi…</template>
              <template v-else-if="results.state === 'empty'">0 judul ditemukan</template>
              <template v-else>Koleksi belum dapat dimuat</template>
            </p>
          </div>
        </div>

        <StateBlock
          v-if="results.state !== 'ready'"
          :state="results.state"
          :title="results.state === 'error' ? 'Gagal memuat hasil pencarian' : 'Tidak ada buku yang sesuai'"
          :message="results.state === 'error'
            ? results.error
            : 'Tidak ditemukan koleksi dengan kata kunci atau filter yang Anda pilih. Coba sesuaikan kata kunci atau bersihkan filter.'"
          :reset-label="activeChips.length ? 'Reset Semua Filter' : ''"
          :skeleton-count="6"
          grid-class="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          @retry="loadResults"
          @reset="resetFilters"
        />

        <!-- 3-Column Book Cards Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          <article
            v-for="buku in results.items"
            :key="buku.id"
            class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
          >
            <div class="space-y-3">
              <!-- COVER BUKU DIGITAL (placeholder abu-abu netral bila tanpa sampul) -->
              <div class="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-2xs flex flex-col justify-between p-3">
                <BookCover :book="buku" variant="neutral" />

                <!-- Floating Badges Top-Left (Kelas & Jenis) -->
                <div class="relative z-20 flex flex-col gap-1 self-start">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold shadow-xs bg-[#005B70] text-white">
                    {{ labelFor(GRADE_LABELS, buku.gradeLevel) }}
                  </span>
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-white/95 text-slate-800 border border-slate-200/80 shadow-xs">
                    {{ labelFor(BOOK_TYPE_LABELS, buku.bookType) }}
                  </span>
                </div>

                <!-- Staff Badge Top-Right -->
                <div v-if="buku.visibility === 'STAFF'" class="absolute top-3 right-3 z-20">
                  <span class="text-[9px] font-bold px-1.5 py-0.5 rounded shadow-2xs border bg-amber-50 text-amber-700 border-amber-200">
                    Staf
                  </span>
                </div>

                <!-- Bottom subtle label -->
                <div class="relative z-20 text-center text-[8px] font-mono tracking-widest text-slate-500 uppercase">
                  {{ buku.categoryName || 'SMAN 11 GARUT • E-LIBRARY' }}
                </div>
              </div>

              <!-- Metadata Info -->
              <div class="space-y-1">
                <h3 class="font-bold text-xs text-slate-800 line-clamp-2 group-hover:text-[#005B70] transition-colors leading-snug">
                  {{ buku.title }}
                </h3>
                <p v-if="buku.author" class="text-[11px] text-slate-400 line-clamp-1">
                  {{ buku.author }}
                </p>
              </div>
            </div>

            <!-- Action Button -->
            <div class="pt-3">
              <router-link
                :to="`/buku/${buku.id}`"
                class="w-full py-2 bg-[#005B70] hover:bg-[#004859] active:bg-[#003845] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                <span>Lihat &amp; Baca</span>
              </router-link>
            </div>
          </article>

        </div>

        <!-- 4. PAGINATION BAR -->
        <div
          v-if="results.state === 'ready'"
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 text-xs text-slate-400 border-t border-slate-100"
        >
          <div>
            Menampilkan baris {{ rangeStart }}–{{ rangeEnd }} dari total {{ formatNumber(results.totalElements) }} judul
          </div>
          <Pagination :page="filters.page" :total-pages="results.totalPages" @update:page="setPage" />
        </div>

      </main>

    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BookCover from '../components/BookCover.vue'
import Pagination from '../components/Pagination.vue'
import StateBlock from '../components/StateBlock.vue'
import { listBooks } from '../api/books.js'
import { listCategories, flattenCategories } from '../api/categories.js'
import { getFilters } from '../api/meta.js'
import { errorMessage } from '../utils/errors.js'
import { BOOK_TYPE_LABELS, GRADE_LABELS, labelFor, formatNumber } from '../utils/labels.js'

const route = useRoute()
const router = useRouter()

const PAGE_SIZE = 12
const SORTS = ['newest', 'popular', 'title']
const DEBOUNCE_MS = 300

// ---------- Opsi filter dari API ----------
const categories = ref([]) // datar, dengan depth
const rootCategories = ref([])
const gradeLevels = ref([])
const bookTypes = ref([])

const quickCategories = computed(() => rootCategories.value.slice(0, 6))
const gradeOptions = computed(() => [
  { value: null, label: 'Semua Kelas' },
  ...gradeLevels.value.map((g) => ({ value: g, label: labelFor(GRADE_LABELS, g) }))
])
const typeOptions = computed(() => [
  { value: null, label: 'Semua Jenis' },
  ...bookTypes.value.map((t) => ({ value: t, label: labelFor(BOOK_TYPE_LABELS, t) }))
])

const accordionState = reactive({ kategori: true, kelas: true, jenis: true })

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
  const next = { ...filters.value, page: 0, ...patch }
  const query = buildQuery(next)
  const target = { name: 'Kategori', query }
  return replace ? router.replace(target) : router.push(target)
}

function setFilter(key, value) {
  navigate({ [key]: value })
}

function setPage(page) {
  navigate({ page })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function resetFilters() {
  clearTimeout(debounceTimer)
  searchInput.value = ''
  router.push({ name: 'Kategori', query: filters.value.sort !== 'newest' ? { sort: filters.value.sort } : {} })
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

// Sinkronkan input bila q berubah dari luar (Back/Forward, chip ✕, reset)
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

// ---------- Chip filter aktif ----------
const categoryName = (id) => categories.value.find((c) => c.id === id)?.name ?? `Kategori #${id}`

const activeChips = computed(() => {
  const f = filters.value
  const chips = []
  if (f.q) chips.push({ key: 'q', label: `Kata Kunci: "${f.q}"` })
  if (f.categoryId !== null) chips.push({ key: 'categoryId', label: `Kategori: ${categoryName(f.categoryId)}` })
  if (f.grade) chips.push({ key: 'grade', label: labelFor(GRADE_LABELS, f.grade) })
  if (f.type) chips.push({ key: 'type', label: `Jenis: ${labelFor(BOOK_TYPE_LABELS, f.type)}` })
  return chips
})

const resultsHeading = computed(() => {
  const f = filters.value
  const parts = [f.q ? `"${f.q}"` : 'Semua Koleksi']
  if (f.categoryId !== null) parts.push(categoryName(f.categoryId))
  if (f.grade) parts.push(labelFor(GRADE_LABELS, f.grade))
  if (f.type) parts.push(labelFor(BOOK_TYPE_LABELS, f.type))
  return parts.join(' • ')
})

// ---------- Hasil pencarian ----------
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

const rangeStart = computed(() => (results.items.length ? filters.value.page * PAGE_SIZE + 1 : 0))
const rangeEnd = computed(() => filters.value.page * PAGE_SIZE + results.items.length)

// Muat ulang setiap kali query string berubah (selama masih di halaman ini)
watch(
  () => route.fullPath,
  () => {
    if (route.name === 'Kategori') loadResults()
  },
  { immediate: true }
)

onMounted(async () => {
  const [tree, meta] = await Promise.allSettled([listCategories('BOOK'), getFilters()])
  if (tree.status === 'fulfilled') {
    categories.value = flattenCategories(tree.value)
    rootCategories.value = tree.value.map((c) => ({ id: c.id, name: c.name }))
  }
  if (meta.status === 'fulfilled') {
    gradeLevels.value = meta.value.gradeLevels || []
    bookTypes.value = meta.value.bookTypes || []
  }
})
</script>
