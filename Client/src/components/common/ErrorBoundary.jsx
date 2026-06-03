import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info?.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center px-4 text-center">
        <div
          className="absolute font-heading font-black text-gold select-none leading-none pointer-events-none"
          style={{ fontSize: 'clamp(120px, 22vw, 260px)', opacity: 0.04, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', whiteSpace: 'nowrap' }}
        >
          500
        </div>
        <div className="relative z-10 flex flex-col items-center max-w-md">
          <div className="mb-6">
            <span className="font-heading text-xl font-bold text-white tracking-wider">BENZ</span>
            <span className="font-heading text-xl font-bold text-gold"> RENTAL</span>
          </div>
          <p className="text-xs font-black text-gold tracking-[0.25em] uppercase mb-3">Error</p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4 leading-[1.1]">
            Ada yang tidak beres
          </h1>
          <p className="text-white/40 mb-10 leading-relaxed text-sm">
            Terjadi kesalahan yang tidak terduga. Coba muat ulang halaman atau kembali ke beranda.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.reload() }}
              className="inline-flex items-center gap-2 bg-gold text-charcoal font-bold px-7 py-3.5 rounded-xl hover:opacity-90 transition-opacity text-sm"
            >
              Muat Ulang
            </button>
            <Link
              to="/"
              onClick={() => this.setState({ hasError: false })}
              className="inline-flex items-center gap-2 border border-white/15 text-white/60 hover:text-gold hover:border-gold/50 font-bold px-7 py-3.5 rounded-xl transition-colors text-sm"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
