<template>
  <BaseModal v-model="open" max-width="lg" :close-on-backdrop="!saving">
    <template #title>{{ isEdit ? 'Edit Pengguna' : 'Tambah Pengguna' }}</template>

    <form id="user-form" class="space-y-4" novalidate @submit.prevent="submit">
      <div v-if="generalError" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs" role="alert">
        {{ generalError }}
      </div>

      <BaseInput v-model="form.fullName" label="Nama Lengkap" required :error="errors.fullName" :disabled="saving" placeholder="mis. Budi Santoso, S.Pd." />

      <div v-if="!isEdit" class="space-y-1.5">
        <BaseInput
          v-model="form.username"
          label="Nama Pengguna"
          required
          :error="errors.username"
          :disabled="saving"
          placeholder="mis. budi.santoso"
          help-text="3–50 karakter: huruf kecil, angka, titik, garis bawah, atau tanda hubung."
        />
      </div>
      <p v-else class="text-xs text-slate-500">
        Nama pengguna: <strong class="font-mono text-slate-700">@{{ user.username }}</strong> (tidak dapat diubah)
      </p>

      <PasswordField v-if="!isEdit" v-model="form.password" required :error="errors.password" :disabled="saving" />

      <fieldset class="space-y-1.5" :disabled="saving || isSelf">
        <legend class="block text-xs font-semibold text-slate-700 mb-1.5">Peran</legend>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <label
            v-for="opt in ROLE_OPTIONS"
            :key="opt.value"
            :class="[
              'flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors',
              form.role === opt.value ? 'border-[#005B70] bg-[#EAF5F8]' : 'border-slate-200 hover:border-slate-300',
              isSelf ? 'opacity-60 cursor-not-allowed' : ''
            ]"
          >
            <input v-model="form.role" type="radio" class="mt-0.5 text-[#005B70] focus:ring-[#005B70]" :value="opt.value" />
            <span>
              <span class="block text-xs font-bold text-slate-800">{{ opt.label }}</span>
              <span class="block text-[11px] text-slate-500 leading-snug">{{ opt.help }}</span>
            </span>
          </label>
        </div>
        <p v-if="isSelf" class="text-xs text-slate-400">Peran akun sendiri tidak dapat diubah.</p>
        <p v-else-if="errors.role" class="text-xs text-rose-500">{{ errors.role }}</p>
      </fieldset>
    </form>

    <template #footer>
      <BaseButton variant="outline" :disabled="saving" @click="open = false">Batal</BaseButton>
      <BaseButton type="submit" form="user-form" :loading="saving" :disabled="isEdit && !dirty">
        {{ isEdit ? 'Simpan' : 'Buat Akun' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import BaseModal from '../ui/BaseModal.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseButton from '../ui/BaseButton.vue'
import PasswordField from './PasswordField.vue'
import { createUser, updateUser } from '../../api/admin.js'
import { auth } from '../../stores/auth.js'
import { errorMessage, ERROR_MESSAGES } from '../../utils/errors.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // null = tambah baru
  user: { type: Object, default: null }
})
const emit = defineEmits(['update:modelValue', 'saved'])

const ROLE_OPTIONS = [
  { value: 'TEACHER', label: 'Guru', help: 'Mengunggah dan mengelola buku serta arsip miliknya sendiri.' },
  { value: 'LIBRARIAN', label: 'Pustakawan', help: 'Akses penuh: semua koleksi, pengguna, kategori, dan penyimpanan.' }
]
const USERNAME_RE = /^[a-z0-9._-]{3,50}$/

const isEdit = computed(() => !!props.user)
const isSelf = computed(() => isEdit.value && props.user.id === auth.state.user?.id)

const form = reactive({ fullName: '', username: '', password: '', role: 'TEACHER' })
const errors = reactive({})
const generalError = ref('')
const saving = ref(false)

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) return
    Object.keys(errors).forEach((k) => delete errors[k])
    generalError.value = ''
    Object.assign(form, {
      fullName: props.user?.fullName ?? '',
      username: '',
      password: '',
      role: props.user?.role ?? 'TEACHER'
    })
  }
)

const open = computed({
  get: () => props.modelValue,
  set(value) {
    if (!value && saving.value) return
    emit('update:modelValue', value)
  }
})

const patch = computed(() => {
  if (!isEdit.value) return {}
  const p = {}
  const name = form.fullName.trim()
  if (name && name !== props.user.fullName) p.fullName = name
  if (!isSelf.value && form.role !== props.user.role) p.role = form.role
  return p
})
const dirty = computed(() => Object.keys(patch.value).length > 0)

// Nama pengguna disimpan dalam huruf kecil
watch(
  () => form.username,
  (v) => {
    const lower = v.toLowerCase().replace(/\s+/g, '')
    if (lower !== v) form.username = lower
  }
)

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  generalError.value = ''
  if (!form.fullName.trim()) errors.fullName = 'Nama lengkap wajib diisi.'
  if (!isEdit.value) {
    if (!USERNAME_RE.test(form.username)) {
      errors.username = 'Gunakan 3–50 karakter: huruf kecil, angka, titik, garis bawah, atau tanda hubung.'
    }
    if (form.password.length < 6) errors.password = 'Kata sandi minimal 6 karakter.'
  }
  return Object.keys(errors).length === 0
}

async function submit() {
  if (saving.value || !validate()) return
  saving.value = true
  try {
    const saved = isEdit.value
      ? await updateUser(props.user.id, patch.value)
      : await createUser({
          fullName: form.fullName.trim(),
          username: form.username,
          password: form.password,
          role: form.role
        })
    emit('saved', saved, { created: !isEdit.value })
    emit('update:modelValue', false)
  } catch (err) {
    if (err.status === 401) return
    if (err.code === 'DUPLICATE_USERNAME') {
      errors.username = ERROR_MESSAGES.DUPLICATE_USERNAME
    } else if (err.code === 'VALIDATION_FAILED' && Object.keys(err.fieldErrors).length) {
      const unknown = []
      for (const [key, msg] of Object.entries(err.fieldErrors)) {
        if (['fullName', 'username', 'password', 'role'].includes(key)) errors[key] = msg
        else unknown.push(msg)
      }
      if (unknown.length) generalError.value = unknown.join(' ')
    } else {
      generalError.value = errorMessage(err)
    }
  } finally {
    saving.value = false
  }
}
</script>
