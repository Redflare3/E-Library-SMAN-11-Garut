<script setup>
import { ref } from 'vue'
import {
  User,
  XCircle,
  GraduationCap,
  ChevronDown,
  BookOpen,
  Users,
  ArrowLeftRight,
  FlaskConical,
  Monitor,
  FileText,
  CheckCircle2,
  RotateCcw
} from 'lucide-vue-next'
import { visitPurposes } from '../../data/mockData'

const iconMap = {
  BookOpen,
  Users,
  ArrowLeftRight,
  FlaskConical,
  Monitor
}

const name = ref('')
const selectedClass = ref('')
const gender = ref('laki')
const purpose = ref('membaca')
const notes = ref('')
const agreed = ref(false)
const submitted = ref(false)

const handleReset = () => {
  name.value = ''
  selectedClass.value = ''
  gender.value = 'laki'
  purpose.value = 'membaca'
  notes.value = ''
  agreed.value = false
  submitted.value = false
}

const handleSubmit = () => {
  if (!name.value || !selectedClass.value || !agreed.value) {
    alert('Harap lengkapi nama, kelas, dan centang komitmen tata tertib.')
    return
  }
  submitted.value = true
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="px-5 sm:px-6 pt-5 sm:pt-6 pb-4">
      <span class="inline-block px-2.5 py-1 bg-accent-50 text-accent-700 text-[10px] font-bold uppercase tracking-wider rounded-md">
        Formulir Mandiri
      </span>
      <h3 class="text-lg sm:text-xl font-bold text-navy-800 mt-2">
        Input Kehadiran Pengunjung
      </h3>
    </div>

    <!-- Success Feedback Notification (Visual State) -->
    <div v-if="submitted" class="mx-5 sm:mx-6 mb-4 p-4 rounded-xl bg-success-50 border border-green-200 flex items-start gap-3">
      <CheckCircle2 class="w-5 h-5 text-success-600 shrink-0 mt-0.5" />
      <div>
        <p class="text-sm font-bold text-success-600">Check-in Berhasil!</p>
        <p class="text-xs text-text-secondary mt-0.5">
          Selamat datang <span class="font-semibold text-text-primary">{{ name }}</span> ({{ selectedClass }}). Selamat membaca dan beraktivitas di perpustakaan.
        </p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="px-5 sm:px-6 pb-6 space-y-5">
      <!-- Nama Lengkap -->
      <div>
        <label class="block text-xs font-semibold text-text-primary mb-1.5">
          Nama Lengkap Pengunjung <span class="text-cta-500">*</span>
        </label>
        <div class="relative">
          <User class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Ketik nama lengkap..."
            v-model="name"
            class="w-full pl-10 pr-10 py-2.5 text-sm border border-border rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-all placeholder:text-text-muted"
          />
          <button
            v-if="name"
            type="button"
            @click="name = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
          >
            <XCircle class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Kelas & Jenis Kelamin -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Kelas -->
        <div>
          <label class="block text-xs font-semibold text-text-primary mb-1.5">
            Kelas / Rombel / Status Civitas <span class="text-cta-500">*</span>
          </label>
          <div class="relative">
            <GraduationCap class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            <select
              v-model="selectedClass"
              class="w-full appearance-none pl-10 pr-10 py-2.5 text-sm border border-border rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-all text-text-primary"
            >
              <option value="" disabled class="text-text-muted">
                Pilih kelas atau unit tugas...
              </option>
              <option value="X-1">X-1</option>
              <option value="X-2">X-2</option>
              <option value="X-3">X-3</option>
              <option value="XI-MIPA 1">XI-MIPA 1</option>
              <option value="XI-MIPA 2">XI-MIPA 2</option>
              <option value="XI-IPS 1">XI-IPS 1</option>
              <option value="XI-IPS 2">XI-IPS 2</option>
              <option value="XI-IPS 3">XI-IPS 3</option>
              <option value="XII-MIPA 1">XII-MIPA 1</option>
              <option value="XII-MIPA 2">XII-MIPA 2</option>
              <option value="XII-IPS 1">XII-IPS 1</option>
              <option value="XII-IPS 2">XII-IPS 2</option>
              <option value="Guru / Tenaga Pendidik">Guru / Tenaga Pendidik</option>
              <option value="Staf Tata Usaha / Karyawan">Staf Tata Usaha / Karyawan</option>
            </select>
            <ChevronDown class="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          </div>
        </div>

        <!-- Jenis Kelamin -->
        <div>
          <label class="block text-xs font-semibold text-text-primary mb-1.5">
            Jenis Kelamin
          </label>
          <div class="flex items-center gap-6 py-2.5">
            <label class="flex items-center gap-2 cursor-pointer group">
              <span
                :class="[
                  'w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all',
                  gender === 'laki'
                    ? 'border-navy-700 bg-navy-700'
                    : 'border-border-dark group-hover:border-navy-400'
                ]"
              >
                <span v-if="gender === 'laki'" class="w-2 h-2 bg-white rounded-full" />
              </span>
              <input
                type="radio"
                name="gender"
                value="laki"
                v-model="gender"
                class="sr-only"
              />
              <span class="text-sm text-text-primary">Laki-laki</span>
            </label>

            <label class="flex items-center gap-2 cursor-pointer group">
              <span
                :class="[
                  'w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all',
                  gender === 'perempuan'
                    ? 'border-navy-700 bg-navy-700'
                    : 'border-border-dark group-hover:border-navy-400'
                ]"
              >
                <span v-if="gender === 'perempuan'" class="w-2 h-2 bg-white rounded-full" />
              </span>
              <input
                type="radio"
                name="gender"
                value="perempuan"
                v-model="gender"
                class="sr-only"
              />
              <span class="text-sm text-text-primary">Perempuan</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Tujuan Kunjungan -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <label class="text-xs font-semibold text-text-primary">
            Tujuan Kunjungan <span class="text-cta-500">*</span>
          </label>
          <span class="text-[10px] text-text-muted italic">
            Pilih aktivitas utama yang dilakukan
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="p in visitPurposes"
            :key="p.id"
            @click="purpose = p.id"
            :class="[
              'relative flex flex-col items-start p-3.5 sm:p-4 rounded-xl border-2 text-left cursor-pointer transition-all select-none',
              purpose === p.id
                ? 'border-accent-500 bg-accent-50/70 shadow-sm'
                : 'border-border bg-white hover:border-navy-300 hover:bg-surface-alt'
            ]"
          >
            <div class="flex items-center justify-between w-full mb-2">
              <div
                :class="[
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                  purpose === p.id
                    ? 'bg-accent-500 text-white'
                    : 'bg-surface-alt text-text-secondary group-hover:bg-navy-100'
                ]"
              >
                <component :is="iconMap[p.icon] || BookOpen" class="w-4 h-4" />
              </div>

              <!-- Radio Indicator -->
              <span
                :class="[
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                  purpose === p.id
                    ? 'border-accent-500 bg-accent-500'
                    : 'border-border-dark'
                ]"
              >
                <span v-if="purpose === p.id" class="w-2 h-2 bg-white rounded-full" />
              </span>
            </div>

            <p
              :class="[
                'text-xs sm:text-sm font-bold leading-tight',
                purpose === p.id ? 'text-navy-900' : 'text-text-primary'
              ]"
            >
              {{ p.label }}
            </p>
            <p class="text-[10px] sm:text-[11px] text-text-secondary mt-1 leading-tight">
              {{ p.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Catatan Keperluan -->
      <div>
        <label class="block text-xs font-semibold text-text-primary mb-1.5">
          Catatan Keperluan / Judul Referensi Dicari
        </label>
        <div class="relative">
          <FileText class="absolute left-3.5 top-3 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Misal: Mencari Ensiklopedia Fisika Bab Termod"
            v-model="notes"
            class="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-all placeholder:text-text-muted"
          />
        </div>
      </div>

      <!-- Agreement Checkbox -->
      <div class="flex items-start gap-3 p-4 bg-navy-50/70 border border-navy-100 rounded-xl">
        <input
          type="checkbox"
          id="agreement"
          v-model="agreed"
          class="mt-1 w-4 h-4 text-accent-600 accent-accent-600 rounded cursor-pointer shrink-0"
        />
        <label for="agreement" class="text-xs text-navy-800 leading-relaxed cursor-pointer select-none">
          Saya berkomitmen menjaga ketertiban, menjaga keheningan ruang baca, tidak membawa makanan/minuman berlebih ke dekat rak buku, serta merawat fasilitas perpustakaan SMAN 11 Garut.
        </label>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          type="button"
          @click="handleReset"
          class="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-navy-800 transition-colors order-2 sm:order-1"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Kosongkan Formulir</span>
        </button>

        <button
          type="submit"
          :disabled="!agreed"
          :class="[
            'w-full sm:w-auto order-1 sm:order-2 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white shadow-md transition-all',
            agreed
              ? 'bg-[#005B64] hover:bg-[#00474e] active:scale-[0.98] cursor-pointer'
              : 'bg-gray-300 cursor-not-allowed opacity-75'
          ]"
        >
          <CheckCircle2 class="w-4 h-4" />
          <span>Konfirmasi Check-in Pengunjung</span>
        </button>
      </div>
    </form>
  </div>
</template>
