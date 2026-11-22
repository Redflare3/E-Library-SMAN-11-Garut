import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  Filler,
  Tooltip
} from 'chart.js'

// Daftarkan sekali saja komponen Chart.js yang dipakai halaman Statistik
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  Filler,
  Tooltip
)

// Warna seri (teal tervalidasi: kroma & kontras ≥ 3:1 terhadap latar putih). Teks tetap memakai tinta netral.
export const CHART_COLORS = {
  series: '#0A7EA0',
  seriesFill: 'rgba(10, 126, 160, 0.10)',
  surface: '#ffffff',
  grid: '#eef2f6',
  axis: '#94a3b8',
  text: '#475569'
}

const numberFormat = new Intl.NumberFormat('id-ID')

// Opsi dasar: tanpa legenda (satu seri), grid & sumbu redup, tooltip angka id-ID
export function baseOptions({ yTitle } = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    interaction: { mode: 'index', intersect: false },
    layout: { padding: { top: 8, right: 8 } },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        titleFont: { family: 'inherit', size: 11, weight: '600' },
        bodyFont: { family: 'inherit', size: 12 },
        callbacks: {
          label: (ctx) => `${numberFormat.format(ctx.parsed.y)}${yTitle ? ` ${yTitle}` : ''}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { color: CHART_COLORS.grid },
        ticks: { color: CHART_COLORS.axis, font: { size: 11 } }
      },
      y: {
        beginAtZero: true,
        grid: { color: CHART_COLORS.grid },
        border: { display: false },
        ticks: {
          color: CHART_COLORS.axis,
          font: { size: 11 },
          precision: 0,
          callback: (v) => numberFormat.format(v)
        }
      }
    }
  }
}
