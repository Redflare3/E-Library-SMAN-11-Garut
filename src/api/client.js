import { getToken } from './token.js'

// Error API yang dinormalisasi: { status, code, message, fieldErrors }
export class ApiError extends Error {
  constructor({ status = 0, code = 'UNKNOWN_ERROR', message = '', fieldErrors } = {}) {
    super(message || code)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fieldErrors = fieldErrors || {}
  }
}

let unauthorizedHandler = null

// Didaftarkan oleh main.js agar client tidak bergantung pada router
export function setUnauthorizedHandler(fn) {
  unauthorizedHandler = fn
}

function buildUrl(path, query) {
  let url = '/api' + path
  if (query) {
    const params = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return
      params.append(key, value)
    })
    const qs = params.toString()
    if (qs) url += '?' + qs
  }
  return url
}

function fallbackCode(status) {
  if (status === 413) return 'FILE_TOO_LARGE'
  if ([500, 502, 503, 504].includes(status)) return 'SERVER_UNREACHABLE'
  return 'UNKNOWN_ERROR'
}

async function readError(res) {
  try {
    const body = await res.json()
    if (body && typeof body === 'object' && body.code) {
      return new ApiError({ ...body, status: body.status ?? res.status })
    }
  } catch {
    /* body bukan JSON (Nginx / proxy / jaringan) */
  }
  return new ApiError({ status: res.status, code: fallbackCode(res.status) })
}

/**
 * Panggil endpoint backend.
 * @returns JSON hasil parse, atau null untuk 204 / body kosong.
 * @throws ApiError
 */
export async function request(
  path,
  { method = 'GET', query, body, auth = true, skipAuthRedirect = false } = {}
) {
  const headers = { Accept: 'application/json' }
  const token = auth ? getToken() : null
  if (token) headers.Authorization = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let res
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    })
  } catch {
    throw new ApiError({ status: 0, code: 'NETWORK_ERROR' })
  }

  if (!res.ok) {
    const error = await readError(res)
    if (res.status === 401 && !skipAuthRedirect && unauthorizedHandler) {
      unauthorizedHandler(error)
    }
    throw error
  }

  if (res.status === 204) return null
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}
