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
        class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#0B6B82] text-white shadow-xs"
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

    <!-- Header -->
    <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Tren Kunjungan Mingguan</h1>
        <p class="text-xs text-slate-400">Analisis pola kunjungan dan jam sibuk siswa selama satu pekan (Senin - Sabtu)</p>
      </div>
      <div class="px-3.5 py-1.5 rounded-xl bg-sky-50 text-[#0B6B82] font-semibold text-xs border border-sky-100">
        Pekan ke-3 Oktober 2026
      </div>
    </div>

    <!-- Metrics Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard title="Total Pengunjung Pekan Ini" :value="845" subtitle="Senin s.d. Sabtu" trend="+8.4% vs pekan lalu" :trend-positive="true" />
      <StatCard title="Rata-Rata Harian" :value="141" subtitle="Pengunjung / hari aktif" />
      <StatCard title="Hari Tersibuk" value="Rabu" subtitle="182 Pengunjung (Puncak Jam Istirahat)" />
    </div>

    <!-- Visual Weekly Bar Chart (CSS-based, 100% Offline without external chart libraries) -->
    <div class="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xs space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-base font-bold text-slate-900">Grafik Kunjungan Harian (Pekan Berjalan)</h2>
          <p class="text-xs text-slate-400">Perbandingan jumlah pengunjung aktif tiap hari sekolah</p>
        </div>
        <span class="text-xs font-semibold text-[#0B6B82]">Target: 150/hari</span>
      </div>

      <!-- Bars Container -->
      <div class="grid grid-cols-6 gap-3 sm:gap-6 items-end h-64 pt-8 pb-2 border-b border-slate-100">
        <div v-for="day in weeklyData" :key="day.hari" class="flex flex-col items-center h-full justify-end group">
          <span class="text-[11px] font-bold text-slate-700 mb-1 group-hover:text-[#0B6B82] transition-colors">
            {{ day.jumlah }}
          </span>
          <div 
            :style="{ height: `${(day.jumlah / maxVal) * 100}%` }" 
            :class="[
              'w-full max-w-[48px] rounded-t-xl transition-all duration-300 relative group-hover:brightness-110',
              day.hari === 'Rabu' ? 'bg-[#0B6B82]' : 'bg-sky-200'
            ]"
          >
            <!-- Tooltip Hover -->
            <div class="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap">
              {{ day.jumlah }} siswa/guru
            </div>
          </div>
          <span class="text-xs font-semibold text-slate-500 mt-2">{{ day.hari }}</span>
        </div>
      </div>

      <!-- Highlights Footnote -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs text-slate-600">
        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
          <strong class="text-slate-800 block mb-1">Puncak Jam Kunjungan:</strong>
          Paling ramai pada jam <strong>09.45 - 10.30 WIB</strong> (Istirahat 1) dan <strong>12.00 - 13.00 WIB</strong> (Istirahat Sholat & Makan).
        </div>
        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
          <strong class="text-slate-800 block mb-1">Aktivitas Terpopuler:</strong>
          Pengerjaan tugas kelompok dan membaca novel mendominasi 58% dari total aktivitas di ruang baca.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import StatCard from '../../components/ui/StatCard.vue'

const weeklyData = ref([
  { hari: 'Senin', jumlah: 135 },
  { hari: 'Selasa', jumlah: 152 },
  { hari: 'Rabu', jumlah: 182 },
  { hari: 'Kamis', jumlah: 148 },
  { hari: 'Jumat', jumlah: 110 },
  { hari: 'Sabtu', jumlah: 118 }
])

const maxVal = computed(() => Math.max(...weeklyData.value.map(d => d.jumlah)) * 1.15)
</script>
