import { useEffect, useState, useMemo } from 'react'
import { Bike, ClipboardList, CreditCard, TrendingUp } from 'lucide-react'
import { motorApi } from '@/api/motors'
import { bookingApi } from '@/api/bookings'
import { formatIDR } from '@/utils/formatCurrency'

const thisMonth = new Date().toISOString().slice(0, 7)

const STATUS_LABEL = {
  PENDING:   { label: 'Menunggu',   color: 'bg-yellow-50 text-yellow-600' },
  ACTIVE:    { label: 'Aktif',      color: 'bg-green-50 text-green-600' },
  COMPLETED: { label: 'Selesai',    color: 'bg-blue-50 text-blue-600' },
  CANCELLED: { label: 'Dibatalkan', color: 'bg-red-50 text-red-500' },
}

const PAY_LABEL = {
  UNPAID:   { label: 'Belum Bayar',    color: 'bg-red-50 text-red-500' },
  PAID:     { label: 'Lunas',          color: 'bg-green-50 text-green-600' },
  REFUNDED: { label: 'Dikembalikan',   color: 'bg-gray-100 text-gray-500' },
}

const STATUS_BAR = [
  { key: 'ACTIVE',    label: 'Aktif',      bar: 'bg-green-400' },
  { key: 'PENDING',   label: 'Menunggu',   bar: 'bg-yellow-400' },
  { key: 'COMPLETED', label: 'Selesai',    bar: 'bg-blue-400' },
  { key: 'CANCELLED', label: 'Dibatalkan', bar: 'bg-red-300' },
]

function last6Months() {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - (5 - i))
    return {
      key: d.toISOString().slice(0, 7),
      label: d.toLocaleDateString('id-ID', { month: 'short' }),
    }
  })
}

export default function AdminDashboard() {
  const [motors, setMotors] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([motorApi.getAll(), bookingApi.getAll()])
      .then(([mResult, bResult]) => {
        if (mResult.status === 'fulfilled') setMotors(mResult.value)
        if (bResult.status === 'fulfilled') setBookings(bResult.value)
      })
      .finally(() => setLoading(false))
  }, [])

  const availableMotors = motors.filter((v) => v.available).length
  const activeBookings = bookings.filter(
    (b) => b.createdAt?.startsWith(thisMonth) && b.status !== 'CANCELLED'
  ).length
  const unpaidBookings = bookings.filter((b) => b.paymentStatus === 'UNPAID').length
  const revenue = bookings
    .filter((b) => b.paymentStatus === 'PAID' && b.createdAt?.startsWith(thisMonth))
    .reduce((sum, b) => sum + b.totalPrice, 0)

  const STAT_CARDS = [
    { label: 'Total Motor',         value: motors.length,    sub: `${availableMotors} tersedia`,      icon: Bike,          color: 'text-gold' },
    { label: 'Booking Bulan Ini',   value: activeBookings,   sub: 'transaksi',                        icon: ClipboardList, color: 'text-blue-500' },
    { label: 'Menunggu Bayar',      value: unpaidBookings,   sub: 'perlu konfirmasi',                 icon: CreditCard,    color: 'text-red-400' },
    { label: 'Pendapatan Bulan Ini',value: formatIDR(revenue),sub: 'dari transaksi lunas',            icon: TrendingUp,    color: 'text-green-500' },
  ]

  const months = last6Months()
  const revenueByMonth = useMemo(() => months.map(({ key, label }) => ({
    label,
    value: bookings
      .filter(b => b.paymentStatus === 'PAID' && b.createdAt?.startsWith(key))
      .reduce((sum, b) => sum + b.totalPrice, 0),
  })), [bookings])

  const maxRevenue = Math.max(...revenueByMonth.map(m => m.value), 1)

  const statusCounts = useMemo(() => {
    const total = bookings.length || 1
    return STATUS_BAR.map(s => ({
      ...s,
      count: bookings.filter(b => b.status === s.key).length,
      pct: Math.round((bookings.filter(b => b.status === s.key).length / total) * 100),
    }))
  }, [bookings])

  const recentBookings = [...bookings]
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .slice(0, 5)

  const motorStats = useMemo(() => {
    const map = {}
    bookings.forEach(b => {
      if (b.status === 'CANCELLED') return
      if (!map[b.motorId]) map[b.motorId] = { name: b.motorName, bookingCount: 0, revenue: 0 }
      map[b.motorId].bookingCount++
      if (b.paymentStatus === 'PAID') map[b.motorId].revenue += b.totalPrice
    })
    return Object.values(map).sort((a, b) => b.revenue - a.revenue)
  }, [bookings])

  return (
    <div className="p-7">
      <div className="mb-7">
        <h1 className="text-xl font-bold text-charcoal">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Selamat datang di panel admin Benz Rental Bali</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {STAT_CARDS.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-5">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-7 bg-gray-100 rounded w-1/2" />
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs font-medium text-gray-400">{label}</p>
                  <Icon size={18} className={color} />
                </div>
                <p className="text-2xl font-bold text-charcoal mb-0.5">{value}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[3fr_2fr] gap-5 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm font-bold text-charcoal mb-1">Pendapatan 6 Bulan Terakhir</p>
          <p className="text-xs text-gray-400 mb-5">Dari transaksi lunas</p>
          {loading ? (
            <div className="h-32 animate-pulse bg-gray-50 rounded-lg" />
          ) : (
            <div className="flex items-end gap-2 h-32">
              {revenueByMonth.map(({ label, value }) => (
                <div key={label} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col justify-end" style={{ height: '96px' }}>
                    <div
                      title={formatIDR(value)}
                      className="w-full rounded-t-sm transition-all duration-500"
                      style={{
                        height: `${Math.max((value / maxRevenue) * 100, value > 0 ? 5 : 0)}%`,
                        background: value > 0 ? '#C9A24B' : '#f3f4f6',
                        minHeight: value > 0 ? '4px' : '0',
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm font-bold text-charcoal mb-1">Status Booking</p>
          <p className="text-xs text-gray-400 mb-5">Semua waktu · {bookings.length} total</p>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4].map(i => <div key={i} className="h-8 animate-pulse bg-gray-50 rounded" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {statusCounts.map(({ key, label, bar, count, pct }) => (
                <div key={key}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-semibold text-charcoal">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-5">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="text-sm font-bold text-charcoal">Performa per Motor</h2>
          <p className="text-xs text-gray-400 mt-0.5">Booking aktif/selesai · pendapatan lunas</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                {['Motor', 'Booking', 'Pendapatan Lunas'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-400">Memuat data...</td></tr>
              ) : motorStats.length === 0 ? (
                <tr><td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-400">Belum ada data.</td></tr>
              ) : motorStats.map(m => (
                <tr key={m.name} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-charcoal whitespace-nowrap">{m.name}</td>
                  <td className="px-4 py-3 text-gray-600">{m.bookingCount}</td>
                  <td className="px-4 py-3 font-semibold text-charcoal whitespace-nowrap">{formatIDR(m.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="text-sm font-bold text-charcoal">Booking Terbaru</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                {['ID', 'Motor', 'Pelanggan', 'Tanggal', 'Total', 'Bayar', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">Memuat data...</td>
                </tr>
              ) : recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">Belum ada booking.</td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{b.id}</td>
                    <td className="px-4 py-3 font-medium text-charcoal whitespace-nowrap">{b.motorName}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{b.customerName}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                      {b.startDate} – {b.endDate}
                    </td>
                    <td className="px-4 py-3 font-semibold text-charcoal whitespace-nowrap">
                      {formatIDR(b.totalPrice)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${(PAY_LABEL[b.paymentStatus] || PAY_LABEL.UNPAID).color}`}>
                        {(PAY_LABEL[b.paymentStatus] || PAY_LABEL.UNPAID).label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${(STATUS_LABEL[b.status] || STATUS_LABEL.PENDING).color}`}>
                        {(STATUS_LABEL[b.status] || STATUS_LABEL.PENDING).label}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
