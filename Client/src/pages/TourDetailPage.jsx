import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ArrowLeft, MapPin, Clock, Users, CheckCircle, MessageCircle, CalendarDays, User, Phone, FileText, ChevronRight, AlertCircle, Shield, Headphones, Star, ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Animate from '@/components/common/Animate'
import { tourApi, tourBookingApi } from '@/api/tours'
import { formatIDR } from '@/utils/formatCurrency'
import { getTourImageUrls, getTourFirstImage } from '@/utils/tourImages'
import { waLink } from '@/constants/contact'
import { tourSlug, extractIdFromSlug } from '@/utils/slugify'


const CATEGORY_LABELS = {
  CULTURAL: { id: 'Budaya', en: 'Cultural' },
  NATURE:   { id: 'Alam', en: 'Nature' },
  SUNRISE:  { id: 'Sunrise', en: 'Sunrise' },
  BEACH:    { id: 'Pantai', en: 'Beach' },
}

function buildWAMessage(tour, form, total, isID) {
  return `Halo Benz Rental Bali, saya ingin memesan guided tour:

Tour: ${tour.name}
Tanggal: ${form.tourDate}
Jumlah Peserta: ${form.participants} orang
Total Harga: ${formatIDR(total)}

Nama: ${form.name}
No. WhatsApp: ${form.phone}
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

const today = new Date().toISOString().split('T')[0]

export default function TourDetailPage() {
  const { slug } = useParams()
  const id = extractIdFromSlug(slug)
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const isID = i18n.language === 'id'
  const lang = isID ? 'id' : 'en'

  const [tour, setTour] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [otherTours, setOtherTours] = useState([])

  const [activeImg, setActiveImg] = useState(0)
  const [form, setForm] = useState({ tourDate: '', participants: 1, name: '', phone: '', notes: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    tourApi.getById(id)
      .then(data => setTour(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
    tourApi.getAll()
      .then(data => setOtherTours(data.filter(t => t.available && String(t.id) !== String(id)).slice(0, 3)))
      .catch(() => {})
  }, [id])

  const totalPrice = tour ? form.participants * tour.pricePerPerson : 0
  const images = getTourImageUrls(tour)

  const validate = (f = form) => {
    const errs = {}
    if (!f.tourDate) errs.tourDate = isID ? 'Wajib diisi' : 'Required'
    if (!f.name.trim()) errs.name = isID ? 'Wajib diisi' : 'Required'
    if (!f.phone.trim()) errs.phone = isID ? 'Wajib diisi' : 'Required'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const updated = { ...form, [name]: name === 'participants' ? Math.max(1, parseInt(value) || 1) : value }
    setForm(updated)
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validate(updated)[name] }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    setErrors(prev => ({ ...prev, [name]: validate(form)[name] }))
  }

  const hasError = (field) => !!(errors[field] && touched[field])

  const fieldClass = (field) => {
    const val = form[field]
    const filled = typeof val === 'string' ? val.trim().length > 0 : !!val
    const base = 'w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 transition-colors focus:outline-none bg-white/[0.05] border focus:border-gold '
    if (hasError(field)) return base + 'border-red-400/50'
    if (filled) return base + 'border-gold/40'
    return base + 'border-white/10'
  }

  const handleBook = async () => {
    const allTouched = { tourDate: true, name: true, phone: true }
    setTouched(allTouched)
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      toast.error(isID ? 'Lengkapi data terlebih dahulu.' : 'Please fill in all required fields.')
      return
    }
    setSubmitting(true)
    try {
      await tourBookingApi.create({
        tourId: tour.id,
        customerName: form.name,
        customerPhone: form.phone,
        tourDate: form.tourDate,
        participants: form.participants,
        notes: form.notes,
      })
    } catch {
      // tetap buka WhatsApp meski gagal simpan
    } finally {
      setSubmitting(false)
    }
    window.open(waLink(buildWAMessage(tour, form, totalPrice, isID)), '_blank')
  }

  if (loading) {
    return (
      <>
        <title>Benz Rental Bali</title>
        <Navbar />
        <div className="min-h-screen bg-charcoal-800 pt-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
            <div className="h-4 w-32 rounded mb-6" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="grid lg:grid-cols-[1fr_400px] gap-8">
              <div className="space-y-6">
                <div className="aspect-video rounded-2xl" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="h-7 w-3/4 rounded" style={{ background: 'rgba(255,255,255,0.10)' }} />
                  <div className="h-3 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <div className="h-3 w-4/5 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
                </div>
              </div>
              <div className="rounded-2xl p-6 space-y-4 h-fit" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="h-7 w-28 rounded" style={{ background: 'rgba(255,255,255,0.10)' }} />
                <div className="h-3 w-40 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <div className="h-3 w-24 rounded mb-2" style={{ background: 'rgba(255,255,255,0.06)' }} />
                    <div className="h-10 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  </div>
                ))}
                <div className="h-12 rounded-xl mt-2" style={{ background: 'rgba(255,255,255,0.10)' }} />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (notFound || !tour) {
    return (
      <>
        <title>{isID ? 'Tour Tidak Ditemukan – Benz Rental Bali' : 'Tour Not Found – Benz Rental Bali'}</title>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center pt-16 px-4 text-center bg-charcoal">
          <h2 className="font-heading text-2xl font-bold text-white mb-2">
            {isID ? 'Tour tidak ditemukan' : 'Tour not found'}
          </h2>
          <Link to="/tours" className="mt-4 text-sm text-gold font-semibold hover:underline flex items-center gap-1">
            <ArrowLeft size={14} /> {isID ? 'Kembali ke Tours' : 'Back to Tours'}
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  const catLabel = CATEGORY_LABELS[tour.category]?.[lang] ?? tour.category

  // Pick bilingual content — fallback to ID if EN not set
  const tName        = isID ? tour.name        : (tour.nameEn        || tour.name)
  const tDescription = isID ? tour.description : (tour.descriptionEn || tour.description)
  const tIncludes    = isID ? tour.includes    : (tour.includesEn?.length    ? tour.includesEn    : tour.includes)
  const tHighlights  = isID ? tour.highlights  : (tour.highlightsEn?.length  ? tour.highlightsEn  : tour.highlights)
  const tItinerary   = isID ? tour.itinerary   : (tour.itineraryEn?.length   ? tour.itineraryEn   : tour.itinerary)
  const tWhatToBring = isID ? tour.whatToBring : (tour.whatToBringEn?.length ? tour.whatToBringEn : tour.whatToBring)

  return (
    <>
      <title>{tName} – Benz Rental Bali</title>
      <meta name="description" content={tDescription} />
      <Navbar />

      <div className="page-enter min-h-screen bg-charcoal-800 pt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-white/35 hover:text-gold transition-colors mb-6"
          >
            <ArrowLeft size={15} />
            {isID ? 'Kembali ke Tours' : 'Back to Tours'}
          </button>

          <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">

            {/* Kiri: Info Tour */}
            <div className="space-y-6">
              {/* Gallery */}
              <div className="rounded-2xl overflow-hidden shadow-sm">
                <img
                  src={images[activeImg]}
                  alt={tName}
                  className="w-full aspect-video object-cover"
                />
                {images.length > 1 && (
                  <div className="flex gap-2 p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                          i === activeImg ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Detail */}
              <Animate type="up">
                <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-gold/10 text-gold">
                      {catLabel}
                    </span>
                    {!tour.available && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-50 text-red-500">
                        {isID ? 'Tidak Tersedia' : 'Unavailable'}
                      </span>
                    )}
                  </div>

                  <h1 className="font-heading text-3xl font-bold text-white mb-3">{tName}</h1>

                  <div className="flex flex-wrap gap-4 text-sm text-white/40 mb-5">
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-gold" />
                      {tour.durationHours} {isID ? 'jam' : 'hours'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-gold" />
                      {tour.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users size={14} className="text-gold" />
                      {isID ? `Maks ${tour.maxParticipants} orang` : `Max ${tour.maxParticipants} people`}
                    </span>
                  </div>

                  <p className="text-gray-600 leading-relaxed">{tDescription}</p>
                </div>
              </Animate>

              {/* Highlights */}
              {tHighlights?.length > 0 && (
                <Animate type="up" delay={60}>
                  <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <h2 className="font-heading font-bold text-white text-lg mb-4">
                      {isID ? 'Highlight' : 'Highlights'}
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {tHighlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-sm text-white/50">
                          <ChevronRight size={14} className="text-gold shrink-0" />
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                </Animate>
              )}

              {/* Includes */}
              {tIncludes?.length > 0 && (
                <Animate type="up" delay={80}>
                  <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <h2 className="font-heading font-bold text-white text-lg mb-4">
                      {isID ? 'Sudah Termasuk' : 'What\'s Included'}
                    </h2>
                    <div className="space-y-2.5">
                      {tIncludes.map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-sm text-white/50">
                          <CheckCircle size={14} className="text-gold shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </Animate>
              )}

              {/* Itinerary */}
              {tItinerary?.length > 0 && (
                <Animate type="up" delay={100}>
                  <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <h2 className="font-heading font-bold text-white text-lg mb-5">
                      {isID ? 'Jadwal Perjalanan' : 'Itinerary'}
                    </h2>
                    <div className="relative">
                      <div className="absolute left-[52px] top-3 bottom-3 w-px bg-white/10" />
                      <div className="space-y-4">
                        {tItinerary.map((step, i) => {
                          const [time, ...rest] = step.split(' | ')
                          const activity = rest.join(' | ')
                          return (
                            <div key={i} className="flex gap-4 items-start">
                              <span className="text-xs font-black text-gold/80 w-12 shrink-0 pt-0.5 text-right">
                                {time}
                              </span>
                              <div className="w-2 h-2 rounded-full bg-gold mt-1.5 shrink-0 relative z-10" />
                              <p className="text-sm text-white/50 leading-relaxed">{activity}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </Animate>
              )}

              {/* Info Praktis */}
              {(tWhatToBring?.length > 0 || tour.guideLanguage || tour.minBookingHours) && (
                <Animate type="up" delay={120}>
                  <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <h2 className="font-heading font-bold text-white text-lg mb-4">
                      {isID ? 'Info Praktis' : 'Good to Know'}
                    </h2>
                    <div className="space-y-5">
                      {tour.guideLanguage && (
                        <div>
                          <p className="text-xs font-black text-gold/80 uppercase tracking-widest mb-1.5">
                            {isID ? 'Bahasa Guide' : 'Guide Language'}
                          </p>
                          <p className="text-sm text-gray-600">{tour.guideLanguage}</p>
                        </div>
                      )}
                      {tour.minBookingHours && (
                        <div>
                          <p className="text-xs font-black text-gold/80 uppercase tracking-widest mb-1.5">
                            {isID ? 'Minimal Booking' : 'Minimum Notice'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {tour.minBookingHours} {isID ? 'jam sebelum keberangkatan' : 'hours before departure'}
                          </p>
                        </div>
                      )}
                      {tWhatToBring?.length > 0 && (
                        <div>
                          <p className="text-xs font-black text-gold uppercase tracking-widest mb-2">
                            {isID ? 'Yang Perlu Dibawa' : 'What to Bring'}
                          </p>
                          <div className="space-y-1.5">
                            {tWhatToBring.map((item, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm text-white/50">
                                <span className="text-gold">·</span>
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Animate>
              )}
            </div>

            {/* Kanan: Form Booking */}
            <div className="lg:sticky lg:top-24">
              <Animate type="right" delay={80}>
                <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-2xl font-black text-gold">{formatIDR(tour.pricePerPerson)}</p>
                    <span className="text-xs text-white/30">/ {isID ? 'orang' : 'person'}</span>
                  </div>
                  <p className="text-xs text-white/30 mb-6">{isID ? 'Harga sudah termasuk guide & motor' : 'Price includes guide & motorcycle'}</p>

                  <div className="space-y-4">
                    <div>
                      <Label icon={CalendarDays} text={isID ? 'Tanggal Tour' : 'Tour Date'} required />
                      <input
                        type="date"
                        name="tourDate"
                        min={today}
                        value={form.tourDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={fieldClass('tourDate')}
                      />
                      {hasError('tourDate') && <p className="text-xs text-red-500 mt-1">{errors.tourDate}</p>}
                    </div>

                    <div>
                      <Label icon={Users} text={isID ? 'Jumlah Peserta' : 'Participants'} required />
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button
                          type="button"
                          onClick={() => setForm(f => ({ ...f, participants: Math.max(1, f.participants - 1) }))}
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-white/15 text-white/50 font-bold hover:border-gold hover:text-gold transition-colors flex items-center justify-center text-base sm:text-lg shrink-0"
                        >
                          −
                        </button>
                        <span className="flex-1 text-center font-bold text-white text-lg">{form.participants}</span>
                        <button
                          type="button"
                          onClick={() => setForm(f => ({ ...f, participants: Math.min(tour.maxParticipants, f.participants + 1) }))}
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-white/15 text-white/50 font-bold hover:border-gold hover:text-gold transition-colors flex items-center justify-center text-base sm:text-lg shrink-0"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-xs text-white/30 mt-1.5 text-center">
                        {isID ? `Maks ${tour.maxParticipants} orang` : `Max ${tour.maxParticipants} people`}
                      </p>
                    </div>

                    <div>
                      <Label icon={User} text={isID ? 'Nama Lengkap' : 'Full Name'} required />
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={isID ? 'Nama kamu' : 'Your name'}
                        className={fieldClass('name')}
                      />
                      {hasError('name') && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <Label icon={Phone} text={isID ? 'No. WhatsApp' : 'WhatsApp Number'} required />
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="+62 8xx xxxx xxxx"
                        className={fieldClass('phone')}
                      />
                      {hasError('phone') && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <Label icon={FileText} text={isID ? 'Catatan' : 'Notes'} />
                      <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        rows={2}
                        placeholder={isID ? 'Permintaan khusus, dll.' : 'Special requests, etc.'}
                        className={`${fieldClass('notes')} resize-none`}
                      />
                    </div>

                    {/* Total */}
                    <div className="rounded-xl p-4 bg-gold/5 border border-gold/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/60 font-medium">
                          {form.participants} × {formatIDR(tour.pricePerPerson)}
                        </span>
                        <span className="text-xl font-black text-gold">{formatIDR(totalPrice)}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleBook}
                      disabled={submitting || !tour.available}
                      className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: '#25D366' }}
                    >
                      <MessageCircle size={18} />
                      {submitting
                        ? (isID ? 'Memproses...' : 'Processing...')
                        : (isID ? 'Pesan via WhatsApp' : 'Book via WhatsApp')}
                    </button>

                    <div className="flex items-start gap-2 text-xs text-white/35 leading-relaxed">
                      <AlertCircle size={11} className="text-gold mt-0.5 shrink-0" />
                      {isID
                        ? 'Tim kami akan konfirmasi ketersediaan dan detail pick-up via WhatsApp di hari yang sama.'
                        : 'Our team will confirm availability and pick-up details via WhatsApp on the same day.'}
                    </div>
                  </div>
                </div>
              </Animate>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Bar — dark */}
      <div className="bg-charcoal">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { icon: Users,      text: isID ? 'Guide lokal berpengalaman' : 'Experienced local guide' },
              { icon: Shield,     text: isID ? 'Motor & perlengkapan lengkap' : 'Full gear & equipment' },
              { icon: Headphones, text: isID ? 'Konfirmasi hari yang sama' : 'Same-day confirmation' },
              { icon: Star,       text: isID ? 'Rating 4.9 / 5 bintang' : '4.9 / 5 star rating' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center" style={{ background: 'rgba(201,162,75,0.15)', border: '1px solid rgba(201,162,75,0.25)' }}>
                  <Icon size={15} className="text-gold" />
                </div>
                <p className="text-xs font-semibold text-white/60 leading-tight">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Other Tours */}
      {otherTours.length > 0 && (
        <div className="bg-charcoal-800 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <Animate className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-2">
                  {isID ? 'Jelajahi Lebih Banyak' : 'Explore More'}
                </p>
                <h2 className="font-heading text-2xl font-bold text-white">
                  {isID ? 'Tour Lainnya' : 'Other Tours'}
                </h2>
              </div>
              <Link
                to="/tours"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-gold border border-gold/40 hover:bg-gold/5 px-3 py-2 rounded-xl transition-colors shrink-0"
              >
                {isID ? 'Lihat Semua' : 'View All'}
                <ArrowRight size={12} />
              </Link>
            </Animate>

            <div className="grid sm:grid-cols-3 gap-5">
              {otherTours.map((ot, idx) => {
                const img = getTourFirstImage(ot)
                return (
                  <Animate key={ot.id} type="up" delay={idx * 60}>
                    <Link
                      to={`/tours/${tourSlug(ot)}`}
                      className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={img}
                          alt={ot.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-heading font-bold text-white text-sm leading-tight mb-2 group-hover:text-gold transition-colors">
                          {ot.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-[11px] text-white/30">
                            <span className="flex items-center gap-1"><Clock size={10} className="text-gold" />{ot.durationHours} {isID ? 'jam' : 'hrs'}</span>
                            <span className="flex items-center gap-1"><MapPin size={10} className="text-gold" />{ot.location}</span>
                          </div>
                          <span className="text-xs font-black text-gold">{formatIDR(ot.pricePerPerson)}</span>
                        </div>
                      </div>
                    </Link>
                  </Animate>
                )
              })}
            </div>

            <Animate className="mt-6 sm:hidden text-center">
              <Link
                to="/tours"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gold border border-gold/40 hover:bg-gold/5 px-4 py-2 rounded-xl transition-colors"
              >
                {isID ? 'Lihat Semua Tour' : 'View All Tours'}
                <ArrowRight size={12} />
              </Link>
            </Animate>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
