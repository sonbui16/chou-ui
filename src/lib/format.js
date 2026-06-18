import { format, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale'

export function formatVnd(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0)
}

export function formatNumber(n) {
  return new Intl.NumberFormat('vi-VN').format(Number(n) || 0)
}

const toDate = (d) => (typeof d === 'string' ? parseISO(d) : d)

export function formatDate(d) {
  return format(toDate(d), 'd MMM, yyyy', { locale: vi })
}

export function formatDateLong(d) {
  return format(toDate(d), 'EEEE, dd/MM/yyyy', { locale: vi })
}

export function toIsoDate(d) {
  return format(d, 'yyyy-MM-dd')
}

export function rentalDays(startIso, endIso) {
  const ms = parseISO(endIso).getTime() - parseISO(startIso).getTime()
  return Math.max(1, Math.round(ms / 86_400_000) + 1)
}

export function isNewProduct(createdAt, days = 10) {
  if (!createdAt) return false
  const created = typeof createdAt === 'string' ? parseISO(createdAt) : createdAt
  const ageDays = (Date.now() - created.getTime()) / 86_400_000
  return ageDays >= 0 && ageDays < days
}
