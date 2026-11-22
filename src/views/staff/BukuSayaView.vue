<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black tracking-tight text-slate-900">Buku Saya</h1>
        <p class="text-sm text-slate-500 mt-1">
          <template v-if="list.state === 'ready'">{{ formatNumber(list.totalElements) }} judul yang Anda unggah</template>
          <template v-else>Buku, modul ajar, dan bahan ajar yang Anda unggah</template>
        </p>
      </div>
      <BaseButton @click="openCreate">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        Unggah Buku
      </BaseButton>
    </div>

    <StateBlock
      v-if="list.state !== 'ready'"
      :state="list.state"
      :title="list.state === 'error' ? 'Gagal memuat buku Anda' : 'Belum ada buku'"
      :message="list.state === 'error' ? list.error : 'Unggah buku, modul ajar, atau bank soal pertama Anda.'"
      :reset-label="list.state === 'empty' ? 'Unggah Buku' : ''"
      :skeleton-count="3"
      grid-class="grid-cols-1"
      aspect-class="h-16"
      @retry="loadList"
      @reset="openCreate"
    />

    <template v-else>
      <!-- Tabel (md+) -->
      <BaseTable class="hidden md:block">
        <template #header>
          <th class="px-5 py-3">Judul</th>
          <th class="px-4 py-3">Jenis · Kelas</th>
          <th class="px-4 py-3">Akses</th>
          <th class="px-4 py-3">Ditambahkan</th>
          <th class="px-4 py-3 text-right">Diunduh</th>
          <th class="px-5 py-3 text-right">Aksi</th>
        </template>
        <tr v-for="book in list.items" :key="book.id" class="hover:bg-slate-50/60">
          <td class="px-5 py-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="relative w-10 h-14 rounded-md overflow-hidden border border-slate-200 shrink-0">
                <BookCover :book="book" compact />
              </div>
              <div class="min-w-0">
                <p class="font-semibold text-slate-800 text-sm line-clamp-2 max-w-sm">{{ book.title }}</p>
                <p v-if="book.author" class="text-xs text-slate-400 truncate max-w-sm">{{ book.author }}</p>
              </div>
            </div>
          </td>
          <td class="px-4 py-3 text-xs whitespace-nowrap">
            {{ labelFor(BOOK_TYPE_LABELS, book.bookType) }} · {{ labelFor(GRADE_LABELS, book.gradeLevel) }}
          </td>
          <td class="px-4 py-3"><VisibilityBadge :value="book.visibility" /></td>
          <td class="px-4 py-3 text-xs whitespace-nowrap">{{ formatDate(book.createdAt) }}</td>
          <td class="px-4 py-3 text-xs text-right tabular-nums">{{ formatNumber(book.downloadCount) }}</td>
          <td class="px-5 py-3">
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
            <p class="font-semibold text-sm text-slate-800 line-clamp-2">{{ book.title }}</p>
            <p class="text-[11px] text-slate-500">
              {{ labelFor(BOOK_TYPE_LABELS, book.bookType) }} · {{ labelFor(GRADE_LABELS, book.gradeLevel) }} ·
              {{ formatNumber(book.downloadCount) }}× diunduh
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
    <DeleteItemModal v-model="isDeleteOpen" kind="book" :item="deleteTarget" @deleted="onDeleted" @gone="onDeleted" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
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
import { listMyBooks } from '../../api/books.js'
import { useStaffList } from '../../composables/staffList.js'
import { useToast } from '../../composables/toast.js'
import { confirmLeaveIfUploading } from '../../composables/uploadTask.js'
import { BOOK_TYPE_LABELS, GRADE_LABELS, labelFor, formatDate, formatNumber } from '../../utils/labels.js'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const { list, page, loadList, setPage, replaceItem, afterCreate } = useStaffList({
  routeName: 'BukuSaya',
  fetchPage: listMyBooks,
  route,
  router
})

onBeforeRouteLeave(() => confirmLeaveIfUploading())

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

function onDeleted() {
  toast.show('Buku dipindahkan ke tempat sampah')
  loadList()
}
</script>
