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
      <!-- Toggle Filter Waktu Utama -->
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
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Mingguan(Weekly)</span>
        </button>

        <!-- Tab 3: Bulanan (Monthly) [ACTIVE STATE] -->
        <button
          type="button"
          :class="[
            'px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer',
            activeTab === 'bulanan'
              ? 'border border-[#0B6B82] bg-white text-[#0B6B82] shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          ]"
          @click="switchTab('bulanan')"
        >
          <svg class="w-4 h-4 text-[#0B6B82]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            <circle cx="10" cy="14" r="0.75" fill="currentColor" />
            <circle cx="14" cy="14" r="0.75" fill="currentColor" />
            <circle cx="10" cy="17" r="0.75" fill="currentColor" />
            <circle cx="14" cy="17" r="0.75" fill="currentColor" />
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
            Tren Kunjungan Bulanan (Oktober 2025) — Sumbu X: Minggu (Minggu 1 - Minggu 4) | Sumbu Y: Jumlah Pengunjung (0 - 1.000 Siswa)
          </p>
        </div>
      </div>

      <!-- Chart Legend & Percentage Badge -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <!-- Legend Items (Kiri) -->
        <div class="flex items-center gap-6 text-xs">
          <!-- Bulan Berjalan (Oktober 2025) -->
          <div class="flex items-center gap-2">
            <span class="w-4 h-1 rounded-full bg-[#0B6B82]"></span>
            <span class="font-bold text-slate-800">Bulan Berjalan (Oktober 2025)</span>
          </div>

          <!-- Bulan Sebelumnya -->
          <div class="flex items-center gap-2 text-slate-400">
            <span class="w-4 h-0.5 border-t-2 border-dashed border-slate-400"></span>
            <span class="font-medium text-slate-500">Bulan Sebelumnya</span>
          </div>
        </div>

        <!-- Badge Persentase (Kanan) -->
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF7EE] text-[#1D9E4B] border border-emerald-100 text-xs font-bold">
          <svg class="w-3.5 h-3.5 text-[#1D9E4B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span>+14.8% Akumulasi Bulanan</span>
        </div>
      </div>

      <!-- Linear / Area Smooth Curve Chart Viewport (0 - 1.000 Siswa) -->
      <div class="w-full overflow-x-auto pt-4">
        <div class="min-w-[680px] relative">
          <!-- SVG Responsive Canvas -->
          <svg viewBox="0 0 840 260" class="w-full h-64 overflow-visible select-none">
            <defs>
              <!-- Teal Linear Gradient Fill -->
              <linearGradient id="monthlyTealGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0B6B82" stop-opacity="0.28" />
                <stop offset="60%" stop-color="#0B6B82" stop-opacity="0.10" />
                <stop offset="100%" stop-color="#0B6B82" stop-opacity="0.0" />
              </linearGradient>
            </defs>

            <!-- Horizontal Gridlines & Y-Axis Scale (0, 250, 500, 750, 1.000) -->
            <g class="text-[11px] font-sans font-medium text-slate-400 fill-current">
              <!-- Y: 1.000 -->
              <text x="35" y="24" text-anchor="end">1.000</text>
              <line x1="50" y1="20" x2="820" y2="20" stroke="#F1F5F9" stroke-width="1" />

              <!-- Y: 750 -->
              <text x="35" y="69" text-anchor="end">750</text>
              <line x1="50" y1="65" x2="820" y2="65" stroke="#F1F5F9" stroke-width="1" />

              <!-- Y: 500 -->
              <text x="35" y="114" text-anchor="end">500</text>
              <line x1="50" y1="110" x2="820" y2="110" stroke="#F1F5F9" stroke-width="1" />

              <!-- Y: 250 -->
              <text x="35" y="159" text-anchor="end">250</text>
              <line x1="50" y1="155" x2="820" y2="155" stroke="#F1F5F9" stroke-width="1" />

              <!-- Y: 0 -->
              <text x="35" y="204" text-anchor="end">0</text>
              <line x1="50" y1="200" x2="820" y2="200" stroke="#E2E8F0" stroke-width="1" />
            </g>

            <!-- Line 2: Bulan Sebelumnya (Dashed Grey Line) -->
            <path
              :d="previousMonthPath"
              fill="none"
              stroke="#A0B7BF"
              stroke-width="2"
              stroke-dasharray="6 6"
              stroke-linecap="round"
            />

            <!-- Line 1: Bulan Berjalan Gradient Fill -->
            <path
              :d="currentMonthAreaPath"
              fill="url(#monthlyTealGradient)"
            />

            <!-- Line 1: Bulan Berjalan Main Solid Line -->
            <path
              :d="currentMonthLinePath"
              fill="none"
              stroke="#0B6B82"
              stroke-width="3.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <!-- Interactive Points & Data Labels for Bulan Berjalan (Stabil Tanpa Jitter) -->
            <g v-for="(point, idx) in currentMonthPoints" :key="idx" class="group/point">
              <!-- Animasi Bulat-Bulat & Ring Marker: Dipindahkan KHUSUS ke Titik Puncak (Minggu ke-3, 910 Siswa) -->
              <g v-if="point.isPeak">
                <!-- Ripple Pulse Fading Menghilang (Speed sama persis dengan statistik mingguan: 1.6s) -->
                <circle
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

                <!-- Outer Accent Ring Lingkar Halus Penanda Titik Puncak -->
                <circle
                  :cx="point.x"
                  :cy="point.y"
                  r="8.5"
                  class="stroke-[#0B6B82] stroke-[2] fill-none pointer-events-none"
                />
              </g>

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
                <title>{{ monthlyChartData.labels[idx] }}: {{ point.value }} Siswa</title>
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

            <!-- X-Axis Labels (Minggu & Tanggal / Jumlah Siswa) -->
            <g v-for="(item, idx) in monthlyChartData.labels" :key="'label-' + idx" class="select-none">
              <!-- Nama Minggu -->
              <text
                :x="currentMonthPoints[idx].x"
                y="222"
                text-anchor="middle"
                :class="[
                  'text-xs font-sans',
                  idx === monthlyChartData.peakIndex
                    ? 'font-bold fill-[#0B6B82]'
                    : 'font-semibold fill-slate-800'
                ]"
              >
                {{ item }}
              </text>

              <!-- Sub-label Tanggal & Jumlah Siswa -->
              <text
                :x="currentMonthPoints[idx].x"
                y="238"
                text-anchor="middle"
                :class="[
                  'text-[11px] font-sans',
                  idx === monthlyChartData.peakIndex
                    ? 'font-bold fill-[#0B6B82]'
                    : 'font-normal fill-slate-500'
                ]"
              >
                {{ monthlyChartData.subLabels[idx] }}
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>

    <!-- 4. Summary Metric Cards (3 Grid Box Bawah) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
      <!-- Card 1: Total Kunjungan Bulan Ini -->
      <div class="bg-[#F0F7FA] rounded-2xl p-5 md:p-6 border border-sky-100/70 shadow-2xs flex items-center justify-between">
        <div class="space-y-0.5">
          <span class="text-[11px] font-bold text-slate-400 tracking-wider block">
            Total Kunjungan Bulan Ini
          </span>
          <div class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {{ totalBulananFormatted }} Siswa
          </div>
          <span class="text-xs font-semibold text-emerald-600 block pt-0.5">
            Target 3.000 tercapai 111.3%
          </span>
        </div>

        <!-- Users Group Icon -->
        <div class="w-11 h-11 rounded-xl bg-white text-[#0B6B82] flex items-center justify-center shrink-0 border border-sky-100 shadow-2xs">
          <svg class="w-6 h-6 text-[#0B6B82]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>

      <!-- Card 2: Minggu Teramai -->
      <div class="bg-[#F0F7FA] rounded-2xl p-5 md:p-6 border border-sky-100/70 shadow-2xs flex items-center justify-between">
        <div class="space-y-0.5">
          <span class="text-[11px] font-bold text-slate-400 tracking-wider block">
            Minggu Teramai
          </span>
          <div class="text-xl sm:text-2xl font-extrabold text-[#0B6B82] tracking-tight">
            {{ mingguTeramai }}
          </div>
          <span class="text-xs text-slate-400 block pt-0.5">
            Puncak animo literasi
          </span>
        </div>

        <!-- Trend Up Arrow Icon -->
        <div class="w-11 h-11 rounded-xl bg-white text-[#0B6B82] flex items-center justify-center shrink-0 border border-sky-100 shadow-2xs">
          <svg class="w-6 h-6 text-[#0B6B82]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      </div>

      <!-- Card 3: Rata-rata Mingguan -->
      <div class="bg-[#F0F7FA] rounded-2xl p-5 md:p-6 border border-sky-100/70 shadow-2xs flex items-center justify-between">
        <div class="space-y-0.5">
          <span class="text-[11px] font-bold text-slate-400 tracking-wider block">
            Rata-rata Mingguan
          </span>
          <div class="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
            {{ rataRataMingguan }} Siswa / Minggu
          </div>
          <span class="text-xs text-slate-400 block pt-0.5">
            4 Pekan operasional
          </span>
        </div>

        <!-- Notebook / Edit Pencil Icon -->
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
const activeTab = ref('bulanan')
const lastSyncTime = ref('Hari ini, 13:42 WIB')

// 1. Data Reaktif Grafik Bulanan (Siap Dihubungkan / Disuntikkan Back-End)
const monthlyChartData = ref({
  labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
  subLabels: [
    '(1–7 Okt) • 740 Siswa',
    '(8–14 Okt) • 825 Siswa',
    '(15–21 Okt) • 910 Siswa',
    '(22–28 Okt) • 865 Siswa'
  ],
  peakIndex: 2, // Index Minggu 3 sebagai puncak animo literasi
  datasets: [
    {
      label: 'Bulan Berjalan (Oktober 2025)',
      data: [740, 825, 910, 865],
      borderColor: '#0B6B82'
    },
    {
      label: 'Bulan Sebelumnya',
      data: [640, 700, 750, 710],
      borderColor: '#A0B7BF'
    }
  ]
})

// 2. Kalkulasi Metrik Ringkasan Otomatis
const totalBulanan = computed(() => {
  return monthlyChartData.value.datasets[0].data.reduce((a, b) => a + b, 0)
})

const totalBulananFormatted = computed(() => {
  // Format angka Indonesia ribuan (3.340)
  return totalBulanan.value.toLocaleString('id-ID')
})

const mingguTeramai = computed(() => {
  const currentData = monthlyChartData.value.datasets[0].data
  const maxVal = Math.max(...currentData)
  const maxIdx = currentData.indexOf(maxVal)
  return `${monthlyChartData.value.labels[maxIdx]} (${maxVal} Siswa)`
})

const rataRataMingguan = computed(() => {
  const currentData = monthlyChartData.value.datasets[0].data
  if (!currentData.length) return 0
  return Math.round(totalBulanan.value / currentData.length)
})

// 3. Kalkulasi Koordinat Matematika SVG (Skala Y: 0 - 1.000 Siswa)
const maxScaleY = 1000
const chartTopY = 20
const chartBottomY = 200
const chartLeftX = 170
const chartRightX = 720

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
      isPeak: idx === monthlyChartData.value.peakIndex
    }
  })
}

// Points Bulan Berjalan & Bulan Sebelumnya
const currentMonthPoints = computed(() => {
  return calculateCoordinates(monthlyChartData.value.datasets[0].data)
})

const previousMonthPoints = computed(() => {
  return calculateCoordinates(monthlyChartData.value.datasets[1].data)
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

// SVG Path untuk Bulan Berjalan (Line & Fill Area)
const currentMonthLinePath = computed(() => {
  return generateSplinePath(currentMonthPoints.value)
})

const currentMonthAreaPath = computed(() => {
  const line = currentMonthLinePath.value
  const points = currentMonthPoints.value
  if (!points.length) return ''
  const lastX = points[points.length - 1].x
  const firstX = points[0].x
  return `${line} L ${lastX} ${chartBottomY} L ${firstX} ${chartBottomY} Z`
})

// SVG Path untuk Bulan Sebelumnya (Dashed Line)
const previousMonthPath = computed(() => {
  return generateSplinePath(previousMonthPoints.value)
})

// Handler Navigasi Tab Utama
const switchTab = (tab) => {
  activeTab.value = tab
  if (tab === 'harian') {
    router.push('/statistik/harian')
  } else if (tab === 'mingguan') {
    router.push('/statistik/mingguan')
  } else {
    router.push('/statistik/bulanan')
  }
}

// Handler Internal Filter Grafik Card (Mingguan vs Bulanan)
const switchChartFilter = (filter) => {
  if (filter === 'mingguan') {
    router.push('/statistik/mingguan')
  } else {
    router.push('/statistik/bulanan')
  }
}
</script>

<style scoped>
/* Scoped chart styles */
</style>
