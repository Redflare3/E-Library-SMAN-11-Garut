<template>
  <div class="bg-white rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
    <div class="flex items-start justify-between">
      <div>
        <span class="text-sm text-slate-500 block">
          {{ title }}
        </span>
        <div class="text-2xl sm:text-3xl font-semibold text-slate-900 mt-1 tracking-tight tabular-nums">
          {{ value }}
        </div>
      </div>

      <div 
        v-if="$slots.icon || icon" 
        class="w-10 h-10 rounded-lg bg-brand-soft text-brand flex items-center justify-center shrink-0"
      >
        <slot name="icon">
          <!-- Fallback chart icon -->
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </slot>
      </div>
    </div>

    <div v-if="subtitle || trend" class="mt-3 flex items-center justify-between text-xs">
      <span class="text-slate-500">{{ subtitle }}</span>
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
