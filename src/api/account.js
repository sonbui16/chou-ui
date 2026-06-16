import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/apiClient'

/* ---------------- Addresses ---------------- */
export function useAddresses(enabled = true) {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: () => apiFetch('/addresses', { auth: true }),
    enabled,
  })
}
export function useSaveAddress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }) =>
      apiFetch(id ? `/addresses/${id}` : '/addresses', { method: id ? 'PUT' : 'POST', body, auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  })
}
export function useDeleteAddress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => apiFetch(`/addresses/${id}`, { method: 'DELETE', auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  })
}

/* ---------------- Rentals ---------------- */
export function useMyRentals(enabled = true) {
  return useQuery({
    queryKey: ['rentals'],
    queryFn: () => apiFetch('/rentals', { auth: true }),
    enabled,
  })
}
export function useRental(rentalNo) {
  return useQuery({
    queryKey: ['rental', rentalNo],
    queryFn: () => apiFetch(`/rentals/${rentalNo}`, { auth: true }),
    enabled: Boolean(rentalNo),
  })
}
export function useCreateRental() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body) => apiFetch('/rentals', { method: 'POST', body, auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rentals'] }),
  })
}

/* ---------------- Reviews ---------------- */
export function useCreateReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body) => apiFetch('/reviews', { method: 'POST', body, auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['product-reviews'] }),
  })
}

/* ---------------- Coupon ---------------- */
export function useValidateCoupon() {
  return useMutation({
    mutationFn: ({ code, subtotal }) =>
      apiFetch('/coupons/validate', { method: 'POST', body: { code, subtotal } }),
  })
}
