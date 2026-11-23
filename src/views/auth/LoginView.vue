<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12 text-slate-800">
    <div class="w-full max-w-sm">
      <router-link to="/" class="block mb-8 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg">
        <span class="text-base font-semibold text-slate-900">E-Library</span>
        <span class="text-base text-slate-500"> SMAN 11 Garut</span>
      </router-link>

      <div class="bg-white rounded-xl ring-1 ring-slate-200 p-6 sm:p-8">
        <h1 class="text-xl font-semibold text-slate-900">Masuk staf</h1>
        <p class="mt-1 text-sm text-slate-500">Untuk guru dan pustakawan.</p>

        <!-- Pemberitahuan -->
        <p
          v-if="expiredNotice && !errorMessage && !successMessage"
          class="mt-5 px-3 py-2.5 rounded-lg bg-amber-50 text-amber-800 text-sm"
        >
          Sesi Anda telah berakhir. Silakan masuk kembali.
        </p>
        <p v-if="errorMessage" class="mt-5 px-3 py-2.5 rounded-lg bg-rose-50 text-rose-700 text-sm animate-shake" role="alert">
          {{ errorMessage }}
        </p>
        <p v-if="successMessage" class="mt-5 px-3 py-2.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm" role="status">
          {{ successMessage }}
        </p>

        <form class="mt-6 space-y-4" @submit.prevent="handleLogin">
          <div>
            <label for="username" class="block text-sm font-medium text-slate-700 mb-1.5">Nama pengguna</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              autocomplete="username"
              class="w-full h-11 px-3.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-slate-700 mb-1.5">Kata sandi</label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                class="w-full h-11 pl-3.5 pr-11 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 px-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                :aria-label="showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
                @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full h-11 mt-2 rounded-lg bg-brand hover:bg-brand-dark disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg v-if="isSubmitting" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            {{ isSubmitting ? 'Memproses…' : 'Masuk' }}
          </button>
        </form>
      </div>

      <p class="mt-6 text-center">
        <router-link to="/" class="text-sm text-slate-500 hover:text-slate-900">Kembali ke katalog</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
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
