<template>
  <div class="min-h-screen bg-[#F8FAFC] text-slate-800 lg:flex">

    <!-- Top bar (ponsel / tablet) -->
    <header class="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-100 px-4 h-14 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2 min-w-0">
        <img :src="schoolLogo" alt="Logo SMAN 11 Garut" class="w-8 h-8 object-contain shrink-0" />
        <span class="font-bold text-sm text-slate-900 truncate">E-Library <span class="text-[#005B70]">Staf</span></span>
      </router-link>
      <button
        type="button"
        class="w-10 h-10 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center justify-center cursor-pointer"
        :aria-expanded="isDrawerOpen"
        aria-controls="staff-sidebar"
        aria-label="Buka menu"
        @click="isDrawerOpen = true"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </header>

    <!-- Latar gelap drawer -->
    <transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-150"
      leave-to-class="opacity-0"
    >
      <div v-if="isDrawerOpen" class="lg:hidden fixed inset-0 z-40 bg-slate-900/50" @click="isDrawerOpen = false"></div>
    </transition>

    <!-- Sidebar -->
    <aside
      id="staff-sidebar"
      :class="[
        'fixed lg:sticky top-0 left-0 z-50 h-screen w-72 shrink-0 bg-[#0F1E2E] text-slate-300 flex flex-col transition-transform duration-200 lg:translate-x-0',
        isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="px-5 pt-6 pb-5 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-3 min-w-0">
          <span class="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
            <img :src="schoolLogo" alt="Logo SMAN 11 Garut" class="w-full h-full object-contain" />
          </span>
          <span class="min-w-0">
            <span class="block font-bold text-sm text-white leading-tight">E-Library Staf</span>
            <span class="block text-[11px] text-slate-400 leading-tight">SMAN 11 Garut</span>
          </span>
        </router-link>
        <button
          type="button"
          class="lg:hidden w-8 h-8 rounded-lg hover:bg-white/10 text-slate-300 flex items-center justify-center cursor-pointer"
          aria-label="Tutup menu"
          @click="isDrawerOpen = false"
        >
          ✕
        </button>
      </div>

      <!-- Kartu pengguna -->
      <div class="mx-4 mb-5 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
        <span class="w-10 h-10 rounded-full bg-[#005B70] text-white text-sm font-bold flex items-center justify-center shrink-0">
          {{ initials }}
        </span>
        <span class="min-w-0">
          <span class="block text-sm font-semibold text-white truncate">{{ auth.state.user?.fullName }}</span>
          <span class="block text-[11px] text-slate-400">{{ roleLabel }} · @{{ auth.state.user?.username }}</span>
        </span>
      </div>

      <!-- Navigasi -->
      <nav class="flex-1 overflow-y-auto px-3 space-y-1 text-sm" aria-label="Menu staf">
        <p class="px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Unggahan Saya</p>
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors',
            isActive(link.to) ? 'bg-[#005B70] text-white' : 'hover:bg-white/5 hover:text-white'
          ]"
        >
          <span class="w-5 h-5 shrink-0" v-html="link.icon"></span>
          <span>{{ link.label }}</span>
        </router-link>

        <template v-if="auth.isLibrarian.value">
          <p class="px-3 pt-5 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Pengelolaan</p>
          <router-link
            to="/admin"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors hover:bg-white/5 hover:text-white"
          >
            <span class="w-5 h-5 shrink-0" v-html="ICONS.admin"></span>
            <span>Panel Admin</span>
          </router-link>
        </template>
      </nav>

      <!-- Aksi bawah -->
      <div class="px-3 py-4 border-t border-white/10 space-y-1 text-sm">
        <router-link to="/" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 hover:text-white transition-colors">
          <span class="w-5 h-5 shrink-0" v-html="ICONS.catalog"></span>
          <span>Lihat Katalog</span>
        </router-link>
        <button
          type="button"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 hover:text-white transition-colors cursor-pointer text-left"
          @click="openChangePassword"
        >
          <span class="w-5 h-5 shrink-0" v-html="ICONS.key"></span>
          <span>Ganti Kata Sandi</span>
        </button>
        <button
          type="button"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-colors cursor-pointer text-left"
          @click="handleLogout"
        >
          <span class="w-5 h-5 shrink-0" v-html="ICONS.logout"></span>
          <span>Keluar</span>
        </button>
      </div>
    </aside>

    <!-- Konten -->
    <main class="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
      <div class="max-w-6xl mx-auto">
        <router-view />
      </div>
    </main>

    <ChangePasswordModal v-model="isChangePasswordOpen" />
    <ToastHost />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { auth } from '../stores/auth.js'
import { ROLE_LABELS } from '../utils/labels.js'
import ChangePasswordModal from '../components/ChangePasswordModal.vue'
import ToastHost from '../components/ToastHost.vue'
import schoolLogo from '../assets/images/placeholders/logo-sman11.svg'

const route = useRoute()
const router = useRouter()

// Ikon SVG statis (bukan input pengguna)
const svg = (body) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">${body}</svg>`
const ICONS = {
  book: svg('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'),
  archive: svg('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>'),
  admin: svg('<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>'),
  catalog: svg('<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'),
  key: svg('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
  logout: svg('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>')
}

const links = [
  { to: '/unggahan/buku', label: 'Buku Saya', icon: ICONS.book },
  { to: '/unggahan/arsip', label: 'Arsip Saya', icon: ICONS.archive }
]

const isActive = (to) => route.path === to || route.path.startsWith(to + '/')

const roleLabel = computed(() => ROLE_LABELS[auth.state.user?.role] || '')
const initials = computed(() => {
  const name = auth.state.user?.fullName || auth.state.user?.username || ''
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
})

// Drawer ponsel: tutup saat pindah halaman atau Esc
const isDrawerOpen = ref(false)
watch(() => route.fullPath, () => {
  isDrawerOpen.value = false
})
function onKeydown(e) {
  if (e.key === 'Escape') isDrawerOpen.value = false
}
onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))

const isChangePasswordOpen = ref(false)
function openChangePassword() {
  isDrawerOpen.value = false
  isChangePasswordOpen.value = true
}

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>
