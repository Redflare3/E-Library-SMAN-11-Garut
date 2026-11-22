<template>
  <BaseModal v-model="open" max-width="lg" :close-on-backdrop="!deleting">
    <template #title>{{ kind === 'book' ? 'Hapus Buku?' : 'Hapus Arsip?' }}</template>

    <div v-if="item" class="space-y-4">
      <div class="flex items-start gap-3">
        <span class="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </span>
        <p class="text-xs text-slate-600 leading-relaxed">
          {{ kind === 'book' ? 'Buku' : 'Arsip' }} ini akan dipindahkan ke tempat sampah dan tidak lagi tampil di
          {{ kind === 'book' ? 'katalog' : 'halaman arsip' }}.
          <strong class="text-slate-800">{{ restoreNote }}</strong>
        </p>
      </div>

      <!-- Pratinjau item -->
      <div class="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 flex items-center gap-3.5">
        <div
          :class="[
            'relative shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-100',
            kind === 'book' ? 'w-12 h-16' : 'w-20 aspect-[4/3]'
          ]"
        >
          <BookCover v-if="kind === 'book'" :book="item" compact />
          <ArchiveThumb v-else :item="item" />
        </div>
        <div class="min-w-0 text-xs">
          <p class="font-bold text-slate-900 line-clamp-2">{{ item.title }}</p>
          <p class="text-slate-500 mt-0.5 truncate">{{ subtitle }}</p>
        </div>
      </div>

      <div v-if="error" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs" role="alert">
        {{ error }}
      </div>
    </div>

    <template #footer>
      <BaseButton variant="outline" :disabled="deleting" @click="open = false">Batal</BaseButton>
      <BaseButton variant="danger" :loading="deleting" @click="confirmDelete">
        {{ deleting ? 'Menghapus…' : 'Ya, Hapus' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseModal from '../ui/BaseModal.vue'
import BaseButton from '../ui/BaseButton.vue'
import BookCover from '../BookCover.vue'
import ArchiveThumb from '../ArchiveThumb.vue'
import { deleteBook } from '../../api/books.js'
import { deleteArchive } from '../../api/archive.js'
import { auth } from '../../stores/auth.js'
import { errorMessage } from '../../utils/errors.js'
import {
  BOOK_TYPE_LABELS,
  MEDIA_TYPE_LABELS,
  labelFor,
  formatEventDate
} from '../../utils/labels.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  kind: { type: String, default: 'book', validator: (k) => ['book', 'archive'].includes(k) },
  item: { type: Object, default: null }
})
const emit = defineEmits(['update:modelValue', 'deleted', 'gone'])

const deleting = ref(false)
const error = ref('')

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) error.value = ''
  }
)

const open = computed({
  get: () => props.modelValue,
  set(value) {
    if (!value && deleting.value) return
    emit('update:modelValue', value)
  }
})

const restoreNote = computed(() =>
  auth.isLibrarian.value
    ? 'Dapat dipulihkan dengan tombol Urungkan atau dari Tempat Sampah sebelum dihapus permanen.'
    : 'Hanya pustakawan yang dapat memulihkan item yang dihapus.'
)

const subtitle = computed(() => {
  const i = props.item
  if (!i) return ''
  if (props.kind === 'book') {
    return [labelFor(BOOK_TYPE_LABELS, i.bookType), i.author].filter(Boolean).join(' · ')
  }
  return [labelFor(MEDIA_TYPE_LABELS, i.mediaType), formatEventDate(i.eventDate)].filter(Boolean).join(' · ')
})

async function confirmDelete() {
  if (!props.item || deleting.value) return
  deleting.value = true
  error.value = ''
  try {
    await (props.kind === 'book' ? deleteBook(props.item.id) : deleteArchive(props.item.id))
    emit('deleted', props.item.id)
    emit('update:modelValue', false)
  } catch (err) {
    if (err.status === 401) return
    if (err.status === 404) {
      // Sudah terhapus di tab lain: anggap selesai
      emit('gone')
      emit('update:modelValue', false)
      return
    }
    error.value = errorMessage(err)
  } finally {
    deleting.value = false
  }
}
</script>
