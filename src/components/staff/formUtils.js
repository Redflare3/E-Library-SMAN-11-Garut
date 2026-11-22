// Utilitas kecil bersama untuk formulir unggah/edit staf

// Kelas <select>/<textarea> yang sama dengan BaseInput
export function selectClass(error) {
  return [
    'w-full rounded-xl border bg-white text-sm text-slate-800 px-3.5 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B6B82]/30 focus:border-[#0B6B82] disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
    error ? 'border-rose-300' : 'border-slate-200 hover:border-slate-300'
  ]
}

// Server menganggap null/kosong = "tidak diubah", jadi field tidak bisa dikosongkan (frontend-guide §6.4)
export const CLEAR_WARNING =
  'Kolom ini tidak dapat dikosongkan. Isi dengan nilai baru atau kembalikan seperti semula.'

export function toText(value) {
  return value === null || value === undefined ? '' : String(value)
}
