import { createRouter, createWebHistory } from 'vue-router'

// Views - Lazy-loaded untuk optimasi rendering modular
const BerandaPage = () => import('../views/BerandaPage.vue')
const CariKategoriView = () => import('../views/CariKategoriView.vue')
const DetailBukuView = () => import('../views/DetailBukuView.vue')
const PresensiPage = () => import('../views/PresensiPage.vue')
const StatistikHarianView = () => import('../views/statistik/StatistikHarianView.vue')
const StatistikMingguanView = () => import('../views/statistik/StatistikMingguanView.vue')
const StatistikBulananView = () => import('../views/statistik/StatistikBulananView.vue')
const AdminDashboardPage = () => import('../views/admin/AdminDashboardPage.vue')
const AdminDashboardView = () => import('../views/admin/AdminDashboardView.vue')
const LoginView = () => import('../views/auth/LoginView.vue')
const KatalogView = () => import('../views/KatalogView.vue')

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      title: 'Portal Autentikasi Pengurus - E-Library SMAN 11 Garut',
      hideNavbar: true
    }
  },
  {
    path: '/',
    name: 'Katalog',
    component: KatalogView,
    meta: {
      title: 'Katalog Utama - E-Library SMAN 11 Garut'
    }
  },
  {
    path: '/katalog',
    redirect: '/'
  },
  {
    path: '/presensi',
    name: 'Presensi',
    component: PresensiPage,
    meta: {
      title: 'E-Library SMAN 11 Garut - Presensi Mandiri Pengunjung'
    }
  },
  {
    path: '/kategori',
    alias: '/search',
    name: 'Kategori',
    component: CariKategoriView,
    meta: {
      title: 'Cari & Filter Kategori - E-Library SMAN 11 Garut'
    }
  },
  {
    path: '/buku/:id',
    name: 'DetailBuku',
    component: DetailBukuView,
    meta: {
      title: 'Detail & Pembaca Dokumen - E-Library SMAN 11 Garut'
    }
  },
  {
    path: '/statistik',
    redirect: '/statistik/harian'
  },
  {
    path: '/statistik/harian',
    name: 'StatistikHarian',
    component: StatistikHarianView,
    meta: {
      title: 'Statistik & Presensi Pengunjung - E-Library SMAN 11 Garut'
    }
  },
  {
    path: '/statistik/mingguan',
    name: 'StatistikMingguan',
    component: StatistikMingguanView,
    meta: {
      title: 'Visualisasi Linear Tren Kunjungan - E-Library SMAN 11 Garut'
    }
  },
  {
    path: '/statistik/bulanan',
    name: 'StatistikBulanan',
    component: StatistikBulananView,
    meta: {
      title: 'Visualisasi Linear Tren Kunjungan Bulanan - E-Library SMAN 11 Garut'
    }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboardView,
    meta: {
      title: 'Panel Pengelola Perpustakaan - SMAN 11 Garut',
      hideNavbar: true
    }
  },
  {
    path: '/admin',
    redirect: '/admin/dashboard'
  },
  // Fallback Wildcard Route (404)
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'smooth' }
  }
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
