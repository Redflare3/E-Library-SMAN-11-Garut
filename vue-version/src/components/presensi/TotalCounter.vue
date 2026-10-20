<script setup>
defineProps({
  count: {
    type: Number,
    default: 142
  }
})
</script>

<template>
  <div class="px-4 sm:px-0 mt-6">
    <p class="text-[11px] font-bold tracking-widest text-text-secondary uppercase">
      Total Masuk Hari Ini
    </p>
    <p class="text-5xl sm:text-6xl font-extrabold text-navy-800 mt-1 tabular-nums">
      {{ count.toLocaleString('id-ID') }}
    </p>
  </div>
</template>
