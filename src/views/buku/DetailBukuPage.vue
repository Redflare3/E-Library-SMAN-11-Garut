<template>
  <div class="space-y-6">
    <!-- Breadcrumb & Back -->
    <div class="flex items-center gap-3">
      <button 
        type="button" 
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        @click="$router.back()"
      >
        <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Kembali ke Katalog</span>
      </button>

      <span class="text-xs text-slate-400">/</span>
      <span class="text-xs text-slate-500 font-medium">{{ book.kategori }}</span>
      <span class="text-xs text-slate-400">/</span>
      <span class="text-xs text-slate-800 font-bold truncate max-w-xs">{{ book.judul }}</span>
    </div>

    <!-- Book Details Card -->
    <div class="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      <!-- Cover Column (4 cols) -->
      <div class="md:col-span-4 lg:col-span-3">
        <div class="aspect-3/4 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm relative flex items-center justify-center">
          <img 
            :src="book.coverUrl || defaultBookCover" 
            :alt="book.judul"
            class="w-full h-full object-cover"
            @error="onImageError"
          />
        </div>
      </div>

      <!-- Info Column (8 cols) -->
      <div class="md:col-span-8 lg:col-span-9 space-y-4">
        <div class="space-y-2">
          <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100/70 text-[#0B6B82]">
            {{ book.kategori }}
          </span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {{ book.judul }}
          </h1>
          <p class="text-sm font-medium text-slate-500">Oleh <strong class="text-slate-700">{{ book.penulis }}</strong> &bull; Terbit {{ book.tahun }}</p>
        </div>

        <!-- Metadata Badges -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-slate-100 text-xs">
          <div>
            <span class="text-slate-400 block text-[11px]">Halaman</span>
            <span class="font-bold text-slate-700">{{ book.halaman }} Halaman</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[11px]">Format File</span>
            <span class="font-bold text-slate-700">{{ book.format }}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[11px]">Bahasa</span>
            <span class="font-bold text-slate-700">Bahasa Indonesia</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[11px]">Akses</span>
            <span class="font-bold text-emerald-600">Full Offline</span>
          </div>
        </div>

        <!-- Sinopsis -->
        <div class="space-y-2">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Sinopsis / Ringkasan Buku</h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            {{ book.deskripsi }}
          </p>
        </div>

        <!-- Read Action Trigger -->
        <div class="pt-2 flex flex-wrap gap-3">
          <a 
            href="#pdf-reader"
            class="px-6 py-3 rounded-xl bg-[#0B6B82] hover:bg-[#085568] text-white text-sm font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Buka & Baca Dokumen PDF</span>
          </a>
        </div>
      </div>
    </div>

    <!-- In-Browser Document & PDF Reader Container -->
    <div id="pdf-reader" class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
      <!-- Reader Toolbar -->
      <div class="bg-slate-800 text-white px-5 py-3 flex flex-wrap items-center justify-between gap-3 select-none">
        <div class="flex items-center gap-3">
          <span class="text-xs font-semibold text-slate-300 truncate max-w-xs">{{ book.judul }}</span>
          <span class="px-2 py-0.5 rounded bg-slate-700 text-[10px] text-cyan-200">Mode Baca Offline</span>
        </div>

        <!-- Control Buttons -->
        <div class="flex items-center gap-2 text-xs">
          <button 
            type="button" 
            :disabled="currentPage <= 1"
            class="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40 transition-colors cursor-pointer"
            @click="currentPage > 1 && currentPage--"
          >
            &larr; Prev
          </button>

          <span class="text-slate-300 font-mono text-[11px]">
            Halaman {{ currentPage }} dari {{ book.halaman }}
          </span>

          <button 
            type="button" 
            :disabled="currentPage >= book.halaman"
            class="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40 transition-colors cursor-pointer"
            @click="currentPage < book.halaman && currentPage++"
          >
            Next &rarr;
          </button>

          <div class="h-4 w-px bg-slate-700 mx-1"></div>

          <button 
            type="button" 
            class="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 transition-colors cursor-pointer"
            @click="zoom = Math.max(75, zoom - 15)"
          >
            -
          </button>
          <span class="font-mono text-[11px]">{{ zoom }}%</span>
          <button 
            type="button" 
            class="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 transition-colors cursor-pointer"
            @click="zoom = Math.min(150, zoom + 15)"
          >
            +
          </button>
        </div>
      </div>

      <!-- PDF Canvas / Viewer Viewport -->
      <div class="bg-slate-100 p-6 sm:p-10 min-h-[500px] flex items-center justify-center overflow-auto">
        <!-- Mock Paper Sheet for In-browser PDF Simulation -->
        <div 
          :style="{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }"
          class="w-full max-w-2xl bg-white shadow-md rounded-lg p-10 space-y-6 text-slate-800 transition-transform duration-150 border border-slate-200"
        >
          <div class="border-b border-slate-200 pb-4 text-center space-y-1">
            <span class="text-[10px] font-bold tracking-widest text-[#0B6B82] uppercase">PERPUSTAKAAN SMAN 11 GARUT</span>
            <h2 class="text-xl font-bold text-slate-900">{{ book.judul }}</h2>
            <p class="text-xs text-slate-500">{{ book.penulis }} &bull; {{ book.kategori }}</p>
          </div>

          <div class="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-serif">
            <p>
              <strong>Bab {{ currentPage }}: Pengantar Materi Pembelajaran Terpadu</strong>
            </p>
            <p>
              Dokumen ini disajikan secara penuh melalui server lokal internal SMAN 11 Garut. Pembacaan materi dapat dilakukan tanpa koneksi internet dengan kecepatan transfer data lokal berlatensi rendah.
            </p>
            <p>
              Koleksi digital ini dilindungi oleh hak cipta perpustakaan sekolah untuk kepentingan kegiatan belajar mengajar internal guru dan peserta didik SMA Negeri 11 Garut.
            </p>
            <div class="p-4 bg-sky-50 rounded-xl border border-sky-100 text-xs text-[#0B6B82] font-sans">
              <strong>Catatan Sistem:</strong> In-browser PDF renderer ini terintegrasi langsung dengan media storage lokal (Mini PC/Raspberry Pi) dan siap disematkan modul <code>pdf.js</code> atau <code>vue-pdf-embed</code> secara mandiri.
            </div>
          </div>

          <div class="pt-8 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-sans">
            <span>SMAN 11 Garut Digital Repository</span>
            <span>Halaman {{ currentPage }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import defaultBookCover from '../../assets/images/placeholders/book-placeholder.svg'

const route = useRoute()
const currentPage = ref(1)
const zoom = ref(100)

const book = ref({
  id: route.params.id || 1,
  judul: 'Matematika Tingkat Lanjut Kelas XI',
  penulis: 'Kemendikbudristek & MGMP Matematika',
  kategori: 'Buku Pelajaran SMA',
  format: 'PDF Digital',
  tahun: '2025/2026',
  halaman: 284,
  coverUrl: null,
  deskripsi: 'Buku teks utama untuk mata pelajaran Matematika Tingkat Lanjut kelas XI Fase F Kurikulum Merdeka. Membahas materi aljabar tingkat lanjut, polinomial, geometri analitik, kalkulus dasar, dan penerapannya dalam pemecahan masalah sains modern.'
})

const onImageError = (e) => {
  e.target.src = defaultBookCover
}
</script>
