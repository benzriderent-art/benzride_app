import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, ArrowRight, MessageCircle, Search } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import { waLink } from '@/constants/contact'

export default function BookingSuccess() {
  const [params] = useSearchParams()
  const externalId = params.get('external_id')

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center px-4 text-center pt-16">
        <div className="flex flex-col items-center max-w-md w-full">

          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
            <CheckCircle size={36} className="text-green-400" />
          </div>

          <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">
            Pembayaran Berhasil
          </p>
          <h1 className="font-heading text-4xl font-bold text-white leading-[1.1] mb-4">
            Booking Dikonfirmasi!
          </h1>
          <p className="text-white/50 leading-relaxed mb-6">
            Terima kasih telah memesan di Benz Rental Bali. Tim kami akan segera menghubungimu untuk konfirmasi pengiriman motor.
          </p>

          {externalId && (
            <div className="w-full rounded-xl px-5 py-4 mb-6 text-left" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">ID Booking</p>
              <p className="font-mono text-sm text-white font-semibold">{externalId}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 w-full">
            <a
              href={waLink('Halo Benz Rental Bali, saya baru saja menyelesaikan pembayaran. Mohon konfirmasi pengiriman motor. Terima kasih!')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl text-sm text-white hover:opacity-90 transition-opacity"
              style={{ background: '#25D366' }}
            >
              <MessageCircle size={16} />
              Konfirmasi via WhatsApp
            </a>
            {externalId && (
              <Link
                to={`/booking/track?id=${externalId}`}
                className="w-full inline-flex items-center justify-center gap-2 border border-white/15 text-white/60 hover:text-gold hover:border-gold/50 font-bold py-3 rounded-xl text-sm transition-colors"
              >
                <Search size={14} />
                Lacak Status Booking
              </Link>
            )}
            <Link
              to="/"
              className="w-full inline-flex items-center justify-center gap-2 text-white/30 hover:text-white/60 text-sm transition-colors py-1"
            >
              Kembali ke Beranda
              <ArrowRight size={13} />
            </Link>
          </div>

        </div>
      </div>
    </>
  )
}
