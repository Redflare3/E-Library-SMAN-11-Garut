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

    <!-- Placeholder mini (tabel staf/admin) -->
    <div
      v-else-if="compact"
      :class="['w-full h-full flex flex-col justify-between text-center text-white p-1.5', gradient]"
    >
      <div class="pt-3">
        <div class="font-extrabold uppercase leading-tight drop-shadow-xs line-clamp-3 text-[8px]">
          {{ book.title }}
        </div>
      </div>
      <div class="text-white/70 uppercase tracking-wider text-[5px]">SMAN 11 GARUT</div>
    </div>

    <!-- Placeholder polos: judul saja -->
    <div v-else :class="['w-full h-full flex items-end p-4', gradient]">
      <span class="text-white text-sm font-semibold leading-snug line-clamp-5 break-words">
        {{ book.title }}
      </span>
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
  // Tipografi kecil untuk thumbnail mini (tabel staf/admin)
  compact: { type: Boolean, default: false }
})

// Palet tetap; dipilih dari id agar satu buku selalu sama warnanya
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
