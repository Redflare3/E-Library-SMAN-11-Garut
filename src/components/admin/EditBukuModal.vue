<template>
  <teleport to="body">
    <transition name="modal">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <!-- Backdrop Dark Blur -->
        <div 
          class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity cursor-pointer"
          @click="emitClose"
        ></div>

        <!-- Modal Card Container (Max ~4xl) -->
        <div class="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-7 z-10 my-auto overflow-hidden animate-modal-in select-none">
          
          <!-- Tombol Close 'X' Kanan Atas -->
          <button
            type="button"
            class="absolute top-5 right-5 sm:top-6 sm:right-6 w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            title="Tutup dialog"
            @click="emitClose"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <!-- 1. Modal Header (Icon Edit Box + Badges + Title & Subtitle) -->
          <div class="flex items-start gap-3.5 pr-10">
            <!-- Icon Edit Squircle Box -->
            <div class="w-11 h-11 rounded-2xl bg-sky-50 text-[#005B70] border border-sky-100 flex items-center justify-center shrink-0 shadow-xs">
              <svg class="w-5 h-5 text-[#005B70]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>

            <!-- Header Content -->
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Sunting Data Buku
                </h2>
                <!-- Badge ID Buku -->
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200/70">
                  {{ formEdit.bookId || 'ID: BK-2024-F6-0182' }}
                </span>
                <!-- Badge Status Hijau -->
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Tersedia / Aktif
                </span>
              </div>
              <p class="text-xs text-slate-400 mt-1 leading-snug">
                Perbarui metadata bibliografi, berkas digital, dan kategori koleksi SMAN 11 Garut
              </p>
            </div>
          </div>

          <!-- 2. Main 2-Column Layout (Media & Berkas vs Form Metadata) -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-start">
            
            <!-- KOLOM KIRI (Media & Berkas Digital - 5 Cols) -->
            <div class="md:col-span-5 space-y-4">
              
              <!-- Section: Pratinjau Kover Saat Ini -->
              <div class="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/70 space-y-3">
                <label class="block text-xs font-semibold text-slate-700 text-left">
                  Pratinjau Kover Saat Ini
                </label>

                <!-- Book Cover Preview Box (Aspect 3:4) -->
                <div class="relative w-36 h-48 mx-auto rounded-xl overflow-hidden shadow-md border border-slate-200/90 bg-[#0A192F] flex flex-col justify-between p-2 text-white group">
                  <!-- Fallback Cover Displayed Pixel-Perfect according to Figma -->
                  <div class="h-full w-full rounded-lg bg-gradient-to-br from-[#0c2340] via-[#10305a] to-[#04101e] p-2 flex flex-col justify-between border border-cyan-500/20 relative overflow-hidden">
                    <!-- Cosmic Quantum Illustration Effect -->
                    <div class="absolute -top-6 -right-6 w-20 h-20 bg-cyan-500/20 rounded-full blur-xl pointer-events-none"></div>
                    <div class="absolute bottom-2 left-2 w-16 h-16 bg-blue-600/30 rounded-full blur-lg pointer-events-none"></div>

                    <!-- Top Title -->
                    <div class="text-center pt-2">
                      <div class="text-[11px] font-extrabold tracking-wider text-cyan-200 uppercase font-serif">
                        FISIKA
                      </div>
                      <div class="text-[9px] font-bold tracking-widest text-white uppercase">
                        MODERN
                      </div>
                      <div class="text-[5.5px] text-cyan-300 font-medium tracking-tight mt-0.5">
                        Teori, Soal, dan Pembahasan
                      </div>
                    </div>

                    <!-- Orbit Rings Center Illustration -->
                    <div class="w-16 h-16 mx-auto my-auto relative flex items-center justify-center">
                      <div class="w-14 h-14 rounded-full border border-cyan-400/40 animate-spin" style="animation-duration: 20s;"></div>
                      <div class="w-10 h-10 rounded-full border border-blue-400/50 absolute rotate-45"></div>
                      <div class="w-4 h-4 rounded-full bg-cyan-400/80 shadow-[0_0_8px_#22d3ee] flex items-center justify-center text-[5px] font-bold text-slate-900">
                        ψ
                      </div>
                    </div>

                    <!-- Bottom Metadata -->
                    <div class="text-center pb-1 text-[5px] text-slate-300/80 font-sans">
                      Perpustakaan SMAN 11 Garut
                    </div>
                  </div>

                  <!-- Small Edition Badge in top right corner -->
                  <span class="absolute top-3 right-3 w-4 h-4 rounded-full bg-amber-500 text-slate-900 font-bold text-[7px] flex items-center justify-center shadow-xs">
                    e
                  </span>
                </div>

                <!-- Action Kover Buttons -->
                <div class="flex items-center justify-center gap-2 pt-1">
                  <!-- Tombol Ganti Kover -->
                  <button
                    type="button"
                    class="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/90 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    @click="triggerCoverInput"
                  >
                    <!-- Image Icon -->
                    <svg class="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>Ganti Kover (JPG/PNG)</span>
                  </button>

                  <!-- Tombol Zoom / Preview -->
                  <button
                    type="button"
                    class="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/90 text-slate-500 hover:text-slate-800 shadow-2xs transition-colors cursor-pointer"
                    title="Pratinjau kover resolusi penuh"
                    @click="showZoomAlert"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <line x1="11" y1="8" x2="11" y2="14" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                  </button>

                  <input 
                    ref="coverInputRef" 
                    type="file" 
                    accept="image/*" 
                    class="hidden" 
                    @change="onCoverChange"
                  />
                </div>

                <!-- Helper Text -->
                <p class="text-[10px] text-slate-400 text-center">
                  Format optimal: 3:4 (Min. 600 x 800 px, maks. 2MB)
                </p>
              </div>

              <!-- Section: Berkas Digital Aktif -->
              <div class="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/70 space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-slate-700">Berkas Digital Aktif</span>
                  <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Terverifikasi
                  </span>
                </div>

                <!-- Card File Information -->
                <div class="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs flex items-center gap-3">
                  <!-- Red PDF Icon -->
                  <div class="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center font-bold text-[10px] shrink-0">
                    PDF
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="text-xs font-bold text-slate-900 truncate">
                      {{ formEdit.fileName || 'Fisika_Terapan_Kelas_XI_SMAN11.pdf' }}
                    </div>
                    <div class="text-[10px] text-slate-400 mt-0.5">
                      {{ formEdit.fileSize || '14.2 MB' }} • Diperbarui 12 Okt 2024
                    </div>
                  </div>
                </div>

                <!-- Tombol Ganti Berkas E-Book -->
                <button
                  type="button"
                  class="w-full py-2 px-3 rounded-xl border border-[#005B70] text-[#005B70] hover:bg-sky-50/60 bg-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  @click="triggerFileInput"
                >
                  <svg class="w-3.5 h-3.5 text-[#005B70]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>Ganti Berkas E-Book</span>
                </button>

                <input 
                  ref="fileInputRef" 
                  type="file" 
                  accept=".pdf,.epub" 
                  class="hidden" 
                  @change="onFileChange"
                />
              </div>

              <!-- Footer Info Kiri: Eksemplar Fisik -->
              <div class="bg-slate-50/80 rounded-xl px-3.5 py-2.5 border border-slate-200/70 flex items-center justify-between text-xs">
                <div class="flex items-center gap-2 text-slate-600 font-medium">
                  <!-- Bookshelf icon -->
                  <svg class="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                  <span>Eksemplar Fisik:</span>
                </div>
                <span class="font-bold text-slate-800">
                  8 Eksemplar di Rak B-04
                </span>
              </div>

            </div>

            <!-- KOLOM KANAN (Form Metadata Bibliografi - 7 Cols) -->
            <div class="md:col-span-7 space-y-3.5">
              
              <!-- 1. Judul Buku Lengkap* -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Buku Lengkap <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="formEdit.title"
                  type="text"
                  required
                  placeholder="Misal: Fisika Terapan Kelas XI: Gelombang & Optika"
                  class="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005B70] focus:bg-white transition-all"
                />
              </div>

              <!-- 2. Grid 2 Kolom: Nomor ISBN* & Penulis / Pengarang* -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor ISBN <span class="text-rose-500">*</span>
                  </label>
                  <input
                    v-model="formEdit.isbn"
                    type="text"
                    required
                    placeholder="978-602-244-789-2"
                    class="w-full px-3.5 py-2 bg-slate-50/70 border border-slate-200/90 rounded-xl text-xs font-mono font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005B70] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    Penulis / Pengarang <span class="text-rose-500">*</span>
                  </label>
                  <input
                    v-model="formEdit.author"
                    type="text"
                    required
                    placeholder="Bambang Haryadi, M.Si; Dr. Irwan Sus..."
                    class="w-full px-3.5 py-2 bg-slate-50/70 border border-slate-200/90 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005B70] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <!-- 3. Grid 2 Kolom: Penerbit* & Format Berkas* -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    Penerbit <span class="text-rose-500">*</span>
                  </label>
                  <input
                    v-model="formEdit.publisher"
                    type="text"
                    required
                    placeholder="Pusat Kurikulum & Perbukuan Kemendik..."
                    class="w-full px-3.5 py-2 bg-slate-50/70 border border-slate-200/90 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005B70] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">
                    Format Berkas <span class="text-rose-500">*</span>
                  </label>
                  <div class="relative">
                    <select
                      v-model="formEdit.format"
                      required
                      class="w-full appearance-none px-3.5 py-2 bg-slate-50/70 border border-slate-200/90 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#005B70] focus:bg-white transition-all cursor-pointer pr-8"
                    >
                      <option value="PDF E-Book">PDF E-Book</option>
                      <option value="ePub Digital">ePub Digital</option>
                      <option value="Audiobook">Audiobook</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center px-2.5 pointer-events-none text-slate-400">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 4. Kategori Kurikulum / Klasifikasi DDC* -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori Kurikulum / Klasifikasi DDC <span class="text-rose-500">*</span>
                </label>
                <div class="relative">
                  <select
                    v-model="formEdit.category"
                    required
                    class="w-full appearance-none px-3.5 py-2 bg-slate-50/70 border border-slate-200/90 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#005B70] focus:bg-white transition-all cursor-pointer pr-8"
                  >
                    <option value="Kurikulum Merdeka - Fase F (Kelas XI & XII)">Kurikulum Merdeka - Fase F (Kelas XI & XII)</option>
                    <option value="Kurikulum Merdeka - Fase E (Kelas X)">Kurikulum Merdeka - Fase E (Kelas X)</option>
                    <option value="Sains & Matematika Terapan">Sains & Matematika Terapan</option>
                    <option value="Sosial, Humaniora & Bahasa">Sosial, Humaniora & Bahasa</option>
                    <option value="Literasi & Budaya Sunda">Literasi & Budaya Sunda</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center px-2.5 pointer-events-none text-slate-400">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- 5. Sinopsis Ringkas -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">
                  Sinopsis Ringkas
                </label>
                <textarea
                  v-model="formEdit.synopsis"
                  rows="4"
                  placeholder="Deskripsikan garis besar materi pembelajaran atau ikhtisar isi buku..."
                  class="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#005B70] focus:bg-white transition-all resize-none leading-relaxed"
                ></textarea>
                <p class="text-[11px] text-slate-400 mt-1">
                  Sinopsis akan ditampilkan pada halaman rincian buku yang dapat diakses oleh seluruh siswa.
                </p>
              </div>

            </div>

          </div>

          <!-- 3. Modal Footer (Audit Trail Kiri + Action Buttons Kanan) -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 mt-6 border-t border-slate-100">
            <!-- Info Audit Trail -->
            <div class="text-xs text-slate-400 font-normal">
              Terakhir Disunting 24 Okt 2024 oleh Dra.Hj.Ratna Juwita, M.Pd
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end gap-2.5">
              <!-- Tombol Batal -->
              <button
                type="button"
                class="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
                @click="emitClose"
              >
                Batal
              </button>

              <!-- Tombol Simpan Perubahan (Primary Teal) -->
              <button
                type="button"
                class="px-5 py-2.5 rounded-xl bg-[#005B70] hover:bg-[#004859] active:bg-[#003845] text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                @click="handleSave"
              >
                <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  bukuData: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['close', 'save'])

// File references
const fileInputRef = ref(null)
const coverInputRef = ref(null)

// Reactive form state
const formEdit = reactive({
  id: null,
  bookId: 'ID: BK-2024-F6-0182',
  title: 'Fisika Terapan Kelas XI: Gelombang & Optika',
  isbn: '978-602-244-789-2',
  author: 'Bambang Haryadi, M.Si; Dr. Irwan Sus...',
  publisher: 'Pusat Kurikulum & Perbukuan Kemendik...',
  format: 'PDF E-Book',
  category: 'Kurikulum Merdeka - Fase F (Kelas XI & XII)',
  synopsis: 'Materi ajar Fisika Fase F untuk jenjang SMA Kelas XI berfokus pada penguasaan konsep gelombang mekanik, gelombang bunyi, serta fenomena optika geometri dan optika fisis. Dilengkapi dengan panduan lembar kerja praktikum digital mandiri untuk laboratorium sains SMA Negeri 11 Garut.',
  fileName: 'Fisika_Terapan_Kelas_XI_SMAN11.pdf',
  fileSize: '14.2 MB'
})

// Populate state when bukuData prop updates or modal opens
watch(
  () => props.bukuData,
  (newData) => {
    if (newData) {
      formEdit.id = newData.id || null
      formEdit.bookId = newData.bookId || `ID: BK-2024-F6-0${newData.id || 182}`
      formEdit.title = newData.title || formEdit.title
      formEdit.isbn = newData.isbn || formEdit.isbn
      formEdit.author = newData.author || formEdit.author
      formEdit.publisher = newData.publisher || formEdit.publisher
      formEdit.format = newData.formatLabel?.includes('ePub') ? 'ePub Digital' : 'PDF E-Book'
      formEdit.category = newData.categoryName?.includes('Fase E') 
        ? 'Kurikulum Merdeka - Fase E (Kelas X)' 
        : 'Kurikulum Merdeka - Fase F (Kelas XI & XII)'
      if (newData.synopsis) formEdit.synopsis = newData.synopsis
    }
  },
  { immediate: true }
)

// Actions
const emitClose = () => {
  emit('close')
}

const handleSave = () => {
  emit('save', { ...formEdit })
}

// Upload triggers
const triggerCoverInput = () => {
  coverInputRef.value?.click()
}

const onCoverChange = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    alert(`Sampul baru "${file.name}" berhasil dipilih dan siap disimpan.`)
  }
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const onFileChange = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    formEdit.fileName = file.name
    formEdit.fileSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`
  }
}

const showZoomAlert = () => {
  alert('Pratinjau kover resolusi tinggi (Fisika Modern - Edisi Eksklusif SMAN 11 Garut)')
}
</script>

<style scoped>
/* Modal Transition Animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-in {
  animation: modalIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
