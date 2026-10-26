<template>
  <div class="space-y-6">
    <!-- Header Title -->
    <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Katalog & Filter Kategori</h1>
        <p class="text-xs text-slate-400 mt-1">Eksplorasi koleksi literasi digital SMAN 11 Garut berdasarkan mata pelajaran dan topik</p>
      </div>

      <!-- Quick Search Bar -->
      <div class="relative w-full md:w-80">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari judul atau topik..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B6B82]/30 focus:border-[#0B6B82]"
        />
        <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Main Grid: Filter Column (4 cols) & Results (8 cols) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Filter Sidebar -->
      <aside class="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-6">
        <div>
          <h3 class="font-bold text-slate-800 text-sm mb-3">Kategori Bidang</h3>
          <div class="space-y-1.5">
            <button 
              v-for="cat in kategoriFilters" 
              :key="cat"
              :class="[
                'w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer',
                selectedCategory === cat ? 'bg-[#0B6B82] text-white' : 'text-slate-600 hover:bg-slate-50'
              ]"
              @click="selectedCategory = cat"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100">
          <h3 class="font-bold text-slate-800 text-sm mb-3">Tingkat Kelas</h3>
          <div class="space-y-2">
            <label v-for="grade in ['Kelas X', 'Kelas XI', 'Kelas XII', 'Umum / Guru']" :key="grade" class="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input type="checkbox" class="rounded text-[#0B6B82] focus:ring-[#0B6B82]" />
              <span>{{ grade }}</span>
            </label>
          </div>
        </div>
      </aside>

      <!-- Books Grid Results -->
      <main class="lg:col-span-9 space-y-4">
        <div class="flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan <strong>{{ filteredBooks.length }}</strong> judul buku</span>
          <select v-model="sortBy" class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none">
            <option value="terbaru">Terbaru Diunggah</option>
            <option value="terpopuler">Paling Banyak Dibaca</option>
            <option value="az">Judul (A - Z)</option>
          </select>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          <article 
            v-for="book in filteredBooks" 
            :key="book.id"
            class="bg-white rounded-2xl border border-slate-100 p-3.5 flex flex-col justify-between hover:shadow-md hover:border-sky-100 transition-all cursor-pointer"
            @click="$router.push(`/buku/${book.id}`)"
          >
            <div class="w-full aspect-3/4 rounded-xl overflow-hidden bg-slate-100 mb-3 relative flex items-center justify-center">
              <img 
                :src="book.coverUrl || defaultBookCover" 
                :alt="book.judul"
                class="w-full h-full object-cover"
                @error="onImageError"
              />
              <span class="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/70 text-white text-[10px] font-bold">
                {{ book.format }}
              </span>
            </div>

            <div class="space-y-1">
              <span class="text-[10px] font-bold text-[#0B6B82] uppercase">{{ book.kategori }}</span>
              <h3 class="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2">{{ book.judul }}</h3>
              <p class="text-[11px] text-slate-400 truncate">{{ book.penulis }}</p>
            </div>

            <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span class="text-slate-400">{{ book.halaman }} hlm</span>
              <span class="text-[#0B6B82] font-semibold hover:underline">Baca &rarr;</span>
            </div>
          </article>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import defaultBookCover from '../assets/images/placeholders/book-placeholder.svg'

const searchQuery = ref('')
const selectedCategory = ref('Semua')
const sortBy = ref('terbaru')

const kategoriFilters = [
  'Semua',
  'Buku Pelajaran',
  'Sains & Teknologi',
  'Sosial & Humaniora',
  'Karya Tulis Ilmiah'
]

const bukuCatalog = ref([
  { id: 1, judul: 'Matematika Tingkat Lanjut Kelas XI', penulis: 'Kemendikbudristek', kategori: 'Buku Pelajaran', format: 'PDF', halaman: 284, coverUrl: null },
  { id: 2, judul: 'Biologi Sel dan Molekuler SMA/MA', penulis: 'Tim MGMP Biologi Garut', kategori: 'Sains & Teknologi', format: 'PDF', halaman: 312, coverUrl: null },
  { id: 3, judul: 'Sejarah Perjuangan Lokal Garut & Jawa Barat', penulis: 'Drs. H. Ahmad Sobari', kategori: 'Sosial & Humaniora', format: 'PDF', halaman: 196, coverUrl: null },
  { id: 4, judul: 'Kumpulan KTI Terbaik Siswa SMAN 11 2025/2026', penulis: 'KIR SMAN 11 Garut', kategori: 'Karya Tulis Ilmiah', format: 'PDF', halaman: 145, coverUrl: null },
  { id: 5, judul: 'Fisika Eksperimental & Laboratorium Digital', penulis: 'Dr. Hendra Gunawan, M.Pd.', kategori: 'Sains & Teknologi', format: 'PDF', halaman: 220, coverUrl: null },
  { id: 6, judul: 'Bahasa Indonesia: Literasi Kritis Kelas X', penulis: 'Pusat Kurikulum dan Perbukuan', kategori: 'Buku Pelajaran', format: 'PDF', halaman: 260, coverUrl: null }
])

const filteredBooks = computed(() => {
  return bukuCatalog.value.filter(b => {
    const matchCat = selectedCategory.value === 'Semua' || b.kategori === selectedCategory.value
    const matchQuery = !searchQuery.value || b.judul.toLowerCase().includes(searchQuery.value.toLowerCase()) || b.penulis.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchCat && matchQuery
  })
})

const onImageError = (e) => {
  e.target.src = defaultBookCover
}
</script>
