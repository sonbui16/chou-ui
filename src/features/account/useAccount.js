import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as accountService from '@/services/account'

/**
 * Hook React Query cho tài khoản (địa chỉ, đơn thuê, đánh giá, mã giảm giá).
 * Gọi qua `@/services/account`; tự invalidate cache sau mutation.
 */

/* ---------------- Addresses ---------------- */
export function useAddresses(enabled = true) {
  return useQuery({ queryKey: ['addresses'], queryFn: accountService.getAddresses, enabled })
}
export function useSaveAddress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: accountService.saveAddress,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  })
}
export function useDeleteAddress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: accountService.deleteAddress,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  })
}

/* ---------------- Rentals ---------------- */
export function useMyRentals(enabled = true) {
  return useQuery({ queryKey: ['rentals'], queryFn: accountService.getMyRentals, enabled })
}
export function useRental(rentalNo) {
  return useQuery({
    queryKey: ['rental', rentalNo],
    queryFn: () => accountService.getRental(rentalNo),
    enabled: Boolean(rentalNo),
  })
}
export function useCreateRental() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: accountService.createRental,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rentals'] }),
  })
}

/* ---------------- Reviews ---------------- */
export function useCreateReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: accountService.createReview,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['product-reviews'] }),
  })
}

/* ---------------- Coupons ---------------- */
export function useValidateCoupon() {
  return useMutation({ mutationFn: accountService.validateCoupon })
}
