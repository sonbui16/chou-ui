import { rentalDays } from './format'

/**
 * Tính preview các khoản tiền của giỏ (server là nguồn chốt khi đặt đơn).
 * lines: [{ unit_price, deposit, start, end }]
 */
export function computeTotals(lines, { fulfillment, discount = 0, freeShippingMin = 500000 }) {
  const subtotal = lines.reduce((s, l) => s + Number(l.unit_price) * rentalDays(l.start, l.end), 0)
  const depositTotal = lines.reduce((s, l) => s + Number(l.deposit), 0)
  const net = Math.max(0, subtotal - discount)
  const shipping = fulfillment === 'pickup' || net >= freeShippingMin ? 0 : 40000
  const grandTotal = net + shipping
  return {
    subtotal,
    depositTotal,
    discount,
    shipping,
    grandTotal,
    dueNow: grandTotal + depositTotal,
  }
}
