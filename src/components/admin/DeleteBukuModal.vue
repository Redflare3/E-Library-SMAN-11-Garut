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

        <!-- Modal Card Container (Max ~xl) -->
        <div class="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-7 z-10 my-auto overflow-hidden animate-modal-in select-none">
          
          <!-- Tombol Close 'X' Kanan Atas -->
          <button
            type="button"
            class="absolute top-5 right-5 sm:top-6 sm:right-6 w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            title="Tutup dialog"
            @click="emitClose"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <!-- 1. Modal Header (Icon Trash Red Box + Badges + Title & Subtitle) -->
          <div class="flex items-start gap-3.5 pr-8">
            <!-- Icon Trash Box Merah Muda -->
            <div class="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0 shadow-xs">
              <svg class="w-5 h-5 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </div>

            <!-- Title & Warning Badge -->
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Hapus Buku dari Katalog?
                </h2>
                <!-- Warning Badge -->
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200/80">
                  Tindakan Permanen
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-1 leading-relaxed">
                Tindakan ini akan mencopot data buku dan berkas e-book dari katalog publik E-Library SMAN 11 Garut serta menghapusnya dari repositori server perpustakaan.
              </p>
            </div>
          </div>

          <!-- 2. Card Pratinjau Buku yang Dihapus (Grey Rounded Card Box) -->
          <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-center gap-4 mt-5">
            <!-- Kover Buku Thumbnail -->
            <div class="w-16 h-22 rounded-xl overflow-hidden shadow-xs border border-slate-200/90 shrink-0 bg-[#0c2340] flex flex-col justify-between p-1.5 text-white relative">
              <!-- Render Cover Image atau Styled Fallback Cover -->
              <img 
                v-if="bukuData?.coverImage" 
                :src="bukuData.coverImage" 
                :alt="bukuData.title" 
                class="w-full h-full object-cover rounded-lg"
              />
              <div v-else class="h-full w-full rounded-lg bg-gradient-to-br from-[#0c2340] via-[#10305a] to-[#04101e] p-1.5 flex flex-col justify-between border border-cyan-500/20 text-center relative overflow-hidden">
                <div class="text-[7px] font-extrabold tracking-wider text-cyan-200 uppercase font-serif">
                  FISIKA
                </div>
                <!-- Orbit Atom Icon -->
                <div class="w-6 h-6 mx-auto my-auto relative flex items-center justify-center">
                  <div class="w-5 h-5 rounded-full border border-cyan-400/50"></div>
                  <div class="w-2 h-2 rounded-full bg-cyan-400"></div>
                </div>
                <div class="text-[5px] text-slate-300 font-sans">
                  SMAN 11
                </div>
              </div>
            </div>

            <!-- Metadata Ringkas Buku -->
            <div class="flex-1 min-w-0">
              <!-- Top Badges -->
              <div class="flex flex-wrap items-center gap-1.5">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                  {{ bukuData?.categoryName || 'Kurikulum Merdeka • Fase F' }}
                </span>
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-white text-slate-500 border border-slate-200/80">
                  {{ bukuData?.bookId || `ID: BK-2024-F6-0${bukuData?.id || 182}` }}
                </span>
              </div>

              <!-- Judul Buku -->
              <div class="font-bold text-xs sm:text-sm text-slate-900 mt-1 line-clamp-1">
                {{ bukuData?.title || 'Fisika Terapan Kelas XI: Gelombang & Optika' }}
              </div>

              <!-- Penulis & Penerbit -->
              <div class="text-[11px] text-slate-500 mt-0.5 truncate">
                Penulis: {{ bukuData?.author || 'Bambang Haryadi, M.Si' }} • {{ bukuData?.publisher || 'Kemendikbudristek RI' }}
              </div>

              <!-- Format & Lokasi Rak Fisik -->
              <div class="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1.5">
                <span>{{ bukuData?.formatLabel || 'PDF E-Book (14.2 MB)' }}</span>
                <span>•</span>
                <span>8 Eksemplar Fisik di Rak B-04</span>
              </div>
            </div>
          </div>

          <!-- 3. Modal Footer / Action Buttons -->
          <div class="flex items-center justify-end gap-3 mt-6 pt-2">
            <!-- Tombol Batal / Kembali -->
            <button
              type="button"
              :disabled="isDeleting"
              class="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold text-xs shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
              @click="emitClose"
            >
              Batal / Kembali
            </button>

            <!-- Tombol Ya, Hapus Buku Ini (Danger Red) -->
            <button
              type="button"
              :disabled="isDeleting"
              class="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:bg-rose-400 text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
              @click="handleConfirm"
            >
              <!-- Spinner if deleting -->
              <svg 
                v-if="isDeleting" 
                class="animate-spin -ml-0.5 mr-1 h-3.5 w-3.5 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <!-- Trash Icon -->
              <svg v-else class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span>{{ isDeleting ? 'Menghapus Berkas...' : 'Ya, Hapus Buku Ini' }}</span>
            </button>
          </div>

        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref } from 'vue'

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

const emit = defineEmits(['close', 'confirm-delete'])

const isDeleting = ref(false)

const emitClose = () => {
  if (!isDeleting.value) {
    emit('close')
  }
}

const handleConfirm = async () => {
  isDeleting.value = true
  
  // Simulasi asynchronous delete request ke server lokal (300ms)
  await new Promise(resolve => setTimeout(resolve, 350))

  emit('confirm-delete', props.bukuData?.id)
  isDeleting.value = false
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
