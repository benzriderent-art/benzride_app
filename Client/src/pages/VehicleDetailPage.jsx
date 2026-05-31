import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Star, MessageCircle, CalendarDays, CheckCircle, Zap, Settings, Calendar } from 'lucide-react'
import { motorSlug, extractIdFromSlug } from '@/utils/slugify'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ImageCarousel from '@/components/common/ImageCarousel'
import { motorApi } from '@/api/motors'
import { bookingApi } from '@/api/bookings'
import { useCurrency } from '@/context/CurrencyContext'
import CurrencyToggle from '@/components/common/CurrencyToggle'
import { waLink } from '@/constants/contact'
import Animate from '@/components/common/Animate'

const CARD = {
  background: '#ffffff',
  border: '1px solid #E5E7EB',
  borderRadius: '16px',
}

export default function VehicleDetailPage() {
  const { slug } = useParams()
  const id = extractIdFromSlug(slug)
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { formatPrice } = useCurrency()

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
        <div className="min-h-screen flex items-center justify-center pt-16 bg-off-white">
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
        <div className="min-h-screen flex flex-col items-center justify-center pt-16 text-center px-4 bg-off-white">
          <p className="text-gray-400 mb-4">{t('detail.notFound')}</p>
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
      <div className="page-enter min-h-screen pt-16 bg-off-white">

        <Animate>
          <div className="py-8 border-b border-gray-200 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
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
                <span className="text-gray-600">{vehicle.name}</span>
              </div>

              <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
                  {vehicle.name}
                </h1>
                <span className={`shrink-0 text-xs font-black tracking-wider uppercase px-3 py-1.5 rounded-full ${
                  isAvailable
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
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
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200"
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
                  <span className="text-xs text-gray-400">{t('detail.ratingText')}</span>
                </div>
              </div>
            </div>
          </div>
        </Animate>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid lg:grid-cols-[3fr_2fr] gap-6 items-start">

            <Animate type="left">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl shadow-sm" style={{ aspectRatio: '4/3' }}>
                  <ImageCarousel images={vehicle.images ?? []} alt={vehicle.name} />
                </div>

                {upcomingRanges.length > 0 && (
                  <div style={CARD} className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <CalendarDays size={14} className="text-gold" />
                      <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{t('detail.bookedDates')}</p>
                    </div>
                    <div className="space-y-2">
                      {upcomingRanges.map((r, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 text-xs text-gray-500 rounded-xl px-3 py-2.5 bg-gray-50 border border-gray-200"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                          <span className="font-mono">{r.startDate}</span>
                          <span className="text-gray-300">→</span>
                          <span className="font-mono">{r.endDate}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-3">{t('detail.bookedDatesHint')}</p>
                  </div>
                )}

                <div style={CARD} className="p-5">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{t('detail.includes')}</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {t('detail.includesList', { returnObjects: true }).map((text) => (
                      <div key={text} className="flex items-center gap-2.5">
                        <CheckCircle size={14} className="text-gold shrink-0" />
                        <span className="text-sm text-gray-600">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Animate>

            <Animate type="right" delay={80}>
              <div className="space-y-4 lg:sticky lg:top-24">

                <div style={CARD} className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{t('detail.pricing')}</p>
                    <CurrencyToggle variant="light" />
                  </div>
                  <div className="space-y-2">
                    <div
                      className="flex items-center justify-between px-4 py-3.5 rounded-xl"
                      style={{ background: 'rgba(201,162,75,0.10)', border: '1px solid rgba(201,162,75,0.2)' }}
                    >
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">{t('detail.perDay')}</p>
                        <p className="text-gold font-black text-2xl leading-none">{formatPrice(vehicle.priceDay)}</p>
                      </div>
                      <span className="text-[10px] font-black text-gold/60 uppercase tracking-wider">{t('detail.perDayTag')}</span>
                    </div>

                    {vehicle.priceWeek > 0 && (
                      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500">{t('detail.perWeek')}</p>
                          <p className="text-charcoal font-bold text-base">{formatPrice(vehicle.priceWeek)}</p>
                        </div>
                        {savings(vehicle.priceWeek, vehicle.priceDay * 7) > 0 && (
                          <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-1 rounded-lg">
                            {t('detail.savePct', { pct: savings(vehicle.priceWeek, vehicle.priceDay * 7) })}
                          </span>
                        )}
                      </div>
                    )}

                    {vehicle.priceMonth > 0 && (
                      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500">{t('detail.perMonth')}</p>
                          <p className="text-charcoal font-bold text-base">{formatPrice(vehicle.priceMonth)}</p>
                        </div>
                        {savings(vehicle.priceMonth, vehicle.priceDay * 30) > 0 && (
                          <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-1 rounded-lg">
                            {t('detail.savePct', { pct: savings(vehicle.priceMonth, vehicle.priceDay * 30) })}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {isAvailable ? (
                    <Link
                      to={`/booking/${motorSlug(vehicle)}`}
                      className="w-full inline-flex items-center justify-center font-bold py-4 rounded-xl text-sm transition-all bg-gold text-charcoal hover:opacity-90 hover:shadow-lg hover:shadow-gold/20"
                    >
                      {t('detail.bookNow')}
                    </Link>
                  ) : (
                    <span className="w-full inline-flex items-center justify-center font-bold py-4 rounded-xl text-sm bg-gray-100 text-gray-400 cursor-not-allowed select-none">
                      {t('vehicles.notAvailable')}
                    </span>
                  )}
                  <a
                    href={waLink(waMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl text-sm transition-colors border border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                  >
                    <MessageCircle size={16} />
                    {t('detail.askWA')}
                  </a>
                </div>

                <p className="text-[11px] text-gray-400 text-center leading-relaxed">
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
