<template>
  <BaseModal v-model="open" max-width="2xl" :close-on-backdrop="!busy">
    <template #title>{{ isEdit ? 'Edit Arsip' : 'Unggah Arsip' }}</template>

    <div v-if="loadState === 'loading'" class="space-y-4 animate-pulse" aria-busy="true">
      <div v-for="n in 4" :key="n" class="space-y-2">
        <div class="h-3 w-24 rounded bg-slate-100"></div>
        <div class="h-10 rounded-xl bg-slate-100"></div>
      </div>
    </div>

    <div v-else-if="loadState === 'error'" class="text-center space-y-3 py-6">
      <p class="text-sm text-slate-600">{{ loadError }}</p>
      <BaseButton variant="outline" size="sm" @click="loadDetail">Coba Lagi</BaseButton>
    </div>

    <form v-else id="archive-form" class="space-y-5" novalidate @submit.prevent="submit">
      <div v-if="generalError" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs" role="alert">
        {{ generalError }}
      </div>

      <!-- Berkas -->
      <FilePicker
        v-if="!isEdit"
        v-model="file"
        label="Berkas Arsip"
        required
        :accept="ARCHIVE_FILE_ACCEPT"
        :error="errors.file"
        :disabled="busy"
        hint="Foto, video, atau dokumen. Jenis media dideteksi otomatis oleh server."
      />
      <div v-else class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <span class="w-10 h-10 rounded-lg bg-brand-soft text-brand flex items-center justify-center shrink-0">
          <MediaTypeIcon :type="original?.mediaType" class="w-5 h-5" />
        </span>
        <span class="min-w-0">
          <span class="block font-semibold text-slate-800 truncate">{{ original?.originalName }}</span>
          <span class="block text-slate-400">
            {{ labelFor(MEDIA_TYPE_LABELS, original?.mediaType) }} · {{ formatBytes(original?.fileSize) }} · Berkas arsip tidak dapat diganti
          </span>
          <span class="block text-slate-500 mt-0.5">Diunggah oleh <strong class="font-semibold">{{ original?.uploadedByName || 'Impor massal' }}</strong></span>
        </span>
      </div>

      <BaseInput
        v-model="form.title"
        label="Judul"
        required
        :error="fieldMessage('title')"
        :disabled="busy"
        placeholder="mis. Upacara HUT RI ke-80"
      />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label for="archive-category" class="block text-xs font-semibold text-slate-700">Kategori</label>
          <select id="archive-category" v-model="form.categoryId" :class="selectClass(fieldMessage('categoryId'))" :disabled="busy">
            <option v-if="allowEmpty('categoryId')" value="">— Tanpa kategori —</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ '  '.repeat(cat.depth * 2) }}{{ cat.name }}
            </option>
          </select>
          <p v-if="fieldMessage('categoryId')" class="text-xs text-rose-500">{{ fieldMessage('categoryId') }}</p>
        </div>
        <div class="space-y-1.5">
          <label for="archive-date" class="block text-xs font-semibold text-slate-700">Tanggal Kegiatan</label>
          <input
            id="archive-date"
            v-model="form.eventDate"
            type="date"
            :class="selectClass(fieldMessage('eventDate'))"
            :disabled="busy"
          />
          <p v-if="fieldMessage('eventDate')" class="text-xs text-rose-500">{{ fieldMessage('eventDate') }}</p>
        </div>
      </div>

      <VisibilityField
        v-model="form.visibility"
        :disabled="busy"
        :error="errors.visibility"
        :note="isEdit ? '' : 'Arsip baru bersifat Khusus Staf secara bawaan.'"
      />

      <div class="space-y-1.5">
        <label for="archive-description" class="block text-xs font-semibold text-slate-700">Deskripsi</label>
        <textarea
          id="archive-description"
          v-model="form.description"
          rows="4"
          :class="selectClass(fieldMessage('description'))"
          :disabled="busy"
          placeholder="Keterangan kegiatan, tempat, atau peserta."
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
        form="archive-form"
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
import MediaTypeIcon from '../MediaTypeIcon.vue'
import FilePicker from './FilePicker.vue'
import UploadProgress from './UploadProgress.vue'
import VisibilityField from './VisibilityField.vue'
import { getArchive, createArchive, updateArchive } from '../../api/archive.js'
import { listCategories, flattenCategories } from '../../api/categories.js'
import { useUploadTask } from '../../composables/uploadTask.js'
import { useToast } from '../../composables/toast.js'
import { errorMessage, FILE_ERROR_CODES } from '../../utils/errors.js'
import { MEDIA_TYPE_LABELS, ARCHIVE_FILE_ACCEPT, labelFor, formatBytes } from '../../utils/labels.js'
import { selectClass, CLEAR_WARNING, toText } from './formUtils.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // null = unggah baru, angka = edit
  archiveId: { type: [Number, String], default: null }
})
const emit = defineEmits(['update:modelValue', 'saved', 'gone'])

const toast = useToast()
const { progress, run, abort } = useUploadTask()

const isEdit = computed(() => props.archiveId !== null && props.archiveId !== undefined)

const FIELDS = ['title', 'description', 'categoryId', 'eventDate', 'visibility']
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

const emptyForm = () => ({
  title: '',
  description: '',
  categoryId: '',
  eventDate: '',
  visibility: 'STAFF' // bawaan backend untuk arsip
})

const form = reactive(emptyForm())
const errors = reactive({})
const generalError = ref('')
const file = ref(null)
const original = ref(null)
const categories = ref([])
const loadState = ref('ready')
const loadError = ref('')
const submitting = ref(false)

const busy = computed(() => submitting.value || progress.active)

async function loadOptions() {
  try {
    categories.value = flattenCategories(await listCategories('ARCHIVE'))
  } catch {
    /* tetap bisa unggah tanpa kategori */
  }
}

function resetState() {
  Object.assign(form, emptyForm())
  Object.keys(errors).forEach((k) => delete errors[k])
  generalError.value = ''
  file.value = null
  original.value = null
  loadError.value = ''
}

function fillFrom(detail) {
  original.value = detail
  Object.assign(form, {
    title: toText(detail.title),
    description: toText(detail.description),
    categoryId: detail.categoryId ?? '',
    eventDate: toText(detail.eventDate),
    visibility: detail.visibility || 'STAFF'
  })
}

async function loadDetail() {
  loadState.value = 'loading'
  try {
    fillFrom(await getArchive(props.archiveId))
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

// ---------- Edit ----------
const norm = (key, value) => {
  if (key === 'categoryId') return value === '' || value === null || value === undefined ? null : Number(value)
  return toText(value).trim() || null
}

const changedFields = computed(() => {
  if (!original.value) return []
  return FIELDS.filter((key) => {
    const now = norm(key, form[key])
    return now !== null && now !== norm(key, original.value[key])
  })
})

const clearedFields = computed(() => {
  if (!isEdit.value || !original.value) return []
  return FIELDS.filter((key) => norm(key, form[key]) === null && norm(key, original.value[key]) !== null)
})

const dirty = computed(() => changedFields.value.length > 0)

function allowEmpty(key) {
  return !isEdit.value || norm(key, original.value?.[key]) === null
}

function fieldMessage(key) {
  if (errors[key]) return errors[key]
  if (key !== 'title' && clearedFields.value.includes(key)) return CLEAR_WARNING
  return ''
}

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  generalError.value = ''
  const title = form.title.trim()
  if (!title) errors.title = 'Judul wajib diisi.'
  else if (title.length > 255) errors.title = 'Judul maksimal 255 karakter.'
  if (form.eventDate && !DATE_RE.test(form.eventDate)) errors.eventDate = 'Tanggal tidak valid.'
  if (!isEdit.value && !file.value) errors.file = 'Berkas wajib dipilih.'
  return Object.keys(errors).length === 0
}

function buildMetadata() {
  const meta = {}
  for (const key of FIELDS) {
    const value = norm(key, form[key])
    if (value !== null) meta[key] = value
  }
  return meta
}

function buildPatch() {
  const patch = {}
  for (const key of changedFields.value) patch[key] = norm(key, form[key])
  return patch
}

// ---------- Error ----------
function handleGone(err) {
  if (isEdit.value && (err?.status === 404 || err?.status === 403)) {
    toast.show(err.status === 404 ? 'Arsip sudah tidak ada (mungkin telah dihapus).' : errorMessage(err), { tone: 'error' })
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
    errors.file = errorMessage(err)
    return
  }
  if (err.code === 'VALIDATION_FAILED' && Object.keys(err.fieldErrors).length) {
    const unknown = []
    for (const [key, msg] of Object.entries(err.fieldErrors)) {
      if (FIELDS.includes(key)) errors[key] = msg
      else unknown.push(msg)
    }
    generalError.value = unknown.length ? unknown.join(' ') : errorMessage(err)
    return
  }
  generalError.value = errorMessage(err)
}

async function submit() {
  if (busy.value || !validate()) return
  submitting.value = true
  try {
    const detail = isEdit.value
      ? await updateArchive(props.archiveId, buildPatch())
      : await run((onProgress) => createArchive({ file: file.value, metadata: buildMetadata(), onProgress }))
    emit('saved', detail, { created: !isEdit.value })
    emit('update:modelValue', false)
  } catch (err) {
    handleError(err)
  } finally {
    submitting.value = false
  }
}
</script>
