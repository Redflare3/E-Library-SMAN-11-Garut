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
                  Guru & Pustakawan
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

          <!-- Notice: sesi berakhir -->
          <div
            v-if="expiredNotice && !errorMessage && !successMessage"
            class="mt-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2"
          >
            <svg class="w-4 h-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Sesi Anda telah berakhir, silakan masuk kembali.</span>
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
            
            <div class="space-y-4">
                
                <!-- Input 1: NIP / Username Pengurus -->
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <label for="username" class="text-xs font-semibold text-slate-700">
                      Nama Pengguna
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
                      placeholder="Nama pengguna"
                      autocomplete="username"
                      class="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005B70] focus:ring-2 focus:ring-[#005B70]/10 transition-all"
                    />
                  </div>
                </div>

                <!-- Input 2: Kata Sandi Akun -->
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <label for="password" class="text-xs font-semibold text-slate-700">
                      Kata Sandi
                    </label>
                    <span class="text-[11px] font-medium text-slate-400">
                      Min. 6 Karakter
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
                      placeholder="Kata sandi"
                      autocomplete="current-password"
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
                <span>Masuk</span>
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
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import schoolLogo from '../../assets/images/placeholders/logo-sman11.svg'
import { auth } from '../../stores/auth.js'
import { errorMessage as toErrorMessage } from '../../utils/errors.js'

const router = useRouter()
const route = useRoute()

// Toggle Visibility Password
const showPassword = ref(false)

// Loading & Notification State
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = reactive({
  username: '',
  password: ''
})

// Ditampilkan bila diarahkan ke sini karena sesi berakhir (401 / token kedaluwarsa)
const expiredNotice = computed(() => route.query.expired === '1')

// Hanya ikuti ?redirect= untuk path internal (cegah open redirect ke situs lain)
function safeRedirect() {
  const target = route.query.redirect
  if (typeof target === 'string' && target.startsWith('/') && !target.startsWith('//') && !target.startsWith('/\\')) {
    return target
  }
  return null
}

// Fallback jika logo SVG gagal load
const onLogoError = (event) => {
  event.target.style.display = 'none'
}

// Handler Autentikasi Staf (Guru & Pustakawan) via POST /api/auth/login
const handleLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.username.trim()) {
    errorMessage.value = 'Nama pengguna wajib diisi.'
    return
  }
  if (!form.password) {
    errorMessage.value = 'Kata sandi wajib diisi.'
    return
  }

  isSubmitting.value = true
  try {
    const user = await auth.login(form.username.trim(), form.password)
    successMessage.value = `Selamat datang, ${user.fullName}. Mengalihkan...`
    await router.replace(safeRedirect() ?? auth.homePath())
  } catch (err) {
    // 400 INVALID_CREDENTIALS / ACCOUNT_TEMPORARILY_LOCKED / server tidak terjangkau
    errorMessage.value = toErrorMessage(err)
    form.password = ''
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
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
