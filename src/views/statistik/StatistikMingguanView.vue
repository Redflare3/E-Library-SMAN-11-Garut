<template>
  <div class="space-y-6">
    <!-- 1. Page Header (Judul & Sub-judul) -->
    <div class="space-y-1">
      <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Statistik &amp; Presensi Pengunjung
      </h1>
      <p class="text-xs sm:text-sm text-slate-500 font-normal">
        Pemantauan dinamis animo literasi peserta didik, guru, dan staf SMAN 11 Garut.
      </p>
    </div>

    <!-- 2. Tab Navigation Filter Bar -->
    <div class="bg-white rounded-2xl p-2 md:p-2.5 border border-slate-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <!-- Toggle Filter Waktu -->
      <div class="inline-flex items-center gap-1.5 overflow-x-auto">
        <!-- Tab 1: Harian (Daily) -->
        <button
          type="button"
          :class="[
            'px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer',
            activeTab === 'harian'
              ? 'border border-[#0B6B82] bg-white text-[#0B6B82] shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          ]"
          @click="switchTab('harian')"
        >
          <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Harian(Daily)</span>
        </button>

        <!-- Tab 2: Mingguan (Weekly) [ACTIVE STATE] -->
        <button
          type="button"
          :class="[
            'px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer',
            activeTab === 'mingguan'
              ? 'border border-[#0B6B82] bg-white text-[#0B6B82] shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          ]"
          @click="switchTab('mingguan')"
        >
          <svg class="w-4 h-4 text-[#0B6B82]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Mingguan(Weekly)</span>
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

    <!-- 3. Chart Section Card: Visualisasi Linear Tren Kunjungan Perpustakaan -->
    <div class="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xs space-y-6">
      <!-- Card Title & Subtitle -->
      <div class="flex items-start gap-2.5">
        <div class="mt-1 text-[#0B6B82]">
          <!-- Zig-zag trend icon -->
          <svg class="w-5 h-5 text-[#0B6B82]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div>
          <h2 class="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
            Visualisasi Linear Tren Kunjungan Perpustakaan
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">
            Tren Kunjungan Mingguan — Sumbu X: Hari (Senin - Sabtu) | Sumbu Y: Jumlah Pengunjung (0 - 250 Siswa)
          </p>
        </div>
      </div>

      <!-- Chart Legend & Percentage Increase Badge -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <!-- Legend Items -->
        <div class="flex items-center gap-6 text-xs">
          <!-- Pekan Berjalan (2025) -->
          <div class="flex items-center gap-2">
            <span class="w-4 h-1 rounded-full bg-[#0B6B82]"></span>
            <span class="font-bold text-slate-800">Pekan Berjalan (2025)</span>
          </div>

          <!-- Pekan Sebelumnya -->
          <div class="flex items-center gap-2 text-slate-400">
            <span class="w-4 h-0.5 border-t-2 border-dashed border-slate-400"></span>
            <span class="font-medium text-slate-500">Pekan Sebelumnya</span>
          </div>
        </div>

        <!-- Badge +18.4% Peningkatan Kunjungan -->
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF7EE] text-[#1D9E4B] border border-emerald-100 text-xs font-bold">
          <svg class="w-3.5 h-3.5 text-[#1D9E4B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span>+18.4% Peningkatan Kunjungan</span>
        </div>
      </div>

      <!-- Linear / Area Smooth Curve Chart Viewport -->
      <div class="w-full overflow-x-auto pt-4">
        <div class="min-w-[640px] relative">
          <!-- SVG Responsive Canvas -->
          <svg viewBox="0 0 840 260" class="w-full h-64 overflow-visible select-none">
            <defs>
              <!-- Teal Linear Gradient Fill -->
              <linearGradient id="chartTealGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0B6B82" stop-opacity="0.28" />
                <stop offset="60%" stop-color="#0B6B82" stop-opacity="0.10" />
                <stop offset="100%" stop-color="#0B6B82" stop-opacity="0.0" />
              </linearGradient>
            </defs>

            <!-- Horizontal Gridlines & Y-Axis Scale (0, 50, 100, 150, 200, 250) -->
            <g class="text-[11px] font-sans font-medium text-slate-400 fill-current">
              <!-- Y: 250 -->
              <text x="30" y="24" text-anchor="end">250</text>
              <line x1="45" y1="20" x2="820" y2="20" stroke="#F1F5F9" stroke-width="1" />

              <!-- Y: 200 -->
              <text x="30" y="60" text-anchor="end">200</text>
              <line x1="45" y1="56" x2="820" y2="56" stroke="#F1F5F9" stroke-width="1" />

              <!-- Y: 150 -->
              <text x="30" y="96" text-anchor="end">150</text>
              <line x1="45" y1="92" x2="820" y2="92" stroke="#F1F5F9" stroke-width="1" />

              <!-- Y: 100 -->
              <text x="30" y="132" text-anchor="end">100</text>
              <line x1="45" y1="128" x2="820" y2="128" stroke="#F1F5F9" stroke-width="1" />

              <!-- Y: 50 -->
              <text x="30" y="168" text-anchor="end">50</text>
              <line x1="45" y1="164" x2="820" y2="164" stroke="#F1F5F9" stroke-width="1" />

              <!-- Y: 0 -->
              <text x="30" y="204" text-anchor="end">0</text>
              <line x1="45" y1="200" x2="820" y2="200" stroke="#E2E8F0" stroke-width="1" />
            </g>

            <!-- Line 2: Pekan Sebelumnya (Dashed Grey Line) -->
            <path
              :d="previousWeekPath"
              fill="none"
              stroke="#A0B7BF"
              stroke-width="2"
              stroke-dasharray="6 6"
              stroke-linecap="round"
            />

            <!-- Line 1: Pekan Berjalan Gradient Fill -->
            <path
              :d="currentWeekAreaPath"
              fill="url(#chartTealGradient)"
            />

            <!-- Line 1: Pekan Berjalan Main Solid Line -->
            <path
              :d="currentWeekLinePath"
              fill="none"
              stroke="#0B6B82"
              stroke-width="3.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <!-- Interactive Points & Data Labels for Pekan Berjalan (Stabil Tanpa Jitter) -->
            <g v-for="(point, idx) in currentWeekPoints" :key="idx" class="group/point">
              <!-- Glow Drop Effect for Peak Point (Rabu) - pointer-events-none agar tidak bentrok dengan mouse -->
              <circle
                v-if="point.isPeak"
                :cx="point.x"
                :cy="point.y"
                r="6"
                fill="#0B6B82"
                class="pointer-events-none"
              >
                <animate
                  attributeName="r"
                  values="6; 16"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.65; 0"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
              </circle>

              <!-- Point Circle (Stabil, Tanpa Shaking/Jitter) -->
              <circle
                :cx="point.x"
                :cy="point.y"
                :r="point.isPeak ? 6.5 : 5"
                class="fill-[#0B6B82] stroke-white stroke-[2.5] transition-colors duration-150 group-hover/point:fill-[#085568] pointer-events-none"
              />

              <!-- Area Hitbox Transparan Lebar (Mencegah kursor terpental keluar masuk) -->
              <circle
                :cx="point.x"
                :cy="point.y"
                r="16"
                class="fill-transparent cursor-pointer"
              >
                <title>{{ chartData.labels[idx] }}: {{ point.value }} Siswa</title>
              </circle>

              <!-- Value Label Above Point -->
              <text
                :x="point.x"
                :y="point.y - 12"
                text-anchor="middle"
                :class="[
                  'text-xs font-sans select-none pointer-events-none',
                  point.isPeak
                    ? 'font-extrabold fill-[#0B6B82] text-[13px]'
                    : 'font-bold fill-slate-700'
                ]"
              >
                {{ point.value }} {{ point.isPeak ? '( Puncak )' : '' }}
              </text>
            </g>

            <!-- X-Axis Labels (Hari & Jumlah Siswa) -->
            <g v-for="(day, idx) in chartData.labels" :key="'label-' + idx" class="select-none">
              <!-- Hari -->
              <text
                :x="currentWeekPoints[idx].x"
                y="222"
                text-anchor="middle"
                :class="[
                  'text-xs font-sans',
                  idx === chartData.peakIndex
                    ? 'font-bold fill-[#0B6B82]'
                    : 'font-semibold fill-slate-800'
                ]"
              >
                {{ day }}
              </text>

              <!-- Sub-label Siswa -->
              <text
                :x="currentWeekPoints[idx].x"
                y="238"
                text-anchor="middle"
                :class="[
                  'text-[11px] font-sans',
                  idx === chartData.peakIndex
                    ? 'font-bold fill-[#0B6B82]'
                    : 'font-normal fill-slate-400'
                ]"
              >
                {{ chartData.datasets[0].subLabels[idx] }}
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>

    <!-- 4. Summary Metric Cards (3 Grid Box Bawah) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
      <!-- Card 1: Total Kunjungan Minggu Ini -->
      <div class="bg-[#F0F7FA] rounded-2xl p-5 md:p-6 border border-sky-100/70 shadow-2xs flex items-center justify-between">
        <div class="space-y-0.5">
          <span class="text-[11px] font-bold text-slate-400 tracking-wider block">
            Total Kunjungan Minggu Ini
          </span>
          <div class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {{ totalMingguan }} Siswa
          </div>
        </div>

        <!-- Group / Users Icon -->
        <div class="w-11 h-11 rounded-xl bg-white text-[#0B6B82] flex items-center justify-center shrink-0 border border-sky-100 shadow-2xs">
          <svg class="w-6 h-6 text-[#0B6B82]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>

      <!-- Card 2: Hari Teramai -->
      <div class="bg-[#F0F7FA] rounded-2xl p-5 md:p-6 border border-sky-100/70 shadow-2xs flex items-center justify-between">
        <div class="space-y-0.5">
          <span class="text-[11px] font-bold text-slate-400 tracking-wider block">
            Hari Teramai
          </span>
          <div class="text-xl sm:text-2xl font-extrabold text-[#0B6B82] tracking-tight">
            {{ hariTeramai }}
          </div>
        </div>

        <!-- Trend Up Arrow in Circle Icon -->
        <div class="w-11 h-11 rounded-xl bg-white text-[#0B6B82] flex items-center justify-center shrink-0 border border-sky-100 shadow-2xs">
          <svg class="w-6 h-6 text-[#0B6B82]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      </div>

      <!-- Card 3: Rata-rata Harian -->
      <div class="bg-[#F0F7FA] rounded-2xl p-5 md:p-6 border border-sky-100/70 shadow-2xs flex items-center justify-between">
        <div class="space-y-0.5">
          <span class="text-[11px] font-bold text-slate-400 tracking-wider block">
            Rata-rata Harian
          </span>
          <div class="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
            {{ rataRataHarian }} Siswa / Hari
          </div>
        </div>

        <!-- Notebook / Stats / Pen Icon -->
        <div class="w-11 h-11 rounded-xl bg-white text-[#0B6B82] flex items-center justify-center shrink-0 border border-sky-100 shadow-2xs">
          <svg class="w-6 h-6 text-[#0B6B82]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Reactive State
const activeTab = ref('mingguan')
const lastSyncTime = ref('Hari ini, 13:42 WIB')

// 1. Data Reaktif Grafik Mingguan (Siap Dihubungkan oleh Back-End)
const chartData = ref({
  labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
  peakIndex: 2, // Index hari Rabu sebagai puncak
  datasets: [
    {
      label: 'Pekan Berjalan (2025)',
      data: [135, 168, 182, 154, 110, 76],
      subLabels: ['135 Siswa', '168 Siswa', '182 Siswa', '154 Siswa', '110 Siswa', '76 Siswa'],
      borderColor: '#0B6B82'
    },
    {
      label: 'Pekan Sebelumnya',
      data: [120, 148, 162, 140, 105, 68],
      borderColor: '#A0B7BF'
    }
  ]
})

// 2. Kalkulasi Metrik Ringkasan Otomatis
const totalMingguan = computed(() => {
  return chartData.value.datasets[0].data.reduce((a, b) => a + b, 0)
})

const hariTeramai = computed(() => {
  const currentData = chartData.value.datasets[0].data
  const maxVal = Math.max(...currentData)
  const maxIdx = currentData.indexOf(maxVal)
  return `${chartData.value.labels[maxIdx]} (${maxVal} Siswa)`
})

const rataRataHarian = computed(() => {
  const currentData = chartData.value.datasets[0].data
  if (!currentData.length) return 0
  return Math.floor(totalMingguan.value / currentData.length)
})

// 3. Kalkulasi Koordinat Matematika SVG (0 - 250 Skala Y)
const maxScaleY = 250
const chartTopY = 20
const chartBottomY = 200
const chartLeftX = 110
const chartRightX = 750

const calculateCoordinates = (values) => {
  const stepX = (chartRightX - chartLeftX) / (values.length - 1)
  const heightY = chartBottomY - chartTopY

  return values.map((val, idx) => {
    const x = chartLeftX + idx * stepX
    const y = chartBottomY - (val / maxScaleY) * heightY
    return {
      x,
      y,
      value: val,
      isPeak: idx === chartData.value.peakIndex
    }
  })
}

// Points Pekan Berjalan & Pekan Sebelumnya
const currentWeekPoints = computed(() => {
  return calculateCoordinates(chartData.value.datasets[0].data)
})

const previousWeekPoints = computed(() => {
  return calculateCoordinates(chartData.value.datasets[1].data)
})

// Generator Jalur Spline Kurva Mulus (Smooth Cubic Bezier)
const generateSplinePath = (points) => {
  if (!points.length) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }
  return d
}

// SVG Path untuk Pekan Berjalan (Line & Fill Area)
const currentWeekLinePath = computed(() => {
  return generateSplinePath(currentWeekPoints.value)
})

const currentWeekAreaPath = computed(() => {
  const line = currentWeekLinePath.value
  const points = currentWeekPoints.value
  if (!points.length) return ''
  const lastX = points[points.length - 1].x
  const firstX = points[0].x
  return `${line} L ${lastX} ${chartBottomY} L ${firstX} ${chartBottomY} Z`
})

// SVG Path untuk Pekan Sebelumnya (Dashed Line)
const previousWeekPath = computed(() => {
  return generateSplinePath(previousWeekPoints.value)
})

// Handler Tab Switching
const switchTab = (tab) => {
  activeTab.value = tab
  if (tab === 'harian') {
    router.push('/statistik/harian')
  } else if (tab === 'bulanan') {
    router.push('/statistik/bulanan')
  } else {
    router.push('/statistik/mingguan')
  }
}
</script>

<style scoped>
/* Scoped chart styles */
</style>
