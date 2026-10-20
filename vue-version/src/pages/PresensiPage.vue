<script setup>
import Navbar from '../components/shared/Navbar.vue'
import Footer from '../components/shared/Footer.vue'
import InfoBar from '../components/presensi/InfoBar.vue'
import WelcomeBanner from '../components/presensi/WelcomeBanner.vue'
import TotalCounter from '../components/presensi/TotalCounter.vue'
import AttendanceForm from '../components/presensi/AttendanceForm.vue'
import RecentVisitors from '../components/presensi/RecentVisitors.vue'
import LibrarianCard from '../components/presensi/LibrarianCard.vue'
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
    <!-- Top Global Header -->
    <Navbar />

    <!-- Real-time Status Strip -->
    <InfoBar />

    <!-- Main Content Container -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <!-- Welcome Hero Banner -->
      <WelcomeBanner />

      <!-- Metric / Counter -->
      <TotalCounter :count="142" />

      <!-- Two Column Layout: Form & Sidebar -->
      <div class="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Left: Form Input Kehadiran (approx 7 of 12 cols) -->
        <div class="lg:col-span-7">
          <AttendanceForm />
        </div>

        <!-- Right: Real-time Visitors & Librarian Card (approx 5 of 12 cols) -->
        <div class="lg:col-span-5 space-y-5">
          <RecentVisitors />
          <LibrarianCard />
        </div>
      </div>
    </main>

    <!-- Global Footer -->
    <Footer />
  </div>
</template>
