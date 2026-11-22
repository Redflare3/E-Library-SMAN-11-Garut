<template>
  <div class="space-y-1.5" role="status" aria-live="polite">
    <div class="flex items-center justify-between text-[11px] font-semibold">
      <span class="text-[#005B70]">{{ processing ? 'Memproses…' : `Mengunggah ${percent}%` }}</span>
      <span v-if="!processing && total" class="text-slate-400 tabular-nums">
        {{ formatBytes(loaded) }} dari {{ formatBytes(total) }}
      </span>
      <span v-else-if="processing" class="text-slate-400">Server sedang menyimpan berkas</span>
    </div>
    <div class="h-2 rounded-full bg-slate-100 overflow-hidden">
      <div
        v-if="!processing"
        class="h-full bg-[#005B70] rounded-full transition-[width] duration-200"
        :style="{ width: `${percent}%` }"
      ></div>
      <div v-else class="h-full w-1/3 bg-[#005B70] rounded-full animate-indeterminate"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatBytes } from '../../utils/labels.js'

const props = defineProps({
  loaded: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  processing: { type: Boolean, default: false }
})

const percent = computed(() =>
  props.total ? Math.min(100, Math.floor((props.loaded / props.total) * 100)) : 0
)
</script>

<style scoped>
@keyframes indeterminate {
  from { transform: translateX(-100%); }
  to { transform: translateX(300%); }
}
.animate-indeterminate {
  animation: indeterminate 1.2s ease-in-out infinite;
}
</style>
