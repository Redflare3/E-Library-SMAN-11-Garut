<template>
  <div class="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-xs">
    <!-- Header Form -->
    <div class="mb-6">
      <span class="text-xs font-bold text-[#0B6B82] tracking-wider uppercase block">
        FORMULIR MANDIRI
      </span>
      <h2 class="text-xl md:text-2xl font-bold text-slate-800 mt-1">
        Input Kehadiran Pengunjung
      </h2>
    </div>

    <!-- Alert Sukses Submit (Feedback Visual Interaktif) -->
    <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="successNotification" class="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between text-xs md:text-sm">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span class="font-medium">Presensi berhasil dicatat! Selamat membaca di E-Library SMAN 11 Garut.</span>
        </div>
        <button type="button" @click="successNotification = false" class="text-emerald-600 hover:text-emerald-900 font-bold ml-2">✕</button>
      </div>
    </transition>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- 1. Input Nama Lengkap Pengunjung -->
      <div>
        <label class="block text-xs md:text-sm font-semibold text-slate-700 mb-2">
          Nama Lengkap Pengunjung <span class="text-rose-500">*</span>
        </label>
        <div class="relative flex items-center">
          <!-- User Icon -->
          <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>

          <input
            v-model="formData.nama"
            type="text"
            required
            placeholder="Ketik nama lengkap..."
            class="w-full pl-10 pr-10 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B6B82]/20 focus:border-[#0B6B82] focus:bg-white transition-all"
          />

          <!-- Clear Button (Muncul jika ada teks) -->
          <button
            v-if="formData.nama"
            type="button"
            @click="formData.nama = ''"
            class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
            title="Hapus nama"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 2. Row: Kelas/Rombel/Status Civitas & Jenis Kelamin -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <!-- Dropdown Kelas / Rombel / Status Civitas -->
        <div>
          <label class="block text-xs md:text-sm font-semibold text-slate-700 mb-2">
            Kelas / Rombel / Status Civitas <span class="text-rose-500">*</span>
          </label>
          <div class="relative flex items-center">
            <!-- Graduation Cap Icon -->
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5" />
              </svg>
            </span>

            <select
              v-model="formData.kelas"
              required
              class="w-full pl-10 pr-10 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B6B82]/20 focus:border-[#0B6B82] focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled selected>Pilih kelas atau unit tugas...</option>
              
              <optgroup label="Siswa Kelas X (Fase E)">
                <option v-for="i in 12" :key="'X-' + i" :value="'X-' + i">Kelas X-{{ i }}</option>
              </optgroup>

              <optgroup label="Siswa Kelas XI (Fase F)">
                <option value="XI-MIPA 1">Kelas XI-MIPA 1</option>
                <option value="XI-MIPA 2">Kelas XI-MIPA 2</option>
                <option value="XI-MIPA 3">Kelas XI-MIPA 3</option>
                <option value="XI-IPS 1">Kelas XI-IPS 1</option>
                <option value="XI-IPS 2">Kelas XI-IPS 2</option>
                <option value="XI-IPS 3">Kelas XI-IPS 3</option>
                <option value="XI-Bahasa">Kelas XI-Bahasa</option>
              </optgroup>

              <optgroup label="Siswa Kelas XII">
                <option value="XII-MIPA 1">Kelas XII-MIPA 1</option>
                <option value="XII-MIPA 2">Kelas XII-MIPA 2</option>
                <option value="XII-MIPA 3">Kelas XII-MIPA 3</option>
                <option value="XII-IPS 1">Kelas XII-IPS 1</option>
                <option value="XII-IPS 2">Kelas XII-IPS 2</option>
                <option value="XII-IPS 3">Kelas XII-IPS 3</option>
              </optgroup>

              <optgroup label="Civitas Akademika & Umum">
                <option value="Guru / Tenaga Pendidik">Guru / Tenaga Pendidik</option>
                <option value="Staf Tata Usaha / Kependidikan">Staf Tata Usaha / Kependidikan</option>
                <option value="Alumni SMAN 11 Garut">Alumni SMAN 11 Garut</option>
                <option value="Tamu / Pengunjung Umum">Tamu / Pengunjung Umum</option>
              </optgroup>
            </select>

            <!-- Custom Chevron Down -->
            <span class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>

        <!-- Radio Button Jenis Kelamin -->
        <div>
          <label class="block text-xs md:text-sm font-semibold text-slate-700 mb-2">
            Jenis Kelamin
          </label>
          <div class="grid grid-cols-2 gap-3">
            <!-- Radio Laki-laki -->
            <label 
              :class="[
                'flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs md:text-sm font-medium cursor-pointer transition-all',
                formData.jenisKelamin === 'Laki-laki' 
                  ? 'border-[#0B6B82] bg-[#F2F9FA] text-[#0B6B82]' 
                  : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100/70'
              ]"
            >
              <input 
                type="radio" 
                name="jenisKelamin" 
                value="Laki-laki" 
                v-model="formData.jenisKelamin" 
                class="sr-only"
              />
              <span 
                :class="[
                  'w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all',
                  formData.jenisKelamin === 'Laki-laki' ? 'border-[#0B6B82] bg-white' : 'border-slate-300 bg-white'
                ]"
              >
                <span v-if="formData.jenisKelamin === 'Laki-laki'" class="w-2 h-2 rounded-full bg-[#0B6B82]"></span>
              </span>
              <span>Laki-laki</span>
            </label>

            <!-- Radio Perempuan -->
            <label 
              :class="[
                'flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs md:text-sm font-medium cursor-pointer transition-all',
                formData.jenisKelamin === 'Perempuan' 
                  ? 'border-[#0B6B82] bg-[#F2F9FA] text-[#0B6B82]' 
                  : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100/70'
              ]"
            >
              <input 
                type="radio" 
                name="jenisKelamin" 
                value="Perempuan" 
                v-model="formData.jenisKelamin" 
                class="sr-only"
              />
              <span 
                :class="[
                  'w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all',
                  formData.jenisKelamin === 'Perempuan' ? 'border-[#0B6B82] bg-white' : 'border-slate-300 bg-white'
                ]"
              >
                <span v-if="formData.jenisKelamin === 'Perempuan'" class="w-2 h-2 rounded-full bg-[#0B6B82]"></span>
              </span>
              <span>Perempuan</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 3. Pilihan Tujuan Kunjungan (Grid Cards) -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <label class="block text-xs md:text-sm font-semibold text-slate-700">
            Tujuan Kunjungan <span class="text-rose-500">*</span>
          </label>
          <span class="text-[11px] text-slate-400">Pilih aktivitas utama yang dilakukan</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <!-- Card 1: Membaca Buku -->
          <div
            @click="formData.tujuanKunjungan = 'Membaca Buku'"
            :class="[
              'p-3.5 rounded-xl border cursor-pointer transition-all relative flex flex-col justify-between',
              formData.tujuanKunjungan === 'Membaca Buku'
                ? 'border-[#0B6B82] bg-[#F2F9FA] shadow-xs ring-1 ring-[#0B6B82]'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            ]"
          >
            <div class="flex items-start justify-between mb-2">
              <div class="w-8 h-8 rounded-lg bg-sky-100/70 text-[#0B6B82] flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>

              <!-- Radio Indicator -->
              <span :class="['w-4 h-4 rounded-full border flex items-center justify-center', formData.tujuanKunjungan === 'Membaca Buku' ? 'border-[#0B6B82] bg-white' : 'border-slate-300']">
                <span v-if="formData.tujuanKunjungan === 'Membaca Buku'" class="w-2 h-2 rounded-full bg-[#0B6B82]"></span>
              </span>
            </div>
            <div>
              <h4 class="text-xs md:text-sm font-bold text-slate-800">Membaca Buku</h4>
              <p class="text-[11px] text-slate-500 mt-0.5 leading-tight">Koleksi cetak / e-book kurikulum</p>
            </div>
          </div>

          <!-- Card 2: Tugas & Diskusi -->
          <div
            @click="formData.tujuanKunjungan = 'Tugas & Diskusi'"
            :class="[
              'p-3.5 rounded-xl border cursor-pointer transition-all relative flex flex-col justify-between',
              formData.tujuanKunjungan === 'Tugas & Diskusi'
                ? 'border-[#0B6B82] bg-[#F2F9FA] shadow-xs ring-1 ring-[#0B6B82]'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            ]"
          >
            <div class="flex items-start justify-between mb-2">
              <div class="w-8 h-8 rounded-lg bg-sky-100/70 text-[#0B6B82] flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>

              <!-- Radio Indicator -->
              <span :class="['w-4 h-4 rounded-full border flex items-center justify-center', formData.tujuanKunjungan === 'Tugas & Diskusi' ? 'border-[#0B6B82] bg-white' : 'border-slate-300']">
                <span v-if="formData.tujuanKunjungan === 'Tugas & Diskusi'" class="w-2 h-2 rounded-full bg-[#0B6B82]"></span>
              </span>
            </div>
            <div>
              <h4 class="text-xs md:text-sm font-bold text-slate-800">Tugas & Diskusi</h4>
              <p class="text-[11px] text-slate-500 mt-0.5 leading-tight">Tugas kelompok, PR, resume materi</p>
            </div>
          </div>

          <!-- Card 3: Pinjam / Balik Buku -->
          <div
            @click="formData.tujuanKunjungan = 'Pinjam / Balik Buku'"
            :class="[
              'p-3.5 rounded-xl border cursor-pointer transition-all relative flex flex-col justify-between',
              formData.tujuanKunjungan === 'Pinjam / Balik Buku'
                ? 'border-[#0B6B82] bg-[#F2F9FA] shadow-xs ring-1 ring-[#0B6B82]'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            ]"
          >
            <div class="flex items-start justify-between mb-2">
              <div class="w-8 h-8 rounded-lg bg-sky-100/70 text-[#0B6B82] flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>

              <!-- Radio Indicator -->
              <span :class="['w-4 h-4 rounded-full border flex items-center justify-center', formData.tujuanKunjungan === 'Pinjam / Balik Buku' ? 'border-[#0B6B82] bg-white' : 'border-slate-300']">
                <span v-if="formData.tujuanKunjungan === 'Pinjam / Balik Buku'" class="w-2 h-2 rounded-full bg-[#0B6B82]"></span>
              </span>
            </div>
            <div>
              <h4 class="text-xs md:text-sm font-bold text-slate-800">Pinjam / Balik Buku</h4>
              <p class="text-[11px] text-slate-500 mt-0.5 leading-tight">Layanan sirkulasi ke meja petugas</p>
            </div>
          </div>

          <!-- Card 4: Riset Ilmiah / OSN -->
          <div
            @click="formData.tujuanKunjungan = 'Riset Ilmiah / OSN'"
            :class="[
              'p-3.5 rounded-xl border cursor-pointer transition-all relative flex flex-col justify-between',
              formData.tujuanKunjungan === 'Riset Ilmiah / OSN'
                ? 'border-[#0B6B82] bg-[#F2F9FA] shadow-xs ring-1 ring-[#0B6B82]'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            ]"
          >
            <div class="flex items-start justify-between mb-2">
              <div class="w-8 h-8 rounded-lg bg-sky-100/70 text-[#0B6B82] flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>

              <!-- Radio Indicator -->
              <span :class="['w-4 h-4 rounded-full border flex items-center justify-center', formData.tujuanKunjungan === 'Riset Ilmiah / OSN' ? 'border-[#0B6B82] bg-white' : 'border-slate-300']">
                <span v-if="formData.tujuanKunjungan === 'Riset Ilmiah / OSN'" class="w-2 h-2 rounded-full bg-[#0B6B82]"></span>
              </span>
            </div>
            <div>
              <h4 class="text-xs md:text-sm font-bold text-slate-800">Riset Ilmiah / OSN</h4>
              <p class="text-[11px] text-slate-500 mt-0.5 leading-tight">Karya tulis ilmiah & persiapan lomba</p>
            </div>
          </div>

          <!-- Card 5: Komputer Digital -->
          <div
            @click="formData.tujuanKunjungan = 'Komputer Digital'"
            :class="[
              'p-3.5 rounded-xl border cursor-pointer transition-all relative flex flex-col justify-between',
              formData.tujuanKunjungan === 'Komputer Digital'
                ? 'border-[#0B6B82] bg-[#F2F9FA] shadow-xs ring-1 ring-[#0B6B82]'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            ]"
          >
            <div class="flex items-start justify-between mb-2">
              <div class="w-8 h-8 rounded-lg bg-sky-100/70 text-[#0B6B82] flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              <!-- Radio Indicator -->
              <span :class="['w-4 h-4 rounded-full border flex items-center justify-center', formData.tujuanKunjungan === 'Komputer Digital' ? 'border-[#0B6B82] bg-white' : 'border-slate-300']">
                <span v-if="formData.tujuanKunjungan === 'Komputer Digital'" class="w-2 h-2 rounded-full bg-[#0B6B82]"></span>
              </span>
            </div>
            <div>
              <h4 class="text-xs md:text-sm font-bold text-slate-800">Komputer Digital</h4>
              <p class="text-[11px] text-slate-500 mt-0.5 leading-tight">Akses internet & jurnal berlangganan</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Input Catatan Keperluan / Judul Referensi Dicari -->
      <div>
        <label class="block text-xs md:text-sm font-semibold text-slate-700 mb-2">
          Catatan Keperluan / Judul Referensi Dicari
        </label>
        <div class="relative flex items-center">
          <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </span>

          <input
            v-model="formData.catatan"
            type="text"
            placeholder="Misal: Mencari Ensiklopedia Fisika Bab Termod"
            class="w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B6B82]/20 focus:border-[#0B6B82] focus:bg-white transition-all"
          />
        </div>
      </div>

      <!-- 5. Checkbox Komitmen Tata Tertib Ruang Baca -->
      <div class="p-4 rounded-xl bg-[#EFF8FA] border border-sky-100 flex items-start gap-3">
        <label class="relative flex items-center mt-0.5 cursor-pointer">
          <input
            type="checkbox"
            v-model="formData.setujuTataTertib"
            required
            class="w-4 h-4 text-[#0B6B82] bg-white border-slate-300 rounded focus:ring-[#0B6B82] focus:ring-2 cursor-pointer"
          />
        </label>
        <p class="text-xs text-slate-600 leading-relaxed">
          Saya berkomitmen menjaga ketertiban, menjaga keheningan ruang baca, tidak membawa makanan/minuman berlebih ke dekat rak buku, serta merawat fasilitas perpustakaan SMAN 11 Garut.
        </p>
      </div>

      <!-- 6. Tombol Aksi: Kosongkan Formulir & Konfirmasi Check-in -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <!-- Button Kosongkan Formulir -->
        <button
          type="button"
          @click="resetForm"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs md:text-sm font-semibold text-[#0B6B82] hover:text-[#085568] hover:bg-slate-50 rounded-xl transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Kosongkan Formulir</span>
        </button>

        <!-- Button Konfirmasi Check-in Pengunjung -->
        <button
          type="submit"
          :disabled="!isFormValid"
          :class="[
            'w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-xs md:text-sm text-white transition-all shadow-xs',
            isFormValid 
              ? 'bg-[#0B6B82] hover:bg-[#085568] cursor-pointer' 
              : 'bg-slate-300 cursor-not-allowed opacity-80'
          ]"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>Konfirmasi Check-in Pengunjung</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['checkin-success'])

// State formulir reaktif
const formData = ref({
  nama: '',
  kelas: '',
  jenisKelamin: 'Laki-laki',
  tujuanKunjungan: 'Membaca Buku', // Default aktif seperti di gambar Figma
  catatan: '',
  setujuTataTertib: true // Default true agar langsung siap
})

const successNotification = ref(false)

// Validasi Form
const isFormValid = computed(() => {
  return (
    formData.value.nama.trim().length > 1 &&
    formData.value.kelas !== '' &&
    formData.value.tujuanKunjungan !== '' &&
    formData.value.setujuTataTertib === true
  )
})

// Reset formulir
const resetForm = () => {
  formData.value = {
    nama: '',
    kelas: '',
    jenisKelamin: 'Laki-laki',
    tujuanKunjungan: 'Membaca Buku',
    catatan: '',
    setujuTataTertib: false
  }
}

// Submit Check-in
const handleSubmit = () => {
  if (!isFormValid.value) return

  const payload = {
    ...formData.value,
    timestamp: new Date().toISOString()
  }

  // Emit data ke parent (PresensiPage) untuk menambahkan ke list Pengunjung Terkini & update counter
  emit('checkin-success', payload)

  successNotification.value = true
  setTimeout(() => {
    successNotification.value = false
  }, 4000)

  // Reset nama & catatan untuk pengunjung berikutnya, pertahankan kelas/tujuan default
  formData.value.nama = ''
  formData.value.catatan = ''
}
</script>

<style scoped>
/* Styling form presensi */
</style>
