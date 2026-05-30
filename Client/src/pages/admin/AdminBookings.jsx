import { useState, useEffect, useMemo } from 'react'
import { X, Plus, Search, Download, Eye, MessageCircle, MapPin, FileText, Loader2, Pencil } from 'lucide-react'
import { bookingApi } from '@/api/bookings'
import { motorApi } from '@/api/motors'
import { formatIDR } from '@/utils/formatCurrency'
import { calculateBookingPrice, getPriceBreakdown } from '@/utils/pricingEngine'
import { waLink } from '@/constants/contact'

const BOOKING_STATUS = {
  PENDING: { label: 'Menunggu', color: 'bg-yellow-50 text-yellow-600' },
  ACTIVE: { label: 'Aktif', color: 'bg-green-50 text-green-600' },
  COMPLETED: { label: 'Selesai', color: 'bg-blue-50 text-blue-600' },
  CANCELLED: { label: 'Dibatalkan', color: 'bg-red-50 text-red-500' },
}

const PAY_STATUS = {
  UNPAID: { label: 'Belum Bayar', color: 'bg-red-50 text-red-500' },
  PAID: { label: 'Lunas', color: 'bg-green-50 text-green-600' },
  REFUNDED: { label: 'Dikembalikan', color: 'bg-gray-100 text-gray-500' },
}

const FILTER_TABS = [
  { key: 'all', label: 'Semua' },
  { key: 'PENDING', label: 'Menunggu' },
  { key: 'ACTIVE', label: 'Aktif' },
  { key: 'COMPLETED', label: 'Selesai' },
  { key: 'CANCELLED', label: 'Dibatalkan' },
]

const EMPTY_FORM = {
  motorId: '',
  startDate: '',
  endDate: '',
  customerName: '',
  customerPhone: '',
  deliveryLocation: '',
  notes: '',
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const [detailBooking, setDetailBooking] = useState(null)
  const [editBooking, setEditBooking] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [editErrors, setEditErrors] = useState({})
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [motors, setMotors] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const exportCSV = () => {
    const headers = ['ID', 'Motor', 'Pelanggan', 'No HP', 'Tgl Mulai', 'Tgl Selesai', 'Durasi (hari)', 'Total (IDR)', 'Pembayaran', 'Status', 'Dibuat']
    const rows = filtered.map(b => [
      b.id, b.motorName, b.customerName, b.customerPhone,
      b.startDate, b.endDate, b.durationDays,
      b.totalPrice, b.paymentStatus, b.status, b.createdAt ?? '',
    ])
    const csv = [headers, ...rows]
      .map(row => row.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\r\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const fetchBookings = () =>
    bookingApi.getAll()
      .then(setBookings)
      .finally(() => setLoading(false))

  useEffect(() => { fetchBookings() }, [])

  useEffect(() => {
    if (showModal && motors.length === 0) {
      motorApi.getAll().then(setMotors)
    }
  }, [showModal])

  const filtered = useMemo(() => {
    let list = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(b =>
        b.customerName?.toLowerCase().includes(q) ||
        b.customerPhone?.toLowerCase().includes(q) ||
        b.motorName?.toLowerCase().includes(q) ||
        b.id?.toLowerCase().includes(q)
      )
    }
    return list
  }, [bookings, filter, search])

  const [statusError, setStatusError] = useState('')
  const [updatingStatusId, setUpdatingStatusId] = useState(null)
  const [paymentUpdatingId, setPaymentUpdatingId] = useState(null)

  const updateStatus = async (id, newStatus) => {
    setUpdatingStatusId(id)
    try {
      await bookingApi.updateStatus(id, newStatus)
      setStatusError('')
      fetchBookings()
    } catch {
      setStatusError('Gagal mengubah status. Coba lagi.')
      setTimeout(() => setStatusError(''), 3000)
    } finally {
      setUpdatingStatusId(null)
    }
  }

  const updatePaymentStatus = async (id, newPaymentStatus) => {
    setPaymentUpdatingId(id)
    try {
      await bookingApi.updatePaymentStatus(id, newPaymentStatus)
      setDetailBooking(prev => prev ? { ...prev, paymentStatus: newPaymentStatus } : prev)
      fetchBookings()
    } catch {
      setStatusError('Gagal mengubah status pembayaran. Coba lagi.')
      setTimeout(() => setStatusError(''), 3000)
    } finally {
      setPaymentUpdatingId(null)
    }
  }

  const openEditBooking = (b) => {
    setEditBooking(b)
    setEditForm({ startDate: b.startDate, endDate: b.endDate, customerName: b.customerName, customerPhone: b.customerPhone, deliveryLocation: b.deliveryLocation ?? '', notes: b.notes ?? '' })
    setEditErrors({})
    setEditError('')
  }

  const handleEditSave = async () => {
    const errs = {}
    if (!editForm.startDate) errs.startDate = 'Wajib diisi'
    if (!editForm.endDate) errs.endDate = 'Wajib diisi'
    if (editForm.startDate && editForm.endDate) {
      const days = Math.round((new Date(editForm.endDate) - new Date(editForm.startDate)) / 86400000)
      if (days < 1) errs.endDate = 'Tanggal selesai harus setelah tanggal mulai'
    }
    if (!editForm.customerName.trim()) errs.customerName = 'Wajib diisi'
    if (!editForm.customerPhone.trim()) errs.customerPhone = 'Wajib diisi'
    setEditErrors(errs)
    if (Object.keys(errs).length > 0) return

    setEditSaving(true)
    setEditError('')
    try {
      await bookingApi.editBooking(editBooking.id, editForm)
      setEditBooking(null)
      fetchBookings()
    } catch (err) {
      const msg = err?.response?.data?.message || 'Gagal menyimpan perubahan.'
      setEditError(typeof msg === 'string' ? msg : 'Gagal menyimpan perubahan.')
    } finally {
      setEditSaving(false)
    }
  }

  const validateForm = (f = form) => {
    const errs = {}
    if (!f.motorId) errs.motorId = 'Pilih motor'
    if (!f.startDate) errs.startDate = 'Wajib diisi'
    if (!f.endDate) errs.endDate = 'Wajib diisi'
    if (f.startDate && f.endDate) {
      const days = Math.round((new Date(f.endDate) - new Date(f.startDate)) / 86400000)
      if (days < 1) errs.endDate = 'Tanggal selesai harus setelah tanggal mulai'
    }
    if (!f.customerName.trim()) errs.customerName = 'Wajib diisi'
    if (!f.customerPhone.trim()) errs.customerPhone = 'Wajib diisi'
    if (!f.deliveryLocation.trim()) errs.deliveryLocation = 'Wajib diisi'
    return errs
  }

  const handleFormChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value }
    setForm(updated)
    if (Object.keys(formErrors).length > 0) setFormErrors(validateForm(updated))
  }

  const getDuration = () => {
    if (!form.startDate || !form.endDate) return null
    const days = Math.round((new Date(form.endDate) - new Date(form.startDate)) / 86400000)
    return days >= 1 ? days : null
  }

  const selectedMotor = motors.find(m => String(m.id) === String(form.motorId))
  const duration = getDuration()
  const totalPrice = duration && selectedMotor
    ? calculateBookingPrice(duration, selectedMotor.priceDay, selectedMotor.priceWeek, selectedMotor.priceMonth)
    : null
  const priceLines = duration && selectedMotor
    ? getPriceBreakdown(duration, selectedMotor.priceDay, selectedMotor.priceWeek, selectedMotor.priceMonth)
    : []

  const handleSubmit = async () => {
    const errs = validateForm()
    setFormErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSubmitting(true)
    setSubmitError('')
    try {
      await bookingApi.createManual({
        motorId: Number(form.motorId),
        startDate: form.startDate,
        endDate: form.endDate,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        deliveryLocation: form.deliveryLocation,
        notes: form.notes,
      })
      setShowModal(false)
      setForm(EMPTY_FORM)
      setFormErrors({})
      fetchBookings()
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || 'Gagal membuat booking.'
      setSubmitError(typeof msg === 'string' ? msg : 'Gagal membuat booking.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setForm(EMPTY_FORM)
    setFormErrors({})
    setSubmitError('')
  }

  const fieldClass = (field) =>
    `w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 transition-colors ${
      formErrors[field]
        ? 'border-red-300 focus:ring-red-200'
        : 'border-gray-200 focus:ring-gold focus:border-gold'
    }`

  return (
    <div className="p-7">
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-charcoal">Data Booking</h1>
          <p className="text-sm text-gray-400 mt-0.5">{bookings.length} total booking</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 border border-gray-200 text-gray-500 text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={15} />
            Export CSV
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-charcoal text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-gold transition-colors"
          >
            <Plus size={16} />
            Tambah Booking
          </button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari nama, nomor HP, atau nama motor..."
          className="w-full max-w-sm border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
        />
      </div>

      {statusError && (
        <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
          {statusError}
        </div>
      )}

      <div className="flex gap-1 mb-5 bg-white border border-gray-100 rounded-lg p-1 w-fit">
        {FILTER_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded transition-colors ${
              filter === key
                ? 'bg-charcoal text-white'
                : 'text-gray-400 hover:text-charcoal'
            }`}
          >
            {label}
            {key === 'all'
              ? ` (${bookings.length})`
              : ` (${bookings.filter((b) => b.status === key).length})`}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                {['ID', 'Motor', 'Pelanggan', 'No HP', 'Tgl Mulai', 'Tgl Selesai', 'Total', 'Pembayaran', 'Status', 'Ubah Status', ''].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold text-gray-400 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-sm text-gray-400">
                    Memuat data...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-10 text-center text-sm text-gray-400">
                    Tidak ada booking dengan status ini.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-mono text-[11px] text-gray-400 max-w-[90px] truncate" title={b.id}>{b.id}</td>
                    <td className="px-4 py-3 font-medium text-charcoal whitespace-nowrap">
                      {b.motorName}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{b.customerName}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{b.customerPhone}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{b.startDate}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{b.endDate}</td>
                    <td className="px-4 py-3 font-semibold text-charcoal whitespace-nowrap">
                      {formatIDR(b.totalPrice)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${(PAY_STATUS[b.paymentStatus] || PAY_STATUS.UNPAID).color}`}>
                        {(PAY_STATUS[b.paymentStatus] || PAY_STATUS.UNPAID).label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${(BOOKING_STATUS[b.status] || BOOKING_STATUS.PENDING).color}`}>
                        {(BOOKING_STATUS[b.status] || BOOKING_STATUS.PENDING).label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <select
                          value={b.status}
                          onChange={(e) => updateStatus(b.id, e.target.value)}
                          disabled={updatingStatusId === b.id}
                          className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gold disabled:opacity-60"
                        >
                          <option value="PENDING">Menunggu</option>
                          <option value="ACTIVE">Aktif</option>
                          <option value="COMPLETED">Selesai</option>
                          <option value="CANCELLED">Dibatalkan</option>
                        </select>
                        {updatingStatusId === b.id && (
                          <Loader2 size={12} className="animate-spin text-gold shrink-0" />
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
                        <button
                          onClick={() => openEditBooking(b)}
                          className="p-1.5 rounded text-gray-400 hover:text-gold hover:bg-gray-100 transition-colors"
                          title="Edit booking"
                        >
                          <Pencil size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-charcoal">Tambah Booking Manual</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-charcoal transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <p className="text-xs text-gray-400 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                Booking manual langsung aktif (status: Aktif). Gunakan untuk pesanan via telepon atau WhatsApp yang sudah dikonfirmasi.
              </p>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">Motor <span className="text-red-400">*</span></label>
                <select
                  name="motorId"
                  value={form.motorId}
                  onChange={handleFormChange}
                  className={fieldClass('motorId')}
                >
                  <option value="">-- Pilih Motor --</option>
                  {motors.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} — {formatIDR(m.priceDay)}/hari
                    </option>
                  ))}
                </select>
                {formErrors.motorId && <p className="text-xs text-red-400 mt-1">{formErrors.motorId}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1.5">Tgl Mulai <span className="text-red-400">*</span></label>
                  <input
                    type="date"
                    name="startDate"
                    min={today}
                    value={form.startDate}
                    onChange={handleFormChange}
                    className={fieldClass('startDate')}
                  />
                  {formErrors.startDate && <p className="text-xs text-red-400 mt-1">{formErrors.startDate}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1.5">Tgl Selesai <span className="text-red-400">*</span></label>
                  <input
                    type="date"
                    name="endDate"
                    min={form.startDate || today}
                    value={form.endDate}
                    onChange={handleFormChange}
                    className={fieldClass('endDate')}
                  />
                  {formErrors.endDate && <p className="text-xs text-red-400 mt-1">{formErrors.endDate}</p>}
                </div>
              </div>

              {duration && totalPrice && (
                <div className="bg-off-white rounded-lg px-4 py-3 space-y-1.5">
                  {priceLines.map((line, i) => (
                    <div key={i} className="flex items-center justify-between text-xs text-gray-500">
                      <span>{line.qty} {line.unit} × {formatIDR(line.price)}</span>
                      <span>{formatIDR(line.qty * line.price)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-1.5 flex items-center justify-between text-sm">
                    <span className="font-semibold text-charcoal">Total</span>
                    <span className="font-bold text-charcoal">{formatIDR(totalPrice)}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">Nama Pelanggan <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleFormChange}
                  placeholder="Nama lengkap"
                  className={fieldClass('customerName')}
                />
                {formErrors.customerName && <p className="text-xs text-red-400 mt-1">{formErrors.customerName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">No. WhatsApp <span className="text-red-400">*</span></label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={form.customerPhone}
                  onChange={handleFormChange}
                  placeholder="08xxxxxxxxxx"
                  className={fieldClass('customerPhone')}
                />
                {formErrors.customerPhone && <p className="text-xs text-red-400 mt-1">{formErrors.customerPhone}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">Lokasi Pengiriman <span className="text-red-400">*</span></label>
                <textarea
                  name="deliveryLocation"
                  value={form.deliveryLocation}
                  onChange={handleFormChange}
                  rows={2}
                  placeholder="Alamat pengiriman motor"
                  className={`${fieldClass('deliveryLocation')} resize-none`}
                />
                {formErrors.deliveryLocation && <p className="text-xs text-red-400 mt-1">{formErrors.deliveryLocation}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">Catatan</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  rows={2}
                  placeholder="Catatan tambahan (opsional)"
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors resize-none"
                />
              </div>

              {submitError && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{submitError}</p>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 text-sm font-semibold text-gray-500 border border-gray-200 rounded-lg py-2.5 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 text-sm font-semibold bg-charcoal text-white rounded-lg py-2.5 hover:bg-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {editBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-charcoal">Edit Booking</h2>
              <button onClick={() => setEditBooking(null)} className="text-gray-400 hover:text-charcoal transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <p className="text-xs text-gray-400 font-mono bg-gray-50 rounded px-2 py-1">{editBooking.id}</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1.5">Tgl Mulai <span className="text-red-400">*</span></label>
                  <input
                    type="date"
                    value={editForm.startDate}
                    onChange={e => setEditForm(f => ({ ...f, startDate: e.target.value }))}
                    className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold ${editErrors.startDate ? 'border-red-300' : 'border-gray-200'}`}
                  />
                  {editErrors.startDate && <p className="text-xs text-red-400 mt-1">{editErrors.startDate}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1.5">Tgl Selesai <span className="text-red-400">*</span></label>
                  <input
                    type="date"
                    value={editForm.endDate}
                    min={editForm.startDate}
                    onChange={e => setEditForm(f => ({ ...f, endDate: e.target.value }))}
                    className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold ${editErrors.endDate ? 'border-red-300' : 'border-gray-200'}`}
                  />
                  {editErrors.endDate && <p className="text-xs text-red-400 mt-1">{editErrors.endDate}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">Nama Pelanggan <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={editForm.customerName}
                  onChange={e => setEditForm(f => ({ ...f, customerName: e.target.value }))}
                  className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold ${editErrors.customerName ? 'border-red-300' : 'border-gray-200'}`}
                />
                {editErrors.customerName && <p className="text-xs text-red-400 mt-1">{editErrors.customerName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">No. WhatsApp <span className="text-red-400">*</span></label>
                <input
                  type="tel"
                  value={editForm.customerPhone}
                  onChange={e => setEditForm(f => ({ ...f, customerPhone: e.target.value }))}
                  className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold ${editErrors.customerPhone ? 'border-red-300' : 'border-gray-200'}`}
                />
                {editErrors.customerPhone && <p className="text-xs text-red-400 mt-1">{editErrors.customerPhone}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">Lokasi Pengiriman</label>
                <textarea
                  value={editForm.deliveryLocation}
                  onChange={e => setEditForm(f => ({ ...f, deliveryLocation: e.target.value }))}
                  rows={2}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">Catatan</label>
                <textarea
                  value={editForm.notes}
                  onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold resize-none"
                />
              </div>

              {editError && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{editError}</p>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setEditBooking(null)}
                className="flex-1 text-sm font-semibold text-gray-500 border border-gray-200 rounded-lg py-2.5 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleEditSave}
                disabled={editSaving}
                className="flex-1 text-sm font-semibold bg-charcoal text-white rounded-lg py-2.5 hover:bg-gold transition-colors disabled:opacity-50"
              >
                {editSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {detailBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-charcoal">Detail Booking</h2>
              <button onClick={() => setDetailBooking(null)} className="text-gray-400 hover:text-charcoal transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'ID Booking', value: detailBooking.id, mono: true },
                  { label: 'Motor', value: detailBooking.motorName },
                  { label: 'Pelanggan', value: detailBooking.customerName },
                  { label: 'No HP', value: detailBooking.customerPhone },
                  { label: 'Tgl Mulai', value: detailBooking.startDate },
                  { label: 'Tgl Selesai', value: detailBooking.endDate },
                  { label: 'Durasi', value: `${detailBooking.durationDays} hari` },
                  { label: 'Total', value: formatIDR(detailBooking.totalPrice) },
                ].map(({ label, value, mono }) => (
                  <div key={label}>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                    <p className={`text-sm font-semibold text-charcoal ${mono ? 'font-mono text-xs' : ''}`}>{value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Status Booking</p>
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${(BOOKING_STATUS[detailBooking.status] || BOOKING_STATUS.PENDING).color}`}>
                    {(BOOKING_STATUS[detailBooking.status] || BOOKING_STATUS.PENDING).label}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Pembayaran</p>
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${(PAY_STATUS[detailBooking.paymentStatus] || PAY_STATUS.UNPAID).color}`}>
                    {(PAY_STATUS[detailBooking.paymentStatus] || PAY_STATUS.UNPAID).label}
                  </span>
                </div>
              </div>

              {detailBooking.deliveryLocation && (
                <div className="flex items-start gap-2 bg-off-white rounded-lg px-3 py-2.5">
                  <MapPin size={13} className="text-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Lokasi Pengiriman</p>
                    <p className="text-xs text-gray-600">{detailBooking.deliveryLocation}</p>
                  </div>
                </div>
              )}

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

            <div className="px-6 pb-4 flex gap-2">
              {detailBooking.paymentStatus === 'UNPAID' && (
                <button
                  onClick={() => updatePaymentStatus(detailBooking.id, 'PAID')}
                  disabled={paymentUpdatingId === detailBooking.id}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-60"
                >
                  {paymentUpdatingId === detailBooking.id ? <Loader2 size={12} className="animate-spin" /> : null}
                  Tandai Lunas
                </button>
              )}
              {detailBooking.paymentStatus === 'PAID' && (
                <button
                  onClick={() => updatePaymentStatus(detailBooking.id, 'UNPAID')}
                  disabled={paymentUpdatingId === detailBooking.id}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-red-50 text-red-500 border border-red-200 py-2 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-60"
                >
                  {paymentUpdatingId === detailBooking.id ? <Loader2 size={12} className="animate-spin" /> : null}
                  Tandai Belum Bayar
                </button>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <a
                href={waLink(`Halo ${detailBooking.customerName}, kami dari Benz Rental Bali ingin mengkonfirmasi booking motor *${detailBooking.motorName}* Anda untuk periode ${detailBooking.startDate} s/d ${detailBooking.endDate}.`)}
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
