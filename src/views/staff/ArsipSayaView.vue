<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black tracking-tight text-slate-900">Arsip Saya</h1>
        <p class="text-sm text-slate-500 mt-1">
          <template v-if="list.state === 'ready'">{{ formatNumber(list.totalElements) }} item arsip yang Anda unggah</template>
          <template v-else>Foto, video, dan dokumen kegiatan sekolah yang Anda unggah</template>
        </p>
      </div>
      <BaseButton @click="openCreate">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        Unggah Arsip
      </BaseButton>
    </div>

    <StateBlock
      v-if="list.state !== 'ready'"
      :state="list.state"
      :title="list.state === 'error' ? 'Gagal memuat arsip Anda' : 'Belum ada arsip'"
      :message="list.state === 'error' ? list.error : 'Unggah foto, video, atau dokumen kegiatan sekolah pertama Anda.'"
      :reset-label="list.state === 'empty' ? 'Unggah Arsip' : ''"
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
          <th class="px-4 py-3">Jenis</th>
          <th class="px-4 py-3">Tanggal Kegiatan</th>
          <th class="px-4 py-3">Akses</th>
          <th class="px-4 py-3 text-right">Diunduh</th>
          <th class="px-5 py-3 text-right">Aksi</th>
        </template>
        <tr v-for="item in list.items" :key="item.id" class="hover:bg-slate-50/60">
          <td class="px-5 py-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="relative w-[72px] aspect-[4/3] rounded-md overflow-hidden border border-slate-200 shrink-0">
                <ArchiveThumb :item="item" :cache-key="thumbKeys[item.id] || null" />
              </div>
              <div class="min-w-0">
                <p class="font-semibold text-slate-800 text-sm line-clamp-2 max-w-sm">{{ item.title }}</p>
                <p v-if="processing[item.id]" class="text-[11px] font-semibold text-[#005B70] flex items-center gap-1.5 mt-0.5">
                  <span class="w-3 h-3 border-2 border-[#005B70]/30 border-t-[#005B70] rounded-full animate-spin"></span>
                  Memproses thumbnail…
                </p>
                <p v-else-if="item.categoryName" class="text-xs text-slate-400 truncate max-w-sm">{{ item.categoryName }}</p>
              </div>
            </div>
          </td>
          <td class="px-4 py-3 text-xs whitespace-nowrap">
            {{ labelFor(MEDIA_TYPE_LABELS, item.mediaType) }}<template v-if="item.durationSeconds"> · {{ formatDuration(item.durationSeconds) }}</template>
          </td>
          <td class="px-4 py-3 text-xs whitespace-nowrap">{{ formatEventDate(item.eventDate) || 'Tanpa tanggal' }}</td>
          <td class="px-4 py-3"><VisibilityBadge :value="item.visibility" /></td>
          <td class="px-4 py-3 text-xs text-right tabular-nums">{{ formatNumber(item.viewCount) }}</td>
          <td class="px-5 py-3">
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
            <p class="font-semibold text-sm text-slate-800 line-clamp-2">{{ item.title }}</p>
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
    <DeleteItemModal v-model="isDeleteOpen" kind="archive" :item="deleteTarget" @deleted="onDeleted" @gone="onDeleted" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
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
import { listMyArchive } from '../../api/archive.js'
import { useStaffList } from '../../composables/staffList.js'
import { useThumbnailPolling } from '../../composables/thumbnailPolling.js'
import { useToast } from '../../composables/toast.js'
import { confirmLeaveIfUploading } from '../../composables/uploadTask.js'
import {
  MEDIA_TYPE_LABELS,
  labelFor,
  formatEventDate,
  formatDuration,
  formatNumber
} from '../../utils/labels.js'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const { list, page, loadList, setPage, replaceItem, afterCreate } = useStaffList({
  routeName: 'ArsipSaya',
  fetchPage: listMyArchive,
  route,
  router
})

onBeforeRouteLeave(() => confirmLeaveIfUploading())

// ---------- Pemrosesan thumbnail (server mengisi width/height beberapa detik setelah unggah) ----------
const { processing, thumbKeys, watchProcessing, stopPolling } = useThumbnailPolling(replaceItem)

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

function onDeleted(id) {
  if (id) stopPolling(id)
  toast.show('Arsip dipindahkan ke tempat sampah')
  loadList()
}
</script>
