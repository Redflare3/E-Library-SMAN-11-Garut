import { createRouter, createWebHistory } from 'vue-router'

// Views - Lazy-loaded untuk optimasi rendering modular
const BerandaPage = () => import('../views/BerandaPage.vue')
const KategoriPage = () => import('../views/KategoriPage.vue')
const DetailBukuPage = () => import('../views/buku/DetailBukuPage.vue')
const PresensiPage = () => import('../views/PresensiPage.vue')
const StatistikHarianPage = () => import('../views/statistik/StatistikHarianPage.vue')
const StatistikMingguanPage = () => import('../views/statistik/StatistikMingguanPage.vue')
const StatistikBulananPage = () => import('../views/statistik/StatistikBulananPage.vue')
const AdminDashboardPage = () => import('../views/admin/AdminDashboardPage.vue')

const routes = [
  {
    path: '/',
    name: 'Presensi',
    component: PresensiPage,
    meta: {
      title: 'E-Library SMAN 11 Garut - Presensi Mandiri Pengunjung'
    }
  },
  {
    path: '/presensi',
    redirect: '/'
  },
  {
    path: '/katalog',
    name: 'Beranda',
    component: BerandaPage,
    meta: {
      title: 'Katalog Utama - E-Library SMAN 11 Garut'
    }
  },
  {
    path: '/kategori',
    name: 'Kategori',
    component: KategoriPage,
    meta: {
      title: 'Cari & Filter Kategori - E-Library SMAN 11 Garut'
    }
  },
  {
    path: '/buku/:id',
    name: 'DetailBuku',
    component: DetailBukuPage,
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
    component: StatistikHarianPage,
    meta: {
      title: 'Statistik Harian & Buku Tamu - E-Library SMAN 11 Garut'
    }
  },
  {
    path: '/statistik/mingguan',
    name: 'StatistikMingguan',
    component: StatistikMingguanPage,
    meta: {
      title: 'Statistik Mingguan - E-Library SMAN 11 Garut'
    }
  },
  {
    path: '/statistik/bulanan',
    name: 'StatistikBulanan',
    component: StatistikBulananPage,
    meta: {
      title: 'Statistik Bulanan - E-Library SMAN 11 Garut'
    }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboardPage,
    meta: {
      title: 'Panel Pengelola Perpustakaan - SMAN 11 Garut'
    }
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
