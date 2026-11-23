<template>
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4 sm:gap-8">
      <!-- Merek -->
      <router-link to="/" class="shrink-0">
        <span class="text-sm sm:text-base font-semibold text-slate-900 leading-tight">
          E-Library<span class="hidden sm:inline font-normal text-slate-500"> SMAN 11 Garut</span>
        </span>
      </router-link>

      <!-- Navigasi utama -->
      <nav class="flex items-center gap-1 text-sm" aria-label="Navigasi utama">
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :class="[
            'px-3 py-1.5 rounded-lg transition-colors',
            link.active() ? 'bg-brand-soft text-brand font-medium' : 'text-slate-600 hover:text-slate-900'
          ]"
          :aria-current="link.active() ? 'page' : undefined"
        >
          {{ link.label }}
        </router-link>
      </nav>

      <div class="ml-auto flex items-center">
        <!-- Belum login -->
        <router-link
          v-if="!auth.isLoggedIn.value"
          to="/login"
          class="text-sm text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap"
        >
          Masuk Staf
        </router-link>

        <!-- Sudah login: avatar + menu pengguna -->
        <div v-else ref="menuRoot" class="relative">
          <button
            type="button"
            class="w-9 h-9 rounded-full bg-brand text-white text-xs font-semibold flex items-center justify-center cursor-pointer hover:ring-4 hover:ring-brand/15 transition-shadow"
            :title="auth.state.user?.fullName"
            aria-haspopup="menu"
            :aria-expanded="isMenuOpen"
            @click="isMenuOpen = !isMenuOpen"
          >
            {{ initials }}
          </button>

          <transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            leave-active-class="transition duration-100 ease-in"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-if="isMenuOpen"
              role="menu"
              class="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 z-50 text-sm"
            >
              <div class="px-4 py-2 border-b border-slate-100">
                <p class="font-medium text-slate-900 truncate">{{ auth.state.user?.fullName }}</p>
                <p class="text-xs text-slate-500">{{ roleLabel }}</p>
              </div>
              <router-link to="/unggahan" role="menuitem" class="block px-4 py-2 text-slate-700 hover:bg-slate-50">
                Unggahan Saya
              </router-link>
              <router-link
                v-if="auth.isLibrarian.value"
                to="/admin"
                role="menuitem"
                class="block px-4 py-2 text-slate-700 hover:bg-slate-50"
              >
                Panel Admin
              </router-link>
              <button
                type="button"
                role="menuitem"
                class="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 cursor-pointer"
                @click="openChangePassword"
              >
                Ganti Kata Sandi
              </button>
              <button
                type="button"
                role="menuitem"
                class="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 cursor-pointer border-t border-slate-100 mt-1"
                @click="handleLogout"
              >
                Keluar
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <ChangePasswordModal v-model="isChangePasswordOpen" />
  </header>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { auth } from '../stores/auth.js'
import { ROLE_LABELS } from '../utils/labels.js'
import ChangePasswordModal from './ChangePasswordModal.vue'

const router = useRouter()
const route = useRoute()

const links = [
  { to: '/', label: 'Buku', active: () => route.path === '/' || route.path.startsWith('/buku') },
  { to: '/arsip', label: 'Arsip', active: () => route.path.startsWith('/arsip') }
]

const isMenuOpen = ref(false)
const isChangePasswordOpen = ref(false)
const menuRoot = ref(null)

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

function openChangePassword() {
  isMenuOpen.value = false
  isChangePasswordOpen.value = true
}

function handleLogout() {
  isMenuOpen.value = false
  auth.logout()
  router.push('/')
}

// Tutup menu saat klik di luar, tombol Esc, atau pindah halaman
function onDocumentClick(e) {
  if (isMenuOpen.value && menuRoot.value && !menuRoot.value.contains(e.target)) {
    isMenuOpen.value = false
  }
}
function onKeydown(e) {
  if (e.key === 'Escape') isMenuOpen.value = false
}

watch(() => route.fullPath, () => {
  isMenuOpen.value = false
})

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>
