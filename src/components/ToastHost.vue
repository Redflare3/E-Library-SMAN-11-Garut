<template>
  <transition name="toast">
    <div
      v-if="toast.state.visible"
      :key="toast.state.id"
      class="fixed bottom-6 right-6 z-[70] bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 text-xs max-w-[calc(100vw-3rem)]"
      role="status"
      aria-live="polite"
    >
      <span :class="['w-2 h-2 rounded-full shrink-0', dotClass]"></span>
      <span>{{ toast.state.message }}</span>
      <button
        type="button"
        class="ml-1 text-slate-400 hover:text-white cursor-pointer"
        aria-label="Tutup notifikasi"
        @click="toast.hide()"
      >
        ✕
      </button>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { useToast } from '../composables/toast.js'

const toast = useToast()

const dotClass = computed(() => ({
  success: 'bg-emerald-400',
  error: 'bg-rose-400',
  info: 'bg-sky-400'
}[toast.state.tone] || 'bg-emerald-400'))
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.95);
}
</style>
