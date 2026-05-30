import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Star, MessageCircle, CalendarDays, CheckCircle, Zap, Settings, Calendar } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ImageCarousel from '@/components/common/ImageCarousel'
import { motorApi } from '@/api/motors'
import { bookingApi } from '@/api/bookings'
import { formatIDR } from '@/utils/formatCurrency'
import { waLink } from '@/constants/contact'
import Animate from '@/components/common/Animate'

const CARD = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '16px',
}

export default function VehicleDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [bookedRanges, setBookedRanges] = useState([])

  useEffect(() => {
    Promise.allSettled([
      motorApi.getById(id),
      bookingApi.getBookedDates(id),
    ]).then(([mResult, dResult]) => {
      if (mResult.status === 'fulfilled') {
        const d = mResult.value
        setVehicle({ ...d, transmission: d.transmission?.toLowerCase() })
      } else {
        setError(true)
      }
      if (dResult.status === 'fulfilled') setBookedRanges(dResult.value)
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-16" style={{ background: '#111111' }}>
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    )
  }

  if (error || !vehicle) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center pt-16 text-center px-4" style={{ background: '#111111' }}>
          <p className="text-white/30 mb-4">{t('detail.notFound')}</p>
          <Link to="/fleet" className="text-sm font-semibold text-gold hover:underline">{t('detail.backToFleet')}</Link>
        </div>
        <Footer />
      </>
    )
  }

  const today = new Date().toISOString().split('T')[0]
  const isAvailable = vehicle.available && !bookedRanges.some(r => today >= r.startDate && today < r.endDate)
  const upcomingRanges = bookedRanges.filter(r => r.startDate > today).slice(0, 3)
  const waMsg = `Halo Benz Rental Bali, saya tertarik menyewa *${vehicle.name}*. Apakah tersedia? Mohon infonya, terima kasih!`

  const savings = (price, base) =>
    price > 0 && base > 0 && price < base ? Math.round((1 - price / base) * 100) : 0

  return (
    <>
      <Navbar />
      <div className="page-enter min-h-screen pt-16" style={{ background: '#111111' }}>

        <Animate>
        <div className="py-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 text-xs text-white/25 mb-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 hover:text-gold transition-colors"
              >
                <ArrowLeft size={12} />
                {t('common.back')}
              </button>
              <span>/</span>
              <Link to="/fleet" className="hover:text-gold transition-colors">{t('detail.fleet')}</Link>
              <span>/</span>
              <span className="text-white/50">{vehicle.name}</span>
            </div>

            <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white leading-tight">
                {vehicle.name}
              </h1>
              <span className={`shrink-0 text-xs font-black tracking-wider uppercase px-3 py-1.5 rounded-full ${
                isAvailable
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                  : 'bg-white/5 text-white/30 border border-white/10'
              }`}>
                {isAvailable ? t('detail.statusAvailable') : t('detail.statusUnavailable')}
              </span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {[
                { icon: Zap, label: `${vehicle.cc} CC` },
                { icon: Settings, label: t(`vehicles.${vehicle.transmission ?? 'automatic'}`) },
                { icon: Calendar, label: vehicle.year },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/50 px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <Icon size={11} className="text-gold" />
                  {label}
                </span>
              ))}
              <div className="flex items-center gap-1.5 ml-1">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} fill="#C9A24B" className="text-gold" />
                  ))}
                </div>
                <span className="text-xs text-white/30">{t('detail.ratingText')}</span>
              </div>
            </div>
          </div>
        </div>
        </Animate>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid lg:grid-cols-[3fr_2fr] gap-6 items-start">

            <Animate type="left">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl" style={{ aspectRatio: '4/3' }}>
                <ImageCarousel images={vehicle.images ?? []} alt={vehicle.name} />
              </div>

              {upcomingRanges.length > 0 && (
                <div style={CARD} className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarDays size={14} className="text-gold" />
                    <p className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">{t('detail.bookedDates')}</p>
                  </div>
                  <div className="space-y-2">
                    {upcomingRanges.map((r, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-xs text-white/50 rounded-xl px-3 py-2.5"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                        <span className="font-mono">{r.startDate}</span>
                        <span className="text-white/20">→</span>
                        <span className="font-mono">{r.endDate}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-white/25 mt-3">{t('detail.bookedDatesHint')}</p>
                </div>
              )}

              <div style={CARD} className="p-5">
                <p className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mb-4">{t('detail.includes')}</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {t('detail.includesList', { returnObjects: true }).map((text) => (
                    <div key={text} className="flex items-center gap-2.5">
                      <CheckCircle size={14} className="text-gold shrink-0" />
                      <span className="text-sm text-white/60">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </Animate>

            <Animate type="right" delay={80}>
            <div className="space-y-4 lg:sticky lg:top-24">

              <div style={CARD} className="p-5">
                <p className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mb-4">{t('detail.pricing')}</p>
                <div className="space-y-2">
                  <div
                    className="flex items-center justify-between px-4 py-3.5 rounded-xl"
                    style={{ background: 'rgba(201,162,75,0.12)', border: '1px solid rgba(201,162,75,0.2)' }}
                  >
                    <div>
                      <p className="text-xs text-white/40 mb-0.5">{t('detail.perDay')}</p>
                      <p className="text-gold font-black text-2xl leading-none">{formatIDR(vehicle.priceDay)}</p>
                    </div>
                    <span className="text-[10px] font-black text-gold/50 uppercase tracking-wider">{t('detail.perDayTag')}</span>
                  </div>

                  {vehicle.priceWeek > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <div>
                        <p className="text-xs text-white/35">{t('detail.perWeek')}</p>
                        <p className="text-white font-bold text-base">{formatIDR(vehicle.priceWeek)}</p>
                      </div>
                      {savings(vehicle.priceWeek, vehicle.priceDay * 7) > 0 && (
                        <span className="text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg">
                          {t('detail.perDayTag')} {savings(vehicle.priceWeek, vehicle.priceDay * 7)}%
                        </span>
                      )}
                    </div>
                  )}

                  {vehicle.priceMonth > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <div>
                        <p className="text-xs text-white/35">{t('detail.perMonth')}</p>
                        <p className="text-white font-bold text-base">{formatIDR(vehicle.priceMonth)}</p>
                      </div>
                      {savings(vehicle.priceMonth, vehicle.priceDay * 30) > 0 && (
                        <span className="text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg">
                          {t('detail.perDayTag')} {savings(vehicle.priceMonth, vehicle.priceDay * 30)}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {isAvailable ? (
                  <Link
                    to={`/booking/${vehicle.id}`}
                    className="w-full inline-flex items-center justify-center font-bold py-4 rounded-xl text-sm transition-all bg-gold text-charcoal hover:opacity-90 hover:shadow-lg hover:shadow-gold/20"
                  >
                    {t('detail.bookNow')}
                  </Link>
                ) : (
                  <span className="w-full inline-flex items-center justify-center font-bold py-4 rounded-xl text-sm bg-white/5 text-white/20 cursor-not-allowed select-none">
                    {t('vehicles.notAvailable')}
                  </span>
                )}
                <a
                  href={waLink(waMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl text-sm transition-colors"
                  style={{ border: '1px solid rgba(37,211,102,0.3)', color: '#25D366' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <MessageCircle size={16} />
                  {t('detail.askWA')}
                </a>
              </div>

              <p className="text-[11px] text-white/20 text-center leading-relaxed">
                {t('detail.disclaimer')}
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
