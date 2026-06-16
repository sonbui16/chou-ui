import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { apiFetch, setToken, clearToken, getToken } from '@/lib/apiClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(getToken()))

  // Khôi phục phiên từ token
  useEffect(() => {
    if (!getToken()) {
      setLoading(false)
      return
    }
    apiFetch('/auth/me', { auth: true })
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setLoading(false))
  }, [])

  // Bị 401 ở bất kỳ request nào -> đăng xuất
  useEffect(() => {
    const onUnauth = () => setUser(null)
    window.addEventListener('chou:unauthorized', onUnauth)
    return () => window.removeEventListener('chou:unauthorized', onUnauth)
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await apiFetch('/auth/login', { method: 'POST', body: { email, password } })
    setToken(data.token)
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (payload) => {
    const data = await apiFetch('/auth/register', { method: 'POST', body: payload })
    setToken(data.token)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
