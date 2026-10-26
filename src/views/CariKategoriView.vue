<template>
  <div class="space-y-6 pb-12 text-slate-800 select-none">
    
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
        <span>E-Katalog Kurikulum Merdeka &amp; Repositori DDC SMAN 11 Garut</span>
      </div>

      <!-- Big Title & Description -->
      <div class="relative z-10 mt-3 space-y-1.5">
        <h1 class="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-white leading-snug">
          Eksplorasi Koleksi &amp; Literatur Digital
        </h1>
        <p class="text-xs sm:text-sm text-cyan-100/80 max-w-3xl leading-relaxed">
          Temukan 12.450+ buku paket elektronik, modul praktikum Fase E &amp; F, karya literasi siswa, serta pustaka cetak perpustakaan sekolah.
        </p>
      </div>

      <!-- Main Search Bar Container -->
      <div class="relative z-10 mt-6 bg-white rounded-2xl p-2 sm:p-2.5 shadow-md flex flex-col md:flex-row items-center gap-2 text-slate-800">
        <!-- Input Text Keyword with Search Icon & Clear Button -->
        <div class="flex-1 w-full flex items-center gap-2 px-2">
          <svg class="w-5 h-5 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Ketik judul buku, materi, atau topik..."
            class="w-full bg-transparent py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
            @keyup.enter="handleSearch"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs cursor-pointer transition-colors shrink-0"
            title="Hapus pencarian"
            @click="searchQuery = ''"
          >
            ✕
          </button>
        </div>

        <!-- Scan Button: Pindai Barcode / Rak -->
        <button
          type="button"
          class="w-full md:w-auto border border-[#005B70]/30 hover:bg-[#E1EFF6] text-[#005B70] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap transition-colors cursor-pointer shadow-2xs"
          @click="openScanModal"
        >
          <!-- QR / Barcode Icon -->
          <svg class="w-4 h-4 text-[#005B70]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            <rect x="7" y="7" width="10" height="10" rx="1" />
          </svg>
          <span>Pindai Barcode / Rak</span>
        </button>

        <!-- Primary Button: Cari Buku -->
        <button
          type="button"
          class="w-full md:w-auto bg-[#005B70] hover:bg-[#004859] active:bg-[#003845] text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap shadow-xs transition-colors cursor-pointer"
          @click="handleSearch"
        >
          <span>Cari Buku</span>
          <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      <!-- Quick Search Tags (Paling Dicari) -->
      <div class="relative z-10 flex flex-wrap items-center gap-2 pt-3 text-xs">
        <span class="text-cyan-200/90 text-[11px] font-medium mr-1">Paling Dicari:</span>
        <button
          v-for="tag in popularTags"
          :key="tag"
          type="button"
          class="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] text-white font-medium cursor-pointer transition-colors shadow-2xs"
          @click="selectQuickTag(tag)"
        >
          {{ tag }}
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

        <!-- Chip Search Keyword -->
        <span 
          v-if="searchQuery.trim()"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-[#005B70] border border-sky-200"
        >
          <span>Kata Kunci: "{{ searchQuery }}"</span>
          <button 
            type="button" 
            class="hover:text-rose-600 cursor-pointer font-bold ml-0.5"
            @click="searchQuery = ''"
          >
            ✕
          </button>
        </span>

        <!-- Chips Fase -->
        <span 
          v-for="f in filters.fase"
          :key="'fase-' + f"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-[#005B70] border border-sky-200"
        >
          <span>{{ f === 'Fase F (Kelas 11 – 12)' ? 'Fase F (Kelas 11–12)' : f }}</span>
          <button 
            type="button" 
            class="hover:text-rose-600 cursor-pointer font-bold ml-0.5"
            @click="removeFilter('fase', f)"
          >
            ✕
          </button>
        </span>

        <!-- Chips Mapel -->
        <span 
          v-for="m in filters.mapel"
          :key="'mapel-' + m"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-[#005B70] border border-sky-200"
        >
          <span>Mapel: {{ m }}</span>
          <button 
            type="button" 
            class="hover:text-rose-600 cursor-pointer font-bold ml-0.5"
            @click="removeFilter('mapel', m)"
          >
            ✕
          </button>
        </span>

        <!-- Chips DDC -->
        <span 
          v-for="d in filters.ddc"
          :key="'ddc-' + d"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-[#005B70] border border-sky-200"
        >
          <span>{{ d }}</span>
          <button 
            type="button" 
            class="hover:text-rose-600 cursor-pointer font-bold ml-0.5"
            @click="removeFilter('ddc', d)"
          >
            ✕
          </button>
        </span>

        <!-- Chips Format -->
        <span 
          v-for="fmt in filters.format"
          :key="'format-' + fmt"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-[#005B70] border border-sky-200"
        >
          <span>Format: {{ fmt }}</span>
          <button 
            type="button" 
            class="hover:text-rose-600 cursor-pointer font-bold ml-0.5"
            @click="removeFilter('format', fmt)"
          >
            ✕
          </button>
        </span>

        <!-- Chips Availability -->
        <span 
          v-for="av in filters.availability"
          :key="'avail-' + av"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-[#005B70] border border-sky-200"
        >
          <span>{{ av === 'daring' ? 'Dapat Dibaca Daring' : av === 'unduh' ? 'Unduh Luring' : 'Tersedia di Rak' }}</span>
          <button 
            type="button" 
            class="hover:text-rose-600 cursor-pointer font-bold ml-0.5"
            @click="removeFilter('availability', av)"
          >
            ✕
          </button>
        </span>

        <!-- Reset Button -->
        <button
          v-if="hasActiveFilters"
          type="button"
          class="text-xs font-semibold text-slate-400 hover:text-rose-600 ml-2 transition-colors cursor-pointer"
          @click="resetFilters"
        >
          Reset Semua
        </button>
        <span v-else class="text-xs text-slate-400 italic">Tidak ada filter aktif</span>
      </div>

      <!-- Result Info & Sort Dropdown -->
      <div class="flex items-center gap-3 self-end md:self-auto">
        <div class="text-slate-500 font-medium">
          Menampilkan <strong class="text-slate-800 font-bold">{{ filteredBooks.length }}</strong> dari <strong class="text-slate-800 font-bold">{{ allBooks.length }}</strong> Koleksi
        </div>

        <div class="flex items-center gap-1.5">
          <span class="text-slate-400 text-[11px]">Urutkan:</span>
          <select
            v-model="sortBy"
            class="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005B70] cursor-pointer"
          >
            <option value="populer">Paling Banyak Dibaca</option>
            <option value="terbaru">Terbaru Diunggah</option>
            <option value="judul">Judul (A - Z)</option>
          </select>
        </div>
      </div>

    </section>

    <!-- 3. MAIN 2-COLUMN LAYOUT (SIDEBAR FILTER VS SEARCH RESULTS GRID) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      <!-- ===================== KOLOM KIRI: SIDEBAR MULTI-LEVEL FILTER ===================== -->
      <aside class="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-5 text-xs text-slate-700">

        <!-- Accordion 1: Kurikulum Merdeka -->
        <div class="space-y-3 pb-4 border-b border-slate-100">
          <div 
            class="flex items-center justify-between font-bold text-slate-800 cursor-pointer"
            @click="accordionState.kurikulum = !accordionState.kurikulum"
          >
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-[#005B70]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <span>Kurikulum Merdeka</span>
            </div>
            <svg 
              class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200"
              :class="{ 'rotate-180': !accordionState.kurikulum }"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </div>

          <div v-show="accordionState.kurikulum" class="space-y-3 pl-1">
            <div class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Fase Pembelajaran</div>
            
            <!-- Checkbox Fase E -->
            <label class="flex items-center justify-between text-slate-600 hover:text-slate-900 cursor-pointer">
              <div class="flex items-center gap-2">
                <input 
                  v-model="filters.fase" 
                  type="checkbox" 
                  value="Fase E (Kelas 10)" 
                  class="rounded border-slate-300 text-[#005B70] focus:ring-[#005B70]"
                />
                <span>Fase E (Kelas 10)</span>
              </div>
              <span class="text-[11px] text-slate-400">48</span>
            </label>

            <!-- Checkbox Fase F -->
            <label class="flex items-center justify-between font-semibold text-slate-800 hover:text-slate-900 cursor-pointer">
              <div class="flex items-center gap-2">
                <input 
                  v-model="filters.fase" 
                  type="checkbox" 
                  value="Fase F (Kelas 11 – 12)" 
                  class="rounded border-slate-300 text-[#005B70] focus:ring-[#005B70]"
                />
                <span>Fase F (Kelas 11 – 12)</span>
              </div>
              <span class="px-2 py-0.5 rounded-full bg-sky-100 text-[#005B70] text-[10px] font-bold">72</span>
            </label>

            <!-- Sub-list Mata Pelajaran -->
            <div class="pt-2 space-y-2">
              <div class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Mata Pelajaran Pilihan / Wajib</div>
              <label 
                v-for="item in mapelOptions" 
                :key="item.name" 
                class="flex items-center justify-between text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <div class="flex items-center gap-2">
                  <input 
                    v-model="filters.mapel" 
                    type="checkbox" 
                    :value="item.name" 
                    class="rounded border-slate-300 text-[#005B70] focus:ring-[#005B70]"
                  />
                  <span :class="{ 'font-bold text-slate-800': filters.mapel.includes(item.name) }">{{ item.name }}</span>
                </div>
                <span class="text-[11px] text-slate-400">{{ item.count }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Accordion 2: Klasifikasi DDC -->
        <div class="space-y-3 pb-4 border-b border-slate-100">
          <div 
            class="flex items-center justify-between font-bold text-slate-800 cursor-pointer"
            @click="accordionState.ddc = !accordionState.ddc"
          >
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-[#005B70]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Klasifikasi DDC</span>
            </div>
            <svg 
              class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200"
              :class="{ 'rotate-180': !accordionState.ddc }"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </div>

          <div v-show="accordionState.ddc" class="space-y-2 pl-1">
            <label 
              v-for="ddc in ddcOptions" 
              :key="ddc.name" 
              class="flex items-center justify-between text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <div class="flex items-center gap-2">
                <input 
                  v-model="filters.ddc" 
                  type="checkbox" 
                  :value="ddc.name" 
                  class="rounded border-slate-300 text-[#005B70] focus:ring-[#005B70]"
                />
                <span :class="{ 'font-bold text-slate-800': filters.ddc.includes(ddc.name) }">{{ ddc.name }}</span>
              </div>
              <span 
                :class="filters.ddc.includes(ddc.name) ? 'px-2 py-0.5 rounded-full bg-sky-100 text-[#005B70] text-[10px] font-bold' : 'text-[11px] text-slate-400'"
              >
                {{ ddc.count }}
              </span>
            </label>
          </div>
        </div>

        <!-- Accordion 3: Format Berkas -->
        <div class="space-y-3 pb-4 border-b border-slate-100">
          <div class="flex items-center gap-2 font-bold text-slate-800">
            <svg class="w-4 h-4 text-[#005B70]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <span class="uppercase tracking-wider text-[10px] text-slate-400 font-bold">Format Berkas</span>
          </div>

          <div class="space-y-2.5 pl-1">
            <!-- PDF Interaktif -->
            <label class="flex items-center justify-between text-slate-600 hover:text-slate-900 cursor-pointer">
              <div class="flex items-center gap-2">
                <input 
                  v-model="filters.format" 
                  type="checkbox" 
                  value="PDF Interaktif" 
                  class="rounded border-slate-300 text-[#005B70] focus:ring-[#005B70]"
                />
                <span :class="{ 'font-bold text-slate-800': filters.format.includes('PDF Interaktif') }">PDF Interaktif</span>
              </div>
              <span class="text-[10px] text-rose-500 font-bold bg-rose-50 px-1.5 py-0.5 rounded">PDF</span>
            </label>

            <!-- ePub Reflowable -->
            <label class="flex items-center justify-between text-slate-600 hover:text-slate-900 cursor-pointer">
              <div class="flex items-center gap-2">
                <input 
                  v-model="filters.format" 
                  type="checkbox" 
                  value="ePub Reflowable" 
                  class="rounded border-slate-300 text-[#005B70] focus:ring-[#005B70]"
                />
                <span :class="{ 'font-bold text-slate-800': filters.format.includes('ePub Reflowable') }">ePub Reflowable</span>
              </div>
              <span class="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">ePub</span>
            </label>

            <!-- Modul Ajar Digital (PMM) -->
            <label class="flex items-center justify-between text-slate-600 hover:text-slate-900 cursor-pointer">
              <div class="flex items-center gap-2">
                <input 
                  v-model="filters.format" 
                  type="checkbox" 
                  value="Modul Ajar Digital (PMM)" 
                  class="rounded border-slate-300 text-[#005B70] focus:ring-[#005B70]"
                />
                <span :class="{ 'font-bold text-slate-800': filters.format.includes('Modul Ajar Digital (PMM)') }">Modul Ajar Digital (PMM)</span>
              </div>
              <span class="text-[10px] text-teal-600 font-bold bg-teal-50 px-1.5 py-0.5 rounded">PMM</span>
            </label>
          </div>
        </div>

        <!-- Accordion 4: Status Ketersediaan -->
        <div class="space-y-3 pb-2">
          <div class="flex items-center gap-2 font-bold text-slate-800">
            <svg class="w-4 h-4 text-[#005B70]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 14 14"></polyline>
            </svg>
            <span class="uppercase tracking-wider text-[10px] text-slate-400 font-bold">Status Ketersediaan</span>
          </div>

          <div class="space-y-2.5 pl-1">
            <!-- Dapat Dibaca Daring -->
            <label class="flex items-center justify-between text-slate-600 hover:text-slate-900 cursor-pointer">
              <div class="flex items-center gap-2">
                <input 
                  v-model="filters.availability" 
                  type="checkbox" 
                  value="daring" 
                  class="rounded border-slate-300 text-[#005B70] focus:ring-[#005B70]"
                />
                <span :class="{ 'font-bold text-slate-800': filters.availability.includes('daring') }">Dapat Dibaca Daring</span>
              </div>
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            </label>

            <!-- Unduh Luring (Offline) -->
            <label class="flex items-center justify-between text-slate-600 hover:text-slate-900 cursor-pointer">
              <div class="flex items-center gap-2">
                <input 
                  v-model="filters.availability" 
                  type="checkbox" 
                  value="unduh" 
                  class="rounded border-slate-300 text-[#005B70] focus:ring-[#005B70]"
                />
                <span :class="{ 'font-bold text-slate-800': filters.availability.includes('unduh') }">Unduh Luring (Offline)</span>
              </div>
              <svg class="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </label>

            <!-- Tersedia Fisik di Rak -->
            <label class="flex items-center justify-between text-slate-600 hover:text-slate-900 cursor-pointer">
              <div class="flex items-center gap-2">
                <input 
                  v-model="filters.availability" 
                  type="checkbox" 
                  value="rak" 
                  class="rounded border-slate-300 text-[#005B70] focus:ring-[#005B70]"
                />
                <span :class="{ 'font-bold text-slate-800': filters.availability.includes('rak') }">Tersedia Fisik di Rak</span>
              </div>
              <svg class="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </label>
          </div>
        </div>

        <!-- Action Button: Terapkan & Segarkan Filter -->
        <div class="pt-3 border-t border-slate-100">
          <button
            type="button"
            class="w-full py-2.5 px-4 rounded-xl border border-[#005B70] text-[#005B70] hover:bg-[#E1EFF6] active:bg-[#d0ebf5] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
            @click="applyFilters"
          >
            <svg class="w-4 h-4 text-[#005B70]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            <span>Terapkan &amp; Segarkan Filter</span>
          </button>
        </div>

      </aside>

      <!-- ===================== KOLOM KANAN: GRID HASIL PENCARIAN BUKU ===================== -->
      <main class="lg:col-span-9 space-y-5">

        <!-- Header Info Query -->
        <div class="bg-[#EAF5F8] border border-[#CFE7EE] rounded-2xl p-4 flex items-center gap-3 text-xs shadow-2xs">
          <div class="w-9 h-9 rounded-xl bg-white border border-[#CFE7EE] text-[#005B70] flex items-center justify-center shrink-0 shadow-2xs">
            <svg class="w-5 h-5 text-[#005B70]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div>
            <h2 class="font-extrabold text-[#005B70] text-xs sm:text-sm tracking-tight leading-none">
              Hasil Pencarian: "{{ searchQuery || 'Semua Koleksi' }}" • {{ activeFaseLabel }}
            </h2>
            <p class="text-[11px] text-slate-500 mt-1">
              Buku teks resmi Kemendikbudristek 2024 dan modul referensi praktikum IPA Terapan SMAN 11 Garut.
            </p>
          </div>
        </div>

        <!-- Empty State (Jika Hasil Filter Kosong) -->
        <div 
          v-if="filteredBooks.length === 0" 
          class="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3"
        >
          <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h3 class="text-sm font-bold text-slate-800">Tidak ada buku yang sesuai</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">
            Tidak ditemukan koleksi dengan kata kunci atau filter yang Anda pilih. Coba sesuaikan kata kunci atau bersihkan filter.
          </p>
          <button 
            type="button" 
            class="px-4 py-2 rounded-xl bg-[#005B70] hover:bg-[#004859] text-white text-xs font-bold transition-colors cursor-pointer"
            @click="resetFilters"
          >
            Reset Semua Filter
          </button>
        </div>

        <!-- 3-Column Book Cards Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          <article
            v-for="buku in paginatedBooks"
            :key="buku.id"
            class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
          >
            <div class="space-y-3">
              <!-- COVER BUKU DIGITAL (ABU-ABU NETRAL SESUAI PERMINTAAN USER / SIAP BE) -->
              <div class="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-2xs flex flex-col justify-between p-3 group/cover">
                
                <!-- Dynamic Image if provided by BE -->
                <img 
                  v-if="buku.coverUrl" 
                  :src="buku.coverUrl" 
                  :alt="buku.title" 
                  class="absolute inset-0 w-full h-full object-cover z-10"
                />

                <!-- Neutral Gray Placeholder ("Abu-abu seperti sebelum diganti") -->
                <div v-else class="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center p-3 text-center">
                  <!-- Dashed inner border box -->
                  <div class="w-full h-full border-2 border-dashed border-slate-300/80 rounded-lg flex flex-col items-center justify-center p-2 text-slate-400">
                    <div class="w-10 h-10 rounded-full bg-slate-200/70 flex items-center justify-center text-slate-400 mb-2">
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </div>
                    <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">SAMPUL BUKU DIGITAL</span>
                    <span class="text-[9px] text-slate-400 mt-0.5">Perpustakaan SMAN 11 Garut</span>
                  </div>
                </div>

                <!-- Floating Badges Top-Left (Fase & DDC) -->
                <div class="relative z-20 flex flex-col gap-1 self-start">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold shadow-xs bg-[#005B70] text-white">
                    {{ buku.faseBadge }}
                  </span>
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-white/95 text-slate-800 border border-slate-200/80 shadow-xs">
                    {{ buku.ddcBadge }}
                  </span>
                </div>

                <!-- Format Badge Top-Right -->
                <div class="absolute top-3 right-3 z-20">
                  <span 
                    :class="[
                      'text-[9px] font-bold px-1.5 py-0.5 rounded shadow-2xs border',
                      buku.format === 'PDF Interaktif' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                      buku.format === 'ePub Reflowable' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                      'bg-teal-50 text-[#005B70] border-teal-200'
                    ]"
                  >
                    {{ buku.format === 'PDF Interaktif' ? 'PDF' : buku.format === 'ePub Reflowable' ? 'ePub' : 'PMM' }}
                  </span>
                </div>

                <!-- Bottom subtle label -->
                <div class="relative z-20 text-center text-[8px] font-mono tracking-widest text-slate-500 uppercase">
                  SMAN 11 GARUT • E-LIBRARY
                </div>
              </div>

              <!-- Metadata Info -->
              <div class="space-y-1">
                <h3 class="font-bold text-xs text-slate-800 line-clamp-2 group-hover:text-[#005B70] transition-colors leading-snug">
                  {{ buku.title }}
                </h3>
                <p class="text-[11px] text-slate-400 line-clamp-1">
                  {{ buku.author }}
                </p>
              </div>
            </div>

            <!-- Action Button -->
            <div class="pt-3">
              <button 
                type="button" 
                class="w-full py-2 bg-[#005B70] hover:bg-[#004859] active:bg-[#003845] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                @click="openBook(buku)"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                <span>{{ buku.buttonText || 'Baca Daring' }}</span>
              </button>
            </div>
          </article>

        </div>

        <!-- 4. PAGINATION BAR -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 text-xs text-slate-400 border-t border-slate-100">
          <div>
            Menampilkan baris {{ startItemIndex }}–{{ endItemIndex }} dari total {{ filteredBooks.length }} judul buku terfilter
          </div>

          <div class="flex items-center gap-1.5">
            <!-- Prev Button -->
            <button 
              type="button" 
              class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="currentPage === 1"
              @click="currentPage > 1 && currentPage--"
            >
              ‹
            </button>

            <!-- Page Buttons -->
            <button 
              v-for="p in totalPages" 
              :key="'page-' + p"
              type="button" 
              :class="[
                'w-8 h-8 rounded-lg font-bold flex items-center justify-center cursor-pointer transition-colors',
                currentPage === p 
                  ? 'bg-[#005B70] text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              ]"
              @click="currentPage = p"
            >
              {{ p }}
            </button>

            <!-- Next Button -->
            <button 
              type="button" 
              class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="currentPage === totalPages || totalPages === 0"
              @click="currentPage < totalPages && currentPage++"
            >
              ›
            </button>
          </div>
        </div>

      </main>

    </div>

    <!-- 5. MODAL PINDAI BARCODE / RAK BUKU (OFFLINE SIMULATION) -->
    <div 
      v-if="isScanModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-sky-50 text-[#005B70] flex items-center justify-center">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="7" y="7" width="10" height="10" rx="1" />
              </svg>
            </div>
            <h3 class="font-bold text-sm text-slate-900">Pindai Barcode / Rak Buku</h3>
          </div>
          <button 
            type="button" 
            class="text-slate-400 hover:text-slate-600 cursor-pointer font-bold text-sm"
            @click="isScanModalOpen = false"
          >
            ✕
          </button>
        </div>

        <div class="bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden h-52">
          <!-- Frame Scanner Graphic -->
          <div class="w-40 h-28 border-2 border-cyan-400/80 rounded-xl flex items-center justify-center relative">
            <div class="absolute inset-x-0 h-0.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse"></div>
            <span class="text-[10px] text-cyan-200 font-mono tracking-wider">ARAHKAN KE BARCODE</span>
          </div>
          <span class="text-[11px] text-slate-400 mt-2">Sensor kamera lokal aktif</span>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-semibold text-slate-700 block">Atau Masukkan Nomor Barcode / DDC Manual:</label>
          <div class="flex items-center gap-2">
            <input 
              v-model="manualBarcode" 
              type="text" 
              placeholder="Contoh: 530.12-WJA-2024" 
              class="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#005B70]"
              @keyup.enter="submitManualBarcode"
            />
            <button 
              type="button" 
              class="px-4 py-2 bg-[#005B70] hover:bg-[#004859] text-white text-xs font-bold rounded-xl cursor-pointer"
              @click="submitManualBarcode"
            >
              Cari
            </button>
          </div>
        </div>

        <button 
          type="button" 
          class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          @click="isScanModalOpen = false"
        >
          Tutup
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 1. Search Query & Quick Tags
const searchQuery = ref('Fisika Modern')
const popularTags = [
  'Fisika Fase F',
  'Bahasa Sunda SMA',
  'DDC 500 Sains Murni',
  'Modul Ajar Kimia'
]

// 2. Multi-level Filters Reactive Object (State Awal Sesuai Gambar Figma)
const filters = reactive({
  fase: ['Fase F (Kelas 11 – 12)'],
  mapel: ['Fisika'],
  ddc: ['500 - Sains Murni'],
  format: ['PDF Interaktif'],
  availability: ['daring', 'unduh']
})

// Accordion Collapsible State
const accordionState = reactive({
  kurikulum: true,
  ddc: true
})

// Sorting Dropdown
const sortBy = ref('populer')

// Pagination State
const currentPage = ref(1)
const perPage = 6

// Options Data
const mapelOptions = [
  { name: 'Fisika', count: 18 },
  { name: 'Matematika Tingkat Lanjut', count: 24 },
  { name: 'Kimia', count: 15 },
  { name: 'Biologi', count: 19 },
  { name: 'Ekonomi & Akuntansi', count: 14 }
]

const ddcOptions = [
  { name: '000 - Karya Umum & Ensiklopedia', count: 42 },
  { name: '100 - Filsafat & Psikologi', count: 19 },
  { name: '200 - Agama & Akhlak', count: 58 },
  { name: '300 - Ilmu Sosial', count: 67 },
  { name: '400 - Bahasa & Linguistik', count: 35 },
  { name: '500 - Sains Murni', count: 94 },
  { name: '600 - Teknologi Terapan', count: 48 }
]

// Rich Mock Catalog Data (18 Koleksi Representatif Sekolah SMAN 11 Garut)
const allBooks = ref([
  {
    id: 1,
    title: 'Fisika Terapan & Mekanika Gelombang Fase F',
    author: 'Oleh Dr. Hendra Wijaya, M.Si & Tim Puskurbuk',
    fase: 'Fase F (Kelas 11 – 12)',
    faseBadge: 'Fase F • Kelas 12',
    mapel: 'Fisika',
    subjects: ['Fisika'],
    ddcGroup: '500 - Sains Murni',
    ddcBadge: 'DDC 530 Fisika Atom',
    format: 'PDF Interaktif',
    availability: ['daring', 'unduh'],
    buttonText: 'Baca Daring',
    reads: 1420,
    year: 2024,
    coverUrl: null
  },
  {
    id: 2,
    title: 'Pengantar Fisika Kuantum & Relativitas Khusus',
    author: 'Oleh Dr. Ridwan S.T., M.Sc. & Tim MGMP Fisika Garut',
    fase: 'Fase F (Kelas 11 – 12)',
    faseBadge: 'Fase F • Kelas 12',
    mapel: 'Fisika',
    subjects: ['Fisika'],
    ddcGroup: '500 - Sains Murni',
    ddcBadge: 'DDC 539 Fisika Atom',
    format: 'PDF Interaktif',
    availability: ['daring', 'unduh'],
    buttonText: 'Baca Daring',
    reads: 1180,
    year: 2024,
    coverUrl: null
  },
  {
    id: 3,
    title: 'Petunjuk Praktikum Fisika Eksperimental Berbasis IoT',
    author: 'Laboratorium Sains Terpadu SMAN 11 Garut',
    fase: 'Fase F (Kelas 11 – 12)',
    faseBadge: 'Modul Mandiri',
    mapel: 'Fisika',
    subjects: ['Fisika', 'IoT'],
    ddcGroup: '500 - Sains Murni',
    ddcBadge: 'DDC 530.7 Praktik',
    format: 'Modul Ajar Digital (PMM)',
    availability: ['daring', 'unduh'],
    buttonText: 'Buka Modul',
    reads: 950,
    year: 2024,
    coverUrl: null
  },
  {
    id: 4,
    title: 'Matematika Terapan untuk Pemodelan Fisika Lingkungan',
    author: 'Drs. Agus Supriatna, M.Pd.',
    fase: 'Fase F (Kelas 11 – 12)',
    faseBadge: 'Fase F • Kelas 11',
    mapel: 'Matematika Tingkat Lanjut',
    subjects: ['Matematika Tingkat Lanjut', 'Fisika'],
    ddcGroup: '500 - Sains Murni',
    ddcBadge: 'DDC 510 Kalkulus',
    format: 'PDF Interaktif',
    availability: ['daring'],
    buttonText: 'Baca Daring',
    reads: 890,
    year: 2023,
    coverUrl: null
  },
  {
    id: 5,
    title: 'Etnosains Priangan: Konsep Fisika dina Kearifan Lokal...',
    author: 'Dra. Hj. Neneng Rohaeti & Tim Literasi SMAN 11',
    fase: 'Fase F (Kelas 11 – 12)',
    faseBadge: 'Muatan Lokal',
    mapel: 'Fisika',
    subjects: ['Fisika', 'Muatan Lokal'],
    ddcGroup: '300 - Ilmu Sosial',
    ddcBadge: 'DDC 398 Etnosains',
    format: 'PDF Interaktif',
    availability: ['daring', 'fisik'],
    buttonText: 'Baca Daring',
    reads: 760,
    year: 2024,
    coverUrl: null
  },
  {
    id: 6,
    title: 'Astrofisika Sederhana & Mekanika Tata Surya',
    author: 'Klub Astronomi Remaja & Perpustakaan SMAN 11',
    fase: 'Fase F (Kelas 11 – 12)',
    faseBadge: 'Fase F • Pilihan',
    mapel: 'Fisika',
    subjects: ['Fisika', 'Astronomi'],
    ddcGroup: '500 - Sains Murni',
    ddcBadge: 'DDC 520 Astronomi',
    format: 'ePub Reflowable',
    availability: ['daring'],
    buttonText: 'Baca Daring',
    reads: 1310,
    year: 2024,
    coverUrl: null
  },
  {
    id: 7,
    title: 'Fisika Dasar dan Pengukuran Ilmiah Fase E',
    author: 'Pusat Perbukuan Kemendikbudristek',
    fase: 'Fase E (Kelas 10)',
    faseBadge: 'Fase E • Kelas 10',
    mapel: 'Fisika',
    subjects: ['Fisika'],
    ddcGroup: '500 - Sains Murni',
    ddcBadge: 'DDC 530 Pengukuran',
    format: 'PDF Interaktif',
    availability: ['daring', 'unduh', 'rak'],
    buttonText: 'Baca Daring',
    reads: 1540,
    year: 2023,
    coverUrl: null
  },
  {
    id: 8,
    title: 'Kimia Hijau dan Kelestarian Lingkungan Fase E',
    author: 'Tim MGMP Kimia SMAN 11 Garut',
    fase: 'Fase E (Kelas 10)',
    faseBadge: 'Fase E • Kelas 10',
    mapel: 'Kimia',
    subjects: ['Kimia'],
    ddcGroup: '500 - Sains Murni',
    ddcBadge: 'DDC 540 Kimia',
    format: 'Modul Ajar Digital (PMM)',
    availability: ['daring', 'unduh'],
    buttonText: 'Buka Modul',
    reads: 920,
    year: 2024,
    coverUrl: null
  },
  {
    id: 9,
    title: 'Biologi Sel & Rekayasa Genetika Fase F',
    author: 'Dr. Hj. Siti Maryam, M.Pd.',
    fase: 'Fase F (Kelas 11 – 12)',
    faseBadge: 'Fase F • Kelas 12',
    mapel: 'Biologi',
    subjects: ['Biologi'],
    ddcGroup: '500 - Sains Murni',
    ddcBadge: 'DDC 570 Biologi',
    format: 'PDF Interaktif',
    availability: ['daring', 'unduh', 'rak'],
    buttonText: 'Baca Daring',
    reads: 1250,
    year: 2024,
    coverUrl: null
  },
  {
    id: 10,
    title: 'Ekonomi Mikro & Pasar Modal Digital Fase F',
    author: 'Drs. H. Mamat Rahmat, M.M.',
    fase: 'Fase F (Kelas 11 – 12)',
    faseBadge: 'Fase F • Kelas 11',
    mapel: 'Ekonomi & Akuntansi',
    subjects: ['Ekonomi & Akuntansi'],
    ddcGroup: '300 - Ilmu Sosial',
    ddcBadge: 'DDC 330 Ekonomi',
    format: 'PDF Interaktif',
    availability: ['daring', 'unduh'],
    buttonText: 'Baca Daring',
    reads: 840,
    year: 2023,
    coverUrl: null
  },
  {
    id: 11,
    title: 'Pangrumat Basa Sunda Pikeun Murid SMA Kelas XI',
    author: 'Drs. Yayat Sudaryat & Tim Paguyuban Pasundan',
    fase: 'Fase F (Kelas 11 – 12)',
    faseBadge: 'Muatan Lokal',
    mapel: 'Bahasa Sunda SMA',
    subjects: ['Bahasa Sunda SMA', 'Muatan Lokal'],
    ddcGroup: '400 - Bahasa & Linguistik',
    ddcBadge: 'DDC 499 Basa Sunda',
    format: 'ePub Reflowable',
    availability: ['daring', 'rak'],
    buttonText: 'Baca Daring',
    reads: 1680,
    year: 2024,
    coverUrl: null
  },
  {
    id: 12,
    title: 'Ensiklopedia Tokoh & Sejarah Kebangsaan Garut',
    author: 'Dinas Arsip & Perpustakaan Daerah Garut',
    fase: 'Fase F (Kelas 11 – 12)',
    faseBadge: 'Referensi Umum',
    mapel: 'Umum',
    subjects: ['Sejarah', 'Ensiklopedia'],
    ddcGroup: '000 - Karya Umum & Ensiklopedia',
    ddcBadge: 'DDC 030 Ensiklopedia',
    format: 'PDF Interaktif',
    availability: ['daring', 'rak'],
    buttonText: 'Baca Daring',
    reads: 990,
    year: 2023,
    coverUrl: null
  },
  {
    id: 13,
    title: 'Pendidikan Karakter & Akhlak Mulia Berbasis Qurani',
    author: 'K.H. Anwar Musaddad Foundation',
    fase: 'Fase E (Kelas 10)',
    faseBadge: 'Fase E • Karakter',
    mapel: 'Agama',
    subjects: ['Agama & Akhlak'],
    ddcGroup: '200 - Agama & Akhlak',
    ddcBadge: 'DDC 297 Agama Islam',
    format: 'PDF Interaktif',
    availability: ['daring', 'unduh'],
    buttonText: 'Baca Daring',
    reads: 1410,
    year: 2024,
    coverUrl: null
  },
  {
    id: 14,
    title: 'Teknologi Mikrokontroler & Robotika Sederhana',
    author: 'Tim Karya Ilmiah Remaja (KIR) SMAN 11 Garut',
    fase: 'Fase F (Kelas 11 – 12)',
    faseBadge: 'Vokasi / Prakarya',
    mapel: 'Fisika',
    subjects: ['Fisika', 'Teknologi'],
    ddcGroup: '600 - Teknologi Terapan',
    ddcBadge: 'DDC 621 Elektronika',
    format: 'Modul Ajar Digital (PMM)',
    availability: ['daring', 'unduh'],
    buttonText: 'Buka Modul',
    reads: 1120,
    year: 2024,
    coverUrl: null
  },
  {
    id: 15,
    title: 'Kimia Organik & Makromolekul Fase F',
    author: 'Dra. Endang Purwaningsih, M.Si.',
    fase: 'Fase F (Kelas 11 – 12)',
    faseBadge: 'Fase F • Kelas 12',
    mapel: 'Kimia',
    subjects: ['Kimia'],
    ddcGroup: '500 - Sains Murni',
    ddcBadge: 'DDC 547 Kimia Organik',
    format: 'PDF Interaktif',
    availability: ['daring', 'unduh'],
    buttonText: 'Baca Daring',
    reads: 880,
    year: 2024,
    coverUrl: null
  },
  {
    id: 16,
    title: 'Aljabar Linear & Geometri Vektor Fase F',
    author: 'Pusat Kurikulum & Pembelajaran',
    fase: 'Fase F (Kelas 11 – 12)',
    faseBadge: 'Fase F • Kelas 11',
    mapel: 'Matematika Tingkat Lanjut',
    subjects: ['Matematika Tingkat Lanjut'],
    ddcGroup: '500 - Sains Murni',
    ddcBadge: 'DDC 512 Aljabar',
    format: 'PDF Interaktif',
    availability: ['daring', 'unduh', 'rak'],
    buttonText: 'Baca Daring',
    reads: 1330,
    year: 2024,
    coverUrl: null
  },
  {
    id: 17,
    title: 'Filsafat Ilmu & Logika Berpikir Kritis',
    author: 'Prof. Dr. Jujun S. Suriasumantri',
    fase: 'Fase F (Kelas 11 – 12)',
    faseBadge: 'Pustaka Pengayaan',
    mapel: 'Umum',
    subjects: ['Filsafat'],
    ddcGroup: '100 - Filsafat & Psikologi',
    ddcBadge: 'DDC 100 Filsafat',
    format: 'ePub Reflowable',
    availability: ['daring'],
    buttonText: 'Baca Daring',
    reads: 670,
    year: 2022,
    coverUrl: null
  },
  {
    id: 18,
    title: 'Ekologi & Keanekaragaman Hayati Gunung Guntur',
    author: 'Tim Ekologi SMAN 11 Garut',
    fase: 'Fase E (Kelas 10)',
    faseBadge: 'Fase E • Lingkungan',
    mapel: 'Biologi',
    subjects: ['Biologi'],
    ddcGroup: '500 - Sains Murni',
    ddcBadge: 'DDC 577 Ekologi',
    format: 'PDF Interaktif',
    availability: ['daring', 'rak'],
    buttonText: 'Baca Daring',
    reads: 940,
    year: 2023,
    coverUrl: null
  }
])

// Computed Active Filters Check
const hasActiveFilters = computed(() => {
  return searchQuery.value.trim() !== '' ||
    filters.fase.length > 0 ||
    filters.mapel.length > 0 ||
    filters.ddc.length > 0 ||
    filters.format.length > 0 ||
    filters.availability.length > 0
})

// Active Fase Label for Banner
const activeFaseLabel = computed(() => {
  if (filters.fase.length === 1) {
    return filters.fase[0].includes('Fase F') ? 'Fase F' : 'Fase E'
  } else if (filters.fase.length > 1) {
    return 'Fase E & F'
  }
  return 'Semua Fase'
})

// REAL COMPUTED FILTERING LOGIC
const filteredBooks = computed(() => {
  let list = allBooks.value.filter(book => {
    // 1. Text Search Filter
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      const inTitle = book.title.toLowerCase().includes(q)
      const inAuthor = book.author.toLowerCase().includes(q)
      const inDdc = book.ddcBadge.toLowerCase().includes(q) || book.ddcGroup.toLowerCase().includes(q)
      const inFase = book.faseBadge.toLowerCase().includes(q)
      const inMapel = book.mapel.toLowerCase().includes(q)
      const inSubjects = book.subjects ? book.subjects.some(s => s.toLowerCase().includes(q)) : false

      // Match multi-term if user types "Fisika Modern"
      const terms = q.split(' ').filter(Boolean)
      const matchesAllTerms = terms.length > 1
        ? terms.every(t => 
            book.title.toLowerCase().includes(t) ||
            book.author.toLowerCase().includes(t) ||
            book.mapel.toLowerCase().includes(t) ||
            (book.subjects && book.subjects.some(s => s.toLowerCase().includes(t))) ||
            book.ddcBadge.toLowerCase().includes(t) ||
            (t === 'modern' && book.id <= 6) // contextual synonym mapping for mock
          )
        : false

      if (!inTitle && !inAuthor && !inDdc && !inFase && !inMapel && !inSubjects && !matchesAllTerms) {
        return false
      }
    }

    // 2. Filter Fase
    if (filters.fase.length > 0) {
      if (!filters.fase.includes(book.fase)) {
        return false
      }
    }

    // 3. Filter Mata Pelajaran
    if (filters.mapel.length > 0) {
      const matchMapel = filters.mapel.includes(book.mapel) ||
                         (book.subjects && book.subjects.some(s => filters.mapel.includes(s)))
      if (!matchMapel) {
        return false
      }
    }

    // 4. Filter DDC
    if (filters.ddc.length > 0) {
      if (!filters.ddc.includes(book.ddcGroup)) {
        return false
      }
    }

    // 5. Filter Format
    if (filters.format.length > 0) {
      if (!filters.format.includes(book.format)) {
        return false
      }
    }

    // 6. Filter Ketersediaan
    if (filters.availability.length > 0) {
      const hasAvailability = filters.availability.some(av => book.availability.includes(av))
      if (!hasAvailability) {
        return false
      }
    }

    return true
  })

  // SORTING LOGIC
  if (sortBy.value === 'populer') {
    list.sort((a, b) => b.reads - a.reads)
  } else if (sortBy.value === 'terbaru') {
    list.sort((a, b) => b.year - a.year || b.id - a.id)
  } else if (sortBy.value === 'judul') {
    list.sort((a, b) => a.title.localeCompare(b.title))
  }

  return list
})

// Pagination Computed
const totalPages = computed(() => {
  return Math.ceil(filteredBooks.value.length / perPage) || 1
})

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredBooks.value.slice(start, start + perPage)
})

const startItemIndex = computed(() => {
  if (filteredBooks.value.length === 0) return 0
  return (currentPage.value - 1) * perPage + 1
})

const endItemIndex = computed(() => {
  return Math.min(currentPage.value * perPage, filteredBooks.value.length)
})

// Watch filters to auto-reset pagination to page 1
watch([searchQuery, filters, sortBy], () => {
  currentPage.value = 1
}, { deep: true })

// Action Handlers
const selectQuickTag = (tag) => {
  if (tag === 'Fisika Fase F') {
    searchQuery.value = 'Fisika'
    filters.fase = ['Fase F (Kelas 11 – 12)']
    filters.mapel = ['Fisika']
    filters.ddc = ['500 - Sains Murni']
  } else if (tag === 'Bahasa Sunda SMA') {
    searchQuery.value = 'Basa Sunda'
    filters.fase = ['Fase F (Kelas 11 – 12)']
    filters.ddc = ['400 - Bahasa & Linguistik']
    filters.mapel = []
    filters.format = []
  } else if (tag === 'DDC 500 Sains Murni') {
    searchQuery.value = ''
    filters.ddc = ['500 - Sains Murni']
    filters.mapel = []
  } else if (tag === 'Modul Ajar Kimia') {
    searchQuery.value = 'Kimia'
    filters.mapel = ['Kimia']
    filters.format = ['Modul Ajar Digital (PMM)']
  } else {
    searchQuery.value = tag
  }
}

const handleSearch = () => {
  currentPage.value = 1
}

const removeFilter = (type, val) => {
  const arr = filters[type]
  const idx = arr.indexOf(val)
  if (idx !== -1) {
    arr.splice(idx, 1)
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  filters.fase = []
  filters.mapel = []
  filters.ddc = []
  filters.format = []
  filters.availability = []
  sortBy.value = 'populer'
  currentPage.value = 1
}

const applyFilters = () => {
  currentPage.value = 1
}

const openBook = (buku) => {
  router.push(`/buku/${buku.id}`)
}

// Modal Barcode Scanner
const isScanModalOpen = ref(false)
const manualBarcode = ref('')

const openScanModal = () => {
  isScanModalOpen.value = true
  manualBarcode.value = ''
}

const submitManualBarcode = () => {
  if (manualBarcode.value.trim()) {
    searchQuery.value = manualBarcode.value.trim()
    isScanModalOpen.value = false
  }
}
</script>

<style scoped>
/* Scoped styles */
</style>
