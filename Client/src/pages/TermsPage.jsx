import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <h2 className="font-heading font-bold text-charcoal text-base">{title}</h2>
        <ChevronDown size={16} className={`text-gold shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="pb-6 space-y-4">{children}</div>}
    </div>
  )
}

function P({ children }) {
  return <p className="text-sm text-gray-600 leading-relaxed">{children}</p>
}

function TableGrid({ headers, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h} className="text-left text-xs font-bold text-charcoal bg-off-white px-4 py-3 first:rounded-tl-lg last:rounded-tr-lg border border-gray-100">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 1 ? 'bg-gray-50/50' : ''}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-gray-600 border border-gray-100 text-xs">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function InsuranceCard({ label, fee, highlight, items }) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? 'border-gold bg-gold/5' : 'border-gray-200'}`}>
      <p className={`text-xs font-black tracking-widest uppercase mb-1 ${highlight ? 'text-gold' : 'text-gray-400'}`}>
        {highlight ? '★ Recommended' : 'Option'}
      </p>
      <p className="font-heading font-bold text-charcoal text-lg mb-1">{label}</p>
      <p className="text-sm font-bold text-gold mb-3">{fee}</p>
      <ul className="space-y-1.5">
        {items.map(item => (
          <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
            <span className="text-gold mt-0.5">✓</span> {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function TermsPage() {
  const { t, i18n } = useTranslation()
  const isID = i18n.language === 'id'

  const titleText = isID ? 'Syarat & Ketentuan Sewa Motor – Benzride Bali' : 'Rental Terms & Conditions – Benzride Bali'
  const descText  = isID
    ? 'Syarat dan ketentuan lengkap layanan sewa motor Benzride Bali. Persyaratan penyewa, kebijakan pembatalan, tanggung jawab, dan aturan penggunaan kendaraan.'
    : 'Complete rental terms and conditions for Benzride Bali motorcycle rental. Renter requirements, cancellation policy, liability, and vehicle use rules.'

  return (
    <>
      <title>{titleText}</title>
      <meta name="description" content={descText} />
      <link rel="canonical" href="https://benzride.com/terms" />
      <Navbar />
      <div className="min-h-screen bg-off-white pt-16">

        <div className="border-b border-gray-100 bg-white py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
              <Link to="/" className="hover:text-gold transition-colors">{t('common.home')}</Link>
              <span>/</span>
              <span className="text-gray-600">{t('legal.terms')}</span>
            </div>
            <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-2">{t('legal.badge')}</p>
            <h1 className="font-heading text-4xl font-bold text-charcoal mb-2">{t('legal.terms')}</h1>
            <p className="text-sm text-gray-400">{t('legal.lastUpdated')}</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">

            {/* 1. Rental Requirements */}
            <Section title={isID ? '1. Persyaratan Penyewa' : '1. Rental Requirements'} defaultOpen>
              <P>{isID
                ? 'Untuk menyewa kendaraan dari Benzride.com, pelanggan wajib memenuhi persyaratan berikut:'
                : 'To rent a vehicle from Benzride.com, customers must:'}</P>
              <ul className="space-y-2">
                {(isID ? [
                  'Berusia minimal 18 tahun',
                  'Menunjukkan paspor, KTP, atau kartu identitas resmi yang valid',
                  'Memiliki SIM motor yang masih berlaku',
                  'Wisatawan asing bertanggung jawab memastikan izin mengemudi sesuai peraturan Indonesia',
                  'Memberikan informasi pribadi yang akurat saat proses pemesanan',
                  'Menerima tanggung jawab atas kendaraan selama masa sewa',
                ] : [
                  'Be at least 18 years old',
                  'Present a valid passport, KTP, or government-issued identification',
                  'Hold a valid motorcycle driving license',
                  'International customers are responsible for ensuring they have the appropriate driving permit required under Indonesian regulations',
                  'Provide accurate personal information during the booking process',
                  'Accept responsibility for the vehicle during the rental period',
                ]).map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-gold mt-0.5 shrink-0">•</span> {item}
                  </li>
                ))}
              </ul>
              <P>{isID
                ? 'Benzride berhak menolak layanan sewa jika dokumen tidak lengkap atau pelanggan dianggap tidak layak mengoperasikan kendaraan dengan aman.'
                : 'Benzride reserves the right to refuse rental services if required documents are not provided or if the customer is deemed unfit to operate a vehicle safely.'}</P>
            </Section>

            {/* 2. Vehicle Use */}
            <Section title={isID ? '2. Penggunaan Kendaraan' : '2. Vehicle Use'}>
              <P>{isID
                ? 'Kendaraan yang disewa hanya boleh digunakan oleh penyewa yang terdaftar. Kegiatan berikut dilarang keras:'
                : 'The rented vehicle may only be used by the registered renter. The following activities are strictly prohibited:'}</P>
              <ul className="space-y-2">
                {(isID ? [
                  'Berkendara di medan off-road',
                  'Balapan, kompetisi, atau atraksi berbahaya',
                  'Membawa penumpang melebihi batas kapasitas',
                  'Menyewakan kembali atau meminjamkan kendaraan kepada pihak lain',
                  'Menggunakan kendaraan untuk kegiatan ilegal',
                  'Berkendara di bawah pengaruh alkohol, narkoba, atau zat yang memengaruhi kemampuan berkendara',
                ] : [
                  'Off-road riding',
                  'Racing, competitions, or stunt riding',
                  'Carrying passengers beyond legal limits',
                  'Subletting or lending the vehicle to another person',
                  'Using the vehicle for illegal activities',
                  'Riding under the influence of alcohol, drugs, or any impairing substances',
                ]).map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-red-400 mt-0.5 shrink-0">✕</span> {item}
                  </li>
                ))}
              </ul>
              <P>{isID
                ? 'Pelanggaran ketentuan ini dapat mengakibatkan pengakhiran perjanjian sewa tanpa pengembalian dana.'
                : 'Any violation may result in termination of the rental agreement without refund.'}</P>
            </Section>

            {/* 3. Deposit */}
            <Section title={isID ? '3. Kebijakan Deposit' : '3. Deposit Policy'}>
              <P>{isID
                ? 'Pelanggan wajib membayar deposit keamanan yang dapat dikembalikan sebesar Rp 1.000.000 per unit motor.'
                : 'Customers are required to pay a refundable security deposit of IDR 1,000,000 per bike.'}</P>
              <P>{isID
                ? 'Deposit berfungsi sebagai jaminan terhadap: kerusakan kendaraan, denda tilang, aksesoris yang hilang, biaya keterlambatan pengembalian, dan pelanggaran perjanjian sewa.'
                : 'The deposit serves as security against: vehicle damage, traffic fines, missing accessories or equipment, late return fees, and breach of rental agreement.'}</P>
              <P>{isID
                ? 'Deposit akan dikembalikan setelah kendaraan dikembalikan dan diinspeksi, setelah dipotong biaya-biaya yang berlaku.'
                : 'Deposits will be refunded after the vehicle is returned and inspected, subject to any applicable deductions.'}</P>
            </Section>

            {/* 4. Late Return */}
            <Section title={isID ? '4. Keterlambatan Pengembalian' : '4. Late Return Policy'}>
              <P>{isID
                ? 'Kendaraan harus dikembalikan pada tanggal dan waktu yang telah disepakati. Keterlambatan dapat dikenakan biaya tambahan:'
                : 'Vehicles must be returned at the agreed date and time. Late returns may incur additional charges:'}</P>
              <TableGrid
                headers={[isID ? 'Durasi Keterlambatan' : 'Delay Period', isID ? 'Biaya' : 'Charge']}
                rows={[
                  [isID ? 'Hingga 1 jam' : 'Up to 1 hour', isID ? 'Toleransi (atas persetujuan)' : 'Grace period (subject to approval)'],
                  [isID ? '1–4 jam' : '1–4 hours', isID ? '50% dari tarif sewa harian' : '50% of daily rental rate'],
                  [isID ? '4–12 jam' : '4–12 hours', isID ? 'Full 1 hari sewa tambahan' : 'Full additional rental day'],
                  [isID ? 'Lebih dari 12 jam' : 'More than 12 hours', isID ? 'Full 1 hari sewa tambahan' : 'Full additional rental day'],
                ]}
              />
            </Section>

            {/* 5. Traffic Violations */}
            <Section title={isID ? '5. Pelanggaran Lalu Lintas & Denda' : '5. Traffic Violations & Fines'}>
              <P>{isID
                ? 'Penyewa sepenuhnya bertanggung jawab atas: tilang lalu lintas, pelanggaran parkir, biaya tol, dan sanksi pemerintah. Semua denda yang timbul selama masa sewa harus dibayar oleh penyewa.'
                : 'The renter is fully responsible for traffic tickets, parking violations, toll charges, and government penalties. Any fines incurred during the rental period must be paid by the renter.'}</P>
            </Section>

            {/* 6. Damage & Liability */}
            <Section title={isID ? '6. Kerusakan & Tanggung Jawab' : '6. Damage & Liability'}>
              <P>{isID
                ? 'Penyewa bertanggung jawab atas setiap kehilangan atau kerusakan yang terjadi selama masa sewa. Berikut estimasi biaya perbaikan:'
                : 'The renter is responsible for any loss or damage occurring during the rental period. The following are estimated repair or replacement costs:'}</P>

              <p className="text-xs font-bold text-charcoal uppercase tracking-wider mt-4 mb-2">{isID ? 'Goresan & Kerusakan Body' : 'Body Scratches & Panel Damage'}</p>
              <TableGrid
                headers={[isID ? 'Jenis Kerusakan' : 'Damage Type', isID ? 'Biaya' : 'Charge']}
                rows={[
                  [isID ? 'Goresan kecil' : 'Minor scratch', 'IDR 250,000'],
                  [isID ? 'Goresan sedang / perlu cat ulang' : 'Medium scratch / repaint required', 'IDR 500,000'],
                  [isID ? 'Goresan dalam atau panel retak' : 'Deep scratch or cracked panel', 'IDR 750,000 – 1,500,000'],
                  [isID ? 'Penggantian panel body penuh' : 'Complete body panel replacement', 'IDR 1,500,000 – 3,000,000'],
                ]}
              />

              <p className="text-xs font-bold text-charcoal uppercase tracking-wider mt-4 mb-2">{isID ? 'Spion Rusak' : 'Broken Mirrors'}</p>
              <TableGrid
                headers={[isID ? 'Jenis Kerusakan' : 'Damage Type', isID ? 'Biaya' : 'Charge']}
                rows={[
                  [isID ? 'Satu spion' : 'One side mirror', 'IDR 250,000'],
                  [isID ? 'Spion motor premium (NMAX / PCX)' : 'Premium scooter mirror (NMAX / PCX)', 'IDR 350,000'],
                  [isID ? 'Sepasang spion' : 'Pair of mirrors', 'IDR 500,000 – 700,000'],
                ]}
              />

              <p className="text-xs font-bold text-charcoal uppercase tracking-wider mt-4 mb-2">{isID ? 'Lampu Rusak' : 'Damaged Lights'}</p>
              <TableGrid
                headers={[isID ? 'Jenis Kerusakan' : 'Damage Type', isID ? 'Biaya' : 'Charge']}
                rows={[
                  [isID ? 'Lampu sein depan' : 'Front indicator light', 'IDR 250,000'],
                  [isID ? 'Lampu sein belakang' : 'Rear indicator light', 'IDR 250,000'],
                  [isID ? 'Rakitan lampu belakang' : 'Tail light assembly', 'IDR 500,000'],
                  [isID ? 'Rakitan lampu depan' : 'Headlight assembly', 'IDR 750,000 – 2,500,000'],
                ]}
              />

              <p className="text-xs font-bold text-charcoal uppercase tracking-wider mt-4 mb-2">{isID ? 'Kerusakan Mesin Akibat Kelalaian' : 'Engine Damage Due to Misuse'}</p>
              <TableGrid
                headers={[isID ? 'Jenis Kerusakan' : 'Damage Type', isID ? 'Biaya' : 'Charge']}
                rows={[
                  [isID ? 'Perbaikan mesin minor' : 'Minor engine repair', 'IDR 1,000,000 – 3,000,000'],
                  [isID ? 'Perbaikan mesin mayor' : 'Major engine repair', 'IDR 3,000,000 – 10,000,000'],
                  [isID ? 'Penggantian mesin' : 'Engine replacement', isID ? 'Sesuai biaya aktual' : 'Based on actual repair cost'],
                ]}
              />

              <p className="text-xs font-bold text-charcoal uppercase tracking-wider mt-4 mb-2">{isID ? 'Aksesoris Hilang' : 'Missing Accessories'}</p>
              <TableGrid
                headers={[isID ? 'Aksesoris' : 'Item', isID ? 'Biaya' : 'Charge']}
                rows={[
                  [isID ? 'Helm standar' : 'Helmet', 'IDR 500,000'],
                  [isID ? 'Helm premium' : 'Premium helmet', 'IDR 1,000,000'],
                  [isID ? 'Holder HP' : 'Phone holder', 'IDR 250,000'],
                  [isID ? 'Jas hujan' : 'Raincoat', 'IDR 150,000'],
                  [isID ? 'Rak bagasi / aksesoris' : 'Luggage rack / accessories', isID ? 'Sesuai harga pengganti' : 'Actual replacement cost'],
                ]}
              />

              <p className="text-xs font-bold text-charcoal uppercase tracking-wider mt-4 mb-2">{isID ? 'Kunci Hilang' : 'Lost Keys'}</p>
              <TableGrid
                headers={[isID ? 'Item' : 'Item', isID ? 'Biaya' : 'Charge']}
                rows={[
                  [isID ? 'Penggantian kunci standar' : 'Standard key replacement', 'IDR 500,000'],
                  [isID ? 'Penggantian smart key' : 'Smart key replacement', 'IDR 1,500,000 – 3,500,000'],
                  [isID ? 'Pemrograman ulang ECU / kunci (jika diperlukan)' : 'ECU / key reprogramming (if required)', isID ? 'Sesuai biaya aktual' : 'Actual repair cost'],
                ]}
              />
            </Section>

            {/* 7. Insurance */}
            <Section title={isID ? '7. Pilihan Asuransi' : '7. Insurance Options'}>
              <P>{isID
                ? 'Benzride menawarkan tiga pilihan perlindungan:'
                : 'Benzride offers three protection options:'}</P>
              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                <InsuranceCard
                  label={isID ? 'Perlindungan Deposit' : 'Deposit Protection'}
                  fee="IDR 1,000,000"
                  items={isID
                    ? ['Deposit dapat dikembalikan setelah rental selesai', 'Pelanggan menanggung seluruh biaya perbaikan']
                    : ['Security deposit refundable after rental', 'Customer responsible for all repair costs']}
                />
                <InsuranceCard
                  label={isID ? 'Asuransi Optimal' : 'Optimal Insurance'}
                  fee="IDR 1,000,000"
                  highlight
                  items={isID
                    ? ['Tanggung jawab berkurang untuk kerusakan besar', 'Dirancang untuk meminimalkan biaya perbaikan', 'Biaya perbaikan maksimum Rp 2.500.000']
                    : ['Reduced liability for major damages', 'Designed to minimize repair expenses', 'Maximum repair cost IDR 2,500,000']}
                />
                <InsuranceCard
                  label={isID ? 'Asuransi Penuh' : 'Full Insurance'}
                  fee="IDR 2,500,000"
                  items={isID
                    ? ['Tidak ada pembayaran tambahan untuk kerusakan yang ditanggung', 'Perlindungan komprehensif untuk ketenangan pikiran']
                    : ['No additional payment for covered accidental damages', 'Comprehensive protection for full peace of mind']}
                />
              </div>

              <p className="text-xs font-bold text-charcoal uppercase tracking-wider mt-6 mb-2">{isID ? 'Pengecualian Asuransi' : 'Insurance Exclusions'}</p>
              <P>{isID
                ? 'Semua cakupan asuransi menjadi tidak berlaku dalam kondisi berikut:'
                : 'All insurance coverage becomes invalid under the following circumstances:'}</P>
              <ul className="space-y-1.5 mt-2">
                {(isID ? [
                  'Kerusakan ban', 'Penggunaan di medan off-road', 'Gagal melaporkan kejadian dalam 12 jam',
                  'Berkendara di bawah pengaruh alkohol atau narkoba', 'Penggunaan ilegal atau tidak bertanggung jawab',
                  'Pencurian kendaraan', 'Kehilangan total kendaraan', 'Kerusakan yang disengaja',
                  'Digunakan oleh pengemudi yang tidak sah',
                ] : [
                  'Tire damage', 'Off-road use', 'Failure to report an incident within 12 hours',
                  'Riding under the influence of alcohol or drugs', 'Illegal or reckless use of the vehicle',
                  'Theft of the vehicle', 'Total loss of the vehicle', 'Intentional damage',
                  'Use by unauthorized drivers',
                ]).map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-red-400 mt-0.5 shrink-0">✕</span> {item}
                  </li>
                ))}
              </ul>
            </Section>

            {/* 8. Refund */}
            <Section title={isID ? '8. Kebijakan Pengembalian Dana' : '8. Refund Policy'}>
              <p className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2">{isID ? 'Pembatalan oleh Pelanggan' : 'Cancellation by Customer'}</p>
              <TableGrid
                headers={[isID ? 'Waktu Pembatalan' : 'Cancellation Time', isID ? 'Pengembalian Dana' : 'Refund']}
                rows={[
                  [isID ? 'Lebih dari 72 jam sebelum sewa' : 'More than 72 hours before rental', isID ? 'Pengembalian penuh pembayaran sewa' : 'Full refund of rental payment'],
                  [isID ? '24–72 jam sebelum sewa' : '24–72 hours before rental', isID ? '50% pengembalian pembayaran sewa' : '50% refund of rental payment'],
                  [isID ? 'Kurang dari 24 jam sebelum sewa' : 'Less than 24 hours before rental', isID ? 'Tidak ada pengembalian dana' : 'No refund'],
                ]}
              />
              <p className="text-xs font-bold text-charcoal uppercase tracking-wider mt-5 mb-2">{isID ? 'Pengembalian Awal' : 'Early Return'}</p>
              <P>{isID
                ? 'Tidak ada pengembalian dana untuk hari sewa yang tidak terpakai jika kendaraan dikembalikan lebih awal dari jadwal.'
                : 'No refund will be provided for unused rental days if the vehicle is returned earlier than scheduled.'}</P>
              <p className="text-xs font-bold text-charcoal uppercase tracking-wider mt-5 mb-2">{isID ? 'Pembatalan oleh Benzride' : 'Cancellation by Benzride'}</p>
              <P>{isID
                ? 'Jika Benzride tidak dapat menyediakan kendaraan yang dipesan karena masalah operasional, pelanggan akan menerima kendaraan pengganti dengan kategori serupa, atau pengembalian dana penuh.'
                : 'If Benzride is unable to provide the reserved vehicle due to operational issues, customers will receive either a replacement vehicle of similar category, or a full refund.'}</P>
            </Section>

            {/* 9. Limitation of Liability */}
            <Section title={isID ? '9. Batasan Tanggung Jawab' : '9. Limitation of Liability'}>
              <P>{isID ? 'Benzride tidak bertanggung jawab atas:' : 'Benzride shall not be liable for:'}</P>
              <ul className="space-y-2 mt-2">
                {(isID ? [
                  'Cedera fisik akibat pengoperasian kendaraan yang lalai atau melanggar hukum',
                  'Kehilangan barang pribadi',
                  'Keterlambatan akibat cuaca, lalu lintas, kondisi jalan, atau force majeure',
                  'Biaya yang timbul akibat kecelakaan yang disebabkan kelalaian penyewa',
                ] : [
                  'Personal injury resulting from negligent or unlawful vehicle operation',
                  'Loss of personal belongings',
                  'Delays caused by weather, traffic, road conditions, or force majeure events',
                  'Costs incurred due to accidents caused by renter negligence',
                ]).map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-gold mt-0.5 shrink-0">•</span> {item}
                  </li>
                ))}
              </ul>
            </Section>

            {/* 10. Governing Law */}
            <Section title={isID ? '10. Hukum yang Berlaku' : '10. Governing Law'}>
              <P>{isID
                ? 'Syarat & Ketentuan ini tunduk pada dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap sengketa yang timbul dari Syarat ini akan diselesaikan melalui negosiasi terlebih dahulu dan, jika diperlukan, melalui pengadilan yang berwenang di Indonesia.'
                : 'These Terms & Conditions shall be governed by and interpreted in accordance with the laws of the Republic of Indonesia. Any disputes arising from these Terms shall be resolved through negotiation first and, if necessary, through the competent courts of Indonesia.'}</P>
            </Section>
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
