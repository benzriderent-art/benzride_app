import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '@/api/auth'

const AdminAuthContext = createContext(null)

const TOKEN_KEY = 'benz-admin-token'
const LOGIN_TS_KEY = 'benz-admin-login-ts'
const SESSION_MS = 8 * 60 * 60 * 1000

function isSessionValid() {
  if (!sessionStorage.getItem(TOKEN_KEY)) return false
  const ts = parseInt(sessionStorage.getItem(LOGIN_TS_KEY) ?? '0', 10)
  return ts > 0 && Date.now() - ts < SESSION_MS
}

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (!isSessionValid()) {
      sessionStorage.removeItem(TOKEN_KEY)
      sessionStorage.removeItem(LOGIN_TS_KEY)
      return false
    }
    return true
  })

  useEffect(() => {
    if (!isAuthenticated) return
    const remaining = SESSION_MS - (Date.now() - parseInt(sessionStorage.getItem(LOGIN_TS_KEY) ?? '0', 10))
    if (remaining <= 0) { logout(); return }
    const timer = setTimeout(logout, remaining)
    return () => clearTimeout(timer)
  }, [isAuthenticated])

  const login = async (username, password) => {
    const data = await authApi.login(username, password)
    sessionStorage.setItem(TOKEN_KEY, data.token)
    sessionStorage.setItem(LOGIN_TS_KEY, Date.now().toString())
    setIsAuthenticated(true)
  }

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(LOGIN_TS_KEY)
    setIsAuthenticated(false)
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => useContext(AdminAuthContext)
