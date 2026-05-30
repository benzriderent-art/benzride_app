import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { MapPin, Search, Star } from 'lucide-react'

const LOCATIONS = ['Kuta', 'Seminyak', 'Ubud', 'Canggu', 'Sanur']
const BG_IMAGE = 'https://images.pexels.com/photos/10740492/pexels-photo-10740492.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'

function heroStyle(visible, delay) {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(18px)',
    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  }
}

export default function HeroSection() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [typeIdx, setTypeIdx] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  const durations = t('hero.booking.durations', { returnObjects: true })
  const motors = t('hero.booking.motors', { returnObjects: true })

  const handleSearch = () => {
    navigate(typeIdx === 0 ? '/fleet' : `/fleet?type=${typeIdx}`)
  }

  return (
    <section
      className="min-h-screen flex items-center pt-16 relative overflow-hidden"
      style={{
        backgroundColor: '#1A1A1A',
        backgroundImage: `url(${BG_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.60) 0%, rgba(10,10,10,0.45) 45%, rgba(10,10,10,0.68) 100%)' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 w-full py-16">
        <div className="text-center mb-10">
          <div style={heroStyle(visible, 0)} className="inline-flex items-center gap-2 border border-gold/50 text-gold text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 backdrop-blur-sm" style={{ ...heroStyle(visible, 0), background: 'rgba(201,162,75,0.08)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            {t('hero.badge')}
          </div>

          <h1
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-4"
            style={{ ...heroStyle(visible, 120), textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
          >
            {t('hero.headline')}
          </h1>

          <p className="text-white/70 text-lg max-w-lg mx-auto" style={heroStyle(visible, 220)}>
            {t('hero.description')}
          </p>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{
            ...heroStyle(visible, 340),
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.30)',
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] block mb-2">
                <MapPin size={10} className="inline mr-1 text-gold" />
                {t('hero.booking.location')}
              </label>
              <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-charcoal bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold">
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] block mb-2">
                {t('hero.booking.startDate')}
              </label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-charcoal bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] block mb-2">
                {t('hero.booking.duration')}
              </label>
              <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-charcoal bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold">
                {Array.isArray(durations) && durations.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-end">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] block mb-2">
                {t('hero.booking.motorType')}
              </label>
              <select
                value={typeIdx}
                onChange={e => setTypeIdx(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-charcoal bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
              >
                {Array.isArray(motors) && motors.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select>
            </div>
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-charcoal text-white font-bold px-8 py-3.5 rounded-xl hover:bg-gold transition-colors text-sm whitespace-nowrap"
            >
              <Search size={16} />
              {t('hero.booking.search')}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-white/60" style={heroStyle(visible, 460)}>
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#C9A24B" className="text-gold" />)}
            <span className="font-semibold text-white">4.9</span>
            <span>· 200+ ulasan</span>
          </div>
          <span className="hidden sm:block text-white/20">|</span>
          <span>✓ {t('hero.trust.delivery')}</span>
          <span className="hidden sm:block text-white/20">|</span>
          <span>✓ {t('hero.trust.equipment')}</span>
        </div>
      </div>
    </section>
  )
}
