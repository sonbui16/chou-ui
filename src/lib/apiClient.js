import http from '@/utils/http'

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

  const verb = method.toLowerCase()
  const config = { headers, signal }

  try {
    let data
    if (verb === 'get') data = await http.get(path, config)
    else if (verb === 'delete') data = await http.del(path, config)
    else data = await http[verb](path, body, config)

    // 204 / body trống -> null (giữ đúng hành vi cũ)
    return data === '' || data === undefined ? null : data
  } catch (e) {
    // Lỗi do server trả về (non-2xx)
    if (e?.response) {
      const status = e.response.status
      const err = e.response.data?.error ?? {}
      if (status === 401) {
        clearToken()
        window.dispatchEvent(new CustomEvent('chou:unauthorized'))
      }
      throw new ApiError(status, err.code, err.message)
    }
    // Lỗi mạng / huỷ request -> giữ nguyên để caller (vd React Query) xử lý
    throw e
  }
}
