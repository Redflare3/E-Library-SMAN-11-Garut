import { getToken } from './token.js'
import { ApiError, apiErrorFrom, notifyUnauthorized } from './client.js'

// Bagian JSON multipart: harus Blob bertipe application/json (frontend-guide §6.1)
export function jsonPart(obj) {
  return new Blob([JSON.stringify(obj)], { type: 'application/json' })
}

/**
 * Unggah multipart via XHR (fetch tidak bisa melaporkan progres unggah).
 * @param path  path API tanpa awalan /api, mis. '/books'
 * @param parts [[name, File|Blob, fileName?], ...]; nilai null dilewati
 * @param onProgress ({ loaded, total }) => void
 * @returns { promise, abort }  promise → JSON hasil parse; reject → ApiError (code ABORTED bila dibatalkan)
 */
export function upload(path, { method = 'POST', parts = [], onProgress } = {}) {
  const xhr = new XMLHttpRequest()
  const form = new FormData()
  for (const [name, value, fileName] of parts) {
    if (value === null || value === undefined) continue
    if (fileName) form.append(name, value, fileName)
    else form.append(name, value)
  }

  const promise = new Promise((resolve, reject) => {
    xhr.open(method, '/api' + path)
    xhr.setRequestHeader('Accept', 'application/json')
    const token = getToken()
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    // Content-Type sengaja tidak diset: browser menambahkan boundary multipart

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        onProgress({ loaded: e.loaded, total: e.lengthComputable ? e.total : 0 })
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (!xhr.responseText) return resolve(null)
        try {
          resolve(JSON.parse(xhr.responseText))
        } catch {
          resolve(xhr.responseText)
        }
        return
      }
      const error = apiErrorFrom(xhr.status, xhr.responseText)
      reject(error)
      // Setelah penolakan diproses (penghitung unggahan aktif sudah turun), baru arahkan ke login
      if (xhr.status === 401) setTimeout(() => notifyUnauthorized(error), 0)
    }
    xhr.onerror = () => reject(new ApiError({ status: 0, code: 'NETWORK_ERROR' }))
    xhr.onabort = () => reject(new ApiError({ status: 0, code: 'ABORTED' }))

    xhr.send(form)
  })

  return { promise, abort: () => xhr.abort() }
}
