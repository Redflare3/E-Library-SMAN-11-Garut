<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black tracking-tight text-slate-900">Semua Buku</h1>
        <p class="text-sm text-slate-500 mt-1">
          <template v-if="list.state === 'ready'">{{ formatNumber(list.totalElements) }} judul ditemukan</template>
          <template v-else>Seluruh koleksi buku, termasuk unggahan guru, impor massal, dan Khusus Staf</template>
        </p>
      </div>
      <BaseButton @click="openCreate">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        Unggah Buku
      </BaseButton>
    </div>

    <!-- Filter -->
    <section class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
      <div class="sm:col-span-2 lg:col-span-1 space-y-1">
        <label for="admin-book-q" class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cari</label>
        <input
          id="admin-book-q"
          v-model="searchInput"
          type="search"
          placeholder="Judul, penulis, deskripsi…"
          :class="selectClass()"
        />
      </div>
      <div class="space-y-1">
        <label for="admin-book-cat" class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategori</label>
        <select id="admin-book-cat" :value="filters.categoryId ?? ''" :class="selectClass()" @change="setFilter({ categoryId: $event.target.value || null })">
          <option value="">Semua Kategori</option>
          <option v-for="cat in categories" :key="cat.id" :value="String(cat.id)">
            {{ '  '.repeat(cat.depth * 2) }}{{ cat.name }}
          </option>
        </select>
      </div>
      <div class="space-y-1">
        <label for="admin-book-grade" class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kelas</label>
        <select id="admin-book-grade" :value="filters.grade ?? ''" :class="selectClass()" @change="setFilter({ grade: $event.target.value || null })">
          <option value="">Semua Kelas</option>
          <option v-for="g in gradeLevels" :key="g" :value="g">{{ labelFor(GRADE_LABELS, g) }}</option>
        </select>
      </div>
      <div class="space-y-1">
        <label for="admin-book-type" class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jenis</label>
        <select id="admin-book-type" :value="filters.type ?? ''" :class="selectClass()" @change="setFilter({ type: $event.target.value || null })">
          <option value="">Semua Jenis</option>
          <option v-for="t in bookTypes" :key="t" :value="t">{{ labelFor(BOOK_TYPE_LABELS, t) }}</option>
        </select>
      </div>
      <div class="space-y-1">
        <label for="admin-book-sort" class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Urutkan</label>
        <select id="admin-book-sort" :value="filters.sort ?? 'newest'" :class="selectClass()" @change="setFilter({ sort: $event.target.value === 'newest' ? null : $event.target.value })">
          <option value="newest">Terbaru Diunggah</option>
          <option value="title">Judul (A - Z)</option>
          <option value="popular">Paling Banyak Diunduh</option>
        </select>
      </div>
      <div v-if="hasFilters" class="sm:col-span-2 lg:col-span-5 flex justify-end">
        <button type="button" class="text-xs font-semibold text-slate-400 hover:text-rose-600 cursor-pointer" @click="clearAll">
          Reset Semua Filter
        </button>
      </div>
    </section>

    <StateBlock
      v-if="list.state !== 'ready'"
      :state="list.state"
      :title="list.state === 'error' ? 'Gagal memuat buku' : 'Tidak ada buku yang sesuai'"
      :message="list.state === 'error' ? list.error : hasFilters ? 'Coba ubah kata kunci atau filter.' : 'Belum ada buku di perpustakaan.'"
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
          <th class="px-4 py-3">Jenis · Kelas</th>
          <th class="px-4 py-3">Kategori</th>
          <th class="px-4 py-3">Akses</th>
          <th class="px-4 py-3 text-right">Diunduh</th>
          <th class="px-4 py-3 text-right">Aksi</th>
        </template>
        <tr v-for="book in list.items" :key="book.id" class="hover:bg-slate-50/60">
          <td class="px-4 py-3 text-xs font-mono text-slate-400">#{{ book.id }}</td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="relative w-10 h-14 rounded-md overflow-hidden border border-slate-200 shrink-0">
                <BookCover :book="book" compact />
              </div>
              <div class="min-w-0">
                <p class="font-semibold text-slate-800 text-sm line-clamp-2 max-w-xs">{{ book.title }}</p>
                <p v-if="book.author" class="text-xs text-slate-400 truncate max-w-xs">{{ book.author }}</p>
              </div>
            </div>
          </td>
          <td class="px-4 py-3 text-xs whitespace-nowrap">
            {{ labelFor(BOOK_TYPE_LABELS, book.bookType) }} · {{ labelFor(GRADE_LABELS, book.gradeLevel) }}
          </td>
          <td class="px-4 py-3 text-xs">{{ book.categoryName || '—' }}</td>
          <td class="px-4 py-3"><VisibilityBadge :value="book.visibility" /></td>
          <td class="px-4 py-3 text-xs text-right tabular-nums">{{ formatNumber(book.downloadCount) }}</td>
          <td class="px-4 py-3">
            <RowActions :view-to="`/buku/${book.id}`" @edit="openEdit(book)" @delete="openDelete(book)" />
          </td>
        </tr>
      </BaseTable>

      <!-- Kartu (ponsel) -->
      <div class="md:hidden space-y-3">
        <article
          v-for="book in list.items"
          :key="book.id"
          class="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs flex gap-3"
        >
          <div class="relative w-14 h-20 rounded-lg overflow-hidden border border-slate-200 shrink-0">
            <BookCover :book="book" compact />
          </div>
          <div class="min-w-0 flex-1 space-y-1.5">
            <p class="font-semibold text-sm text-slate-800 line-clamp-2">
              <span class="font-mono text-[11px] text-slate-400 mr-1">#{{ book.id }}</span>{{ book.title }}
            </p>
            <p class="text-[11px] text-slate-500">
              {{ labelFor(BOOK_TYPE_LABELS, book.bookType) }} · {{ labelFor(GRADE_LABELS, book.gradeLevel) }}<template v-if="book.categoryName"> · {{ book.categoryName }}</template>
            </p>
            <div class="flex items-center justify-between gap-2">
              <VisibilityBadge :value="book.visibility" />
              <RowActions :view-to="`/buku/${book.id}`" @edit="openEdit(book)" @delete="openDelete(book)" />
            </div>
          </div>
        </article>
      </div>

      <div v-if="list.totalPages > 1" class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <span>Halaman {{ page + 1 }} dari {{ list.totalPages }}</span>
        <Pagination :page="page" :total-pages="list.totalPages" @update:page="setPage" />
      </div>
    </template>

    <BookFormModal v-model="isFormOpen" :book-id="editId" @saved="onSaved" @gone="loadList" />
    <DeleteItemModal v-model="isDeleteOpen" kind="book" :item="deleteTarget" @deleted="onDeleted" @gone="loadList" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import BaseButton from '../../components/ui/BaseButton.vue'
import BaseTable from '../../components/ui/BaseTable.vue'
import BookCover from '../../components/BookCover.vue'
import Pagination from '../../components/Pagination.vue'
import StateBlock from '../../components/StateBlock.vue'
import BookFormModal from '../../components/staff/BookFormModal.vue'
import DeleteItemModal from '../../components/staff/DeleteItemModal.vue'
import RowActions from '../../components/staff/RowActions.vue'
import VisibilityBadge from '../../components/staff/VisibilityBadge.vue'
import { selectClass } from '../../components/staff/formUtils.js'
import { listBooks } from '../../api/books.js'
import { restoreBook } from '../../api/admin.js'
import { listCategories, flattenCategories } from '../../api/categories.js'
import { getFilters } from '../../api/meta.js'
import { useStaffList } from '../../composables/staffList.js'
import { useToast } from '../../composables/toast.js'
import { confirmLeaveIfUploading } from '../../composables/uploadTask.js'
import { errorMessage } from '../../utils/errors.js'
import { BOOK_TYPE_LABELS, GRADE_LABELS, labelFor, formatNumber } from '../../utils/labels.js'

const PAGE_SIZE = 20
const DEBOUNCE_MS = 300

const route = useRoute()
const router = useRouter()
const toast = useToast()

const { list, page, filters, loadList, setPage, setFilter, resetFilters, replaceItem, afterCreate } = useStaffList({
  routeName: 'AdminBuku',
  fetchPage: listBooks,
  route,
  router,
  size: PAGE_SIZE,
  filterKeys: ['q', 'categoryId', 'grade', 'type', 'sort']
})

onBeforeRouteLeave(() => confirmLeaveIfUploading())

const hasFilters = computed(() => Object.values(filters.value).some((v) => v !== null))

// ---------- Opsi filter ----------
const categories = ref([])
const gradeLevels = ref(Object.keys(GRADE_LABELS))
const bookTypes = ref(Object.keys(BOOK_TYPE_LABELS))

onMounted(async () => {
  const [tree, meta] = await Promise.allSettled([listCategories('BOOK'), getFilters()])
  if (tree.status === 'fulfilled') categories.value = flattenCategories(tree.value)
  if (meta.status === 'fulfilled') {
    if (meta.value.gradeLevels?.length) gradeLevels.value = meta.value.gradeLevels
    if (meta.value.bookTypes?.length) bookTypes.value = meta.value.bookTypes
  }
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
function openEdit(book) {
  editId.value = book.id
  isFormOpen.value = true
}
function openDelete(book) {
  deleteTarget.value = book
  isDeleteOpen.value = true
}

function onSaved(detail, { created, partial } = {}) {
  if (created) {
    toast.show('Buku berhasil diunggah')
    afterCreate()
    return
  }
  replaceItem(detail)
  if (!partial) toast.show('Perubahan disimpan')
}

// ---------- Hapus & pulihkan ----------
function onDeleted(id) {
  const title = deleteTarget.value?.title || `Buku #${id}`
  loadList()
  toast.show(`"${title}" dipindahkan ke tempat sampah`, {
    duration: 8000,
    action: { label: 'Urungkan', onClick: () => undoDelete(id, title) }
  })
}


async function undoDelete(id, title) {
  try {
    await restoreBook(id)
    toast.show(`"${title}" dipulihkan`)
    loadList()
  } catch (err) {
    if (err.status !== 401) toast.show(errorMessage(err), { tone: 'error' })
  }
}
</script>
