import { useState, useEffect, useMemo } from 'react'
import {
  MessageCircle, Search, Loader2, CheckCircle, XCircle,
  Clock, Trash2, Eye, X, Users, Calendar, FileText,
  ClipboardList, Download, AlertTriangle, RotateCcw,
} from 'lucide-react'
import { toast } from 'sonner'
import { tourBookingApi } from '@/api/tours'
import { formatIDR } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import { waLink } from '@/constants/contact'

const STATUS_CONFIG = {
  PENDING:   { label: 'Menunggu',     color: 'bg-yellow-50 text-yellow-600', icon: Clock },
  CONFIRMED: { label: 'Dikonfirmasi', color: 'bg-green-50 text-green-600',   icon: CheckCircle },
  CANCELLED: { label: 'Dibatalkan',   color: 'bg-red-50 text-red-500',       icon: XCircle },
}

const FILTER_TABS = [
  { key: 'all',       label: 'Semua' },
  { key: 'PENDING',   label: 'Menunggu' },
  { key: 'CONFIRMED', label: 'Dikonfirmasi' },
  { key: 'CANCELLED', label: 'Dibatalkan' },
]

const CATEGORY_LABELS = {
  CULTURAL: 'Budaya',
  NATURE:   'Alam',
  SUNRISE:  'Sunrise',
  BEACH:    'Pantai',
}

function buildWAConfirm(booking) {
  return `Halo ${booking.customerName}, booking tour Anda sudah dikonfirmasi!\n\nTour: ${booking.tour?.name ?? '-'}\nTanggal: ${booking.tourDate}\nPeserta: ${booking.participants} orang\nTotal: ${formatIDR(booking.totalPrice)}\n\nKami akan menghubungi Anda untuk detail pick-up. Terima kasih sudah memilih Benz Rental Bali!`
}

// Teks label dan warna untuk modal konfirmasi
const ACTION_CONFIG = {
  CONFIRMED: {
    title: 'Konfirmasi Booking',
    desc: (b) => `Konfirmasi booking tour dari ${b.customerName} untuk "${b.tour?.name ?? '—'}"?`,
    btnLabel: 'Ya, Konfirmasi',
    btnClass: 'bg-green-500 hover:bg-green-600 text-white',
    iconClass: 'bg-green-50',
    icon: CheckCircle,
    iconColor: 'text-green-500',
  },
  CANCELLED: {
    title: 'Batalkan / Tolak Booking',
    desc: (b) => `Yakin ingin membatalkan booking dari ${b.customerName} untuk "${b.tour?.name ?? '—'}"?`,
    btnLabel: 'Ya, Batalkan',
    btnClass: 'bg-red-500 hover:bg-red-600 text-white',
    iconClass: 'bg-red-50',
    icon: XCircle,
    iconColor: 'text-red-400',
  },
  PENDING: {
    title: 'Buka Kembali Booking',
    desc: (b) => `Buka kembali booking dari ${b.customerName} untuk "${b.tour?.name ?? '—'}"? Status akan kembali ke Menunggu dan perlu dikonfirmasi ulang.`,
    btnLabel: 'Ya, Buka Kembali',
    btnClass: 'bg-charcoal hover:bg-gold text-white',
    iconClass: 'bg-gray-50',
    icon: RotateCcw,
    iconColor: 'text-gray-500',
  },
}

export default function AdminTourBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  // State untuk confirmation modal status update
  const [confirmAction, setConfirmAction] = useState(null) // { booking, newStatus }
  const [updatingId, setUpdatingId] = useState(null)

  // State untuk delete
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // State untuk detail modal
  const [detailBooking, setDetailBooking] = useState(null)

  const load = () => {
    setLoading(true)
    tourBookingApi.getAll().then(setBookings).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    return bookings.filter(b => {
      const matchFilter = filter === 'all' || b.status === filter
      const q = search.toLowerCase()
      const matchSearch = !q ||
        b.customerName?.toLowerCase().includes(q) ||
        b.customerPhone?.includes(q) ||
        b.tour?.name?.toLowerCase().includes(q)
      return matchFilter && matchSearch
    })
  }, [bookings, filter, search])

  const counts = useMemo(() => ({
    all:       bookings.length,
    PENDING:   bookings.filter(b => b.status === 'PENDING').length,
    CONFIRMED: bookings.filter(b => b.status === 'CONFIRMED').length,
    CANCELLED: bookings.filter(b => b.status === 'CANCELLED').length,
  }), [bookings])

  // Eksekusi perubahan status setelah user konfirmasi di modal
  const executeStatusUpdate = async () => {
    if (!confirmAction) return
    const { booking, newStatus } = confirmAction
    setConfirmAction(null)
    setUpdatingId(booking.id)
    try {
      await tourBookingApi.updateStatus(booking.id, newStatus)
      // Optimistic update — langsung ubah state lokal tanpa reload
      setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: newStatus } : b))
      toast.success(
        newStatus === 'CONFIRMED'
          ? 'Booking berhasil dikonfirmasi.'
          : 'Booking berhasil dibatalkan.'
      )
    } catch {
      toast.error('Gagal mengubah status. Silakan coba lagi.')
      load() // Sinkronkan ulang jika gagal
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await tourBookingApi.delete(deleteId)
      setBookings(prev => prev.filter(b => b.id !== deleteId))
      setDeleteId(null)
      toast.success('Booking tour berhasil dihapus.')
    } catch {
      toast.error('Gagal menghapus booking.')
    } finally {
      setDeleting(false)
    }
  }

  const exportCSV = () => {
    const headers = ['ID', 'Tour', 'Tanggal Tour', 'Peserta', 'Pelanggan', 'No HP', 'Total', 'Status', 'Catatan', 'Diterima']
    const rows = filtered.map(b => [
      b.id, b.tour?.name ?? '', b.tourDate, b.participants,
      b.customerName, b.customerPhone, b.totalPrice,
      b.status, b.notes ?? '', b.createdAt ?? '',
    ])
    const csv = [headers, ...rows]
      .map(row => row.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\r\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tour-bookings-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`${filtered.length} data booking tour diekspor.`)
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-charcoal">Booking Tour</h1>
          <p className="text-sm text-gray-500 mt-0.5">{bookings.length} total booking</p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 border border-gray-200 text-gray-500 text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download size={15} />
          Export CSV
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 bg-white border border-gray-100 rounded-lg p-1 w-fit">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded transition-colors ${
              filter === tab.key ? 'bg-charcoal text-white' : 'text-gray-400 hover:text-charcoal'
            }`}
          >
            {tab.label} ({counts[tab.key] ?? 0})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari nama, HP, atau nama tour..."
          className="w-full pl-8 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 whitespace-nowrap">Tour</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 whitespace-nowrap">Pelanggan</th>
                <th className="hidden sm:table-cell text-left px-4 py-3 text-xs font-semibold text-gray-400 whitespace-nowrap">No HP</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 whitespace-nowrap">Tgl Tour</th>
                <th className="hidden sm:table-cell text-left px-4 py-3 text-xs font-semibold text-gray-400 whitespace-nowrap">Peserta</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 whitespace-nowrap">Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 whitespace-nowrap">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 whitespace-nowrap">Aksi</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {['w-32','w-24','w-24','w-20','w-10','w-20','w-20','w-28','w-16'].map((w, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className={`h-3.5 ${w} bg-gray-100 animate-pulse rounded`} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-14 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center">
                        {search.trim()
                          ? <Search size={22} className="text-gray-300" />
                          : <ClipboardList size={22} className="text-gray-300" />}
                      </div>
                      <div>
                        {search.trim() ? (
                          <>
                            <p className="text-sm font-semibold text-gray-400 mb-1">
                              Tidak ada hasil untuk &ldquo;{search}&rdquo;
                            </p>
                            <p className="text-xs text-gray-300">Coba kata kunci lain atau hapus pencarian</p>
                          </>
                        ) : bookings.length === 0 ? (
                          <>
                            <p className="text-sm font-semibold text-gray-400 mb-1">Belum ada booking tour</p>
                            <p className="text-xs text-gray-300">Booking baru akan muncul di sini setelah pelanggan memesan</p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-semibold text-gray-400 mb-1">Tidak ada booking dengan status ini</p>
                            <p className="text-xs text-gray-300">Coba lihat semua booking atau pilih status lain</p>
                          </>
                        )}
                      </div>
                      {search.trim() ? (
                        <button
                          onClick={() => setSearch('')}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold border border-gray-200 text-gray-500 px-4 py-2 rounded-lg hover:border-gold hover:text-gold transition-colors mt-1"
                        >
                          <X size={12} /> Hapus Pencarian
                        </button>
                      ) : filter !== 'all' && (
                        <button
                          onClick={() => setFilter('all')}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold border border-gray-200 text-gray-500 px-4 py-2 rounded-lg hover:border-gold hover:text-gold transition-colors mt-1"
                        >
                          Lihat Semua Booking
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : filtered.map(b => {
                const cfg = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.PENDING
                const isUpdating = updatingId === b.id
                return (
                  <tr key={b.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-charcoal text-sm whitespace-nowrap">{b.tour?.name ?? '—'}</p>
                      {b.tour?.category && (
                        <p className="text-[10px] text-gray-400">{CATEGORY_LABELS[b.tour.category]}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{b.customerName}</td>
                    <td className="hidden sm:table-cell px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{b.customerPhone}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{b.tourDate}</td>
                    <td className="hidden sm:table-cell px-4 py-3 text-gray-600 text-xs">{b.participants} orang</td>
                    <td className="px-4 py-3 font-semibold text-charcoal whitespace-nowrap">{formatIDR(b.totalPrice)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded ${cfg.color}`}>
                        <cfg.icon size={10} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {b.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => setConfirmAction({ booking: b, newStatus: 'CONFIRMED' })}
                              disabled={isUpdating}
                              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-green-50 text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50"
                            >
                              {isUpdating
                                ? <Loader2 size={10} className="animate-spin" />
                                : <CheckCircle size={10} />}
                              Konfirmasi
                            </button>
                            <button
                              onClick={() => setConfirmAction({ booking: b, newStatus: 'CANCELLED' })}
                              disabled={isUpdating}
                              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                              {isUpdating
                                ? <Loader2 size={10} className="animate-spin" />
                                : <XCircle size={10} />}
                              Tolak
                            </button>
                          </>
                        )}
                        {b.status === 'CONFIRMED' && (
                          <button
                            onClick={() => setConfirmAction({ booking: b, newStatus: 'CANCELLED' })}
                            disabled={isUpdating}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            {isUpdating
                              ? <Loader2 size={10} className="animate-spin" />
                              : <XCircle size={10} />}
                            Batalkan
                          </button>
                        )}
                        {b.status === 'CANCELLED' && (
                          <button
                            onClick={() => setConfirmAction({ booking: b, newStatus: 'PENDING' })}
                            disabled={isUpdating}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-50"
                          >
                            {isUpdating
                              ? <Loader2 size={10} className="animate-spin" />
                              : <RotateCcw size={10} />}
                            Buka Kembali
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setDetailBooking(b)}
                          className="p-1.5 rounded text-gray-400 hover:text-charcoal hover:bg-gray-100 transition-colors"
                          title="Lihat detail"
                        >
                          <Eye size={14} />
                        </button>
                        <a
                          href={waLink(buildWAConfirm(b))}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded text-gray-400 hover:text-[#25D366] hover:bg-green-50 transition-colors"
                          title="WhatsApp pelanggan"
                        >
                          <MessageCircle size={14} />
                        </a>
                        <button
                          onClick={() => setDeleteId(b.id)}
                          className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-red-50 transition-colors"
                          title="Hapus booking"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="sm:hidden text-xs text-gray-400 mt-2 text-center">
        Tap ikon <span className="font-semibold">👁</span> untuk detail lengkap · Geser tabel untuk kolom lainnya
      </p>

      {/* ── Confirmation Modal (Konfirmasi / Tolak / Batalkan) ── */}
      {confirmAction && (() => {
        const ac = ACTION_CONFIG[confirmAction.newStatus]
        const ActionIcon = ac.icon
        return (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-6">
              <div className={`w-12 h-12 ${ac.iconClass} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <ActionIcon size={22} className={ac.iconColor} />
              </div>
              <h3 className="font-bold text-charcoal text-center mb-2">{ac.title}</h3>
              <p className="text-sm text-gray-500 text-center mb-1">
                {ac.desc(confirmAction.booking)}
              </p>
              <div className="text-xs text-gray-400 text-center mb-6 space-y-0.5">
                <p>{confirmAction.booking.tourDate} · {confirmAction.booking.participants} orang</p>
                <p className="font-semibold text-gold">{formatIDR(confirmAction.booking.totalPrice)}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 text-sm font-medium text-gray-600 border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={executeStatusUpdate}
                  className={`flex-1 text-sm font-semibold py-2.5 rounded-lg transition-colors ${ac.btnClass}`}
                >
                  {ac.btnLabel}
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-6 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-400" />
            </div>
            <h3 className="font-bold text-charcoal mb-2">Hapus Booking Tour?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Data booking ini akan dihapus secara permanen dan tidak bisa dikembalikan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="flex-1 text-sm font-medium text-gray-600 border border-gray-200 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 text-sm font-semibold bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                {deleting && <Loader2 size={13} className="animate-spin" />}
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail Modal ── */}
      {detailBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-charcoal">Detail Booking Tour</h2>
              <button onClick={() => setDetailBooking(null)} className="text-gray-400 hover:text-charcoal transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="bg-gold/5 border border-gold/15 rounded-xl px-4 py-3">
                <p className="text-[10px] text-gold font-black uppercase tracking-widest mb-1">Tour</p>
                <p className="font-bold text-charcoal">{detailBooking.tour?.name ?? '—'}</p>
                {detailBooking.tour?.category && (
                  <p className="text-xs text-gray-400 mt-0.5">{CATEGORY_LABELS[detailBooking.tour.category]}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Calendar, label: 'Tanggal Tour',  value: detailBooking.tourDate },
                  { icon: Users,    label: 'Peserta',       value: `${detailBooking.participants} orang` },
                  { icon: null,     label: 'Pelanggan',     value: detailBooking.customerName },
                  { icon: null,     label: 'No HP',         value: detailBooking.customerPhone },
                  { icon: null,     label: 'Total',         value: formatIDR(detailBooking.totalPrice), bold: true },
                  { icon: null,     label: 'Diterima',      value: detailBooking.createdAt ? formatDate(detailBooking.createdAt) : '—' },
                ].map(({ icon: Icon, label, value, bold }) => (
                  <div key={label}>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                      {Icon && <Icon size={10} className="text-gold" />}
                      {label}
                    </p>
                    <p className={`text-sm ${bold ? 'font-bold text-gold' : 'font-semibold text-charcoal'}`}>{value}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">Status</p>
                {(() => {
                  const cfg = STATUS_CONFIG[detailBooking.status] ?? STATUS_CONFIG.PENDING
                  return (
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
                      <cfg.icon size={11} />
                      {cfg.label}
                    </span>
                  )
                })()}
              </div>

              {detailBooking.notes && (
                <div className="flex items-start gap-2 bg-off-white rounded-lg px-3 py-2.5">
                  <FileText size={13} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Catatan</p>
                    <p className="text-xs text-gray-600">{detailBooking.notes}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <a
                href={waLink(buildWAConfirm(detailBooking))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                style={{ background: '#25D366' }}
              >
                <MessageCircle size={15} />
                WhatsApp Pelanggan
              </a>
              <button
                onClick={() => setDetailBooking(null)}
                className="px-4 text-sm font-semibold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
