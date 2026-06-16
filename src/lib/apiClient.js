const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'
const TOKEN_KEY = 'chou:token'

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
export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
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

/**
 * Gọi API. `path` bắt đầu bằng '/'. Tự gắn Bearer token nếu có.
 * 401 -> xoá token + phát sự kiện để app điều hướng về đăng nhập.
 */
export async function apiFetch(path, { method = 'GET', body, auth = false, signal } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  })

  if (res.status === 204) return null

  let data = null
  try {
    data = await res.json()
  } catch {
    /* không có body */
  }

  if (!res.ok) {
    const err = data?.error ?? {}
    if (res.status === 401) {
      clearToken()
      window.dispatchEvent(new CustomEvent('chou:unauthorized'))
    }
    throw new ApiError(res.status, err.code, err.message)
  }
  return data
}
