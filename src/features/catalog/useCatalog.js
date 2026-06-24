import { useQuery } from '@tanstack/react-query'
import * as catalogService from '@/services/catalog'

/**
 * Hook React Query cho danh mục/sản phẩm. Gọi qua `@/services/catalog`.
 * Trang chỉ cần import hook ở đây, không gọi service trực tiếp.
 */

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: catalogService.getCategories,
    staleTime: Infinity,
  })
}
export function useSizes() {
  return useQuery({ queryKey: ['sizes'], queryFn: catalogService.getSizes, staleTime: Infinity })
}
export function useColors() {
  return useQuery({ queryKey: ['colors'], queryFn: catalogService.getColors, staleTime: Infinity })
}
export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: catalogService.getSettings,
    staleTime: Infinity,
  })
}

export function useProducts(filters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => catalogService.getProducts(filters),
    placeholderData: (prev) => prev, // giữ data cũ khi đổi trang/lọc
  })
}

export function useProduct(slug) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => catalogService.getProduct(slug),
    enabled: Boolean(slug),
  })
}

export function useProductReviews(slug) {
  return useQuery({
    queryKey: ['product-reviews', slug],
    queryFn: () => catalogService.getProductReviews(slug),
    enabled: Boolean(slug),
  })
}

export function useAvailability({ slug, variantId, start, end }) {
  return useQuery({
    queryKey: ['availability', slug, variantId, start, end],
    queryFn: () => catalogService.getAvailability({ slug, variantId, start, end }),
    enabled: Boolean(slug && variantId && start && end),
  })
}
