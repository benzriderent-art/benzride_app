import { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'
import { X, MessageCircle, Phone } from 'lucide-react'
import { formatIDR } from '@/utils/formatCurrency'
import { motorSlug } from '@/utils/slugify'
import ImageCarousel from '@/components/common/ImageCarousel'
import Animate from '@/components/common/Animate'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motorApi } from '@/api/motors'
import { waLink, PHONE_TEL } from '@/constants/contact'

const TYPE_FILTERS = [
  null,
  (v) => v.cc <= 115,
  (v) => v.cc > 115 && v.cc <= 130,
  (v) => v.name.toLowerCase().includes('pcx'),
  (v) => v.name.toLowerCase().includes('nmax'),
  (v) => v.name.toLowerCase().includes('adv'),
]

const DARK = '#111111'

export default function FleetPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [filterAvailable, setFilterAvailable] = useState(false)
  const [sortBy, setSortBy] = useState('default')
  const [search, setSearch] = useState('')

  const typeIdx = Number(searchParams.get('type') ?? 0)
  const typeLabels = t('hero.booking.motors', { returnObjects: true })
  const activeTypeLabel = typeIdx > 0 && Array.isArray(typeLabels) ? typeLabels[typeIdx] : null

  const clearType = () => {
    searchParams.delete('type')
    setSearchParams(searchParams)
  }

  useEffect(() => {
    motorApi.getAll()
      .then((data) => setVehicles(data.map((v) => ({ ...v, transmission: v.transmission?.toLowerCase() }))))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = filterAvailable ? vehicles.filter(v => v.available) : vehicles
    if (search.trim()) list = list.filter(v => v.name.toLowerCase().includes(search.toLowerCase()))
    const typeFn = TYPE_FILTERS[typeIdx]
    if (typeFn) list = list.filter(typeFn)
    if (sortBy === 'asc') return [...list].sort((a, b) => a.priceDay - b.priceDay)
    if (sortBy === 'desc') return [...list].sort((a, b) => b.priceDay - a.priceDay)
    return list
  }, [vehicles, filterAvailable, sortBy, typeIdx, search])

  const availableCount = vehicles.filter(v => v.available).length

  return (
    <>
      <Navbar />
      <main className="page-enter min-h-screen pt-16" style={{ background: DARK }}>

        {/* Header */}
        <div className="py-12" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 text-xs text-white/30 mb-4">
              <Link to="/" className="hover:text-gold transition-colors">{t('common.home')}</Link>
              <span>/</span>
              <span className="text-white/50">{t('vehicles.title')}</span>
            </div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-2">
                  {t('vehicles.title')}
                </p>
                <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white leading-[1.1]">
                  {t('vehicles.subtitle')}
                </h1>
              </div>
              {!loading && !error && (
                <p className="text-white/20 text-sm hidden sm:block shrink-0">
                  {t('vehicles.availableFleet', { count: availableCount })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sticky filter bar */}
        <div className="py-4 sticky top-16 z-40" style={{ background: DARK, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setFilterAvailable(false)}
                className={`text-xs font-bold px-4 py-2 rounded-full transition-colors ${
                  !filterAvailable ? 'bg-gold text-charcoal' : 'text-white/40 hover:text-white border border-white/10'
                }`}
              >
                {t('vehicles.filterAll')}
              </button>
              <button
                onClick={() => setFilterAvailable(true)}
                className={`text-xs font-bold px-4 py-2 rounded-full transition-colors ${
                  filterAvailable ? 'bg-gold text-charcoal' : 'text-white/40 hover:text-white border border-white/10'
                }`}
              >
                {t('vehicles.filterAvailable')}
              </button>
              {activeTypeLabel && (
                <button
                  onClick={clearType}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25 transition-colors"
                >
                  {activeTypeLabel}
                  <X size={11} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('vehicles.searchPlaceholder')}
                className="text-xs border text-white placeholder:text-white/25 rounded-lg px-3 py-2 focus:outline-none focus:border-gold flex-1 sm:flex-none sm:w-40"
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.10)' }}
              />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-xs font-bold border text-white/50 rounded-lg px-3 py-2 focus:outline-none focus:border-gold shrink-0"
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.10)' }}
              >
                <option value="default">{t('vehicles.sortDefault')}</option>
                <option value="asc">{t('vehicles.sortPriceAsc')}</option>
                <option value="desc">{t('vehicles.sortPriceDesc')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-3xl animate-pulse" style={{ aspectRatio: '3/4', background: 'rgba(255,255,255,0.06)' }} />
              ))}
            </div>
          )}
          {error && (
            <p className="text-center text-sm text-white/30 py-20">{t('vehicles.loadError')}</p>
          )}
          {!loading && !error && filtered.length === 0 && (
            <p className="text-center text-sm text-white/30 py-20">{t('vehicles.noResults')}</p>
          )}
          {!loading && !error && filtered.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((v, i) => (
                <Animate key={v.id} delay={i * 60}>
                  <div
                    className="group relative overflow-hidden rounded-3xl shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300 h-full"
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
                    <div className="absolute bottom-0 inset-x-0 p-5 pointer-events-none">
                      <div className="rounded-2xl p-4" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <p className="text-[10px] font-bold text-gold/60 tracking-wider uppercase mb-0.5">
                          {v.cc} CC · {t(`vehicles.${v.transmission ?? 'automatic'}`)} · {v.year}
                        </p>
                        <h2 className="font-heading text-xl font-bold text-white mb-3 leading-tight">{v.name}</h2>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[9px] text-white/35 uppercase tracking-wider">{t('vehicles.startFrom')}</p>
                            <p className="text-gold font-black text-xl leading-none">
                              {formatIDR(v.priceDay)}
                              <span className="text-white/35 text-xs font-normal ml-0.5">{t('vehicles.perDay')}</span>
                            </p>
                          </div>
                          {v.available ? (
                            <Link to={`/booking/${motorSlug(v)}`} className="pointer-events-auto text-xs font-bold px-4 py-2.5 rounded-xl bg-gold text-charcoal hover:opacity-90 transition-opacity">
                              {t('vehicles.rentNow')}
                            </Link>
                          ) : (
                            <span className="pointer-events-auto text-xs font-bold px-4 py-2.5 rounded-xl bg-white/10 text-white/25 cursor-not-allowed select-none">
                              {t('vehicles.notAvailable')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Animate>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Mini CTA Strip — LIGHT bridge sebelum footer */}
      <section className="py-16 bg-off-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">
            {t('fleetCta.badge')}
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal leading-[1.1] mb-4">
            {t('fleetCta.title')}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-md mx-auto">
            {t('fleetCta.desc')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 font-bold px-7 py-3.5 rounded-xl text-sm text-white hover:opacity-90 transition-opacity"
              style={{ background: '#25D366' }}
            >
              <MessageCircle size={17} />
              {t('fleetCta.whatsapp')}
            </a>
            <a
              href={PHONE_TEL}
              className="inline-flex items-center gap-2.5 bg-gold text-charcoal font-bold px-7 py-3.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
            >
              <Phone size={17} />
              {t('fleetCta.call')}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
