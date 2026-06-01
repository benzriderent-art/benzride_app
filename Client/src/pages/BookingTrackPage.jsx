import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search, CheckCircle, Clock, XCircle, Bike, ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { bookingApi } from '@/api/bookings'
import { formatIDR } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'

export default function BookingTrackPage() {
  const [params] = useSearchParams()
  const { t, i18n } = useTranslation()
  const [form, setForm] = useState({ id: params.get('id') ?? '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const STATUS_CONFIG = {
    PENDING:   { label: t('track.statusPending'),   icon: Clock,        color: 'text-yellow-500', bg: 'bg-yellow-50 border-yellow-200' },
    ACTIVE:    { label: t('track.statusActive'),     icon: CheckCircle,  color: 'text-green-500',  bg: 'bg-green-50 border-green-200' },
    COMPLETED: { label: t('track.statusCompleted'),  icon: CheckCircle,  color: 'text-blue-500',   bg: 'bg-blue-50 border-blue-200' },
    CANCELLED: { label: t('track.statusCancelled'),  icon: XCircle,      color: 'text-red-400',    bg: 'bg-red-50 border-red-200' },
  }

  const PAY_CONFIG = {
    UNPAID:   { label: t('track.payUnpaid'),   color: 'text-red-500' },
    PAID:     { label: t('track.payPaid'),     color: 'text-green-600' },
    EXPIRED:  { label: t('track.payExpired'),  color: 'text-gray-400' },
    REFUNDED: { label: t('track.payRefunded'), color: 'text-gray-500' },
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!form.id.trim() || !form.phone.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await bookingApi.track(form.id.trim(), form.phone.trim())
      setResult(data)
    } catch {
      setError(t('track.notFound'))
    } finally {
      setLoading(false)
    }
  }

  const status = result ? (STATUS_CONFIG[result.status] ?? STATUS_CONFIG.PENDING) : null
  const pay = result ? (PAY_CONFIG[result.paymentStatus] ?? PAY_CONFIG.UNPAID) : null

  const isID = i18n.language === 'id'
  const titleText = isID ? 'Lacak Booking Motor – Benzride Bali' : 'Track Your Motorcycle Booking – Benzride Bali'
  const descText  = isID
    ? 'Cek status booking motor sewamu di Benzride Bali. Masukkan ID booking dan nomor HP untuk melihat detail dan status pembayaran.'
    : 'Check your motorcycle rental booking status at Benzride Bali. Enter your booking ID and phone number to view details and payment status.'

  return (
    <>
      <title>{titleText}</title>
      <meta name="description" content={descText} />
      <link rel="canonical" href="https://benzride.com/booking/track" />
      <Navbar />
      <div className="min-h-screen bg-off-white pt-16">
        <div className="max-w-lg mx-auto px-4 sm:px-6 py-16">

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gold/10 rounded-full mb-4">
              <Search size={24} className="text-gold" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-charcoal mb-2">{t('track.title')}</h1>
            <p className="text-gray-400 text-sm">{t('track.desc')}</p>
          </div>

          <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">{t('track.idLabel')}</label>
              <input
                type="text"
                value={form.id}
                onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                placeholder={t('track.idPlaceholder')}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold font-mono text-charcoal placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">{t('track.phoneLabel')}</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder={t('track.phonePlaceholder')}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-charcoal placeholder:text-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !form.id.trim() || !form.phone.trim()}
              className="w-full bg-charcoal text-white font-semibold py-3 rounded-xl text-sm hover:bg-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('track.searching') : t('track.searchBtn')}
            </button>
          </form>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3.5 text-sm text-red-600 text-center mb-6">
              {error}
            </div>
          )}

          {result && status && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className={`border-b px-6 py-4 flex items-center gap-3 ${status.bg}`}>
                <status.icon size={20} className={status.color} />
                <div>
                  <p className="text-xs text-gray-500 font-medium">{t('track.statusLabel')}</p>
                  <p className={`font-bold text-sm ${status.color}`}>{status.label}</p>
                </div>
              </div>

              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: t('track.motorLabel'),    value: result.motorName },
                    { label: t('track.customerLabel'), value: result.customerName },
                    { label: t('track.startLabel'),    value: formatDate(result.startDate, i18n.language) },
                    { label: t('track.endLabel'),      value: formatDate(result.endDate, i18n.language) },
                    { label: t('track.durationLabel'), value: `${result.durationDays} ${t('track.durationUnit')}` },
                    { label: t('track.paymentLabel'),  value: pay.label, className: pay.color },
                  ].map(({ label, value, className }) => (
                    <div key={label}>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                      <p className={`text-sm font-semibold ${className ?? 'text-charcoal'}`}>{value}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-50 pt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">{t('track.totalLabel')}</span>
                  <span className="text-lg font-bold text-charcoal">{formatIDR(result.totalPrice)}</span>
                </div>

                {result.paymentUrl && result.paymentStatus === 'UNPAID' && (
                  <>
                    <a
                      href={result.paymentUrl}
                      className="w-full inline-flex items-center justify-center gap-2 bg-charcoal text-white font-semibold py-3 rounded-xl text-sm hover:bg-gold transition-colors"
                    >
                      {t('track.completePay')}
                      <ArrowRight size={15} />
                    </a>
                    <p className="text-[11px] text-gray-400 text-center -mt-1">
                      {t('track.payLinkNote')}
                    </p>
                  </>
                )}
                {result.paymentStatus === 'EXPIRED' && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-center">
                    <p className="text-xs font-semibold text-gray-500 mb-1">{t('track.expiredTitle')}</p>
                    <p className="text-[11px] text-gray-400">{t('track.expiredNote')}</p>
                  </div>
                )}

                {result.deliveryLocation && (
                  <div className="bg-off-white rounded-lg px-4 py-3 text-xs text-gray-500">
                    <span className="font-semibold text-charcoal block mb-0.5">{t('track.deliveryLabel')}</span>
                    {result.deliveryLocation}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/fleet" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gold transition-colors">
              <Bike size={14} />
              {t('track.viewOther')}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
