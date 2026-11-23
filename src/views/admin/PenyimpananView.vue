<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-slate-900">Penyimpanan</h1>
        <p class="text-sm text-slate-500 mt-1">Ruang disk server perpustakaan dan pemakaiannya per jenis koleksi.</p>
      </div>
      <BaseButton variant="outline" :loading="state === 'loading' && !!data" @click="load">Muat Ulang</BaseButton>
    </div>

    <StateBlock v-if="state === 'error'" state="error" title="Gagal memuat data penyimpanan" :message="error" @retry="load" />

    <div v-else-if="!data" class="space-y-5 animate-pulse" aria-busy="true">
      <div class="h-40 rounded-xl bg-white border border-slate-100"></div>
      <div class="h-72 rounded-xl bg-white border border-slate-100"></div>
    </div>

    <template v-else>
      <!-- Disk -->
      <section v-if="!data.available" class="rounded-xl border border-rose-200 bg-rose-50 p-5 space-y-2" role="alert">
        <h2 class="text-sm font-bold text-rose-800">Drive penyimpanan tidak terhubung</h2>
        <p class="text-xs text-rose-700 leading-relaxed">
          Katalog dan pencarian tetap berjalan, tetapi membaca, mengunduh, mengunggah, dan menghapus permanen berkas akan gagal
          sampai drive terpasang kembali (beserta berkas penanda <code class="font-mono">.library-storage</code>). Jumlah di bawah berasal dari basis data.
        </p>
      </section>

      <section v-else class="bg-white rounded-xl border border-slate-100 shadow-xs p-5 sm:p-6 space-y-4">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 class="text-sm font-bold text-slate-800">Ruang Disk</h2>
            <p class="text-2xl font-semibold text-slate-900 mt-1 tabular-nums">
              {{ formatBytes(data.freeBytes) }} <span class="text-sm font-semibold text-slate-500">kosong dari {{ formatBytes(data.totalBytes) }}</span>
            </p>
          </div>
          <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border', diskStatus.cls]">
            <span aria-hidden="true">{{ diskStatus.icon }}</span>{{ diskStatus.label }}
          </span>
        </div>

        <!-- Bar terpakai + penanda batas cadangan -->
        <div>
          <div class="relative h-4 rounded-full bg-slate-100 overflow-hidden" role="img" :aria-label="`Terpakai ${usedPercent}% dari kapasitas disk`">
            <div class="h-full rounded-full" :style="{ width: `${usedPercent}%`, backgroundColor: diskStatus.bar }"></div>
            <div class="absolute inset-y-0 w-0.5 bg-slate-700" :style="{ left: `${reservePercent}%` }" aria-hidden="true"></div>
          </div>
          <div class="flex flex-wrap justify-between gap-2 mt-2 text-[11px] text-slate-500">
            <span>Terpakai {{ formatBytes(data.usedBytes) }} ({{ usedPercent }}%)</span>
            <span>Garis gelap = batas cadangan: unggahan ditolak bila sisa di bawah {{ formatBytes(data.minFreeBytes) }}</span>
          </div>
        </div>

        <p v-if="diskStatus.key !== 'ok'" class="text-xs text-slate-600">
          {{ diskStatus.key === 'full'
            ? 'Unggahan ditolak sampai ruang dikosongkan.'
            : 'Ruang kosong hampir mencapai batas cadangan.' }}
          Kosongkan <router-link to="/admin/sampah" class="font-semibold text-brand underline">Tempat Sampah</router-link>
          atau pindahkan berkas besar.
        </p>
      </section>

      <!-- Pemakaian per jenis -->
      <section class="space-y-3">
        <div class="flex items-baseline justify-between gap-2">
          <h2 class="text-sm font-bold text-slate-800">Pemakaian per Jenis</h2>
          <router-link v-if="trashTotal.count" to="/admin/sampah" class="text-xs font-semibold text-brand hover:underline">
            Lihat Tempat Sampah ({{ formatNumber(trashTotal.count) }} item, {{ formatBytes(trashTotal.bytes) }})
          </router-link>
        </div>
        <BaseTable>
          <template #header>
            <th class="px-4 py-3">Jenis</th>
            <th class="px-4 py-3 text-right">Aktif</th>
            <th class="px-4 py-3 text-right">Tempat Sampah</th>
            <th class="px-4 py-3 w-1/3 hidden sm:table-cell">Porsi ruang</th>
          </template>
          <tr v-for="row in rows" :key="row.label" class="hover:bg-slate-50/60">
            <td class="px-4 py-3 text-sm font-semibold text-slate-800 whitespace-nowrap">{{ row.label }}</td>
            <td class="px-4 py-3 text-xs text-right tabular-nums whitespace-nowrap">
              <template v-if="row.count !== null">{{ formatNumber(row.count) }} · </template>{{ formatBytes(row.bytes) }}
            </td>
            <td class="px-4 py-3 text-xs text-right tabular-nums whitespace-nowrap text-slate-500">
              <template v-if="row.trashCount !== null">{{ formatNumber(row.trashCount) }} · {{ formatBytes(row.trashBytes) }}</template>
              <template v-else>—</template>
            </td>
            <td class="px-4 py-3 hidden sm:table-cell">
              <div class="flex items-center gap-2">
                <div class="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div class="h-full rounded-full" :style="{ width: `${share(row)}%`, backgroundColor: CHART_SERIES }"></div>
                </div>
                <span class="text-[11px] text-slate-500 tabular-nums w-10 text-right">{{ share(row) }}%</span>
              </div>
            </td>
          </tr>
          <tr class="bg-slate-50/80 font-bold">
            <td class="px-4 py-3 text-sm text-slate-800">Total</td>
            <td class="px-4 py-3 text-xs text-right tabular-nums whitespace-nowrap">{{ formatNumber(total.count) }} · {{ formatBytes(total.bytes) }}</td>
            <td class="px-4 py-3 text-xs text-right tabular-nums whitespace-nowrap">{{ formatNumber(trashTotal.count) }} · {{ formatBytes(trashTotal.bytes) }}</td>
            <td class="px-4 py-3 hidden sm:table-cell text-[11px] text-slate-500">{{ formatBytes(grandBytes) }} dipakai koleksi</td>
          </tr>
        </BaseTable>
        <p class="text-[11px] text-slate-400">
          Ukuran buku dan arsip diambil dari basis data; thumbnail dan berkas sementara diukur langsung di disk. Sampul buku tidak dihitung terpisah.
        </p>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import BaseTable from '../../components/ui/BaseTable.vue'
import StateBlock from '../../components/StateBlock.vue'
import { getStorage } from '../../api/admin.js'
import { CHART_COLORS } from '../../utils/charts.js'
import { errorMessage } from '../../utils/errors.js'
import { MEDIA_TYPE_LABELS, formatBytes, formatNumber } from '../../utils/labels.js'

const CHART_SERIES = CHART_COLORS.series

const data = ref(null)
const state = ref('loading')
const error = ref('')

async function load() {
  state.value = 'loading'
  try {
    data.value = await getStorage()
    state.value = 'ready'
  } catch (err) {
    if (err.status === 401) return
    error.value = errorMessage(err)
    state.value = 'error'
  }
}
onMounted(load)

// ---------- Disk ----------
const pct = (part, whole) => (whole ? Math.min(100, Math.max(0, Math.round((part / whole) * 100))) : 0)
const usedPercent = computed(() => pct(data.value?.usedBytes, data.value?.totalBytes))
const reservePercent = computed(() => pct((data.value?.totalBytes ?? 0) - (data.value?.minFreeBytes ?? 0), data.value?.totalBytes))

// Status disertai ikon + label (bukan warna saja)
const diskStatus = computed(() => {
  const free = data.value?.freeBytes ?? 0
  const min = data.value?.minFreeBytes ?? 0
  if (free < min) return { key: 'full', label: 'Penuh', icon: '⛔', cls: 'bg-rose-50 text-rose-700 border-rose-200', bar: '#e11d48' }
  if (free <= min * 2) return { key: 'low', label: 'Hampir penuh', icon: '⚠', cls: 'bg-amber-50 text-amber-700 border-amber-200', bar: '#d97706' }
  return { key: 'ok', label: 'Aman', icon: '✓', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', bar: CHART_COLORS.series }
})

// ---------- Tabel ----------
const bucket = (b) => ({
  count: b?.count ?? 0,
  bytes: b?.bytes ?? 0,
  trashCount: b?.trashCount ?? 0,
  trashBytes: b?.trashBytes ?? 0
})

const rows = computed(() => {
  const d = data.value
  if (!d) return []
  const archive = d.archive || {}
  return [
    { label: 'Buku', ...bucket(d.books) },
    ...['IMAGE', 'VIDEO', 'DOCUMENT'].map((t) => ({ label: `Arsip · ${MEDIA_TYPE_LABELS[t]}`, ...bucket(archive[t]) })),
    { label: 'Thumbnail', count: null, bytes: d.thumbnailsBytes ?? 0, trashCount: null, trashBytes: 0 },
    { label: 'Berkas sementara', count: null, bytes: d.tempBytes ?? 0, trashCount: null, trashBytes: 0 }
  ]
})

const total = computed(() =>
  rows.value.reduce((t, r) => ({ count: t.count + (r.count ?? 0), bytes: t.bytes + r.bytes }), { count: 0, bytes: 0 })
)
const trashTotal = computed(() =>
  rows.value.reduce(
    (t, r) => ({ count: t.count + (r.trashCount ?? 0), bytes: t.bytes + (r.trashBytes ?? 0) }),
    { count: 0, bytes: 0 }
  )
)
// Porsi dihitung dari seluruh ruang yang dipakai koleksi (aktif + tempat sampah)
const grandBytes = computed(() => total.value.bytes + trashTotal.value.bytes)
const share = (row) => pct(row.bytes + (row.trashBytes ?? 0), grandBytes.value)
</script>
