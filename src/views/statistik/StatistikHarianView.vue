<template>
  <div class="space-y-6">
    <!-- 1. Breadcrumb & Header Title Section -->
    <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
      <div class="space-y-1.5">
        <!-- Sub-header Badge: SIPERPUS • DATA KUNJUNGAN LITERASI REALTIME -->
        <div class="inline-flex items-center gap-1.5 text-[#0B6B82] text-xs font-bold tracking-wider uppercase">
          <svg class="w-4 h-4 text-[#0B6B82]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span>SIPERPUS • DATA KUNJUNGAN LITERASI REALTIME</span>
        </div>

        <!-- Main Title -->
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Statistik & Presensi Pengunjung
        </h1>

        <!-- Subtitle -->
        <p class="text-xs sm:text-sm text-slate-500 font-normal max-w-xl">
          Pemantauan dinamis animo literasi peserta didik, guru, dan staf SMAN 11 Garut.
        </p>
      </div>

      <!-- Top-Right Action Buttons -->
      <div class="flex flex-wrap items-center gap-2.5 pt-1">
        <!-- Button Unduh PDF -->
        <button 
          type="button" 
          @click="handleUnduhPdf"
          class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#E6F3F7] hover:bg-[#d8edf3] text-[#0B6B82] font-bold text-xs sm:text-sm border border-[#CDE5ED] transition-colors cursor-pointer shadow-2xs"
        >
          <svg class="w-4 h-4 text-[#0B6B82]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Unduh PDF</span>
        </button>

        <!-- Button Ekspor Excel -->
        <button 
          type="button" 
          @click="handleEksporExcel"
          class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#E6F3F7] hover:bg-[#d8edf3] text-[#0B6B82] font-bold text-xs sm:text-sm border border-[#CDE5ED] transition-colors cursor-pointer shadow-2xs"
        >
          <svg class="w-4 h-4 text-[#0B6B82]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Ekspor Excel</span>
        </button>

        <!-- Button Cetak Laporan -->
        <button 
          type="button" 
          @click="handleCetakLaporan"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B6B82] hover:bg-[#085568] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
        >
          <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>Cetak Laporan</span>
        </button>
      </div>
    </div>

    <!-- 2. Tab Navigation Filter Bar -->
    <div class="bg-white rounded-2xl p-2 md:p-2.5 border border-slate-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <!-- Toggle Filter Waktu: Harian, Mingguan, Bulanan -->
      <div class="inline-flex items-center gap-1.5 overflow-x-auto">
        <!-- Tab 1: Harian (Daily) [ACTIVE] -->
        <button
          type="button"
          :class="[
            'px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer',
            activeTab === 'harian'
              ? 'border border-[#0B6B82] bg-white text-[#0B6B82] shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          ]"
          @click="switchTab('harian')"
        >
          <svg class="w-4 h-4 text-[#0B6B82]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Harian (Daily)</span>
        </button>

        <!-- Tab 2: Mingguan (Weekly) -->
        <button
          type="button"
          :class="[
            'px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer',
            activeTab === 'mingguan'
              ? 'border border-[#0B6B82] bg-white text-[#0B6B82] shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          ]"
          @click="switchTab('mingguan')"
        >
          <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Mingguan (Weekly)</span>
        </button>

        <!-- Tab 3: Bulanan (Monthly) -->
        <button
          type="button"
          :class="[
            'px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer',
            activeTab === 'bulanan'
              ? 'border border-[#0B6B82] bg-white text-[#0B6B82] shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          ]"
          @click="switchTab('bulanan')"
        >
          <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span>Bulanan (Monthly)</span>
        </button>
      </div>

      <!-- Status Indikator Sinkronisasi (Kanan) -->
      <div class="flex items-center gap-2 text-xs text-slate-500 px-2 sm:px-3">
        <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
        <span class="font-medium">Data Tersinkron: <strong class="text-slate-700 font-semibold">{{ lastSyncTime }}</strong></span>
      </div>
    </div>

    <!-- 3. Metric Card: TOTAL KUNJUNGAN HARI INI -->
    <div class="bg-white rounded-2xl p-6 md:p-7 border border-slate-100 shadow-xs">
      <span class="text-[11px] font-bold text-slate-400 tracking-wider uppercase block">
        TOTAL KUNJUNGAN HARI INI
      </span>
      <div class="flex items-baseline mt-1.5">
        <span class="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-none">
          {{ totalKunjungan }}
        </span>
        <span class="ml-3.5 text-xs sm:text-sm font-bold text-[#0B6B82]">
          Siswa &amp; Guru
        </span>
      </div>
    </div>

    <!-- 4. Data Table: Daftar Buku Tamu & Presensi Digital Siswa -->
    <div class="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      <!-- Table Header & Counter Badge -->
      <div class="p-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            Daftar Buku Tamu &amp; Presensi Digital Siswa
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">
            Data tercatat otomatis melalui sensor barcode kartu pelajar atau input mandiri terminal lobi perpustakaan.
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <span class="text-xs text-slate-400">Menampilkan:</span>
          <span class="px-3 py-1 rounded-full bg-[#E6F3F7] text-[#0B6B82] text-xs font-bold shadow-2xs">
            {{ dummyLogData.length }} Data Terverifikasi
          </span>
        </div>
      </div>

      <!-- Responsive Table Container -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm text-slate-600">
          <thead class="bg-[#F0F7FA] border-y border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
            <tr>
              <th scope="col" class="px-6 py-3.5">JAM MASUK</th>
              <th scope="col" class="px-6 py-3.5">NAMA SISWA</th>
              <th scope="col" class="px-6 py-3.5 text-center">KELAS</th>
              <th scope="col" class="px-6 py-3.5">TUJUAN KUNJUNGAN</th>
              <th scope="col" class="px-6 py-3.5">DURASI SESI</th>
              <th scope="col" class="px-6 py-3.5 text-center">STATUS</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr 
              v-for="item in dummyLogData" 
              :key="item.id"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <!-- 1. Jam Masuk -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B6B82]">
                  <svg class="w-4 h-4 text-[#0B6B82] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ item.jamMasuk }}</span>
                </div>
              </td>

              <!-- 2. Nama Siswa & Reg. Barcode + Avatar Bulat Inisial -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <!-- Avatar Lingkaran Inisial (dengan fallback foto) -->
                  <div class="w-9 h-9 rounded-full bg-slate-100 border border-slate-200/70 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                    <img 
                      v-if="item.avatarUrl" 
                      :src="item.avatarUrl" 
                      :alt="item.nama"
                      class="w-full h-full object-cover"
                    />
                    <span v-else>{{ item.inisial || getInitials(item.nama) }}</span>
                  </div>

                  <div class="min-w-0">
                    <h3 class="font-bold text-slate-800 text-xs sm:text-sm leading-tight truncate">
                      {{ item.nama }}
                    </h3>
                    <p class="text-[11px] text-slate-400 mt-0.5 font-normal truncate">
                      {{ item.nomorIdentitas }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- 3. Badge Kelas -->
              <td class="px-6 py-4 text-center whitespace-nowrap">
                <span 
                  :class="[
                    'inline-block px-3 py-1 rounded-full text-xs font-semibold',
                    item.isGuru 
                      ? 'bg-[#EAE8FE] text-[#5540E0]' 
                      : 'bg-slate-100 text-slate-700'
                  ]"
                >
                  {{ item.kelas }}
                </span>
              </td>

              <!-- 4. Pill Tujuan Kunjungan -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5F8] text-[#0B6B82] text-xs font-semibold">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#0B6B82]"></span>
                  <span>{{ item.tujuan }}</span>
                </span>
              </td>

              <!-- 5. Durasi Sesi -->
              <td class="px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-slate-700">
                {{ item.durasi }}
              </td>

              <!-- 6. Pill Status Kehadiran (Selesai / Di Ruang Baca / Di Ruang Guru) -->
              <td class="px-6 py-4 text-center whitespace-nowrap">
                <span 
                  v-if="item.status === 'Selesai'"
                  class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EAF7EE] text-[#1D9E4B] border border-emerald-100 text-xs font-bold"
                >
                  <svg class="w-3.5 h-3.5 text-[#1D9E4B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Selesai</span>
                </span>

                <span 
                  v-else
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF6E5] text-[#D9822B] border border-amber-200/60 text-xs font-bold"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-[#D9822B]"></span>
                  <span>{{ item.status }}</span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 5. Table Pagination Bar -->
      <div class="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
        <!-- Teks Informasi Total Data -->
        <p class="text-xs text-slate-500 font-medium">
          Menampilkan 1–6 dari 148 catatan log hari ini
        </p>

        <!-- Paginasi Tombol & Angka -->
        <nav class="flex items-center gap-1.5 text-xs font-medium">
          <!-- Tombol Sebelumnya -->
          <button
            type="button"
            class="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-400 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
            disabled
          >
            Sebelumnya
          </button>

          <!-- Nomor Halaman 1 (Active) -->
          <button
            type="button"
            class="w-8 h-8 rounded-lg bg-[#0B6B82] text-white font-bold flex items-center justify-center shadow-xs cursor-pointer"
          >
            1
          </button>

          <!-- Nomor Halaman 2 -->
          <button
            type="button"
            class="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            2
          </button>

          <!-- Nomor Halaman 3 -->
          <button
            type="button"
            class="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            3
          </button>

          <!-- Ellipsis -->
          <span class="px-1 text-slate-400">...</span>

          <!-- Nomor Halaman 25 -->
          <button
            type="button"
            class="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            25
          </button>

          <!-- Tombol Selanjutnya -->
          <button
            type="button"
            class="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors font-medium cursor-pointer"
          >
            Selanjutnya
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Reactive State
const activeTab = ref('harian')
const lastSyncTime = ref('Hari ini, 13:42 WIB')
const totalKunjungan = ref(148)

// 6 Data dummy persis sesuai tampilan visual Figma
const dummyLogData = ref([
  {
    id: 1,
    jamMasuk: '11:42 WIB',
    nama: 'Daffa Fauzan Rahman',
    nomorIdentitas: 'Reg. Barcode: 32050119',
    inisial: 'DF',
    avatarUrl: null,
    kelas: 'XII MIPA 2',
    isGuru: false,
    tujuan: 'Membaca Mandiri',
    durasi: '45 Menit',
    status: 'Selesai'
  },
  {
    id: 2,
    jamMasuk: '11:45 WIB',
    nama: 'Nadia Azzahra Putri',
    nomorIdentitas: 'Reg. Barcode: 32050124',
    inisial: 'NA',
    avatarUrl: null,
    kelas: 'XI IPS 1',
    isGuru: false,
    tujuan: 'Peminjaman Buku',
    durasi: '20 Menit',
    status: 'Selesai'
  },
  {
    id: 3,
    jamMasuk: '11:48 WIB',
    nama: 'Muhammad Rayhan',
    nomorIdentitas: 'Reg. Barcode: 32050188',
    inisial: 'MR',
    avatarUrl: null,
    kelas: 'X-MIPA 2',
    isGuru: false,
    tujuan: 'Diskusi Tugas Kelompok',
    durasi: '50 Menit',
    status: 'Di Ruang Baca'
  },
  {
    id: 4,
    jamMasuk: '11:50 WIB',
    nama: 'Siti Nurhaliza',
    nomorIdentitas: 'Reg. Barcode: 32050201',
    inisial: 'SN',
    avatarUrl: null,
    kelas: 'XII IPS 2',
    isGuru: false,
    tujuan: 'Akses E-Book Komputer',
    durasi: '35 Menit',
    status: 'Selesai'
  },
  {
    id: 5,
    jamMasuk: '12:05 WIB',
    nama: 'Bintang Hidayatullah',
    nomorIdentitas: 'Reg. Barcode: 32050215',
    inisial: 'BH',
    avatarUrl: null,
    kelas: 'XI MIPA 4',
    isGuru: false,
    tujuan: 'Peminjaman Buku',
    durasi: '15 Menit',
    status: 'Selesai'
  },
  {
    id: 6,
    jamMasuk: '12:15 WIB',
    nama: 'Kurnia Pratama, S.Pd.',
    nomorIdentitas: 'NIP: 198509122010011009',
    inisial: 'KP',
    avatarUrl: null,
    kelas: 'Guru',
    isGuru: true,
    tujuan: 'Membaca Mandiri',
    durasi: '60 Menit',
    status: 'Di Ruang Guru'
  }
])

// Helper untuk fallback inisial nama jika foto/inisial kosong
const getInitials = (fullName) => {
  if (!fullName) return 'P'
  const parts = fullName.trim().split(' ')
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

// Handler Tab Switching
const switchTab = (tab) => {
  activeTab.value = tab
  if (tab === 'mingguan') {
    router.push('/statistik/mingguan')
  } else if (tab === 'bulanan') {
    router.push('/statistik/bulanan')
  } else {
    router.push('/statistik/harian')
  }
}

// Action Handlers
const handleUnduhPdf = () => {
  window.print()
}

const handleEksporExcel = () => {
  alert('Menyiapkan file ekspor Excel (.xlsx) untuk 148 catatan log...')
}

const handleCetakLaporan = () => {
  window.print()
}
</script>

<style scoped>
/* Scoped custom styling untuk print-friendly view */
@media print {
  button, nav {
    display: none !important;
  }
}
</style>
