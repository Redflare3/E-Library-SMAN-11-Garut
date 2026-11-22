<template>
  <header class="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
    <!-- Topbar Navigation -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <!-- Logo & Brand SMAN 11 Garut -->
        <router-link to="/" class="flex items-center gap-3 group">
          <div class="w-11 h-11 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-xs">
            <!-- Dynamic School Logo with Fallback SVG -->
            <img 
              v-if="schoolLogoUrl" 
              :src="schoolLogoUrl" 
              alt="Logo SMAN 11 Garut" 
              class="w-full h-full object-contain"
            />
            <div v-else class="w-full h-full rounded-full bg-gradient-to-br from-[#0B6B82] to-[#085568] flex items-center justify-center text-white">
              <!-- Inline SVG School Crest / Book Symbol -->
              <svg class="w-6 h-6 text-amber-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>

          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-slate-900 text-base md:text-lg tracking-tight group-hover:text-[#0B6B82] transition-colors">E-Library</span>
              <span class="font-bold text-[#0B6B82] text-base md:text-lg tracking-tight">SMAN 11 Garut</span>
            </div>
            <p class="text-[11px] text-slate-400 font-normal leading-tight">Perpustakaan &amp; Repositori Literasi Digital</p>
          </div>
        </router-link>

        <!-- Center Menu Navigasi: Katalog Buku, Cari & Filter Kategori -->
        <nav class="hidden md:flex items-center gap-1 lg:gap-2">
          <!-- 1. Katalog Buku (Active on / , /katalog, /buku/:id) -->
          <router-link 
            to="/"
            :class="[
              'px-4 py-2 text-xs lg:text-sm font-semibold transition-colors text-center leading-tight rounded-xl cursor-pointer',
              $route.path === '/' || $route.path === '/katalog' || $route.path.startsWith('/buku')
                ? 'bg-[#E1EFF6] text-[#005B70] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            ]"
          >
            Katalog<br />Buku
          </router-link>

          <!-- 2. Cari & Filter Kategori -->
          <router-link 
            to="/kategori"
            :class="[
              'px-4 py-2 text-xs lg:text-sm font-medium transition-colors text-center leading-tight rounded-xl cursor-pointer',
              $route.path === '/kategori'
                ? 'bg-[#E1EFF6] text-[#005B70] font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            ]"
          >
            Cari &amp; Filter<br />Kategori
          </router-link>

        </nav>

        <!-- Right Action Buttons -->
        <div class="flex items-center gap-2.5">
          <!-- Dark Teal Icon Button (Book icon) -->
          <button 
            type="button" 
            title="Katalog &amp; Pencarian Buku"
            class="w-10 h-10 rounded-xl bg-[#005B70] hover:bg-[#004859] text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
            @click="$router.push('/kategori')"
          >
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </button>

          <!-- Belum login: tombol Masuk Staf -->
          <router-link
            v-if="!auth.isLoggedIn.value"
            to="/login"
            class="inline-flex items-center gap-2 px-3.5 py-2 bg-[#D6EEF5] hover:bg-[#c9e6ef] text-[#005B70] font-semibold text-xs md:text-sm rounded-xl transition-colors shadow-2xs cursor-pointer"
          >
            <svg class="w-4 h-4 text-[#005B70]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
            </svg>
            <span>Masuk Staf</span>
          </router-link>

          <!-- Sudah login: avatar + menu pengguna -->
          <div v-else ref="menuRoot" class="relative">
            <button
              type="button"
              class="w-10 h-10 rounded-full border border-slate-200 bg-[#005B70] hover:ring-2 hover:ring-[#005B70]/30 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer transition-all"
              :title="auth.state.user?.fullName"
              aria-haspopup="menu"
              :aria-expanded="isMenuOpen"
              @click="isMenuOpen = !isMenuOpen"
            >
              <img
                v-if="userAvatarUrl"
                :src="userAvatarUrl"
                alt="Profil Pengguna"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-white text-sm font-bold">{{ initials }}</span>
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
                class="absolute right-0 mt-2 w-60 bg-white rounded-2xl border border-slate-100 shadow-lg py-2 z-50"
              >
                <div class="px-4 py-2 border-b border-slate-100">
                  <p class="text-sm font-bold text-slate-900 truncate">{{ auth.state.user?.fullName }}</p>
                  <p class="text-xs text-slate-500">{{ roleLabel }}</p>
                </div>
                <router-link to="/unggahan" role="menuitem" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  Unggahan Saya
                </router-link>
                <router-link
                  v-if="auth.isLibrarian.value"
                  to="/admin"
                  role="menuitem"
                  class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Panel Admin
                </router-link>
                <button
                  type="button"
                  role="menuitem"
                  class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
                  @click="openChangePassword"
                >
                  Ganti Kata Sandi
                </button>
                <button
                  type="button"
                  role="menuitem"
                  class="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 cursor-pointer border-t border-slate-100 mt-1"
                  @click="handleLogout"
                >
                  Keluar
                </button>
              </div>
            </transition>
          </div>
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

// Props untuk data gambar dinamis (bila disediakan back-end)
defineProps({
  schoolLogoUrl: {
    type: String,
    default: null
  },
  userAvatarUrl: {
    type: String,
    default: null
  }
})

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

<style scoped>
/* Scoped styles header */
</style>
