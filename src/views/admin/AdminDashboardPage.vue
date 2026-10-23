<template>
  <div class="space-y-6">
    <!-- Admin Header -->
    <div class="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-2">
          <svg class="w-4 h-4 text-[#0B6B82]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>PANEL PENGELOLA PERPUSTAKAAN</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Manajemen Koleksi & Repositori</h1>
        <p class="text-xs text-slate-400 mt-1">Kelola katalog e-book, berkas digital lokal, dan data presensi ruang baca</p>
      </div>

      <!-- Action Button: Upload E-Book -->
      <button 
        type="button" 
        class="px-5 py-3 rounded-xl bg-[#0B6B82] hover:bg-[#085568] text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        @click="showUploadModal = true"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Unggah E-Book Baru</span>
      </button>
    </div>

    <!-- Server & Storage Status Badges (Local Server Info) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          ✓
        </div>
        <div>
          <span class="text-[11px] text-slate-400 block font-medium">Status Server Lokal</span>
          <span class="text-sm font-bold text-slate-800">Online &bull; Mini PC Internal</span>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-sky-50 text-[#0B6B82] flex items-center justify-center font-bold">
          💾
        </div>
        <div>
          <span class="text-[11px] text-slate-400 block font-medium">Kapasitas Penyimpanan</span>
          <span class="text-sm font-bold text-slate-800">64.2 GB / 256 GB (Tersedia)</span>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
          📚
        </div>
        <div>
          <span class="text-[11px] text-slate-400 block font-medium">Total Dokumen E-Book</span>
          <span class="text-sm font-bold text-slate-800">{{ daftarBukuAdmin.length }} Judul Terdaftar</span>
        </div>
      </div>
    </div>

    <!-- Koleksi Table Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-slate-900 tracking-tight">Daftar Koleksi E-Book</h2>
        <div class="relative w-64">
          <input 
            v-model="adminSearch" 
            type="text" 
            placeholder="Cari koleksi..." 
            class="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B6B82]"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <BaseTable>
        <template #header>
          <th class="px-6 py-3.5">ID</th>
          <th class="px-6 py-3.5">Judul Buku</th>
          <th class="px-6 py-3.5">Penulis / Penerbit</th>
          <th class="px-6 py-3.5">Kategori</th>
          <th class="px-6 py-3.5">Ukuran Berkas</th>
          <th class="px-6 py-3.5 text-right">Aksi</th>
        </template>

        <tr v-for="buku in filteredBukuAdmin" :key="buku.id" class="hover:bg-slate-50 transition-colors">
          <td class="px-6 py-3.5 font-mono text-xs text-slate-400">#{{ buku.id }}</td>
          <td class="px-6 py-3.5">
            <div class="font-bold text-slate-800 text-xs sm:text-sm">{{ buku.judul }}</div>
            <div class="text-[11px] text-slate-400">{{ buku.halaman }} Halaman &bull; {{ buku.format }}</div>
          </td>
          <td class="px-6 py-3.5 text-xs text-slate-600">{{ buku.penulis }}</td>
          <td class="px-6 py-3.5">
            <BaseBadge variant="primary" size="sm">{{ buku.kategori }}</BaseBadge>
          </td>
          <td class="px-6 py-3.5 text-xs font-mono text-slate-500">{{ buku.ukuran }}</td>
          <td class="px-6 py-3.5 text-right space-x-2">
            <button 
              type="button" 
              class="px-2.5 py-1 text-xs font-semibold text-[#0B6B82] hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
              @click="$router.push(`/buku/${buku.id}`)"
            >
              Lihat
            </button>
            <button 
              type="button" 
              class="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              @click="hapusBuku(buku.id)"
            >
              Hapus
            </button>
          </td>
        </tr>
      </BaseTable>
    </div>

    <!-- Modal Form: Unggah E-Book Baru -->
    <BaseModal 
      v-model="showUploadModal" 
      title="Unggah Dokumen E-Book Baru" 
      max-width="lg"
    >
      <form class="space-y-4" @submit.prevent="simpanBukuBaru">
        <BaseInput 
          v-model="formBaru.judul" 
          label="Judul Buku / Dokumen" 
          placeholder="Contoh: Modul Ajar Kimia Kelas XII" 
          required 
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInput 
            v-model="formBaru.penulis" 
            label="Penulis / Penyusun" 
            placeholder="Contoh: Dra. Siti Rahmah" 
            required 
          />
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-slate-700">Kategori</label>
            <select v-model="formBaru.kategori" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0B6B82]/20">
              <option value="Buku Pelajaran">Buku Pelajaran</option>
              <option value="Sains & Teknologi">Sains & Teknologi</option>
              <option value="Sosial & Humaniora">Sosial & Humaniora</option>
              <option value="Karya Tulis Ilmiah">Karya Tulis Ilmiah</option>
            </select>
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-slate-700">Berkas PDF Dokumen (Penyimpanan Lokal)</label>
          <div class="border-2 border-dashed border-slate-200 hover:border-[#0B6B82] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50">
            <svg class="mx-auto h-8 w-8 text-slate-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span class="text-xs font-medium text-slate-600 block">Klik untuk memilih file PDF dari komputer</span>
            <span class="text-[11px] text-slate-400">Maksimum ukuran file: 100MB</span>
          </div>
        </div>
      </form>

      <template #footer>
        <button 
          type="button" 
          class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          @click="showUploadModal = false"
        >
          Batal
        </button>
        <button 
          type="button" 
          class="px-5 py-2 rounded-xl bg-[#0B6B82] hover:bg-[#085568] text-white text-xs font-bold transition-colors cursor-pointer"
          @click="simpanBukuBaru"
        >
          Simpan ke Repositori Lokal
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseTable from '../../components/ui/BaseTable.vue'
import BaseBadge from '../../components/ui/BaseBadge.vue'
import BaseInput from '../../components/ui/BaseInput.vue'
import BaseModal from '../../components/ui/BaseModal.vue'

const adminSearch = ref('')
const showUploadModal = ref(false)

const formBaru = ref({
  judul: '',
  penulis: '',
  kategori: 'Buku Pelajaran',
  halaman: 120
})

const daftarBukuAdmin = ref([
  { id: 1, judul: 'Matematika Tingkat Lanjut Kelas XI', penulis: 'Kemendikbudristek', kategori: 'Buku Pelajaran', format: 'PDF', halaman: 284, ukuran: '14.2 MB' },
  { id: 2, judul: 'Biologi Sel dan Molekuler SMA/MA', penulis: 'Tim MGMP Biologi Garut', kategori: 'Sains & Teknologi', format: 'PDF', halaman: 312, ukuran: '22.8 MB' },
  { id: 3, judul: 'Sejarah Perjuangan Lokal Garut & Jawa Barat', penulis: 'Drs. H. Ahmad Sobari', kategori: 'Sosial & Humaniora', format: 'PDF', halaman: 196, ukuran: '9.4 MB' },
  { id: 4, judul: 'Kumpulan KTI Terbaik Siswa SMAN 11 2025/2026', penulis: 'KIR SMAN 11 Garut', kategori: 'Karya Tulis Ilmiah', format: 'PDF', halaman: 145, ukuran: '6.7 MB' },
  { id: 5, judul: 'Fisika Eksperimental & Laboratorium Digital', penulis: 'Dr. Hendra Gunawan, M.Pd.', kategori: 'Sains & Teknologi', format: 'PDF', halaman: 220, ukuran: '18.1 MB' }
])

const filteredBukuAdmin = computed(() => {
  if (!adminSearch.value) return daftarBukuAdmin.value
  return daftarBukuAdmin.value.filter(b => 
    b.judul.toLowerCase().includes(adminSearch.value.toLowerCase()) || 
    b.penulis.toLowerCase().includes(adminSearch.value.toLowerCase())
  )
})

const simpanBukuBaru = () => {
  if (!formBaru.value.judul) return
  daftarBukuAdmin.value.unshift({
    id: Date.now(),
    judul: formBaru.value.judul,
    penulis: formBaru.value.penulis || 'Penyusun SMAN 11',
    kategori: formBaru.value.kategori,
    format: 'PDF',
    halaman: 150,
    ukuran: '12.0 MB'
  })
  formBaru.value = { judul: '', penulis: '', kategori: 'Buku Pelajaran', halaman: 120 }
  showUploadModal.value = false
}

const hapusBuku = (id) => {
  daftarBukuAdmin.value = daftarBukuAdmin.value.filter(b => b.id !== id)
}
</script>
