import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ArrowLeft, MessageCircle, Star, Bike, AlertCircle, CalendarDays, MapPin, User, Phone, FileText, CreditCard, CheckCircle, Truck, Shield, Wrench, Clock, IdCard, X, Upload, ImageIcon } from 'lucide-react'
import ImageCarousel from '@/components/common/ImageCarousel'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motorApi } from '@/api/motors'
import { bookingApi } from '@/api/bookings'
import { formatIDR } from '@/utils/formatCurrency'
import { useCurrency } from '@/context/CurrencyContext'
import CurrencyToggle from '@/components/common/CurrencyToggle'
import { calculateBookingPrice, getPriceBreakdown } from '@/utils/pricingEngine'
import { extractIdFromSlug } from '@/utils/slugify'
import { waLink } from '@/constants/contact'
import Animate from '@/components/common/Animate'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

const formatFileSize = (bytes) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const CARD = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '16px',
}

function buildWAMessage(vehicle, form, duration, total) {
  const identityLine = form.identityType
    ? `Tipe ID: ${form.identityType === 'KTP' ? 'WNI - KTP' : 'WNA - Passport'}${form.identityNumber ? ` (${form.identityNumber})` : ''}`
    : ''
  const photoLine = form.identityFileName
    ? `Foto ID: ${form.identityFileName} *(akan dikirim di chat ini)*`
    : `Foto ID: akan dikirim via WhatsApp`

  return `Halo Benz Rental Bali, saya ingin memesan motor:

Motor: ${vehicle.name}
Tanggal Mulai: ${form.startDate}
Tanggal Selesai: ${form.endDate}
Jam Pengantaran: ${form.deliveryTime || '-'}
Durasi: ${duration} hari
Total Harga: ${formatIDR(total)}

Nama: ${form.name}
No. WhatsApp: ${form.phone}
Lokasi Pengiriman: ${form.deliveryLocation}
${identityLine}
${photoLine}
${form.notes ? `Catatan: ${form.notes}` : ''}
Mohon konfirmasi ketersediaan. Terima kasih!`
}

const DELIVERY_HOURS = Array.from({ length: 17 }, (_, i) => i + 6) // 06:00–22:00
const MINUTES = ['00', '30']

function DeliveryTimePicker({ value, onChange, isID, hasError }) {
  const parts = value ? value.split(':') : ['', '00']
  const h24 = parts[0] !== '' ? parseInt(parts[0]) : ''
  const min = parts[1] ?? '00'
  const filled = h24 !== ''

  const selCls = (err) =>
    `rounded-xl px-3 py-3 text-sm text-white bg-white/[0.05] border focus:outline-none transition-colors appearance-none cursor-pointer ` +
    (err ? 'border-red-500/40 focus:border-red-400' : filled ? 'border-gold/40 focus:border-gold' : 'border-white/10 focus:border-gold')

  const commit = (newH24, newMin) => {
    if (newH24 === '' || newH24 === undefined) { onChange(''); return }
    onChange(`${String(newH24).padStart(2, '0')}:${newMin}`)
  }

  if (isID) {
    return (
      <div className="flex gap-2">
        <select
          value={h24}
          onChange={e => commit(e.target.value !== '' ? parseInt(e.target.value) : '', min)}
          className={`flex-1 ${selCls(hasError)}`}
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <option value="" style={{ background: '#1a1a1a' }}>-- Jam --</option>
          {DELIVERY_HOURS.map(h => (
            <option key={h} value={h} style={{ background: '#1a1a1a' }}>
              {String(h).padStart(2, '0')}
            </option>
          ))}
        </select>
        <select
          value={min}
          onChange={e => commit(h24, e.target.value)}
          disabled={h24 === ''}
          className={`w-20 ${selCls(false)}`}
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          {MINUTES.map(m => (
            <option key={m} value={m} style={{ background: '#1a1a1a' }}>{m}</option>
          ))}
        </select>
        <div className={`flex items-center justify-center px-3 rounded-xl text-xs font-bold shrink-0 border ${filled ? 'border-gold/40 text-gold/50' : 'border-white/10 text-white/25'}`}>
          WITA
        </div>
      </div>
    )
  }

  // EN: 12-hour with AM/PM
  const ampm = h24 !== '' ? (h24 >= 12 ? 'PM' : 'AM') : 'AM'
  const h12display = h24 !== '' ? (h24 % 12 || 12) : ''

  const handleH12 = (val) => {
    if (!val) { onChange(''); return }
    const h = parseInt(val)
    const h24new = ampm === 'AM' ? (h === 12 ? 0 : h) : (h === 12 ? 12 : h + 12)
    commit(h24new, min)
  }

  const handleAmPm = (period) => {
    if (h24 === '') return
    let h = h24
    if (period === 'AM' && h >= 12) h -= 12
    if (period === 'PM' && h < 12) h += 12
    commit(h, min)
  }

  return (
    <div className="flex gap-2">
      <select
        value={h12display}
        onChange={e => handleH12(e.target.value)}
        className={`flex-1 ${selCls(hasError)}`}
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        <option value="" style={{ background: '#1a1a1a' }}>-- Hour --</option>
        {[...Array(12)].map((_, i) => {
          const h = i + 1
          return <option key={h} value={h} style={{ background: '#1a1a1a' }}>{h}</option>
        })}
      </select>
      <select
        value={min}
        onChange={e => { if (h24 !== '') commit(h24, e.target.value) }}
        disabled={h12display === ''}
        className={`w-20 ${selCls(false)}`}
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        {MINUTES.map(m => (
          <option key={m} value={m} style={{ background: '#1a1a1a' }}>{m}</option>
        ))}
      </select>
      <div className="flex rounded-xl overflow-hidden border border-white/10 shrink-0">
        {['AM', 'PM'].map(period => (
          <button
            key={period}
            type="button"
            onClick={() => handleAmPm(period)}
            className={`px-3 py-2 text-xs font-bold transition-colors ${
              ampm === period
                ? 'bg-gold text-charcoal'
                : 'bg-white/[0.03] text-white/30 hover:text-white/60'
            }`}
          >
            {period}
          </button>
        ))}
      </div>
    </div>
  )
}

function Label({ icon: Icon, text, required }) {
  return (
    <label className="flex items-center gap-1.5 text-xs font-semibold text-white/50 mb-2">
      <Icon size={11} className="text-gold" />
      {text}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  )
}

export default function BookingPage() {
  const { slug } = useParams()
  const id = extractIdFromSlug(slug)
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const isID = i18n.language === 'id'
  const { formatPrice, currency } = useCurrency()

  const [vehicle, setVehicle] = useState(null)
  const [vehicleLoading, setVehicleLoading] = useState(true)
  const [vehicleError, setVehicleError] = useState(false)
  const [bookedRanges, setBookedRanges] = useState([])

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    startDate: '',
    endDate: '',
    deliveryTime: '',
    name: '',
    phone: '',
    deliveryLocation: '',
    identityType: 'KTP',
    identityNumber: '',
    identityFileName: '',
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [touchedFields, setTouchedFields] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [identityFile, setIdentityFile] = useState(null)
  const [identityPreview, setIdentityPreview] = useState('')
  const [identityFileSize, setIdentityFileSize] = useState(0)
  const [identityFileError, setIdentityFileError] = useState('')

  const handleAutofill = (e) => {
    if (e.animationName === 'onAutofillStart' && e.target.name) {
      setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    if (e.animationName === 'onAutofillStop' && e.target.name) {
      setForm(prev => ({ ...prev, [e.target.name]: '' }))
    }
  }

  useEffect(() => {
    return () => { if (identityPreview) URL.revokeObjectURL(identityPreview) }
  }, [identityPreview])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      setIdentityFileError(isID
        ? 'Format tidak didukung. Gunakan JPG, PNG, WEBP, atau PDF.'
        : 'Unsupported format. Use JPG, PNG, WEBP, or PDF.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setIdentityFileError(isID ? 'Ukuran file maksimal 5 MB.' : 'Maximum file size is 5 MB.')
      return
    }

    setIdentityFileError('')
    setIdentityFile(file)
    setIdentityFileSize(file.size)
    setForm(f => ({ ...f, identityFileName: file.name }))

    if (file.type.startsWith('image/')) {
      setIdentityPreview(URL.createObjectURL(file))
    } else {
      setIdentityPreview('')
    }
  }

  const clearIdentityFile = () => {
    if (identityPreview) URL.revokeObjectURL(identityPreview)
    setIdentityFile(null)
    setIdentityPreview('')
    setIdentityFileSize(0)
    setIdentityFileError('')
    setForm(f => ({ ...f, identityFileName: '' }))
  }

  useEffect(() => {
    Promise.allSettled([
      motorApi.getById(id),
      bookingApi.getBookedDates(id),
    ]).then(([motorResult, datesResult]) => {
      if (motorResult.status === 'fulfilled') {
        const data = motorResult.value
        setVehicle({ ...data, transmission: data.transmission?.toLowerCase() })
      } else {
        setVehicleError(true)
      }
      if (datesResult.status === 'fulfilled') setBookedRanges(datesResult.value)
    }).finally(() => setVehicleLoading(false))
  }, [id])

  const getDuration = () => {
    if (!form.startDate || !form.endDate) return null
    const days = Math.round(
      (new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24)
    )
    return days >= 3 ? days : null
  }

  const minEndDate = form.startDate
    ? new Date(new Date(form.startDate).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    : today

  const duration = getDuration()
  const totalPrice = duration && vehicle
    ? calculateBookingPrice(duration, vehicle.priceDay, vehicle.priceWeek, vehicle.priceMonth)
    : null
  const priceLines = duration && vehicle
    ? getPriceBreakdown(duration, vehicle.priceDay, vehicle.priceWeek, vehicle.priceMonth)
    : []

  const hasOverlap = (startDate, endDate) => {
    if (!startDate || !endDate) return false
    const s = new Date(startDate)
    const e = new Date(endDate)
    return bookedRanges.some(r => s < new Date(r.endDate) && e > new Date(r.startDate))
  }

  const validate = (f = form) => {
    const errs = {}
    if (!f.startDate) errs.startDate = t('booking.required')
    if (!f.endDate) errs.endDate = t('booking.required')
    if (f.startDate && f.endDate) {
      const d = Math.round(
        (new Date(f.endDate) - new Date(f.startDate)) / (1000 * 60 * 60 * 24)
      )
      if (d < 3) errs.endDate = t('booking.invalidDate')
      else if (hasOverlap(f.startDate, f.endDate)) errs.endDate = t('booking.dateConflict')
    }
    if (!f.deliveryTime) errs.deliveryTime = t('booking.required')
    if (!f.name.trim()) errs.name = t('booking.required')
    if (!f.phone.trim()) errs.phone = t('booking.required')
    if (!f.deliveryLocation.trim()) errs.deliveryLocation = t('booking.required')
    return errs
  }

  const REQUIRED_FIELDS = ['startDate', 'endDate', 'deliveryTime', 'name', 'phone', 'deliveryLocation']

  const markTouched = (name) =>
    setTouchedFields(prev => ({ ...prev, [name]: true }))

  const markAllRequired = () =>
    setTouchedFields(prev =>
      REQUIRED_FIELDS.reduce((acc, k) => ({ ...acc, [k]: true }), { ...prev })
    )

  const scrollToFirstError = (errs) => {
    const firstField = REQUIRED_FIELDS.find(f => errs[f])
    if (!firstField) return
    const el = document.querySelector(`[name="${firstField}"], #field-${firstField}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const updated = { ...form, [name]: value }
    setForm(updated)
    if (touchedFields[name]) {
      const errs = validate(updated)
      setErrors(prev => ({ ...prev, [name]: errs[name] }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    markTouched(name)
    const errs = validate(form)
    setErrors(prev => ({ ...prev, [name]: errs[name] }))
  }

  const handleWAOrder = async () => {
    markAllRequired()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      toast.error(t('booking.fillRequired'))
      scrollToFirstError(errs)
      return
    }
    setSubmitting(true)
    try {
      await bookingApi.createWhatsApp({
        motorId: vehicle.id,
        customerName: form.name,
        customerPhone: form.phone,
        deliveryLocation: form.deliveryLocation,
        notes: form.notes,
        startDate: form.startDate,
        endDate: form.endDate,
      })
    } catch {
      // tetap buka WhatsApp meski gagal simpan
    } finally {
      setSubmitting(false)
    }
    window.open(waLink(buildWAMessage(vehicle, form, duration, totalPrice)), '_blank')
  }

  const handleXenditPay = async () => {
    markAllRequired()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      toast.error(t('booking.fillRequired'))
      scrollToFirstError(errs)
      return
    }
    setSubmitting(true)
    setSubmitError('')
    try {
      const result = await bookingApi.create({
        motorId: vehicle.id,
        customerName: form.name,
        customerPhone: form.phone,
        deliveryLocation: form.deliveryLocation,
        notes: form.notes,
        startDate: form.startDate,
        endDate: form.endDate,
      })
      if (result.paymentUrl) window.location.href = result.paymentUrl
    } catch {
      setSubmitError(t('bookingPage.submitError'))
      toast.error(t('bookingPage.submitError'))
    } finally {
      setSubmitting(false)
    }
  }

  const hasError = (field) => !!(errors[field] && touchedFields[field])

  const fieldClass = (field) => {
    const val = form[field]
    const filled = typeof val === 'string' ? val.trim().length > 0 : !!val
    const base = 'w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 transition-colors focus:outline-none bg-white/[0.05] border focus:border-gold '
    if (hasError(field)) return base + 'border-red-500/40 focus:border-red-400 field-error'
    if (filled)          return base + 'border-gold/40'
    return                      base + 'border-white/10'
  }

  const darkBg = { background: '#111111' }

  if (vehicleLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-16" style={darkBg}>
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    )
  }

  if (vehicleError || !vehicle) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center pt-16 px-4 text-center" style={darkBg}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(201,162,75,0.1)' }}>
            <Bike size={28} className="text-gold" strokeWidth={1.5} />
          </div>
          <h2 className="font-heading text-2xl font-bold text-white mb-2">{t('booking.notFound')}</h2>
          <p className="text-white/40 mb-6 max-w-sm">{t('booking.notFoundDesc')}</p>
          <Link to="/fleet" className="bg-gold text-charcoal font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
            {t('booking.backToFleet')}
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  const pageTitle = vehicle
    ? (isID
        ? `Sewa ${vehicle.name} di Bali – Benzride`
        : `Rent ${vehicle.name} in Bali – Benzride`)
    : 'Booking Motor – Benzride Bali'
  const pageDesc = vehicle
    ? (isID
        ? `Sewa ${vehicle.name} ${vehicle.cc}cc di Bali mulai ${vehicle.priceDay ? `Rp${vehicle.priceDay.toLocaleString('id')}` : ''}/hari. Antar ke hotel & villa seluruh Bali.`
        : `Rent ${vehicle.name} ${vehicle.cc}cc in Bali from IDR ${vehicle.priceDay ? vehicle.priceDay.toLocaleString() : ''}/day. Delivery to hotels & villas across Bali.`)
    : ''

  return (
    <>
      <title>{pageTitle}</title>
      {pageDesc && <meta name="description" content={pageDesc} />}
      <meta property="og:title" content={pageTitle} />
      {pageDesc && <meta property="og:description" content={pageDesc} />}
      <Navbar />
      <div className="page-enter min-h-screen pt-16" style={{ background: '#111111' }}>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-white/30 hover:text-gold transition-colors mb-8"
          >
            <ArrowLeft size={15} />
            {t('bookingPage.back')}
          </button>

          <div className="grid lg:grid-cols-[5fr_7fr] gap-6 items-start">

            <div className="lg:sticky lg:top-24 space-y-4">
                <div style={CARD} className="overflow-hidden shadow-sm">
                  <div className="aspect-[4/3]">
                    <ImageCarousel images={vehicle.images ?? []} alt={vehicle.name} />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-heading font-bold text-white text-xl leading-tight">{vehicle.name}</h3>
                      <span className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shrink-0 ${
                        vehicle.available
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                          : 'bg-white/5 text-white/25 border border-white/10'
                      }`}>
                        {vehicle.available ? t('bookingPage.available') : t('bookingPage.full')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap mt-2 mb-4">
                      {[`${vehicle.cc} CC`, t(`vehicles.${vehicle.transmission ?? 'automatic'}`), String(vehicle.year)].map(s => (
                        <span
                          key={s}
                          className="text-[10px] font-semibold text-white/35 px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black text-white/25 uppercase tracking-[0.2em]">
                          {t('booking.priceCalc')}
                        </span>
                        <CurrencyToggle variant="dark" />
                      </div>
                      <div className="space-y-1.5">
                        {[
                          { key: 'perDay', price: vehicle.priceDay },
                          { key: 'perWeek', price: vehicle.priceWeek },
                          { key: 'perMonth', price: vehicle.priceMonth },
                        ].filter(r => r.price > 0).map(({ key, price }) => (
                          <div key={key} className="flex items-center justify-between text-sm">
                            <span className="text-white/30">{t(`bookingPage.${key}`)}</span>
                            <span className="font-semibold text-white/70">{formatPrice(price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} fill="#C9A24B" className="text-gold" />
                      ))}
                      <span className="text-xs text-white/25 ml-1">{t('bookingPage.ratingText')}</span>
                    </div>
                  </div>
                </div>

                <div style={CARD} className="p-4 shadow-sm">
                  <p className="text-xs font-black text-white/25 uppercase tracking-[0.2em] mb-3">{t('bookingPage.includes')}</p>
                  <div className="space-y-2.5">
                    {t('bookingPage.includesList', { returnObjects: true }).map(item => (
                      <div key={item} className="flex items-center gap-2 text-xs text-white/40">
                        <CheckCircle size={12} className="text-gold shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
            </div>

            <Animate type="right" delay={80}>
              <div style={CARD} className="p-6 sm:p-8 shadow-sm dark-form" onAnimationStart={handleAutofill}>
                {!vehicle.available && (
                  <div className="flex items-start gap-3 rounded-xl px-4 py-3.5 mb-6 bg-amber-50 border border-amber-200">
                    <AlertCircle size={15} className="text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-amber-700">{t('bookingPage.unavailableTitle')}</p>
                      <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
                        {t('bookingPage.unavailableDesc')}
                      </p>
                      <a
                        href={waLink(`Halo, saya tertarik menyewa ${vehicle.name} tapi terlihat tidak tersedia. Apakah ada slot kosong?`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2.5 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors"
                      >
                        <MessageCircle size={11} />
                        {t('bookingPage.unavailableAsk')}
                      </a>
                    </div>
                  </div>
                )}

                <h2 className="font-heading text-2xl font-bold text-white mb-1">{t('booking.title')}</h2>
                <p className="text-sm text-white/30 mb-7">{t('booking.subtitle')}</p>

                <div className="space-y-5">
                  <div>
                    <p className="text-[10px] font-black text-white/25 uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
                      <CalendarDays size={10} className="text-gold" />
                      {t('bookingPage.dateSection')}
                      <span
                        className="text-[9px] font-bold text-gold/70 px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(201,162,75,0.1)', border: '1px solid rgba(201,162,75,0.2)' }}
                      >
                        {t('bookingPage.minDaysHint')}
                      </span>
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <Label icon={CalendarDays} text={t('booking.startDate')} required />
                        <input
                          type="date"
                          name="startDate"
                          min={today}
                          value={form.startDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={fieldClass('startDate')}
                        />
                        {hasError('startDate') && <p className="text-xs text-red-500 mt-1.5">{errors.startDate}</p>}
                      </div>
                      <div>
                        <Label icon={CalendarDays} text={t('booking.endDate')} required />
                        <input
                          type="date"
                          name="endDate"
                          min={minEndDate}
                          value={form.endDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={fieldClass('endDate')}
                        />
                        {hasError('endDate') && <p className="text-xs text-red-500 mt-1.5">{errors.endDate}</p>}
                      </div>
                    </div>

                    <div className="mt-3" id="field-deliveryTime">
                      <Label icon={Clock} text={t('booking.deliveryTime')} required />
                      <DeliveryTimePicker
                        value={form.deliveryTime}
                        onChange={val => {
                          const updated = { ...form, deliveryTime: val }
                          setForm(updated)
                          markTouched('deliveryTime')
                          setErrors(prev => ({ ...prev, deliveryTime: validate(updated).deliveryTime }))
                        }}
                        isID={isID}
                        hasError={hasError('deliveryTime')}
                      />
                      {hasError('deliveryTime') && <p className="text-xs text-red-500 mt-1.5">{errors.deliveryTime}</p>}
                      <p className="text-[11px] text-white/20 mt-1.5">{t('booking.deliveryTimeHint')}</p>
                    </div>
                  </div>

                  {duration !== null && totalPrice !== null && totalPrice > 0 ? (
                    <div
                      className="rounded-xl p-4"
                      style={{ background: 'rgba(201,162,75,0.08)', border: '1px solid rgba(201,162,75,0.2)' }}
                    >
                      <p className="text-xs font-black text-gold/70 uppercase tracking-[0.2em] mb-3">{t('booking.priceCalc')}</p>
                      <div className="space-y-1.5 mb-3">
                        {priceLines.map((line, i) => (
                          <div key={i} className="flex items-center justify-between text-sm text-gray-600">
                            <span>{line.qty} {t(`booking.unit_${line.unit}`)} × {formatPrice(line.price)}</span>
                            <span className="font-semibold text-charcoal">{formatPrice(line.qty * line.price)}</span>
                          </div>
                        ))}
                      </div>
                      <div
                        className="flex items-center justify-between pt-3 border-t"
                        style={{ borderColor: 'rgba(201,162,75,0.25)' }}
                      >
                        <span className="text-sm font-bold text-gray-600">{t('booking.total')}</span>
                        <div className="text-right">
                          <span className="text-2xl font-black text-gold block">{formatPrice(totalPrice)}</span>
                          {currency === 'USD' && (
                            <span className="text-[10px] text-white/25">{formatIDR(totalPrice)} IDR</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl px-4 py-3.5 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.08)' }}>
                      <p className="text-xs text-white/20">{t('booking.selectDatesFirst')}</p>
                    </div>
                  )}

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                    <p className="text-[10px] font-black text-white/25 uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                      <User size={10} className="text-gold" />
                      {t('bookingPage.renterSection')}
                    </p>
                    <div className="space-y-4">
                      <div>
                        <Label icon={User} text={t('booking.fullName')} required />
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={t('booking.namePlaceholder')}
                          className={fieldClass('name')}
                        />
                        {hasError('name') && <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>}
                      </div>

                      <div>
                        <Label icon={Phone} text={t('booking.phone')} required />
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={t('booking.phonePlaceholder')}
                          className={fieldClass('phone')}
                        />
                        {hasError('phone') && <p className="text-xs text-red-500 mt-1.5">{errors.phone}</p>}
                      </div>

                      <div>
                        <Label icon={MapPin} text={t('booking.deliveryLoc')} required />
                        <textarea
                          name="deliveryLocation"
                          value={form.deliveryLocation}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          rows={2}
                          placeholder={t('booking.deliveryPlaceholder')}
                          className={`${fieldClass('deliveryLocation')} resize-none`}
                        />
                        {hasError('deliveryLocation') && <p className="text-xs text-red-500 mt-1.5">{errors.deliveryLocation}</p>}
                      </div>

                      <div>
                        <Label icon={FileText} text={t('booking.notes')} />
                        <textarea
                          name="notes"
                          value={form.notes}
                          onChange={handleChange}
                          rows={2}
                          placeholder={t('booking.notesPlaceholder')}
                          className={`${fieldClass('notes')} resize-none`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Identity Section */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                    <p className="text-[10px] font-black text-white/25 uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                      <IdCard size={10} className="text-gold" />
                      {t('booking.identitySection')}
                    </p>
                    <div className="space-y-4">
                      <div>
                        <Label icon={IdCard} text={t('booking.identityType')} required />
                        <div className="grid grid-cols-2 gap-2">
                          {['KTP', 'PASSPORT'].map(type => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setForm(f => ({ ...f, identityType: type }))}
                              className={`py-3 rounded-xl text-sm font-bold transition-all ${
                                form.identityType === type
                                  ? 'bg-gold text-charcoal'
                                  : 'text-white/40 border border-white/10 hover:border-white/25'
                              }`}
                            >
                              {type === 'KTP' ? t('booking.identityKTP') : t('booking.identityPassport')}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label icon={FileText} text={t('booking.identityNumber')} />
                        <input
                          type="text"
                          name="identityNumber"
                          value={form.identityNumber}
                          onChange={handleChange}
                          placeholder={form.identityType === 'KTP' ? t('booking.identityNumberKTPPlaceholder') : t('booking.identityNumberPassportPlaceholder')}
                          className={fieldClass('identityNumber')}
                        />
                      </div>

                      <div>
                        <Label icon={FileText} text={t('booking.identityPhoto')} />

                        {identityFile ? (
                          <div className="rounded-xl border border-gold/40 bg-gold/5 overflow-hidden">
                            {identityPreview ? (
                              <div className="relative">
                                <img
                                  src={identityPreview}
                                  alt="ID preview"
                                  className="w-full max-h-40 object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={clearIdentityFile}
                                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                                >
                                  <X size={13} className="text-white" />
                                </button>
                              </div>
                            ) : null}
                            <div className="flex items-center gap-3 px-4 py-3">
                              <FileText size={15} className="text-gold shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white/80 truncate">{identityFile.name}</p>
                                <p className="text-xs text-white/30 mt-0.5">{formatFileSize(identityFileSize)}</p>
                              </div>
                              {!identityPreview && (
                                <button
                                  type="button"
                                  onClick={clearIdentityFile}
                                  className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/10 transition-colors shrink-0"
                                >
                                  <X size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center gap-2 w-full rounded-xl px-4 py-6 text-sm border border-dashed border-white/15 bg-white/[0.03] hover:border-gold/40 hover:bg-gold/5 transition-colors cursor-pointer">
                            <Upload size={18} className="text-white/25" />
                            <span className="text-white/30 text-xs text-center leading-relaxed">
                              {isID
                                ? 'Klik untuk upload foto KTP / Passport\nJPG, PNG, WEBP, atau PDF · Maks 5 MB'
                                : 'Click to upload ID photo\nJPG, PNG, WEBP, or PDF · Max 5 MB'}
                            </span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,application/pdf"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                          </label>
                        )}

                        {identityFileError && (
                          <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                            <AlertCircle size={12} className="text-red-400 shrink-0" />
                            <p className="text-xs text-red-400">{identityFileError}</p>
                          </div>
                        )}
                      </div>

                      <div
                        className="flex items-start gap-3 rounded-xl px-4 py-3.5"
                        style={{ background: 'rgba(201,162,75,0.06)', border: '1px solid rgba(201,162,75,0.15)' }}
                      >
                        <MessageCircle size={13} className="text-gold mt-0.5 shrink-0" />
                        <p className="text-xs text-white/40 leading-relaxed">
                          {t('booking.identityNote')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-7 space-y-3">
                  <button
                    onClick={handleWAOrder}
                    disabled={submitting || !vehicle.available}
                    className="w-full inline-flex items-center justify-center gap-2.5 font-bold py-4 rounded-xl text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed text-white hover:opacity-90"
                    style={{ background: '#25D366' }}
                  >
                    <MessageCircle size={18} />
                    {t('booking.orderWA')}
                  </button>

                  <button
                    onClick={handleXenditPay}
                    disabled={submitting || !vehicle.available}
                    className="w-full inline-flex items-center justify-center gap-2.5 bg-gold text-charcoal font-bold py-4 rounded-xl text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <CreditCard size={18} />
                    {submitting ? t('bookingPage.processing') : t('booking.payXendit')}
                  </button>

                  {submitError && (
                    <div className="flex items-center gap-2 rounded-xl px-4 py-3 bg-red-50 border border-red-200">
                      <AlertCircle size={13} className="text-red-500 shrink-0" />
                      <p className="text-xs text-red-600">{submitError}</p>
                    </div>
                  )}
                </div>

                <div className="mt-5 rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="grid grid-cols-2 gap-2">
                    {t('bookingPage.trustItems', { returnObjects: true }).map(item => (
                      <div key={item} className="flex items-center gap-1.5 text-[11px] text-white/25">
                        <CheckCircle size={10} className="text-gold/50 shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-white/20 text-center mt-4">
                  {t('bookingPage.disclaimer')}
                </p>
              </div>
            </Animate>
          </div>
        </div>

      </div>

      {/* Trust Bar */}
      <div className="bg-charcoal-800" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { icon: Truck,         key: 'delivery' },
              { icon: Shield,        key: 'deposit' },
              { icon: Wrench,        key: 'maintenance' },
              { icon: MessageCircle, key: 'support' },
            ].map(({ icon: Icon, key }) => (
              <div key={key} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center" style={{ background: 'rgba(201,162,75,0.12)', border: '1px solid rgba(201,162,75,0.2)' }}>
                  <Icon size={15} className="text-gold" />
                </div>
                <p className="text-xs font-semibold text-white/45 leading-tight">
                  {t(`bookingTrust.${key}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
