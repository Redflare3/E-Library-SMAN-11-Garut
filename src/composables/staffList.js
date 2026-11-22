import { reactive, computed, watch } from 'vue'
import { errorMessage } from '../utils/errors.js'

export const STAFF_PAGE_SIZE = 10

/**
 * Daftar berhalaman untuk halaman staf (/books/mine, /archive/mine) dan admin (/books, /archive).
 * Nomor halaman ada di URL (?page=, mulai dari 1); API memakai 0.
 * filterKeys (opsional): nama query string yang diteruskan ke fetchPage, mis. ['q', 'categoryId'].
 */
export function useStaffList({ routeName, fetchPage, route, router, size = STAFF_PAGE_SIZE, filterKeys = [] }) {
  const list = reactive({ state: 'loading', items: [], totalElements: 0, totalPages: 0, error: '' })
  let requestId = 0

  const page = computed(() => {
    const p = Number.parseInt(route.query.page, 10)
    return Number.isFinite(p) && p > 1 ? p - 1 : 0
  })

  // Nilai filter dari URL (string atau null)
  const filters = computed(() => {
    const out = {}
    for (const key of filterKeys) {
      const v = route.query[key]
      out[key] = typeof v === 'string' && v.trim() ? v.trim() : null
    }
    return out
  })

  function buildQuery(nextFilters, nextPage) {
    const query = {}
    for (const key of filterKeys) {
      const v = nextFilters[key]
      if (v !== null && v !== undefined && v !== '') query[key] = String(v)
    }
    if (nextPage > 0) query.page = String(nextPage + 1)
    return query
  }

  function setPage(p) {
    router.push({ name: routeName, query: buildQuery(filters.value, p) })
  }

  // Ubah filter (kembali ke halaman 1). replace: untuk kotak pencarian yang di-debounce
  function setFilter(patch, { replace = false } = {}) {
    const target = { name: routeName, query: buildQuery({ ...filters.value, ...patch }, 0) }
    return replace ? router.replace(target) : router.push(target)
  }

  function resetFilters() {
    router.push({ name: routeName, query: {} })
  }

  async function loadList() {
    const id = ++requestId
    // Muat ulang diam-diam bila daftar sudah tampil (setelah simpan/hapus)
    if (list.state !== 'ready') list.state = 'loading'
    try {
      const res = await fetchPage({ ...filters.value, page: page.value, size })
      if (id !== requestId) return
      // Halaman terakhir kosong setelah hapus → mundur satu halaman
      if (!res.content.length && page.value > 0 && res.totalPages > 0) {
        setPage(Math.min(page.value - 1, res.totalPages - 1))
        return
      }
      list.items = res.content
      list.totalElements = res.totalElements
      list.totalPages = res.totalPages
      list.state = res.content.length ? 'ready' : 'empty'
    } catch (err) {
      if (id !== requestId) return
      list.error = errorMessage(err)
      list.state = 'error'
    }
  }

  // Ganti baris dengan data terbaru (dari respons PUT); field ringkasan ada di detail
  function replaceItem(detail) {
    const i = list.items.findIndex((it) => it.id === detail?.id)
    if (i >= 0) list.items.splice(i, 1, { ...list.items[i], ...detail })
  }

  // Setelah unggah: item baru ada di urutan pertama halaman 1 (urutan terbaru)
  function afterCreate() {
    if (page.value === 0) loadList()
    else setPage(0)
  }

  // Muat ulang saat halaman atau filter di URL berubah
  const listKey = computed(() => JSON.stringify([page.value, filters.value]))
  watch(
    listKey,
    () => {
      if (route.name !== routeName) return
      list.state = 'loading' // pindah halaman / filter: tampilkan kerangka
      loadList()
    },
    { immediate: true }
  )

  return { list, page, filters, loadList, setPage, setFilter, resetFilters, replaceItem, afterCreate }
}
