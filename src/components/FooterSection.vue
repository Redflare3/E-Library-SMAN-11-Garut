<template>
  <footer class="w-full bg-white border-t border-slate-200/80 pt-14 pb-8 mt-16 text-slate-600">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 4 Columns Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-slate-100">
        <!-- Kolom 1: Brand & Profil Singkat (4 Cols) -->
        <div class="lg:col-span-4 space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center p-1 shrink-0">
              <img 
                v-if="logoUrl" 
                :src="logoUrl" 
                alt="Logo SMAN 11 Garut" 
                class="w-full h-full object-contain"
              />
              <div v-else class="w-full h-full rounded-full bg-[#0B6B82] flex items-center justify-center text-white">
                <svg class="w-5 h-5 text-amber-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
            </div>

            <div>
              <h3 class="font-bold text-slate-800 text-sm md:text-base leading-tight">
                E-Library SMAN 11 Garut
              </h3>
              <p class="text-[11px] text-slate-400">
                Sistem Informasi Manajemen Perpustakaan
              </p>
            </div>
          </div>

          <p class="text-xs text-slate-500 leading-relaxed max-w-sm">
            Perpustakaan Digital SMAN 11 Garut menyediakan akses mudah, terbuka, dan terpadu ke ribuan literatur akademik, buku teks kurikulum merdeka, karya tulis siswa, serta jurnal digital penunjang prestasi sekolah.
          </p>
        </div>

        <!-- Kolom 2: Lokasi & Kontak (3 Cols) -->
        <div class="lg:col-span-3 space-y-3">
          <h4 class="text-xs font-bold text-slate-800 tracking-wider uppercase mb-4">
            LOKASI &amp; KONTAK
          </h4>

          <ul class="space-y-3 text-xs">
            <li class="flex items-start gap-2.5 leading-relaxed text-slate-600">
              <svg class="w-4 h-4 text-[#0B6B82] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Jl. Siliwangi No. 11, Kel. Regol, Kec. Garut Kota, Kabupaten Garut, Jawa Barat 44111</span>
            </li>

            <li class="flex items-center gap-2.5 text-slate-600">
              <svg class="w-4 h-4 text-[#0B6B82] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>(0262) 231189 / 0812-2111-9876</span>
            </li>

            <li class="flex items-center gap-2.5 text-slate-600">
              <svg class="w-4 h-4 text-[#0B6B82] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>perpustakaan@sman11garut.sch.id</span>
            </li>

            <li class="flex items-center gap-2.5 text-slate-600">
              <svg class="w-4 h-4 text-[#0B6B82] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Pustakawan Relawan: Ibu Siti Rahmah, S.I.Pust.</span>
            </li>
          </ul>
        </div>

        <!-- Kolom 3: Jam Layanan Perpustakaan (3 Cols) -->
        <div class="lg:col-span-3 space-y-3">
          <h4 class="text-xs font-bold text-slate-800 tracking-wider uppercase mb-4">
            JAM LAYANAN PERPUSTAKAAN
          </h4>

          <div class="space-y-2 text-xs">
            <div class="flex items-center justify-between py-1 border-b border-slate-50">
              <span class="font-medium text-slate-700">Senin – Kamis</span>
              <span class="text-slate-600 font-semibold">07.15 – 15.30 WIB</span>
            </div>

            <div class="flex items-center justify-between py-1 border-b border-slate-50">
              <span class="font-medium text-slate-700">Jumat</span>
              <span class="text-slate-600 font-semibold">07.15 – 11.30 WIB</span>
            </div>

            <div class="flex items-center justify-between py-1 border-b border-slate-50">
              <span class="font-medium text-slate-700">Sabtu (Ekskul/Literasi)</span>
              <span class="text-slate-600 font-semibold">08.00 – 12.00 WIB</span>
            </div>

            <div class="flex items-center justify-between py-1">
              <span class="font-medium text-slate-700">Minggu &amp; Libur Nasional</span>
              <span class="font-bold text-rose-500">Tutup</span>
            </div>
          </div>
        </div>

        <!-- Kolom 4: Navigasi Cepat (2 Cols) -->
        <div class="lg:col-span-2 space-y-3">
          <h4 class="text-xs font-bold text-slate-800 tracking-wider uppercase mb-4">
            NAVIGASI CEPAT
          </h4>

          <ul class="space-y-2 text-xs">
            <li>
              <a href="#katalog" class="flex items-center gap-1.5 text-slate-600 hover:text-[#0B6B82] transition-colors">
                <span class="text-slate-400">›</span>
                <span>Katalog Buku</span>
              </a>
            </li>
            <li>
              <a href="#kategori" class="flex items-center gap-1.5 text-slate-600 hover:text-[#0B6B82] transition-colors">
                <span class="text-slate-400">›</span>
                <span>Cari & Filter Kategori</span>
              </a>
            </li>
            <li>
              <a href="#arsip" class="flex items-center gap-1.5 text-slate-600 hover:text-[#0B6B82] transition-colors">
                <span class="text-slate-400">›</span>
                <span>Arsip & Berita</span>
              </a>
            </li>
            <li>
              <a href="#presensi" class="flex items-center gap-1.5 text-[#0B6B82] font-semibold transition-colors">
                <span class="text-[#0B6B82]">›</span>
                <span>Presensi Pengunjung</span>
              </a>
            </li>
            <li>
              <a href="#statistik" class="flex items-center gap-1.5 text-slate-600 hover:text-[#0B6B82] transition-colors">
                <span class="text-slate-400">›</span>
                <span>Statistik Pengunjung</span>
              </a>
            </li>
            <li>
              <a href="#petugas" class="flex items-center gap-1.5 text-slate-600 hover:text-[#0B6B82] transition-colors">
                <span class="text-slate-400">›</span>
                <span>Portal Masuk Petugas</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar: Copyright & Pedoman -->
      <div class="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
        <p class="text-center md:text-left">
          © 2025 Perpustakaan SMAN 11 Garut. Hak Cipta Dilindungi Undang-Undang. Dikembangkan untuk Komunitas Pendidikan Garut.
        </p>

        <div class="flex items-center gap-3">
          <a href="#kebijakan" class="hover:text-slate-600 transition">Kebijakan Peminjaman</a>
          <span>•</span>
          <a href="#pedoman" class="hover:text-slate-600 transition">Pedoman Siswa</a>
          <span>•</span>
          <a href="#sistem" class="hover:text-slate-600 transition">Sistem Perpustakaan</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
defineProps({
  logoUrl: {
    type: String,
    default: null
  }
})
</script>

<style scoped>
/* Scoped styles footer */
</style>
