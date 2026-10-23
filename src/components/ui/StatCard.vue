<template>
  <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs hover:border-slate-200 transition-all flex flex-col justify-between">
    <div class="flex items-start justify-between">
      <div>
        <span class="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
          {{ title }}
        </span>
        <div class="text-3xl sm:text-4xl font-extrabold text-[#0B6B82] mt-1 tracking-tight">
          {{ value }}
        </div>
      </div>

      <div 
        v-if="$slots.icon || icon" 
        class="w-12 h-12 rounded-xl bg-sky-50 text-[#0B6B82] flex items-center justify-center shrink-0 border border-sky-100"
      >
        <slot name="icon">
          <!-- Fallback chart icon -->
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </slot>
      </div>
    </div>

    <div v-if="subtitle || trend" class="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs">
      <span class="text-slate-400">{{ subtitle }}</span>
      <span 
        v-if="trend" 
        :class="[
          'font-semibold inline-flex items-center gap-1',
          trendPositive ? 'text-emerald-600' : 'text-rose-600'
        ]"
      >
        <span>{{ trendPositive ? '↑' : '↓' }}</span>
        <span>{{ trend }}</span>
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  trend: {
    type: String,
    default: ''
  },
  trendPositive: {
    type: Boolean,
    default: true
  },
  icon: {
    type: String,
    default: ''
  }
})
</script>
