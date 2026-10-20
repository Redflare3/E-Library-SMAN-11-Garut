<script setup>
import { Info, Check } from 'lucide-vue-next'
import { librarianInfo } from '../../data/mockData'
</script>

<template>
  <div class="bg-[#f0f6fa] rounded-2xl p-5 border border-sky-100 mt-5">
    <!-- Header -->
    <div class="flex items-center gap-2 mb-3.5">
      <Info class="w-4 h-4 text-sky-600" />
      <h4 class="text-xs font-bold text-navy-900 tracking-wide">
        Petugas Layanan Hari Ini
      </h4>
    </div>

    <!-- Librarian profile box -->
    <div class="bg-white rounded-xl p-3.5 border border-sky-100/70 shadow-2xs flex items-center gap-3 mb-4">
      <div class="w-10 h-10 rounded-full bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center shrink-0">
        {{ librarianInfo.initials }}
      </div>
      <div>
        <p class="text-xs sm:text-sm font-bold text-navy-900">
          {{ librarianInfo.name }}
        </p>
        <p class="text-[11px] text-text-secondary mt-0.5">
          {{ librarianInfo.role }}
        </p>
      </div>
    </div>

    <!-- Rules Checklist -->
    <ul class="space-y-2">
      <li
        v-for="(rule, idx) in librarianInfo.rules"
        :key="idx"
        class="flex items-start gap-2.5"
      >
        <Check class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
        <span class="text-[11px] sm:text-xs text-text-secondary leading-relaxed">
          {{ rule }}
        </span>
      </li>
    </ul>
  </div>
</template>
