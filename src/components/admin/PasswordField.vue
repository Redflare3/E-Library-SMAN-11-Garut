<template>
  <div class="space-y-1.5">
    <label :for="id" class="block text-xs font-semibold text-slate-700">
      {{ label }} <span v-if="required" class="text-rose-500">*</span>
    </label>
    <div class="flex gap-2">
      <div class="relative flex-1">
        <input
          :id="id"
          :type="visible ? 'text' : 'password'"
          :value="modelValue"
          autocomplete="new-password"
          :disabled="disabled"
          :class="[
            'w-full rounded-xl border bg-white text-sm text-slate-800 pl-3.5 pr-10 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-[#0B6B82]/30 focus:border-[#0B6B82]',
            error ? 'border-rose-300' : 'border-slate-200 hover:border-slate-300'
          ]"
          @input="$emit('update:modelValue', $event.target.value)"
        />
        <button
          type="button"
          class="absolute inset-y-0 right-0 px-3 text-slate-400 hover:text-slate-700 cursor-pointer"
          :aria-label="visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
          @click="visible = !visible"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <template v-if="visible">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </template>
            <template v-else>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </template>
          </svg>
        </button>
      </div>
      <BaseButton variant="outline" size="sm" :disabled="disabled" @click="generate">Buat Acak</BaseButton>
    </div>
    <p v-if="error" class="text-xs text-rose-500">{{ error }}</p>
    <p v-else class="text-xs text-slate-400">Minimal 6 karakter. Sampaikan kata sandi langsung kepada pemilik akun.</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseButton from '../ui/BaseButton.vue'

defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: 'Kata Sandi' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  id: { type: String, default: () => 'pw-' + Math.random().toString(36).slice(2, 9) }
})
const emit = defineEmits(['update:modelValue'])

const visible = ref(false)

// Tanpa karakter yang mudah tertukar (0/O, 1/l/I)
const ALPHABET = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generate() {
  const bytes = new Uint32Array(10)
  crypto.getRandomValues(bytes)
  const pw = Array.from(bytes, (n) => ALPHABET[n % ALPHABET.length]).join('')
  visible.value = true // tampilkan agar bisa dicatat
  emit('update:modelValue', pw)
}
</script>
