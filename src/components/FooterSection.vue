<template>
  <footer class="border-t border-slate-200 mt-16">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
      <p>© {{ year }} Perpustakaan Digital SMAN 11 Garut</p>
      <router-link v-if="!auth.isLoggedIn.value" to="/login" class="hover:text-slate-800 transition-colors">
        Masuk staf
      </router-link>
    </div>
  </footer>
</template>

<script setup>
import { auth } from '../stores/auth.js'

const year = new Date().getFullYear()
</script>
