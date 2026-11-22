<template>
  <BaseModal
    :model-value="modelValue"
    title="Ganti Kata Sandi"
    max-width="md"
    @update:model-value="close"
  >
    <form id="change-password-form" class="space-y-4" novalidate @submit.prevent="submit">
      <div
        v-if="successMessage"
        class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs"
      >
        {{ successMessage }}
      </div>
      <div
        v-if="generalError"
        class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs"
      >
        {{ generalError }}
      </div>

      <BaseInput
        v-model="form.oldPassword"
        type="password"
        label="Kata Sandi Lama"
        required
        :error="errors.oldPassword"
      />
      <BaseInput
        v-model="form.newPassword"
        type="password"
        label="Kata Sandi Baru"
        required
        help-text="Minimal 6 karakter."
        :error="errors.newPassword"
      />
      <BaseInput
        v-model="form.confirmPassword"
        type="password"
        label="Ulangi Kata Sandi Baru"
        required
        :error="errors.confirmPassword"
      />
    </form>

    <template #footer>
      <BaseButton variant="outline" :disabled="isSubmitting" @click="close">Batal</BaseButton>
      <BaseButton type="submit" form="change-password-form" :loading="isSubmitting">
        Simpan
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import BaseModal from './ui/BaseModal.vue'
import BaseInput from './ui/BaseInput.vue'
import BaseButton from './ui/BaseButton.vue'
import { changePassword } from '../api/auth.js'
import { errorMessage, ERROR_MESSAGES } from '../utils/errors.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

const form = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })
const errors = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })
const generalError = ref('')
const successMessage = ref('')
const isSubmitting = ref(false)
let closeTimer = null

function resetErrors() {
  errors.oldPassword = ''
  errors.newPassword = ''
  errors.confirmPassword = ''
  generalError.value = ''
}

function resetForm() {
  form.oldPassword = ''
  form.newPassword = ''
  form.confirmPassword = ''
  resetErrors()
  successMessage.value = ''
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) resetForm()
    else clearTimeout(closeTimer)
  }
)

function close() {
  if (isSubmitting.value) return
  emit('update:modelValue', false)
}

function validate() {
  if (!form.oldPassword) errors.oldPassword = 'Kata sandi lama wajib diisi.'
  if (form.newPassword.length < 6) errors.newPassword = 'Kata sandi baru minimal 6 karakter.'
  if (form.confirmPassword !== form.newPassword) {
    errors.confirmPassword = 'Konfirmasi kata sandi tidak sama.'
  }
  return !errors.oldPassword && !errors.newPassword && !errors.confirmPassword
}

async function submit() {
  resetErrors()
  successMessage.value = ''
  if (!validate()) return

  isSubmitting.value = true
  try {
    await changePassword(form.oldPassword, form.newPassword)
    successMessage.value = 'Kata sandi berhasil diganti.'
    closeTimer = setTimeout(() => emit('update:modelValue', false), 1200)
  } catch (err) {
    if (err.code === 'INVALID_OLD_PASSWORD') {
      errors.oldPassword = ERROR_MESSAGES.INVALID_OLD_PASSWORD
    } else if (err.code === 'SAME_PASSWORD') {
      errors.newPassword = ERROR_MESSAGES.SAME_PASSWORD
    } else if (err.code === 'VALIDATION_FAILED' && Object.keys(err.fieldErrors).length) {
      errors.oldPassword = err.fieldErrors.oldPassword || ''
      errors.newPassword = err.fieldErrors.newPassword || ''
    } else if (err.status !== 401) {
      // 401 sudah ditangani handler global (redirect ke login)
      generalError.value = errorMessage(err)
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
