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
            <p class="text-[11px] text-slate-400 font-normal leading-tight">Perpustakaan & Repositori Literasi Digital</p>
          </div>
        </router-link>

        <!-- Center Menu Navigasi (4 Opsi: Katalog Buku, Cari & Filter Kategori, Presensi, Statistik) -->
        <nav class="hidden md:flex items-center gap-1 lg:gap-2">
          <!-- 1. Katalog Buku -->
          <router-link 
            to="/katalog"
            :class="[
              'px-3.5 py-2 text-xs lg:text-sm font-medium transition-colors text-center leading-tight rounded-xl cursor-pointer',
              $route.path === '/katalog'
                ? 'bg-[#E6F3F7] text-[#0B6B82] font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            ]"
          >
            Katalog<br />Buku
          </router-link>

          <!-- 2. Cari & Filter Kategori -->
          <router-link 
            to="/kategori"
            :class="[
              'px-3.5 py-2 text-xs lg:text-sm font-medium transition-colors text-center leading-tight rounded-xl cursor-pointer',
              $route.path === '/kategori'
                ? 'bg-[#E6F3F7] text-[#0B6B82] font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            ]"
          >
            Cari & Filter<br />Kategori
          </router-link>

          <!-- 3. Nav: Presensi -->
          <router-link 
            to="/presensi" 
            :class="[
              'px-5 py-2.5 rounded-xl text-xs lg:text-sm font-semibold transition-all flex items-center justify-center cursor-pointer',
              $route.path === '/' || $route.path === '/presensi'
                ? 'bg-[#E6F3F7] text-[#0B6B82] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            ]"
          >
            Presensi
          </router-link>

          <!-- 4. Nav: Statistik -->
          <router-link 
            to="/statistik/harian" 
            :class="[
              'px-5 py-2.5 rounded-xl text-xs lg:text-sm font-semibold transition-all flex items-center justify-center cursor-pointer',
              $route.path.startsWith('/statistik')
                ? 'bg-[#E6F3F7] text-[#0B6B82] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            ]"
          >
            Statistik
          </router-link>
        </nav>

        <!-- Right Action Buttons -->
        <div class="flex items-center gap-2.5">
          <!-- Button 'Presensi Siswa' -->
          <button 
            type="button"
            class="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 bg-[#DDEEF4] hover:bg-[#cfe4ec] text-[#0B6B82] font-semibold text-xs md:text-sm rounded-xl transition-colors shadow-xs cursor-pointer"
            @click="$router.push('/presensi')"
          >
            <!-- User / ID Card SVG Icon -->
            <svg class="w-4 h-4 text-[#0B6B82]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Presensi Siswa</span>
          </button>

          <!-- Dark Teal Icon Button (Barcode / Book search) -->
          <button 
            type="button" 
            title="Scan Barcode / Carian Cepat"
            class="w-10 h-10 rounded-xl bg-[#0B6B82] hover:bg-[#085568] text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            @click="$router.push('/kategori')"
          >
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </button>

          <!-- School / Profile Circle Avatar (Fungsi Logout / Kembali ke Login) -->
          <button 
            type="button" 
            class="w-10 h-10 rounded-full border border-slate-200 bg-slate-100 hover:border-slate-400 hover:ring-2 hover:ring-slate-200 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer transition-all" 
            title="Keluar / Ganti Akun (Logout)"
            @click="handleLogout"
          >
            <img 
              v-if="userAvatarUrl" 
              :src="userAvatarUrl" 
              alt="Profil Pengguna" 
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
              <svg class="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Sub-bar: Status Literasi & Real-time DateTime Indicator -->
    <div class="w-full bg-slate-50/80 border-t border-slate-100/90 py-2">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
        <!-- Left: Badge Status Literasi -->
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[#0B6B82] animate-pulse"></span>
          <span class="font-bold text-[11px] tracking-wider text-[#0B6B82] uppercase">
            GERBANG LITERASI SEKOLAH DIGITAL
          </span>
        </div>

        <!-- Right: Real-time Date and Time Indicator -->
        <div class="flex items-center gap-1.5 text-slate-600 font-medium">
          <svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ currentWibTime }} WIB • {{ currentFormattedDate }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Fungsi Logout saat menekan profile picture
const handleLogout = () => {
  localStorage.removeItem('auth_role')
  localStorage.removeItem('auth_user')
  router.push('/login')
}

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

// State untuk waktu dan tanggal lokal real-time
const currentWibTime = ref('10.01.29')
const currentFormattedDate = ref('Selasa, 13 Okt 2026')

const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 
  'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
]

const updateClock = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentWibTime.value = `${hours}.${minutes}.${seconds}`

  const dayName = days[now.getDay()]
  const dateNum = now.getDate()
  const monthName = months[now.getMonth()]
  const year = now.getFullYear()
  currentFormattedDate.value = `${dayName}, ${dateNum} ${monthName} ${year}`
}

let timerId = null

onMounted(() => {
  updateClock()
  timerId = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  if (timerId) clearInterval(timerId)
})
</script>

<style scoped>
/* Scoped styles bila dibutuhkan penyesuaian khusus */
</style>
