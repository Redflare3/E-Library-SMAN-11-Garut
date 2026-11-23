<template>
  <div class="flex items-center justify-end gap-1">
    <a
      :href="viewHref"
      target="_blank"
      rel="noopener"
      class="w-8 h-8 rounded-lg text-slate-500 hover:text-brand hover:bg-brand-soft flex items-center justify-center transition-colors"
      title="Lihat (tab baru)"
      aria-label="Lihat di tab baru"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </a>
    <button
      type="button"
      class="w-8 h-8 rounded-lg text-slate-500 hover:text-brand hover:bg-brand-soft flex items-center justify-center transition-colors cursor-pointer"
      title="Edit"
      aria-label="Edit"
      @click="$emit('edit')"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    </button>
    <button
      type="button"
      class="w-8 h-8 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
      title="Hapus"
      aria-label="Hapus"
      @click="$emit('delete')"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  // Rute halaman publik item, dibuka di tab baru
  viewTo: { type: [String, Object], required: true }
})
defineEmits(['edit', 'delete'])

const router = useRouter()
const viewHref = computed(() => router.resolve(props.viewTo).href)
</script>
