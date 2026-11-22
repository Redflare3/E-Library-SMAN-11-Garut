import { reactive, onBeforeUnmount } from 'vue'
import { getArchive } from '../api/archive.js'

const POLL_MS = 2000
const POLL_LIMIT_MS = 30000

/**
 * Pantau pemrosesan thumbnail arsip setelah unggah/edit: server mengisi width/height
 * beberapa detik kemudian (frontend-guide §5.2). Selesai → perbarui baris + cache buster ?v=.
 * @param replaceItem (detail) => void  dari useStaffList
 */
export function useThumbnailPolling(replaceItem) {
  const processing = reactive({}) // id → true selama dipantau
  const thumbKeys = reactive({}) // id → cache buster untuk ArchiveThumb
  const pollTimers = new Map()

  function stopPolling(id) {
    clearTimeout(pollTimers.get(id))
    pollTimers.delete(id)
    delete processing[id]
  }

  function watchProcessing(detail) {
    if (!detail || !['IMAGE', 'VIDEO'].includes(detail.mediaType) || detail.width) return
    const id = detail.id
    stopPolling(id)
    processing[id] = true
    const startedAt = Date.now()

    const tick = async () => {
      try {
        const fresh = await getArchive(id)
        if (fresh.width) {
          replaceItem(fresh)
          thumbKeys[id] = Date.now()
          stopPolling(id)
          return
        }
      } catch (err) {
        if (err.status === 404) return stopPolling(id) // sudah dihapus
      }
      if (Date.now() - startedAt >= POLL_LIMIT_MS) {
        // Tanpa ffmpeg / gambar sangat besar: biarkan placeholder
        thumbKeys[id] = Date.now()
        stopPolling(id)
        return
      }
      pollTimers.set(id, setTimeout(tick, POLL_MS))
    }
    pollTimers.set(id, setTimeout(tick, POLL_MS))
  }

  onBeforeUnmount(() => {
    for (const id of [...pollTimers.keys()]) stopPolling(id)
  })

  return { processing, thumbKeys, watchProcessing, stopPolling }
}
