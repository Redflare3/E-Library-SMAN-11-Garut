<script setup>
import { recentVisitors } from '../../data/mockData'
</script>

<template>
  <div class="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-5 sm:px-6 pt-5 pb-3 border-b border-border">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
        <h3 class="text-base font-bold text-navy-800">
          Pengunjung Terkini
        </h3>
      </div>
      <span class="inline-flex items-center px-2.5 py-0.5 bg-sky-50 text-sky-600 text-[10px] font-bold rounded-md border border-sky-100">
        Real-time
      </span>
    </div>

    <!-- Visitor list -->
    <ul class="divide-y divide-border">
      <li
        v-for="v in recentVisitors"
        :key="v.id"
        class="flex items-start gap-3.5 px-5 sm:px-6 py-3.5 hover:bg-surface-alt/60 transition-colors"
      >
        <!-- Avatar Initials -->
        <div
          class="shrink-0 w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs"
        >
          {{ v.initials }}
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <p class="text-xs sm:text-sm font-bold text-navy-900 truncate">
            {{ v.name }}
          </p>
          <p class="text-[11px] text-sky-600 font-semibold mt-0.5">
            {{ v.class }} • {{ v.activity }}
          </p>
          <p class="text-[11px] text-text-muted mt-0.5">
            {{ v.location }}
          </p>
        </div>

        <!-- Time Ago -->
        <span class="shrink-0 text-[10px] font-medium text-text-muted whitespace-nowrap pt-0.5">
          {{ v.timeAgo }}
        </span>
      </li>
    </ul>
  </div>
</template>
