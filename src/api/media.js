import { ref, watch, onBeforeUnmount } from 'vue'
import { getToken } from './token.js'
import { ApiError } from './client.js'

// <img>/<iframe>/<a> tidak bisa mengirim header Authorization, jadi item STAFF diambil
// via fetch lalu dijadikan blob URL (frontend-guide §5.3). Item PUBLIC memakai URL biasa.

async function fetchBlob(url) {
  const token = getToken()
  let res
  try {
    res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
  } catch {
    throw new ApiError({ status: 0, code: 'NETWORK_ERROR' })
  }
  if (!res.ok) {
    let body = null
    try {
      body = await res.json()
    } catch {
      /* bukan JSON */
    }
    throw new ApiError(body?.code ? body : { status: res.status, code: res.status === 404 ? 'NOT_FOUND' : 'UNKNOWN_ERROR' })
  }
  return res.blob()
}

/**
 * @param sourceGetter () => ({ url, visibility }) | null
 * @returns { src: Ref<string|null>, error: Ref<ApiError|null>, loading: Ref<boolean> }
 */
export function useMediaUrl(sourceGetter) {
  const src = ref(null)
  const error = ref(null)
  const loading = ref(false)
  let objectUrl = null
  let requestId = 0

  function revoke() {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl)
      objectUrl = null
    }
  }

  watch(
    () => {
      const s = sourceGetter()
      return s && s.url ? `${s.visibility}|${s.url}` : null
    },
    async () => {
      const id = ++requestId
      revoke()
      error.value = null
      const source = sourceGetter()

      if (!source || !source.url) {
        src.value = null
        loading.value = false
        return
      }

      const needsAuth = source.visibility === 'STAFF' && !!getToken()
      if (!needsAuth) {
        src.value = source.url
        loading.value = false
        return
      }

      src.value = null
      loading.value = true
      try {
        const blob = await fetchBlob(source.url)
        if (id !== requestId) return // sumber sudah berganti
        objectUrl = URL.createObjectURL(blob)
        src.value = objectUrl
      } catch (err) {
        if (id === requestId) error.value = err
      } finally {
        if (id === requestId) loading.value = false
      }
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    requestId++
    revoke()
  })

  return { src, error, loading }
}

// Unduh berkas STAFF dengan header Authorization, simpan dengan nama asli
export async function downloadAuthed(url, fileName) {
  const blob = await fetchBlob(url)
  const objectUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = objectUrl
  a.download = fileName || ''
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(objectUrl), 10000)
}
