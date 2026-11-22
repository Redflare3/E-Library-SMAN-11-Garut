import { request } from './client.js'

let filtersPromise = null

// GET /api/meta/filters, di-cache di memori selama sesi (nilai jarang berubah)
export function getFilters() {
  if (!filtersPromise) {
    filtersPromise = request('/meta/filters').catch((err) => {
      filtersPromise = null // jangan cache kegagalan
      throw err
    })
  }
  return filtersPromise
}
