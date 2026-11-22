import { reactive, computed, watch } from 'vue'
import { errorMessage } from '../utils/errors.js'

export const STAFF_PAGE_SIZE = 10

/**
 * Daftar berhalaman untuk halaman staf (/books/mine, /archive/mine).
 * Nomor halaman ada di URL (?page=, mulai dari 1); API memakai 0.
 */
export function useStaffList({ routeName, fetchPage, route, router, size = STAFF_PAGE_SIZE }) {
  const list = reactive({ state: 'loading', items: [], totalElements: 0, totalPages: 0, error: '' })
  let requestId = 0

  const page = computed(() => {
    const p = Number.parseInt(route.query.page, 10)
    return Number.isFinite(p) && p > 1 ? p - 1 : 0
  })

  function setPage(p) {
    router.push({ name: routeName, query: p > 0 ? { page: String(p + 1) } : {} })
  }

  async function loadList() {
    const id = ++requestId
    // Muat ulang diam-diam bila daftar sudah tampil (setelah simpan/hapus)
    if (list.state !== 'ready') list.state = 'loading'
    try {
      const res = await fetchPage({ page: page.value, size })
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

  // Setelah unggah: item baru ada di urutan pertama halaman 1
  function afterCreate() {
    if (page.value === 0) loadList()
    else setPage(0)
  }

  watch(
    () => route.query.page,
    () => {
      if (route.name !== routeName) return
      list.state = 'loading' // pindah halaman: tampilkan kerangka
      loadList()
    },
    { immediate: true }
  )

  return { list, page, loadList, setPage, replaceItem, afterCreate }
}
