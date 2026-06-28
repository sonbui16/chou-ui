import { apiFetch, getRefresh } from '@/lib/apiClient'

/**
 * Lớp service xác thực — hàm gọi API thuần (không React).
 * Trả Promise; lỗi do `apiFetch` ném ra (ApiError) để caller xử lý.
 */

/** Lấy thông tin người dùng từ token hiện tại. */
export function getMe(options = {}) {
  return apiFetch('/auth/me', { auth: true, ...options })
}

/** Đăng nhập, trả `{ token, refresh_token, user }`. */
export function login({ email, password }) {
  return apiFetch('/auth/login', { method: 'POST', body: { email, password } })
}

/** Đăng ký, trả `{ token, refresh_token, user }`. */
export function register(payload) {
  return apiFetch('/auth/register', { method: 'POST', body: payload })
}

/** Thu hồi refresh token hiện tại phía server (logout). Bỏ qua nếu không có. */
export function logout() {
  const refresh_token = getRefresh()
  if (!refresh_token) return Promise.resolve(null)
  return apiFetch('/auth/logout', { method: 'POST', body: { refresh_token } })
}
