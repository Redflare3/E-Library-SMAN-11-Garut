<template>
  <div class="space-y-6">
    <!-- Hero Banner Section -->
    <section class="relative rounded-3xl bg-gradient-to-r from-[#0A647A] via-[#0B6B82] to-[#0D7896] p-7 md:p-10 overflow-hidden shadow-sm">
      <!-- Content Banner -->
      <div class="relative z-10 max-w-2xl">
        <!-- Badge Presensi Mandiri Pengunjung -->
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 text-sky-100 text-[11px] md:text-xs font-semibold">
          <svg class="w-3.5 h-3.5 text-cyan-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>PRESENSI MANDIRI PENGUNJUNG</span>
        </div>

        <!-- Main Hero Title -->
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-3">
          Selamat Datang di Ruang Baca SMAN 11 Garut
        </h1>

        <!-- Subtitle -->
        <p class="text-cyan-100/90 text-xs sm:text-sm md:text-base mt-2 font-normal leading-relaxed">
          Silakan lengkapi presensi digital Anda untuk pencatatan kehadiran.
        </p>
      </div>

      <!-- Watermark / Large Faint Graphic on Right (Person Reading Open Book) -->
      <div class="absolute right-2 md:right-8 -bottom-10 pointer-events-none select-none text-white/10 md:text-cyan-100/15">
        <svg class="w-56 h-56 md:w-72 md:h-72" viewBox="0 0 24 24" fill="currentColor">
          <!-- Stylized Reader Figure & Book -->
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" opacity="0.4" />
          <path d="M19 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3.5a3.5 3.5 0 0 1 3.5 3.5V20m0 0a3.5 3.5 0 0 1 3.5-3.5H19" fill="none" stroke="currentColor" stroke-width="2" />
        </svg>
      </div>
    </section>

    <!-- Stat Card: Total Masuk Hari Ini -->
    <section class="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
      <span class="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
        TOTAL MASUK HARI INI
      </span>
      <div class="text-3xl sm:text-4xl font-extrabold text-[#0B6B82] mt-1 tracking-tight">
        {{ totalPengunjungHariIni }}
      </div>
    </section>

    <!-- Main Slicing Grid: Left Form (8 Cols) & Right Sidebar (4 Cols) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      <!-- Kolom Kiri: Formulir Mandiri -->
      <section class="lg:col-span-8">
        <FormPresensi @checkin-success="handleCheckinSuccess" />
      </section>

      <!-- Kolom Kanan: Sidebar Pengunjung Terkini & Petugas -->
      <section class="lg:col-span-4">
        <PengunjungTerkiniSidebar 
          :daftar-pengunjung="daftarPengunjung" 
          :petugas="petugasHariIni"
        />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FormPresensi from '../components/FormPresensi.vue'
import PengunjungTerkiniSidebar from '../components/PengunjungTerkiniSidebar.vue'

// Reactive state untuk Total Masuk Hari Ini (sesuai angka '142' di Figma)
const totalPengunjungHariIni = ref(142)

// Mock Data Lokal Pengunjung Terkini (100% Offline tanpa dependensi CDN/internet)
const daftarPengunjung = ref([
  {
    id: 1,
    nama: 'Anisa Nurul Hidayah',
    inisial: 'AN',
    avatarUrl: null, // Siap jika diisi URL dinamis oleh backend
    kategori: 'X-3',
    aktivitas: 'Riset KTI Biologi',
    lokasi: 'Ruang Baca Utama',
    waktu: '1 mnt lalu'
  },
  {
    id: 2,
    nama: 'Rafi Pratama Yudha',
    inisial: 'RP',
    avatarUrl: null,
    kategori: 'XII-MIPA 1',
    aktivitas: 'E-Book Kimia',
    lokasi: 'Bilik Multimedia PC',
    waktu: '4 mnt lalu'
  },
  {
    id: 3,
    nama: 'Dra. Hj. Neneng Rohaeti',
    inisial: 'DA',
    avatarUrl: null,
    kategori: 'Guru Bahasa Sunda',
    aktivitas: 'Pengembalian',
    lokasi: 'Meja Sirkulasi',
    waktu: '8 mnt lalu'
  },
  {
    id: 4,
    nama: 'Zahra Salsabila',
    inisial: 'ZS',
    avatarUrl: null,
    kategori: 'XI-IPS 3',
    aktivitas: 'Tugas Sejarah',
    lokasi: 'Pojok Diskusi Literasi',
    waktu: '12 mnt lalu'
  }
])

// Data Petugas Layanan Hari Ini
const petugasHariIni = ref({
  nama: 'Ibu Siti Rahmah, S.I.Pust.',
  jabatan: 'Pustakawan Ahli SMAN 11 Garut',
  inisial: 'SR',
  fotoUrl: null // Siap jika diisi URL dinamis oleh backend
})

// Fungsi helper untuk menghasilkan inisial 2 huruf
const getInitials = (fullName) => {
  if (!fullName) return 'P'
  const parts = fullName.trim().split(' ')
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

// Handler ketika pengunjung baru berhasil check-in dari FormPresensi
const handleCheckinSuccess = (dataPengunjungBaru) => {
  // Tambah counter
  totalPengunjungHariIni.value++

  // Tentukan lokasi default berdasarkan tujuan kunjungan
  let lokasiOtomatis = 'Ruang Baca Utama'
  if (dataPengunjungBaru.tujuanKunjungan === 'Komputer Digital') {
    lokasiOtomatis = 'Bilik Multimedia PC'
  } else if (dataPengunjungBaru.tujuanKunjungan === 'Pinjam / Balik Buku') {
    lokasiOtomatis = 'Meja Sirkulasi'
  } else if (dataPengunjungBaru.tujuanKunjungan === 'Tugas & Diskusi') {
    lokasiOtomatis = 'Pojok Diskusi Literasi'
  } else if (dataPengunjungBaru.tujuanKunjungan === 'Riset Ilmiah / OSN') {
    lokasiOtomatis = 'Ruang Referensi & Karya Tulis'
  }

  // Masukkan ke posisi paling atas di list Pengunjung Terkini
  daftarPengunjung.value.unshift({
    id: Date.now(),
    nama: dataPengunjungBaru.nama,
    inisial: getInitials(dataPengunjungBaru.nama),
    avatarUrl: null,
    kategori: dataPengunjungBaru.kelas,
    aktivitas: dataPengunjungBaru.tujuanKunjungan,
    lokasi: lokasiOtomatis,
    waktu: 'Baru saja'
  })

  // Jaga daftar agar tetap 4 atau 5 item teratas
  if (daftarPengunjung.value.length > 5) {
    daftarPengunjung.value.pop()
  }
}
</script>

<style scoped>
/* Scoped styles PresensiPage */
</style>
