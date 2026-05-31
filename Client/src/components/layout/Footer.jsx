import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { MapPin, Phone, MessageCircle, Star, Mail } from 'lucide-react'
import { waLink, PHONE_DISPLAY, PHONE_TEL, SOCIAL, EMAIL, EMAIL_HREF } from '@/constants/contact'

const NAV_LINKS = [
  { key: 'about',     page: '/about' },
  { key: 'fleet',     page: '/fleet' },
  { key: 'howToRent', anchor: '#how-to-rent' },
  { key: 'reviews',   anchor: '#reviews' },
  { key: 'contact',   anchor: '#contact' },
]

function InstagramIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function TikTokIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  )
}

export default function Footer() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const year = new Date().getFullYear()

  const renderNavLink = ({ key, anchor, page }) => {
    const label = t(`nav.${key}`)
    const linkClass = 'text-sm text-white/35 hover:text-gold transition-colors'
    if (page) {
      return (
        <li key={key}>
          <Link to={page} className={linkClass}>{label}</Link>
        </li>
      )
    }
    const href = isHome ? anchor : `/${anchor}`
    return (
      <li key={key}>
        <a href={href} className={linkClass}>{label}</a>
      </li>
    )
  }

  return (
    <footer style={{ background: '#111111' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div className="py-14 grid sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10">
          <div>
            <div className="mb-5">
              <Link to="/" className="inline-block">
                <img
                  src="/logo_dengan_background_putih.png"
                  alt="Benzride.com"
                  className="h-20 w-auto rounded-xl"
                />
              </Link>
            </div>
            <p className="text-sm text-white/35 leading-relaxed max-w-xs mb-6">
              {t('footer.tagline')}
            </p>
            <div className="flex items-start gap-2.5">
              <MapPin size={13} className="text-gold mt-0.5 shrink-0" />
              <span className="text-xs text-white/30 leading-relaxed">{t('footer.address')}</span>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase mb-5">
              {t('footer.links')}
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map(link => renderNavLink(link))}
              <li className="pt-1.5 border-t border-white/[0.06]" />
              <li>
                <Link to="/booking/track" className="text-sm text-white/35 hover:text-gold transition-colors">
                  {t('footer.trackBooking')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-white/35 hover:text-gold transition-colors">{t('nav.faq')}</Link>
              </li>
              <li className="pt-1.5 border-t border-white/[0.06]" />
              <li>
                <Link to="/terms" className="text-sm text-white/35 hover:text-gold transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-white/35 hover:text-gold transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase mb-5">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-3.5">
              <li>
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-white/35 hover:text-gold transition-colors"
                >
                  <MessageCircle size={14} className="text-gold shrink-0" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={PHONE_TEL}
                  className="flex items-center gap-2.5 text-sm text-white/35 hover:text-gold transition-colors"
                >
                  <Phone size={14} className="text-gold shrink-0" />
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={EMAIL_HREF}
                  className="flex items-center gap-2.5 text-sm text-white/35 hover:text-gold transition-colors"
                >
                  <Mail size={14} className="text-gold shrink-0" />
                  {EMAIL}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase mb-5">
              {t('footer.social')}
            </h4>
            <ul className="space-y-3.5">
              <li>
                <a
                  href={SOCIAL.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-white/35 hover:text-gold transition-colors"
                >
                  <span className="text-gold shrink-0"><InstagramIcon size={14} /></span>
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-white/35 hover:text-gold transition-colors"
                >
                  <span className="text-gold shrink-0"><TikTokIcon size={14} /></span>
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-white/35 hover:text-gold transition-colors"
                >
                  <span className="text-gold shrink-0"><FacebookIcon size={14} /></span>
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.07] py-5 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-xs text-white/20">
            © {year} Benzride.com · PT Malaya Benz Group. {t('footer.rights')}.
          </p>
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} fill="#C9A24B" className="text-gold" />
            ))}
            <span className="text-xs text-white/20 ml-1.5">4.9 · 200+ {t('reviews.reviewCount')}</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
