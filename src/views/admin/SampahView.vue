<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black tracking-tight text-slate-900">Tempat Sampah</h1>
        <p class="text-sm text-slate-500 mt-1">
          Item yang dihapus guru atau pustakawan. Pulihkan, atau hapus permanen untuk membebaskan ruang penyimpanan.
        </p>
      </div>
      <BaseButton
        variant="danger"
        :disabled="list.state !== 'ready'"
        @click="isEmptyOpen = true"
      >
        Kosongkan {{ tabLabel }}
      </BaseButton>
    </div>

    <!-- Tab Buku / Arsip -->
    <div class="inline-flex gap-1 p-1 bg-slate-100 rounded-xl text-xs" role="tablist" aria-label="Area tempat sampah">
      <button
        v-for="t in TABS"
        :key="t.value"
        type="button"
        role="tab"
        :aria-selected="tab === t.value"
        :class="[
          'px-4 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer',
          tab === t.value ? 'bg-white text-[#005B70] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
        ]"
        @click="setFilter({ tab: t.value === 'buku' ? null : t.value })"
      >
        {{ t.label }}
      </button>
    </div>

    <p class="text-[11px] text-slate-400">
      Item dihapus permanen secara otomatis setelah masa simpan berakhir (lihat kolom "Dihapus permanen"). Berkas yang sama baru bisa diunggah ulang setelah dihapus permanen.
    </p>

    <StateBlock
      v-if="list.state !== 'ready'"
      :state="list.state"
      :title="list.state === 'error' ? 'Gagal memuat tempat sampah' : `Tempat sampah ${tabLabel.toLowerCase()} kosong`"
      :message="list.state === 'error' ? list.error : 'Tidak ada item yang sedang dihapus.'"
      :skeleton-count="3"
      grid-class="grid-cols-1"
      aspect-class="h-12"
      @retry="loadList"
    />

    <template v-else>
      <!-- Tabel (md+) -->
      <BaseTable class="hidden md:block">
        <template #header>
          <th class="px-4 py-3 w-16">ID</th>
          <th class="px-4 py-3">Judul</th>
          <th class="px-4 py-3">Jenis</th>
          <th class="px-4 py-3">Pengunggah</th>
          <th class="px-4 py-3">Dihapus</th>
          <th class="px-4 py-3">Dihapus permanen</th>
          <th class="px-4 py-3 text-right">Aksi</th>
        </template>
        <tr v-for="item in list.items" :key="item.id" class="hover:bg-slate-50/60">
          <td class="px-4 py-3 text-xs font-mono text-slate-400">#{{ item.id }}</td>
          <td class="px-4 py-3">
            <p class="font-semibold text-slate-800 text-sm line-clamp-2 max-w-xs">{{ item.title }}</p>
            <p class="text-xs text-slate-400 truncate max-w-xs">{{ item.originalName }} · {{ formatBytes(item.fileSize) }}</p>
          </td>
          <td class="px-4 py-3 text-xs whitespace-nowrap">{{ kindLabel(item.kind) }}</td>
          <td class="px-4 py-3 text-xs">{{ item.uploadedByName || 'Impor massal' }}</td>
          <td class="px-4 py-3 text-xs whitespace-nowrap">{{ formatDateTime(item.deletedAt) }}</td>
          <td class="px-4 py-3 text-xs whitespace-nowrap">
            <template v-if="item.purgeAt">{{ formatDate(item.purgeAt) }}</template>
            <span v-else class="text-slate-400">Tidak otomatis</span>
          </td>
          <td class="px-4 py-3">
            <div class="flex items-center justify-end gap-2">
              <BaseButton size="sm" variant="outline" :loading="busyId === item.id && busyAction === 'restore'" :disabled="busyId !== null" @click="restore(item)">
                Pulihkan
              </BaseButton>
              <BaseButton size="sm" variant="danger" :disabled="busyId !== null" @click="askPurge(item)">
                Hapus Permanen
              </BaseButton>
            </div>
          </td>
        </tr>
      </BaseTable>

      <!-- Kartu (ponsel) -->
      <div class="md:hidden space-y-3">
        <article
          v-for="item in list.items"
          :key="item.id"
          class="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs space-y-2"
        >
          <p class="font-semibold text-sm text-slate-800 line-clamp-2">
            <span class="font-mono text-[11px] text-slate-400 mr-1">#{{ item.id }}</span>{{ item.title }}
          </p>
          <p class="text-[11px] text-slate-500">
            {{ kindLabel(item.kind) }} · {{ item.uploadedByName || 'Impor massal' }} · dihapus {{ formatDateTime(item.deletedAt) }}
          </p>
          <p class="text-[11px] text-slate-400">
            Dihapus permanen: {{ item.purgeAt ? formatDate(item.purgeAt) : 'tidak otomatis' }}
          </p>
          <div class="flex gap-2 pt-1">
            <BaseButton size="sm" variant="outline" :loading="busyId === item.id && busyAction === 'restore'" :disabled="busyId !== null" @click="restore(item)">
              Pulihkan
            </BaseButton>
            <BaseButton size="sm" variant="danger" :disabled="busyId !== null" @click="askPurge(item)">
              Hapus Permanen
            </BaseButton>
          </div>
        </article>
      </div>

      <div v-if="list.totalPages > 1" class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <span>{{ formatNumber(list.totalElements) }} item · halaman {{ page + 1 }} dari {{ list.totalPages }}</span>
        <Pagination :page="page" :total-pages="list.totalPages" @update:page="setPage" />
      </div>
    </template>

    <!-- Konfirmasi hapus permanen satu item -->
    <ConfirmModal
      v-model="isPurgeOpen"
      title="Hapus permanen?"
      :message="`“${purgeTarget?.title ?? ''}” dan berkasnya akan dihapus selamanya dari server. Tindakan ini tidak dapat dibatalkan.`"
      confirm-label="Ya, Hapus Permanen"
      danger
      :loading="busyAction === 'purge'"
      @confirm="purge"
    />

    <!-- Konfirmasi kosongkan tempat sampah -->
    <ConfirmModal
      v-model="isEmptyOpen"
      :title="`Kosongkan tempat sampah ${tabLabel.toLowerCase()}?`"
      :message="`Semua ${formatNumber(list.totalElements)} item di tempat sampah ${tabLabel.toLowerCase()} beserta berkasnya akan dihapus selamanya. Tindakan ini tidak dapat dibatalkan.`"
      confirm-label="Ya, Kosongkan"
      danger
      :loading="busyAction === 'empty'"
      @confirm="emptyAll"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '../../components/ui/BaseButton.vue'
import BaseTable from '../../components/ui/BaseTable.vue'
import Pagination from '../../components/Pagination.vue'
import StateBlock from '../../components/StateBlock.vue'
import ConfirmModal from '../../components/staff/ConfirmModal.vue'
import { listTrash, purgeTrashItem, emptyTrash, restoreItem } from '../../api/admin.js'
import { useStaffList } from '../../composables/staffList.js'
import { useToast } from '../../composables/toast.js'
import { errorMessage } from '../../utils/errors.js'
import {
  BOOK_TYPE_LABELS,
  MEDIA_TYPE_LABELS,
  labelFor,
  formatBytes,
  formatDate,
  formatDateTime,
  formatNumber
} from '../../utils/labels.js'

const TABS = [
  { value: 'buku', label: 'Buku' },
  { value: 'arsip', label: 'Arsip' }
]

const route = useRoute()
const router = useRouter()
const toast = useToast()

// ?tab=arsip (Buku = bawaan, tanpa parameter)
const area = (tab) => (tab === 'arsip' ? 'archive' : 'book')

const { list, page, filters, loadList, setPage, setFilter } = useStaffList({
  routeName: 'AdminSampah',
  fetchPage: ({ tab, page: p, size }) => listTrash(area(tab), { page: p, size }),
  route,
  router,
  size: 20,
  filterKeys: ['tab']
})

const tab = computed(() => (filters.value.tab === 'arsip' ? 'arsip' : 'buku'))
const kind = computed(() => area(tab.value))
const tabLabel = computed(() => (tab.value === 'arsip' ? 'Arsip' : 'Buku'))

function kindLabel(code) {
  return kind.value === 'archive' ? labelFor(MEDIA_TYPE_LABELS, code) : labelFor(BOOK_TYPE_LABELS, code)
}

const busyId = ref(null)
const busyAction = ref(null) // restore | purge | empty

function handleError(err) {
  if (err.status === 401) return
  if (err.status === 404) {
    toast.show('Item sudah tidak ada di tempat sampah.', { tone: 'error' })
    loadList()
    return
  }
  toast.show(errorMessage(err), { tone: 'error' })
}

// ---------- Pulihkan ----------
async function restore(item) {
  busyId.value = item.id
  busyAction.value = 'restore'
  try {
    const detail = await restoreItem(kind.value, item.id)
    const to = kind.value === 'archive' ? { name: 'Arsip', query: { item: String(detail.id) } } : `/buku/${detail.id}`
    toast.show(`"${detail.title}" dipulihkan`, { duration: 6000, action: { label: 'Lihat', to } })
    loadList()
  } catch (err) {
    handleError(err)
  } finally {
    busyId.value = null
    busyAction.value = null
  }
}

// ---------- Hapus permanen ----------
const isPurgeOpen = ref(false)
const purgeTarget = ref(null)

function askPurge(item) {
  purgeTarget.value = item
  isPurgeOpen.value = true
}

async function purge() {
  const item = purgeTarget.value
  if (!item) return
  busyId.value = item.id
  busyAction.value = 'purge'
  try {
    await purgeTrashItem(kind.value, item.id)
    toast.show(`"${item.title}" dihapus permanen`)
    loadList()
  } catch (err) {
    handleError(err)
  } finally {
    busyId.value = null
    busyAction.value = null
    isPurgeOpen.value = false
  }
}

// ---------- Kosongkan ----------
const isEmptyOpen = ref(false)

async function emptyAll() {
  busyAction.value = 'empty'
  busyId.value = -1
  try {
    const res = await emptyTrash(kind.value)
    toast.show(`${formatNumber(res?.purged ?? 0)} item dihapus permanen`)
    loadList()
  } catch (err) {
    handleError(err)
  } finally {
    busyId.value = null
    busyAction.value = null
    isEmptyOpen.value = false
  }
}
</script>
