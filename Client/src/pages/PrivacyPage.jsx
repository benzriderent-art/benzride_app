import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const CONTENT = {
  id: [
    {
      title: '1. Informasi yang Kami Kumpulkan',
      body: 'Kami mengumpulkan informasi yang kamu berikan saat melakukan pemesanan, yaitu: nama lengkap, nomor WhatsApp, lokasi pengiriman, dan catatan tambahan. Kami juga menyimpan preferensi bahasa di perangkatmu secara lokal (localStorage) untuk kenyamanan penggunaan.',
    },
    {
      title: '2. Penggunaan Informasi',
      body: 'Informasi yang kamu berikan digunakan semata-mata untuk memproses pemesanan, menghubungi kamu terkait status sewa, dan memberikan layanan pengiriman motor. Kami tidak menggunakan data kamu untuk tujuan pemasaran tanpa izin eksplisit.',
    },
    {
      title: '3. Penyimpanan & Keamanan Data',
      body: 'Data pemesanan disimpan di server kami yang dilindungi. Kami menerapkan langkah-langkah teknis yang wajar untuk melindungi data dari akses tidak sah. Namun, tidak ada sistem transmisi data melalui internet yang 100% aman, dan kami tidak dapat menjamin keamanan mutlak.',
    },
    {
      title: '4. Berbagi Informasi',
      body: 'Kami tidak menjual, memperdagangkan, atau menyewakan informasi pribadimu kepada pihak ketiga. Data hanya dibagikan kepada penyedia layanan pembayaran (Xendit) untuk memproses transaksi, sesuai dengan kebijakan privasi mereka.',
    },
    {
      title: '5. Cookie & Local Storage',
      body: 'Website ini menggunakan localStorage untuk menyimpan preferensi bahasa (Bahasa Indonesia atau English). Tidak ada cookie pelacak atau iklan yang digunakan. Kamu dapat menghapus data localStorage kapan saja melalui pengaturan browser.',
    },
    {
      title: '6. Layanan Pihak Ketiga',
      body: 'Kami menggunakan layanan pihak ketiga seperti Xendit untuk pembayaran dan Google Fonts untuk tampilan. Layanan ini memiliki kebijakan privasi masing-masing yang berlaku. Kami juga menggunakan WhatsApp untuk komunikasi, yang tunduk pada kebijakan privasi Meta.',
    },
    {
      title: '7. Perubahan Kebijakan',
      body: 'Kami dapat memperbarui kebijakan privasi ini sewaktu-waktu. Perubahan signifikan akan diinformasikan melalui halaman ini. Penggunaan website setelah perubahan dianggap sebagai persetujuan atas kebijakan yang diperbarui.',
    },
    {
      title: '8. Hubungi Kami',
      body: 'Untuk pertanyaan terkait kebijakan privasi ini atau untuk meminta penghapusan data, silakan hubungi kami melalui WhatsApp. Kami berkomitmen untuk merespons permintaan privasi dalam waktu 7 hari kerja.',
    },
  ],
  en: [
    {
      title: '1. Information We Collect',
      body: 'We collect information you provide when making a booking: full name, WhatsApp number, delivery location, and any additional notes. We also store your language preference locally on your device (localStorage) for a better user experience.',
    },
    {
      title: '2. How We Use Your Information',
      body: 'The information you provide is used solely to process your booking, contact you regarding your rental status, and coordinate bike delivery. We do not use your data for marketing purposes without explicit consent.',
    },
    {
      title: '3. Data Storage & Security',
      body: 'Booking data is stored on our secured servers. We implement reasonable technical measures to protect data from unauthorized access. However, no internet data transmission system is 100% secure, and we cannot guarantee absolute security.',
    },
    {
      title: '4. Information Sharing',
      body: 'We do not sell, trade, or rent your personal information to third parties. Data is only shared with our payment provider (Xendit) to process transactions, subject to their privacy policy.',
    },
    {
      title: '5. Cookies & Local Storage',
      body: 'This website uses localStorage to save your language preference (Indonesian or English). No tracking or advertising cookies are used. You can clear localStorage data at any time through your browser settings.',
    },
    {
      title: '6. Third-Party Services',
      body: 'We use third-party services such as Xendit for payments and Google Fonts for typography. These services have their own applicable privacy policies. We also use WhatsApp for communication, which is subject to Meta\'s privacy policy.',
    },
    {
      title: '7. Changes to This Policy',
      body: 'We may update this privacy policy at any time. Significant changes will be communicated on this page. Continued use of the website after changes constitutes acceptance of the updated policy.',
    },
    {
      title: '8. Contact Us',
      body: 'For questions about this privacy policy or to request data deletion, please contact us via WhatsApp. We are committed to responding to privacy requests within 7 business days.',
    },
  ],
}

export default function PrivacyPage() {
  const { t, i18n } = useTranslation()
  const isID = i18n.language === 'id'
  const sections = isID ? CONTENT.id : CONTENT.en

  const titleText = isID ? 'Kebijakan Privasi – Benzride Bali' : 'Privacy Policy – Benzride Bali'
  const descText  = isID
    ? 'Kebijakan privasi Benzride Bali. Informasi yang kami kumpulkan, cara penggunaannya, dan hak privasi Anda sebagai pelanggan.'
    : 'Privacy policy for Benzride Bali. What information we collect, how we use it, and your privacy rights as a customer.'

  return (
    <>
      <title>{titleText}</title>
      <meta name="description" content={descText} />
      <link rel="canonical" href="https://benzride.com/privacy" />
      <Navbar />
      <div className="min-h-screen bg-charcoal-800 pt-16">

        <div className="py-12" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 text-xs text-white/30 mb-4">
              <Link to="/" className="hover:text-gold transition-colors">{t('common.home')}</Link>
              <span>/</span>
              <span className="text-white/50">{t('legal.privacy')}</span>
            </div>
            <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-2">{t('legal.badge')}</p>
            <h1 className="font-heading text-4xl font-bold text-white mb-2">{t('legal.privacy')}</h1>
            <p className="text-sm text-white/30">{t('legal.lastUpdated')}</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="rounded-2xl p-8 sm:p-10 space-y-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {sections.map((s, i) => (
              <div key={i}>
                <h2 className="font-heading font-bold text-white text-lg mb-3">{s.title}</h2>
                <p className="text-sm text-white/50 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-white/40 mb-4">
              {isID ? 'Ada pertanyaan tentang privasi data kamu?' : 'Have questions about your data privacy?'}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gold text-charcoal font-bold px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity"
            >
              {isID ? 'Kembali ke Beranda' : 'Back to Home'}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
