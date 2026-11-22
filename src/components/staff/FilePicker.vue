<template>
  <div class="space-y-1.5">
    <span v-if="label" class="block text-xs font-semibold text-slate-700">
      {{ label }}
      <span v-if="required" class="text-rose-500">*</span>
    </span>

    <!-- Berkas terpilih -->
    <div
      v-if="modelValue"
      :class="[
        'flex items-center gap-3 p-3 rounded-xl border bg-white',
        shownError ? 'border-rose-300' : 'border-slate-200'
      ]"
    >
      <img v-if="previewUrl" :src="previewUrl" alt="Pratinjau" class="w-10 h-14 object-cover rounded-md border border-slate-200 shrink-0" />
      <span v-else class="w-10 h-10 rounded-lg bg-[#E1EFF6] text-[#005B70] text-[10px] font-bold flex items-center justify-center shrink-0">
        {{ extension }}
      </span>
      <span class="min-w-0 flex-1">
        <span class="block text-xs font-semibold text-slate-800 truncate">{{ modelValue.name }}</span>
        <span class="block text-[11px] text-slate-400">{{ formatBytes(modelValue.size) }}</span>
      </span>
      <button
        type="button"
        class="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        :disabled="disabled"
        :aria-label="`Hapus berkas ${modelValue.name}`"
        @click="clear"
      >
        ✕
      </button>
    </div>

    <!-- Zona tarik & lepas -->
    <label
      v-else
      :class="[
        'flex flex-col items-center justify-center gap-1.5 px-4 py-5 rounded-xl border-2 border-dashed text-center transition-colors',
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
        isDragging ? 'border-[#005B70] bg-[#EAF5F8]' : shownError ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200 bg-slate-50 hover:border-[#005B70]/50'
      ]"
      @dragover.prevent="!disabled && (isDragging = true)"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      <svg class="w-6 h-6 text-[#005B70]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      <span class="text-xs font-semibold text-slate-700">Tarik &amp; lepas berkas, atau <span class="text-[#005B70] underline">pilih berkas</span></span>
      <span class="text-[11px] text-slate-400">{{ acceptLabel }} · maks. {{ formatBytes(maxBytes) }}</span>
      <input
        ref="input"
        type="file"
        class="sr-only"
        :accept="accept"
        :disabled="disabled"
        @change="onChange"
      />
    </label>

    <p v-if="shownError" class="text-xs text-rose-500" role="alert">{{ shownError }}</p>
    <p v-else-if="hint" class="text-xs text-slate-400">{{ hint }}</p>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { formatBytes, fileExtension, fileMatchesAccept, MAX_UPLOAD_BYTES } from '../../utils/labels.js'
import { ERROR_MESSAGES } from '../../utils/errors.js'

const props = defineProps({
  modelValue: { type: Object, default: null }, // File | null
  accept: { type: String, default: '' },
  label: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' }, // error dari server
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  maxBytes: { type: Number, default: MAX_UPLOAD_BYTES },
  // Tampilkan pratinjau gambar (sampul buku)
  imagePreview: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

const input = ref(null)
const isDragging = ref(false)
const localError = ref('')

const shownError = computed(() => localError.value || props.error)
const extension = computed(() => fileExtension(props.modelValue?.name, props.modelValue?.type))
const acceptLabel = computed(() =>
  props.accept
    .split(',')
    .map((a) => a.trim().replace(/^\./, '').toUpperCase())
    .filter(Boolean)
    .join(', ')
)

function pick(file) {
  localError.value = ''
  if (!file) return
  if (!fileMatchesAccept(file, props.accept)) {
    localError.value = `${ERROR_MESSAGES.INVALID_FILE_TYPE} Format yang diterima: ${acceptLabel.value}.`
    return
  }
  if (file.size > props.maxBytes) {
    localError.value = `${ERROR_MESSAGES.FILE_TOO_LARGE} Ukuran maksimal ${formatBytes(props.maxBytes)}.`
    return
  }
  if (file.size === 0) {
    localError.value = 'Berkas kosong (0 byte).'
    return
  }
  emit('update:modelValue', file)
}

function onChange(e) {
  pick(e.target.files?.[0])
  e.target.value = '' // agar berkas yang sama bisa dipilih lagi
}

function onDrop(e) {
  isDragging.value = false
  if (props.disabled) return
  pick(e.dataTransfer?.files?.[0])
}

function clear() {
  localError.value = ''
  emit('update:modelValue', null)
}

// Pratinjau gambar lokal (blob URL dicabut saat berganti / unmount)
const previewUrl = ref(null)
watch(
  () => props.modelValue,
  (file) => {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = props.imagePreview && file && /^image\//.test(file.type) ? URL.createObjectURL(file) : null
    if (file) localError.value = ''
  },
  { immediate: true }
)
onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})
</script>
