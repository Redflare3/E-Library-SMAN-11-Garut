<template>
  <nav v-if="totalPages > 1" class="flex items-center gap-1.5" aria-label="Navigasi halaman">
    <button
      type="button"
      class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      :disabled="page <= 0"
      aria-label="Halaman sebelumnya"
      @click="go(page - 1)"
    >
      ‹
    </button>

    <template v-for="(item, idx) in items" :key="idx">
      <span v-if="item === '…'" class="px-1 text-slate-400">…</span>
      <button
        v-else
        type="button"
        :class="[
          'min-w-8 h-8 px-2 rounded-lg font-bold flex items-center justify-center cursor-pointer transition-colors',
          item === page ? 'bg-brand text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
        ]"
        :aria-current="item === page ? 'page' : undefined"
        @click="go(item)"
      >
        {{ item + 1 }}
      </button>
    </template>

    <button
      type="button"
      class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      :disabled="page >= totalPages - 1"
      aria-label="Halaman berikutnya"
      @click="go(page + 1)"
    >
      ›
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

// `page` dimulai dari 0 (sesuai API); tampilan mulai dari 1
const props = defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true }
})
const emit = defineEmits(['update:page'])

const items = computed(() => {
  const total = props.totalPages
  const current = props.page
  if (total <= 7) return Array.from({ length: total }, (_, i) => i)

  const pages = new Set([0, total - 1, current - 1, current, current + 1])
  if (current <= 2) [1, 2, 3].forEach((p) => pages.add(p))
  if (current >= total - 3) [total - 4, total - 3, total - 2].forEach((p) => pages.add(p))

  const sorted = [...pages].filter((p) => p >= 0 && p < total).sort((a, b) => a - b)
  const result = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push('…')
    result.push(p)
  })
  return result
})

function go(target) {
  if (target < 0 || target >= props.totalPages || target === props.page) return
  emit('update:page', target)
}
</script>
