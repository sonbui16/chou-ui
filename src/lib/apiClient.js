import http from '@/utils/http'

const TOKEN_KEY = 'chou:token'
const REFRESH_KEY = 'chou:refresh'

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}
export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    /* ignore */
  }
}
export function getRefresh() {
  try {
    return localStorage.getItem(REFRESH_KEY)
  } catch {
    return null
  }
}
export function setRefresh(token) {
  try {
    if (token) localStorage.setItem(REFRESH_KEY, token)
  } catch {
    /* ignore */
  }
}
/** Xoá cả access lẫn refresh token. */
export function clearTokens() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
  } catch {
    /* ignore */
  }
}
// Tương thích ngược: clearToken cũ giờ xoá cả hai.
export const clearToken = clearTokens

// "Lưu tài khoản": email đã lưu để tự điền lại form sau khi đăng xuất.
// CHỈ lưu email — KHÔNG lưu mật khẩu (tránh để mật khẩu dạng thường trong trình duyệt).
const REMEMBER_EMAIL_KEY = 'chou:remember-email'
export function getRememberedEmail() {
  try {
    return localStorage.getItem(REMEMBER_EMAIL_KEY) ?? ''
  } catch {
    return ''
  }
}
export function setRememberedEmail(email) {
  try {
    if (email) localStorage.setItem(REMEMBER_EMAIL_KEY, email)
    else localStorage.removeItem(REMEMBER_EMAIL_KEY)
  } catch {
    /* ignore */
  }
}

/** Lỗi API có status + code để UI hiển thị thông điệp phù hợp. */
export class ApiError extends Error {
  constructor(status, code, message) {
    super(message || code || 'Lỗi không xác định')
    this.status = status
    this.code = code
  }
}

/** Bóc envelope { status, data } của chou-api; 204/body trống -> null. */
function unwrap(data) {
  if (data && typeof data === 'object' && data.status === 'success') return data.data ?? null
  return data === '' || data === undefined ? null : data
}

/** Gửi request thật (gắn Bearer access token + bóc envelope). Ném lỗi axios khi non-2xx. */
async function rawSend(path, { method = 'GET', body, signal } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const verb = method.toLowerCase()
  const config = { headers, signal }

  let data
  if (verb === 'get') data = await http.get(path, config)
  else if (verb === 'delete') data = await http.del(path, config)
  else data = await http[verb](path, body, config)
  return unwrap(data)
}

// Single-flight: nhiều request 401 cùng lúc chỉ gọi /auth/refresh một lần.
let refreshing = null
async function tryRefresh() {
  const refresh_token = getRefresh()
  if (!refresh_token) return false
  if (!refreshing) {
    refreshing = http
      .post('/auth/refresh', { refresh_token })
      .then((res) => {
        const payload = res?.status === 'success' ? res.data : res // bóc envelope
        if (!payload?.token) return false
        setToken(payload.token)
        setRefresh(payload.refresh_token)
        return true
      })
      .catch(() => false)
  }
  const ok = await refreshing
  refreshing = null
  return ok
}

const NO_REFRESH = /\/auth\/(refresh|login|register)$/

/**
 * Gọi API. `path` bắt đầu bằng '/'. Tự gắn Bearer token nếu có.
 * Khi 401 và có refresh token -> tự gọi /auth/refresh rồi thử lại 1 lần.
 * Thất bại -> xoá token + phát sự kiện để app điều hướng về đăng nhập.
 */
export async function apiFetch(path, options = {}) {
  try {
    return await rawSend(path, options)
  } catch (e) {
    if (!e?.response) throw e // lỗi mạng / huỷ request

    if (e.response.status === 401 && !NO_REFRESH.test(path) && getRefresh()) {
      const ok = await tryRefresh()
      if (ok) {
        try {
          return await rawSend(path, options)
        } catch (e2) {
          if (!e2?.response) throw e2
          if (e2.response.status === 401) {
            clearTokens()
            window.dispatchEvent(new CustomEvent('chou:unauthorized'))
          }
          const err2 = e2.response.data?.error ?? {}
          throw new ApiError(e2.response.status, err2.code, err2.message)
        }
      }
    }

    const status = e.response.status
    const err = e.response.data?.error ?? {}
    if (status === 401) {
      clearTokens()
      window.dispatchEvent(new CustomEvent('chou:unauthorized'))
    }
    throw new ApiError(status, err.code, err.message)
  }
}
