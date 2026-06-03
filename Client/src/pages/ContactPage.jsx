import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapPin, Phone, MessageCircle, Mail, Clock, ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Animate from '@/components/common/Animate'
import { waLink, PHONE_DISPLAY, PHONE_TEL, EMAIL, EMAIL_HREF, SOCIAL } from '@/constants/contact'

function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TikTokIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  )
}

function FacebookIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

const HOURS = [
  { day: { id: 'Senin – Jumat', en: 'Monday – Friday' }, time: '08:00 – 20:00 WITA' },
  { day: { id: 'Sabtu',        en: 'Saturday'         }, time: '08:00 – 20:00 WITA' },
  { day: { id: 'Minggu',       en: 'Sunday'           }, time: '09:00 – 18:00 WITA' },
]

const CONTACT_ITEMS = (isID) => [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: PHONE_DISPLAY,
    href: waLink(isID
      ? 'Halo Benz Rental Bali, saya ingin bertanya tentang layanan sewa motor.'
      : 'Hello Benz Rental Bali, I would like to inquire about your motorcycle rental service.'
    ),
    external: true,
    color: '#25D366',
    cta: isID ? 'Chat Sekarang' : 'Chat Now',
  },
  {
    icon: Phone,
    label: isID ? 'Telepon' : 'Phone',
    value: PHONE_DISPLAY,
    href: PHONE_TEL,
    external: false,
    color: '#C9A24B',
    cta: isID ? 'Hubungi' : 'Call',
  },
  {
    icon: Mail,
    label: 'Email',
    value: EMAIL,
    href: EMAIL_HREF,
    external: false,
    color: '#C9A24B',
    cta: isID ? 'Kirim Email' : 'Send Email',
  },
  {
    icon: MapPin,
    label: isID ? 'Lokasi' : 'Location',
    value: isID ? 'Kerobokan, Badung, Bali, Indonesia' : 'Kerobokan, Badung, Bali, Indonesia',
    href: 'https://maps.google.com/?q=Kerobokan+Badung+Bali',
    external: true,
    color: '#C9A24B',
    cta: isID ? 'Lihat Map' : 'View Map',
  },
]

const SOCIAL_LINKS = [
  { icon: InstagramIcon, label: 'Instagram', href: SOCIAL.instagram, handle: '@benzrentalbali' },
  { icon: TikTokIcon,    label: 'TikTok',    href: SOCIAL.tiktok,    handle: '@benzrentalbali' },
  { icon: FacebookIcon,  label: 'Facebook',  href: SOCIAL.facebook,  handle: 'benzrentalbali'  },
]

export default function ContactPage() {
  const { i18n } = useTranslation()
  const isID = i18n.language === 'id'

  const titleText = isID ? 'Hubungi Kami – Benzride Bali | Sewa Motor Bali' : 'Contact Us – Benzride Bali | Motorcycle Rental'
  const descText  = isID
    ? 'Hubungi Benzride Bali via WhatsApp, telepon, atau email. Kami merespons dalam 5 menit. Jam operasional Senin–Minggu.'
    : 'Contact Benzride Bali via WhatsApp, phone, or email. We respond within 5 minutes. Operating Monday–Sunday.'

  return (
    <>
      <title>{titleText}</title>
      <meta name="description" content={descText} />
      <meta property="og:title" content={titleText} />
      <meta property="og:description" content={descText} />
      <link rel="canonical" href="https://benzride.com/contact" />
      <Navbar />
      <div className="min-h-screen bg-charcoal-800 pt-16">

        {/* Hero */}
        <div className="py-14" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 text-xs text-white/30 mb-4">
              <Link to="/" className="hover:text-gold transition-colors">
                {isID ? 'Beranda' : 'Home'}
              </Link>
              <span>/</span>
              <span className="text-white/50">{isID ? 'Hubungi Kami' : 'Contact Us'}</span>
            </div>
            <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">
              {isID ? 'Hubungi Kami' : 'Contact Us'}
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white leading-[1.1] mb-5">
              {isID ? 'Kami Siap Membantu Anda' : 'We Are Here to Help'}
            </h1>
            <p className="text-white/40 leading-relaxed max-w-2xl">
              {isID
                ? 'Punya pertanyaan tentang sewa motor, ketersediaan unit, atau layanan kami? Hubungi tim Benz Rental Bali — kami siap merespons dengan cepat dan ramah.'
                : 'Have questions about rentals, vehicle availability, or our services? Reach out to the Benz Rental Bali team — we respond quickly and professionally.'}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 space-y-10">

          {/* Contact cards */}
          <Animate type="up">
            <div className="grid sm:grid-cols-2 gap-4">
              {CONTACT_ITEMS(isID).map(({ icon: Icon, label, value, href, external, color, cta }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="group rounded-xl p-6 hover:border-gold/40 transition-all flex items-start gap-4"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                    style={{ background: `${color}15` }}
                  >
                    <Icon size={20} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-white/30 tracking-[0.2em] uppercase mb-1">{label}</p>
                    <p className="text-sm font-semibold text-white truncate mb-3">{value}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold group-hover:gap-2 transition-all">
                      {cta} <ArrowRight size={11} />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </Animate>

          <div className="grid sm:grid-cols-2 gap-6">

            {/* Operating hours */}
            <Animate type="left" delay={80}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center">
                    <Clock size={17} className="text-gold" />
                  </div>
                  <h2 className="font-bold text-white">
                    {isID ? 'Jam Operasional' : 'Operating Hours'}
                  </h2>
                </div>
                <div className="space-y-3">
                  {HOURS.map(({ day, time }) => (
                    <div key={day.en} className="flex items-center justify-between text-sm">
                      <span className="text-white/40">{isID ? day.id : day.en}</span>
                      <span className="font-semibold text-white">{time}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-xs text-white/30 leading-relaxed">
                    {isID
                      ? 'Di luar jam operasional, Anda tetap dapat menghubungi kami via WhatsApp. Pesan akan kami balas saat jam buka.'
                      : 'Outside operating hours, you can still reach us via WhatsApp. Messages will be replied during opening hours.'}
                  </p>
                </div>
              </div>
            </Animate>

            {/* Social media */}
            <Animate type="right" delay={80}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center">
                    <InstagramIcon size={17} />
                  </div>
                  <h2 className="font-bold text-white">
                    {isID ? 'Ikuti Kami' : 'Follow Us'}
                  </h2>
                </div>
                <div className="space-y-3">
                  {SOCIAL_LINKS.map(({ icon: Icon, label, href, handle }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                        <Icon size={15} className="text-gold" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{label}</p>
                        <p className="text-xs text-white/30">{handle}</p>
                      </div>
                      <ArrowRight size={13} className="text-white/20 group-hover:text-gold ml-auto transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </Animate>
          </div>

          {/* WA CTA banner */}
          <Animate type="up" delay={100}>
            <div className="rounded-xl overflow-hidden" style={{ background: '#111111' }}>
              <div className="px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-xs font-black text-gold/70 tracking-[0.2em] uppercase mb-2">WhatsApp</p>
                  <h3 className="font-heading text-2xl font-bold text-white mb-2">
                    {isID ? 'Respons Cepat via WhatsApp' : 'Quick Response via WhatsApp'}
                  </h3>
                  <p className="text-sm text-white/40 max-w-sm">
                    {isID
                      ? 'Rata-rata kami merespons dalam 5 menit. Tanyakan ketersediaan unit, harga, atau info pengiriman.'
                      : 'We typically respond within 5 minutes. Ask about availability, pricing, or delivery details.'}
                  </p>
                </div>
                <a
                  href={waLink(isID
                    ? 'Halo Benz Rental Bali, saya ingin bertanya tentang layanan sewa motor.'
                    : 'Hello Benz Rental Bali, I would like to inquire about your motorcycle rental service.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 font-bold text-sm px-7 py-4 rounded-xl shrink-0 transition-opacity hover:opacity-90"
                  style={{ background: '#25D366', color: '#fff' }}
                >
                  <MessageCircle size={18} />
                  {isID ? 'Chat Sekarang' : 'Chat Now'}
                </a>
              </div>
            </div>
          </Animate>

          {/* Quick links */}
          <Animate type="up" delay={120}>
            <div className="flex flex-wrap gap-3">
              {[
                { to: '/faq',   label: isID ? 'FAQ & Pertanyaan Umum' : 'FAQ & Common Questions' },
                { to: '/fleet', label: isID ? 'Lihat Armada Motor'    : 'Browse Our Fleet' },
                { to: '/terms', label: isID ? 'Syarat & Ketentuan'    : 'Terms & Conditions' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/50 border border-white/15 px-4 py-2.5 rounded-lg hover:border-gold hover:text-gold transition-colors"
                >
                  {label} <ArrowRight size={13} />
                </Link>
              ))}
            </div>
          </Animate>

        </div>
      </div>
      <Footer />
    </>
  )
}
