<template>
  <!-- Loading: kerangka kartu -->
  <div
    v-if="state === 'loading'"
    :class="['grid', plain ? 'gap-x-5 gap-y-8' : 'gap-5', gridClass]"
    aria-busy="true"
    aria-label="Memuat"
  >
    <div
      v-for="n in skeletonCount"
      :key="n"
      :class="['space-y-3 animate-pulse', plain ? '' : 'bg-white rounded-xl p-4 border border-slate-200']"
    >
      <div :class="['w-full bg-slate-100', plain ? 'rounded-lg' : 'rounded-xl', aspectClass]"></div>
      <div class="h-3 rounded bg-slate-100 w-4/5"></div>
      <div class="h-3 rounded bg-slate-100 w-1/2"></div>
    </div>
  </div>

  <!-- Kosong / Error (varian polos: tanpa kotak, untuk halaman publik) -->
  <div v-else-if="plain" class="py-16 text-center space-y-2">
    <h3 class="text-base font-medium text-slate-900">{{ title }}</h3>
    <p v-if="message" class="text-sm text-slate-500 max-w-sm mx-auto">{{ message }}</p>
    <div class="pt-2">
      <button
        v-if="state === 'error'"
        type="button"
        class="px-4 py-2 rounded-lg bg-brand hover:bg-brand-dark text-white text-sm font-medium transition-colors cursor-pointer"
        @click="$emit('retry')"
      >
        Coba lagi
      </button>
      <button
        v-else-if="resetLabel"
        type="button"
        class="text-sm font-medium text-brand hover:underline cursor-pointer"
        @click="$emit('reset')"
      >
        {{ resetLabel }}
      </button>
      <slot />
    </div>
  </div>

  <!-- Kosong / Error (varian kartu, area staf) -->
  <div v-else class="bg-white rounded-xl border border-slate-200 px-6 py-12 text-center space-y-2">
    <div
      :class="[
        'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3',
        state === 'error' ? 'bg-rose-50 text-rose-400' : 'bg-slate-100 text-slate-400'
      ]"
    >
      <svg v-if="state === 'error'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <svg v-else class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </div>
    <h3 class="text-base font-medium text-slate-900">{{ title }}</h3>
    <p v-if="message" class="text-sm text-slate-500 max-w-sm mx-auto">{{ message }}</p>
    <button
      v-if="state === 'error'"
      type="button"
      class="mt-2 px-4 h-10 rounded-lg bg-brand hover:bg-brand-dark text-white text-sm font-medium transition-colors cursor-pointer"
      @click="$emit('retry')"
    >
      Coba Lagi
    </button>
    <button
      v-else-if="resetLabel"
      type="button"
      class="mt-2 px-4 h-10 rounded-lg bg-brand hover:bg-brand-dark text-white text-sm font-medium transition-colors cursor-pointer"
      @click="$emit('reset')"
    >
      {{ resetLabel }}
    </button>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  state: {
    type: String,
    required: true,
    validator: (s) => ['loading', 'empty', 'error'].includes(s)
  },
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  // Tombol pada state kosong (mis. "Hapus filter"); kosongkan untuk menyembunyikan
  resetLabel: { type: String, default: '' },
  skeletonCount: { type: Number, default: 4 },
  gridClass: { type: String, default: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' },
  // Rasio kerangka gambar (buku 3:4, arsip 4:3)
  aspectClass: { type: String, default: 'aspect-[3/4]' },
  // Tampilan polos tanpa kartu/kotak (halaman publik)
  plain: { type: Boolean, default: false }
})
defineEmits(['retry', 'reset'])
</script>
