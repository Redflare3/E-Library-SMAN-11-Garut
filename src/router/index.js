import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../stores/auth.js'

// Views - Lazy-loaded untuk optimasi rendering modular
const KatalogView = () => import('../views/KatalogView.vue')
const DetailBukuView = () => import('../views/DetailBukuView.vue')
const ArsipView = () => import('../views/ArsipView.vue')
const LoginView = () => import('../views/auth/LoginView.vue')
const StaffLayout = () => import('../layouts/StaffLayout.vue')
const BukuSayaView = () => import('../views/staff/BukuSayaView.vue')
const ArsipSayaView = () => import('../views/staff/ArsipSayaView.vue')
const StatistikView = () => import('../views/admin/StatistikView.vue')
const BukuAdminView = () => import('../views/admin/BukuAdminView.vue')
const ArsipAdminView = () => import('../views/admin/ArsipAdminView.vue')
const SampahView = () => import('../views/admin/SampahView.vue')
const PenggunaView = () => import('../views/admin/PenggunaView.vue')
const KategoriView = () => import('../views/admin/KategoriView.vue')
const ImporView = () => import('../views/admin/ImporView.vue')
const PenyimpananView = () => import('../views/admin/PenyimpananView.vue')

const keepQueryTo = (path) => (to) => ({ path, query: to.query })

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      title: 'Masuk Staf - E-Library SMAN 11 Garut',
      hideNavbar: true,
      guestOnly: true
    }
  },
  {
    path: '/',
    name: 'Katalog',
    component: KatalogView,
    meta: {
      title: 'Katalog Buku - E-Library SMAN 11 Garut'
    }
  },
  // Tautan lama: halaman Cari & Filter sudah digabung ke katalog (parameter query sama)
  { path: '/katalog', redirect: keepQueryTo('/') },
  { path: '/kategori', redirect: keepQueryTo('/') },
  { path: '/search', redirect: keepQueryTo('/') },
  {
    path: '/buku/:id',
    name: 'DetailBuku',
    component: DetailBukuView,
    meta: {
      title: 'Detail Buku - E-Library SMAN 11 Garut'
    }
  },
  {
    path: '/arsip',
    name: 'Arsip',
    component: ArsipView,
    meta: {
      title: 'Arsip Sekolah - E-Library SMAN 11 Garut'
    }
  },
  // Area staf (guru & pustakawan): layout sidebar sendiri, tanpa header/footer publik
  {
    path: '/unggahan',
    component: StaffLayout,
    meta: {
      requiresAuth: true,
      roles: ['TEACHER', 'LIBRARIAN'],
      hideNavbar: true
    },
    children: [
      { path: '', redirect: { name: 'BukuSaya' } },
      {
        path: 'buku',
        name: 'BukuSaya',
        component: BukuSayaView,
        meta: { title: 'Buku Saya - E-Library SMAN 11 Garut' }
      },
      {
        path: 'arsip',
        name: 'ArsipSaya',
        component: ArsipSayaView,
        meta: { title: 'Arsip Saya - E-Library SMAN 11 Garut' }
      }
    ]
  },
  // Pengelolaan pustakawan: layout staf yang sama, menu "Pengelolaan" di sidebar
  {
    path: '/admin',
    component: StaffLayout,
    meta: {
      requiresAuth: true,
      roles: ['LIBRARIAN'],
      hideNavbar: true
    },
    children: [
      { path: '', redirect: { name: 'AdminStatistik' } },
      // Tautan lama (dasbor mock sebelum Tahap 5A)
      { path: 'dashboard', redirect: { name: 'AdminStatistik' } },
      {
        path: 'statistik',
        name: 'AdminStatistik',
        component: StatistikView,
        meta: { title: 'Statistik - Panel Pustakawan' }
      },
      {
        path: 'buku',
        name: 'AdminBuku',
        component: BukuAdminView,
        meta: { title: 'Semua Buku - Panel Pustakawan' }
      },
      {
        path: 'arsip',
        name: 'AdminArsip',
        component: ArsipAdminView,
        meta: { title: 'Semua Arsip - Panel Pustakawan' }
      },
      {
        path: 'sampah',
        name: 'AdminSampah',
        component: SampahView,
        meta: { title: 'Tempat Sampah - Panel Pustakawan' }
      },
      {
        path: 'pengguna',
        name: 'AdminPengguna',
        component: PenggunaView,
        meta: { title: 'Pengguna - Panel Pustakawan' }
      },
      {
        path: 'kategori',
        name: 'AdminKategori',
        component: KategoriView,
        meta: { title: 'Kategori - Panel Pustakawan' }
      },
      {
        path: 'impor',
        name: 'AdminImpor',
        component: ImporView,
        meta: { title: 'Unggah Massal - Panel Pustakawan' }
      },
      {
        path: 'penyimpanan',
        name: 'AdminPenyimpanan',
        component: PenyimpananView,
        meta: { title: 'Penyimpanan - Panel Pustakawan' }
      }
    ]
  },
  // Fallback Wildcard Route (404)
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

function onlyItemChanged(a, b) {
  const strip = ({ item, ...rest }) => JSON.stringify(Object.entries(rest).sort())
  return strip(a) === strip(b)
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // Buka/tutup/geser lightbox arsip (?item=) tidak menggulir halaman
    if (to.path === from.path && onlyItemChanged(to.query, from.query)) {
      return false
    }
    return { top: 0, behavior: 'smooth' }
  }
})

// Guard akses: tunggu sesi dipulihkan, lalu cek login & peran
router.beforeEach(async (to) => {
  await auth.init()

  const loggedIn = auth.isLoggedIn.value

  if (to.meta.guestOnly && loggedIn) {
    return auth.homePath()
  }

  if (to.meta.requiresAuth && !loggedIn) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  if (to.meta.roles && !to.meta.roles.includes(auth.state.user?.role)) {
    return auth.homePath()
  }

  return true
})

// Navigation Guard untuk memperbarui judul dokumen secara offline
router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = 'E-Library SMAN 11 Garut'
  }
})

export default router
