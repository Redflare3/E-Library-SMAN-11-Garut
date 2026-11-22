<template>
  <li
    :class="[
      'grid grid-cols-1 md:grid-cols-[2rem_minmax(0,1.1fr)_minmax(0,1.6fr)_10rem_2rem] gap-2 md:gap-3 md:items-center px-3 py-3 border-b border-slate-100',
      row.status === 'uploading' || row.status === 'processing' ? 'bg-[#EAF5F8]/60' : ''
    ]"
  >
    <span class="hidden md:block text-xs font-mono text-slate-400 tabular-nums">{{ index + 1 }}</span>

    <!-- Berkas -->
    <span class="min-w-0">
      <span class="block text-xs font-semibold text-slate-700 truncate" :title="row.file.name">{{ row.file.name }}</span>
      <span class="block text-[11px] text-slate-400">{{ formatBytes(row.file.size) }}</span>
    </span>

    <!-- Judul (+ penulis untuk buku) -->
    <span class="min-w-0 space-y-1.5">
      <input
        :value="row.title"
        type="text"
        maxlength="255"
        :aria-label="`Judul untuk ${row.file.name}`"
        placeholder="Judul"
        :disabled="!editable"
        :class="[
          'w-full rounded-lg border bg-white text-xs text-slate-800 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0B6B82]/30 focus:border-[#0B6B82] disabled:bg-transparent disabled:border-transparent disabled:px-0 disabled:font-semibold',
          editable && !row.title.trim() ? 'border-rose-300' : 'border-slate-200'
        ]"
        @input="$emit('update', { title: $event.target.value })"
      />
      <input
        v-if="showAuthor && (editable || row.author)"
        :value="row.author"
        type="text"
        maxlength="255"
        :aria-label="`Penulis untuk ${row.file.name}`"
        placeholder="Penulis (opsional)"
        :disabled="!editable"
        class="w-full rounded-lg border border-slate-200 bg-white text-xs text-slate-600 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0B6B82]/30 disabled:bg-transparent disabled:border-transparent disabled:px-0"
        @input="$emit('update', { author: $event.target.value })"
      />
      <span v-if="editable && !row.title.trim()" class="block text-[11px] text-rose-500">Judul wajib diisi.</span>
    </span>

    <!-- Status -->
    <span class="min-w-0 text-xs">
      <template v-if="row.status === 'uploading' || row.status === 'processing'">
        <span class="font-semibold text-[#005B70]">{{ row.status === 'processing' ? 'Memproses…' : `Mengunggah ${percent}%` }}</span>
        <span class="mt-1 block h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <span class="block h-full bg-[#005B70] rounded-full transition-[width]" :style="{ width: row.status === 'processing' ? '100%' : `${percent}%` }"></span>
        </span>
      </template>
      <template v-else>
        <span :class="['inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border', STATUS[row.status].cls]">
          {{ STATUS[row.status].label }}
        </span>
        <a
          v-if="row.status === 'done' && resultHref"
          :href="resultHref"
          target="_blank"
          rel="noopener"
          class="ml-2 text-[11px] font-semibold text-[#005B70] hover:underline"
        >Lihat</a>
        <span v-if="row.message" class="block mt-1 text-[11px] leading-snug" :class="row.status === 'failed' ? 'text-rose-600' : 'text-slate-500'">
          {{ row.message }}
        </span>
      </template>
    </span>

    <!-- Hapus dari antrean -->
    <span class="flex md:justify-end">
      <button
        v-if="editable || row.status === 'done' || row.status === 'skipped'"
        type="button"
        class="w-7 h-7 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center cursor-pointer disabled:opacity-40"
        :disabled="locked"
        :aria-label="`Keluarkan ${row.file.name} dari antrean`"
        @click="$emit('remove')"
      >
        ✕
      </button>
    </span>
  </li>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatBytes } from '../../utils/labels.js'

const props = defineProps({
  // { key, file, title, author, status, message, resultId }
  row: { type: Object, required: true },
  index: { type: Number, required: true },
  target: { type: String, default: 'book' }, // book | archive
  showAuthor: { type: Boolean, default: false },
  // Antrean sedang berjalan: baris tidak boleh diubah/dihapus
  locked: { type: Boolean, default: false },
  // Progres XHR untuk baris yang sedang diunggah
  progress: { type: Object, default: () => ({ loaded: 0, total: 0 }) }
})
defineEmits(['update', 'remove'])

const STATUS = {
  waiting: { label: 'Menunggu', cls: 'bg-slate-50 text-slate-500 border-slate-200' },
  done: { label: 'Berhasil', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  skipped: { label: 'Dilewati', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  failed: { label: 'Gagal', cls: 'bg-rose-50 text-rose-700 border-rose-200' },
  cancelled: { label: 'Dibatalkan', cls: 'bg-slate-100 text-slate-600 border-slate-300' },
  uploading: { label: 'Mengunggah', cls: '' },
  processing: { label: 'Memproses', cls: '' }
}

const router = useRouter()

// Judul bisa diubah selama baris belum selesai
const editable = computed(() => !props.locked && ['waiting', 'failed', 'cancelled'].includes(props.row.status))

const percent = computed(() =>
  props.progress.total ? Math.min(100, Math.floor((props.progress.loaded / props.progress.total) * 100)) : 0
)

const resultHref = computed(() => {
  if (!props.row.resultId) return null
  const to = props.target === 'archive'
    ? { name: 'Arsip', query: { item: String(props.row.resultId) } }
    : `/buku/${props.row.resultId}`
  return router.resolve(to).href
})
</script>
