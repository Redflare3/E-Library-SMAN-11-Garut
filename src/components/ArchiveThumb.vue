<template>
  <!-- Lapisan thumbnail yang mengisi container induk (induk harus `relative`) -->
  <div class="absolute inset-0 bg-slate-100">
    <img
      v-if="showImage"
      :src="src"
      :alt="item.title"
      class="w-full h-full object-cover"
      loading="lazy"
      @error="imageFailed = true"
    />

    <!-- Cadangan: ikon jenis media (saat blob STAFF dimuat atau gambar gagal) -->
    <div v-else class="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
      <MediaTypeIcon :type="item.mediaType" class="w-9 h-9" />
      <span class="text-[10px] font-bold uppercase tracking-wider">{{ labelFor(MEDIA_TYPE_LABELS, item.mediaType) }}</span>
    </div>

    <!-- Badge jenis media (kiri atas) -->
    <span class="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/95 text-slate-800 border border-slate-200/80 shadow-xs">
      <MediaTypeIcon :type="item.mediaType" class="w-3 h-3 text-[#005B70]" />
      {{ labelFor(MEDIA_TYPE_LABELS, item.mediaType) }}
    </span>

    <!-- Badge khusus staf (kanan atas) -->
    <span
      v-if="item.visibility === 'STAFF'"
      class="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs border bg-amber-50 text-amber-700 border-amber-200"
    >
      Khusus Staf
    </span>

    <!-- Video: ikon putar di tengah + durasi -->
    <template v-if="item.mediaType === 'VIDEO'">
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span class="w-11 h-11 rounded-full bg-black/45 border border-white/40 flex items-center justify-center backdrop-blur-[2px]">
          <svg class="w-5 h-5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>
      <span
        v-if="duration"
        class="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-semibold tabular-nums"
      >
        {{ duration }}
      </span>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useMediaUrl } from '../api/media.js'
import { archiveThumbnailUrl } from '../api/archive.js'
import { MEDIA_TYPE_LABELS, labelFor, formatDuration } from '../utils/labels.js'
import MediaTypeIcon from './MediaTypeIcon.vue'

const props = defineProps({
  // ArchiveSummary: { id, title, mediaType, visibility, durationSeconds }
  item: { type: Object, required: true },
  // Opsional: cache buster setelah unggah (Tahap 4), mis. timestamp
  cacheKey: { type: [String, Number], default: null }
})

const imageFailed = ref(false)
watch(() => [props.item.id, props.cacheKey], () => {
  imageFailed.value = false
})

const { src } = useMediaUrl(() => {
  const base = archiveThumbnailUrl(props.item.id)
  return {
    url: props.cacheKey ? `${base}?v=${encodeURIComponent(props.cacheKey)}` : base,
    visibility: props.item.visibility
  }
})

const showImage = computed(() => !!src.value && !imageFailed.value)
const duration = computed(() => formatDuration(props.item.durationSeconds))
</script>
