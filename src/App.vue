<template>
  <div class="min-h-screen bg-slate-50 font-sans antialiased text-slate-800 flex flex-col justify-between selection:bg-[#0B6B82] selection:text-white">
    <!-- Global Header Topbar & Sub-bar Navigation -->
    <HeaderNavbar />

    <!-- Main Dynamic Content Container (Driven by Vue Router) -->
    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Global Footer Kompleks SMAN 11 Garut -->
    <FooterSection />
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
