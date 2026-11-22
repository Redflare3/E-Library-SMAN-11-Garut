import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../stores/auth.js'

// Views - Lazy-loaded untuk optimasi rendering modular
const KatalogView = () => import('../views/KatalogView.vue')
const CariKategoriView = () => import('../views/CariKategoriView.vue')
const DetailBukuView = () => import('../views/DetailBukuView.vue')
const LoginView = () => import('../views/auth/LoginView.vue')
const UnggahanSayaView = () => import('../views/staff/UnggahanSayaView.vue')
const AdminDashboardView = () => import('../views/admin/AdminDashboardView.vue')

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
      title: 'Katalog Utama - E-Library SMAN 11 Garut'
    }
  },
  {
    path: '/katalog',
    redirect: '/'
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
    path: '/unggahan',
    name: 'UnggahanSaya',
    component: UnggahanSayaView,
    meta: {
      title: 'Unggahan Saya - E-Library SMAN 11 Garut',
      requiresAuth: true,
      roles: ['TEACHER', 'LIBRARIAN']
    }
  },
  {
    path: '/admin',
    redirect: '/admin/dashboard'
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboardView,
    meta: {
      title: 'Panel Pengelola Perpustakaan - SMAN 11 Garut',
      hideNavbar: true,
      requiresAuth: true,
      roles: ['LIBRARIAN']
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
