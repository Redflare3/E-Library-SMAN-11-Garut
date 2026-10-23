<template>
  <div class="w-full overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-xs">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm text-slate-600">
        <!-- Table Header -->
        <thead class="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-100 font-semibold select-none">
          <tr>
            <slot name="header" />
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody class="divide-y divide-slate-100">
          <slot />
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="empty" class="py-12 text-center text-slate-400">
      <slot name="empty">
        <svg class="mx-auto h-12 w-12 text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-sm font-medium text-slate-500">Tidak ada data ditemukan</p>
      </slot>
    </div>

    <!-- Table Pagination / Footer -->
    <div v-if="$slots.footer" class="px-6 py-3.5 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-500">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  empty: {
    type: Boolean,
    default: false
  }
})
</script>
