<template>
  <!-- Placeholder sementara: diganti halaman Unggahan Saya penuh pada Tahap 4 -->
  <div class="max-w-2xl mx-auto py-10">
    <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-center space-y-3">
      <div class="w-14 h-14 mx-auto rounded-2xl bg-[#E1EFF6] text-[#005B70] flex items-center justify-center">
        <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      <h1 class="text-xl font-bold text-slate-900">Halo, {{ auth.state.user?.fullName }}.</h1>
      <p class="text-sm text-slate-500">Fitur unggahan hadir di tahap berikutnya.</p>
      <router-link to="/" class="inline-block mt-2 text-sm font-semibold text-[#0B6B82] hover:underline">
        Kembali ke Katalog
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { auth } from '../../stores/auth.js'
</script>
