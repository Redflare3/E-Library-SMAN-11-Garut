<template>
  <span
    :class="[
      'inline-flex items-center font-semibold rounded-full select-none',
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
  sm: 'px-2 py-0.5 text-[10px] gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5'
}

const variantClasses = {
  primary: 'bg-sky-100/70 text-[#0B6B82] border border-sky-200/50',
  secondary: 'bg-white/20 text-white border border-white/30 backdrop-blur-xs',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  danger: 'bg-rose-50 text-rose-700 border border-rose-200',
  neutral: 'bg-slate-100 text-slate-700 border border-slate-200'
}
</script>
