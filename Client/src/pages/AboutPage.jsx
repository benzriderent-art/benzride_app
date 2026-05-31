import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { MapPin, MessageCircle, Phone, CheckCircle, Bike, Building2, Users, Wrench } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Animate from '@/components/common/Animate'
import { waLink, PHONE_DISPLAY, PHONE_TEL } from '@/constants/contact'

const SOUTH_BALI = ['Jimbaran', 'Uluwatu', 'Nusa Dua', 'Kuta', 'Legian', 'Seminyak', 'Kerobokan', 'Canggu']
const CENTRAL_BALI = ['Ubud', 'Denpasar', 'Sanur']

const WHY_ITEMS = {
  en: [
    { icon: Wrench,    title: 'Premium & Well-Maintained Fleet',   desc: 'All vehicles are regularly serviced and maintained to ensure optimal performance and safety.' },
    { icon: MessageCircle, title: 'Easy Online Booking',           desc: 'Reserve your scooter or motorcycle quickly through our website or WhatsApp.' },
    { icon: MapPin,    title: 'Delivery & Pick-Up Service',         desc: 'Enjoy hassle-free delivery and collection at your preferred location anywhere in Bali.' },
    { icon: CheckCircle, title: 'Transparent Pricing',             desc: 'No hidden fees. Clear pricing with competitive rental rates for every type of traveler.' },
    { icon: Users,     title: 'Professional Customer Support',      desc: 'Our team is ready to assist you before, during, and after your rental period.' },
    { icon: Building2, title: 'International Traveler Friendly',    desc: 'We proudly serve customers from around the world with responsive and professional service.' },
  ],
  id: [
    { icon: Wrench,    title: 'Armada Premium & Terawat',          desc: 'Semua unit dirawat secara rutin untuk memastikan performa dan keamanan yang optimal.' },
    { icon: MessageCircle, title: 'Booking Online Mudah',          desc: 'Pesan motor dengan cepat melalui website kami atau WhatsApp kapan saja.' },
    { icon: MapPin,    title: 'Layanan Antar & Jemput',            desc: 'Nikmati kemudahan pengiriman dan pengambilan motor di lokasi pilihan Anda.' },
    { icon: CheckCircle, title: 'Harga Transparan',                desc: 'Tanpa biaya tersembunyi. Harga jelas dan kompetitif untuk semua jenis penyewa.' },
    { icon: Users,     title: 'Dukungan Pelanggan Profesional',     desc: 'Tim kami siap membantu sebelum, selama, dan setelah masa sewa Anda.' },
    { icon: Building2, title: 'Ramah Wisatawan Asing',             desc: 'Kami melayani tamu dari seluruh dunia dengan komunikasi responsif dan standar profesional.' },
  ],
}

export default function AboutPage() {
  const { t, i18n } = useTranslation()
  const isID = i18n.language === 'id'
  const why = isID ? WHY_ITEMS.id : WHY_ITEMS.en

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-off-white pt-16">

        {/* Hero */}
        <div className="bg-white border-b border-gray-100 py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
              <Link to="/" className="hover:text-gold transition-colors">{t('common.home')}</Link>
              <span>/</span>
              <span className="text-gray-600">{isID ? 'Tentang Kami' : 'About Us'}</span>
            </div>
            <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">
              {isID ? 'Tentang Kami' : 'About Us'}
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-charcoal leading-[1.1] mb-5">
              {isID
                ? 'Rental Skuter & Motor Premium di Bali'
                : 'Premium Scooter & Motorcycle Rental in Bali'}
            </h1>
            <p className="text-gray-500 leading-relaxed max-w-2xl">
              {isID
                ? 'Benzride.com adalah layanan sewa skuter dan motor premium di Bali, didedikasikan untuk memberikan solusi transportasi yang aman, andal, dan nyaman bagi wisatawan domestik maupun mancanegara.'
                : 'Benzride.com is a premium scooter and motorcycle rental service in Bali, dedicated to providing safe, reliable, and convenient transportation solutions for both domestic and international travelers.'}
            </p>
          </div>
        </div>

        {/* Company Profile */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
          <Animate>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-10 mb-8">
              <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-4">
                {isID ? 'Profil Perusahaan' : 'Company Profile'}
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-400 mb-1">{isID ? 'Nama Perusahaan' : 'Company Name'}</p>
                  <p className="font-semibold text-charcoal">PT Malaya Benz Group</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">{isID ? 'Didirikan' : 'Established'}</p>
                  <p className="font-semibold text-charcoal">2023</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-400 mb-1">{isID ? 'Kantor Pusat' : 'Head Office'}</p>
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-gold mt-0.5 shrink-0" />
                    <p className="font-semibold text-charcoal">Jl. Uluwatu II No. 6, Jimbaran, Bali, Indonesia</p>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-400 mb-2">{isID ? 'Informasi Legal' : 'Legal Information'}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {isID
                      ? 'PT Malaya Benz Group adalah perusahaan Indonesia yang terdaftar secara resmi di sektor transportasi dan pariwisata. Perusahaan ini didirikan melalui restrukturisasi korporasi dan amendemen akta pendirian PT Malaya Auriga Teja, memperluas portofolio bisnisnya ke layanan transportasi, pariwisata, perhotelan, dan pengelolaan properti.'
                      : 'PT Malaya Benz Group is a legally registered Indonesian company operating in the transportation and tourism sector. The company was established through the corporate restructuring and deed amendment of PT Malaya Auriga Teja, expanding its business portfolio into transportation services, tourism, hospitality, and property management.'}
                  </p>
                </div>
              </div>
            </div>
          </Animate>

          {/* Fleet Stats */}
          <Animate delay={60}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {[
                { icon: Bike,  value: '120+', label: isID ? 'Unit Armada' : 'Rental Units' },
                { icon: MapPin, value: '2',   label: isID ? 'Wilayah Layanan' : 'Service Regions' },
                { icon: Users, value: '500+', label: isID ? 'Pelanggan Puas' : 'Happy Customers' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
                  <Icon size={22} className="text-gold mx-auto mb-3" />
                  <p className="font-heading text-3xl font-bold text-charcoal">{value}</p>
                  <p className="text-xs text-gray-400 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </Animate>

          {/* Fleet */}
          <Animate delay={80}>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-10 mb-8">
              <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-4">
                {isID ? 'Armada Kami' : 'Our Fleet'}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {isID
                  ? 'Benzride mengoperasikan armada lebih dari 120 unit. Setiap unit melewati inspeksi dan perawatan rutin untuk memastikan keamanan, keandalan, dan kepuasan pelanggan.'
                  : 'Benzride currently operates a fleet of more than 120 units. Every vehicle undergoes regular inspections and maintenance to ensure maximum safety, reliability, and customer satisfaction.'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Honda Scoopy', 'Honda Vario Series', 'Honda PCX', 'Yamaha NMAX'].map(name => (
                  <div key={name} className="bg-off-white rounded-xl px-4 py-3 text-center">
                    <p className="text-xs font-semibold text-charcoal">{name}</p>
                  </div>
                ))}
              </div>
            </div>
          </Animate>

          {/* Service Areas */}
          <Animate delay={100}>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-10 mb-8">
              <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-4">
                {isID ? 'Area Layanan' : 'Service Areas'}
              </p>
              <p className="text-sm text-gray-600 mb-6">
                {isID
                  ? 'Kami menyediakan layanan pengiriman motor ke seluruh Bali, termasuk:'
                  : 'We provide scooter and motorcycle delivery services throughout Bali, including:'}
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-black text-charcoal tracking-widest uppercase mb-3">
                    {isID ? 'Bali Selatan' : 'South Bali'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SOUTH_BALI.map(area => (
                      <span key={area} className="text-xs bg-gold/10 text-gold font-semibold px-3 py-1.5 rounded-full">{area}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black text-charcoal tracking-widest uppercase mb-3">
                    {isID ? 'Bali Tengah' : 'Central Bali'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {CENTRAL_BALI.map(area => (
                      <span key={area} className="text-xs bg-gold/10 text-gold font-semibold px-3 py-1.5 rounded-full">{area}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Animate>

          {/* Why Choose Us */}
          <Animate delay={120}>
            <div className="mb-8">
              <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">
                {isID ? 'Keunggulan Kami' : 'Why Choose Benzride?'}
              </p>
              <h2 className="font-heading text-3xl font-bold text-charcoal mb-8">
                {isID ? 'Kenapa Pilih Benzride?' : 'What Sets Us Apart'}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {why.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-gold" />
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal text-sm mb-1">{title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Animate>

          {/* Vision & Mission */}
          <Animate delay={140}>
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-charcoal rounded-2xl p-8">
                <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">
                  {isID ? 'Visi' : 'Our Vision'}
                </p>
                <p className="text-white text-sm leading-relaxed">
                  {isID
                    ? 'Menjadi penyedia sewa skuter dan motor paling tepercaya dan berorientasi pelanggan di Bali, memberikan pengalaman mobilitas luar biasa bagi wisatawan dari seluruh dunia.'
                    : 'To become Bali\'s most trusted and customer-focused scooter and motorcycle rental provider, delivering exceptional mobility experiences for travelers from around the world.'}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-8">
                <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">
                  {isID ? 'Misi' : 'Our Mission'}
                </p>
                <ul className="space-y-2">
                  {(isID ? [
                    'Menyediakan kendaraan sewa berkualitas tinggi, aman, dan andal',
                    'Memberikan layanan pelanggan terbaik dengan profesionalisme',
                    'Menawarkan pengalaman booking yang sederhana, transparan, dan efisien',
                    'Menjadi mitra transportasi tepercaya bagi wisatawan Bali',
                    'Mendukung pertumbuhan industri pariwisata Bali',
                  ] : [
                    'Provide high-quality, safe, and reliable rental vehicles',
                    'Deliver outstanding customer service with professionalism and integrity',
                    'Offer a simple, transparent, and efficient booking experience',
                    'Become a trusted transportation partner for travelers exploring Bali',
                    'Support the growth of Bali\'s tourism industry',
                  ]).map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                      <CheckCircle size={13} className="text-gold mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Animate>

          {/* Contact Strip */}
          <Animate delay={160}>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">
                {isID ? 'Hubungi Kami' : 'Contact Us'}
              </p>
              <h3 className="font-heading text-2xl font-bold text-charcoal mb-2">BENZRIDE.COM</h3>
              <p className="text-sm text-gray-500 mb-6">
                {isID ? 'Premium Skuter & Motor Rental Bali' : 'Premium Scooter & Motorcycle Rental Bali'}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                <MapPin size={14} className="text-gold shrink-0" />
                Jl. Uluwatu II No. 6, Jimbaran, Bali, Indonesia
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href={waLink(isID ? 'Halo Benzride, saya ingin tahu lebih lanjut tentang layanan kalian' : 'Hello Benzride, I would like to know more about your services')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-xl text-sm text-white hover:opacity-90 transition-opacity"
                  style={{ background: '#25D366' }}
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </a>
                <a
                  href={PHONE_TEL}
                  className="inline-flex items-center gap-2 bg-gold text-charcoal font-bold px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity"
                >
                  <Phone size={16} />
                  {PHONE_DISPLAY}
                </a>
                <Link
                  to="/fleet"
                  className="inline-flex items-center gap-2 bg-charcoal text-white font-bold px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity"
                >
                  {isID ? 'Lihat Armada' : 'View Fleet'}
                </Link>
              </div>
            </div>
          </Animate>
        </div>
      </div>
      <Footer />
    </>
  )
}
