<template>
  <fieldset class="space-y-1.5" :disabled="disabled">
    <legend class="block text-xs font-semibold text-slate-700 mb-1.5">Akses</legend>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <label
        v-for="opt in OPTIONS"
        :key="opt.value"
        :class="[
          'flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors',
          modelValue === opt.value ? 'border-brand bg-brand-soft' : 'border-slate-200 hover:border-slate-300',
          disabled ? 'opacity-60 cursor-not-allowed' : ''
        ]"
      >
        <input
          type="radio"
          class="mt-0.5 text-brand focus:ring-brand"
          :value="opt.value"
          :checked="modelValue === opt.value"
          @change="$emit('update:modelValue', opt.value)"
        />
        <span>
          <span class="block text-xs font-bold text-slate-800">{{ opt.label }}</span>
          <span class="block text-[11px] text-slate-500 leading-snug">{{ opt.help }}</span>
        </span>
      </label>
    </div>
    <p v-if="error" class="text-xs text-rose-500">{{ error }}</p>
    <p v-else-if="note" class="text-xs text-slate-400">{{ note }}</p>
  </fieldset>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: 'PUBLIC' },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: '' },
  note: { type: String, default: '' }
})
defineEmits(['update:modelValue'])

const OPTIONS = [
  { value: 'PUBLIC', label: 'Publik', help: 'Siswa dapat melihat dan mengunduh melalui Wi-Fi sekolah.' },
  { value: 'STAFF', label: 'Khusus Staf', help: 'Hanya guru dan pustakawan yang sudah masuk.' }
]
</script>
