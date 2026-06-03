import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  MapPin, Clock, Users, ChevronRight, Search,
  MessageCircle, Star, ArrowDown, Shield, Headphones,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Animate from '@/components/common/Animate'
import { tourApi } from '@/api/tours'
import { formatIDR } from '@/utils/formatCurrency'
import { waLink } from '@/constants/contact'
import { getTourFirstImage } from '@/utils/tourImages'
import { tourSlug } from '@/utils/slugify'

const CATEGORY_KEYS = ['ALL', 'CULTURAL', 'NATURE', 'SUNRISE', 'BEACH']

const CATEGORY_LABELS = {
  ALL:      { id: 'Semua',   en: 'All' },
  CULTURAL: { id: 'Budaya',  en: 'Cultural' },
  NATURE:   { id: 'Alam',    en: 'Nature' },
  SUNRISE:  { id: 'Sunrise', en: 'Sunrise' },
  BEACH:    { id: 'Pantai',  en: 'Beach' },
}

const CATEGORY_EMOJI = {
  CULTURAL: '🏛️',
  NATURE:   '🌿',
  SUNRISE:  '🌅',
  BEACH:    '🏖️',
}

const TOUR_REVIEWS = [
  {
    name: 'Marco V.',
    origin: 'Milan, Italy',
    rating: 5,
    text: {
      id: 'Sunrise Kintamani benar-benar luar biasa! Guide sangat profesional dan tahu semua spot terbaik. Pengalaman yang tidak terlupakan.',
      en: 'Kintamani Sunrise was absolutely breathtaking! The guide knew every perfect spot and the whole experience felt totally personal.',
    },
    tour: { id: 'Kintamani Sunrise Tour', en: 'Kintamani Sunrise Tour' },
  },
  {
    name: 'Sophie W.',
    origin: 'Amsterdam, Netherlands',
    rating: 5,
    text: {
      id: 'Tur Ubud naik motor jauh lebih seru dari naik mobil. Kami menemukan pura-pura tersembunyi yang tidak ada di peta wisata biasa!',
      en: 'Exploring Ubud by motorcycle was so much more fun than a car tour. We discovered hidden temples I never would have found alone.',
    },
    tour: { id: 'Ubud Cultural Tour', en: 'Ubud Cultural Tour' },
  },
  {
    name: 'Andi P.',
    origin: 'Jakarta, Indonesia',
    rating: 5,
    text: {
      id: 'Pantai tersembunyi yang dikunjungi benar-benar menakjubkan. Tidak ada turis lain — rasanya punya pantai sendiri!',
      en: 'The hidden beaches were absolutely stunning. Zero crowds — felt like we had the whole coast to ourselves.',
    },
    tour: { id: 'East Bali Beach Tour', en: 'East Bali Beach Tour' },
  },
]

function Stars({ count = 5, size = 12 }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(count)].map((_, i) => (
        <Star key={i} size={size} fill="#C9A24B" className="text-gold" />
      ))}
    </div>
  )
}

function FeaturedTourCard({ tour, lang }) {
  const isID = lang === 'id'
  const img = getTourFirstImage(tour)
  const name        = isID ? tour.name        : (tour.nameEn        || tour.name)
  const description = isID ? tour.description : (tour.descriptionEn || tour.description)
  const includes    = isID ? tour.includes    : (tour.includesEn?.length ? tour.includesEn : tour.includes)

  return (
    <Animate type="up">
      <Link
        to={`/tours/${tourSlug(tour)}`}
        className="group relative flex flex-col sm:flex-row rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,162,75,0.25)', boxShadow: '0 4px 24px rgba(201,162,75,0.07)' }}
      >
        {/* Image */}
        <div className="relative sm:w-72 aspect-[4/3] sm:aspect-auto overflow-hidden shrink-0">
          <img
            src={img}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full text-white backdrop-blur-sm"
              style={{ background: 'rgba(201,162,75,0.9)' }}
            >
              🔥 {isID ? 'Terpopuler' : 'Best Seller'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6">
          <span className="text-xs font-bold text-gold/70 mb-1.5">
            {CATEGORY_EMOJI[tour.category]} {CATEGORY_LABELS[tour.category]?.[lang]}
          </span>
          <h3 className="font-heading font-bold text-white text-xl leading-tight mb-2 group-hover:text-gold transition-colors">
            {name}
          </h3>

          {description && (
            <p className="text-sm text-white/45 leading-relaxed mb-3 line-clamp-2">{description}</p>
          )}

          <div className="flex items-center gap-1.5 mb-3">
            <Stars count={5} size={11} />
            <span className="text-xs font-bold text-white/60">4.9</span>
            <span className="text-[10px] text-white/25">· 50+ {isID ? 'ulasan' : 'reviews'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-white/35 mb-3">
            <span className="flex items-center gap-1.5">
              <Clock size={12} className="text-gold" />
              {tour.durationHours} {isID ? 'jam' : 'hours'}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={12} className="text-gold" />
              {tour.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={12} className="text-gold" />
              {isID ? `Maks ${tour.maxParticipants} orang` : `Max ${tour.maxParticipants} people`}
            </span>
          </div>

          {includes?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {includes.slice(0, 4).map((item, i) => (
                <span key={i} className="text-[10px] font-semibold text-gold/80 bg-gold/8 px-2 py-0.5 rounded-full border border-gold/15">
                  ✓ {item.split(' ').slice(0, 2).join(' ')}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div>
              <p className="text-[10px] text-white/30 font-medium uppercase tracking-wide">
                {isID ? 'Mulai dari' : 'Starting from'}
              </p>
              <p className="text-2xl font-black text-gold">{formatIDR(tour.pricePerPerson)}</p>
              <p className="text-[10px] text-white/30">/ {isID ? 'orang' : 'person'}</p>
            </div>
            <div className="flex items-center gap-2 bg-gold text-charcoal font-bold text-xs px-5 py-2.5 rounded-xl group-hover:bg-gold/90 transition-colors">
              {isID ? 'Lihat Detail' : 'View Details'}
              <ChevronRight size={13} />
            </div>
          </div>
        </div>
      </Link>
    </Animate>
  )
}

function TourCard({ tour, lang }) {
  const isID = lang === 'id'
  const img = getTourFirstImage(tour)
  const name        = isID ? tour.name        : (tour.nameEn        || tour.name)
  const description = isID ? tour.description : (tour.descriptionEn || tour.description)
  const includes    = isID ? tour.includes    : (tour.includesEn?.length ? tour.includesEn : tour.includes)

  return (
    <Animate type="up">
      <Link
        to={`/tours/${tourSlug(tour)}`}
        className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={img}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/90 text-charcoal backdrop-blur-sm">
              {CATEGORY_EMOJI[tour.category]} {CATEGORY_LABELS[tour.category]?.[lang]}
            </span>
          </div>
          {!tour.available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-sm">{isID ? 'Tidak Tersedia' : 'Unavailable'}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          <h3 className="font-heading font-bold text-white text-lg leading-tight mb-1.5 group-hover:text-gold transition-colors">
            {name}
          </h3>

          {description && (
            <p className="text-xs text-white/35 leading-relaxed mb-3 line-clamp-2">{description}</p>
          )}

          <div className="flex items-center gap-1.5 mb-3">
            <Stars count={5} size={10} />
            <span className="text-xs font-bold text-white/50">4.9</span>
            <span className="text-[10px] text-white/25">· 50+</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-white/30 mb-3">
            <span className="flex items-center gap-1">
              <Clock size={11} className="text-gold" />
              {tour.durationHours} {isID ? 'jam' : 'hrs'}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={11} className="text-gold" />
              {tour.location}
            </span>
            <span className="flex items-center gap-1">
              <Users size={11} className="text-gold" />
              {isID ? `Maks ${tour.maxParticipants}` : `Max ${tour.maxParticipants}`}
            </span>
          </div>

          {includes?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {includes.slice(0, 3).map((item, i) => (
                <span key={i} className="text-[10px] font-semibold text-gold/80 bg-gold/8 px-2 py-0.5 rounded-full border border-gold/15">
                  ✓ {item.split(' ').slice(0, 2).join(' ')}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div>
              <p className="text-[10px] text-white/30 font-medium uppercase tracking-wide">
                {isID ? 'Mulai dari' : 'Starting from'}
              </p>
              <p className="text-xl font-black text-gold">{formatIDR(tour.pricePerPerson)}</p>
              <p className="text-[10px] text-white/30">/ {isID ? 'orang' : 'person'}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-gold bg-gold/8 px-3 py-2 rounded-xl group-hover:bg-gold group-hover:text-charcoal transition-all">
              {isID ? 'Lihat Detail' : 'View Details'}
              <ChevronRight size={13} />
            </div>
          </div>
        </div>
      </Link>
    </Animate>
  )
}

export default function ToursPage() {
  const { i18n } = useTranslation()
  const isID = i18n.language === 'id'
  const lang = isID ? 'id' : 'en'

  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => {
    tourApi.getAll()
      .then(data => setTours(data.filter(t => t.available)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const featuredTours = tours.filter(t => t.featured)

  const filtered = tours.filter(t => {
    const matchCat = activeCategory === 'ALL' || t.category === activeCategory
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const categoryCounts = CATEGORY_KEYS.reduce((acc, cat) => {
    acc[cat] = cat === 'ALL' ? tours.length : tours.filter(t => t.category === cat).length
    return acc
  }, {})

  return (
    <>
      <title>{isID ? 'Guided Tours Bali – Benz Rental' : 'Bali Guided Tours – Benz Rental'}</title>
      <meta
        name="description"
        content={isID
          ? 'Jelajahi Bali dengan guided tour motor bersama Benz Rental — Ubud, Kintamani, Bali Timur, dan pantai-pantai tersembunyi.'
          : 'Explore Bali on guided motorcycle tours with Benz Rental — Ubud, Kintamani, East Bali, and hidden beaches.'}
      />
      <Navbar />

      <div className="page-enter pt-16">

        {/* ── 1. Hero — DARK ── */}
        <div
          className="relative text-white py-20 px-4 overflow-hidden"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/5216059/pexels-photo-5216059.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(26,26,26,0.72) 0%, rgba(26,26,26,0.60) 60%, rgba(26,26,26,0.85) 100%)' }} />
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-15"
              style={{ background: 'radial-gradient(circle, #C9A24B 0%, transparent 70%)', transform: 'translate(30%, -40%)' }}
            />
          </div>

          <div className="max-w-4xl mx-auto text-center relative">
            <Animate type="up">
              <span className="inline-block text-xs font-black tracking-[0.25em] uppercase text-gold mb-4">
                {isID ? 'Pengalaman Bali Terbaik' : 'Best Bali Experience'}
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-5 leading-tight">
                {isID ? 'Guided Tours' : 'Guided Tours'}<br />
                <span className="text-gold">{isID ? 'Motor Bali' : 'Bali Motorcycle'}</span>
              </h1>
              <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
                {isID
                  ? 'Jelajahi sudut-sudut tersembunyi Bali bersama guide lokal berpengalaman kami.'
                  : "Discover Bali's hidden corners with our experienced local guides."}
              </p>
              <div className="flex items-center justify-center gap-8 sm:gap-14 flex-wrap mb-10">
                {[
                  { num: '500+', label: isID ? 'Traveler Puas' : 'Happy Travelers' },
                  { num: '10+',  label: isID ? 'Rute Tour' : 'Tour Routes' },
                  { num: '4.9★', label: isID ? 'Rating Rata-rata' : 'Avg Rating' },
                ].map(({ num, label }) => (
                  <div key={num} className="flex flex-col items-center gap-0.5">
                    <span className="font-heading font-black text-2xl text-gold">{num}</span>
                    <span className="text-xs text-white/40 font-medium">{label}</span>
                  </div>
                ))}
              </div>
              <a
                href="#tour-grid"
                className="inline-flex items-center gap-2 text-xs font-bold text-white/30 hover:text-gold transition-colors"
              >
                {isID ? 'Lihat Semua Tour' : 'Browse All Tours'}
                <ArrowDown size={13} />
              </a>
            </Animate>
          </div>
        </div>

        {/* ── 2. Featured Tours ── */}
        {(loading || featuredTours.length > 0) && (
          <div className="bg-charcoal-800 pt-12 pb-4">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <Animate className="mb-6">
                <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-1">
                  {isID ? 'Paling Diminati' : 'Most Popular'}
                </p>
                <h2 className="font-heading text-2xl font-bold text-white">
                  {isID ? 'Tour Terpopuler' : 'Featured Tours'}
                </h2>
              </Animate>
              <div className="space-y-5">
                {loading ? (
                  [...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row rounded-2xl overflow-hidden animate-pulse"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <div className="sm:w-72 aspect-[4/3] sm:aspect-auto shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }} />
                      <div className="flex flex-col flex-1 p-6 gap-3">
                        <div className="h-3 rounded w-20" style={{ background: 'rgba(255,255,255,0.08)' }} />
                        <div className="h-6 rounded w-3/4" style={{ background: 'rgba(255,255,255,0.10)' }} />
                        <div className="space-y-1.5">
                          <div className="h-3 rounded w-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
                          <div className="h-3 rounded w-2/3" style={{ background: 'rgba(255,255,255,0.06)' }} />
                        </div>
                        <div className="flex items-end justify-between pt-4 mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          <div className="space-y-1.5">
                            <div className="h-7 rounded w-28" style={{ background: 'rgba(255,255,255,0.10)' }} />
                          </div>
                          <div className="h-10 rounded-xl w-28" style={{ background: 'rgba(255,255,255,0.08)' }} />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  featuredTours.map(tour => (
                    <FeaturedTourCard key={tour.id} tour={tour} lang={lang} />
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── 3. Filter & Grid ── */}
        <div className="bg-charcoal-800 min-h-96">
          <div
            id="tour-grid"
            className="sticky top-16 z-10"
            style={{ background: '#2D2D2D', borderBottom: '1px solid rgba(255,255,255,0.07)', position: '-webkit-sticky', WebkitTransform: 'translate3d(0,0,0)', transform: 'translate3d(0,0,0)' }}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {CATEGORY_KEYS.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      activeCategory === cat
                        ? 'bg-gold text-charcoal'
                        : 'text-white/40 hover:text-white border border-white/10'
                    }`}
                  >
                    {cat !== 'ALL' && CATEGORY_EMOJI[cat] + ' '}
                    {CATEGORY_LABELS[cat][lang]}
                    {categoryCounts[cat] > 0 && (
                      <span className={`text-[9px] font-black rounded-full px-1.5 py-0.5 leading-none ${
                        activeCategory === cat ? 'bg-charcoal/15 text-charcoal' : 'bg-white/10 text-white/40'
                      }`}>
                        {categoryCounts[cat]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-56">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={isID ? 'Cari tour...' : 'Search tours...'}
                  className="w-full pl-8 pr-4 py-2 text-sm rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:border-gold transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                />
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="aspect-[4/3]" style={{ background: 'rgba(255,255,255,0.08)' }} />
                    <div className="p-5 space-y-3">
                      <div className="h-5 rounded w-4/5" style={{ background: 'rgba(255,255,255,0.10)' }} />
                      <div className="h-3 rounded w-2/3" style={{ background: 'rgba(255,255,255,0.06)' }} />
                      <div className="flex gap-3">
                        <div className="h-3 rounded w-14" style={{ background: 'rgba(255,255,255,0.06)' }} />
                        <div className="h-3 rounded w-20" style={{ background: 'rgba(255,255,255,0.06)' }} />
                      </div>
                      <div className="flex items-end justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="h-6 rounded w-24" style={{ background: 'rgba(255,255,255,0.10)' }} />
                        <div className="h-8 rounded-xl w-20" style={{ background: 'rgba(255,255,255,0.08)' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-gold/50" />
                </div>
                <p className="text-lg font-semibold text-white mb-1">
                  {isID ? 'Tour tidak ditemukan' : 'No tours found'}
                </p>
                <p className="text-sm text-white/35 mb-5">
                  {isID ? 'Coba kategori atau kata kunci lain.' : 'Try a different category or keyword.'}
                </p>
                <button
                  onClick={() => { setActiveCategory('ALL'); setSearch('') }}
                  className="text-xs font-bold text-gold border border-gold/40 px-4 py-2 rounded-xl hover:bg-gold/5 transition-colors"
                >
                  {isID ? 'Reset Filter' : 'Reset Filters'}
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(tour => (
                  <TourCard key={tour.id} tour={tour} lang={lang} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── 4. Trust Bar — DARK ── */}
        <div className="bg-charcoal py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { icon: Users,      text: isID ? 'Guide lokal berpengalaman' : 'Experienced local guide' },
                { icon: Shield,     text: isID ? 'Motor & perlengkapan lengkap' : 'Full gear & equipment' },
                { icon: Headphones, text: isID ? 'Konfirmasi hari yang sama' : 'Same-day confirmation' },
                { icon: Star,       text: isID ? 'Rating 4.9 / 5 bintang' : '4.9 / 5 star rating' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center"
                    style={{ background: 'rgba(201,162,75,0.12)', border: '1px solid rgba(201,162,75,0.2)' }}
                  >
                    <Icon size={15} className="text-gold" />
                  </div>
                  <p className="text-xs font-semibold text-white/55 leading-tight">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 5. How to Book ── */}
        <div className="bg-charcoal-800 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Animate className="text-center mb-12">
              <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">
                {isID ? 'Mudah & Cepat' : 'Easy & Fast'}
              </p>
              <h2 className="font-heading text-3xl font-bold text-white">
                {isID ? 'Cara Booking Tour' : 'How to Book a Tour'}
              </h2>
            </Animate>
            <div className="grid sm:grid-cols-3 gap-8 pt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}>
              {[
                {
                  num: '01',
                  title: isID ? 'Pilih Tour' : 'Choose Tour',
                  desc: isID
                    ? 'Telusuri katalog tour kami dan pilih pengalaman yang sesuai dengan minat dan jadwalmu.'
                    : 'Browse our tour catalog and pick the experience that suits your interests and schedule.',
                },
                {
                  num: '02',
                  title: isID ? 'Isi Form & Kirim WA' : 'Fill Form & Send WA',
                  desc: isID
                    ? 'Isi detail pesanan — tanggal, jumlah peserta, dan kontakmu. Booking otomatis dikirim ke WhatsApp kami.'
                    : 'Fill in your booking details — date, participants, and contact. Your booking goes straight to our WhatsApp.',
                },
                {
                  num: '03',
                  title: isID ? 'Konfirmasi & Berangkat' : 'Confirmed & Go',
                  desc: isID
                    ? 'Tim kami konfirmasi di hari yang sama dengan detail pick-up. Tinggal datang dan nikmati tournya!'
                    : 'Our team confirms same day with pick-up details. Just show up and enjoy the tour!',
                },
              ].map(({ num, title, desc }, i) => (
                <Animate key={num} delay={i * 90}>
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="font-heading font-black text-3xl text-gold leading-none">{num}</span>
                      {i < 2 && <div className="hidden sm:block flex-1 h-px bg-white/10" />}
                    </div>
                    <h3 className="font-heading font-bold text-white mb-2">{title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
                  </div>
                </Animate>
              ))}
            </div>
          </div>
        </div>

        {/* ── 6. Testimonials — DARK ── */}
        <div className="bg-charcoal py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Animate className="text-center mb-10">
              <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">
                {isID ? 'Kata Mereka' : 'What Travelers Say'}
              </p>
              <h2 className="font-heading text-3xl font-bold text-white mb-3">
                {isID ? 'Cerita dari Peserta Tour' : 'Stories from Our Travelers'}
              </h2>
              <div className="flex items-center justify-center gap-2">
                <Stars count={5} size={13} />
                <span className="font-bold text-white text-sm">4.9</span>
                <span className="text-white/20 text-sm">·</span>
                <span className="text-white/40 text-xs">
                  {isID ? '200+ ulasan Google' : '200+ Google reviews'}
                </span>
              </div>
            </Animate>

            <div className="grid sm:grid-cols-3 gap-6">
              {TOUR_REVIEWS.map((r, i) => (
                <Animate key={i} type="up" delay={i * 80}>
                  <div
                    className="rounded-2xl p-6 h-full flex flex-col"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <Stars count={r.rating} size={12} />
                    <p className="text-sm text-white/65 leading-relaxed my-4 italic flex-1">
                      &ldquo;{r.text[lang]}&rdquo;
                    </p>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                          <span className="font-bold text-gold text-xs">{r.name[0]}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{r.name}</p>
                          <p className="text-[10px] text-white/35">{r.origin}</p>
                        </div>
                      </div>
                      <span
                        className="text-[9px] font-bold text-gold/60 px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(201,162,75,0.08)', border: '1px solid rgba(201,162,75,0.2)' }}
                      >
                        {r.tour[lang]}
                      </span>
                    </div>
                  </div>
                </Animate>
              ))}
            </div>
          </div>
        </div>

        {/* ── 7. Custom Tour CTA ── */}
        <div className="bg-charcoal-800 py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <Animate>
              <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">
                {isID ? 'Butuh Sesuatu yang Berbeda?' : 'Need Something Different?'}
              </p>
              <h2 className="font-heading text-3xl font-bold text-white mb-4">
                {isID ? 'Request Custom Tour' : 'Request a Custom Tour'}
              </h2>
              <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-xl mx-auto">
                {isID
                  ? 'Tidak menemukan tour yang cocok? Ceritakan keinginanmu dan kami akan merancang rute khusus untukmu — destinasi, durasi, dan jadwal sesuai keinginanmu.'
                  : "Can't find the right tour? Tell us what you have in mind and we'll design a custom route just for you — your destination, duration, and schedule."}
              </p>
              <a
                href={waLink(isID
                  ? 'Halo Benz Rental Bali, saya ingin request custom tour. Boleh dibantu?'
                  : 'Hello Benz Rental Bali, I would like to request a custom tour. Can you help?'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 font-bold py-4 px-8 rounded-xl text-sm text-white transition-all hover:opacity-90"
                style={{ background: '#25D366' }}
              >
                <MessageCircle size={18} />
                {isID ? 'Hubungi via WhatsApp' : 'Contact via WhatsApp'}
              </a>
            </Animate>
          </div>
        </div>

      </div>

      <Footer />
    </>
  )
}
