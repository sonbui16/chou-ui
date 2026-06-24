import { apiFetch } from '@/lib/apiClient'

/**
 * Lớp service xác thực — hàm gọi API thuần (không React).
 * Trả Promise; lỗi do `apiFetch` ném ra (ApiError) để caller xử lý.
 */

/** Lấy thông tin người dùng từ token hiện tại. */
export function getMe(options = {}) {
  return apiFetch('/auth/me', { auth: true, ...options })
}

/** Đăng nhập, trả `{ token, user }`. */
export function login({ email, password }) {
  return apiFetch('/auth/login', { method: 'POST', body: { email, password } })
}

/** Đăng ký, trả `{ token, user }`. */
export function register(payload) {
  return apiFetch('/auth/register', { method: 'POST', body: payload })
}
