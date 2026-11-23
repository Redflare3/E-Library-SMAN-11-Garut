<template>
  <span
    :class="[
      'inline-flex items-center font-medium rounded-md select-none',
      sizeClasses[size],
      variantClasses[variant]
    ]"
  >
    <slot name="prefix" />
    <slot />
  </span>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (s) => ['sm', 'md'].includes(s)
  }
})

const sizeClasses = {
  sm: 'px-1.5 py-0.5 text-[11px] gap-1',
  md: 'px-2 py-0.5 text-xs gap-1.5'
}

const variantClasses = {
  primary: 'bg-brand-soft text-brand',
  secondary: 'bg-white/20 text-white border border-white/30 backdrop-blur-xs',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-rose-50 text-rose-700',
  neutral: 'bg-slate-100 text-slate-700'
}
</script>
