<template>
  <div class="space-y-6">
    <!-- Sub-navigation Tabs Statistik -->
    <div class="flex items-center gap-2 border-b border-slate-200 pb-3">
      <router-link 
        to="/statistik/harian" 
        class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#0B6B82] text-white shadow-xs"
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
        class="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
      >
        Statistik Bulanan
      </router-link>
    </div>

    <!-- Header & Date Filter -->
    <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-1">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Buku Tamu & Kunjungan Real-Time</span>
        </div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Log Kunjungan Harian</h1>
        <p class="text-xs text-slate-400">Pencatatan presensi digital siswa, guru, dan staf per tanggal hari ini</p>
      </div>

      <div class="flex items-center gap-3">
        <input 
          v-model="tanggalPilihan" 
          type="date" 
          class="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#0B6B82]/20"
        />
        <button 
          type="button" 
          class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          @click="resetTanggal"
        >
          Hari Ini
        </button>
      </div>
    </div>

    <!-- Metric Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Total Masuk Hari Ini" :value="142" subtitle="Update 1 mnt lalu" trend="12% vs kemarin" :trend-positive="true" />
      <StatCard title="Pengunjung Siswa" :value="128" subtitle="Siswa Kelas X, XI, XII" />
      <StatCard title="Pengunjung Guru & Staf" :value="14" subtitle="Tenaga Pengajar & Karyawan" />
      <StatCard title="Peminjaman Hari Ini" :value="36" subtitle="Buku Fisik & E-Book" />
    </div>

    <!-- Log Table Section -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-base font-bold text-slate-800">Daftar Buku Tamu Digital (Log Lengkap)</h2>
        <span class="text-xs text-slate-400">{{ logTamu.length }} pengunjung tercatat</span>
      </div>

      <BaseTable>
        <template #header>
          <th class="px-6 py-3.5">Waktu</th>
          <th class="px-6 py-3.5">Nama Pengunjung</th>
          <th class="px-6 py-3.5">Kategori / Kelas</th>
          <th class="px-6 py-3.5">Tujuan Kunjungan</th>
          <th class="px-6 py-3.5">Lokasi / Meja</th>
        </template>

        <tr v-for="item in logTamu" :key="item.id" class="hover:bg-slate-50/70 transition-colors">
          <td class="px-6 py-3.5 font-mono text-xs text-slate-500 font-medium">{{ item.waktu }}</td>
          <td class="px-6 py-3.5 font-bold text-slate-800 text-xs sm:text-sm">{{ item.nama }}</td>
          <td class="px-6 py-3.5">
            <BaseBadge variant="neutral" size="sm">{{ item.kelas }}</BaseBadge>
          </td>
          <td class="px-6 py-3.5 text-xs text-slate-600">{{ item.tujuan }}</td>
          <td class="px-6 py-3.5 text-xs text-[#0B6B82] font-semibold">{{ item.lokasi }}</td>
        </tr>
      </BaseTable>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatCard from '../../components/ui/StatCard.vue'
import BaseTable from '../../components/ui/BaseTable.vue'
import BaseBadge from '../../components/ui/BaseBadge.vue'

const tanggalPilihan = ref(new Date().toISOString().substring(0, 10))

const resetTanggal = () => {
  tanggalPilihan.value = new Date().toISOString().substring(0, 10)
}

const logTamu = ref([
  { id: 1, waktu: '12:38:15', nama: 'Anisa Nurul Hidayah', kelas: 'X-3', tujuan: 'Riset KTI Biologi', lokasi: 'Ruang Baca Utama' },
  { id: 2, waktu: '12:35:02', nama: 'Rafi Pratama Yudha', kelas: 'XII-MIPA 1', tujuan: 'E-Book Kimia', lokasi: 'Bilik Multimedia PC' },
  { id: 3, waktu: '12:30:44', nama: 'Dra. Hj. Neneng Rohaeti', kelas: 'Guru Bahasa Sunda', tujuan: 'Pengembalian Buku', lokasi: 'Meja Sirkulasi' },
  { id: 4, waktu: '12:28:10', nama: 'Zahra Salsabila', kelas: 'XI-IPS 3', tujuan: 'Tugas Sejarah', lokasi: 'Pojok Diskusi Literasi' },
  { id: 5, waktu: '12:21:19', nama: 'Fajar Nugraha', kelas: 'X-1', tujuan: 'Membaca Majalah Dinding', lokasi: 'Ruang Santai' },
  { id: 6, waktu: '12:15:00', nama: 'Muhammad Rizky Ramadhan', kelas: 'XII-IPS 2', tujuan: 'Buku Paket Ekonomi', lokasi: 'Ruang Baca Utama' }
])
</script>
