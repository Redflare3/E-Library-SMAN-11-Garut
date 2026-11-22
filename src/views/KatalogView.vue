<template>
  <div class="space-y-12 pb-8 text-slate-800 select-none">
    
    <!-- 1. HERO SECTION (Eksplorasi Ilmu Tanpa Batas) -->
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
      
      <!-- Kiri: Hero Text & Action (7 Cols) -->
      <div class="lg:col-span-7 space-y-5">
        <!-- Badge Pill Top -->
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/90 border border-blue-100 text-[#0B6B82] text-[11px] font-bold tracking-wide uppercase shadow-2xs">
          <span class="w-2 h-2 rounded-full bg-[#0B6B82] animate-pulse"></span>
          <span>GERAKAN LITERASI SEKOLAH • KAMPUS DIGITAL</span>
        </div>

        <!-- Big Title -->
        <h1 class="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          Eksplorasi Ilmu Tanpa Batas di <br class="hidden sm:inline" />
          <span class="text-[#0B6B82]">SMAN 11 Garut</span>
        </h1>

        <!-- Deskripsi -->
        <p class="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
          Portal perpustakaan akademik modern berbasis Kurikulum Merdeka. Temukan buku teks Fase E &amp; F, modul pengayaan, jurnal ilmiah, dan e-book interaktif untuk akselerasi prestasi siswa.
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-3 pt-1">
          <!-- Button Jelajahi Koleksi -->
          <router-link
            to="/kategori"
            class="px-5 py-3 rounded-xl bg-[#005B70] hover:bg-[#004859] active:bg-[#003845] text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <!-- Search Icon -->
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>Jelajahi Koleksi</span>
          </router-link>

          <!-- Button Panduan Baca E-Book -->
          <button
            type="button"
            class="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
            @click="showGuideAlert"
          >
            <!-- Book Guide Icon -->
            <svg class="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span>Panduan Baca E-Book</span>
          </button>
        </div>

        <!-- 2 Metric Stat Cards -->
        <div class="flex items-center gap-4 pt-2">
          <!-- Stat 1 -->
          <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center gap-3.5 min-w-[160px]">
            <div class="w-10 h-10 rounded-xl bg-sky-50 text-[#005B70] flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div>
              <div class="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                {{ stats.books }}
              </div>
              <div class="text-[11px] text-slate-400 font-medium mt-1">
                Judul Koleksi Digital
              </div>
            </div>
          </div>

          <!-- Stat 2 -->
          <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center gap-3.5 min-w-[160px]">
            <div class="w-10 h-10 rounded-xl bg-sky-50 text-[#005B70] flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <div>
              <div class="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                {{ stats.categories }}
              </div>
              <div class="text-[11px] text-slate-400 font-medium mt-1">
                Kategori Koleksi
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Kanan: Pusat Belajar Siswa Card / Widget Status (5 Cols) -->
      <div class="lg:col-span-5 space-y-3">
        <!-- Top Banner Card 'PERPUSTAKAAN KENCANA XI' -->
        <div class="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-4">
          <!-- Browser dots top row -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            </div>
            <span class="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
              PERPUSTAKAAN KENCANA XI
            </span>
          </div>

          <!-- Banner Card Container (Dark Teal Ocean Theme) -->
          <div class="rounded-2xl p-5 bg-gradient-to-br from-[#0c4a60] via-[#093c4e] to-[#062937] text-white shadow-md relative overflow-hidden flex flex-col justify-between min-h-[190px]">
            <!-- Subtle Radial Aura -->
            <div class="absolute -right-10 -bottom-10 w-36 h-36 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none"></div>

            <!-- Banner Header -->
            <div class="flex items-start justify-between gap-3 relative z-10">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center p-1.5">
                  <svg class="w-4 h-4 text-cyan-200" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div>
                  <h4 class="text-xs sm:text-sm font-bold text-white tracking-tight leading-none">
                    Pusat Belajar Siswa
                  </h4>
                  <p class="text-[10px] text-cyan-200/80 mt-1">
                    Kampus Siliwangi 11 Garut
                  </p>
                </div>
              </div>

              <!-- Badge Terakreditasi A -->
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-cyan-400/20 text-cyan-200 border border-cyan-300/30">
                TERAKREDITASI A
              </span>
            </div>

            <!-- Center Sparkle Emblem Illustration -->
            <div class="my-4 relative z-10 flex items-center justify-center">
              <div class="w-14 h-14 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_16px_rgba(34,211,238,0.25)]">
                <svg class="w-7 h-7 text-cyan-200" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
                </svg>
              </div>
            </div>

            <!-- Banner Bottom Metadata -->
            <div class="flex items-center justify-between text-[10px] text-cyan-100/90 pt-1 border-t border-white/10 relative z-10">
              <div>
                Akses melalui <span class="font-semibold text-white">Wi-Fi sekolah</span>
              </div>
              <div class="flex items-center gap-1 text-emerald-300 font-semibold">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Koleksi digital aktif</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Widget Card: Sinkronisasi Dapodik & Kurikulum Merdeka -->
        <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center gap-3.5">
          <div class="w-9 h-9 rounded-xl bg-sky-50 text-[#005B70] flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-[#005B70]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>
          <div>
            <div class="text-xs font-bold text-slate-900 leading-snug">
              Kurikulum Merdeka &amp; K13
            </div>
            <div class="text-[11px] text-slate-400 mt-0.5">
              Koleksi diunggah oleh guru &amp; pustakawan
            </div>
          </div>
        </div>
      </div>

    </section>

    <!-- 2. SECTION: BUKU TERPOPULER (FILTER KELAS) -->
    <section class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div class="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#005B70] uppercase tracking-wider mb-1">
            <svg class="w-4 h-4 text-[#005B70]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>PALING BANYAK DIUNDUH</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Buku Terpopuler
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">
            Koleksi yang paling sering diunduh siswa dan guru SMAN 11 Garut.
          </p>
        </div>

        <!-- Filter Pills Kelas -->
        <div class="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto pb-1 scrollbar-none">
          <button
            v-for="pill in gradePills"
            :key="pill.value || 'all'"
            type="button"
            :class="[
              'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
              activeGrade === pill.value
                ? 'bg-[#005B70] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            ]"
            @click="activeGrade = pill.value"
          >
            {{ pill.label }}
          </button>
        </div>
      </div>

      <StateBlock
        v-if="popular.state !== 'ready'"
        :state="popular.state"
        :title="popular.state === 'error' ? 'Gagal memuat buku terpopuler' : 'Belum ada buku untuk kelas ini'"
        :message="popular.state === 'error' ? popular.error : ''"
        :skeleton-count="3"
        grid-class="grid-cols-1 md:grid-cols-3"
        @retry="loadPopular"
      />

      <!-- 3 Grid Book Card Horizontal Layout -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
        <div
          v-for="buku in popular.items"
          :key="buku.id"
          class="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
        >
          <!-- Top Row: Cover + Info -->
          <div class="flex items-start gap-3.5">
            <!-- Cover Book Thumbnail -->
            <div class="w-20 h-28 rounded-xl overflow-hidden shadow-xs border border-slate-200/90 shrink-0 relative bg-slate-900">
              <BookCover :book="buku" compact />
            </div>

            <!-- Info Bibliografi -->
            <div class="flex-1 min-w-0">
              <span class="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700">
                {{ [labelFor(BOOK_TYPE_LABELS, buku.bookType), buku.categoryName].filter(Boolean).join(' • ') }}
              </span>
              <h3 class="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#005B70] transition-colors line-clamp-2 mt-1 leading-snug">
                {{ buku.title }}
              </h3>
              <p v-if="buku.author" class="text-[10px] text-slate-400 mt-1 line-clamp-1">
                {{ buku.author }}
              </p>
              <div class="text-[10px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{{ formatNumber(buku.downloadCount) }}× diunduh</span>
              </div>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="flex items-center gap-2 pt-4 mt-3 border-t border-slate-100">
            <button
              type="button"
              class="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-center"
              @click="openDetail(buku)"
            >
              Detail
            </button>
            <button
              type="button"
              class="flex-1 py-1.5 px-3 rounded-lg bg-[#005B70] hover:bg-[#004859] active:bg-[#003845] text-white font-semibold text-xs shadow-2xs transition-all flex items-center justify-center gap-1 cursor-pointer"
              @click="openReader(buku)"
            >
              <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span>Baca</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. SECTION: KATALOG LENGKAP KOLEKSI (MAIN BOOK GRID) -->
    <section id="katalog-lengkap" class="space-y-5 scroll-mt-24">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Katalog Lengkap Koleksi
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">
            Koleksi terbaru: buku teks, modul ajar, bank soal, dan bahan presentasi.
          </p>
        </div>

        <!-- Total Count Badge -->
        <div
          v-if="catalog.state === 'ready'"
          class="self-start sm:self-auto inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/60"
        >
          Menampilkan {{ catalog.items.length }} dari {{ formatNumber(catalog.totalElements) }} judul
        </div>
      </div>

      <!-- Category Filter Pills (Horizontal Scrollable) -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          v-for="cat in categoryPills"
          :key="cat.id ?? 'all'"
          type="button"
          :class="[
            'px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
            activeCategoryId === cat.id
              ? 'bg-[#005B70] text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
          ]"
          @click="selectCategory(cat.id)"
        >
          {{ cat.name }}
        </button>
      </div>

      <StateBlock
        v-if="catalog.state !== 'ready'"
        :state="catalog.state"
        :title="catalog.state === 'error' ? 'Gagal memuat katalog' : 'Belum ada buku di kategori ini'"
        :message="catalog.state === 'error' ? catalog.error : ''"
        :skeleton-count="8"
        :reset-label="activeCategoryId !== null ? 'Tampilkan Semua Kategori' : ''"
        @retry="loadCatalog"
        @reset="selectCategory(null)"
      />

      <!-- 4 Column Grid Book Cards (Responsive 2 Col Mobile / 4 Col Desktop) -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-1">
        <div
          v-for="buku in catalog.items"
          :key="buku.id"
          class="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
        >
          <!-- Card Top: Cover with floating badges -->
          <div class="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 bg-slate-900 flex flex-col justify-between p-2.5 text-white">
            <BookCover :book="buku" />

            <!-- Floating Top Badges (Jenis & Kelas) -->
            <div class="flex items-center justify-between gap-1 relative z-10">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-white/90 text-slate-800 shadow-xs backdrop-blur-xs">
                {{ labelFor(BOOK_TYPE_LABELS, buku.bookType) }}
              </span>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-xs bg-blue-600">
                {{ labelFor(GRADE_LABELS, buku.gradeLevel) }}
              </span>
            </div>

            <!-- Floating Pill: Khusus Staf -->
            <div class="relative z-10 flex justify-center -mb-1">
              <span
                v-if="buku.visibility === 'STAFF'"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold shadow-md bg-amber-50 text-amber-700 border border-amber-200/90"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>{{ VISIBILITY_LABELS.STAFF }}</span>
              </span>
            </div>
          </div>

          <!-- Card Content: Metadata -->
          <div class="pt-3.5 space-y-1 flex-1 flex flex-col justify-between">
            <div>
              <div v-if="buku.categoryName" class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {{ buku.categoryName }}
              </div>
              <h3 class="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#005B70] transition-colors line-clamp-2 mt-0.5 leading-snug">
                {{ buku.title }}
              </h3>
              <p v-if="authorLine(buku)" class="text-[11px] text-slate-500 mt-1 line-clamp-1">
                {{ authorLine(buku) }}
              </p>
            </div>

            <div class="flex items-center gap-1 text-[11px] text-slate-400 font-medium pt-2">
              <svg class="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              </svg>
              <span>{{ buku.curriculum || labelFor(BOOK_TYPE_LABELS, buku.bookType) }}</span>
            </div>
          </div>

          <!-- Card Action Buttons -->
          <div class="grid grid-cols-2 gap-2 pt-3.5 mt-2 border-t border-slate-100">
            <button
              type="button"
              class="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-center"
              @click="openDetail(buku)"
            >
              Detail
            </button>
            <button
              type="button"
              class="py-2 px-3 rounded-xl bg-[#005B70] hover:bg-[#004859] active:bg-[#003845] text-white font-semibold text-xs shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              @click="openReader(buku)"
            >
              <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span>Baca</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination Bar -->
      <div
        v-if="catalog.state === 'ready' && catalog.totalPages > 1"
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-6 text-xs text-slate-400 border-t border-slate-100"
      >
        <div>
          Halaman {{ catalogPage + 1 }} dari {{ catalog.totalPages }} • Total {{ formatNumber(catalog.totalElements) }} judul
        </div>
        <Pagination :page="catalogPage" :total-pages="catalog.totalPages" @update:page="changeCatalogPage" />
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BookCover from '../components/BookCover.vue'
import Pagination from '../components/Pagination.vue'
import StateBlock from '../components/StateBlock.vue'
import { listBooks } from '../api/books.js'
import { listCategories, flattenCategories } from '../api/categories.js'
import { getFilters } from '../api/meta.js'
import { errorMessage } from '../utils/errors.js'
import {
  BOOK_TYPE_LABELS,
  GRADE_LABELS,
  VISIBILITY_LABELS,
  labelFor,
  formatNumber
} from '../utils/labels.js'

const router = useRouter()

const POPULAR_SIZE = 3
const CATALOG_SIZE = 8

// Statistik hero
const stats = reactive({ books: '—', categories: '—' })

// Data filter (kelas dari /meta/filters, kategori dari /categories)
const gradeLevels = ref([])
const rootCategories = ref([])

const gradePills = computed(() => [
  { value: null, label: 'Semua' },
  ...gradeLevels.value.map((g) => ({ value: g, label: labelFor(GRADE_LABELS, g) }))
])
const categoryPills = computed(() => [
  { id: null, name: 'Semua Kategori' },
  ...rootCategories.value
])

// 1. Buku Terpopuler
const activeGrade = ref(null)
const popular = reactive({ state: 'loading', items: [], error: '' })
let popularRequest = 0

async function loadPopular() {
  const id = ++popularRequest
  popular.state = 'loading'
  try {
    const page = await listBooks({ sort: 'popular', size: POPULAR_SIZE, grade: activeGrade.value })
    if (id !== popularRequest) return
    popular.items = page.content
    popular.state = page.content.length ? 'ready' : 'empty'
  } catch (err) {
    if (id !== popularRequest) return
    popular.error = errorMessage(err)
    popular.state = 'error'
  }
}

// 2. Katalog Lengkap
const activeCategoryId = ref(null)
const catalogPage = ref(0)
const catalog = reactive({ state: 'loading', items: [], totalElements: 0, totalPages: 0, error: '' })
let catalogRequest = 0

async function loadCatalog() {
  const id = ++catalogRequest
  catalog.state = 'loading'
  try {
    const page = await listBooks({
      sort: 'newest',
      size: CATALOG_SIZE,
      categoryId: activeCategoryId.value,
      page: catalogPage.value
    })
    if (id !== catalogRequest) return
    catalog.items = page.content
    catalog.totalElements = page.totalElements
    catalog.totalPages = page.totalPages
    catalog.state = page.content.length ? 'ready' : 'empty'
  } catch (err) {
    if (id !== catalogRequest) return
    catalog.error = errorMessage(err)
    catalog.state = 'error'
  }
}

function selectCategory(id) {
  activeCategoryId.value = id
  catalogPage.value = 0
  loadCatalog()
}

function changeCatalogPage(page) {
  catalogPage.value = page
  loadCatalog()
  document.getElementById('katalog-lengkap')?.scrollIntoView({ behavior: 'smooth' })
}

watch(activeGrade, loadPopular)

async function loadStatsAndFilters() {
  const [booksPage, tree, filters] = await Promise.allSettled([
    listBooks({ size: 1 }),
    listCategories('BOOK'),
    getFilters()
  ])
  if (booksPage.status === 'fulfilled') stats.books = formatNumber(booksPage.value.totalElements)
  if (tree.status === 'fulfilled') {
    rootCategories.value = tree.value.map((c) => ({ id: c.id, name: c.name }))
    stats.categories = formatNumber(flattenCategories(tree.value).length)
  }
  if (filters.status === 'fulfilled') gradeLevels.value = filters.value.gradeLevels || []
}

onMounted(() => {
  loadStatsAndFilters()
  loadPopular()
  loadCatalog()
})

// "Penulis (Tahun)", bagian kosong dilewati
function authorLine(buku) {
  if (buku.author && buku.publicationYear) return `${buku.author} (${buku.publicationYear})`
  return buku.author || (buku.publicationYear ? String(buku.publicationYear) : '')
}

// Actions: Navigasi ke Detail Buku & Reader
const openDetail = (buku) => {
  router.push(`/buku/${buku.id}`)
}

const openReader = (buku) => {
  router.push({ path: `/buku/${buku.id}`, hash: '#baca' })
}

const showGuideAlert = () => {
  alert('Panduan Membaca E-Book Digital SMAN 11 Garut:\n1. Cari buku lewat Katalog atau menu Cari & Filter.\n2. Klik "Baca" untuk membuka buku langsung di browser (format PDF).\n3. Klik "Unduh" di halaman detail untuk menyimpan berkas dan membacanya secara luring.')
}
</script>

<style scoped>
/* Scrollbar invisible for clean pills */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
