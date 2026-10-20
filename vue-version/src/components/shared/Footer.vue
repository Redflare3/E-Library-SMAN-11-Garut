<script setup>
import {
  MapPin,
  Phone,
  Mail,
  User,
  Wifi,
  ChevronRight,
  ShieldCheck,
  GraduationCap
} from 'lucide-vue-next'
import { footerData } from '../../data/mockData'
</script>

<template>
  <footer class="bg-white border-t border-border mt-16">
    <!-- Main Footer Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        <!-- Col 1: Brand & About -->
        <div>
          <div class="flex items-center gap-3 mb-3.5">
            <!-- School Crest / Emblem Placeholder -->
            <div class="w-9 h-9 rounded-full bg-navy-800 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              <span class="text-xs">11G</span>
            </div>
            <div>
              <h4 class="text-sm font-bold text-navy-900 leading-tight">
                E-Library SMAN 11 Garut
              </h4>
              <p class="text-[10px] text-text-muted leading-tight">
                Sistem Informasi Manajemen Perpustakaan
              </p>
            </div>
          </div>

          <p class="text-xs text-text-secondary leading-relaxed mb-4">
            {{ footerData.description }}
          </p>

          <div class="flex flex-wrap gap-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-100">
              <ShieldCheck class="w-3 h-3 text-sky-600" />
              NPP: {{ footerData.npp }}
            </span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-100">
              <GraduationCap class="w-3 h-3 text-sky-600" />
              {{ footerData.akreditasi }}
            </span>
          </div>
        </div>

        <!-- Col 2: Lokasi & Kontak -->
        <div>
          <h5 class="text-xs font-bold text-navy-900 uppercase tracking-wider mb-4">
            LOKASI &amp; KONTAK
          </h5>
          <ul class="space-y-3">
            <li class="flex items-start gap-2.5">
              <MapPin class="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span class="text-xs text-text-secondary leading-relaxed">
                {{ footerData.address }}
              </span>
            </li>
            <li class="flex items-center gap-2.5">
              <Phone class="w-4 h-4 text-sky-600 shrink-0" />
              <span class="text-xs text-text-secondary">
                {{ footerData.phone }}
              </span>
            </li>
            <li class="flex items-center gap-2.5">
              <Mail class="w-4 h-4 text-sky-600 shrink-0" />
              <span class="text-xs text-text-secondary">
                {{ footerData.email }}
              </span>
            </li>
            <li class="flex items-start gap-2.5">
              <User class="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span class="text-xs text-text-secondary">
                {{ footerData.librarian }}
              </span>
            </li>
          </ul>
        </div>

        <!-- Col 3: Jam Layanan -->
        <div>
          <h5 class="text-xs font-bold text-navy-900 uppercase tracking-wider mb-4">
            JAM LAYANAN PERPUSTAKAAN
          </h5>
          <div class="space-y-2 text-xs">
            <div
              v-for="(item, idx) in footerData.schedule"
              :key="idx"
              class="flex items-center justify-between py-1 border-b border-gray-100 last:border-none"
            >
              <span class="text-text-secondary">{{ item.day }}</span>
              <span :class="['font-semibold', item.closed ? 'text-rose-600' : 'text-navy-900']">
                {{ item.hours }}
              </span>
            </div>
          </div>

          <!-- 24/7 Portal badge -->
          <div class="mt-4 p-2.5 rounded-xl bg-sky-50/80 border border-sky-100 flex items-center gap-2.5">
            <Wifi class="w-4 h-4 text-sky-600 shrink-0" />
            <span class="text-[10px] text-sky-900 leading-tight font-medium">
              Layanan E-Book &amp; Portal Digital aktif 24 Jam non-stop
            </span>
          </div>
        </div>

        <!-- Col 4: Navigasi Cepat -->
        <div>
          <h5 class="text-xs font-bold text-navy-900 uppercase tracking-wider mb-4">
            NAVIGASI CEPAT
          </h5>
          <ul class="space-y-2">
            <li v-for="link in footerData.quickLinks" :key="link">
              <a
                href="#"
                class="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-sky-600 transition-colors group"
              >
                <ChevronRight class="w-3.5 h-3.5 text-text-muted group-hover:text-sky-600 transition-colors" />
                <span>{{ link }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom Copyright Bar -->
    <div class="border-t border-border bg-slate-50/60 py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-text-muted">
        <p class="text-center md:text-left">
          © 2025 Perpustakaan SMAN 11 Garut. Hak Cipta Dilindungi Undang-Undang. Dikembangkan untuk Komunitas Pendidikan Garut.
        </p>
        <div class="flex items-center gap-4">
          <a href="#" class="hover:text-text-secondary transition-colors">Kebijakan Peminjaman</a>
          <span>•</span>
          <a href="#" class="hover:text-text-secondary transition-colors">Pedoman Siswa</a>
          <span>•</span>
          <a href="#" class="hover:text-text-secondary transition-colors">Sistem Perpustakaan</a>
        </div>
      </div>
    </div>
  </footer>
</template>
