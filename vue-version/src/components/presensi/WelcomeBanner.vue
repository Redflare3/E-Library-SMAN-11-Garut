<script setup>
import { Sparkles, BookOpen } from 'lucide-vue-next'
</script>

<template>
  <section
    class="relative overflow-hidden bg-gradient-to-br from-navy-800 via-navy-700 to-primary-600 text-white rounded-2xl mx-4 sm:mx-6 lg:mx-0 mt-4 sm:mt-6"
  >
    <!-- Decorative circles -->
    <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
    <div class="absolute -bottom-8 -right-4 w-28 h-28 bg-white/5 rounded-full" />
    <div
      class="absolute top-1/2 right-12 w-20 h-20 bg-accent-500/10 rounded-full hidden lg:block"
    />

    <div class="relative z-10 px-6 sm:px-8 py-8 sm:py-10 lg:py-12">
      <!-- Badge -->
      <div
        class="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs font-semibold text-accent-200 mb-4"
      >
        <Sparkles class="w-3.5 h-3.5" />
        <span>PRESENSI MANDIRI PENGUNJUNG</span>
      </div>

      <!-- Title -->
      <h2
        class="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight max-w-xl"
      >
        Selamat Datang di Ruang Baca SMAN 11 Garut
      </h2>

      <!-- Subtitle -->
      <p class="mt-3 text-sm sm:text-base text-navy-200 max-w-lg leading-relaxed">
        Silakan lengkapi presensi digital Anda untuk pencatatan kehadiran.
      </p>
    </div>

    <!-- Right decorative illustration -->
    <div class="absolute right-6 bottom-4 hidden lg:flex items-end gap-2 opacity-20">
      <BookOpen class="w-16 h-16" />
      <div class="w-10 h-14 border-2 border-white rounded-md" />
      <div class="w-8 h-18 border-2 border-white rounded-md" />
    </div>
  </section>
</template>
