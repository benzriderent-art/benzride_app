import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { useAdminAuth } from '@/context/AdminAuthContext'

export default function AdminLogin() {
  const { login, isAuthenticated } = useAdminAuth()
  const navigate = useNavigate()

  if (isAuthenticated) {
    navigate('/admin')
    return null
  }

  const [form, setForm] = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.username, form.password)
      navigate('/admin')
    } catch {
      setError('Username atau password salah.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-heading text-2xl font-bold text-charcoal tracking-wider">BENZ</p>
          <p className="text-xs text-gold font-bold tracking-[0.2em] uppercase">Admin Panel</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-7 shadow-sm">
          <div className="flex items-center justify-center w-12 h-12 bg-gold/10 rounded-full mx-auto mb-5">
            <Lock size={20} className="text-gold" />
          </div>
          <h1 className="text-lg font-bold text-charcoal text-center mb-6">Masuk ke Panel Admin</h1>

          <form onSubmit={handleSubmit} className="space-y-4 light-form">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full border border-gray-200 rounded px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
                placeholder="admin"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-200 rounded px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold pr-10"
                  placeholder="••••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-50 px-3 py-2 rounded">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal text-white font-semibold py-2.5 rounded hover:bg-gold transition-colors disabled:opacity-60"
            >
              {loading ? 'Memverifikasi...' : 'Masuk'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          Benz Rental Bali · Admin Panel
        </p>
      </div>
    </div>
  )
}
