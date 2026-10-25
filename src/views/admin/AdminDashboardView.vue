<template>
  <div class="min-h-screen bg-[#F8FAFC] text-slate-800 p-4 sm:p-6 lg:p-8 font-sans select-none">
    <div class="max-w-[1400px] mx-auto space-y-6">

      <!-- 1. Top Bar Minimalis (Label Admin + Avatar Lingkaran Hitam) -->
      <header class="flex items-center justify-between pb-1">
        <div class="flex items-center gap-2">
          <span class="text-sm font-semibold text-slate-800 tracking-tight">Admin</span>
          <div class="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <!-- User Icon -->
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>

        <!-- Quick Status Indicator -->
        <div class="text-[11px] font-medium text-slate-400 hidden sm:flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Sistem Manajemen Perpustakaan Terpadu • SMAN 11 Garut</span>
        </div>
      </header>

      <!-- 2. Profile Banner (Dark Navy Theme) -->
      <section class="w-full bg-[#0F1E2E] rounded-3xl p-5 sm:p-6 shadow-md border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden">
        <!-- Subtle Glow Effect -->
        <div class="absolute -right-12 -top-12 w-64 h-64 bg-[#005B70]/20 rounded-full blur-3xl pointer-events-none"></div>

        <!-- Left Profile Info -->
        <div class="flex items-center gap-4 z-10">
          <!-- Profile Card Avatar dengan status dot hijau -->
          <div class="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white p-1 border border-slate-200/40 shadow-sm flex items-center justify-center shrink-0">
            <!-- School Emblem / Avatar Gambar -->
            <img 
              :src="schoolLogo" 
              alt="Avatar Dra. Hj. Ratna Juwita, M.Pd" 
              class="w-full h-full object-contain"
            />
            <!-- Titik Hijau Status Intranet Aktif -->
            <span class="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0F1E2E]" title="Status Intranet Aktif"></span>
          </div>

          <!-- Name, Badge & Details -->
          <div class="flex flex-col">
            <div class="flex flex-wrap items-center gap-2.5">
              <h1 class="text-white font-bold text-base sm:text-lg lg:text-xl tracking-tight">
                Dra. Hj. Ratna Juwita, M.Pd
              </h1>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-white/10 text-white border border-white/20">
                ADMINISTRATOR RESMI
              </span>
            </div>
            
            <div class="flex flex-wrap items-center gap-2 mt-1 text-slate-300 text-xs">
              <span class="text-slate-300">NIP. 19740512 199802 2 004 • Kepala Unit Perpustakaan SMAN 11 Garut</span>
              <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Intranet Aktif
              </span>
            </div>
          </div>
        </div>

        <!-- Right Action Button: Ganti Akun / Peran -->
        <div class="z-10 shrink-0">
          <button 
            type="button" 
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/5 border border-white/15 text-white text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-xs"
            @click="handleLogout"
          >
            <!-- Shield Lock Icon -->
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M12 11v4" />
              <circle cx="12" cy="8" r="1" />
            </svg>
            <span>Ganti Akun / Peran</span>
          </button>
        </div>
      </section>

      <!-- 3. Top Stat Cards (3 Grid Metric Box) -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <!-- Card 1: Total Judul Terkatalog -->
        <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-500">Total Judul Terkatalog</span>
            <!-- Book Icon -->
            <svg class="w-6 h-6 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <div class="mt-4">
            <span class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">4.820</span>
          </div>
        </div>

        <!-- Card 2: Unduhan Hari Ini -->
        <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-500">Unduhan Hari Ini</span>
            <!-- Download Circle Icon -->
            <div class="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">342</span>
          </div>
        </div>

        <!-- Card 3: Pengunjung Hari Ini -->
        <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-500">Pengunjung Hari Ini</span>
            <!-- User Group Icon -->
            <div class="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-baseline">
            <span class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">158</span>
            <span class="text-xs font-semibold text-slate-500 ml-2">Siswa aktif</span>
          </div>
        </div>

      </section>

      <!-- 4. Layar Utama 2 Kolom (Manajemen Koleksi vs Form Unggah) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- KOLOM KIRI: Manajemen Koleksi Buku Perpustakaan (8 Col) -->
        <div class="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] space-y-5">
          
          <!-- Top Row Header + Search & Filter -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-start gap-3">
              <!-- Archive / Collection Icon -->
              <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <div>
                <h2 class="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Manajemen Koleksi Buku Perpustakaan
                </h2>
                <p class="text-xs text-slate-400 mt-0.5">
                  Pantau status edaran materi ajar digital & konvensional SMAN 11 Garut
                </p>
              </div>
            </div>

            <!-- Search Input & Filter Button -->
            <div class="flex items-center gap-2">
              <div class="relative w-full sm:w-60">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Cari judul, ISBN, mapel..."
                  class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005B70] focus:bg-white transition-all"
                />
              </div>

              <!-- Filter Button -->
              <button
                type="button"
                class="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                @click="showFilterModal = !showFilterModal"
              >
                <svg class="w-3.5 h-3.5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <line x1="20" y1="12" x2="20" y2="3" />
                  <line x1="1" y1="14" x2="7" y2="14" />
                  <line x1="9" y1="8" x2="15" y2="8" />
                  <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
                <span>Filter</span>
              </button>
            </div>
          </div>

          <!-- Category Filter Pills (Horizontal Scrollable) -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin">
            <button
              v-for="cat in categoryFilters"
              :key="cat.id"
              type="button"
              :class="[
                'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100/80 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              ]"
              @click="activeCategory = cat.id"
            >
              {{ cat.label }} ({{ cat.count }})
            </button>
          </div>

          <!-- Notification Toast (Success/Delete Feedback) -->
          <div 
            v-if="tableNotification" 
            class="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center justify-between"
          >
            <span>{{ tableNotification }}</span>
            <button @click="tableNotification = ''" class="text-emerald-500 hover:text-emerald-800 font-bold ml-2">✕</button>
          </div>

          <!-- Data Table Koleksi -->
          <div class="overflow-x-auto rounded-2xl border border-slate-100">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  <th class="py-3 px-3.5 w-16 text-center">KOVER</th>
                  <th class="py-3 px-3.5">JUDUL & ISBN</th>
                  <th class="py-3 px-3.5">KATEGORI / MAPEL</th>
                  <th class="py-3 px-3.5">PENERBIT</th>
                  <th class="py-3 px-3.5 text-center">FORMAT</th>
                  <th class="py-3 px-3.5 text-center w-20">AKSI</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-xs">
                <tr 
                  v-for="buku in filteredBukuList" 
                  :key="buku.id"
                  class="hover:bg-slate-50/50 transition-colors group"
                >
                  <!-- Kover -->
                  <td class="py-3 px-3.5 text-center align-middle">
                    <div class="w-10 h-14 rounded-md overflow-hidden shadow-xs border border-slate-200 mx-auto flex items-center justify-center bg-slate-100">
                      <!-- Render Cover dengan Style Sesuai Desain Figma -->
                      <div 
                        v-if="!buku.coverImage" 
                        :class="['w-full h-full flex flex-col justify-between p-1 text-[7px] text-white font-bold leading-none', buku.coverGradient]"
                      >
                        <span class="opacity-80">SMAN 11</span>
                        <div class="my-auto text-[8px] uppercase line-clamp-2 leading-tight">
                          {{ buku.shortTitle }}
                        </div>
                        <span class="text-[6px] opacity-75">{{ buku.formatType }}</span>
                      </div>
                      <img 
                        v-else 
                        :src="buku.coverImage" 
                        :alt="buku.title" 
                        class="w-full h-full object-cover"
                      />
                    </div>
                  </td>

                  <!-- Judul & ISBN & Penulis -->
                  <td class="py-3 px-3.5 align-middle">
                    <div class="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-[#005B70] transition-colors line-clamp-1">
                      {{ buku.title }}
                    </div>
                    <div class="text-[11px] text-slate-500 font-mono mt-0.5">
                      ISBN: {{ buku.isbn }}
                    </div>
                    <div class="text-[11px] text-slate-600 font-medium mt-0.5">
                      Penulis: {{ buku.author }}
                    </div>
                  </td>

                  <!-- Kategori / Mapel Badge -->
                  <td class="py-3 px-3.5 align-middle">
                    <span :class="['inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap', buku.categoryBadgeClass]">
                      {{ buku.categoryName }}
                    </span>
                  </td>

                  <!-- Penerbit -->
                  <td class="py-3 px-3.5 align-middle text-slate-600 font-medium text-xs">
                    {{ buku.publisher }}
                  </td>

                  <!-- Format Badge -->
                  <td class="py-3 px-3.5 align-middle text-center">
                    <span :class="['inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold whitespace-nowrap', buku.formatBadgeClass]">
                      <!-- File format icon -->
                      <svg v-if="buku.formatType === 'PDF'" class="w-3 h-3 text-rose-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <svg v-else class="w-3 h-3 text-sky-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                      <span>{{ buku.formatLabel }}</span>
                    </span>
                  </td>

                  <!-- Aksi: Edit & Delete -->
                  <td class="py-3 px-3.5 align-middle text-center">
                    <div class="flex items-center justify-center gap-2">
                      <!-- Edit Icon Button -->
                      <button 
                        type="button" 
                        class="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Sunting data buku"
                        @click="handleEditBook(buku)"
                      >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>

                      <!-- Delete Icon Button -->
                      <button 
                        type="button" 
                        class="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus buku dari repositori"
                        @click="handleDeleteBook(buku)"
                      >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>

                <!-- Empty state if search returns nothing -->
                <tr v-if="filteredBukuList.length === 0">
                  <td colspan="6" class="py-8 text-center text-slate-400">
                    Tidak ada judul buku yang cocok dengan pencarian "{{ searchQuery }}".
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Footer Sesuai Figma -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-500">
            <div>
              Menampilkan {{ filteredBukuList.length }} dari 4.820 dokumen digital
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

              <!-- Page 1 (Active) -->
              <button type="button" class="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center cursor-pointer shadow-xs">
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

              <!-- Page 121 -->
              <button type="button" class="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 font-medium flex items-center justify-center cursor-pointer">
                121
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

        </div>

        <!-- KOLOM KANAN: Form Unggah Buku Baru (4 Col) -->
        <div class="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] space-y-4">
          
          <!-- Header Form -->
          <div class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="12" y2="12" />
                <line x1="15" y1="15" x2="12" y2="12" />
              </svg>
            </div>
            <div>
              <h2 class="text-base font-bold text-slate-900 tracking-tight">Unggah Buku Baru</h2>
              <p class="text-[11px] text-slate-400 leading-snug mt-0.5">
                Tambahkan koleksi e-book atau modul ajar resmi ke repositori perpustakaan digital.
              </p>
            </div>
          </div>

          <form @submit.prevent="handleSubmitBook" class="space-y-3.5 pt-1">
            
            <!-- 1. Berkas Buku Dropzone (PDF / ePub)* -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                Berkas Buku (PDF / ePub)*
              </label>
              <div 
                class="border-2 border-dashed border-sky-200 bg-sky-50/50 hover:bg-sky-50 rounded-2xl p-4 text-center cursor-pointer transition-colors relative"
                @click="triggerFileInput"
              >
                <!-- Cloud Upload Icon -->
                <svg class="w-8 h-8 text-slate-700 mx-auto mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                  <path d="M12 12v9" />
                  <path d="m16 16-4-4-4 4" />
                </svg>
                <div class="text-xs font-bold text-slate-800">
                  {{ uploadedFileName || 'Tarik & lepas file ke sini' }}
                </div>
                <div class="text-[10px] text-slate-400 mt-0.5">
                  Maks. 250 MB per dokumen (PDF, EPUB)
                </div>
                <input 
                  ref="fileInputRef" 
                  type="file" 
                  accept=".pdf,.epub" 
                  class="hidden" 
                  @change="handleFileUpload"
                />
              </div>
            </div>

            <!-- 2. Grid Kover Buku & Nomor ISBN + Format Berkas -->
            <div class="grid grid-cols-2 gap-3 items-start">
              <!-- Left: Kover Buku (JPG/PNG) Dropzone Small -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">
                  Kover Buku (JPG/PNG)
                </label>
                <div 
                  class="h-[88px] bg-sky-50/40 border border-slate-200/90 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-sky-50 transition-colors text-slate-400 hover:text-slate-600"
                  @click="triggerCoverInput"
                >
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span class="text-[10px] mt-1 text-slate-400">Pilih Kover</span>
                  <input 
                    ref="coverInputRef" 
                    type="file" 
                    accept="image/png,image/jpeg" 
                    class="hidden" 
                    @change="handleCoverUpload"
                  />
                </div>
              </div>

              <!-- Right: Nomor ISBN & Format Berkas -->
              <div class="space-y-2">
                <div>
                  <label class="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Nomor ISBN*
                  </label>
                  <input
                    v-model="newBook.isbn"
                    type="text"
                    required
                    placeholder="Contoh: 978-602-..."
                    class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005B70] focus:bg-white transition-all font-mono"
                  />
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Format Berkas
                  </label>
                  <select
                    v-model="newBook.format"
                    class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#005B70] focus:bg-white transition-all cursor-pointer font-medium"
                  >
                    <option value="PDF E-Book">PDF E-Book</option>
                    <option value="ePub Digital">ePub Digital</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 3. Judul Buku Lengkap* -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">
                Judul Buku Lengkap*
              </label>
              <input
                v-model="newBook.title"
                type="text"
                required
                placeholder="Misal: Sosiologi Terapan Fase E SMAN 11"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005B70] focus:bg-white transition-all font-medium"
              />
            </div>

            <!-- 4. Penulis / Pengarang* & Penerbit* (2 Grid Row) -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">
                  Penulis / Pengarang*
                </label>
                <input
                  v-model="newBook.author"
                  type="text"
                  required
                  placeholder="Nama penulis / Tim MGMP..."
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005B70] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">
                  Penerbit*
                </label>
                <input
                  v-model="newBook.publisher"
                  type="text"
                  required
                  placeholder="Kemdikbud / Erlangga /..."
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005B70] focus:bg-white transition-all"
                />
              </div>
            </div>

            <!-- 5. Kategori Kurikulum / Klasifikasi DDC* -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">
                Kategori Kurikulum / Klasifikasi DDC*
              </label>
              <select
                v-model="newBook.category"
                required
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#005B70] focus:bg-white transition-all cursor-pointer font-medium"
              >
                <option value="Kurikulum Merdeka - Fase F (Kelas XI & XII)">Kurikulum Merdeka - Fase F (Kelas XI & XII)</option>
                <option value="Kurikulum Merdeka - Fase E (Kelas X)">Kurikulum Merdeka - Fase E (Kelas X)</option>
                <option value="Sains & Matematika Terapan">Sains & Matematika Terapan</option>
                <option value="Sosial, Humaniora & Bahasa">Sosial, Humaniora & Bahasa</option>
                <option value="Literasi & Budaya Sunda">Literasi & Budaya Sunda</option>
              </select>
            </div>

            <!-- 6. Sinopsis Ringkas -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">
                Sinopsis Ringkas
              </label>
              <textarea
                v-model="newBook.synopsis"
                rows="2"
                placeholder="Deskripsikan garis besar materi pembelajaran atau ikhtisar isi buku..."
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005B70] focus:bg-white transition-all resize-none"
              ></textarea>
            </div>

            <!-- 7. Action Buttons (Terbitkan & Reset) -->
            <div class="flex items-center gap-2 pt-2">
              <button
                type="submit"
                class="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <!-- Send / Publish Icon -->
                <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 19V5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
                <span>Terbitkan</span>
              </button>

              <button
                type="button"
                class="py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                @click="resetForm"
              >
                Reset
              </button>
            </div>

          </form>

        </div>

      </div>

      <!-- 5. Bottom Section: Status Server Intranet & Riwayat Sirkulasi Terkini -->
      <section class="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] space-y-4">
        
        <!-- Header Sub-section -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <!-- Server / Network Icon -->
            <div class="text-[#005B70]">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                <line x1="6" y1="6" x2="6.01" y2="6" />
                <line x1="6" y1="18" x2="6.01" y2="18" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900 tracking-tight">
                Status Server Intranet &amp; Riwayat Sirkulasi Terkini
              </h3>
              <p class="text-xs text-slate-400">
                Sinkronisasi lokal lab komputer SMA Negeri 11 Garut (Node 192.168.10.25)
              </p>
            </div>
          </div>

          <!-- Status Badge -->
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold w-fit">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Status: Normal (Ping 4ms)</span>
          </div>
        </div>

        <!-- 3 Grid Footer Status Box -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          
          <!-- Box 1: BUKU TERPOPULER HARI INI -->
          <div class="bg-[#EEF5FA] rounded-2xl p-4 border border-slate-100/80 flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                BUKU TERPOPULER HARI INI
              </span>
              <!-- Trending Up Icon -->
              <svg class="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
            <div class="mt-2">
              <div class="text-xs font-bold text-slate-900 leading-tight">
                Fisika Terapan Kelas XI: Gelombang &amp; Optika
              </div>
              <div class="text-[11px] text-sky-600 font-medium mt-1">
                94 unduhan siswa • Lab IPA 1 &amp; 2
              </div>
            </div>
          </div>

          <!-- Box 2: PENGURUS BERTUGAS -->
          <div class="bg-[#EEF5FA] rounded-2xl p-4 border border-slate-100/80 flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                PENGURUS BERTUGAS
              </span>
              <!-- ID Card Icon -->
              <svg class="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <circle cx="9" cy="10" r="2" />
                <line x1="15" y1="8" x2="17" y2="8" />
                <line x1="15" y1="12" x2="17" y2="12" />
              </svg>
            </div>
            <div class="mt-2">
              <div class="text-xs font-bold text-slate-900 leading-tight">
                Agus Kurnia, S.Kom (Teknisi Lab)
              </div>
              <div class="text-[11px] text-slate-400 font-normal mt-1">
                Sesi Piket: 07.30 - 15.30 WIB
              </div>
            </div>
          </div>

          <!-- Box 3: KAPASITAS PENYIMPANAN -->
          <div class="bg-[#EEF5FA] rounded-2xl p-4 border border-slate-100/80 flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                KAPASITAS PENYIMPANAN
              </span>
              <!-- Disk / Hard drive icon -->
              <svg class="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="12" x2="2" y2="12" />
                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                <line x1="6" y1="16" x2="6.01" y2="16" />
                <line x1="10" y1="16" x2="10.01" y2="16" />
              </svg>
            </div>
            <div class="mt-2">
              <div class="text-xs font-bold text-slate-900 leading-tight">
                348.6 GB Bebas / 1.000 GB SSD
              </div>
              <!-- Progress Bar -->
              <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                <div class="h-full bg-slate-900 rounded-full" style="width: 65%;"></div>
              </div>
            </div>
          </div>

        </div>

      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import schoolLogo from '../../assets/images/placeholders/logo-sman11.svg'

const router = useRouter()

// 1. Search & Filter State
const searchQuery = ref('')
const activeCategory = ref('all')
const showFilterModal = ref(false)
const tableNotification = ref('')

// File Upload References
const fileInputRef = ref(null)
const coverInputRef = ref(null)
const uploadedFileName = ref('')
const uploadedCoverName = ref('')

// Category Filter Tabs
const categoryFilters = [
  { id: 'all', label: 'Semua Koleksi', count: '4.820' },
  { id: 'merdeka', label: 'Kurikulum Merdeka', count: '1.240' },
  { id: 'sains', label: 'Sains & Matematika', count: '980' },
  { id: 'sosial', label: 'Sosial & Bahasa', count: '850' },
  { id: 'fiksi', label: 'Fiksi & Literasi', count: '720' }
]

// 2. Mock Data Koleksi Buku (Sesuai Persis Tampilan Tabel Figma)
const bukuList = ref([
  {
    id: 1,
    title: 'Fisika Terapan Kelas XI: Gelombang & Optika',
    shortTitle: 'Fisika Terapan',
    isbn: '978-602-244-789-2',
    author: 'Bambang Haryadi, M.Si',
    categoryKey: 'sains',
    categoryName: 'Fase F • Fisika',
    categoryBadgeClass: 'bg-blue-100/70 text-blue-700',
    publisher: 'Kemendikbudristek RI',
    formatType: 'PDF',
    formatLabel: 'PDF (14 MB)',
    formatBadgeClass: 'bg-rose-50 text-rose-600 border border-rose-100',
    coverGradient: 'bg-gradient-to-br from-blue-700 to-indigo-900'
  },
  {
    id: 2,
    title: 'Biologi Interaktif: Keanekaragaman Hayati',
    shortTitle: 'Biologi Interaktif',
    isbn: '978-623-112-004-9',
    author: 'Tim MGMP Biologi Garut',
    categoryKey: 'sains',
    categoryName: 'Fase E • Biologi',
    categoryBadgeClass: 'bg-emerald-100/70 text-emerald-700',
    publisher: 'Pustaka Mandiri SMAN 11',
    formatType: 'ePub',
    formatLabel: 'ePub (6.2 MB)',
    formatBadgeClass: 'bg-sky-50 text-sky-600 border border-sky-100',
    coverGradient: 'bg-gradient-to-br from-emerald-600 to-teal-800'
  },
  {
    id: 3,
    title: 'Matematika Tingkat Lanjut Kelas XI',
    shortTitle: 'Matematika',
    isbn: '978-602-427-915-8',
    author: 'Al Azhary Masta, M.Si',
    categoryKey: 'sains',
    categoryName: 'Fase F • Matematika',
    categoryBadgeClass: 'bg-indigo-100/70 text-indigo-700',
    publisher: 'Pusat Kurikulum & Perbukuan',
    formatType: 'PDF',
    formatLabel: 'PDF (22 MB)',
    formatBadgeClass: 'bg-rose-50 text-rose-600 border border-rose-100',
    coverGradient: 'bg-gradient-to-br from-slate-600 to-slate-900'
  },
  {
    id: 4,
    title: 'Antologi Cerita Rakyat & Babad Priangan',
    shortTitle: 'Antologi Cerita',
    isbn: '978-979-419-556-3',
    author: 'Drs. H. Cecep Rustandi',
    categoryKey: 'fiksi',
    categoryName: 'Literasi • Budaya Sunda',
    categoryBadgeClass: 'bg-amber-100/70 text-amber-800',
    publisher: 'Penerbit Kiblat Buku Utama',
    formatType: 'ePub',
    formatLabel: 'ePub (4.8 MB)',
    formatBadgeClass: 'bg-sky-50 text-sky-600 border border-sky-100',
    coverGradient: 'bg-gradient-to-br from-amber-700 to-yellow-900'
  }
])

// 3. Computed Filtered Table
const filteredBukuList = computed(() => {
  return bukuList.value.filter(buku => {
    // Filter Category
    const matchCat = activeCategory.value === 'all' || 
      buku.categoryKey === activeCategory.value ||
      (activeCategory.value === 'merdeka' && buku.categoryName.includes('Fase'))
    
    // Filter Search Text
    const q = searchQuery.value.trim().toLowerCase()
    const matchSearch = !q || 
      buku.title.toLowerCase().includes(q) ||
      buku.isbn.toLowerCase().includes(q) ||
      buku.author.toLowerCase().includes(q) ||
      buku.categoryName.toLowerCase().includes(q)

    return matchCat && matchSearch
  })
})

// 4. Form Unggah Buku Baru (Reactive Model)
const newBook = reactive({
  isbn: '',
  title: '',
  author: '',
  publisher: '',
  format: 'PDF E-Book',
  category: 'Kurikulum Merdeka - Fase F (Kelas XI & XII)',
  synopsis: ''
})

// Trigger File Inputs
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileUpload = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    uploadedFileName.value = file.name
  }
}

const triggerCoverInput = () => {
  coverInputRef.value?.click()
}

const handleCoverUpload = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    uploadedCoverName.value = file.name
  }
}

// Submit Form Unggah
const handleSubmitBook = () => {
  if (!newBook.title || !newBook.isbn) return

  const isPdf = newBook.format.includes('PDF')
  
  const createdBook = {
    id: Date.now(),
    title: newBook.title,
    shortTitle: newBook.title.split(' ')[0] || 'Buku Baru',
    isbn: newBook.isbn,
    author: newBook.author || 'Pendidik SMAN 11 Garut',
    categoryKey: 'merdeka',
    categoryName: newBook.category.includes('Fase F') ? 'Fase F • Baru' : 'Fase E • Umum',
    categoryBadgeClass: 'bg-blue-100/70 text-blue-700',
    publisher: newBook.publisher || 'SMAN 11 Garut Press',
    formatType: isPdf ? 'PDF' : 'ePub',
    formatLabel: isPdf ? 'PDF (12 MB)' : 'ePub (5.1 MB)',
    formatBadgeClass: isPdf 
      ? 'bg-rose-50 text-rose-600 border border-rose-100' 
      : 'bg-sky-50 text-sky-600 border border-sky-100',
    coverGradient: 'bg-gradient-to-br from-teal-700 to-slate-900'
  }

  // Masukkan ke urutan paling atas tabel
  bukuList.value.unshift(createdBook)
  tableNotification.value = `Buku "${newBook.title}" berhasil diterbitkan ke repositori!`

  // Reset form
  resetForm()

  setTimeout(() => {
    tableNotification.value = ''
  }, 4000)
}

// Reset Form
const resetForm = () => {
  newBook.isbn = ''
  newBook.title = ''
  newBook.author = ''
  newBook.publisher = ''
  newBook.format = 'PDF E-Book'
  newBook.category = 'Kurikulum Merdeka - Fase F (Kelas XI & XII)'
  newBook.synopsis = ''
  uploadedFileName.value = ''
  uploadedCoverName.value = ''
}

// Action: Edit & Delete Book
const handleEditBook = (buku) => {
  newBook.isbn = buku.isbn
  newBook.title = buku.title
  newBook.author = buku.author
  newBook.publisher = buku.publisher
  tableNotification.value = `Memuat data "${buku.title}" ke form sunting di sebelah kanan.`
}

const handleDeleteBook = (buku) => {
  if (confirm(`Hapus "${buku.title}" dari katalog perpustakaan digital?`)) {
    bukuList.value = bukuList.value.filter(item => item.id !== buku.id)
    tableNotification.value = `Buku "${buku.title}" telah dihapus.`
  }
}

// Handle Logout / Ganti Akun / Peran
const handleLogout = () => {
  localStorage.removeItem('auth_role')
  localStorage.removeItem('auth_user')
  router.push('/login')
}
</script>

<style scoped>
/* Custom subtle scrollbar for category pills */
.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #CBD5E1;
  border-radius: 9999px;
}
</style>
