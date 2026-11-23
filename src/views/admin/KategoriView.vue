<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-slate-900">Kategori</h1>
        <p class="text-sm text-slate-500 mt-1">Kategori dipakai pada formulir unggah dan filter katalog. Buku dan arsip punya pohon kategori sendiri.</p>
      </div>
      <BaseButton @click="openCreate(null)">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        Tambah Kategori
      </BaseButton>
    </div>

    <!-- Tab Buku / Arsip -->
    <div class="inline-flex gap-1 p-1 bg-slate-100 rounded-xl text-xs" role="tablist" aria-label="Jenis kategori">
      <button
        v-for="t in TABS"
        :key="t.value"
        type="button"
        role="tab"
        :aria-selected="type === t.value"
        :class="[
          'px-4 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer',
          type === t.value ? 'bg-white text-brand' : 'text-slate-500 hover:text-slate-800'
        ]"
        @click="setType(t.value)"
      >
        {{ t.label }}
      </button>
    </div>

    <StateBlock
      v-if="state !== 'ready' || !tree.length"
      :state="state === 'ready' ? 'empty' : state"
      :title="state === 'error' ? 'Gagal memuat kategori' : 'Belum ada kategori'"
      :message="state === 'error' ? error : 'Tambahkan kategori pertama dengan tombol Tambah Kategori.'"
      :skeleton-count="4"
      grid-class="grid-cols-1"
      aspect-class="h-8"
      @retry="load"
    />

    <section v-else class="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
      <ul>
        <CategoryTreeRow
          v-for="node in tree"
          :key="node.id"
          :node="node"
          @add="openCreate"
          @edit="openEdit"
          @delete="askDelete"
        />
      </ul>
      <p class="px-4 py-3 text-[11px] text-slate-400 bg-slate-50/60">
        {{ formatNumber(totalCount) }} kategori. Kategori yang masih dipakai buku atau arsip tidak dapat dihapus.
      </p>
    </section>

    <CategoryFormModal
      v-model="isFormOpen"
      :type="apiType"
      :tree="tree"
      :category="editTarget"
      :preset-parent-id="presetParentId"
      @saved="onSaved"
    />

    <ConfirmModal
      v-model="isDeleteOpen"
      title="Hapus kategori?"
      :message="deleteMessage"
      confirm-label="Ya, Hapus"
      danger
      :loading="deleting"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '../../components/ui/BaseButton.vue'
import StateBlock from '../../components/StateBlock.vue'
import ConfirmModal from '../../components/staff/ConfirmModal.vue'
import CategoryTreeRow from '../../components/admin/CategoryTreeRow.vue'
import CategoryFormModal from '../../components/admin/CategoryFormModal.vue'
import { listCategories, flattenCategories } from '../../api/categories.js'
import { deleteCategory } from '../../api/admin.js'
import { useToast } from '../../composables/toast.js'
import { errorMessage, ERROR_MESSAGES } from '../../utils/errors.js'
import { formatNumber } from '../../utils/labels.js'

const TABS = [
  { value: 'book', label: 'Buku' },
  { value: 'archive', label: 'Arsip' }
]

const route = useRoute()
const router = useRouter()
const toast = useToast()

// ?type=archive (Buku = bawaan)
const type = computed(() => (route.query.type === 'archive' ? 'archive' : 'book'))
const apiType = computed(() => (type.value === 'archive' ? 'ARCHIVE' : 'BOOK'))

function setType(value) {
  router.replace({ name: 'AdminKategori', query: value === 'archive' ? { type: 'archive' } : {} })
}

// ---------- Data ----------
const tree = ref([])
const state = ref('loading')
const error = ref('')
let requestId = 0

async function load() {
  const id = ++requestId
  state.value = 'loading'
  try {
    const data = await listCategories(apiType.value)
    if (id !== requestId) return
    tree.value = data
    state.value = 'ready'
  } catch (err) {
    if (id !== requestId || err.status === 401) return
    error.value = errorMessage(err)
    state.value = 'error'
  }
}

watch(apiType, load, { immediate: true })

const totalCount = computed(() => flattenCategories(tree.value).length)

// ---------- Tambah / ubah ----------
const isFormOpen = ref(false)
const editTarget = ref(null)
const presetParentId = ref(null)

function openCreate(parent) {
  editTarget.value = null
  presetParentId.value = parent?.id ?? null
  isFormOpen.value = true
}
function openEdit(node) {
  editTarget.value = node
  presetParentId.value = null
  isFormOpen.value = true
}

function onSaved(saved, { created } = {}) {
  toast.show(created ? `Kategori "${saved.name}" ditambahkan` : 'Perubahan disimpan')
  load()
}

// ---------- Hapus ----------
const isDeleteOpen = ref(false)
const deleteTarget = ref(null)
const deleting = ref(false)

const deleteMessage = computed(() => {
  const node = deleteTarget.value
  if (!node) return ''
  const n = node.children?.length ?? 0
  return n
    ? `"${node.name}" akan dihapus. ${n} subkategorinya akan dipindahkan menjadi kategori utama.`
    : `"${node.name}" akan dihapus.`
})

function askDelete(node) {
  deleteTarget.value = node
  isDeleteOpen.value = true
}

async function confirmDelete() {
  const node = deleteTarget.value
  deleting.value = true
  try {
    await deleteCategory(apiType.value, node.id)
    toast.show(`Kategori "${node.name}" dihapus`)
    load()
  } catch (err) {
    if (err.status === 401) return
    if (err.code === 'CATEGORY_IN_USE') {
      toast.show(`${ERROR_MESSAGES.CATEGORY_IN_USE} ("${node.name}")`, {
        tone: 'error',
        duration: 8000,
        action: {
          label: 'Lihat item',
          to: { name: type.value === 'archive' ? 'AdminArsip' : 'AdminBuku', query: { categoryId: String(node.id) } }
        }
      })
    } else {
      toast.show(errorMessage(err), { tone: 'error' })
      if (err.status === 404) load()
    }
  } finally {
    deleting.value = false
    isDeleteOpen.value = false
  }
}
</script>
