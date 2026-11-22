<template>
  <BaseModal v-model="open" max-width="2xl" :close-on-backdrop="!busy">
    <template #title>{{ isEdit ? 'Edit Buku' : 'Unggah Buku' }}</template>

    <!-- Memuat detail (edit) -->
    <div v-if="loadState === 'loading'" class="space-y-4 animate-pulse" aria-busy="true">
      <div v-for="n in 5" :key="n" class="space-y-2">
        <div class="h-3 w-24 rounded bg-slate-100"></div>
        <div class="h-10 rounded-xl bg-slate-100"></div>
      </div>
    </div>

    <div v-else-if="loadState === 'error'" class="text-center space-y-3 py-6">
      <p class="text-sm text-slate-600">{{ loadError }}</p>
      <BaseButton variant="outline" size="sm" @click="loadDetail">Coba Lagi</BaseButton>
    </div>

    <form v-else id="book-form" class="space-y-5" novalidate @submit.prevent="submit">
      <div v-if="generalError" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs" role="alert">
        {{ generalError }}
      </div>

      <!-- Berkas -->
      <div v-if="!isEdit" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="sm:col-span-2">
          <FilePicker
            v-model="file"
            label="Berkas Buku"
            required
            :accept="BOOK_FILE_ACCEPT"
            :error="errors.file"
            :disabled="busy"
          />
        </div>
        <FilePicker
          v-model="cover"
          label="Sampul (opsional)"
          :accept="COVER_ACCEPT"
          :error="errors.cover"
          :disabled="busy"
          image-preview
        />
      </div>

      <div v-else class="space-y-3">
        <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <span class="w-10 h-10 rounded-lg bg-[#E1EFF6] text-[#005B70] text-[10px] font-bold flex items-center justify-center shrink-0">
            {{ fileExtension(original?.originalName, original?.mimeType) }}
          </span>
          <span class="min-w-0">
            <span class="block font-semibold text-slate-800 truncate">{{ original?.originalName }}</span>
            <span class="block text-slate-400">{{ formatBytes(original?.fileSize) }} · Sampul tidak dapat diganti</span>
          </span>
        </div>
        <FilePicker
          v-model="newFile"
          label="Ganti Berkas (opsional)"
          :accept="BOOK_FILE_ACCEPT"
          :error="errors.file"
          :disabled="busy"
          hint="Berkas lama diganti saat Anda menekan Simpan."
        />
      </div>

      <!-- Metadata -->
      <BaseInput
        v-model="form.title"
        label="Judul"
        required
        :error="fieldMessage('title')"
        :disabled="busy"
        placeholder="mis. Matematika Kelas X Semester 1"
      />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BaseInput v-model="form.author" label="Penulis" :error="fieldMessage('author')" :disabled="busy" />
        <BaseInput v-model="form.publisher" label="Penerbit" :error="fieldMessage('publisher')" :disabled="busy" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <BaseInput
          v-model="form.publicationYear"
          type="number"
          label="Tahun Terbit"
          placeholder="mis. 2024"
          :error="fieldMessage('publicationYear')"
          :disabled="busy"
        />
        <div class="space-y-1.5">
          <label for="book-type" class="block text-xs font-semibold text-slate-700">Jenis</label>
          <select id="book-type" v-model="form.bookType" :class="selectClass(errors.bookType)" :disabled="busy">
            <option v-for="t in options.bookTypes" :key="t" :value="t">{{ labelFor(BOOK_TYPE_LABELS, t) }}</option>
          </select>
          <p v-if="errors.bookType" class="text-xs text-rose-500">{{ errors.bookType }}</p>
        </div>
        <div class="space-y-1.5">
          <label for="book-grade" class="block text-xs font-semibold text-slate-700">Kelas</label>
          <select id="book-grade" v-model="form.gradeLevel" :class="selectClass(errors.gradeLevel)" :disabled="busy">
            <option v-for="g in options.gradeLevels" :key="g" :value="g">{{ labelFor(GRADE_LABELS, g) }}</option>
          </select>
          <p v-if="errors.gradeLevel" class="text-xs text-rose-500">{{ errors.gradeLevel }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label for="book-category" class="block text-xs font-semibold text-slate-700">Kategori</label>
          <select id="book-category" v-model="form.categoryId" :class="selectClass(errors.categoryId)" :disabled="busy">
            <option v-if="allowEmpty('categoryId')" value="">— Tanpa kategori —</option>
            <option v-for="cat in options.categories" :key="cat.id" :value="cat.id">
              {{ '  '.repeat(cat.depth * 2) }}{{ cat.name }}
            </option>
          </select>
          <p v-if="errors.categoryId" class="text-xs text-rose-500">{{ errors.categoryId }}</p>
        </div>
        <div class="space-y-1.5">
          <label for="book-curriculum" class="block text-xs font-semibold text-slate-700">Kurikulum</label>
          <select id="book-curriculum" v-model="form.curriculum" :class="selectClass(errors.curriculum)" :disabled="busy">
            <option v-if="allowEmpty('curriculum')" value="">— Tidak ditentukan —</option>
            <option v-for="c in curriculumOptions" :key="c" :value="c">{{ c }}</option>
          </select>
          <p v-if="errors.curriculum" class="text-xs text-rose-500">{{ errors.curriculum }}</p>
        </div>
      </div>

      <VisibilityField v-model="form.visibility" :disabled="busy" :error="errors.visibility" />

      <div class="space-y-1.5">
        <label for="book-description" class="block text-xs font-semibold text-slate-700">Deskripsi</label>
        <textarea
          id="book-description"
          v-model="form.description"
          rows="4"
          :class="selectClass(fieldMessage('description'))"
          :disabled="busy"
          placeholder="Ringkasan isi buku, kompetensi, atau catatan untuk siswa."
        ></textarea>
        <p v-if="fieldMessage('description')" class="text-xs text-rose-500">{{ fieldMessage('description') }}</p>
      </div>

      <UploadProgress
        v-if="progress.active"
        :loaded="progress.loaded"
        :total="progress.total"
        :processing="progress.processing"
      />
    </form>

    <template #footer>
      <BaseButton variant="outline" @click="open = false">{{ progress.active ? 'Batalkan' : 'Batal' }}</BaseButton>
      <BaseButton
        type="submit"
        form="book-form"
        :loading="busy"
        :disabled="loadState !== 'ready' || (isEdit && (!dirty || clearedFields.length > 0))"
      >
        {{ isEdit ? 'Simpan' : 'Unggah' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import BaseModal from '../ui/BaseModal.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseButton from '../ui/BaseButton.vue'
import FilePicker from './FilePicker.vue'
import UploadProgress from './UploadProgress.vue'
import VisibilityField from './VisibilityField.vue'
import { getBook, createBook, updateBook, replaceBookFile } from '../../api/books.js'
import { listCategories, flattenCategories } from '../../api/categories.js'
import { getFilters } from '../../api/meta.js'
import { useUploadTask } from '../../composables/uploadTask.js'
import { useToast } from '../../composables/toast.js'
import { errorMessage, FILE_ERROR_CODES } from '../../utils/errors.js'
import {
  BOOK_TYPE_LABELS,
  GRADE_LABELS,
  BOOK_FILE_ACCEPT,
  COVER_ACCEPT,
  labelFor,
  formatBytes,
  fileExtension
} from '../../utils/labels.js'
import { selectClass, CLEAR_WARNING, toText } from './formUtils.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // null = unggah baru, angka = edit
  bookId: { type: [Number, String], default: null }
})
const emit = defineEmits(['update:modelValue', 'saved', 'gone'])

const toast = useToast()
const { progress, run, abort } = useUploadTask()

const isEdit = computed(() => props.bookId !== null && props.bookId !== undefined)

// Field teks yang dibandingkan dengan nilai asli saat edit
const TEXT_FIELDS = ['title', 'author', 'publisher', 'publicationYear', 'curriculum', 'description']
const ALL_FIELDS = [...TEXT_FIELDS, 'bookType', 'gradeLevel', 'categoryId', 'visibility']

const emptyForm = () => ({
  title: '',
  author: '',
  publisher: '',
  publicationYear: '',
  bookType: 'EBOOK',
  gradeLevel: 'ALL',
  categoryId: '',
  curriculum: '',
  visibility: 'PUBLIC',
  description: ''
})

const form = reactive(emptyForm())
const errors = reactive({})
const generalError = ref('')
const file = ref(null)
const cover = ref(null)
const newFile = ref(null)
const original = ref(null)
const loadState = ref('ready') // loading | ready | error
const loadError = ref('')
const submitting = ref(false)

const busy = computed(() => submitting.value || progress.active)

// ---------- Opsi dari API ----------
const options = reactive({
  bookTypes: Object.keys(BOOK_TYPE_LABELS),
  gradeLevels: Object.keys(GRADE_LABELS),
  curricula: [],
  categories: []
})

async function loadOptions() {
  const [meta, tree] = await Promise.allSettled([getFilters(), listCategories('BOOK')])
  if (meta.status === 'fulfilled') {
    if (meta.value.bookTypes?.length) options.bookTypes = meta.value.bookTypes
    if (meta.value.gradeLevels?.length) options.gradeLevels = meta.value.gradeLevels
    options.curricula = meta.value.curricula || []
  }
  if (tree.status === 'fulfilled') options.categories = flattenCategories(tree.value)
}

// Nilai kurikulum lama yang tidak ada lagi di meta tetap ditampilkan
const curriculumOptions = computed(() => {
  const list = [...options.curricula]
  const current = original.value?.curriculum
  if (current && !list.includes(current)) list.unshift(current)
  return list
})

// ---------- Buka / tutup ----------
function resetState() {
  Object.assign(form, emptyForm())
  Object.keys(errors).forEach((k) => delete errors[k])
  generalError.value = ''
  file.value = null
  cover.value = null
  newFile.value = null
  original.value = null
  loadError.value = ''
}

function fillFrom(detail) {
  original.value = detail
  Object.assign(form, {
    title: toText(detail.title),
    author: toText(detail.author),
    publisher: toText(detail.publisher),
    publicationYear: toText(detail.publicationYear),
    bookType: detail.bookType || 'EBOOK',
    gradeLevel: detail.gradeLevel || 'ALL',
    categoryId: detail.categoryId ?? '',
    curriculum: toText(detail.curriculum),
    visibility: detail.visibility || 'PUBLIC',
    description: toText(detail.description)
  })
}

async function loadDetail() {
  loadState.value = 'loading'
  try {
    fillFrom(await getBook(props.bookId))
    loadState.value = 'ready'
  } catch (err) {
    if (handleGone(err)) return
    loadError.value = errorMessage(err)
    loadState.value = 'error'
  }
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) return
    resetState()
    loadOptions()
    if (isEdit.value) loadDetail()
    else loadState.value = 'ready'
  },
  { immediate: true }
)

// Tutup dijaga: unggahan berjalan → konfirmasi lalu batalkan; PUT biasa → tunggu
const open = computed({
  get: () => props.modelValue,
  set(value) {
    if (value) return emit('update:modelValue', true)
    if (progress.active) {
      if (!window.confirm('Batalkan unggahan?')) return
      abort()
    } else if (submitting.value) {
      return
    }
    emit('update:modelValue', false)
  }
})

// ---------- Edit: perubahan & kolom yang dikosongkan ----------
const norm = (key, value) => {
  if (key === 'categoryId') return value === '' || value === null || value === undefined ? null : Number(value)
  if (key === 'publicationYear') return toText(value).trim() === '' ? null : Number(value)
  return toText(value).trim() || null
}

const changedFields = computed(() => {
  if (!original.value) return []
  return ALL_FIELDS.filter((key) => {
    const now = norm(key, form[key])
    return now !== null && now !== norm(key, original.value[key])
  })
})

// Server tidak bisa mengosongkan field (null = tidak diubah, frontend-guide §6.4)
const clearedFields = computed(() => {
  if (!isEdit.value || !original.value) return []
  return ALL_FIELDS.filter((key) => norm(key, form[key]) === null && norm(key, original.value[key]) !== null)
})

const dirty = computed(() => changedFields.value.length > 0 || !!newFile.value)

function allowEmpty(key) {
  return !isEdit.value || norm(key, original.value?.[key]) === null
}

function fieldMessage(key) {
  if (errors[key]) return errors[key]
  if (key !== 'title' && clearedFields.value.includes(key)) return CLEAR_WARNING
  return ''
}

// ---------- Validasi ----------
function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  generalError.value = ''
  const title = form.title.trim()
  if (!title) errors.title = 'Judul wajib diisi.'
  else if (title.length > 255) errors.title = 'Judul maksimal 255 karakter.'
  if (form.author.trim().length > 255) errors.author = 'Maksimal 255 karakter.'
  if (form.publisher.trim().length > 255) errors.publisher = 'Maksimal 255 karakter.'
  const year = toText(form.publicationYear).trim()
  if (year && !/^\d{4}$/.test(year)) errors.publicationYear = 'Tahun harus 4 digit, mis. 2024.'
  if (!isEdit.value && !file.value) errors.file = 'Berkas wajib dipilih.'
  return Object.keys(errors).length === 0
}

function buildMetadata() {
  const meta = {}
  for (const key of ALL_FIELDS) {
    const value = norm(key, form[key])
    if (value !== null) meta[key] = value
  }
  return meta
}

function buildPatch() {
  const patch = { title: form.title.trim() }
  for (const key of changedFields.value) patch[key] = norm(key, form[key])
  return patch
}

// ---------- Error ----------
// 403/404 saat edit: item sudah dihapus atau bukan milik pengguna
function handleGone(err) {
  if (isEdit.value && (err?.status === 404 || err?.status === 403)) {
    toast.show(err.status === 404 ? 'Buku sudah tidak ada (mungkin telah dihapus).' : errorMessage(err), { tone: 'error' })
    emit('gone')
    emit('update:modelValue', false)
    return true
  }
  return false
}

function handleError(err) {
  if (!err || err.code === 'ABORTED' || err.status === 401) return
  if (handleGone(err)) return
  if (FILE_ERROR_CODES.has(err.code)) {
    const onCover = !isEdit.value && cover.value && /cover/i.test(err.message || '')
    errors[onCover ? 'cover' : 'file'] = errorMessage(err)
    return
  }
  if (err.code === 'VALIDATION_FAILED' && Object.keys(err.fieldErrors).length) {
    const unknown = []
    for (const [key, msg] of Object.entries(err.fieldErrors)) {
      if (ALL_FIELDS.includes(key)) errors[key] = msg
      else unknown.push(msg)
    }
    generalError.value = unknown.length ? unknown.join(' ') : errorMessage(err)
    return
  }
  generalError.value = errorMessage(err)
}

// ---------- Simpan ----------
async function submit() {
  if (busy.value || !validate()) return
  submitting.value = true
  try {
    if (!isEdit.value) {
      const detail = await run((onProgress) =>
        createBook({ file: file.value, cover: cover.value, metadata: buildMetadata(), onProgress })
      )
      emit('saved', detail, { created: true })
      emit('update:modelValue', false)
      return
    }

    let detail = original.value
    let metadataSaved = false
    if (changedFields.value.length) {
      detail = await updateBook(props.bookId, buildPatch())
      metadataSaved = true
      fillFrom(detail)
    }
    if (newFile.value) {
      try {
        detail = await run((onProgress) => replaceBookFile(props.bookId, newFile.value, onProgress))
        fillFrom(detail)
        newFile.value = null
      } catch (err) {
        // Metadata sudah tersimpan: segarkan baris, modal tetap terbuka dengan error pada berkas
        if (metadataSaved) emit('saved', detail, { created: false, partial: true })
        throw err
      }
    }
    emit('saved', detail, { created: false })
    emit('update:modelValue', false)
  } catch (err) {
    handleError(err)
  } finally {
    submitting.value = false
  }
}
</script>
