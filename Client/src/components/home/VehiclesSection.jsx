import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { formatIDR } from '@/utils/formatCurrency'
import { motorSlug } from '@/utils/slugify'
import ImageCarousel from '@/components/common/ImageCarousel'
import Animate from '@/components/common/Animate'
import { motorApi } from '@/api/motors'

export default function VehiclesSection() {
  const { t } = useTranslation()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    motorApi.getAll()
      .then((data) => setVehicles(data.map((v) => ({ ...v, transmission: v.transmission?.toLowerCase() }))))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const availableCount = vehicles.filter(v => v.available).length
  const displayed = vehicles.slice(0, 6)

  return (
    <section id="fleet" className="py-20 bg-charcoal">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <Animate className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-2">
              {t('vehicles.title')}
            </p>
            <h2 className="font-heading text-4xl font-bold text-white">
              {t('vehicles.subtitle')}
            </h2>
          </div>
          <Link
            to="/fleet"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-gold border border-gold/30 hover:bg-gold/10 px-4 py-2.5 rounded-xl transition-colors shrink-0"
          >
            {t('vehicles.viewAll')}
            <ArrowRight size={14} />
          </Link>
        </Animate>

        <Animate delay={60}>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5 py-3.5 rounded-2xl mb-10 text-xs text-white/50" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span><span className="text-gold font-bold mr-1">✓</span>{t('vehicles.trustHelmet')}</span>
            <span className="hidden sm:block text-white/15">·</span>
            <span><span className="text-gold font-bold mr-1">✓</span>{t('vehicles.trustDelivery')}</span>
            <span className="hidden sm:block text-white/15">·</span>
            <span><span className="text-gold font-bold mr-1">✓</span>{t('vehicles.trustMaintenance')}</span>
            <span className="hidden sm:block text-white/15">·</span>
            <span><span className="text-gold font-bold mr-1">✓</span>{t('vehicles.trustSupport')}</span>
          </div>
        </Animate>

        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-3xl animate-pulse" style={{ aspectRatio: '3/4', background: 'rgba(255,255,255,0.06)' }} />
            ))}
          </div>
        )}

        {error && (
          <p className="text-center text-sm text-white/30 py-10">{t('vehicles.loadError')}</p>
        )}

        {!loading && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayed.map((v, i) => (
              <Animate key={v.id} delay={i * 80}>
                <div
                  className={`group relative overflow-hidden rounded-3xl shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300 h-full ${i === 0 ? 'ring-2 ring-gold/40' : ''}`}
                  style={{ aspectRatio: '3/4' }}
                >
                  <Link to={`/booking/${motorSlug(v)}`} className="absolute inset-0">
                    <ImageCarousel images={v.images ?? []} alt={v.name} />
                  </Link>
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(160deg, rgba(201,162,75,0.18) 0%, rgba(0,0,0,0.80) 100%)' }} />
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <span className={`text-[9px] font-black tracking-[0.12em] uppercase px-2.5 py-1.5 rounded-full ${v.available ? 'bg-emerald-500 text-white' : 'bg-white/80 text-gray-500'}`}>
                      {v.available ? t('vehicles.availableBadge') : t('vehicles.notAvailableBadge')}
                    </span>
                  </div>
                  {i === 0 && (
                    <div className="absolute top-4 right-4 pointer-events-none">
                      <span className="text-[9px] font-black tracking-[0.08em] uppercase px-2.5 py-1.5 rounded-full bg-gold text-charcoal">
                        {t('vehicles.mostPopular')}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 p-5 pointer-events-none">
                    <div className="rounded-2xl p-4" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <p className="text-[10px] font-bold text-gold/60 tracking-wider uppercase mb-0.5">
                        {v.cc} CC · {t(`vehicles.${v.transmission ?? 'automatic'}`)} · {v.year}
                      </p>
                      <h3 className="font-heading text-xl font-bold text-white mb-3 leading-tight">{v.name}</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[9px] text-white/35 uppercase tracking-wider">{t('vehicles.startFrom')}</p>
                          <p className="text-gold font-black text-xl leading-none">
                            {formatIDR(v.priceDay)}
                            <span className="text-white/35 text-xs font-normal ml-0.5">{t('vehicles.perDay')}</span>
                          </p>
                        </div>
                        <Link
                          to={v.available ? `/booking/${motorSlug(v)}` : '#'}
                          className={`pointer-events-auto text-xs font-bold px-4 py-2.5 rounded-xl transition-colors ${v.available ? 'bg-gold text-charcoal hover:opacity-90' : 'bg-white/10 text-white/25 cursor-not-allowed'}`}
                        >
                          {v.available ? t('vehicles.rentNow') : t('vehicles.notAvailable')}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Animate>
            ))}
          </div>
        )}

        <Animate className="flex justify-center mt-8 sm:hidden" delay={160}>
          <Link to="/fleet" className="inline-flex items-center gap-2 text-sm font-bold text-white/40 hover:text-gold border border-white/10 hover:border-gold/40 px-6 py-3 rounded-xl transition-colors">
            {t('vehicles.viewAll')}
            <ArrowRight size={15} />
          </Link>
        </Animate>

      </div>
    </section>
  )
}
