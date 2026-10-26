<template>
  <div class="min-h-screen bg-slate-50 font-sans antialiased text-slate-800 flex flex-col justify-between selection:bg-[#0B6B82] selection:text-white">
    <!-- Global Header Topbar & Sub-bar Navigation (Disembunyikan pada auth portal) -->
    <HeaderNavbar v-if="!$route.meta.hideNavbar" />

    <!-- Main Dynamic Content Container (Driven by Vue Router) -->
    <main :class="['flex-grow w-full', $route.meta.hideNavbar ? 'p-0' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8']">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Global Footer Kompleks SMAN 11 Garut (Disembunyikan pada auth portal) -->
    <FooterSection v-if="!$route.meta.hideNavbar" />
  </div>
</template>

<script setup>
import HeaderNavbar from './components/HeaderNavbar.vue'
import FooterSection from './components/FooterSection.vue'
</script>

<style>
/* Page Transition Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
