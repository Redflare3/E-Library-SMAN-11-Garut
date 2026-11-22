<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black tracking-tight text-slate-900">Semua Arsip</h1>
        <p class="text-sm text-slate-500 mt-1">
          <template v-if="list.state === 'ready'">{{ formatNumber(list.totalElements) }} item ditemukan</template>
          <template v-else>Seluruh arsip sekolah, termasuk unggahan guru, impor massal, dan Khusus Staf</template>
        </p>
      </div>
      <BaseButton @click="openCreate">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        Unggah Arsip
      </BaseButton>
    </div>

    <!-- Filter -->
    <section class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
      <div class="sm:col-span-2 lg:col-span-1 space-y-1">
        <label for="admin-arc-q" class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cari</label>
        <input
          id="admin-arc-q"
          v-model="searchInput"
          type="search"
          placeholder="Judul atau deskripsi…"
          :class="selectClass()"
        />
      </div>
      <div class="space-y-1">
        <label for="admin-arc-cat" class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategori</label>
        <select id="admin-arc-cat" :value="filters.categoryId ?? ''" :class="selectClass()" @change="setFilter({ categoryId: $event.target.value || null })">
          <option value="">Semua Kategori</option>
          <option v-for="cat in categories" :key="cat.id" :value="String(cat.id)">
            {{ '  '.repeat(cat.depth * 2) }}{{ cat.name }}
          </option>
        </select>
      </div>
      <div class="space-y-1">
        <label for="admin-arc-media" class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jenis Media</label>
        <select id="admin-arc-media" :value="filters.mediaType ?? ''" :class="selectClass()" @change="setFilter({ mediaType: $event.target.value || null })">
          <option value="">Semua Jenis</option>
          <option v-for="m in mediaTypes" :key="m" :value="m">{{ labelFor(MEDIA_TYPE_LABELS, m) }}</option>
        </select>
      </div>
      <div class="space-y-1">
        <label for="admin-arc-sort" class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Urutkan</label>
        <select id="admin-arc-sort" :value="filters.sort ?? 'newest'" :class="selectClass()" @change="setFilter({ sort: $event.target.value === 'newest' ? null : $event.target.value })">
          <option v-for="opt in ARCHIVE_SORT_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>
      <div v-if="hasFilters" class="sm:col-span-2 lg:col-span-4 flex justify-end">
        <button type="button" class="text-xs font-semibold text-slate-400 hover:text-rose-600 cursor-pointer" @click="clearAll">
          Reset Semua Filter
        </button>
      </div>
    </section>

    <StateBlock
      v-if="list.state !== 'ready'"
      :state="list.state"
      :title="list.state === 'error' ? 'Gagal memuat arsip' : 'Tidak ada arsip yang sesuai'"
      :message="list.state === 'error' ? list.error : hasFilters ? 'Coba ubah kata kunci atau filter.' : 'Belum ada arsip di perpustakaan.'"
      :reset-label="list.state === 'empty' && hasFilters ? 'Reset Semua Filter' : ''"
      :skeleton-count="4"
      grid-class="grid-cols-1"
      aspect-class="h-16"
      @retry="loadList"
      @reset="clearAll"
    />

    <template v-else>
      <!-- Tabel (md+) -->
      <BaseTable class="hidden md:block">
        <template #header>
          <th class="px-4 py-3 w-16">ID</th>
          <th class="px-4 py-3">Judul</th>
          <th class="px-4 py-3">Jenis</th>
          <th class="px-4 py-3">Tanggal Kegiatan</th>
          <th class="px-4 py-3">Akses</th>
          <th class="px-4 py-3 text-right">Diunduh</th>
          <th class="px-4 py-3 text-right">Aksi</th>
        </template>
        <tr v-for="item in list.items" :key="item.id" class="hover:bg-slate-50/60">
          <td class="px-4 py-3 text-xs font-mono text-slate-400">#{{ item.id }}</td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="relative w-[72px] aspect-[4/3] rounded-md overflow-hidden border border-slate-200 shrink-0">
                <ArchiveThumb :item="item" :cache-key="thumbKeys[item.id] || null" />
              </div>
              <div class="min-w-0">
                <p class="font-semibold text-slate-800 text-sm line-clamp-2 max-w-xs">{{ item.title }}</p>
                <p v-if="processing[item.id]" class="text-[11px] font-semibold text-[#005B70] flex items-center gap-1.5 mt-0.5">
                  <span class="w-3 h-3 border-2 border-[#005B70]/30 border-t-[#005B70] rounded-full animate-spin"></span>
                  Memproses thumbnail…
                </p>
                <p v-else-if="item.categoryName" class="text-xs text-slate-400 truncate max-w-xs">{{ item.categoryName }}</p>
              </div>
            </div>
          </td>
          <td class="px-4 py-3 text-xs whitespace-nowrap">
            {{ labelFor(MEDIA_TYPE_LABELS, item.mediaType) }}<template v-if="item.durationSeconds"> · {{ formatDuration(item.durationSeconds) }}</template>
          </td>
          <td class="px-4 py-3 text-xs whitespace-nowrap">{{ formatEventDate(item.eventDate) || 'Tanpa tanggal' }}</td>
          <td class="px-4 py-3"><VisibilityBadge :value="item.visibility" /></td>
          <td class="px-4 py-3 text-xs text-right tabular-nums">{{ formatNumber(item.viewCount) }}</td>
          <td class="px-4 py-3">
            <RowActions :view-to="{ name: 'Arsip', query: { item: String(item.id) } }" @edit="openEdit(item)" @delete="openDelete(item)" />
          </td>
        </tr>
      </BaseTable>

      <!-- Kartu (ponsel) -->
      <div class="md:hidden space-y-3">
        <article
          v-for="item in list.items"
          :key="item.id"
          class="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs flex gap-3"
        >
          <div class="relative w-24 aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 shrink-0 self-start">
            <ArchiveThumb :item="item" :cache-key="thumbKeys[item.id] || null" />
          </div>
          <div class="min-w-0 flex-1 space-y-1.5">
            <p class="font-semibold text-sm text-slate-800 line-clamp-2">
              <span class="font-mono text-[11px] text-slate-400 mr-1">#{{ item.id }}</span>{{ item.title }}
            </p>
            <p v-if="processing[item.id]" class="text-[11px] font-semibold text-[#005B70]">Memproses thumbnail…</p>
            <p class="text-[11px] text-slate-500">
              {{ labelFor(MEDIA_TYPE_LABELS, item.mediaType) }} · {{ formatEventDate(item.eventDate) || 'Tanpa tanggal' }}
            </p>
            <div class="flex items-center justify-between gap-2">
              <VisibilityBadge :value="item.visibility" />
              <RowActions :view-to="{ name: 'Arsip', query: { item: String(item.id) } }" @edit="openEdit(item)" @delete="openDelete(item)" />
            </div>
          </div>
        </article>
      </div>

      <div v-if="list.totalPages > 1" class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <span>Halaman {{ page + 1 }} dari {{ list.totalPages }}</span>
        <Pagination :page="page" :total-pages="list.totalPages" @update:page="setPage" />
      </div>
    </template>

    <ArchiveFormModal v-model="isFormOpen" :archive-id="editId" @saved="onSaved" @gone="loadList" />
    <DeleteItemModal v-model="isDeleteOpen" kind="archive" :item="deleteTarget" @deleted="onDeleted" @gone="loadList" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import BaseButton from '../../components/ui/BaseButton.vue'
import BaseTable from '../../components/ui/BaseTable.vue'
import ArchiveThumb from '../../components/ArchiveThumb.vue'
import Pagination from '../../components/Pagination.vue'
import StateBlock from '../../components/StateBlock.vue'
import ArchiveFormModal from '../../components/staff/ArchiveFormModal.vue'
import DeleteItemModal from '../../components/staff/DeleteItemModal.vue'
import RowActions from '../../components/staff/RowActions.vue'
import VisibilityBadge from '../../components/staff/VisibilityBadge.vue'
import { selectClass } from '../../components/staff/formUtils.js'
import { listArchive } from '../../api/archive.js'
import { restoreArchive } from '../../api/admin.js'
import { listCategories, flattenCategories } from '../../api/categories.js'
import { getFilters } from '../../api/meta.js'
import { useStaffList } from '../../composables/staffList.js'
import { useThumbnailPolling } from '../../composables/thumbnailPolling.js'
import { useToast } from '../../composables/toast.js'
import { confirmLeaveIfUploading } from '../../composables/uploadTask.js'
import { errorMessage } from '../../utils/errors.js'
import {
  MEDIA_TYPE_LABELS,
  ARCHIVE_SORT_OPTIONS,
  labelFor,
  formatEventDate,
  formatDuration,
  formatNumber
} from '../../utils/labels.js'

const PAGE_SIZE = 20
const DEBOUNCE_MS = 300

const route = useRoute()
const router = useRouter()
const toast = useToast()

const { list, page, filters, loadList, setPage, setFilter, resetFilters, replaceItem, afterCreate } = useStaffList({
  routeName: 'AdminArsip',
  fetchPage: listArchive,
  route,
  router,
  size: PAGE_SIZE,
  filterKeys: ['q', 'categoryId', 'mediaType', 'sort']
})

onBeforeRouteLeave(() => confirmLeaveIfUploading())

const { processing, thumbKeys, watchProcessing, stopPolling } = useThumbnailPolling(replaceItem)

const hasFilters = computed(() => Object.values(filters.value).some((v) => v !== null))

// ---------- Opsi filter ----------
const categories = ref([])
const mediaTypes = ref(Object.keys(MEDIA_TYPE_LABELS))

onMounted(async () => {
  const [tree, meta] = await Promise.allSettled([listCategories('ARCHIVE'), getFilters()])
  if (tree.status === 'fulfilled') categories.value = flattenCategories(tree.value)
  if (meta.status === 'fulfilled' && meta.value.mediaTypes?.length) mediaTypes.value = meta.value.mediaTypes
})

// ---------- Pencarian (debounce → router.replace) ----------
const searchInput = ref(filters.value.q || '')
let debounceTimer = null

watch(searchInput, (value) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const q = value.trim() || null
    if (q !== filters.value.q) setFilter({ q }, { replace: true })
  }, DEBOUNCE_MS)
})

watch(
  () => filters.value.q,
  (q) => {
    if ((q || '') !== searchInput.value.trim()) {
      clearTimeout(debounceTimer)
      searchInput.value = q || ''
    }
  }
)

onBeforeUnmount(() => clearTimeout(debounceTimer))

function clearAll() {
  clearTimeout(debounceTimer)
  searchInput.value = ''
  resetFilters()
}

// ---------- Modal ----------
const isFormOpen = ref(false)
const editId = ref(null)
const isDeleteOpen = ref(false)
const deleteTarget = ref(null)

function openCreate() {
  editId.value = null
  isFormOpen.value = true
}
function openEdit(item) {
  editId.value = item.id
  isFormOpen.value = true
}
function openDelete(item) {
  deleteTarget.value = item
  isDeleteOpen.value = true
}

function onSaved(detail, { created } = {}) {
  if (created) {
    toast.show('Arsip berhasil diunggah')
    afterCreate()
  } else {
    replaceItem(detail)
    toast.show('Perubahan disimpan')
  }
  watchProcessing(detail)
}

// ---------- Hapus & pulihkan ----------
function onDeleted(id) {
  stopPolling(id)
  const title = deleteTarget.value?.title || `Arsip #${id}`
  loadList()
  toast.show(`"${title}" dipindahkan ke tempat sampah`, {
    duration: 8000,
    action: { label: 'Urungkan', onClick: () => undoDelete(id, title) }
  })
}

async function undoDelete(id, title) {
  try {
    await restoreArchive(id)
    toast.show(`"${title}" dipulihkan`)
    loadList()
  } catch (err) {
    if (err.status !== 401) toast.show(errorMessage(err), { tone: 'error' })
  }
}
</script>
