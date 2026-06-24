import { apiFetch } from '@/lib/apiClient'

/**
 * Lớp service danh mục/sản phẩm — hàm gọi API thuần (không React).
 * Hook tương ứng nằm ở `@/features/catalog`.
 */

/** Bỏ qua giá trị rỗng, build chuỗi query (kèm dấu `?` nếu có). */
function buildQuery(params = {}) {
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') qs.set(k, v)
  }
  const query = qs.toString()
  return query ? `?${query}` : ''
}

export function getCategories() {
  return apiFetch('/categories')
}
export function getSizes() {
  return apiFetch('/sizes')
}
export function getColors() {
  return apiFetch('/colors')
}
export function getSettings() {
  return apiFetch('/settings')
}

export function getProducts(filters = {}) {
  return apiFetch(`/products${buildQuery(filters)}`)
}
export function getProduct(slug) {
  return apiFetch(`/products/${slug}`)
}
export function getProductReviews(slug) {
  return apiFetch(`/products/${slug}/reviews`)
}
export function getAvailability({ slug, variantId, start, end }) {
  return apiFetch(`/products/${slug}/availability${buildQuery({ variantId, start, end })}`)
}
