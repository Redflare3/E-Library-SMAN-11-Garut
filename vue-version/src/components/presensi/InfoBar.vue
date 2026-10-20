<script setup>
import { Clock } from 'lucide-vue-next'
</script>

<template>
  <div class="bg-navy-900 text-white">
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1"
    >
      <div class="flex items-center gap-2 text-xs sm:text-sm">
        <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
        <span
          class="font-semibold tracking-wide text-accent-200 uppercase text-[11px] sm:text-xs"
        >
          Gerbang Literasi Sekolah Digital
        </span>
      </div>
      <div class="flex items-center gap-2 text-xs text-navy-200">
        <Clock class="w-3.5 h-3.5" />
        <span>10.01.29 WIB</span>
        <span class="text-navy-400">•</span>
        <span>Selasa, 13 Okt 2026</span>
      </div>
    </div>
  </div>
</template>
