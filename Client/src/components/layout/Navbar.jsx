import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import LanguageSwitcher from '@/components/common/LanguageSwitcher'

const NAV_LINKS = [
  { key: 'home',      page: '/' },
  { key: 'fleet',     page: '/fleet' },
  { key: 'tours',     page: '/tours' },
  { key: 'faq',       page: '/faq' },
  { key: 'about',     page: '/about' },
  { key: 'contact',   page: '/contact' },
]

export default function Navbar() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const closeMenu = () => setMenuOpen(false)

  const isActive = (link) => link.page && pathname === link.page

  const renderNavLink = ({ key, anchor, page }, isMobile = false) => {
    const label = t(`nav.${key}`)
    const active = isActive({ key, anchor, page })

    const desktopClass = active
      ? 'text-sm font-semibold text-gold border-b-2 border-gold pb-0.5'
      : 'text-sm font-medium text-charcoal hover:text-gold transition-colors'

    const mobileClass = active
      ? 'block py-3 text-sm font-semibold text-gold border-b border-white/8'
      : 'block py-3 text-sm font-medium text-white/70 border-b border-white/8 hover:text-gold transition-colors'

    const className = isMobile ? mobileClass : desktopClass

    if (page) {
      return (
        <Link key={key} to={page} onClick={closeMenu} className={className}>
          {label}
        </Link>
      )
    }
    const href = isHome ? anchor : `/${anchor}`
    return (
      <a key={key} href={href} onClick={closeMenu} className={className}>
        {label}
      </a>
    )
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all ${
        scrolled ? 'shadow-md' : 'border-b border-gray-100'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center shrink-0">
          <img src="/logo.png" alt="Benzride.com" className="h-12 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(link => renderNavLink(link, false))}
        </div>

        <div className="hidden md:flex items-center gap-5">
          <LanguageSwitcher />
          <Link
            to="/fleet"
            className="bg-charcoal text-white text-sm font-semibold px-5 py-2.5 rounded hover:bg-gold transition-colors"
          >
            {t('nav.rentNow')}
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-charcoal"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-white/10 px-4 pb-5" style={{ background: '#1A1A1A' }}>
          {NAV_LINKS.map(link => renderNavLink(link, true))}
          <div className="flex items-center justify-between pt-4">
            <LanguageSwitcher />
            <Link
              to="/fleet"
              onClick={closeMenu}
              className="bg-charcoal text-white text-sm font-semibold px-5 py-2.5 rounded hover:bg-gold transition-colors"
            >
              {t('nav.rentNow')}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
