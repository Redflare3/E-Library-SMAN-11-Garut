<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <!-- Foto -->
    <template v-if="type === 'IMAGE'">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </template>
    <!-- Video -->
    <template v-else-if="type === 'VIDEO'">
      <rect x="2" y="5" width="14" height="14" rx="2" />
      <polygon points="22 7 16 12 22 17 22 7" />
    </template>
    <!-- Dokumen / lainnya -->
    <template v-else>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </template>
  </svg>
</template>

<script setup>
defineProps({
  // IMAGE | VIDEO | DOCUMENT
  type: { type: String, default: '' }
})
</script>
