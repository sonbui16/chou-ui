import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/apiClient'

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: () => apiFetch('/categories'), staleTime: Infinity })
}
export function useSizes() {
  return useQuery({ queryKey: ['sizes'], queryFn: () => apiFetch('/sizes'), staleTime: Infinity })
}
export function useColors() {
  return useQuery({ queryKey: ['colors'], queryFn: () => apiFetch('/colors'), staleTime: Infinity })
}
export function useSettings() {
  return useQuery({ queryKey: ['settings'], queryFn: () => apiFetch('/settings'), staleTime: Infinity })
}

export function useProducts(filters = {}) {
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== null && v !== '') qs.set(k, v)
  }
  const query = qs.toString()
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => apiFetch(`/products${query ? `?${query}` : ''}`),
    placeholderData: (prev) => prev, // giữ data cũ khi đổi trang/lọc
  })
}

export function useProduct(slug) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => apiFetch(`/products/${slug}`),
    enabled: Boolean(slug),
  })
}

export function useProductReviews(slug) {
  return useQuery({
    queryKey: ['product-reviews', slug],
    queryFn: () => apiFetch(`/products/${slug}/reviews`),
    enabled: Boolean(slug),
  })
}

export function useAvailability({ slug, variantId, start, end }) {
  return useQuery({
    queryKey: ['availability', slug, variantId, start, end],
    queryFn: () =>
      apiFetch(`/products/${slug}/availability?variantId=${variantId}&start=${start}&end=${end}`),
    enabled: Boolean(slug && variantId && start && end),
  })
}
