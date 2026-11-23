<template>
  <div class="min-h-screen bg-white text-slate-800 antialiased flex flex-col selection:bg-brand selection:text-white">
    <!-- Header & footer publik (disembunyikan di halaman login dan area staf) -->
    <HeaderNavbar v-if="!$route.meta.hideNavbar" />

    <main :class="['flex-1 w-full', $route.meta.hideNavbar ? '' : 'max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10']">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <FooterSection v-if="!$route.meta.hideNavbar" />

    <!-- Area staf memasang ToastHost sendiri di StaffLayout -->
    <ToastHost v-if="!$route.meta.hideNavbar" />
  </div>
</template>

<script setup>
import HeaderNavbar from './components/HeaderNavbar.vue'
import FooterSection from './components/FooterSection.vue'
import ToastHost from './components/ToastHost.vue'
</script>

<style>
/* Transisi antarhalaman */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
