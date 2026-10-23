<template>
  <aside class="space-y-6">
    <!-- Card 1: Pengunjung Terkini (Real-time List) -->
    <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
      <!-- Header Pengunjung Terkini -->
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center gap-2">
          <!-- Green indicator dot -->
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <h3 class="font-bold text-slate-800 text-sm md:text-base">Pengunjung Terkini</h3>
        </div>

        <!-- Badge Real-time -->
        <span class="px-2.5 py-0.5 rounded-full bg-sky-100/70 text-[#0B6B82] text-[11px] font-semibold">
          Real-time
        </span>
      </div>

      <!-- List Pengunjung -->
      <div class="divide-y divide-slate-100">
        <div 
          v-for="(item, index) in daftarPengunjung" 
          :key="item.id || index"
          class="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3"
        >
          <!-- Avatar Inisial (dengan fallback jika fotoUrl kosong/null) -->
          <div class="w-10 h-10 rounded-full bg-sky-100/70 text-[#0B6B82] font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden border border-sky-200/50">
            <img 
              v-if="item.avatarUrl" 
              :src="item.avatarUrl" 
              :alt="item.nama"
              class="w-full h-full object-cover"
            />
            <span v-else>{{ item.inisial }}</span>
          </div>

          <!-- Info Pengunjung -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-1">
              <h4 class="font-bold text-slate-800 text-xs md:text-sm truncate">
                {{ item.nama }}
              </h4>
              <span class="text-[11px] text-slate-400 shrink-0 font-medium">
                {{ item.waktu }}
              </span>
            </div>

            <!-- Kelas & Aktivitas -->
            <p class="text-xs font-semibold text-[#0B6B82] mt-0.5 truncate">
              {{ item.kategori }} • {{ item.aktivitas }}
            </p>

            <!-- Ruang / Lokasi -->
            <p class="text-[11px] text-slate-400 mt-0.5">
              {{ item.lokasi }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Card 2: Petugas Layanan Hari Ini & Petunjuk Ruang Baca -->
    <div class="bg-[#EFF8FA] rounded-2xl p-5 border border-sky-100 space-y-4">
      <!-- Header Petugas -->
      <div class="flex items-center gap-2 text-slate-800">
        <svg class="w-4 h-4 text-[#0B6B82]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h4 class="font-bold text-xs md:text-sm text-slate-800">Petugas Layanan Hari Ini</h4>
      </div>

      <!-- Card Profil Petugas -->
      <div class="bg-white rounded-xl p-3.5 flex items-center gap-3 border border-sky-100 shadow-xs">
        <!-- Avatar Inisial SR / Foto Petugas -->
        <div class="w-9 h-9 rounded-lg bg-[#0B6B82] text-white font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
          <img 
            v-if="petugas.fotoUrl" 
            :src="petugas.fotoUrl" 
            :alt="petugas.nama"
            class="w-full h-full object-cover"
          />
          <span v-else>{{ petugas.inisial }}</span>
        </div>

        <div>
          <h5 class="font-bold text-xs md:text-sm text-slate-800 leading-tight">
            {{ petugas.nama }}
          </h5>
          <p class="text-[11px] text-slate-500 mt-0.5">
            {{ petugas.jabatan }}
          </p>
        </div>
      </div>

      <!-- Catatan / Petunjuk Penting -->
      <ul class="space-y-2 text-xs text-slate-600 pt-1">
        <li class="flex items-start gap-2 leading-relaxed">
          <svg class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>Wajib scan barcode/masukkan NIS saat memasuki perpustakaan.</span>
        </li>
        <li class="flex items-start gap-2 leading-relaxed">
          <svg class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>Buku yang selesai dibaca diletakkan di troli penampungan.</span>
        </li>
        <li class="flex items-start gap-2 leading-relaxed">
          <svg class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>Maksimal peminjaman 3 eksemplar selama 7 hari kalender.</span>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
// Props untuk data pengunjung dan petugas agar reaktif bila dihubungkan ke API / Pinia Store
defineProps({
  daftarPengunjung: {
    type: Array,
    default: () => [
      {
        id: 1,
        nama: 'Anisa Nurul Hidayah',
        inisial: 'AN',
        avatarUrl: null, // Siap menerima url gambar dari backend
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
    ]
  },
  petugas: {
    type: Object,
    default: () => ({
      nama: 'Ibu Siti Rahmah, S.I.Pust.',
      jabatan: 'Pustakawan Ahli SMAN 11 Garut',
      inisial: 'SR',
      fotoUrl: null // Siap menerima url gambar dari backend
    })
  }
})
</script>

<style scoped>
/* Scoped styles sidebar */
</style>
