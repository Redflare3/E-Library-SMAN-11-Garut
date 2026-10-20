// ============================================
// Mock Data — Presensi Pengunjung Page
// ============================================

export const recentVisitors = [
  {
    id: 1,
    initials: 'AN',
    name: 'Anisa Nurul Hidayah',
    class: 'X-3',
    activity: 'Riset KTI Biologi',
    location: 'Ruang Baca Utama',
    timeAgo: '1 mnt lalu',
    color: 'bg-teal-600',
  },
  {
    id: 2,
    initials: 'RP',
    name: 'Rafi Pratama Yudha',
    class: 'XI-MIPA 1',
    activity: 'E-Book Kimia',
    location: 'Bilik Multimedia PC',
    timeAgo: '4 mnt lalu',
    color: 'bg-orange-500',
  },
  {
    id: 3,
    initials: 'DA',
    name: 'Dra. Hj. Neneng Rohaeti',
    class: 'Guru',
    activity: 'Bahasa Sunda • Pengembalian',
    location: 'Meja Sirkulasi',
    timeAgo: '8 mnt lalu',
    color: 'bg-indigo-600',
  },
  {
    id: 4,
    initials: 'ZS',
    name: 'Zahra Salsabila',
    class: 'XI-IPS 3',
    activity: 'Tugas Sejarah',
    location: 'Pojok Diskusi Literasi',
    timeAgo: '12 mnt lalu',
    color: 'bg-cyan-600',
  },
]

export const visitPurposes = [
  {
    id: 'membaca',
    icon: 'BookOpen',
    label: 'Membaca Buku',
    description: 'Koleksi cetak / e-book kurikulum',
  },
  {
    id: 'tugas',
    icon: 'Users',
    label: 'Tugas & Diskusi',
    description: 'Tugas kelompok, PR, resume materi',
  },
  {
    id: 'pinjam',
    icon: 'ArrowLeftRight',
    label: 'Pinjam / Balik Buku',
    description: 'Layanan sirkulasi ke meja petugas',
  },
  {
    id: 'riset',
    icon: 'FlaskConical',
    label: 'Riset Ilmiah / OSN',
    description: 'Karya tulis ilmiah & persiapan lomba',
  },
  {
    id: 'komputer',
    icon: 'Monitor',
    label: 'Komputer Digital',
    description: 'Akses internet & jurnal berlangganan',
  },
]

export const librarianInfo = {
  initials: 'SR',
  name: 'Ibu Siti Rahmah, S.I. Pust.',
  role: 'Pustakawan SMAN 11 Garut',
  rules: [
    'Wajib scan barcode/masukkan NIS saat memasuki perpustakaan.',
    'Buku yang selesai dibaca diletakkan di troli pengembalian.',
    'Maksimal peminjaman: 3 eksemplar selama 7 hari kalender.',
  ],
}

export const navMenuItems = [
  { label: 'Katalog Buku', href: '/katalog', active: false },
  { label: 'Cari & Filter Kategori', href: '/filter', active: false },
  { label: 'Arsip & Berita', href: '/arsip', active: false },
  { label: 'Presensi', href: '/presensi', active: true },
  { label: 'Statistik', href: '/statistik', active: false },
]

export const footerData = {
  description:
    'Perpustakaan Digital SMAN 11 Garut menyediakan akses mudah, terbuka, dan terpadu ke ribuan literatur akademik, buku teks kurikulum merdeka, karya tulis siswa, serta jurnal digital penunjang prestasi sekolah.',
  npp: '3205001200001',
  akreditasi: 'Akreditasi A',
  address:
    'Jl. Siliwangi No. 11, Kel. Regol, Kec. Garut Kota, Kabupaten Garut, Jawa Barat 44111',
  phone: '(0262) 231189 / 0812-2111-9876',
  email: 'perpustakaan@sman11garut.sch.id',
  librarian: 'Pustakawan Relawan: Ibu Siti Rahmah, S.I.Pust.',
  schedule: [
    { day: 'Senin – Kamis', hours: '07.15 – 15.30 WIB' },
    { day: 'Jumat', hours: '07.15 – 11.30 WIB' },
    { day: 'Sabtu (Ekskul/Literasi)', hours: '08.00 – 12.00 WIB' },
    { day: 'Minggu & Libur Nasional', hours: 'Tutup', closed: true },
  ],
  quickLinks: [
    'Katalog Buku',
    'Cari & Filter Kategori',
    'Arsip & Berita',
    'Presensi Pengunjung',
    'Statistik Pengunjung',
    'Portal Masuk Petugas',
  ],
}
