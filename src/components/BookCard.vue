<template>
  <!-- Kartu buku publik: sampul, judul, satu baris keterangan. Seluruh kartu menuju detail. -->
  <router-link :to="`/buku/${book.id}`" class="group block min-w-0 focus:outline-none">
    <div
      class="relative aspect-[3/4] rounded-lg overflow-hidden bg-slate-100 ring-1 ring-slate-200 transition-shadow group-hover:ring-slate-300 group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-brand"
    >
      <BookCover :book="book" />
      <span
        v-if="book.visibility === 'STAFF'"
        class="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-white/95 text-[11px] font-medium text-amber-700"
      >
        {{ VISIBILITY_LABELS.STAFF }}
      </span>
    </div>
    <h3 class="mt-3 text-sm font-medium text-slate-900 leading-snug line-clamp-2 break-words group-hover:text-brand transition-colors">
      {{ book.title }}
    </h3>
    <p v-if="subtitle" class="mt-0.5 text-xs text-slate-500 line-clamp-1">{{ subtitle }}</p>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import BookCover from './BookCover.vue'
import { BOOK_TYPE_LABELS, VISIBILITY_LABELS, labelFor } from '../utils/labels.js'

const props = defineProps({
  // BookSummary
  book: { type: Object, required: true }
})

// Penulis bila ada; jika tidak, jenis bahan
const subtitle = computed(() => props.book.author || labelFor(BOOK_TYPE_LABELS, props.book.bookType))
</script>
