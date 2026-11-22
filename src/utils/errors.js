// Pesan error dalam Bahasa Indonesia berdasarkan `code` dari backend (frontend-guide §7.1)
export const ERROR_MESSAGES = {
  VALIDATION_FAILED: 'Beberapa isian belum valid. Periksa kembali formulir.',
  INVALID_CREDENTIALS: 'Nama pengguna atau kata sandi salah.',
  ACCOUNT_TEMPORARILY_LOCKED: 'Terlalu banyak percobaan masuk. Akun dikunci sementara.',
  INVALID_OLD_PASSWORD: 'Kata sandi lama salah.',
  SAME_PASSWORD: 'Kata sandi baru harus berbeda dari kata sandi lama.',
  FILE_REQUIRED: 'Berkas wajib dipilih.',
  INVALID_FILE_TYPE: 'Jenis berkas tidak didukung.',
  DUPLICATE_FILE: 'Berkas ini sudah ada di perpustakaan (mungkin berada di tempat sampah, hubungi pustakawan).',
  DUPLICATE_USERNAME: 'Nama pengguna sudah dipakai.',
  DUPLICATE_CATEGORY: 'Nama kategori sudah ada.',
  CATEGORY_IN_USE: 'Pindahkan dulu item dari kategori ini.',
  INVALID_PARENT: 'Kategori induk tidak valid.',
  CANNOT_DEACTIVATE_SELF: 'Anda tidak dapat menonaktifkan akun sendiri.',
  CANNOT_DEACTIVATE_LAST_LIBRARIAN: 'Pustakawan aktif terakhir tidak dapat dinonaktifkan.',
  IMPORT_ALREADY_RUNNING: 'Impor lain sedang berjalan.',
  IMPORT_CSV_NOT_FOUND: 'Berkas CSV impor tidak ditemukan di folder server.',
  IMPORT_DIR_NOT_CONFIGURED: 'Folder impor belum dikonfigurasi di server.',
  IMPORT_QUEUE_FULL: 'Antrean impor penuh, coba lagi nanti.',
  UNAUTHORIZED: 'Sesi Anda telah berakhir, silakan masuk kembali.',
  FORBIDDEN: 'Anda tidak memiliki akses untuk tindakan ini.',
  NOT_FOUND: 'Data tidak ditemukan.',
  STORAGE_FULL: 'Penyimpanan server penuh, hubungi pustakawan.',
  STORAGE_UNAVAILABLE: 'Berkas sementara tidak tersedia.',
  STORAGE_WRITE_FAILED: 'Terjadi kesalahan, silakan coba lagi.',
  INTERNAL_ERROR: 'Terjadi kesalahan, silakan coba lagi.',
  // Kode fallback dari client.js
  FILE_TOO_LARGE: 'Berkas terlalu besar.',
  SERVER_UNREACHABLE: 'Tidak dapat terhubung ke server perpustakaan. Periksa Wi-Fi sekolah.',
  NETWORK_ERROR: 'Tidak dapat terhubung ke server perpustakaan. Periksa Wi-Fi sekolah.',
  UNKNOWN_ERROR: 'Terjadi kesalahan, silakan coba lagi.',
  // Dibatalkan pengguna (upload.js); tidak ditampilkan
  ABORTED: ''
}

// Kode error yang ditampilkan pada pemilih berkas, bukan sebagai alert formulir
export const FILE_ERROR_CODES = new Set(['FILE_REQUIRED', 'INVALID_FILE_TYPE', 'DUPLICATE_FILE', 'FILE_TOO_LARGE'])

// Kode yang pesannya lebih informatif dari server (mis. lama waktu tunggu)
const USE_SERVER_MESSAGE = new Set(['ACCOUNT_TEMPORARILY_LOCKED'])

export function errorMessage(err) {
  if (!err) return ERROR_MESSAGES.UNKNOWN_ERROR
  if (USE_SERVER_MESSAGE.has(err.code) && err.message) return err.message
  return ERROR_MESSAGES[err.code] ?? ERROR_MESSAGES.UNKNOWN_ERROR
}
