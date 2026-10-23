<template>
  <div class="space-y-8">
    <!-- Hero Banner Section -->
    <section class="relative rounded-3xl bg-gradient-to-r from-[#0A647A] via-[#0B6B82] to-[#0D7896] p-7 md:p-12 overflow-hidden shadow-sm text-white">
      <div class="relative z-10 max-w-2xl space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 text-sky-100 text-xs font-semibold">
          <svg class="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>REPOSITORI DIGITAL LOKAL SMAN 11 GARUT</span>
        </div>

        <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
          Jelajahi Ribuan Sumber Belajar & Buku Elektronik
        </h1>

        <p class="text-cyan-100/90 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
          Akses buku paket kurikulum merdeka, modul ajar, karya tulis ilmiah siswa, dan ensiklopedia secara cepat tanpa internet.
        </p>

        <!-- Fast Search Input -->
        <div class="pt-2 flex flex-col sm:flex-row gap-3 max-w-lg">
          <div class="relative flex-grow">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Cari judul buku, penulis, atau mata pelajaran..."
              class="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <svg class="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <router-link 
            :to="{ path: '/kategori', query: { q: searchQuery } }"
            class="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-xl text-sm transition-all text-center flex items-center justify-center shrink-0 cursor-pointer"
          >
            Cari Buku
          </router-link>
        </div>
      </div>

      <!-- Background Faint Vector Illustration -->
      <div class="absolute right-2 md:right-8 -bottom-10 pointer-events-none select-none text-white/10 md:text-cyan-100/15">
        <svg class="w-64 h-64 md:w-80 md:h-80" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" opacity="0.4" />
          <path d="M19 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3.5a3.5 3.5 0 0 1 3.5 3.5V20m0 0a3.5 3.5 0 0 1 3.5-3.5H19" fill="none" stroke="currentColor" stroke-width="2" />
        </svg>
      </div>
    </section>

    <!-- Quick Category Badges -->
    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-slate-900 tracking-tight">Kategori Populer</h2>
        <router-link to="/kategori" class="text-xs font-semibold text-[#0B6B82] hover:underline">
          Lihat Semua &rarr;
        </router-link>
      </div>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="cat in kategoriList" 
          :key="cat"
          class="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-sky-50 text-slate-700 hover:text-[#0B6B82] border border-slate-200 transition-colors shadow-2xs cursor-pointer"
          @click="$router.push({ path: '/kategori', query: { cat } })"
        >
          {{ cat }}
        </button>
      </div>
    </section>

    <!-- Featured Books Section -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">Rekomendasi Koleksi Buku</h2>
          <p class="text-xs text-slate-400">Paling sering dibaca siswa & guru minggu ini</p>
        </div>
      </div>

      <!-- Books Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        <article 
          v-for="book in bukuList" 
          :key="book.id"
          class="group bg-white rounded-2xl border border-slate-100 p-3.5 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-sky-100 transition-all cursor-pointer"
          @click="$router.push(`/buku/${book.id}`)"
        >
          <!-- Book Cover with Fallback -->
          <div class="w-full aspect-3/4 rounded-xl overflow-hidden bg-slate-100 mb-3 relative flex items-center justify-center">
            <img 
              :src="book.coverUrl || defaultBookCover" 
              :alt="book.judul"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              @error="onImageError"
            />
            <span class="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/70 text-white text-[10px] font-bold backdrop-blur-xs">
              {{ book.format }}
            </span>
          </div>

          <!-- Book Info -->
          <div class="space-y-1">
            <span class="text-[10px] font-bold text-[#0B6B82] uppercase tracking-wider block">
              {{ book.kategori }}
            </span>
            <h3 class="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-[#0B6B82] transition-colors">
              {{ book.judul }}
            </h3>
            <p class="text-[11px] text-slate-400 truncate">{{ book.penulis }}</p>
          </div>

          <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>{{ book.halaman }} hlm</span>
            <span class="text-[#0B6B82] font-semibold group-hover:underline">Buka &rarr;</span>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import defaultBookCover from '../assets/images/placeholders/book-placeholder.svg'

const searchQuery = ref('')

const kategoriList = [
  'Semua Kategori',
  'Buku Pelajaran SMA',
  'Sains & Teknologi',
  'Bahasa & Sastra',
  'Sosial & Humaniora',
  'Karya Tulis Ilmiah Siswa',
  'Fiksi & Novel Edukasi'
]

const bukuList = ref([
  {
    id: 1,
    judul: 'Matematika Tingkat Lanjut Kelas XI',
    penulis: 'Kemendikbudristek',
    kategori: 'Buku Pelajaran',
    format: 'PDF',
    halaman: 284,
    coverUrl: null
  },
  {
    id: 2,
    judul: 'Biologi Sel dan Molekuler SMA/MA',
    penulis: 'Tim MGMP Biologi Garut',
    kategori: 'Sains & Teknologi',
    format: 'PDF',
    halaman: 312,
    coverUrl: null
  },
  {
    id: 3,
    judul: 'Sejarah Perjuangan Lokal Garut & Jawa Barat',
    penulis: 'Drs. H. Ahmad Sobari',
    kategori: 'Sosial & Humaniora',
    format: 'PDF',
    halaman: 196,
    coverUrl: null
  },
  {
    id: 4,
    judul: 'Kumpulan KTI Terbaik Siswa SMAN 11 2025/2026',
    penulis: 'KIR SMAN 11 Garut',
    kategori: 'Karya Tulis Ilmiah',
    format: 'PDF',
    halaman: 145,
    coverUrl: null
  },
  {
    id: 5,
    judul: 'Fisika Eksperimental & Laboratorium Digital',
    penulis: 'Dr. Hendra Gunawan, M.Pd.',
    kategori: 'Sains & Teknologi',
    format: 'PDF',
    halaman: 220,
    coverUrl: null
  }
])

const onImageError = (e) => {
  e.target.src = defaultBookCover
}
</script>
