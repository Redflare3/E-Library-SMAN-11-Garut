<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black tracking-tight text-slate-900">Statistik Perpustakaan</h1>
        <p class="text-sm text-slate-500 mt-1">{{ todayLabel }}<template v-if="loadedAt"> · diperbarui {{ loadedAt }}</template></p>
      </div>
      <BaseButton variant="outline" :loading="state === 'loading' && !!stats" @click="load">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
        Muat Ulang
      </BaseButton>
    </div>

    <!-- Error -->
    <StateBlock
      v-if="state === 'error'"
      state="error"
      title="Gagal memuat statistik"
      :message="error"
      @retry="load"
    />

    <!-- Kerangka pemuatan awal -->
    <div v-else-if="!stats" class="space-y-6 animate-pulse" aria-busy="true" aria-label="Memuat statistik">
      <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        <div v-for="n in 5" :key="n" class="h-28 rounded-2xl bg-white border border-slate-100"></div>
      </div>
      <div class="h-80 rounded-2xl bg-white border border-slate-100"></div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="h-72 rounded-2xl bg-white border border-slate-100"></div>
        <div class="h-72 rounded-2xl bg-white border border-slate-100"></div>
      </div>
    </div>

    <template v-else>
      <!-- Kartu angka -->
      <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          v-for="card in cards"
          :key="card.title"
          :title="card.title"
          :value="formatNumber(card.value)"
          :subtitle="card.subtitle"
        />
      </div>

      <!-- Tren unduhan 7 hari -->
      <section class="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 sm:p-6">
        <div class="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <h2 class="text-sm font-bold text-slate-800">Unduhan 7 Hari Terakhir</h2>
          <span class="text-xs text-slate-400">{{ formatNumber(weekTotal) }} unduhan</span>
        </div>
        <div class="h-72">
          <Line :data="lineData" :options="lineOptions" aria-hidden="true" />
        </div>
        <p class="sr-only">{{ lineSummary }}</p>
      </section>

      <!-- Komposisi koleksi -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section class="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 sm:p-6">
          <div class="flex items-baseline justify-between gap-2 mb-4">
            <h2 class="text-sm font-bold text-slate-800">Buku per Jenis</h2>
            <span class="text-xs text-slate-400">{{ formatNumber(stats.totalBooks) }} judul</span>
          </div>
          <div class="h-64">
            <Bar :data="bookTypeData" :options="barOptions('judul')" aria-hidden="true" />
          </div>
          <p class="sr-only">{{ summarize(bookTypeData) }}</p>
        </section>

        <section class="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 sm:p-6">
          <div class="flex items-baseline justify-between gap-2 mb-4">
            <h2 class="text-sm font-bold text-slate-800">Arsip per Jenis Media</h2>
            <span class="text-xs text-slate-400">{{ formatNumber(stats.totalArchiveItems) }} item</span>
          </div>
          <div class="h-64">
            <Bar :data="mediaTypeData" :options="barOptions('item')" aria-hidden="true" />
          </div>
          <p class="sr-only">{{ summarize(mediaTypeData) }}</p>
        </section>
      </div>

      <!-- Buku terpopuler -->
      <section class="space-y-3">
        <h2 class="text-sm font-bold text-slate-800">Buku Paling Banyak Diunduh</h2>
        <BaseTable :empty="!stats.topBooks?.length">
          <template #header>
            <th class="px-5 py-3 w-12">#</th>
            <th class="px-4 py-3">Judul</th>
            <th class="px-4 py-3 hidden sm:table-cell">Penulis</th>
            <th class="px-5 py-3 text-right">Diunduh</th>
          </template>
          <tr v-for="(book, i) in stats.topBooks" :key="book.id" class="hover:bg-slate-50/60">
            <td class="px-5 py-3 text-xs font-bold text-slate-400 tabular-nums">{{ i + 1 }}</td>
            <td class="px-4 py-3">
              <router-link :to="`/buku/${book.id}`" class="text-sm font-semibold text-slate-800 hover:text-[#005B70] line-clamp-2">
                {{ book.title }}
              </router-link>
              <span v-if="book.author" class="sm:hidden block text-xs text-slate-400 truncate">{{ book.author }}</span>
            </td>
            <td class="px-4 py-3 text-xs text-slate-500 hidden sm:table-cell">{{ book.author || '—' }}</td>
            <td class="px-5 py-3 text-sm font-semibold text-slate-800 text-right tabular-nums">{{ formatNumber(book.downloadCount) }}</td>
          </tr>
          <template #empty>
            <p class="text-sm text-slate-500">Belum ada unduhan.</p>
          </template>
        </BaseTable>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Line, Bar } from 'vue-chartjs'
import BaseButton from '../../components/ui/BaseButton.vue'
import BaseTable from '../../components/ui/BaseTable.vue'
import StatCard from '../../components/ui/StatCard.vue'
import StateBlock from '../../components/StateBlock.vue'
import { getStats } from '../../api/admin.js'
import { getFilters } from '../../api/meta.js'
import { errorMessage } from '../../utils/errors.js'
import { CHART_COLORS, baseOptions } from '../../utils/charts.js'
import {
  BOOK_TYPE_LABELS,
  MEDIA_TYPE_LABELS,
  labelFor,
  formatNumber,
  lastNDays,
  formatShortDay
} from '../../utils/labels.js'

const stats = ref(null)
const state = ref('loading') // loading | ready | error
const error = ref('')
const loadedAt = ref('')
const bookTypes = ref(Object.keys(BOOK_TYPE_LABELS))
const mediaTypes = ref(Object.keys(MEDIA_TYPE_LABELS))

const todayLabel = new Date().toLocaleDateString('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

async function load() {
  state.value = 'loading'
  error.value = ''
  try {
    const [data, meta] = await Promise.all([getStats(), getFilters().catch(() => null)])
    if (meta?.bookTypes?.length) bookTypes.value = meta.bookTypes
    if (meta?.mediaTypes?.length) mediaTypes.value = meta.mediaTypes
    stats.value = data
    loadedAt.value = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    state.value = 'ready'
  } catch (err) {
    if (err.status === 401) return
    error.value = errorMessage(err)
    state.value = 'error'
  }
}

onMounted(load)

// ---------- Kartu ----------
const cards = computed(() => [
  { title: 'Total Buku', value: stats.value.totalBooks, subtitle: 'judul aktif' },
  { title: 'Total Arsip', value: stats.value.totalArchiveItems, subtitle: 'foto, video, dokumen' },
  { title: 'Total Unduhan', value: stats.value.totalDownloads, subtitle: 'sepanjang waktu' },
  { title: 'Unduhan Hari Ini', value: stats.value.downloadsToday, subtitle: 'sejak pukul 00.00' },
  { title: 'Unduhan Minggu Ini', value: stats.value.downloadsThisWeek, subtitle: 'minggu berjalan' }
])

// ---------- Tren harian: 7 hari kalender, hari tanpa unduhan = 0 ----------
const days = computed(() => {
  const counts = new Map((stats.value?.dailyDownloads || []).map((d) => [d.date, d.count]))
  return lastNDays(7).map((date) => ({ date, count: counts.get(date) ?? 0 }))
})

const weekTotal = computed(() => days.value.reduce((sum, d) => sum + d.count, 0))

const lineData = computed(() => ({
  labels: days.value.map((d) => formatShortDay(d.date)),
  datasets: [
    {
      label: 'Unduhan',
      data: days.value.map((d) => d.count),
      borderColor: CHART_COLORS.series,
      backgroundColor: CHART_COLORS.seriesFill,
      fill: true,
      borderWidth: 2,
      tension: 0.25,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: CHART_COLORS.series,
      pointBorderColor: CHART_COLORS.surface,
      pointBorderWidth: 2
    }
  ]
}))

const lineOptions = baseOptions({ yTitle: 'unduhan' })

const lineSummary = computed(() =>
  'Unduhan per hari: ' + days.value.map((d) => `${formatShortDay(d.date)} ${d.count}`).join(', ') + '.'
)

// ---------- Komposisi (batang) ----------
function barDataset(keys, counts, labels) {
  return {
    labels: keys.map((k) => labelFor(labels, k)),
    datasets: [
      {
        label: 'Jumlah',
        data: keys.map((k) => counts?.[k] ?? 0),
        backgroundColor: CHART_COLORS.series,
        hoverBackgroundColor: '#086A87',
        borderRadius: 4,
        borderSkipped: 'start',
        maxBarThickness: 48
      }
    ]
  }
}

const bookTypeData = computed(() => barDataset(bookTypes.value, stats.value?.booksByType, BOOK_TYPE_LABELS))
const mediaTypeData = computed(() => barDataset(mediaTypes.value, stats.value?.archiveByMediaType, MEDIA_TYPE_LABELS))

function barOptions(unit) {
  const opts = baseOptions({ yTitle: unit })
  opts.interaction = { mode: 'nearest', intersect: false, axis: 'x' }
  return opts
}

function summarize(data) {
  return data.labels.map((label, i) => `${label}: ${data.datasets[0].data[i]}`).join(', ') + '.'
}
</script>
