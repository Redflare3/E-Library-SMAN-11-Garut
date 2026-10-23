<template>
  <div class="space-y-1.5 w-full">
    <label v-if="label" :for="id" class="block text-xs font-semibold text-slate-700">
      {{ label }}
      <span v-if="required" class="text-rose-500">*</span>
    </label>

    <div class="relative rounded-xl shadow-xs">
      <!-- Prefix Icon Slot -->
      <div 
        v-if="$slots.prefix" 
        class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"
      >
        <slot name="prefix" />
      </div>

      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="[
          'w-full rounded-xl border bg-white text-sm text-slate-800 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B6B82]/30 focus:border-[#0B6B82]',
          $slots.prefix ? 'pl-10' : 'pl-3.5',
          $slots.suffix ? 'pr-10' : 'pr-3.5',
          sizeClasses[size],
          error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200' : 'border-slate-200 hover:border-slate-300',
          disabled ? 'bg-slate-50 cursor-not-allowed text-slate-400' : ''
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
      />

      <!-- Suffix Icon Slot -->
      <div 
        v-if="$slots.suffix" 
        class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400"
      >
        <slot name="suffix" />
      </div>
    </div>

    <!-- Error or Help Text -->
    <p v-if="error" class="text-xs text-rose-500">{{ error }}</p>
    <p v-else-if="helpText" class="text-xs text-slate-400">{{ helpText }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  id: {
    type: String,
    default: () => 'input-' + Math.random().toString(36).substring(2, 9)
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  helpText: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md',
    validator: (s) => ['sm', 'md', 'lg'].includes(s)
  }
})

defineEmits(['update:modelValue'])

const sizeClasses = {
  sm: 'py-1.5 text-xs',
  md: 'py-2.5 text-sm',
  lg: 'py-3.5 text-base'
}
</script>
