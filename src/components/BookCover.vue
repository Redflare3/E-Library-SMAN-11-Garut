<template>
  <!-- Lapisan sampul yang mengisi container induk (induk harus `relative`) -->
  <div class="absolute inset-0">
    <img
      v-if="showImage"
      :src="src"
      :alt="book.title"
      class="w-full h-full object-cover"
      loading="lazy"
      @error="imageFailed = true"
    />

    <!-- Placeholder netral (abu-abu), dipakai di halaman Cari & Filter -->
    <div
      v-else-if="variant === 'neutral'"
      class="w-full h-full bg-slate-100 flex flex-col items-center justify-center p-3 text-center"
    >
      <div class="w-full h-full border-2 border-dashed border-slate-300/80 rounded-lg flex flex-col items-center justify-center p-2 text-slate-400">
        <div class="w-10 h-10 rounded-full bg-slate-200/70 flex items-center justify-center text-slate-400 mb-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>
        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">SAMPUL BUKU DIGITAL</span>
        <span class="text-[9px] text-slate-400 mt-0.5">Perpustakaan SMAN 11 Garut</span>
      </div>
    </div>

    <!-- Placeholder gradien dengan judul (Katalog, Detail, Terkait) -->
    <div
      v-else
      :class="['w-full h-full flex flex-col justify-between text-center text-white', gradient, compact ? 'p-1.5' : 'p-3']"
    >
      <div :class="compact ? 'pt-3' : 'pt-8'">
        <span v-if="!compact" class="text-[8px] tracking-widest text-white/70 uppercase font-mono">E-LIBRARY</span>
        <div
          :class="[
            'font-extrabold uppercase leading-tight drop-shadow-xs line-clamp-3',
            compact ? 'text-[8px]' : 'text-sm mt-1'
          ]"
        >
          {{ book.title }}
        </div>
      </div>

      <div
        v-if="!compact"
        class="w-12 h-12 mx-auto my-auto rounded-full bg-white/10 flex items-center justify-center border border-white/20"
      >
        <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>

      <div :class="['text-white/70 uppercase tracking-wider', compact ? 'text-[5px]' : 'pb-6 text-[7px]']">
        SMAN 11 GARUT
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useMediaUrl } from '../api/media.js'
import { bookCoverUrl } from '../api/books.js'

const props = defineProps({
  // { id, title, hasCover, visibility }
  book: { type: Object, required: true },
  variant: {
    type: String,
    default: 'gradient',
    validator: (v) => ['gradient', 'neutral'].includes(v)
  },
  // Tipografi kecil untuk thumbnail mini (kartu horizontal)
  compact: { type: Boolean, default: false }
})

// Palet gradien tetap; dipilih dari id agar satu buku selalu sama warnanya
const GRADIENTS = [
  'bg-gradient-to-br from-[#0f3d4c] to-[#071f28]',
  'bg-gradient-to-br from-[#3d2c18] to-[#1c1308]',
  'bg-gradient-to-br from-[#0d3f34] to-[#041713]',
  'bg-gradient-to-br from-[#3b1e38] to-[#1a0c18]',
  'bg-gradient-to-br from-[#0a2744] to-[#031120]',
  'bg-gradient-to-br from-[#121c2c] to-[#070b13]',
  'bg-gradient-to-br from-[#132c38] to-[#071319]',
  'bg-gradient-to-br from-[#1d3319] to-[#0a1408]'
]

const gradient = computed(() => GRADIENTS[Math.abs(Number(props.book.id) || 0) % GRADIENTS.length])

const imageFailed = ref(false)
watch(() => props.book.id, () => {
  imageFailed.value = false
})

// Tanpa sampul → tidak ada request sama sekali
const { src } = useMediaUrl(() =>
  props.book.hasCover ? { url: bookCoverUrl(props.book.id), visibility: props.book.visibility } : null
)

const showImage = computed(() => !!src.value && !imageFailed.value)
</script>
