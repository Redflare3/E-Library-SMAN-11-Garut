<script setup>
import { ref } from 'vue'
import {
  BookOpen,
  Bell,
  UserCheck,
  Menu,
  X,
} from 'lucide-vue-next'
import { navMenuItems } from '../../data/mockData'

const mobileOpen = ref(false)
</script>

<template>
  <header class="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center gap-3 shrink-0">
          <div class="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center">
            <BookOpen class="w-5 h-5 text-white" />
          </div>
          <div class="hidden sm:block">
            <h1 class="text-sm font-bold text-navy-800 leading-tight">
              E-Library SMAN 11 Garut
            </h1>
            <p class="text-[11px] text-text-secondary leading-tight">
              Perpustakaan &amp; Repositori Literasi Digital
            </p>
          </div>
        </div>

        <!-- Desktop Nav -->
        <nav class="hidden lg:flex items-center gap-1">
          <a
            v-for="item in navMenuItems"
            :key="item.label"
            :href="item.href"
            :class="[
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              item.active
                ? 'bg-navy-700 text-white shadow-md'
                : 'text-text-secondary hover:bg-surface-alt hover:text-navy-700',
            ]"
          >
            {{ item.label }}
          </a>
        </nav>

        <!-- Right Actions -->
        <div class="flex items-center gap-2">
          <button
            class="hidden sm:flex items-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold rounded-full transition-colors shadow-sm"
          >
            <UserCheck class="w-4 h-4" />
            <span>Presensi Siswa</span>
          </button>

          <button class="relative p-2 rounded-full hover:bg-surface-alt transition-colors">
            <Bell class="w-5 h-5 text-text-secondary" />
            <span class="absolute top-1 right-1 w-2 h-2 bg-cta-500 rounded-full" />
          </button>

          <div
            class="w-9 h-9 rounded-full bg-navy-600 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-accent-300 transition-all"
          >
            <span class="text-xs font-bold text-white">RJ</span>
          </div>

          <!-- Mobile toggle -->
          <button
            class="lg:hidden p-2 rounded-lg hover:bg-surface-alt"
            @click="mobileOpen = !mobileOpen"
          >
            <X v-if="mobileOpen" class="w-5 h-5 text-text-primary" />
            <Menu v-else class="w-5 h-5 text-text-primary" />
          </button>
        </div>
      </div>

      <!-- Mobile Nav -->
      <nav
        v-if="mobileOpen"
        class="lg:hidden pb-4 border-t border-border pt-3 space-y-1"
      >
        <a
          v-for="item in navMenuItems"
          :key="item.label"
          :href="item.href"
          :class="[
            'block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
            item.active
              ? 'bg-navy-700 text-white'
              : 'text-text-secondary hover:bg-surface-alt',
          ]"
        >
          {{ item.label }}
        </a>
        <button
          class="flex items-center gap-2 w-full mt-2 px-4 py-2.5 bg-accent-500 text-white text-sm font-semibold rounded-lg"
        >
          <UserCheck class="w-4 h-4" />
          Presensi Siswa
        </button>
      </nav>
    </div>
  </header>
</template>
