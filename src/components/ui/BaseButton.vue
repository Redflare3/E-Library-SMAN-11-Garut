<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses[size],
      variantClasses[variant],
      block ? 'w-full' : '',
      roundedClasses[rounded]
    ]"
    @click="$emit('click', $event)"
  >
    <!-- Loading spinner SVG -->
    <svg 
      v-if="loading" 
      class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
    </svg>

    <slot name="prefix" />
    <slot />
    <slot name="suffix" />
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'outline', 'ghost', 'danger'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (s) => ['sm', 'md', 'lg'].includes(s)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  },
  rounded: {
    type: String,
    default: 'lg'
  }
})

defineEmits(['click'])

const sizeClasses = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2'
}

const variantClasses = {
  primary: 'bg-brand hover:bg-brand-dark text-white focus-visible:ring-brand/40',
  secondary: 'bg-brand-soft text-brand hover:bg-brand-soft/70 focus-visible:ring-brand/30',
  outline: 'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 focus-visible:ring-slate-300',
  ghost: 'text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-200',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white focus-visible:ring-rose-400'
}

const roundedClasses = {
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full'
}
</script>
