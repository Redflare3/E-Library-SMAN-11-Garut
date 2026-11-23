<template>
  <!-- Select filter ringkas. Nilai null = "semua" (opsi pertama, bila allLabel diisi). -->
  <select
    :aria-label="label"
    :value="current"
    :class="[
      'h-9 max-w-full rounded-lg border bg-white pl-3 pr-8 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand',
      isActive ? 'border-brand text-brand font-medium' : 'border-slate-300 text-slate-700'
    ]"
    @change="onChange"
  >
    <option v-if="allLabel" value="">{{ allLabel }}</option>
    <option v-for="opt in options" :key="String(opt.value)" :value="String(opt.value)">
      {{ opt.label }}
    </option>
  </select>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: null },
  // [{ value, label }]; value boleh angka (id kategori)
  options: { type: Array, required: true },
  label: { type: String, required: true },
  // Kosongkan untuk select tanpa opsi "semua" (mis. urutan)
  allLabel: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const current = computed(() => (props.modelValue === null || props.modelValue === undefined ? '' : String(props.modelValue)))
const isActive = computed(() => !!props.allLabel && current.value !== '')

function onChange(e) {
  const opt = props.options.find((o) => String(o.value) === e.target.value)
  emit('update:modelValue', opt ? opt.value : null)
}
</script>
