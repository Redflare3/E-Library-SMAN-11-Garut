<template>
  <BaseModal v-model="open" max-width="md" :close-on-backdrop="!saving">
    <template #title>Reset Kata Sandi</template>

    <form id="reset-pw-form" class="space-y-4" novalidate @submit.prevent="submit">
      <p class="text-xs text-slate-600">
        Atur kata sandi baru untuk <strong>{{ user?.fullName }}</strong>
        <span class="font-mono text-slate-500">(@{{ user?.username }})</span>. Kata sandi lama langsung tidak berlaku.
      </p>
      <div v-if="generalError" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs" role="alert">
        {{ generalError }}
      </div>
      <PasswordField v-model="password" label="Kata Sandi Baru" required :error="error" :disabled="saving" />
    </form>

    <template #footer>
      <BaseButton variant="outline" :disabled="saving" @click="open = false">Batal</BaseButton>
      <BaseButton type="submit" form="reset-pw-form" :loading="saving">Simpan Kata Sandi</BaseButton>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseModal from '../ui/BaseModal.vue'
import BaseButton from '../ui/BaseButton.vue'
import PasswordField from './PasswordField.vue'
import { updateUser } from '../../api/admin.js'
import { errorMessage } from '../../utils/errors.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  user: { type: Object, default: null }
})
const emit = defineEmits(['update:modelValue', 'saved'])

const password = ref('')
const error = ref('')
const generalError = ref('')
const saving = ref(false)

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) return
    password.value = ''
    error.value = ''
    generalError.value = ''
  }
)

const open = computed({
  get: () => props.modelValue,
  set(value) {
    if (!value && saving.value) return
    emit('update:modelValue', value)
  }
})

async function submit() {
  error.value = ''
  generalError.value = ''
  if (password.value.length < 6) {
    error.value = 'Kata sandi minimal 6 karakter.'
    return
  }
  saving.value = true
  try {
    const saved = await updateUser(props.user.id, { password: password.value })
    emit('saved', saved)
    emit('update:modelValue', false)
  } catch (err) {
    if (err.status === 401) return
    if (err.code === 'VALIDATION_FAILED' && err.fieldErrors.password) error.value = err.fieldErrors.password
    else generalError.value = errorMessage(err)
  } finally {
    saving.value = false
  }
}
</script>
