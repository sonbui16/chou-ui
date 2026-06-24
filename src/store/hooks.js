import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setToken, clearToken } from '@/lib/apiClient'
import * as authService from '@/services/auth'
import { selectUser, selectAuthLoading, setUser, clearUser } from './authSlice'
import { addItem, removeItem, clearCart, selectCartItems } from './cartSlice'

/**
 * Giữ nguyên API của context cũ (`useAuth`/`useCart`) để các trang không phải đổi.
 * Login/register ném thẳng `ApiError` từ `apiFetch` (không qua serialize của thunk).
 */
export function useAuth() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const loading = useSelector(selectAuthLoading)

  const login = useCallback(
    async (email, password) => {
      const data = await authService.login({ email, password })
      setToken(data.token)
      dispatch(setUser(data.user))
      return data.user
    },
    [dispatch],
  )

  const register = useCallback(
    async (payload) => {
      const data = await authService.register(payload)
      setToken(data.token)
      dispatch(setUser(data.user))
      return data.user
    },
    [dispatch],
  )

  const logout = useCallback(() => {
    clearToken()
    dispatch(clearUser())
  }, [dispatch])

  return { user, loading, login, register, logout }
}

export function useCart() {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)

  const add = useCallback((item) => dispatch(addItem(item)), [dispatch])
  const remove = useCallback((key) => dispatch(removeItem(key)), [dispatch])
  const clear = useCallback(() => dispatch(clearCart()), [dispatch])

  return { items, count: items.length, add, remove, clear }
}
