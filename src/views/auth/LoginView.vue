<template>
  <div class="min-h-screen bg-[#F8FAFC] flex flex-col justify-between relative overflow-hidden text-slate-800 select-none">
    <!-- Subtle Ambient Background Glow (Sesuai Figma) -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#E0F2F7]/50 via-[#F0F8FA]/30 to-transparent blur-3xl pointer-events-none -z-10"></div>

    <!-- Top Navigation / Brand Header -->
    <header class="w-full px-6 lg:px-12 pt-6 pb-2">
      <router-link to="/" class="inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#005B70] rounded-xl p-1">
        <!-- School Circular Crest -->
        <div class="w-10 h-10 rounded-full bg-slate-50 border border-slate-200/90 shadow-xs flex items-center justify-center p-1 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
          <img 
            :src="schoolLogo" 
            alt="Logo SMAN 11 Garut" 
            class="w-full h-full object-contain"
            @error="onLogoError"
          />
        </div>
        <!-- Brand Title -->
        <div class="flex flex-col">
          <span class="text-[#005B70] font-bold text-base leading-tight tracking-tight">E-Library</span>
          <span class="text-slate-400 font-semibold text-[10px] tracking-widest uppercase leading-tight">SMAN 11 GARUT</span>
        </div>
      </router-link>
    </header>

    <!-- Main Content Container (Centered Cards) -->
    <main class="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 w-full">
      <div class="w-full max-w-[540px] flex flex-col items-center space-y-4">
        
        <!-- 1. Header Card Atas: Portal Autentikasi Pengurus -->
        <div class="w-full bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center gap-4">
          <!-- Logo Sekolah Box dengan Dot Cyan -->
          <div class="relative w-12 h-12 rounded-xl bg-[#0B1E28] flex items-center justify-center p-2 shrink-0 shadow-xs">
            <img 
              :src="schoolLogo" 
              alt="SMAN 11 Garut" 
              class="w-full h-full object-contain"
            />
            <!-- Cyan Active Dot Indicator di sudut kanan bawah -->
            <span class="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#00A9CE] border-2 border-white rounded-full"></span>
          </div>

          <!-- Title & Subtitle -->
          <div class="flex flex-col">
            <h2 class="text-[#005B70] font-bold text-base sm:text-lg leading-tight">
              Portal Autentikasi<br />Pengurus
            </h2>
            <p class="text-[11px] sm:text-xs text-slate-500 mt-1 leading-snug">
              Sistem Otomasi Perpustakaan Digital & Redaksi Literasi • SMAN 11 Garut
            </p>
          </div>
        </div>

        <!-- 2. Main Card Center: Masuk Panel Pustakawan -->
        <div class="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          
          <!-- Card Header (Icon Shield + Badges + Title) -->
          <div class="flex items-start gap-4">
            <!-- Icon Shield Teal Box -->
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#005B70] text-white flex items-center justify-center shrink-0 shadow-xs">
              <!-- Shield ID Icon -->
              <svg class="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <circle cx="12" cy="11" r="2" />
                <path d="M8 17c0-2 2-3 4-3s4 1 4 3" />
              </svg>
            </div>

            <!-- Header Content -->
            <div class="flex-1 min-w-0">
              <!-- Badges Row -->
              <div class="flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold tracking-wider uppercase bg-[#E1F1F5] text-[#005B70]">
                  AKSES AMAN TERPUSAT
                </span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold bg-[#EBF2F7] text-[#336688]">
                  User & Admin
                </span>
              </div>

              <!-- Title & Desc -->
              <h1 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
                Masuk Panel Pustakawan
              </h1>
              <p class="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Khusus dewan guru relawan dan tenaga administrasi resmi perpustakaan SMAN 11 Garut.
              </p>
            </div>
          </div>

          <!-- Section: Pilih Hak Akses Penugasan -->
          <div class="mt-6 sm:mt-7">
            <label class="block text-xs font-semibold text-slate-700 mb-2">
              Pilih Hak Akses Penugasan
            </label>

            <!-- Segmented Control Switch (User vs Admin) -->
            <div class="w-full bg-[#EBF2F7] p-1 rounded-xl grid grid-cols-2 gap-1" role="tablist">
              <!-- Option 1: Masuk sebagai User -->
              <button
                type="button"
                role="tab"
                :aria-selected="activeRole === 'user'"
                :class="[
                  'w-full py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer',
                  activeRole === 'user'
                    ? 'bg-white text-[#005B70] shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                    : 'text-slate-600 hover:text-slate-900'
                ]"
                @click="switchRole('user')"
              >
                <!-- User ID Card Icon -->
                <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <circle cx="9" cy="10" r="2" />
                  <line x1="15" y1="8" x2="17" y2="8" />
                  <line x1="15" y1="12" x2="17" y2="12" />
                  <path d="M6 16c0-1.5 1.5-2.5 3-2.5s3 1 3 2.5" />
                </svg>
                <span>Masuk sebagai User</span>
              </button>

              <!-- Option 2: Administrator Sistem -->
              <button
                type="button"
                role="tab"
                :aria-selected="activeRole === 'admin'"
                :class="[
                  'w-full py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer',
                  activeRole === 'admin'
                    ? 'bg-white text-[#005B70] shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                    : 'text-slate-600 hover:text-slate-900'
                ]"
                @click="switchRole('admin')"
              >
                <!-- Shield Check Icon -->
                <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                <span>Administrator Sistem</span>
              </button>
            </div>
          </div>

          <!-- Alert / Status Feedback Message (Offline Ready) -->
          <div 
            v-if="errorMessage" 
            class="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-shake"
          >
            <svg class="w-4 h-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{{ errorMessage }}</span>
          </div>

          <div 
            v-if="successMessage" 
            class="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2"
          >
            <svg class="w-4 h-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{{ successMessage }}</span>
          </div>

          <!-- Form Area -->
          <form @submit.prevent="handleLogin" class="mt-5 space-y-4">
            
            <!-- Dynamic Fields: Hanya Muncul saat Mode ADMIN Aktif -->
            <transition name="expand">
              <div v-if="activeRole === 'admin'" class="space-y-4">
                
                <!-- Input 1: NIP / Username Pengurus -->
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <label for="username" class="text-xs font-semibold text-slate-700">
                      NIP / Username Pengurus
                    </label>
                    <span class="text-[11px] font-medium text-slate-400">
                      Wajib diisi
                    </span>
                  </div>
                  <div class="relative flex items-center">
                    <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <!-- Identification Card Icon -->
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                    </div>
                    <input
                      id="username"
                      v-model="form.username"
                      type="text"
                      required
                      placeholder="198403162009021004"
                      class="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005B70] focus:ring-2 focus:ring-[#005B70]/10 transition-all"
                    />
                  </div>
                </div>

                <!-- Input 2: Kata Sandi Akun -->
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <label for="password" class="text-xs font-semibold text-slate-700">
                      Kata Sandi Akun
                    </label>
                    <span class="text-[11px] font-medium text-slate-400">
                      Min. 8 Karakter
                    </span>
                  </div>
                  <div class="relative flex items-center">
                    <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <!-- Lock / Key Icon -->
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      v-model="form.password"
                      :type="showPassword ? 'text' : 'password'"
                      required
                      placeholder="GarutEleven#2025!"
                      class="w-full pl-10 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005B70] focus:ring-2 focus:ring-[#005B70]/10 transition-all tracking-wider"
                    />
                    <!-- Toggle Show/Hide Password -->
                    <button
                      type="button"
                      class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      :title="showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
                      @click="showPassword = !showPassword"
                    >
                      <!-- Eye Open -->
                      <svg v-if="!showPassword" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <!-- Eye Closed / Slash -->
                      <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    </button>
                  </div>
                </div>

              </div>
            </transition>

            <!-- Tombol Utama Submit (Warna Teal Utama) -->
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full py-3.5 px-6 rounded-xl bg-[#005B70] hover:bg-[#004859] active:bg-[#003845] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              <!-- Loading Spinner State -->
              <svg 
                v-if="isSubmitting" 
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>

              <!-- Button Label & Arrow Icon Sesuai Mode Figma -->
              <template v-if="!isSubmitting">
                <span>{{ activeRole === 'admin' ? 'Masuk ke Panel Kendali' : 'Masuk' }}</span>
                <!-- Door / Arrow Enter Icon [->] -->
                <svg class="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </template>
              <template v-else>
                <span>Memproses Otentikasi...</span>
              </template>
            </button>
          </form>

        </div>

        <!-- Footer Card Sub-text: Sistem Perpustakaan Digital SMAN 11 Garut -->
        <div class="pt-2 flex items-center justify-center gap-1.5 text-[#005B70] text-xs font-medium">
          <!-- Shield Check Icon -->
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <span>Sistem Perpustakaan Digital SMAN 11 Garut</span>
        </div>

      </div>
    </main>

    <!-- Global Copyright Bottom (Sesuai Figma) -->
    <footer class="w-full text-center py-6 px-4">
      <p class="text-xs text-slate-400 font-normal">
        &copy; 2024 Tim IT & Perpustakaan SMAN 11 Garut. Jalur Akses Terbatas Khusus Staf.
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import schoolLogo from '../../assets/images/placeholders/logo-sman11.svg'

const router = useRouter()

// Reactive Role State: 'user' atau 'admin' (Default: 'user' sesuai tampilan Figma pertama)
const activeRole = ref('user')

// Toggle Visibility Password
const showPassword = ref(false)

// Loading & Notification State
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Reactive Form Object dengan v-model
const form = reactive({
  username: '198403162009021004',
  password: 'GarutEleven#2025!',
  role: 'user'
})

// Fungsi Ganti Mode Hak Akses (User vs Admin)
const switchRole = (role) => {
  activeRole.value = role
  form.role = role
  errorMessage.value = ''
  successMessage.value = ''
}

// Fallback jika logo SVG gagal load
const onLogoError = (event) => {
  event.target.style.display = 'none'
}

// Handler Autentikasi Pengurus (Login User & Admin)
const handleLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isSubmitting.value = true

  try {
    if (activeRole.value === 'admin') {
      // Validasi sederhana form Admin
      if (!form.username.trim()) {
        throw new Error('NIP / Username Pengurus wajib diisi.')
      }
      if (!form.password || form.password.length < 8) {
        throw new Error('Kata Sandi minimal 8 karakter.')
      }

      /**
       * STRUKTUR SIAP INTEGRASI BACK-END:
       * Endpoint lokal: POST /api/v1/auth/login
       * 
       * const response = await fetch('/api/v1/auth/login', {
       *   method: 'POST',
       *   headers: { 'Content-Type': 'application/json' },
       *   body: JSON.stringify({
       *     username: form.username,
       *     password: form.password,
       *     role: 'admin'
       *   })
       * })
       * const result = await response.json()
       * if (!response.ok) throw new Error(result.message || 'Login gagal')
       */

      // Simulasi delay request offline server (600ms)
      await new Promise(resolve => setTimeout(resolve, 600))

      successMessage.value = 'Otentikasi Administrator Berhasil! Mengalihkan ke panel...'
      
      // Simpan session token sederhana untuk local state
      localStorage.setItem('auth_role', 'admin')
      localStorage.setItem('auth_user', form.username)

      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 700)

    } else {
      // Mode User: Akses langsung penugasan pustakawan / dewan guru
      await new Promise(resolve => setTimeout(resolve, 400))
      
      successMessage.value = 'Akses Pengurus (User) Terverifikasi. Mengalihkan ke Presensi...'
      localStorage.setItem('auth_role', 'user')

      setTimeout(() => {
        router.push('/presensi')
      }, 500)
    }

  } catch (err) {
    errorMessage.value = err.message || 'Terjadi kesalahan saat otentikasi. Silakan periksa kredensial Anda.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Smooth expand/collapse transition for dynamic admin fields */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.25s ease-out;
  max-height: 250px;
  overflow: hidden;
  opacity: 1;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0px;
  opacity: 0;
  transform: translateY(-8px);
}

/* Subtle error shake animation */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}
</style>
