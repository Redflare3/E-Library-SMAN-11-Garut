<template>
  <BaseModal v-model="open" max-width="md" :close-on-backdrop="!loading">
    <template #title>{{ title }}</template>

    <div class="flex items-start gap-3">
      <span
        :class="[
          'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border',
          danger ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-brand-soft text-brand border-brand/20'
        ]"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </span>
      <div class="text-xs text-slate-600 leading-relaxed space-y-2">
        <p>{{ message }}</p>
        <slot />
      </div>
    </div>

    <template #footer>
      <BaseButton variant="outline" :disabled="loading" @click="open = false">Batal</BaseButton>
      <BaseButton :variant="danger ? 'danger' : 'primary'" :loading="loading" @click="$emit('confirm')">
        {{ confirmLabel }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from '../ui/BaseModal.vue'
import BaseButton from '../ui/BaseButton.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, required: true },
  message: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Ya, Lanjutkan' },
  danger: { type: Boolean, default: false },
  // Saat true, modal tidak bisa ditutup (permintaan sedang berjalan)
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'confirm'])

const open = computed({
  get: () => props.modelValue,
  set(value) {
    if (!value && props.loading) return
    emit('update:modelValue', value)
  }
})
</script>
