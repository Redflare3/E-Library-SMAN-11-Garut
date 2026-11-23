<template>
  <span
    :class="[
      'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border whitespace-nowrap',
      value === 'STAFF' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
    ]"
  >
    {{ labelFor(VISIBILITY_LABELS, value) }}
  </span>
</template>

<script setup>
import { VISIBILITY_LABELS, labelFor } from '../../utils/labels.js'

defineProps({
  value: { type: String, default: 'PUBLIC' }
})
</script>
