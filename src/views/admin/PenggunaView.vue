<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-slate-900">Pengguna</h1>
        <p class="text-sm text-slate-500 mt-1">
          Akun guru dan pustakawan. Akun tidak dapat dihapus; nonaktifkan akun yang tidak lagi dipakai.
        </p>
      </div>
      <BaseButton @click="openCreate">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        Tambah Pengguna
      </BaseButton>
    </div>

    <!-- Filter (di sisi klien) -->
    <section class="bg-white rounded-xl border border-slate-200/80 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
      <div class="sm:col-span-2 space-y-1">
        <label for="user-q" class="block text-xs font-medium text-slate-400">Cari</label>
        <input id="user-q" v-model="search" type="search" placeholder="Nama atau nama pengguna…" :class="selectClass()" />
      </div>
      <div class="space-y-1">
        <label for="user-role" class="block text-xs font-medium text-slate-400">Peran</label>
        <select id="user-role" v-model="roleFilter" :class="selectClass()">
          <option value="">Semua Peran</option>
          <option value="LIBRARIAN">Pustakawan</option>
          <option value="TEACHER">Guru</option>
        </select>
      </div>
    </section>

    <StateBlock
      v-if="state !== 'ready' || !visibleUsers.length"
      :state="state === 'ready' ? 'empty' : state"
      :title="state === 'error' ? 'Gagal memuat pengguna' : 'Tidak ada pengguna yang sesuai'"
      :message="state === 'error' ? error : 'Coba ubah kata kunci atau filter peran.'"
      :skeleton-count="3"
      grid-class="grid-cols-1"
      aspect-class="h-10"
      @retry="load"
    />

    <template v-else>
      <!-- Tabel (md+) -->
      <BaseTable class="hidden md:block">
        <template #header>
          <th class="px-4 py-3">Nama</th>
          <th class="px-4 py-3">Nama Pengguna</th>
          <th class="px-4 py-3">Peran</th>
          <th class="px-4 py-3">Status</th>
          <th class="px-4 py-3">Dibuat</th>
          <th class="px-4 py-3 text-right">Aksi</th>
        </template>
        <tr v-for="u in visibleUsers" :key="u.id" :class="['hover:bg-slate-50/60', u.active ? '' : 'text-slate-400']">
          <td class="px-4 py-3 text-sm font-semibold" :class="u.active ? 'text-slate-800' : 'text-slate-400'">
            {{ u.fullName }}
            <span v-if="isSelf(u)" class="ml-1 text-[11px] font-bold text-brand">(Anda)</span>
          </td>
          <td class="px-4 py-3 text-xs font-mono">@{{ u.username }}</td>
          <td class="px-4 py-3"><RoleBadge :role="u.role" /></td>
          <td class="px-4 py-3"><StatusBadge :active="u.active" /></td>
          <td class="px-4 py-3 text-xs whitespace-nowrap">{{ formatDate(u.createdAt) }}</td>
          <td class="px-4 py-3">
            <UserActions :user="u" :self="isSelf(u)" :busy="busyId === u.id" @edit="openEdit(u)" @reset="openReset(u)" @toggle="toggleActive(u)" />
          </td>
        </tr>
      </BaseTable>

      <!-- Kartu (ponsel) -->
      <div class="md:hidden space-y-3">
        <article v-for="u in visibleUsers" :key="u.id" class="bg-white rounded-xl border border-slate-200/80 p-3.5 space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <p class="font-semibold text-sm truncate" :class="u.active ? 'text-slate-800' : 'text-slate-400'">
                {{ u.fullName }} <span v-if="isSelf(u)" class="text-[11px] font-bold text-brand">(Anda)</span>
              </p>
              <p class="text-[11px] font-mono text-slate-400">@{{ u.username }}</p>
            </div>
            <div class="flex gap-1 shrink-0"><RoleBadge :role="u.role" /><StatusBadge :active="u.active" /></div>
          </div>
          <UserActions :user="u" :self="isSelf(u)" :busy="busyId === u.id" @edit="openEdit(u)" @reset="openReset(u)" @toggle="toggleActive(u)" />
        </article>
      </div>
    </template>

    <UserFormModal v-model="isFormOpen" :user="editTarget" @saved="onSaved" />
    <ResetPasswordModal v-model="isResetOpen" :user="resetTarget" @saved="onPasswordReset" />
    <ConfirmModal
      v-model="isDeactivateOpen"
      title="Nonaktifkan akun?"
      :message="`${deactivateTarget?.fullName ?? ''} tidak akan bisa masuk. Unggahan yang sudah ada tetap tersimpan, dan akun dapat diaktifkan kembali kapan saja.`"
      confirm-label="Ya, Nonaktifkan"
      danger
      :loading="busyId !== null"
      @confirm="confirmDeactivate"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import BaseTable from '../../components/ui/BaseTable.vue'
import StateBlock from '../../components/StateBlock.vue'
import ConfirmModal from '../../components/staff/ConfirmModal.vue'
import UserFormModal from '../../components/admin/UserFormModal.vue'
import ResetPasswordModal from '../../components/admin/ResetPasswordModal.vue'
import { selectClass } from '../../components/staff/formUtils.js'
import { listUsers, updateUser } from '../../api/admin.js'
import { auth } from '../../stores/auth.js'
import { useToast } from '../../composables/toast.js'
import { errorMessage } from '../../utils/errors.js'
import { ROLE_LABELS, formatDate } from '../../utils/labels.js'

const toast = useToast()

// ---------- Komponen kecil lokal ----------
const RoleBadge = (p) =>
  h(
    'span',
    {
      class: [
        'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border whitespace-nowrap',
        p.role === 'LIBRARIAN' ? 'bg-brand-soft text-brand border-brand/20' : 'bg-slate-50 text-slate-600 border-slate-200'
      ]
    },
    ROLE_LABELS[p.role] || p.role
  )
RoleBadge.props = ['role']

const StatusBadge = (p) =>
  h(
    'span',
    {
      class: [
        'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border whitespace-nowrap',
        p.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
      ]
    },
    p.active ? 'Aktif' : 'Nonaktif'
  )
StatusBadge.props = ['active']

const actionBtn =
  'px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
const UserActions = (p, { emit: e }) =>
  h('div', { class: 'flex flex-wrap items-center justify-end gap-1' }, [
    h('button', { type: 'button', class: `${actionBtn} text-slate-600 hover:bg-slate-100`, onClick: () => e('edit') }, 'Edit'),
    p.self
      ? h('span', { class: 'px-2.5 text-[11px] text-slate-400', title: 'Gunakan Ganti Kata Sandi di sidebar' }, 'Kata sandi: lewat sidebar')
      : h('button', { type: 'button', class: `${actionBtn} text-slate-600 hover:bg-slate-100`, onClick: () => e('reset') }, 'Reset Kata Sandi'),
    h(
      'button',
      {
        type: 'button',
        class: p.user.active ? `${actionBtn} text-rose-600 hover:bg-rose-50` : `${actionBtn} text-emerald-700 hover:bg-emerald-50`,
        disabled: p.self || p.busy,
        title: p.self ? 'Anda tidak dapat menonaktifkan akun sendiri' : undefined,
        onClick: () => e('toggle')
      },
      p.busy ? 'Menyimpan…' : p.user.active ? 'Nonaktifkan' : 'Aktifkan'
    )
  ])
UserActions.props = ['user', 'self', 'busy']
UserActions.emits = ['edit', 'reset', 'toggle']

// ---------- Data ----------
const users = ref([])
const state = ref('loading')
const error = ref('')

async function load() {
  state.value = 'loading'
  try {
    users.value = await listUsers()
    state.value = 'ready'
  } catch (err) {
    if (err.status === 401) return
    error.value = errorMessage(err)
    state.value = 'error'
  }
}
onMounted(load)

const search = ref('')
const roleFilter = ref('')

const visibleUsers = computed(() => {
  const q = search.value.trim().toLowerCase()
  return users.value
    .filter((u) => !roleFilter.value || u.role === roleFilter.value)
    .filter((u) => !q || u.fullName.toLowerCase().includes(q) || u.username.toLowerCase().includes(q))
    .sort((a, b) => Number(b.active) - Number(a.active) || a.fullName.localeCompare(b.fullName, 'id'))
})

const isSelf = (u) => u.id === auth.state.user?.id

function replaceUser(saved) {
  const i = users.value.findIndex((u) => u.id === saved.id)
  if (i >= 0) users.value.splice(i, 1, saved)
  else users.value.push(saved)
}

// ---------- Tambah / edit ----------
const isFormOpen = ref(false)
const editTarget = ref(null)

function openCreate() {
  editTarget.value = null
  isFormOpen.value = true
}
function openEdit(u) {
  editTarget.value = u
  isFormOpen.value = true
}

function onSaved(saved, { created } = {}) {
  replaceUser(saved)
  toast.show(created ? `Akun @${saved.username} dibuat. Sampaikan kata sandinya secara langsung.` : 'Perubahan disimpan', {
    duration: created ? 6000 : 3000
  })
}

// ---------- Reset kata sandi ----------
const isResetOpen = ref(false)
const resetTarget = ref(null)

function openReset(u) {
  resetTarget.value = u
  isResetOpen.value = true
}
function onPasswordReset(saved) {
  toast.show(`Kata sandi @${saved.username} diperbarui`)
}

// ---------- Aktif / nonaktif ----------
const busyId = ref(null)
const isDeactivateOpen = ref(false)
const deactivateTarget = ref(null)

function toggleActive(u) {
  if (isSelf(u)) return
  if (u.active) {
    deactivateTarget.value = u
    isDeactivateOpen.value = true
  } else {
    setActive(u, true)
  }
}

async function confirmDeactivate() {
  await setActive(deactivateTarget.value, false)
  isDeactivateOpen.value = false
}

async function setActive(u, active) {
  busyId.value = u.id
  try {
    const saved = await updateUser(u.id, { active })
    replaceUser(saved)
    toast.show(active ? `@${saved.username} diaktifkan kembali` : `@${saved.username} dinonaktifkan`)
  } catch (err) {
    if (err.status !== 401) toast.show(errorMessage(err), { tone: 'error' })
  } finally {
    busyId.value = null
  }
}
</script>
