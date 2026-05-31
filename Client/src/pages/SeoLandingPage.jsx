import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapPin, MessageCircle, Phone, ChevronDown, Star, CheckCircle, ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Animate from '@/components/common/Animate'
import ImageCarousel from '@/components/common/ImageCarousel'
import { SEO_LOCATIONS } from '@/data/seoLocations'
import { motorApi } from '@/api/motors'
import { motorSlug } from '@/utils/slugify'
import { useCurrency } from '@/context/CurrencyContext'
import { waLink, PHONE_DISPLAY, PHONE_TEL } from '@/constants/contact'

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="text-sm font-semibold text-charcoal">{q}</span>
        <ChevronDown size={15} className={`text-gold shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="pb-4 text-sm text-gray-500 leading-relaxed">{a}</p>}
    </div>
  )
}

export default function SeoLandingPage() {
  const { area } = useParams()
  const { i18n } = useTranslation()
  const isID = i18n.language === 'id'
  const { formatPrice } = useCurrency()

  const loc = SEO_LOCATIONS[area]
  const [vehicles, setVehicles] = useState([])

  useEffect(() => {
    motorApi.getAll().then(data => setVehicles(data.filter(v => v.available).slice(0, 6))).catch(() => {})
  }, [])

  if (!loc) return <Navigate to="/fleet" replace />

  const name  = isID ? loc.nameID  : loc.nameEN
  const title = isID ? loc.titleID : loc.titleEN
  const desc  = isID ? loc.descID  : loc.descEN
  const hero  = isID ? loc.heroID  : loc.heroEN
  const sub   = isID ? loc.subID   : loc.subEN
  const about = isID ? loc.aboutID : loc.aboutEN
  const dist  = isID ? loc.distanceID : loc.distanceEN
  const faqs  = isID ? loc.faqID   : loc.faqEN
  const keywords = isID ? loc.keywordsID : loc.keywordsEN

  const waMsg = isID
    ? `Halo Benzride! Saya butuh sewa motor di area ${name}. Bisa info ketersediaan dan cara pengiriman?`
    : `Hello Benzride! I need to rent a motorcycle in the ${name} area. Can you share availability and delivery info?`

  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Benzride – Motorcycle Rental Bali',
    description: desc,
    url: `https://benzride.com/sewa-motor-${area}`,
    telephone: '+62818540525',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Uluwatu II No. 6',
      addressLocality: 'Jimbaran',
      addressRegion: 'Bali',
      addressCountry: 'ID',
    },
    areaServed: name,
    priceRange: 'IDR 90,000 – 180,000 / day',
  }

  return (
    <>
      {/* React 19 native head metadata */}
      <title>{title}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      <link rel="canonical" href={`https://benzride.com/sewa-motor-${area}`} />
      <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>

      <Navbar />
      <div className="min-h-screen bg-off-white pt-16">

        {/* Hero */}
        <section className="bg-charcoal py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <Animate>
              <div className="flex items-center gap-2 text-xs text-white/30 mb-5">
                <Link to="/" className="hover:text-gold transition-colors">Home</Link>
                <span>/</span>
                <span className="text-white/50">{isID ? `Sewa Motor ${name}` : `Motorcycle Rental ${name}`}</span>
              </div>
              <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">
                Benzride Bali · {name}
              </p>
              <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white leading-[1.1] mb-5">
                {hero}
              </h1>
              <p className="text-white/50 text-base leading-relaxed max-w-2xl mb-8">{sub}</p>

              <div className="flex flex-wrap gap-3">
                <a
                  href={waLink(waMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-bold px-6 py-3.5 rounded-xl text-sm text-white hover:opacity-90 transition-opacity"
                  style={{ background: '#25D366' }}
                >
                  <MessageCircle size={16} />
                  {isID ? `Sewa Motor di ${name}` : `Rent in ${name}`}
                </a>
                <Link
                  to="/fleet"
                  className="inline-flex items-center gap-2 bg-gold text-charcoal font-bold px-6 py-3.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
                >
                  {isID ? 'Lihat Armada' : 'View Fleet'}
                  <ArrowRight size={15} />
                </Link>
              </div>

              <div className="flex items-start gap-2 mt-7">
                <MapPin size={13} className="text-gold mt-0.5 shrink-0" />
                <p className="text-xs text-white/30">{dist}</p>
              </div>
            </Animate>
          </div>
        </section>

        {/* About Location */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <Animate>
              <div className="grid sm:grid-cols-[2fr_1fr] gap-10 items-start">
                <div>
                  <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">
                    {isID ? `Motor Rental ${name}` : `Motorcycle Rental ${name}`}
                  </p>
                  <h2 className="font-heading text-3xl font-bold text-charcoal mb-4">
                    {isID ? `Sewa Motor di ${name}, Bali` : `Rent a Motorcycle in ${name}, Bali`}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed">{about}</p>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-black text-charcoal tracking-widest uppercase mb-3">
                    {isID ? `Destinasi Populer di ${name}` : `Popular Spots in ${name}`}
                  </p>
                  {loc.highlights.map(spot => (
                    <div key={spot} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <CheckCircle size={13} className="text-gold shrink-0" />
                      {spot}
                    </div>
                  ))}
                </div>
              </div>
            </Animate>
          </div>
        </section>

        {/* Fleet */}
        {vehicles.length > 0 && (
          <section className="py-14" style={{ background: '#111111' }}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <Animate>
                <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-2">
                  {isID ? 'Armada Tersedia' : 'Available Fleet'}
                </p>
                <h2 className="font-heading text-3xl font-bold text-white mb-8">
                  {isID ? `Motor Siap Diantar ke ${name}` : `Bikes Ready for Delivery to ${name}`}
                </h2>
              </Animate>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicles.map((v, i) => (
                  <Animate key={v.id} delay={i * 60}>
                    <div
                      className="relative overflow-hidden rounded-2xl hover:-translate-y-1 transition-all duration-300"
                      style={{ aspectRatio: '4/3', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <Link to={`/booking/${motorSlug(v)}`} className="absolute inset-0">
                        <ImageCarousel images={v.images ?? []} alt={v.name} />
                      </Link>
                      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)' }} />
                      <div className="absolute bottom-0 inset-x-0 p-4 pointer-events-none">
                        <p className="text-[10px] text-gold/60 font-bold uppercase tracking-wider mb-0.5">{v.cc} CC · {v.year}</p>
                        <p className="font-heading font-bold text-white text-lg leading-tight mb-2">{v.name}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-gold font-black">
                            {formatPrice(v.priceDay)}
                            <span className="text-white/30 text-xs font-normal ml-1">{isID ? '/hari' : '/day'}</span>
                          </p>
                          <Link
                            to={`/booking/${motorSlug(v)}`}
                            className="pointer-events-auto text-xs font-bold px-3 py-2 rounded-lg bg-gold text-charcoal hover:opacity-90 transition-opacity"
                          >
                            {isID ? 'Sewa' : 'Rent'}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Animate>
                ))}
              </div>
              <Animate delay={200} className="text-center mt-8">
                <Link
                  to="/fleet"
                  className="inline-flex items-center gap-2 text-sm font-bold text-white/40 hover:text-gold border border-white/10 hover:border-gold/40 px-6 py-3 rounded-xl transition-colors"
                >
                  {isID ? 'Lihat Semua Armada' : 'View All Fleet'}
                  <ArrowRight size={14} />
                </Link>
              </Animate>
            </div>
          </section>
        )}

        {/* Why Benzride */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <Animate>
              <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">
                {isID ? 'Kenapa Benzride?' : 'Why Benzride?'}
              </p>
              <h2 className="font-heading text-3xl font-bold text-charcoal mb-8">
                {isID ? `Sewa Motor Terpercaya di ${name}` : `Trusted Motorcycle Rental in ${name}`}
              </h2>
            </Animate>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(isID ? [
                { t: 'Antar ke Lokasi Kamu',    d: `Kami mengantarkan motor langsung ke hotel, villa, atau alamat manapun di ${name}.` },
                { t: 'Harga Transparan',         d: 'Tidak ada biaya tersembunyi. Harga jelas, kompetitif, dan sudah termasuk helm.' },
                { t: 'Armada Terawat',           d: 'Semua unit melewati inspeksi rutin dan dibersihkan sebelum dikirim ke pelanggan.' },
                { t: 'Booking Mudah via WA',     d: 'Cukup hubungi via WhatsApp untuk pesan, konfirmasi, dan koordinasi pengiriman.' },
                { t: 'Layanan 24/7',             d: 'Tim kami siap membantu kapan saja via WhatsApp untuk pertanyaan dan darurat.' },
                { t: 'Perusahaan Legal',         d: 'PT Malaya Benz Group, terdaftar resmi di Indonesia sejak 2023.' },
              ] : [
                { t: 'Delivery to Your Location', d: `We deliver motorcycles directly to your hotel, villa, or any address in ${name}.` },
                { t: 'Transparent Pricing',       d: 'No hidden fees. Clear, competitive rates with free helmet included.' },
                { t: 'Well-Maintained Fleet',     d: 'Every unit goes through regular inspection and is cleaned before delivery.' },
                { t: 'Easy WhatsApp Booking',     d: 'Simply contact us via WhatsApp to book, confirm, and coordinate delivery.' },
                { t: '24/7 Support',              d: 'Our team is available anytime via WhatsApp for questions and emergencies.' },
                { t: 'Legally Registered',        d: 'PT Malaya Benz Group, officially registered in Indonesia since 2023.' },
              ]).map(({ t, d }) => (
                <Animate key={t} className="bg-off-white rounded-2xl p-5">
                  <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center mb-3">
                    <CheckCircle size={15} className="text-gold" />
                  </div>
                  <p className="font-semibold text-charcoal text-sm mb-1">{t}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{d}</p>
                </Animate>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="py-14 bg-off-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <Animate>
                <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">FAQ</p>
                <h2 className="font-heading text-3xl font-bold text-charcoal mb-8">
                  {isID ? `Pertanyaan Sewa Motor di ${name}` : `Motorcycle Rental ${name} — FAQ`}
                </h2>
              </Animate>
              <Animate delay={60}>
                <div className="bg-white rounded-2xl border border-gray-100 px-6 sm:px-8 py-2">
                  {faqs.map((item, i) => (
                    <FAQItem key={i} q={item.q} a={item.a} />
                  ))}
                </div>
              </Animate>
            </div>
          </section>
        )}

        {/* Reviews snippet */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <Animate>
              <div className="flex items-center justify-center gap-1.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#C9A24B" className="text-gold" />
                ))}
              </div>
              <p className="font-heading text-2xl font-bold text-charcoal mb-2">4.9 / 5</p>
              <p className="text-sm text-gray-400 mb-8">
                {isID ? '500+ pelanggan puas di seluruh Bali' : '500+ happy customers across Bali'}
              </p>
            </Animate>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16" style={{ background: '#111111' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <Animate>
              <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">
                {isID ? 'Siap Pesan?' : 'Ready to Ride?'}
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
                {isID ? `Sewa Motor di ${name} Sekarang` : `Rent a Motorcycle in ${name} Today`}
              </h2>
              <p className="text-white/40 text-sm mb-8">
                {isID
                  ? 'Hubungi kami via WhatsApp untuk konfirmasi ketersediaan dan jadwal pengiriman.'
                  : 'Contact us via WhatsApp to confirm availability and arrange delivery.'}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href={waLink(waMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 font-bold px-7 py-4 rounded-xl text-sm text-white hover:opacity-90 transition-opacity"
                  style={{ background: '#25D366' }}
                >
                  <MessageCircle size={17} />
                  WhatsApp
                </a>
                <a
                  href={PHONE_TEL}
                  className="inline-flex items-center gap-2.5 bg-gold text-charcoal font-bold px-7 py-4 rounded-xl text-sm hover:opacity-90 transition-opacity"
                >
                  <Phone size={17} />
                  {PHONE_DISPLAY}
                </a>
              </div>
            </Animate>
          </div>
        </section>

      </div>
      <Footer />
    </>
  )
}
