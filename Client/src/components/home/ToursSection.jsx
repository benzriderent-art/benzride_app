import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapPin, Clock, Users, ChevronRight, ArrowRight } from 'lucide-react'
import Animate from '@/components/common/Animate'
import { tourApi } from '@/api/tours'
import { formatIDR } from '@/utils/formatCurrency'
import { getTourFirstImage } from '@/utils/tourImages'


const CATEGORY_EMOJI = {
  CULTURAL: '🏛️',
  NATURE:   '🌿',
  SUNRISE:  '🌅',
  BEACH:    '🏖️',
}

const CATEGORY_LABELS = {
  CULTURAL: { id: 'Budaya', en: 'Cultural' },
  NATURE:   { id: 'Alam', en: 'Nature' },
  SUNRISE:  { id: 'Sunrise', en: 'Sunrise' },
  BEACH:    { id: 'Pantai', en: 'Beach' },
}

export default function ToursSection() {
  const { i18n } = useTranslation()
  const isID = i18n.language === 'id'
  const lang = isID ? 'id' : 'en'

  const [tours, setTours] = useState([])

  useEffect(() => {
    tourApi.getAll()
      .then(data => setTours(data.filter(t => t.available).slice(0, 3)))
      .catch(() => {})
  }, [])

  if (tours.length === 0) return null

  return (
    <section className="py-24 bg-off-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <Animate className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">
              {isID ? 'Jelajahi Bali' : 'Explore Bali'}
            </p>
            <h2 className="font-heading text-4xl font-bold text-charcoal leading-[1.1]">
              {isID ? 'Guided Tours' : 'Guided Tours'}
            </h2>
            <p className="text-gray-500 mt-3 max-w-md text-sm leading-relaxed">
              {isID
                ? 'Nikmati pengalaman berkendara Bali bersama guide lokal kami yang berpengalaman.'
                : 'Experience Bali riding with our experienced local guides by your side.'}
            </p>
          </div>
          <Link
            to="/tours"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-gold border border-gold/40 hover:bg-gold/5 px-4 py-2.5 rounded-xl transition-colors shrink-0"
          >
            {isID ? 'Lihat Semua Tour' : 'View All Tours'}
            <ArrowRight size={14} />
          </Link>
        </Animate>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour, idx) => {
            const img = getTourFirstImage(tour)
            const catLabel = CATEGORY_LABELS[tour.category]?.[lang] ?? tour.category

            return (
              <Animate key={tour.id} type="up" delay={idx * 70}>
                <Link
                  to={`/tours/${tour.id}`}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={img}
                      alt={tour.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/90 text-charcoal backdrop-blur-sm shadow-sm">
                        {CATEGORY_EMOJI[tour.category]} {catLabel}
                      </span>
                      {tour.featured && (
                        <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: 'rgba(201,162,75,0.9)' }}>
                          🔥 {isID ? 'Terpopuler' : 'Best Seller'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="font-heading font-bold text-charcoal text-lg leading-tight mb-2 group-hover:text-gold transition-colors">
                      {tour.name}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
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

                    {tour.includes?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {tour.includes.slice(0, 3).map((item, i) => (
                          <span key={i} className="text-[10px] font-semibold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                            ✓ {item.split(' ')[0]} {item.split(' ')[1] || ''}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                      <div>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                          {isID ? 'Mulai dari' : 'From'}
                        </p>
                        <p className="text-xl font-black text-gold">{formatIDR(tour.pricePerPerson)}</p>
                        <p className="text-[10px] text-gray-400">/ {isID ? 'orang' : 'person'}</p>
                      </div>
                      <span className="flex items-center gap-1 text-xs font-bold text-gold group-hover:gap-2 transition-all">
                        {isID ? 'Detail' : 'Details'}
                        <ChevronRight size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              </Animate>
            )
          })}
        </div>

        <Animate className="mt-8 sm:hidden text-center">
          <Link
            to="/tours"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-gold border border-gold/40 hover:bg-gold/5 px-5 py-2.5 rounded-xl transition-colors"
          >
            {isID ? 'Lihat Semua Tour' : 'View All Tours'}
            <ArrowRight size={14} />
          </Link>
        </Animate>

      </div>
    </section>
  )
}
