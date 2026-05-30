import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, MessageCircle, Star, Bike, AlertCircle, CalendarDays, MapPin, User, Phone, FileText, CreditCard, CheckCircle } from 'lucide-react'
import ImageCarousel from '@/components/common/ImageCarousel'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motorApi } from '@/api/motors'
import { bookingApi } from '@/api/bookings'
import { formatIDR } from '@/utils/formatCurrency'
import { calculateBookingPrice, getPriceBreakdown } from '@/utils/pricingEngine'
import { waLink } from '@/constants/contact'
import Animate from '@/components/common/Animate'

const CARD = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '16px',
}

function buildWAMessage(vehicle, form, duration, total) {
  return `Halo Benz Rental Bali, saya ingin memesan motor:

Motor: ${vehicle.name}
Tanggal Mulai: ${form.startDate}
Tanggal Selesai: ${form.endDate}
Durasi: ${duration} hari
Total Harga: ${formatIDR(total)}

Nama: ${form.name}
No. WhatsApp: ${form.phone}
Lokasi Pengiriman: ${form.deliveryLocation}
${form.notes ? `Catatan: ${form.notes}` : ''}

Mohon konfirmasi ketersediaan. Terima kasih!`
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
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [vehicle, setVehicle] = useState(null)
  const [vehicleLoading, setVehicleLoading] = useState(true)
  const [vehicleError, setVehicleError] = useState(false)
  const [bookedRanges, setBookedRanges] = useState([])

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    startDate: '',
    endDate: '',
    name: '',
    phone: '',
    deliveryLocation: '',
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

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
    return days >= 1 ? days : null
  }

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
      if (d < 1) errs.endDate = t('booking.invalidDate')
      else if (hasOverlap(f.startDate, f.endDate)) errs.endDate = t('booking.dateConflict')
    }
    if (!f.name.trim()) errs.name = t('booking.required')
    if (!f.phone.trim()) errs.phone = t('booking.required')
    if (!f.deliveryLocation.trim()) errs.deliveryLocation = t('booking.required')
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const updated = { ...form, [name]: value }
    setForm(updated)
    if (touched) setErrors(validate(updated))
  }

  const handleWAOrder = () => {
    setTouched(true)
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    window.open(waLink(buildWAMessage(vehicle, form, duration, totalPrice)), '_blank')
  }

  const handleXenditPay = async () => {
    setTouched(true)
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
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
    } finally {
      setSubmitting(false)
    }
  }

  const fieldClass = (field) =>
    `w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 transition-colors focus:outline-none ` +
    `bg-white/[0.05] ` +
    (errors[field]
      ? 'border border-red-500/40 focus:border-red-400'
      : 'border border-white/10 focus:border-gold')

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
          <Link to="/#fleet" className="bg-gold text-charcoal font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
            {t('booking.backToFleet')}
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="page-enter min-h-screen pt-16" style={darkBg}>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-white/30 hover:text-gold transition-colors mb-8"
          >
            <ArrowLeft size={15} />
            {t('bookingPage.back')}
          </button>

          <div className="grid lg:grid-cols-[5fr_7fr] gap-6 items-start">

            <Animate type="left">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div style={CARD} className="overflow-hidden">
                <div className="aspect-[4/3]">
                  <ImageCarousel images={vehicle.images ?? []} alt={vehicle.name} />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-heading font-bold text-white text-xl leading-tight">{vehicle.name}</h3>
                    <span className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shrink-0 ${
                      vehicle.available
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : 'bg-white/5 text-white/25 border border-white/10'
                    }`}>
                      {vehicle.available ? t('bookingPage.available') : t('bookingPage.full')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap mt-2 mb-4">
                    {[`${vehicle.cc} CC`, t(`vehicles.${vehicle.transmission ?? 'automatic'}`), String(vehicle.year)].map(s => (
                      <span
                        key={s}
                        className="text-[10px] font-semibold text-white/35 px-2 py-1 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-1.5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {[
                      { key: 'perDay', price: vehicle.priceDay },
                      { key: 'perWeek', price: vehicle.priceWeek },
                      { key: 'perMonth', price: vehicle.priceMonth },
                    ].filter(r => r.price > 0).map(({ key, price }) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-white/30">{t(`bookingPage.${key}`)}</span>
                        <span className="font-semibold text-white/70">{formatIDR(price)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} fill="#C9A24B" className="text-gold" />
                    ))}
                    <span className="text-xs text-white/25 ml-1">{t('bookingPage.ratingText')}</span>
                  </div>
                </div>
              </div>

              <div style={CARD} className="p-4">
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
            </Animate>

            <Animate type="right" delay={80}>
            <div style={CARD} className="p-6 sm:p-8">
              {!vehicle.available && (
                <div
                  className="flex items-start gap-3 rounded-xl px-4 py-3.5 mb-6"
                  style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}
                >
                  <AlertCircle size={15} className="text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-amber-300">{t('bookingPage.unavailableTitle')}</p>
                    <p className="text-xs text-amber-400/70 mt-0.5 leading-relaxed">
                      {t('bookingPage.unavailableDesc')}
                    </p>
                    <a
                      href={waLink(`Halo, saya tertarik menyewa ${vehicle.name} tapi terlihat tidak tersedia. Apakah ada slot kosong?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors"
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
                        className={fieldClass('startDate')}
                        style={{ colorScheme: 'dark' }}
                      />
                      {errors.startDate && <p className="text-xs text-red-400 mt-1.5">{errors.startDate}</p>}
                    </div>
                    <div>
                      <Label icon={CalendarDays} text={t('booking.endDate')} required />
                      <input
                        type="date"
                        name="endDate"
                        min={form.startDate || today}
                        value={form.endDate}
                        onChange={handleChange}
                        className={fieldClass('endDate')}
                        style={{ colorScheme: 'dark' }}
                      />
                      {errors.endDate && <p className="text-xs text-red-400 mt-1.5">{errors.endDate}</p>}
                    </div>
                  </div>
                </div>

                {duration && totalPrice ? (
                  <div
                    className="rounded-xl p-4"
                    style={{ background: 'rgba(201,162,75,0.08)', border: '1px solid rgba(201,162,75,0.15)' }}
                  >
                    <p className="text-xs font-black text-gold/60 uppercase tracking-[0.2em] mb-3">{t('booking.priceCalc')}</p>
                    <div className="space-y-1.5 mb-3">
                      {priceLines.map((line, i) => (
                        <div key={i} className="flex items-center justify-between text-sm text-white/50">
                          <span>{line.qty} {line.unit} × {formatIDR(line.price)}</span>
                          <span className="font-semibold text-white/70">{formatIDR(line.qty * line.price)}</span>
                        </div>
                      ))}
                    </div>
                    <div
                      className="flex items-center justify-between pt-3"
                      style={{ borderTop: '1px solid rgba(201,162,75,0.2)' }}
                    >
                      <span className="text-sm font-bold text-white/60">{t('booking.total')}</span>
                      <span className="text-2xl font-black text-gold">{formatIDR(totalPrice)}</span>
                    </div>
                  </div>
                ) : (
                  <div
                    className="rounded-xl px-4 py-3.5 text-center"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.08)' }}
                  >
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
                        placeholder="Nama sesuai KTP / Passport"
                        className={fieldClass('name')}
                      />
                      {errors.name && <p className="text-xs text-red-400 mt-1.5">{errors.name}</p>}
                    </div>

                    <div>
                      <Label icon={Phone} text={t('booking.phone')} required />
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="08xxxxxxxxxx"
                        className={fieldClass('phone')}
                      />
                      {errors.phone && <p className="text-xs text-red-400 mt-1.5">{errors.phone}</p>}
                    </div>

                    <div>
                      <Label icon={MapPin} text={t('booking.deliveryLoc')} required />
                      <textarea
                        name="deliveryLocation"
                        value={form.deliveryLocation}
                        onChange={handleChange}
                        rows={2}
                        placeholder={t('booking.deliveryPlaceholder')}
                        className={`${fieldClass('deliveryLocation')} resize-none`}
                      />
                      {errors.deliveryLocation && <p className="text-xs text-red-400 mt-1.5">{errors.deliveryLocation}</p>}
                    </div>

                    <div>
                      <Label icon={FileText} text={t('booking.notes')} />
                      <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Contoh: tiba malam hari, butuh helm anak-anak, dll."
                        className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 transition-colors focus:outline-none bg-white/[0.05] border border-white/10 focus:border-gold resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-7 space-y-3">
                <button
                  onClick={handleWAOrder}
                  disabled={!vehicle.available}
                  className="w-full inline-flex items-center justify-center gap-2.5 font-bold py-4 rounded-xl text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: '#25D366', color: '#fff' }}
                  onMouseEnter={e => { if (vehicle.available) e.currentTarget.style.opacity = '0.9' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                >
                  <MessageCircle size={18} />
                  {t('booking.orderWA')}
                </button>

                <button
                  onClick={handleXenditPay}
                  disabled={submitting || !vehicle.available}
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-gold text-charcoal font-bold py-4 rounded-xl text-sm transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <CreditCard size={18} />
                  {submitting ? t('bookingPage.processing') : t('booking.payXendit')}
                </button>

                {submitError && (
                  <div
                    className="flex items-center gap-2 rounded-xl px-4 py-3"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                  >
                    <AlertCircle size={13} className="text-red-400 shrink-0" />
                    <p className="text-xs text-red-400">{submitError}</p>
                  </div>
                )}
              </div>

              <div
                className="mt-5 rounded-xl p-4"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
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
      <Footer />
    </>
  )
}
