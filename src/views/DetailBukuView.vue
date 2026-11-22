<template>
  <div class="space-y-10 pb-12 text-slate-800">

    <!-- Loading -->
    <div v-if="state === 'loading'" class="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse" aria-busy="true">
      <div class="lg:col-span-4">
        <div class="w-full aspect-[3/4] rounded-3xl bg-slate-100"></div>
      </div>
      <div class="lg:col-span-8 space-y-4">
        <div class="h-4 w-1/3 rounded bg-slate-100"></div>
        <div class="h-8 w-4/5 rounded bg-slate-100"></div>
        <div class="h-4 w-1/2 rounded bg-slate-100"></div>
        <div class="h-24 rounded-2xl bg-slate-100"></div>
        <div class="h-40 rounded-2xl bg-slate-100"></div>
      </div>
    </div>

    <!-- Tidak ditemukan (404: tidak ada, terhapus, atau STAFF untuk anonim) -->
    <StateBlock
      v-else-if="state === 'notFound'"
      state="empty"
      title="Buku tidak ditemukan"
      message="Buku ini tidak tersedia atau sudah dihapus dari perpustakaan."
    >
      <router-link
        to="/"
        class="inline-block mt-1 px-4 py-2 rounded-xl bg-[#005B70] hover:bg-[#004859] text-white text-xs font-bold transition-colors"
      >
        Kembali ke Katalog
      </router-link>
    </StateBlock>

    <!-- Error lain -->
    <StateBlock
      v-else-if="state === 'error'"
      state="error"
      title="Gagal memuat buku"
      :message="loadError"
      @retry="loadBook"
    />

    <template v-else-if="book">
      <!-- 1. TOP NAVIGATION BREADCRUMB -->
      <nav class="flex items-center gap-2 text-xs text-slate-500 pt-1 min-w-0" aria-label="Breadcrumb">
        <router-link to="/" class="hover:text-[#005B70] flex items-center gap-1.5 font-medium transition-colors shrink-0">
          <svg class="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Katalog Utama</span>
        </router-link>

        <template v-if="book.categoryName">
          <svg class="w-3 h-3 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <router-link
            :to="{ name: 'Kategori', query: { categoryId: String(book.categoryId) } }"
            class="hover:text-[#005B70] font-medium transition-colors shrink-0"
          >
            {{ book.categoryName }}
          </router-link>
        </template>

        <svg class="w-3 h-3 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>

        <span class="font-bold text-[#005B70] truncate">
          {{ book.title }}
        </span>
      </nav>

      <!-- 2. SECTION 1: HEADER DETAIL BUKU (GRID 2 KOLOM) -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <!-- Kolom Kiri: Cover & Info Cards (4 Cols) -->
        <div class="lg:col-span-4 space-y-4">

          <!-- Large Book Cover Container (Aspect 3:4) -->
          <div class="bg-white rounded-3xl p-3 border border-slate-200/80 shadow-2xs">
            <div class="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xs border border-slate-200/90 bg-slate-900 flex flex-col justify-between p-3 text-white">
              <BookCover :book="book" />

              <!-- Floating Top Badges -->
              <div class="relative z-10 flex flex-col gap-1.5 self-start">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-[#0B4A5C] text-white shadow-xs">
                  {{ labelFor(BOOK_TYPE_LABELS, book.bookType) }}
                </span>
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-semibold text-cyan-100 bg-black/40 border border-cyan-400/30 shadow-xs">
                  {{ labelFor(GRADE_LABELS, book.gradeLevel) }}
                </span>
              </div>

              <!-- Bottom Floating Tag -->
              <div class="relative z-10 self-center">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-white/90 text-slate-800 shadow-md">
                  <span>{{ formatBytes(book.fileSize) }} • {{ extension }}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Sub-card 1: Informasi Berkas -->
          <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-2.5">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-sky-50 text-[#005B70] flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <h4 class="text-xs font-bold text-slate-800 leading-tight">Informasi Berkas</h4>
              </div>

              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0">
                {{ formatNumber(book.downloadCount) }}× diunduh
              </span>
            </div>

            <div class="text-[11px] pt-1 border-t border-slate-100 space-y-1">
              <p class="text-slate-600 break-all">{{ book.originalName }}</p>
              <p class="text-slate-400">{{ extension }} • {{ formatBytes(book.fileSize) }}</p>
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
                <p class="text-[11px] text-slate-400 mt-0.5">Format APA</p>
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
        <div class="lg:col-span-8 space-y-6 min-w-0">

          <!-- Top Badges -->
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
              {{ labelFor(BOOK_TYPE_LABELS, book.bookType) }}
            </span>
            <span v-if="book.categoryName" class="px-3 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/80">
              {{ book.categoryName }}
            </span>
            <span v-if="book.curriculum" class="px-3 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {{ book.curriculum }}
            </span>
            <span v-if="book.visibility === 'STAFF'" class="px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              {{ VISIBILITY_LABELS.STAFF }}
            </span>
          </div>

          <!-- Main Big Title -->
          <div>
            <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug break-words">
              {{ book.title }}
            </h1>

            <!-- Penulis & Penerbit Info -->
            <div
              v-if="book.author || book.publisher || book.publicationYear"
              class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-500 mt-2.5"
            >
              <div v-if="book.author" class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Penulis: <strong class="text-slate-700 font-semibold">{{ book.author }}</strong></span>
              </div>

              <div v-if="book.publisher" class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                <span>Penerbit: <strong class="text-slate-700 font-semibold">{{ book.publisher }}</strong></span>
              </div>

              <div v-if="book.publicationYear" class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Terbit: <strong class="text-slate-700 font-semibold">{{ book.publicationYear }}</strong></span>
              </div>
            </div>
          </div>

          <!-- 4 Grid Metadata Metric Box -->
          <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div v-for="metric in metrics" :key="metric.label" class="space-y-1">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {{ metric.label }}
              </span>
              <div class="text-xs sm:text-sm font-extrabold text-slate-800">
                {{ metric.value }}
              </div>
            </div>
          </div>

          <!-- Action Buttons Bar -->
          <div class="flex flex-wrap items-center gap-3">
            <!-- Primary Button: Baca Daring -->
            <button
              type="button"
              class="px-6 py-3 rounded-xl bg-[#005B70] hover:bg-[#004859] active:bg-[#003845] text-white font-bold text-sm shadow-xs transition-all flex items-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!previewable"
              :title="previewable ? '' : `Format ${extension} belum dapat dibaca langsung di browser`"
              @click="scrollToReader"
            >
              <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>Baca Daring Sekarang</span>
            </button>

            <!-- Secondary Button: Unduh -->
            <a
              v-if="book.visibility !== 'STAFF'"
              :href="bookDownloadUrl(book.id)"
              class="px-6 py-3 rounded-xl bg-[#004B6B] hover:bg-[#003c56] active:bg-[#002f43] text-white font-bold text-sm shadow-xs transition-all flex items-center gap-2.5 cursor-pointer"
              @click="onPublicDownload"
            >
              <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Unduh {{ extension }}</span>
            </a>
            <button
              v-else
              type="button"
              class="px-6 py-3 rounded-xl bg-[#004B6B] hover:bg-[#003c56] active:bg-[#002f43] text-white font-bold text-sm shadow-xs transition-all flex items-center gap-2.5 cursor-pointer disabled:opacity-60"
              :disabled="isDownloading"
              @click="downloadStaffBook"
            >
              <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>{{ isDownloading ? 'Mengunduh…' : `Unduh ${extension}` }}</span>
            </button>

            <!-- Share Button -->
            <button
              type="button"
              title="Salin Tautan Buku"
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
            <div class="flex items-center border-b border-slate-200 bg-slate-50/60 px-2 pt-2 gap-1 overflow-x-auto scrollbar-none" role="tablist">
              <button
                v-for="tab in infoTabs"
                :key="tab.id"
                type="button"
                role="tab"
                :aria-selected="activeTab === tab.id"
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
              <!-- Tab 1: Deskripsi -->
              <div v-if="activeTab === 'deskripsi'">
                <p v-if="book.description" class="whitespace-pre-line">{{ book.description }}</p>
                <p v-else class="text-slate-400 italic">Belum ada deskripsi.</p>
              </div>

              <!-- Tab 2: Data Bibliografi -->
              <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div v-for="row in bibliography" :key="row.label" class="p-2.5 bg-slate-50 rounded-lg min-w-0">
                  <span class="text-slate-400 block text-[10px] font-bold uppercase">{{ row.label }}</span>
                  <span class="font-bold text-slate-700 break-words">{{ row.value }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </section>

      <!-- 3. SECTION 2: PEMBACA DI BROWSER -->
      <section id="baca" class="space-y-4 pt-4 scroll-mt-24">

        <!-- Viewer Header Toolbar -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-xl bg-[#005B70] text-white flex items-center justify-center shrink-0 shadow-xs">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-extrabold text-slate-900 tracking-tight leading-none">
                  Pembaca Daring
                </h3>
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-600 border border-emerald-200">
                  {{ extension }}
                </span>
              </div>
              <p class="text-[11px] text-slate-400 mt-1 truncate">
                {{ book.originalName }}
              </p>
            </div>
          </div>

          <div v-if="previewable && readerSrc" class="flex flex-wrap items-center gap-2.5">
            <a
              :href="readerSrc"
              target="_blank"
              rel="noopener"
              class="px-3 h-8 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-white hover:shadow-2xs flex items-center gap-1.5 text-xs font-semibold transition-all"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span>Buka di Tab Baru</span>
            </a>
            <button
              type="button"
              title="Layar Penuh"
              class="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-white hover:shadow-2xs flex items-center justify-center cursor-pointer transition-all"
              @click="isFullscreen = true"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Area Dokumen -->
        <div
          v-if="previewable"
          :class="[
            'bg-[#EEF4F8] rounded-2xl border border-slate-200/80 overflow-hidden transition-all',
            isFullscreen ? 'fixed inset-0 z-50 rounded-none border-0 bg-slate-900 p-2 sm:p-4' : 'h-[80vh] min-h-[480px]'
          ]"
        >
          <button
            v-if="isFullscreen"
            type="button"
            class="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-lg bg-white/90 text-slate-800 text-xs font-bold shadow-md cursor-pointer"
            @click="isFullscreen = false"
          >
            ✕ Tutup Layar Penuh
          </button>

          <iframe
            v-if="readerSrc"
            :key="readerSrc"
            :src="readerSrc"
            :title="`Pembaca: ${book.title}`"
            class="w-full h-full bg-white"
          ></iframe>
          <div v-else-if="readerError" class="h-full flex flex-col items-center justify-center gap-2 text-center p-6">
            <p class="text-sm font-bold text-slate-700">Berkas tidak dapat dimuat</p>
            <p class="text-xs text-slate-500">{{ errorMessage(readerError) }}</p>
          </div>
          <div v-else class="h-full flex items-center justify-center text-xs text-slate-500">
            Memuat dokumen…
          </div>
        </div>

        <!-- Format belum bisa dipratinjau -->
        <div v-else class="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-3">
          <div class="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <h3 class="text-sm font-bold text-slate-800">Pratinjau tidak tersedia untuk format {{ extension }}</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">
            Unduh berkas ini lalu buka dengan aplikasi yang sesuai di perangkat Anda.
          </p>
          <a
            v-if="book.visibility !== 'STAFF'"
            :href="bookDownloadUrl(book.id)"
            class="inline-block px-4 py-2 rounded-xl bg-[#005B70] hover:bg-[#004859] text-white text-xs font-bold transition-colors"
            @click="onPublicDownload"
          >
            Unduh {{ extension }}
          </a>
          <button
            v-else
            type="button"
            class="px-4 py-2 rounded-xl bg-[#005B70] hover:bg-[#004859] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-60"
            :disabled="isDownloading"
            @click="downloadStaffBook"
          >
            {{ isDownloading ? 'Mengunduh…' : `Unduh ${extension}` }}
          </button>
        </div>

      </section>

      <!-- 4. SECTION 3: REKOMENDASI TERKAIT -->
      <section v-if="relatedBooks.length" class="space-y-4 pt-6">

        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
              REKOMENDASI TERKAIT
            </span>
            <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {{ book.categoryName ? `Koleksi Lain di ${book.categoryName}` : 'Koleksi Populer Lainnya' }}
            </h2>
          </div>

          <router-link
            :to="book.categoryId ? { name: 'Kategori', query: { categoryId: String(book.categoryId) } } : { name: 'Kategori' }"
            class="text-xs font-semibold text-[#005B70] hover:underline flex items-center gap-1"
          >
            <span>Lihat Koleksi Lengkap</span>
            <span>›</span>
          </router-link>
        </div>

        <!-- 4 Column Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-1">
          <div
            v-for="item in relatedBooks"
            :key="item.id"
            class="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <!-- Top: Book Cover with floating badges -->
            <div class="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-xs border border-slate-200/80 bg-slate-900 flex flex-col justify-between p-2.5 text-white">
              <BookCover :book="item" />
              <div class="relative z-10 flex items-center justify-between">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold shadow-xs bg-emerald-500 text-white">
                  {{ labelFor(BOOK_TYPE_LABELS, item.bookType) }}
                </span>
              </div>
            </div>

            <!-- Bottom: Metadata & Action -->
            <div class="pt-3.5 space-y-1 flex-1 flex flex-col justify-between">
              <div>
                <div class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  {{ [item.categoryName, labelFor(GRADE_LABELS, item.gradeLevel)].filter(Boolean).join(' • ') }}
                </div>
                <h3 class="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#005B70] transition-colors line-clamp-2 mt-0.5 leading-snug min-h-[2.5rem]">
                  {{ item.title }}
                </h3>
                <p v-if="item.author" class="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {{ item.author }}
                </p>
              </div>

              <div class="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px]">
                <div class="flex items-center gap-1.5 text-slate-400 font-medium">
                  <svg class="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                  </svg>
                  <span>{{ formatNumber(item.downloadCount) }}× diunduh</span>
                </div>

                <router-link
                  :to="`/buku/${item.id}`"
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
    </template>

    <!-- Toast Notification -->
    <transition name="toast">
      <div
        v-if="showToast"
        class="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 text-xs max-w-[calc(100vw-3rem)]"
        role="status"
      >
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, h, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import BookCover from '../components/BookCover.vue'
import StateBlock from '../components/StateBlock.vue'
import { getBook, listBooks, bookFileUrl, bookDownloadUrl } from '../api/books.js'
import { useMediaUrl, downloadAuthed } from '../api/media.js'
import { errorMessage } from '../utils/errors.js'
import {
  BOOK_TYPE_LABELS,
  GRADE_LABELS,
  VISIBILITY_LABELS,
  labelFor,
  formatBytes,
  formatDate,
  formatNumber,
  fileExtension,
  canPreview
} from '../utils/labels.js'

const route = useRoute()

// ---------- Memuat buku ----------
const book = ref(null)
const state = ref('loading') // loading | ready | notFound | error
const loadError = ref('')
let bookRequest = 0

async function loadBook() {
  const id = ++bookRequest
  const bookId = route.params.id
  state.value = 'loading'
  isFullscreen.value = false
  activeTab.value = 'deskripsi'
  relatedBooks.value = []
  try {
    const data = await getBook(bookId)
    if (id !== bookRequest) return
    book.value = data
    state.value = 'ready'
    document.title = `${data.title} - E-Library SMAN 11 Garut`
    loadRelated(data)
    if (route.hash === '#baca') {
      await nextTick()
      scrollToReader()
    }
  } catch (err) {
    if (id !== bookRequest) return
    book.value = null
    if (err.status === 404 || err.code === 'NOT_FOUND') {
      state.value = 'notFound'
    } else {
      loadError.value = errorMessage(err)
      state.value = 'error'
    }
  }
}

// ---------- Turunan tampilan ----------
const extension = computed(() => (book.value ? fileExtension(book.value.originalName, book.value.mimeType) : ''))
const previewable = computed(() => !!book.value && canPreview(book.value.mimeType))

const metrics = computed(() => {
  const b = book.value
  return [
    { label: 'Kelas', value: labelFor(GRADE_LABELS, b.gradeLevel) },
    { label: 'Format', value: extension.value },
    { label: 'Ukuran', value: formatBytes(b.fileSize) },
    { label: 'Ditambahkan', value: formatDate(b.createdAt) }
  ]
})

const bibliography = computed(() => {
  const b = book.value
  const rows = [
    { label: 'Penulis', value: b.author },
    { label: 'Penerbit', value: b.publisher },
    { label: 'Tahun Terbit', value: b.publicationYear },
    { label: 'Kurikulum', value: b.curriculum },
    { label: 'Kategori', value: b.categoryName },
    { label: 'Jenis Bahan', value: labelFor(BOOK_TYPE_LABELS, b.bookType) },
    { label: 'Kelas', value: labelFor(GRADE_LABELS, b.gradeLevel) },
    { label: 'Akses', value: labelFor(VISIBILITY_LABELS, b.visibility) },
    { label: 'Nama Berkas', value: b.originalName },
    { label: 'Diunggah Oleh', value: b.uploadedByName || 'Impor massal' },
    { label: 'Terakhir Diperbarui', value: formatDate(b.updatedAt) }
  ]
  return rows.filter((r) => r.value !== null && r.value !== undefined && r.value !== '')
})

// ---------- Tabs ----------
const activeTab = ref('deskripsi')
const infoTabs = [
  {
    id: 'deskripsi',
    label: 'Deskripsi',
    iconSvg: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 }, [
      h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
      h('polyline', { points: '14 2 14 8 20 8' })
    ])
  },
  {
    id: 'bibliografi',
    label: 'Data Bibliografi',
    iconSvg: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('path', { d: 'M15 9.354a4 4 0 1 0 0 5.292' })
    ])
  }
]

// ---------- Pembaca ----------
const isFullscreen = ref(false)

// PUBLIC → URL biasa (streaming + Range); STAFF → blob URL ber-Authorization. Hanya bila bisa dipratinjau.
const { src: readerSrc, error: readerError } = useMediaUrl(() =>
  previewable.value ? { url: bookFileUrl(book.value.id), visibility: book.value.visibility } : null
)

function scrollToReader() {
  document.getElementById('baca')?.scrollIntoView({ behavior: 'smooth' })
}

function onKeydown(e) {
  if (e.key === 'Escape' && isFullscreen.value) isFullscreen.value = false
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

// ---------- Unduh ----------
const isDownloading = ref(false)

function onPublicDownload() {
  triggerToast(`Mengunduh ${book.value.originalName}…`)
}

async function downloadStaffBook() {
  isDownloading.value = true
  try {
    await downloadAuthed(bookDownloadUrl(book.value.id), book.value.originalName)
    triggerToast(`Mengunduh ${book.value.originalName}…`)
  } catch (err) {
    triggerToast(errorMessage(err))
  } finally {
    isDownloading.value = false
  }
}

// ---------- Buku terkait ----------
const relatedBooks = ref([])

async function loadRelated(current) {
  const id = bookRequest
  try {
    const page = await listBooks(
      current.categoryId
        ? { categoryId: current.categoryId, size: 5 }
        : { sort: 'popular', size: 5 }
    )
    if (id !== bookRequest) return
    relatedBooks.value = page.content.filter((b) => b.id !== current.id).slice(0, 4)
  } catch {
    relatedBooks.value = [] // bagian ini opsional, sembunyikan bila gagal
  }
}

// ---------- Toast, sitasi & bagikan ----------
const showToast = ref(false)
const toastMessage = ref('')
let toastTimer = null

function triggerToast(msg) {
  toastMessage.value = msg
  showToast.value = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    showToast.value = false
  }, 3200)
}
onBeforeUnmount(() => clearTimeout(toastTimer))

// navigator.clipboard hanya ada di konteks aman (HTTPS/localhost); LAN sekolah bisa HTTP biasa
async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* lanjut ke fallback */
  }
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  ta.remove()
  return ok
}

function buildCitation(b) {
  const author = b.author || 'Anonim'
  const year = b.publicationYear || 't.t.'
  const publisher = b.publisher ? ` ${b.publisher}.` : ''
  return `${author}. (${year}). ${b.title}.${publisher} E-Library SMAN 11 Garut.`
}

async function copyCitation() {
  const ok = await copyText(buildCitation(book.value))
  triggerToast(ok ? 'Kutipan (format APA) berhasil disalin!' : 'Gagal menyalin kutipan.')
}

async function handleShare() {
  const ok = await copyText(window.location.href.split('#')[0])
  triggerToast(ok ? 'Tautan buku berhasil disalin!' : 'Gagal menyalin tautan.')
}
// /buku/:id memakai ulang komponen saat membuka buku terkait → muat ulang saat id berubah
watch(
  () => route.params.id,
  (id) => {
    if (id !== undefined) loadBook()
  },
  { immediate: true }
)
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
