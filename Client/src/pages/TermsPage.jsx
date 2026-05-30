import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const CONTENT = {
  id: [
    {
      title: '1. Persyaratan Penyewa',
      body: 'Penyewa wajib memiliki SIM A atau SIM C yang masih berlaku. WNI wajib menunjukkan KTP asli, WNA wajib menunjukkan Paspor yang valid. Usia minimal penyewa adalah 17 tahun. Benz Rental Bali berhak menolak permintaan sewa jika dokumen tidak lengkap atau tidak valid.',
    },
    {
      title: '2. Deposit & Pembayaran',
      body: 'Deposit diperlukan saat pengambilan motor sebagai jaminan dan akan dikembalikan penuh saat motor dikembalikan dalam kondisi baik dan tepat waktu. Besaran deposit bervariasi berdasarkan tipe motor. Pembayaran dapat dilakukan secara online via Xendit atau tunai saat pengiriman.',
    },
    {
      title: '3. Kondisi & Tanggung Jawab Motor',
      body: 'Penyewa bertanggung jawab atas kondisi motor selama masa sewa. Kondisi motor akan dicatat bersama saat serah terima. Kerusakan yang terjadi selama masa sewa menjadi tanggung jawab penyewa, termasuk biaya perbaikan sesuai estimasi bengkel resmi. Motor wajib dikembalikan dalam kondisi bersih.',
    },
    {
      title: '4. Keterlambatan Pengembalian',
      body: 'Pengembalian motor melewati waktu yang disepakati akan dikenakan biaya tambahan sebesar harga sewa harian pro-rata. Segera hubungi kami jika kamu membutuhkan perpanjangan waktu agar dapat kami atur.',
    },
    {
      title: '5. Kebijakan Pembatalan',
      body: 'Pembatalan lebih dari 24 jam sebelum tanggal sewa tidak dikenakan biaya. Pembatalan kurang dari 24 jam atau tidak hadir (no-show) dapat dikenakan biaya sesuai kebijakan yang berlaku. Hubungi kami sesegera mungkin jika perlu membatalkan pesanan.',
    },
    {
      title: '6. Larangan Penggunaan',
      body: 'Motor hanya boleh digunakan di wilayah Bali. Dilarang menggunakan motor untuk balapan, offroad, atau kegiatan yang melanggar hukum. Dilarang menyewakan kembali motor kepada pihak ketiga. Pelanggaran ketentuan ini mengakibatkan batalnya perjanjian sewa tanpa pengembalian dana.',
    },
    {
      title: '7. Kecelakaan & Kedaruratan',
      body: 'Dalam keadaan kecelakaan atau darurat, segera hubungi kami via WhatsApp. Jangan tinggalkan motor tanpa penjagaan. Kami akan memandu langkah-langkah yang perlu diambil. Penyewa wajib melaporkan setiap kecelakaan kepada polisi setempat dan memberikan salinan laporan kepada kami.',
    },
    {
      title: '8. Hukum yang Berlaku',
      body: 'Perjanjian sewa ini tunduk pada hukum Republik Indonesia. Setiap perselisihan akan diselesaikan secara musyawarah. Jika tidak tercapai kesepakatan, penyelesaian akan dilakukan melalui jalur hukum yang berlaku di Bali, Indonesia.',
    },
  ],
  en: [
    {
      title: '1. Renter Requirements',
      body: 'Renters must hold a valid driving license (SIM A or SIM C). Indonesian citizens must present a valid national ID, while foreign nationals must present a valid Passport. The minimum age for renting is 17 years. Benz Rental Bali reserves the right to refuse rental if documents are incomplete or invalid.',
    },
    {
      title: '2. Deposit & Payment',
      body: 'A deposit is required upon pickup as security and will be fully refunded when the bike is returned in good condition and on time. Deposit amounts vary by bike type. Payments can be made online via Xendit or in cash upon delivery.',
    },
    {
      title: '3. Bike Condition & Responsibility',
      body: 'The renter is responsible for the condition of the bike during the rental period. The bike\'s condition will be recorded together at handover. Any damage that occurs during the rental period is the renter\'s responsibility, including repair costs based on an authorized workshop estimate. The bike must be returned clean.',
    },
    {
      title: '4. Late Returns',
      body: 'Returning the bike past the agreed time will incur an additional charge based on a pro-rata daily rate. Please contact us if you need an extension so we can arrange it for you.',
    },
    {
      title: '5. Cancellation Policy',
      body: 'Cancellations made more than 24 hours before the rental date incur no charge. Cancellations within 24 hours or no-shows may incur a fee according to current policy. Contact us as soon as possible if you need to cancel your booking.',
    },
    {
      title: '6. Prohibited Use',
      body: 'The bike may only be used within the Bali area. Use for racing, offroad activities, or any illegal purpose is strictly prohibited. Subletting the bike to third parties is not permitted. Violation of these terms will result in immediate termination of the rental agreement without refund.',
    },
    {
      title: '7. Accidents & Emergencies',
      body: 'In the event of an accident or emergency, contact us via WhatsApp immediately. Do not leave the bike unattended. We will guide you through the necessary steps. The renter must report any accident to the local police and provide us with a copy of the report.',
    },
    {
      title: '8. Governing Law',
      body: 'This rental agreement is subject to the laws of the Republic of Indonesia. Any disputes will first be resolved through mutual discussion. If no agreement is reached, the matter will be resolved through the applicable legal system in Bali, Indonesia.',
    },
  ],
}

export default function TermsPage() {
  const { t, i18n } = useTranslation()
  const isID = i18n.language === 'id'
  const sections = isID ? CONTENT.id : CONTENT.en

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-off-white pt-16">

        <div className="border-b border-gray-100 bg-white py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
              <Link to="/" className="hover:text-gold transition-colors">Home</Link>
              <span>/</span>
              <span className="text-gray-600">{t('legal.terms')}</span>
            </div>
            <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-2">{t('legal.badge')}</p>
            <h1 className="font-heading text-4xl font-bold text-charcoal mb-2">{t('legal.terms')}</h1>
            <p className="text-sm text-gray-400">{t('legal.lastUpdated')}</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-10 space-y-8">
            {sections.map((s, i) => (
              <div key={i}>
                <h2 className="font-heading font-bold text-charcoal text-lg mb-3">{s.title}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">
              {isID ? 'Ada pertanyaan tentang syarat & ketentuan ini?' : 'Have questions about these terms?'}
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
