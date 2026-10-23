<template>
  <div class="space-y-6">
    <!-- Sub-navigation Tabs Statistik -->
    <div class="flex items-center gap-2 border-b border-slate-200 pb-3">
      <router-link 
        to="/statistik/harian" 
        class="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
      >
        Statistik Harian
      </router-link>
      <router-link 
        to="/statistik/mingguan" 
        class="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
      >
        Statistik Mingguan
      </router-link>
      <router-link 
        to="/statistik/bulanan" 
        class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#0B6B82] text-white shadow-xs"
      >
        Statistik Bulanan
      </router-link>
    </div>

    <!-- Header -->
    <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Akumulasi Statistik Bulanan</h1>
        <p class="text-xs text-slate-400">Ringkasan capaian literasi dan kunjungan perpustakaan per bulan</p>
      </div>

      <div class="flex items-center gap-3">
        <select v-model="selectedBulan" class="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none">
          <option value="10">Oktober 2026</option>
          <option value="9">September 2026</option>
          <option value="8">Agustus 2026</option>
        </select>
        <button 
          type="button" 
          class="px-4 py-2 rounded-xl bg-[#0B6B82] hover:bg-[#085568] text-white text-xs font-bold transition-colors cursor-pointer"
          @click="window.print()"
        >
          Cetak Rekap
        </button>
      </div>
    </div>

    <!-- Monthly Summary KPI -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Total Kunjungan Bulan Ini" :value="3420" subtitle="Akumulasi 24 hari aktif" trend="+14% MoM" :trend-positive="true" />
      <StatCard title="Total Judul Dibaca" :value="684" subtitle="Koleksi Fisik & Digital" />
      <StatCard title="Rata-rata Durasi" value="42 mnt" subtitle="Per sesi kunjungan siswa" />
      <StatCard title="Peminjaman Terpenuhi" value="98.2%" subtitle="Tingkat ketersediaan buku" />
    </div>

    <!-- Breakdown Grid: Top Kelas & Top Genre -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <!-- Card: Kelas Paling Aktif -->
      <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-bold text-slate-900">5 Kelas Paling Aktif Berkunjung</h2>
          <span class="text-xs text-[#0B6B82] font-semibold">Bulan Oktober</span>
        </div>

        <div class="space-y-3">
          <div v-for="(item, idx) in topKelas" :key="item.kelas" class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div class="flex items-center gap-3">
              <span class="w-6 h-6 rounded-full bg-sky-100 text-[#0B6B82] text-xs font-bold flex items-center justify-center">
                {{ idx + 1 }}
              </span>
              <span class="text-sm font-bold text-slate-800">{{ item.kelas }}</span>
            </div>
            <div class="text-right">
              <span class="text-sm font-extrabold text-[#0B6B82]">{{ item.kunjungan }}</span>
              <span class="text-[11px] text-slate-400 block">kunjungan</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Card: Kategori Buku Paling Diminati -->
      <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-bold text-slate-900">Kategori Paling Banyak Diakses</h2>
          <span class="text-xs text-[#0B6B82] font-semibold">Proporsi Minat</span>
        </div>

        <div class="space-y-3">
          <div v-for="cat in topKategori" :key="cat.nama" class="space-y-1">
            <div class="flex justify-between text-xs font-medium">
              <span class="text-slate-700">{{ cat.nama }}</span>
              <span class="text-slate-500 font-bold">{{ cat.persen }}% ({{ cat.jumlah }} sesi)</span>
            </div>
            <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div class="bg-[#0B6B82] h-full rounded-full" :style="{ width: `${cat.persen}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatCard from '../../components/ui/StatCard.vue'

const selectedBulan = ref('10')

const topKelas = ref([
  { kelas: 'X-3 (Fase E)', kunjungan: 342 },
  { kelas: 'XII-MIPA 1', kunjungan: 310 },
  { kelas: 'XI-IPS 3', kunjungan: 278 },
  { kelas: 'XI-MIPA 2', kunjungan: 254 },
  { kelas: 'X-1 (Fase E)', kunjungan: 230 }
])

const topKategori = ref([
  { nama: 'Buku Pelajaran & Kurikulum Merdeka', persen: 42, jumlah: 1436 },
  { nama: 'Sains, Biologi & Fisika Eksperimen', persen: 26, jumlah: 889 },
  { nama: 'Karya Tulis Ilmiah & Jurnal Siswa', persen: 18, jumlah: 615 },
  { nama: 'Fiksi, Sastra & Novel Edukatif', persen: 14, jumlah: 480 }
])
</script>
