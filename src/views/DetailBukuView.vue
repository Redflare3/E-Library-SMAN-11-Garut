<template>
  <div class="space-y-10 pb-12 text-slate-800 select-none">
    
    <!-- 1. TOP NAVIGATION BREADCRUMB -->
    <nav class="flex items-center gap-2 text-xs text-slate-500 pt-1" aria-label="Breadcrumb">
      <router-link to="/" class="hover:text-[#005B70] flex items-center gap-1.5 font-medium transition-colors">
        <svg class="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Katalog Utama</span>
      </router-link>
      
      <svg class="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
      
      <router-link to="/kategori" class="hover:text-[#005B70] font-medium transition-colors">
        Buku Teks Fase F
      </router-link>
      
      <svg class="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
      
      <span class="font-bold text-[#005B70] truncate max-w-xs sm:max-w-md">
        {{ bukuDetail.title }}
      </span>
    </nav>

    <!-- 2. SECTION 1: HEADER DETAIL BUKU (GRID 2 KOLOM) -->
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Kolom Kiri: Cover & Status Cards (4 Cols) -->
      <div class="lg:col-span-4 space-y-4">
        
        <!-- Large Book Cover Container (Aspect 3:4) -->
        <div class="bg-white rounded-3xl p-3 border border-slate-200/80 shadow-2xs">
          <div class="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xs border border-slate-200/90 bg-slate-900 flex flex-col justify-between p-3 text-white">
            
            <!-- Floating Top Badges -->
            <div class="relative z-10 flex flex-col gap-1.5 self-start">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-[#0B4A5C] text-white shadow-xs">
                Kurikulum Merdeka Teks
              </span>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-semibold text-cyan-200 bg-cyan-500/20 border border-cyan-400/30 shadow-xs">
                Fase F • Kelas XI SMA
              </span>
            </div>

            <!-- If BE supplies real coverUrl -->
            <img 
              v-if="bukuDetail.coverUrl" 
              :src="bukuDetail.coverUrl" 
              :alt="bukuDetail.title" 
              class="absolute inset-0 w-full h-full object-cover"
            />

            <!-- High-Fidelity Physics Cover Graphic Fallback (Matching Figma) -->
            <div v-else class="absolute inset-0 bg-gradient-to-b from-[#e6f4f9] via-[#d0ebf5] to-[#005B70] p-4 flex flex-col justify-between text-slate-800 overflow-hidden">
              <!-- Geometric Grid Pattern Overlay -->
              <div class="absolute inset-0 opacity-20 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:14px_14px]"></div>

              <div class="pt-12 relative z-10 text-left">
                <span class="text-[9px] font-mono tracking-widest text-[#005B70] font-bold uppercase block">
                  BUKU SISWA KEMENDIKBUDRISTEK
                </span>
                <h2 class="text-xl font-black text-slate-900 uppercase leading-none mt-1.5 tracking-tight">
                  FISIKA TERAPAN
                </h2>
                <div class="text-xs font-black text-[#005B70] uppercase tracking-wide mt-0.5">
                  MEKANIKA GELOMBANG
                </div>
                <div class="text-[9px] font-bold text-slate-600 mt-1">
                  FASE F • KELAS XI SMA
                </div>
                <div class="text-[8px] text-slate-500 font-mono mt-0.5">
                  DR. HENDRA WIJAYA, M.SI
                </div>
              </div>

              <!-- Waveform & Physics Apparatus Graphic in Center -->
              <div class="my-auto w-full relative z-10 py-1">
                <svg class="w-full h-24 text-[#005B70]" viewBox="0 0 200 80" fill="none">
                  <!-- Grid coordinate lines -->
                  <line x1="10" y1="40" x2="190" y2="40" stroke="#005B70" stroke-width="1" stroke-dasharray="2 2" opacity="0.4"/>
                  <line x1="20" y1="10" x2="20" y2="70" stroke="#005B70" stroke-width="1" stroke-dasharray="2 2" opacity="0.4"/>
                  <!-- Sine curve -->
                  <path d="M 20 40 Q 45 10, 70 40 T 120 40 T 170 40" stroke="#005B70" stroke-width="2.5" />
                  <circle cx="45" cy="10" r="3" fill="#0284c7"/>
                  <circle cx="95" cy="70" r="3" fill="#0284c7"/>
                  <circle cx="145" cy="10" r="3" fill="#0284c7"/>
                  <!-- Yellow peak vectors -->
                  <line x1="45" y1="40" x2="45" y2="14" stroke="#f59e0b" stroke-width="1.5"/>
                  <polygon points="43,18 45,11 47,18" fill="#f59e0b"/>
                </svg>
              </div>

              <!-- Lab Students Silhouette Graphic at Bottom -->
              <div class="relative z-10 pt-2 border-t border-[#005B70]/30 flex items-center justify-between text-[9px] font-bold text-white">
                <div class="flex items-center gap-1">
                  <svg class="w-3.5 h-3.5 text-cyan-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <span>LABORATORIUM FISIKA</span>
                </div>
                <span class="font-mono text-cyan-100">EDISI 2024</span>
              </div>
            </div>

            <!-- Bottom Floating Tag -->
            <div class="relative z-10 flex justify-end">
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-black/60 text-cyan-200 backdrop-blur-xs border border-white/10">
                <svg class="w-3 h-3 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                </svg>
                <span>18.4 MB (PDF 2024)</span>
              </span>
            </div>

          </div>
        </div>

        <!-- Sub-card 1: Status Stok Rak Perpustakaan -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-2.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-sky-50 text-[#005B70] flex items-center justify-center shrink-0">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <div>
                <h4 class="text-xs font-bold text-slate-800 leading-tight">Stok Rak Perpustakaan</h4>
              </div>
            </div>
            
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
              11 E-Book / 5 Fisik
            </span>
          </div>

          <div class="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
            <span class="text-slate-400">SMAN 11 Garut Central Siliwangi</span>
            <button 
              type="button" 
              class="font-semibold text-[#005B70] hover:text-[#003d4b] hover:underline cursor-pointer"
              @click="handlePinjamCetak"
            >
              Pinjam Cetak / Pesan +
            </button>
          </div>
        </div>

        <!-- Sub-card 2: Kutipan Ilmiah Card -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-sky-50 text-[#005B70] flex items-center justify-center shrink-0 font-serif font-black text-base">
              "
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-800 leading-tight">Kutipan Ilmiah</h4>
              <p class="text-[11px] text-slate-400 mt-0.5">Format APA / Harvard / IEEE</p>
            </div>
          </div>

          <button
            type="button"
            class="px-3 py-1.5 rounded-lg border border-sky-200 bg-sky-50/70 hover:bg-sky-100 text-[#005B70] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            @click="copyCitation"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <span>Salin Sitasi</span>
          </button>
        </div>

      </div>

      <!-- Kolom Kanan: Metadata & Action Buttons (8 Cols) -->
      <div class="lg:col-span-8 space-y-6">
        
        <!-- Top Badges -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
            Buku Teks Nasional
          </span>
          <span class="px-3 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/80">
            Sains &amp; Matematika
          </span>
          <span class="px-3 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Kurikulum Merdeka 2024
          </span>
        </div>

        <!-- Main Big Title -->
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
            {{ bukuDetail.title }}
          </h1>
          
          <!-- Penulis & Penerbit Info -->
          <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-500 mt-2.5">
            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Penulis: <strong class="text-slate-700 font-semibold">{{ bukuDetail.author }}</strong></span>
            </div>
            
            <span class="text-slate-300 hidden sm:inline">•</span>
            
            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span>Penerbit: <strong class="text-slate-700 font-semibold">{{ bukuDetail.publisher }}</strong></span>
            </div>

            <span class="text-slate-300 hidden sm:inline">•</span>

            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Terbit: <strong class="text-slate-700 font-semibold">{{ bukuDetail.year }}</strong></span>
            </div>
          </div>
        </div>

        <!-- 4 Grid Metadata Metric Box -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs grid grid-cols-2 sm:grid-cols-4 gap-4">
          <!-- Metric 1 -->
          <div class="space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              ISBN Elektronik
            </span>
            <div class="text-xs sm:text-sm font-extrabold text-slate-800 font-mono">
              {{ bukuDetail.isbn }}
            </div>
          </div>

          <!-- Metric 2 -->
          <div class="space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Jumlah Halaman
            </span>
            <div class="text-xs sm:text-sm font-extrabold text-slate-800">
              {{ bukuDetail.pagesCount }} Halaman (Lengkap)
            </div>
          </div>

          <!-- Metric 3 -->
          <div class="space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Format File
            </span>
            <div class="text-xs sm:text-sm font-extrabold text-slate-800">
              {{ bukuDetail.fileFormat }}
            </div>
          </div>

          <!-- Metric 4 -->
          <div class="space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Bahasa Pengantar
            </span>
            <div class="text-xs sm:text-sm font-extrabold text-slate-800">
              {{ bukuDetail.language }}
            </div>
          </div>
        </div>

        <!-- Action Buttons Bar -->
        <div class="flex flex-wrap items-center gap-3">
          <!-- Primary Button: Baca Daring Sekarang -->
          <button
            type="button"
            class="px-6 py-3 rounded-xl bg-[#005B70] hover:bg-[#004859] active:bg-[#003845] text-white font-bold text-sm shadow-xs transition-all flex items-center gap-2.5 cursor-pointer"
            @click="scrollToReader"
          >
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>Baca Daring Sekarang (Viewer)</span>
          </button>

          <!-- Secondary Button: Unduh E-Book -->
          <button
            type="button"
            class="px-6 py-3 rounded-xl bg-[#004B6B] hover:bg-[#003c56] active:bg-[#002f43] text-white font-bold text-sm shadow-xs transition-all flex items-center gap-2.5 cursor-pointer"
            @click="handleDownloadEbook"
          >
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Unduh E-Book (Offline)</span>
          </button>

          <!-- Share Button -->
          <button
            type="button"
            title="Bagikan Tautan Buku"
            class="p-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer shadow-2xs"
            @click="handleShare"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>

        <!-- Inner Card Tabs Navigation -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <!-- Tab Headers -->
          <div class="flex items-center border-b border-slate-200 bg-slate-50/60 px-2 pt-2 gap-1 overflow-x-auto scrollbar-none">
            <button
              v-for="tab in infoTabs"
              :key="tab.id"
              type="button"
              :class="[
                'px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer',
                activeTab === tab.id
                  ? 'bg-white text-[#005B70] border-t-2 border-[#005B70] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
              ]"
              @click="activeTab = tab.id"
            >
              <component :is="tab.iconSvg" class="w-3.5 h-3.5" />
              <span>{{ tab.label }}</span>
            </button>
          </div>

          <!-- Tab Content Panel -->
          <div class="p-5 text-xs sm:text-sm text-slate-600 leading-relaxed min-h-[140px]">
            <!-- Tab 1: Sinopsis & Capaian -->
            <div v-if="activeTab === 'sinopsis'" class="space-y-3">
              <p>
                {{ bukuDetail.synopsis }}
              </p>
              <div class="p-3 bg-sky-50 rounded-xl border border-sky-100 text-xs text-[#005B70]">
                <strong>Fokus Pembelajaran Fase F:</strong> Analisis gelombang mekanik, bunyi, termodinamika terapan, optika fisis, dan formulasi gerak harmonik berbasis kalkulus diferensial sederhana.
              </div>
            </div>

            <!-- Tab 2: Daftar Isi & Modul (8 Bab) -->
            <div v-else-if="activeTab === 'daftar-isi'" class="space-y-2">
              <div 
                v-for="(bab, idx) in daftarIsiList" 
                :key="idx"
                class="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-50 border-b border-slate-100 last:border-0"
              >
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded bg-sky-100 text-[#005B70] text-[10px] font-bold flex items-center justify-center font-mono">
                    {{ idx + 1 }}
                  </span>
                  <span class="font-medium text-slate-800">{{ bab.title }}</span>
                </div>
                <button 
                  type="button"
                  class="text-[11px] font-mono text-[#005B70] font-semibold hover:underline cursor-pointer"
                  @click="jumpToPage(bab.page)"
                >
                  Hal. {{ bab.page }}
                </button>
              </div>
            </div>

            <!-- Tab 3: Data Bibliografi & Hak Cipta -->
            <div v-else class="space-y-2.5 text-xs">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="p-2.5 bg-slate-50 rounded-lg">
                  <span class="text-slate-400 block text-[10px] font-bold uppercase">Klasifikasi DDC</span>
                  <span class="font-bold text-slate-700">530.12 - Fisika Teoretis &amp; Gelombang</span>
                </div>
                <div class="p-2.5 bg-slate-50 rounded-lg">
                  <span class="text-slate-400 block text-[10px] font-bold uppercase">Hak Cipta Terbitan</span>
                  <span class="font-bold text-slate-700">© 2024 Kemendikbudristek &amp; Lisensi Sekolah SMAN 11</span>
                </div>
                <div class="p-2.5 bg-slate-50 rounded-lg">
                  <span class="text-slate-400 block text-[10px] font-bold uppercase">Pusat Repositori</span>
                  <span class="font-bold text-slate-700">Perpustakaan Kencana SMAN 11 Garut</span>
                </div>
                <div class="p-2.5 bg-slate-50 rounded-lg">
                  <span class="text-slate-400 block text-[10px] font-bold uppercase">Akses Salinan Dokumen</span>
                  <span class="font-bold text-emerald-600">Terbuka untuk Siswa &amp; Guru Internal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </section>

    <!-- 3. SECTION 2: INTERACTIVE WEB READER / IN-BROWSER PDF VIEWER CONTAINER -->
    <section id="web-reader" class="space-y-4 pt-4">
      
      <!-- Viewer Header Toolbar -->
      <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <!-- Left: Badge Document & Subtitle -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#005B70] text-white flex items-center justify-center shrink-0 shadow-xs">
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-extrabold text-slate-900 tracking-tight leading-none">
                Interactive Web Reader
              </h3>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-600 border border-emerald-200">
                High-Definition View
              </span>
            </div>
            <p class="text-[11px] text-slate-400 mt-1">
              Buku Teks Utama: Fisika Terapan &amp; Mekanika Gelombang (Siliwangi Lab Versi)
            </p>
          </div>
        </div>

        <!-- Center & Right Control Bar -->
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Search in book -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari kata/topik di buku..."
              class="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#005B70] w-44 sm:w-52 transition-all"
            />
            <svg class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <!-- Page Counter & Prev / Next -->
          <div class="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5 text-xs">
            <button
              type="button"
              class="w-7 h-7 rounded flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-2xs disabled:opacity-30 cursor-pointer transition-all"
              :disabled="currentPage <= 1"
              @click="currentPage > 1 && currentPage--"
            >
              ‹
            </button>
            <div class="px-2 font-mono font-bold text-slate-700 text-xs">
              {{ currentPage }} / {{ totalPages }}
            </div>
            <button
              type="button"
              class="w-7 h-7 rounded flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-2xs disabled:opacity-30 cursor-pointer transition-all"
              :disabled="currentPage >= totalPages"
              @click="currentPage < totalPages && currentPage++"
            >
              ›
            </button>
          </div>

          <!-- Zoom Controls -->
          <div class="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5 text-xs">
            <button
              type="button"
              title="Perkecil"
              class="w-7 h-7 rounded flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-2xs disabled:opacity-30 cursor-pointer"
              :disabled="zoomLevel <= 70"
              @click="zoomLevel = Math.max(70, zoomLevel - 15)"
            >
              -
            </button>
            <span class="px-1.5 font-mono font-bold text-slate-700 text-[11px] min-w-[38px] text-center">
              {{ zoomLevel }}%
            </span>
            <button
              type="button"
              title="Perbesar"
              class="w-7 h-7 rounded flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-2xs disabled:opacity-30 cursor-pointer"
              :disabled="zoomLevel >= 150"
              @click="zoomLevel = Math.min(150, zoomLevel + 15)"
            >
              +
            </button>
          </div>

          <!-- Fullscreen Toggle -->
          <button
            type="button"
            title="Layar Penuh"
            class="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-white hover:shadow-2xs flex items-center justify-center cursor-pointer transition-all"
            @click="toggleFullscreen"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </button>
        </div>

      </div>

      <!-- Canvas Document Display Area (The High-Fidelity Physics Document Page) -->
      <div 
        ref="readerContainer"
        :class="[
          'bg-[#EEF4F8] p-4 sm:p-10 rounded-2xl border border-slate-200/80 flex justify-center overflow-auto transition-all',
          isFullscreen ? 'fixed inset-0 z-50 rounded-none p-4 bg-slate-900 overflow-auto' : 'min-h-[700px]'
        ]"
      >
        <!-- Floating Close button if fullscreen -->
        <button
          v-if="isFullscreen"
          type="button"
          class="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-lg bg-white/90 text-slate-800 text-xs font-bold shadow-md cursor-pointer"
          @click="toggleFullscreen"
        >
          ✕ Tutup Layar Penuh
        </button>

        <!-- Document Sheet (Scale Responsive) -->
        <div 
          :style="{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }"
          class="w-full max-w-4xl bg-white shadow-xl rounded-xl p-6 sm:p-12 text-slate-800 border border-slate-200/90 font-sans transition-transform duration-150 relative"
        >
          <!-- Document Header Row -->
          <div class="flex items-center justify-between pb-4 border-b border-slate-200 text-xs">
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-[#005B70] border border-sky-100">
              BAB 2 • MEKANIKA GELOMBANG BERJALAN
            </span>
            <span class="text-slate-400 italic text-[11px]">
              Buku Siswa Fisika Kelas XI SMA
            </span>
          </div>

          <!-- Sub-bab Title -->
          <div class="pt-6 space-y-1">
            <div class="text-[11px] font-bold text-sky-700 tracking-wider uppercase font-mono">
              SUB-BAB 2.3 - FORMULASI GELOMBANG SINUSOIDAL
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Persamaan Simpangan dan Polarisasi Gelombang Berjalan
            </h2>
          </div>

          <!-- Paragraph 1 -->
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed pt-3">
            Sebuah gelombang harmonik sederhana yang merambat sepanjang sumbu <em>x</em> positif pada medium elastis dapat dinyatakan melalui fungsi sinusoidal matematis. Setiap partikel medium bergetar dengan frekuensi sudut &omega; dan merambat dengan cepat rambat gelombang <em>v</em>.
          </p>

          <!-- Wave Diagram Graphic (SVG Blueprint Wave) -->
          <div class="my-5 p-4 rounded-xl bg-[#F0F7FB] border border-[#D5E9F5] text-slate-800">
            <div class="w-full max-w-lg mx-auto">
              <svg class="w-full h-44 text-[#005B70]" viewBox="0 0 360 140" fill="none">
                <!-- Axes -->
                <line x1="20" y1="70" x2="340" y2="70" stroke="#94a3b8" stroke-width="1.5" />
                <line x1="40" y1="10" x2="40" y2="130" stroke="#94a3b8" stroke-width="1.5" />
                
                <!-- Axis labels -->
                <text x="345" y="74" fill="#64748b" font-size="10" font-weight="bold">x (m)</text>
                <text x="44" y="20" fill="#64748b" font-size="10" font-weight="bold">y (m)</text>
                
                <!-- Sine wave curve -->
                <path 
                  d="M 40 70 Q 75 10, 110 70 T 180 70 T 250 70 T 320 70" 
                  stroke="#005B70" 
                  stroke-width="3" 
                  fill="none"
                />

                <!-- Wavelength span marker -->
                <line x1="40" y1="12" x2="180" y2="12" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="2 2" />
                <line x1="40" y1="10" x2="40" y2="70" stroke="#0284c7" stroke-width="1" stroke-dasharray="2 2" opacity="0.6"/>
                <line x1="180" y1="10" x2="180" y2="70" stroke="#0284c7" stroke-width="1" stroke-dasharray="2 2" opacity="0.6"/>
                <polygon points="45,12 52,9 52,15" fill="#0284c7"/>
                <polygon points="175,12 168,9 168,15" fill="#0284c7"/>
                <rect x="70" y="3" width="90" height="16" rx="4" fill="#0284c7" fill-opacity="0.1"/>
                <text x="75" y="15" fill="#0284c7" font-size="9" font-weight="bold">Panjang Gelombang (&lambda;)</text>

                <!-- Amplitude marker -->
                <line x1="75" y1="70" x2="75" y2="12" stroke="#f59e0b" stroke-width="1.5" />
                <polygon points="75,12 72,18 78,18" fill="#f59e0b"/>
                <text x="82" y="38" fill="#d97706" font-size="9" font-weight="bold">A (Amplitudo)</text>

                <!-- Crest point -->
                <circle cx="75" cy="12" r="3.5" fill="#005B70"/>
                <!-- Trough point -->
                <circle cx="145" cy="128" r="3.5" fill="#005B70"/>
              </svg>
            </div>
            <p class="text-center text-[10px] text-slate-500 italic mt-2">
              Gambar 2.3: Diagram profil simpangan gelombang transversal terhadap posisi <em>x</em> pada suatu saat tertentu.
            </p>
          </div>

          <!-- Formula Box (Rumus Inti Fisika) -->
          <div class="my-5 p-4 rounded-xl bg-[#F4F9FC] border border-[#CFE4F0] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="space-y-1">
              <span class="inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-sky-100 text-[#005B70]">
                RUMUS INTI FISIKA
              </span>
              <h4 class="font-bold text-xs sm:text-sm text-slate-800">
                Bentuk Umum Persamaan Simpangan :
              </h4>
              <p class="text-[11px] text-slate-500">
                Kondisi fase awal gelombang merambat ke kanan (arah sumbu <em>x</em> positif).
              </p>
            </div>

            <!-- Big Formula Pill Box -->
            <div class="bg-white border-2 border-sky-300 rounded-xl px-5 py-3 shadow-xs shrink-0 text-center">
              <span class="font-mono text-base sm:text-lg font-black text-[#005B70] tracking-wider">
                y(x, t) = A • sin(&omega;t &plusmn; kx + &phi;₀)
              </span>
            </div>
          </div>

          <!-- Variable Explanations -->
          <div class="space-y-1 pt-1 text-xs">
            <span class="font-bold text-slate-700 block text-[11px]">Dimana:</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-[11px]">
              <div>• <strong>y</strong> = Simpangan gelombang (meter)</div>
              <div>• <strong>A</strong> = Amplitudo gelombang maksimum (meter)</div>
              <div>• <strong>&omega; = 2&pi;f</strong> = Frekuensi sudut (rad/s)</div>
              <div>• <strong>k = 2&pi;/&lambda;</strong> = Bilangan gelombang (m⁻¹)</div>
            </div>
          </div>

          <!-- Paragraph 2 -->
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed pt-3">
            Ketika dua gelombang berjalan dengan amplitudo dan frekuensi yang identik bergerak dalam arah berlawanan, superposisi keduanya menghasilkan pola gelombang stasioner (gelombang berdiri). Titik-titik dengan amplitudo simpangan nol disebut simpul, sedangkan titik-titik dengan simpangan maksimum disebut perut.
          </p>

          <!-- Problem Example Box -->
          <div class="my-5 p-4 rounded-xl bg-[#F4F9FC] border border-[#D6EBF5] text-xs leading-relaxed space-y-2">
            <div class="flex items-center gap-2 text-[#005B70] font-bold text-xs">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <span>Contoh Soal Penerapan 2.3</span>
            </div>
            
            <p class="text-slate-700">
              Suatu gelombang sinusoidal merambat pada seutas tali dengan persamaan: <strong class="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">y = 0,08 sin(4&pi;t - 2&pi;x)</strong> dalam satuan SI. Tentukan cepat rambat gelombang <em>v</em> tersebut!
            </p>

            <div class="p-3 bg-white rounded-lg border border-slate-200 text-slate-600 space-y-1">
              <div><strong>Solusi:</strong> Dari persamaan diketahui <strong>&omega; = 4&pi; rad/s</strong> dan <strong>k = 2&pi; m⁻¹</strong>.</div>
              <div>Maka cepat rambat gelombang: <strong>v = &omega; / k = 4&pi; / 2&pi; = 2 m/s</strong> ke arah sumbu-<em>x</em> positif.</div>
            </div>
          </div>

          <!-- Document Sheet Footer -->
          <div class="pt-8 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>SMAN 11 Garut • Portal Digital E-Book</span>
            <span class="font-mono font-bold text-slate-700">Halaman {{ currentPage }}</span>
          </div>

        </div>
      </div>

      <!-- Bottom Toolbar Navigation -->
      <div class="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          class="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          :disabled="currentPage <= 1"
          @click="currentPage > 1 && currentPage--"
        >
          <span>‹</span>
          <span>Halaman Sebelumnya ({{ Math.max(1, currentPage - 1) }})</span>
        </button>

        <button
          type="button"
          class="px-4 py-2 rounded-xl bg-[#005B70] hover:bg-[#004859] active:bg-[#003845] text-white font-semibold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          :disabled="currentPage >= totalPages"
          @click="currentPage < totalPages && currentPage++"
        >
          <span>Halaman Selanjutnya ({{ Math.min(totalPages, currentPage + 1) }})</span>
          <span>›</span>
        </button>
      </div>

    </section>

    <!-- 4. SECTION 3: REKOMENDASI TERKAIT (BAHAN PENGAYAAN & MODUL SAINS SEJENIS) -->
    <section class="space-y-4 pt-6">
      
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
            REKOMENDASI TERKAIT
          </span>
          <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Bahan Pengayaan &amp; Modul Sains Sejenis
          </h2>
        </div>

        <router-link to="/kategori" class="text-xs font-semibold text-[#005B70] hover:underline flex items-center gap-1">
          <span>Lihat Koleksi Lengkap</span>
          <span>›</span>
        </router-link>
      </div>

      <!-- 4 Column Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-1">
        <div
          v-for="buku in relatedBooks"
          :key="buku.id"
          class="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <!-- Top: Book Cover with floating badges -->
          <div class="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-xs border border-slate-200/80 bg-slate-900 flex flex-col justify-between p-2.5 text-white">
            
            <!-- Top Badges on Cover -->
            <div class="relative z-10 flex items-center justify-between">
              <span :class="['inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold shadow-xs', buku.statusBadgeClass]">
                {{ buku.statusBadgeText }}
              </span>
              <button type="button" class="text-white/80 hover:text-white" title="Simpan Bookmark">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            </div>

            <!-- Cover Graphic -->
            <img 
              v-if="buku.coverUrl" 
              :src="buku.coverUrl" 
              :alt="buku.title" 
              class="absolute inset-0 w-full h-full object-cover"
            />
            
            <!-- Realistic Fallback Book Covers matching Figma -->
            <div v-else class="absolute inset-0 flex flex-col justify-between p-3 text-center overflow-hidden">
              
              <!-- Cover 1: Kimia Termokimia -->
              <div v-if="buku.id === 'rel-1'" class="absolute inset-0 bg-gradient-to-b from-[#134e5e] via-[#1f6d82] to-[#0c333e] p-3 flex flex-col justify-between text-white">
                <div class="pt-6 text-center">
                  <span class="text-[8px] font-mono tracking-widest text-cyan-200 uppercase">KIMIA FASE F</span>
                  <div class="text-xs font-black uppercase mt-1 leading-tight text-white">
                    KIMIA TERMOKIMIA
                  </div>
                  <div class="text-[8px] text-cyan-200 mt-0.5">UNTUK SMA/MA KELAS XI</div>
                </div>
                <div class="my-auto w-full flex items-center justify-center opacity-85">
                  <svg class="w-14 h-14 text-cyan-200" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="50,20 75,35 75,65 50,80 25,65 25,35" />
                    <circle cx="50" cy="50" r="10" fill="currentColor" fill-opacity="0.3"/>
                  </svg>
                </div>
                <div class="pb-2 text-[7px] text-cyan-200/80 uppercase">
                  FASE F • KELAS XI
                </div>
              </div>

              <!-- Cover 2: Kalkulus Diferensial SMA (White with cyan curves) -->
              <div v-else-if="buku.id === 'rel-2'" class="absolute inset-0 bg-gradient-to-b from-white via-sky-50 to-[#dff0f8] p-3 flex flex-col justify-between text-slate-800">
                <div class="pt-6 text-center">
                  <span class="text-[8px] font-mono tracking-widest text-[#005B70] uppercase font-bold">MATEMATIKA LANJUT</span>
                  <div class="text-xs font-black uppercase mt-1 leading-tight text-slate-900">
                    KALKULUS DIFERENSIAL
                  </div>
                  <div class="text-[8px] text-sky-700 font-bold">SMA/MA FASE F</div>
                </div>
                <div class="my-auto w-full flex items-center justify-center opacity-85">
                  <svg class="w-16 h-16 text-cyan-600" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10,80 Q30,20 50,50 T90,20" />
                    <line x1="20" y1="80" x2="80" y2="80" stroke-width="2" />
                  </svg>
                </div>
                <div class="pb-2 text-[7px] text-slate-500 uppercase font-mono">
                  ANALISIS VEKTOR
                </div>
              </div>

              <!-- Cover 3: Genetika Biologi (Dark Blue with DNA ring) -->
              <div v-else-if="buku.id === 'rel-3'" class="absolute inset-0 bg-gradient-to-b from-[#0a2540] via-[#123860] to-[#051424] p-3 flex flex-col justify-between text-white">
                <div class="pt-6 text-center">
                  <span class="text-[8px] font-mono tracking-widest text-cyan-300 uppercase">BIOLOGI SMA XII</span>
                  <div class="text-xs font-black uppercase mt-1 leading-tight text-white">
                    GENETIKA MOLEKULER
                  </div>
                  <div class="text-[8px] text-cyan-200 mt-0.5">BIOTEKNOLOGI MODERN</div>
                </div>
                <div class="my-auto w-full flex items-center justify-center opacity-85">
                  <svg class="w-14 h-14 text-cyan-300" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="50" cy="50" r="24" stroke-dasharray="4,4" />
                    <circle cx="50" cy="50" r="10" fill="currentColor" fill-opacity="0.3"/>
                  </svg>
                </div>
                <div class="pb-2 text-[7px] text-cyan-200/80 uppercase">
                  FASE F • KELAS XII
                </div>
              </div>

              <!-- Cover 4: Astrofisika SMA (Deep space with planet orbit) -->
              <div v-else class="absolute inset-0 bg-gradient-to-b from-[#0e0c1f] via-[#1c183b] to-[#06050e] p-3 flex flex-col justify-between text-white">
                <div class="pt-6 text-center">
                  <span class="text-[8px] font-mono tracking-widest text-amber-300 uppercase">ASTROPHYSICS</span>
                  <div class="text-xs font-black uppercase mt-1 leading-tight text-white">
                    ASTROFISIKA DASAR
                  </div>
                  <div class="text-[8px] text-amber-200/80 mt-0.5">KOSMOLOGI PELAJAR</div>
                </div>
                <div class="my-auto w-full flex items-center justify-center opacity-85">
                  <svg class="w-16 h-16 text-amber-300" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="50" cy="50" r="12" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="2"/>
                    <ellipse cx="50" cy="50" rx="36" ry="12" transform="rotate(-20 50 50)" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3,3"/>
                  </svg>
                </div>
                <div class="pb-2 text-[7px] text-amber-200/80 uppercase font-mono">
                  PENGAYAAN KHUSUS
                </div>
              </div>

            </div>

          </div>

          <!-- Bottom: Metadata & Action -->
          <div class="pt-3.5 space-y-1 flex-1 flex flex-col justify-between">
            <div>
              <div class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {{ buku.subCategory }}
              </div>
              <h3 class="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#005B70] transition-colors line-clamp-2 mt-0.5 leading-snug min-h-[2.5rem]">
                {{ buku.title }}
              </h3>
              <p class="text-[11px] text-slate-500 mt-1 line-clamp-1">
                {{ buku.author }}
              </p>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px]">
              <div class="flex items-center gap-1.5 text-slate-400 font-medium">
                <svg class="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                </svg>
                <span>{{ buku.pages }}</span>
              </div>

              <router-link
                :to="`/buku/${buku.id}`"
                class="font-bold text-[#005B70] hover:underline flex items-center gap-1"
              >
                <span>Buka</span>
                <span>›</span>
              </router-link>
            </div>
          </div>

        </div>
      </div>

    </section>

    <!-- Toast Notification Sitasi -->
    <transition name="toast">
      <div 
        v-if="showToast" 
        class="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 text-xs"
      >
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 1. Reactive Data: Detail Buku Utama (Sesuai Mockup Figma)
const bukuDetail = ref({
  id: route.params.id || 'fisika-terapan-1',
  title: 'Fisika Terapan & Mekanika Gelombang Fase F (Kelas XI SMA)',
  author: 'Dr. Hendra Wijaya, M.Si & Tim Pustakawan',
  publisher: 'Kemendikbudristek RI',
  year: '2024',
  isbn: '978-602-244-789-2',
  pagesCount: 234,
  fileFormat: 'Interactive PDF (18.4 MB)',
  language: 'Bahasa Indonesia',
  coverUrl: null, // Siap diisi URL dari Back-End
  pdfUrl: null,   // Siap diisi URL file PDF lokal dari Back-End
  synopsis: 'Buku teks Fisika Terapan & Mekanika Gelombang Fase F ini dirancang khusus untuk memenuhi Capaian Pembelajaran (CP) Kurikulum Merdeka pada jenjang SMA Kelas XI peminatan sains terapan. Buku ini mengintegrasikan penalaran fenomena optik dengan formulasi matematis intuitif, menjembatani konsep gelombang mekanik, bunyi, termodinamika terapan, dan gelombang elektromagnetik dalam studi kasus nyata di kehidupan sehari-hari dan rekayasa industri.'
})

// 2. Tabs State
const activeTab = ref('sinopsis')

const infoTabs = [
  {
    id: 'sinopsis',
    label: 'Sinopsis & Capaian',
    iconSvg: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 }, [
      h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
      h('polyline', { points: '14 2 14 8 20 8' })
    ])
  },
  {
    id: 'daftar-isi',
    label: 'Daftar Isi & Modul (8 Bab)',
    iconSvg: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 }, [
      h('line', { x1: '8', y1: '6', x2: '21', y2: '6' }),
      h('line', { x1: '8', y1: '12', x2: '21', y2: '12' }),
      h('line', { x1: '8', y1: '18', x2: '21', y2: '18' }),
      h('line', { x1: '3', y1: '6', x2: '3.01', y2: '6' }),
      h('line', { x1: '3', y1: '12', x2: '3.01', y2: '12' }),
      h('line', { x1: '3', y1: '18', x2: '3.01', y2: '18' })
    ])
  },
  {
    id: 'bibliografi',
    label: 'Data Bibliografi & Hak Cipta',
    iconSvg: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('path', { d: 'M15 9.354a4 4 0 1 0 0 5.292' })
    ])
  }
]

// 8 Bab Lengkap
const daftarIsiList = [
  { title: 'Bab 1: Kinematika & Dinamika Partikel Lanjut', page: 8 },
  { title: 'Bab 2: Formulasi Gelombang Sinusoidal & Mekanika Berjalan', page: 48 },
  { title: 'Bab 3: Gelombang Bunyi, Resonansi, & Efek Doppler', page: 82 },
  { title: 'Bab 4: Optika Fisis, Interferensi, & Polarisasi Cahaya', page: 114 },
  { title: 'Bab 5: Teori Kinetik Gas & Hukum Termodinamika Terapan', page: 146 },
  { title: 'Bab 6: Medan Elektrostatika & Rangkaian Arus Bolak-Balik (AC)', page: 172 },
  { title: 'Bab 7: Induksi Elektromagnetik & Transformator Daya', page: 202 },
  { title: 'Bab 8: Fisika Modern, Efek Fotolistrik, & Radioaktivitas', page: 224 }
]

// 3. Web Reader Controls
const currentPage = ref(48)
const totalPages = ref(234)
const zoomLevel = ref(100)
const searchQuery = ref('')
const isFullscreen = ref(false)
const readerContainer = ref(null)

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

const scrollToReader = () => {
  const el = document.getElementById('web-reader')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

const jumpToPage = (page) => {
  currentPage.value = page
  scrollToReader()
}

// 4. Rekomendasi Terkait (4 Koleksi Buku)
const relatedBooks = ref([
  {
    id: 'rel-1',
    title: 'Kimia Terapan & Kesetimbangan Reaksi SMA',
    shortTitle: 'Kimia Termokimia',
    author: 'Drs. Agus Budiman, M.Pd',
    subCategory: 'Kimia Fase F • Kelas XI',
    pages: '240 hal.',
    statusBadgeText: 'Tersedia',
    statusBadgeClass: 'bg-emerald-500 text-white',
    coverGradient: 'bg-gradient-to-br from-[#0c4a60] to-[#041a22]',
    coverTopLabel: 'KIMIA FASE F',
    coverUrl: null,
    iconSvg: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 }, [
      h('path', { d: 'M10 2v7.31L4.1 19.34A2 2 0 0 0 5.8 22h12.4a2 2 0 0 0 1.7-2.66L14 9.31V2' })
    ])
  },
  {
    id: 'rel-2',
    title: 'Kalkulus Diferensial & Analisis Vektor Lanjut',
    shortTitle: 'Kalkulus SMA',
    author: 'Dicky Susanto, Ph.D',
    subCategory: 'Matematika Tingkat Lanjut',
    pages: '212 hal.',
    statusBadgeText: 'Tersedia',
    statusBadgeClass: 'bg-emerald-500 text-white',
    coverGradient: 'bg-gradient-to-br from-[#103b54] to-[#061822]',
    coverTopLabel: 'MATEMATIKA LANJUT',
    coverUrl: null,
    iconSvg: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 }, [
      h('path', { d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20' }),
      h('path', { d: 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' })
    ])
  },
  {
    id: 'rel-3',
    title: 'Genetika Molekuler & Bioteknologi Modern',
    shortTitle: 'Genetika Biologi',
    author: 'Dr. Rina Nurhasanah',
    subCategory: 'Biologi Fase F • Kelas XII',
    pages: '264 hal.',
    statusBadgeText: 'E-Book Eksklusif',
    statusBadgeClass: 'bg-sky-500 text-white',
    coverGradient: 'bg-gradient-to-br from-[#0e2747] to-[#040e1a]',
    coverTopLabel: 'BIOLOGI SMA XII',
    coverUrl: null,
    iconSvg: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('path', { d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' })
    ])
  },
  {
    id: 'rel-4',
    title: 'Astrofisika Dasar & Kosmologi Pelajar SMAN 11',
    shortTitle: 'Astrofisika SMAN 11',
    author: 'Bambang Haryadi, Ph.D',
    subCategory: 'Fisika Pengayaan Khusus',
    pages: '190 hal.',
    statusBadgeText: 'Dipinjam (2 Tersedia)',
    statusBadgeClass: 'bg-amber-500 text-white',
    coverGradient: 'bg-gradient-to-br from-[#1b1736] to-[#070512]',
    coverTopLabel: 'ASTROFISIKA SMA',
    coverUrl: null,
    iconSvg: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 }, [
      h('circle', { cx: '12', cy: '12', r: '7' }),
      h('ellipse', { cx: '12', cy: '12', rx: '11', ry: '4', transform: 'rotate(-25 12 12)' })
    ])
  }
])

// 5. Toast & Interactivity
const showToast = ref(false)
const toastMessage = ref('')

const triggerToast = (msg) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3200)
}

const copyCitation = () => {
  const citationText = `Wijaya, H., dkk. (2024). Fisika Terapan & Mekanika Gelombang Fase F (Kelas XI SMA). Jakarta: Kemendikbudristek RI / E-Library SMAN 11 Garut.`
  navigator.clipboard.writeText(citationText)
  triggerToast('Kutipan Ilmiah (Format APA) berhasil disalin ke clipboard!')
}

const handlePinjamCetak = () => {
  triggerToast('Permintaan Pinjam Cetak dicatat. Silakan hubungi Ibu Siti Rohmah di Ruang Perpustakaan.')
}

const handleDownloadEbook = () => {
  triggerToast('Memulai pengunduhan E-Book offline (18.4 MB)...')
}

const handleShare = () => {
  navigator.clipboard.writeText(window.location.href)
  triggerToast('Tautan dokumen buku berhasil disalin!')
}
</script>

<style scoped>
/* Scrollbar invisible for clean horizontal tabs */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Toast Animation */
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
