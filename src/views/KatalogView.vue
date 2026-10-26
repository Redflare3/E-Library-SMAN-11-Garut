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
          <!-- Button Presensi Mandiri Hari Ini -->
          <router-link
            to="/presensi"
            class="px-5 py-3 rounded-xl bg-[#005B70] hover:bg-[#004859] active:bg-[#003845] text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <!-- User Check-in Icon -->
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="11" cy="7" r="4" />
              <polyline points="17 11 19 13 23 9" />
            </svg>
            <span>Presensi Mandiri Hari Ini</span>
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
                4.800+
              </div>
              <div class="text-[11px] text-slate-400 font-medium mt-1">
                Buku Teks &amp; Digital
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
                28
              </div>
              <div class="text-[11px] text-slate-400 font-medium mt-1">
                Kategori Merdeka
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
                Petugas Bertugas: <span class="font-semibold text-white">Siti Rohmah, S.I.Pust</span>
              </div>
              <div class="flex items-center gap-1 text-emerald-300 font-semibold">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Ruang Baca Buka</span>
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
              Sinkronisasi Dapodik &amp; Kurikulum Merdeka
            </div>
            <div class="text-[11px] text-slate-400 mt-0.5">
              Update koleksi edisi revisi terbaru 2024/2025
            </div>
          </div>
        </div>
      </div>

    </section>

    <!-- 2. SECTION: BUKU PILIHAN KURIKULUM MERDEKA (FASE E & F) -->
    <section class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <!-- Rekomendasi Wajib Guru Pill Header -->
          <div class="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#005B70] uppercase tracking-wider mb-1">
            <svg class="w-4 h-4 text-[#005B70]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>REKOMENDASI WAJIB GURU</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Buku Pilihan Kurikulum Merdeka (Fase E &amp; F)
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">
            Buku teks induk dan pegangan asesmen nasional yang disesuaikan dengan kurikulum 2024/2025.
          </p>
        </div>

        <!-- Filter Pills Kanan -->
        <div class="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto pb-1 scrollbar-none">
          <button
            v-for="pill in rekomendasiPills"
            :key="pill"
            type="button"
            :class="[
              'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
              activeRekomendasi === pill
                ? 'bg-[#005B70] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            ]"
            @click="activeRekomendasi = pill"
          >
            {{ pill }}
          </button>
        </div>
      </div>

      <!-- 3 Grid Book Card Horizontal Layout -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
        <div 
          v-for="buku in filteredRekomendasi" 
          :key="buku.id"
         class="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
        >
          <!-- Top Row: Cover + Info -->
          <div class="flex items-start gap-3.5">
            <!-- Cover Book Thumbnail -->
            <div class="w-20 h-28 rounded-xl overflow-hidden shadow-xs border border-slate-200/90 shrink-0 relative bg-slate-900 flex flex-col justify-between p-1.5 text-white">
              <img 
                v-if="buku.coverUrl" 
                :src="buku.coverUrl" 
                :alt="buku.title" 
                class="w-full h-full object-cover rounded-lg"
              />
              <div 
                v-else 
                :class="['h-full w-full rounded-lg p-1.5 flex flex-col justify-between text-center relative overflow-hidden', buku.coverGradient]"
              >
                <!-- Badge Fase di Kover -->
                <span class="inline-block self-start text-[6px] font-bold px-1 py-0.5 rounded bg-black/40 text-cyan-200 uppercase">
                  {{ buku.faseLabel }}
                </span>
                <div class="my-auto">
                  <div class="text-[8px] font-extrabold uppercase leading-tight line-clamp-2">
                    {{ buku.shortTitle }}
                  </div>
                </div>
                <div class="text-[5px] text-white/70">
                  SMAN 11 GARUT
                </div>
              </div>
            </div>

            <!-- Info Bibliografi -->
            <div class="flex-1 min-w-0">
              <span :class="['inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider', buku.badgeClass]">
                {{ buku.badgeText }}
              </span>
              <h3 class="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#005B70] transition-colors line-clamp-2 mt-1 leading-snug">
                {{ buku.title }}
              </h3>
              <p class="text-[10px] text-slate-400 mt-1 line-clamp-1">
                {{ buku.author }}
              </p>
              <div class="text-[10px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{{ buku.stockInfo }}</span>
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
    <section class="space-y-5">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Katalog Lengkap Koleksi
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">
            Jelajahi buku teks resmi, novel sastra, karya ilmiah siswa, dan referensi umum.
          </p>
        </div>

        <!-- Total Count Badge -->
        <div class="self-start sm:self-auto inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
          Menampilkan {{ filteredKatalog.length }} dari 4.812 judul buku
        </div>
      </div>

      <!-- Category Filter Pills (Horizontal Scrollable) -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          v-for="cat in kategoriPills"
          :key="cat"
          type="button"
          :class="[
            'px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
            activeKategori === cat
              ? 'bg-[#005B70] text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
          ]"
          @click="activeKategori = cat"
        >
          {{ cat }}
        </button>
      </div>

      <!-- 4 Column Grid Book Cards (Responsive 2 Col Mobile / 4 Col Desktop) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-1">
        <div 
          v-for="buku in filteredKatalog" 
          :key="buku.id"
          class="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
        >
          <!-- Card Top: Cover with floating badges -->
          <div class="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 bg-slate-900 flex flex-col justify-between p-2.5 text-white">
            
            <!-- Floating Top Badges (Dewey & Fase) -->
            <div class="flex items-center justify-between relative z-10">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/90 text-slate-800 shadow-xs backdrop-blur-xs">
                {{ buku.deweyCode }}
              </span>
              <span :class="['inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-xs', buku.faseBadgeClass]">
                {{ buku.faseText }}
              </span>
            </div>

            <!-- Styled Cover Graphic (or dynamic image) -->
            <img 
              v-if="buku.coverUrl" 
              :src="buku.coverUrl" 
              :alt="buku.title" 
              class="absolute inset-0 w-full h-full object-cover"
            />
            <div 
              v-else 
              :class="['absolute inset-0 flex flex-col justify-between p-3 text-center', buku.coverGradient]"
            >
              <div class="pt-6">
                <span class="text-[8px] tracking-widest text-white/80 uppercase font-mono">EDISI REVISI</span>
                <div class="text-sm font-extrabold uppercase mt-1 leading-tight text-white drop-shadow-xs">
                  {{ buku.shortTitle }}
                </div>
              </div>
              
              <!-- Subtle Abstract Icon in Center -->
              <div class="w-12 h-12 mx-auto my-auto rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>

              <div class="pb-6 text-[7px] text-white/70 uppercase tracking-wider">
                SMAN 11 GARUT • REPOSITORI
              </div>
            </div>

            <!-- Floating Availability Pill at Bottom of Cover -->
            <div class="relative z-10 flex justify-center -mb-1">
              <span :class="['inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold shadow-md', buku.stockBadgeClass]">
                <span :class="['w-1.5 h-1.5 rounded-full', buku.stockDotClass]"></span>
                <span>{{ buku.stockBadgeText }}</span>
              </span>
            </div>
          </div>

          <!-- Card Content: Metadata -->
          <div class="pt-3.5 space-y-1 flex-1 flex flex-col justify-between">
            <div>
              <div class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {{ buku.subCategory }}
              </div>
              <h3 class="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#005B70] transition-colors line-clamp-2 mt-0.5 leading-snug">
                {{ buku.title }}
              </h3>
              <p class="text-[11px] text-slate-500 mt-1 line-clamp-1">
                {{ buku.author }} ({{ buku.year }})
              </p>
            </div>

            <div class="flex items-center gap-1 text-[11px] text-slate-400 font-medium pt-2">
              <svg class="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              </svg>
              <span>{{ buku.pages }}</span>
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

      <!-- Pagination Bar Sesuai Figma -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-6 text-xs text-slate-400 border-t border-slate-100">
        <div>
          Menampilkan Halaman 1 dari 162 • Total 4.812 Karya E-Book Perpustakaan SMAN 11 Garut
        </div>

        <div class="flex items-center gap-1.5">
          <!-- Prev Button -->
          <button 
            type="button" 
            class="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-40"
            disabled
          >
            ‹
          </button>

          <!-- Page 1 Active -->
          <button type="button" class="w-7 h-7 rounded-lg bg-[#005B70] text-white font-bold flex items-center justify-center cursor-pointer shadow-xs">
            1
          </button>

          <!-- Page 2 -->
          <button type="button" class="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 font-medium flex items-center justify-center cursor-pointer">
            2
          </button>

          <!-- Page 3 -->
          <button type="button" class="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 font-medium flex items-center justify-center cursor-pointer">
            3
          </button>

          <span class="px-1 text-slate-400">...</span>

          <!-- Page 162 -->
          <button type="button" class="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 font-medium flex items-center justify-center cursor-pointer">
            162
          </button>

          <!-- Next Button -->
          <button 
            type="button" 
            class="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            ›
          </button>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 1. Rekomendasi Section Filters
const activeRekomendasi = ref('Semua')
const rekomendasiPills = ['Semua', 'Kelas X (Fase E)', 'Kelas XI & XII (Fase F)']

// Mock Data: Buku Pilihan Kurikulum Merdeka (Fase E & F)
const rekomendasiBuku = ref([
  {
    id: 'rek-1',
    title: 'Fisika Terapan & Energi Berkelanjutan',
    shortTitle: 'Fisika Terapan',
    author: 'Dr. Bambang H., M.Si — Pusat Perbukuan Kemendikbudristek',
    fase: 'Kelas XI & XII (Fase F)',
    faseLabel: 'Fase F',
    badgeText: 'SAINS & TERAPAN • 530',
    badgeClass: 'bg-blue-50 text-blue-700',
    stockInfo: 'Tersedia: 14 Cetak + E-Book Aktif',
    coverGradient: 'bg-gradient-to-br from-[#0c2340] to-[#103b6e]',
    coverUrl: null
  },
  {
    id: 'rek-2',
    title: 'Informatika: Berpikir Komputasional & Python',
    shortTitle: 'Informatika',
    author: 'Iya Wiranata, Ph.D — Kurikulum Merdeka',
    fase: 'Kelas X (Fase E)',
    faseLabel: 'Fase E',
    badgeText: 'KOMPUTASI • 004',
    badgeClass: 'bg-sky-50 text-sky-700',
    stockInfo: 'Tersedia: 22 Cetak + E-Book Aktif',
    coverGradient: 'bg-gradient-to-br from-[#07243b] to-[#0d4f80]',
    coverUrl: null
  },
  {
    id: 'rek-3',
    title: 'Rancage Diajar Basa Sunda pikeun Murid SMA',
    shortTitle: 'Basa Sunda',
    author: 'Drs. Yayat Sudaryat, M.Hum — Disdik Jabar',
    fase: 'Kelas X (Fase E)',
    faseLabel: 'Muatan Lokal',
    badgeText: 'BAHASA & BUDAYA • 499',
    badgeClass: 'bg-amber-50 text-amber-800',
    stockInfo: 'Tersedia: 30 Cetak + E-Book Aktif',
    coverGradient: 'bg-gradient-to-br from-[#3b2408] to-[#784d14]',
    coverUrl: null
  }
])

const filteredRekomendasi = computed(() => {
  if (activeRekomendasi.value === 'Semua') return rekomendasiBuku.value
  return rekomendasiBuku.value.filter(b => b.fase === activeRekomendasi.value)
})

// 2. Katalog Lengkap Section Filters
const activeKategori = ref('Semua Kategori')
const kategoriPills = [
  'Semua Kategori',
  'Matematika & Sains',
  'Fisika & Kimia Terapan',
  'Sejarah & Sosial',
  'Bahasa & Sastra Sunda',
  'Informatika & Robotik',
  'Pendidikan Karakter & Agama'
]

// Mock Data: 8 Koleksi Buku di Katalog Utama (Sesuai Mockup Figma)
const koleksiBuku = ref([
  {
    id: 1,
    title: 'Matematika Tingkat Standar & Penalaran Logis',
    shortTitle: 'Matematika',
    deweyCode: 'Dewey 510',
    faseText: 'Fase E',
    faseBadgeClass: 'bg-blue-600',
    subCategory: 'MATEMATIKA & SAINS',
    categoryKey: 'Matematika & Sains',
    author: 'Dicky Susanto, dkk',
    year: '2023',
    pages: '234 hal.',
    stockBadgeText: '18 Tersedia',
    stockBadgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/90',
    stockDotClass: 'bg-emerald-500',
    coverGradient: 'bg-gradient-to-br from-[#0f3d4c] to-[#071f28]',
    coverUrl: null
  },
  {
    id: 2,
    title: 'Sejarah Indonesia: Kolonialisme & Kebangkitan',
    shortTitle: 'Sejarah Indonesia',
    deweyCode: 'Dewey 959',
    faseText: 'Fase F',
    faseBadgeClass: 'bg-blue-600',
    subCategory: 'SEJARAH & SOSIAL',
    categoryKey: 'Sejarah & Sosial',
    author: 'Sartono Kartodirdjo & Tim',
    year: '2022',
    pages: '288 hal.',
    stockBadgeText: '8 Tersedia',
    stockBadgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/90',
    stockDotClass: 'bg-emerald-500',
    coverGradient: 'bg-gradient-to-br from-[#3d2c18] to-[#1c1308]',
    coverUrl: null
  },
  {
    id: 3,
    title: 'Kimia Hijau & Pembangunan Berkelanjutan',
    shortTitle: 'Kimia Hijau',
    deweyCode: 'Dewey 540',
    faseText: 'Fase F-12',
    faseBadgeClass: 'bg-blue-600',
    subCategory: 'FISIKA & KIMIA',
    categoryKey: 'Fisika & Kimia Terapan',
    author: 'Galuh Yuliani, Ph.D.',
    year: '2024',
    pages: '210 hal.',
    stockBadgeText: '2 Tersedia',
    stockBadgeClass: 'bg-amber-50 text-amber-700 border border-amber-200/90',
    stockDotClass: 'bg-amber-500',
    coverGradient: 'bg-gradient-to-br from-[#0d3f34] to-[#041713]',
    coverUrl: null
  },
  {
    id: 4,
    title: 'Katumbiri Priangan: Kumpulan Carpon & Sajak...',
    shortTitle: 'Katumbiri Priangan',
    deweyCode: 'Dewey 899',
    faseText: 'Karya Daerah',
    faseBadgeClass: 'bg-amber-600',
    subCategory: 'BAHASA & SASTRA',
    categoryKey: 'Bahasa & Sastra Sunda',
    author: 'Dadan Sutisna',
    year: '2023',
    pages: '170 hal.',
    stockBadgeText: '15 Tersedia',
    stockBadgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/90',
    stockDotClass: 'bg-emerald-500',
    coverGradient: 'bg-gradient-to-br from-[#3b1e38] to-[#1a0c18]',
    coverUrl: null
  },
  {
    id: 5,
    title: 'Pengantar Machine Learning & Rekayasa Data Siswa',
    shortTitle: 'Machine Learning',
    deweyCode: 'Dewey 006',
    faseText: 'Peminatan',
    faseBadgeClass: 'bg-sky-600',
    subCategory: 'INFORMATIKA & AI',
    categoryKey: 'Informatika & Robotik',
    author: 'Riko Prasetyo, M.Kom',
    year: '2024',
    pages: '240 hal.',
    stockBadgeText: 'E-Book Saja',
    stockBadgeClass: 'bg-sky-50 text-sky-700 border border-sky-200/90',
    stockDotClass: 'bg-sky-500',
    coverGradient: 'bg-gradient-to-br from-[#0a2744] to-[#031120]',
    coverUrl: null
  },
  {
    id: 6,
    title: 'Pendidikan Pancasila: Membangun Karakter Profil...',
    shortTitle: 'Pancasila',
    deweyCode: 'Dewey 320',
    faseText: 'Fase E',
    faseBadgeClass: 'bg-blue-600',
    subCategory: 'KARAKTER & KEBANGSAAN',
    categoryKey: 'Pendidikan Karakter & Agama',
    author: 'Abdul Wakhid, dkk',
    year: '2023',
    pages: '270 hal.',
    stockBadgeText: '40 Tersedia',
    stockBadgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/90',
    stockDotClass: 'bg-emerald-500',
    coverGradient: 'bg-gradient-to-br from-[#121c2c] to-[#070b13]',
    coverUrl: null
  },
  {
    id: 7,
    title: 'Matematika Tingkat Lanjut: Kalkulus & Matriks',
    shortTitle: 'Kalkulus & Matriks',
    deweyCode: 'Dewey 510',
    faseText: 'Fase F-12',
    faseBadgeClass: 'bg-blue-600',
    subCategory: 'MATEMATIKA & SAINS',
    categoryKey: 'Matematika & Sains',
    author: 'Al Azhary Masta, dkk',
    year: '2023',
    pages: '300 hal.',
    stockBadgeText: '11 Tersedia',
    stockBadgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/90',
    stockDotClass: 'bg-emerald-500',
    coverGradient: 'bg-gradient-to-br from-[#132c38] to-[#071319]',
    coverUrl: null
  },
  {
    id: 8,
    title: 'Geografi: Dinamika Litosfer & Kebencanaan di Garut',
    shortTitle: 'Geografi Garut',
    deweyCode: 'Dewey 910',
    faseText: 'Fase E',
    faseBadgeClass: 'bg-blue-600',
    subCategory: 'GEOGRAFI & SOSIAL',
    categoryKey: 'Sejarah & Sosial',
    author: 'Budi Handoyo, dkk',
    year: '2023',
    pages: '220 hal.',
    stockBadgeText: '25 Tersedia',
    stockBadgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/90',
    stockDotClass: 'bg-emerald-500',
    coverGradient: 'bg-gradient-to-br from-[#1d3319] to-[#0a1408]',
    coverUrl: null
  }
])

const filteredKatalog = computed(() => {
  if (activeKategori.value === 'Semua Kategori') return koleksiBuku.value
  return koleksiBuku.value.filter(b => b.categoryKey === activeKategori.value)
})

// Actions: Navigasi ke Detail Buku & Reader
const openDetail = (buku) => {
  router.push(`/buku/${buku.id}`)
}

const openReader = (buku) => {
  router.push(`/buku/${buku.id}`)
}

const showGuideAlert = () => {
  alert('Panduan Membaca E-Book Digital SMAN 11 Garut:\n1. Pilih buku yang diinginkan.\n2. Klik tombol "Baca" untuk membuka reader offline.\n3. Fitur bookmark dan pencarian teks tersedia secara lokal.')
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
