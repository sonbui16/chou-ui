import { apiFetch } from '@/lib/apiClient'

/**
 * Lớp service tài khoản (địa chỉ, đơn thuê, đánh giá, mã giảm giá)
 * — hàm gọi API thuần. Hook tương ứng nằm ở `@/features/account`.
 */

/* ---------------- Addresses ---------------- */
export function getAddresses() {
  return apiFetch('/addresses', { auth: true })
}
export function saveAddress({ id, ...body }) {
  return apiFetch(id ? `/addresses/${id}` : '/addresses', {
    method: id ? 'PUT' : 'POST',
    body,
    auth: true,
  })
}
export function deleteAddress(id) {
  return apiFetch(`/addresses/${id}`, { method: 'DELETE', auth: true })
}

/* ---------------- Rentals ---------------- */
export function getMyRentals() {
  return apiFetch('/rentals', { auth: true })
}
export function getRental(rentalNo) {
  return apiFetch(`/rentals/${rentalNo}`, { auth: true })
}
export function createRental(body) {
  return apiFetch('/rentals', { method: 'POST', body, auth: true })
}

/* ---------------- Reviews ---------------- */
export function createReview(body) {
  return apiFetch('/reviews', { method: 'POST', body, auth: true })
}

/* ---------------- Coupons ---------------- */
export function validateCoupon({ code, subtotal }) {
  return apiFetch('/coupons/validate', { method: 'POST', body: { code, subtotal } })
}
