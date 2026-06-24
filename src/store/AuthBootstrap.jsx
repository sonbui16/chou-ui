import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getToken, clearToken } from '@/lib/apiClient'
import * as authService from '@/services/auth'
import { setUser, clearUser, setLoading } from './authSlice'

/**
 * Khởi tạo phiên: nếu có token thì gọi getMe để khôi phục `user`.
 * Đồng thời lắng nghe sự kiện `chou:unauthorized` (apiClient phát khi gặp 401) -> đăng xuất.
 * Render null; mount một lần dưới <Provider>.
 */
export function AuthBootstrap() {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!getToken()) {
      dispatch(setLoading(false))
      return
    }
    authService
      .getMe()
      .then((user) => dispatch(setUser(user)))
      .catch(() => {
        clearToken()
        dispatch(clearUser())
      })
      .finally(() => dispatch(setLoading(false)))
  }, [dispatch])

  useEffect(() => {
    const onUnauth = () => dispatch(clearUser())
    window.addEventListener('chou:unauthorized', onUnauth)
    return () => window.removeEventListener('chou:unauthorized', onUnauth)
  }, [dispatch])

  return null
}
