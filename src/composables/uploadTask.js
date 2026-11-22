import { reactive, ref, onBeforeUnmount } from 'vue'

// Jumlah unggahan yang sedang berjalan di seluruh aplikasi (untuk peringatan keluar halaman)
const activeUploads = ref(0)

function onBeforeUnload(e) {
  e.preventDefault()
  e.returnValue = ''
}

function setActive(delta) {
  const before = activeUploads.value
  activeUploads.value = Math.max(0, before + delta)
  if (before === 0 && activeUploads.value > 0) window.addEventListener('beforeunload', onBeforeUnload)
  if (before > 0 && activeUploads.value === 0) window.removeEventListener('beforeunload', onBeforeUnload)
}

export const LEAVE_WHILE_UPLOADING = 'Unggahan sedang berjalan. Tinggalkan halaman dan batalkan unggahan?'

// Untuk onBeforeRouteLeave di view: true = boleh pindah
export function confirmLeaveIfUploading() {
  return activeUploads.value === 0 || window.confirm(LEAVE_WHILE_UPLOADING)
}

/**
 * Satu tugas unggah (XHR) dengan progres & pembatalan.
 * run(start) menerima fungsi (onProgress) => { promise, abort } dari api/books.js / api/archive.js.
 */
export function useUploadTask() {
  const progress = reactive({ active: false, loaded: 0, total: 0, processing: false })
  let abortFn = null

  function onProgress({ loaded, total }) {
    progress.loaded = loaded
    progress.total = total
    // Byte terakhir terkirim: server masih meng-hash & memindahkan berkas
    if (total && loaded >= total) progress.processing = true
  }

  async function run(start) {
    progress.active = true
    progress.loaded = 0
    progress.total = 0
    progress.processing = false
    setActive(1)
    const task = start(onProgress)
    abortFn = task.abort
    try {
      return await task.promise
    } finally {
      abortFn = null
      progress.active = false
      progress.processing = false
      setActive(-1)
    }
  }

  function abort() {
    if (abortFn) abortFn()
  }

  // Komponen ditutup paksa (mis. pindah halaman setelah konfirmasi): batalkan XHR
  onBeforeUnmount(abort)

  return { progress, run, abort }
}

export { activeUploads }
