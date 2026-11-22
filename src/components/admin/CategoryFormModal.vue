<template>
  <BaseModal v-model="open" max-width="md" :close-on-backdrop="!saving">
    <template #title>{{ isEdit ? 'Ubah Kategori' : 'Tambah Kategori' }}</template>

    <form id="category-form" class="space-y-4" novalidate @submit.prevent="submit">
      <div v-if="generalError" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs" role="alert">
        {{ generalError }}
      </div>

      <BaseInput v-model="name" label="Nama Kategori" required :error="errors.name" :disabled="saving" placeholder="mis. Matematika" />

      <div class="space-y-1.5">
        <label for="category-parent" class="block text-xs font-semibold text-slate-700">Induk</label>
        <select id="category-parent" v-model="parentId" :class="selectClass(errors.parentId)" :disabled="saving">
          <option value="">— Kategori utama —</option>
          <option v-for="c in parentOptions" :key="c.id" :value="c.id">
            {{ '  '.repeat(c.depth * 2) }}{{ c.name }}
          </option>
        </select>
        <p v-if="errors.parentId" class="text-xs text-rose-500">{{ errors.parentId }}</p>
        <p v-else-if="isEdit" class="text-xs text-slate-400">Kategori ini dan subkategorinya tidak ditampilkan sebagai pilihan induk.</p>
      </div>
    </form>

    <template #footer>
      <BaseButton variant="outline" :disabled="saving" @click="open = false">Batal</BaseButton>
      <BaseButton type="submit" form="category-form" :loading="saving" :disabled="isEdit && !dirty">
        {{ isEdit ? 'Simpan' : 'Tambah' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import BaseModal from '../ui/BaseModal.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseButton from '../ui/BaseButton.vue'
import { selectClass } from '../staff/formUtils.js'
import { createCategory, updateCategory } from '../../api/admin.js'
import { flattenCategories } from '../../api/categories.js'
import { errorMessage, ERROR_MESSAGES } from '../../utils/errors.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  type: { type: String, default: 'BOOK' }, // BOOK | ARCHIVE
  tree: { type: Array, default: () => [] },
  // Edit: kategori yang diubah. Tambah: null
  category: { type: Object, default: null },
  // Tambah subkategori: induk awal
  presetParentId: { type: Number, default: null }
})
const emit = defineEmits(['update:modelValue', 'saved'])

const isEdit = computed(() => !!props.category)

const name = ref('')
const parentId = ref('')
const errors = reactive({})
const generalError = ref('')
const saving = ref(false)

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) return
    Object.keys(errors).forEach((k) => delete errors[k])
    generalError.value = ''
    name.value = props.category?.name ?? ''
    parentId.value = (isEdit.value ? props.category.parentId : props.presetParentId) ?? ''
  }
)

const open = computed({
  get: () => props.modelValue,
  set(value) {
    if (!value && saving.value) return
    emit('update:modelValue', value)
  }
})

// ID kategori ini beserta seluruh turunannya (tidak boleh jadi induk → cegah siklus;
// backend hanya menolak induk = diri sendiri)
function subtreeIds(node, out = new Set()) {
  out.add(node.id)
  for (const child of node.children ?? []) subtreeIds(child, out)
  return out
}
function findNode(nodes, id) {
  for (const n of nodes) {
    if (n.id === id) return n
    const found = findNode(n.children ?? [], id)
    if (found) return found
  }
  return null
}

const parentOptions = computed(() => {
  const flat = flattenCategories(props.tree)
  if (!isEdit.value) return flat
  const node = findNode(props.tree, props.category.id)
  const excluded = node ? subtreeIds(node) : new Set([props.category.id])
  return flat.filter((c) => !excluded.has(c.id))
})

const normalizedParent = computed(() => (parentId.value === '' ? null : Number(parentId.value)))
const dirty = computed(
  () => isEdit.value && (name.value.trim() !== props.category.name || normalizedParent.value !== (props.category.parentId ?? null))
)

async function submit() {
  Object.keys(errors).forEach((k) => delete errors[k])
  generalError.value = ''
  const trimmed = name.value.trim()
  if (!trimmed) errors.name = 'Nama kategori wajib diisi.'
  else if (trimmed.length > 100) errors.name = 'Nama kategori maksimal 100 karakter.'
  if (Object.keys(errors).length) return

  saving.value = true
  try {
    const saved = isEdit.value
      ? // PUT pembaruan penuh: selalu kirim induk (null = kategori utama)
        await updateCategory(props.type, props.category.id, { name: trimmed, parentId: normalizedParent.value })
      : await createCategory({ type: props.type, name: trimmed, parentId: normalizedParent.value })
    emit('saved', saved, { created: !isEdit.value })
    emit('update:modelValue', false)
  } catch (err) {
    if (err.status === 401) return
    if (err.code === 'DUPLICATE_CATEGORY') errors.name = ERROR_MESSAGES.DUPLICATE_CATEGORY
    else if (err.code === 'INVALID_PARENT') errors.parentId = ERROR_MESSAGES.INVALID_PARENT
    else if (err.code === 'VALIDATION_FAILED' && err.fieldErrors.name) errors.name = err.fieldErrors.name
    else generalError.value = errorMessage(err)
  } finally {
    saving.value = false
  }
}
</script>
