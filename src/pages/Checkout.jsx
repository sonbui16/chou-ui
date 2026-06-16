import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Store, Tag, Truck } from 'lucide-react'
import { useCart } from '@/context/CartProvider'
import { useSettings } from '@/api/catalog'
import { useAddresses, useSaveAddress, useCreateRental, useValidateCoupon } from '@/api/account'
import { toast } from 'sonner'
import { PriceSummary } from '@/components/booking/PriceSummary'
import { Button } from '@/components/ui/button'
import { Field, Input, Textarea } from '@/components/ui/input'
import { EmptyState } from '@/components/ui/primitives'
import { computeTotals } from '@/lib/pricing'
import { rentalDays } from '@/lib/format'
import { cn } from '@/lib/cn'

const PAYMENTS = [
  { value: 'vnpay', label: 'VNPay', note: 'Thẻ ATM / QR' },
  { value: 'momo', label: 'Ví MoMo', note: 'Thanh toán nhanh' },
  { value: 'bank_transfer', label: 'Chuyển khoản', note: 'Ngân hàng' },
  { value: 'cash', label: 'Tiền mặt tại shop', note: 'Trả khi nhận váy' },
]
const emptyAddr = { recipient: '', phone: '', line1: '', ward: '', district: '', province: '' }

export default function Checkout() {
  const { items, clear } = useCart()
  const navigate = useNavigate()
  const { data: settings } = useSettings()
  const { data: addresses = [] } = useAddresses()
  const saveAddress = useSaveAddress()
  const createRental = useCreateRental()
  const validateCoupon = useValidateCoupon()

  const [fulfillment, setFulfillment] = useState('pickup')
  const [addressId, setAddressId] = useState(null)
  const [adding, setAdding] = useState(false)
  const [newAddr, setNewAddr] = useState(emptyAddr)
  const [method, setMethod] = useState('vnpay')
  const [note, setNote] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponMsg, setCouponMsg] = useState(null)

  const defaultAddr = useMemo(() => addresses.find((a) => a.is_default) ?? addresses[0], [addresses])
  const selectedAddr = addressId ?? defaultAddr?.id ?? null

  if (items.length === 0) {
    return <div className="mx-auto max-w-3xl px-4 py-16"><EmptyState title="Chưa có váy để đặt" description="Giỏ thuê của bạn đang trống." action={<Button onClick={() => navigate('/vay')}>Chọn váy</Button>} /></div>
  }

  const subtotal = items.reduce((s, i) => s + i.unit_price * rentalDays(i.start, i.end), 0)
  const totals = computeTotals(items, { fulfillment, discount, freeShippingMin: settings?.free_shipping_min ?? 500000 })

  const applyCoupon = async () => {
    if (!couponCode.trim()) return
    try {
      const res = await validateCoupon.mutateAsync({ code: couponCode, subtotal })
      setDiscount(res.discount)
      setCouponMsg(null)
      toast.success(`Đã áp dụng mã ${res.code}`)
    } catch (e) {
      setDiscount(0)
      setCouponMsg(e.message)
    }
  }

  const placeOrder = async () => {
    let finalAddressId = null
    if (fulfillment === 'delivery') {
      if (adding || addresses.length === 0) {
        if (!newAddr.recipient || !newAddr.phone || !newAddr.line1 || !newAddr.province) {
          toast.error('Vui lòng nhập đủ thông tin giao hàng')
          return
        }
        const saved = await saveAddress.mutateAsync({ ...newAddr, is_default: addresses.length === 0 })
        finalAddressId = saved.id
      } else {
        if (!selectedAddr) { toast.error('Vui lòng chọn địa chỉ giao'); return }
        finalAddressId = selectedAddr
      }
    }

    try {
      const rental = await createRental.mutateAsync({
        fulfillment,
        address_id: finalAddressId,
        method,
        note: note || undefined,
        coupon_code: couponCode.trim() || undefined,
        items: items.map((i) => ({ variant_id: i.variantId, start: i.start, end: i.end })),
      })
      clear()
      toast.success('Đặt thuê thành công!')
      navigate(`/dat-hang/${rental.rental_no}`)
    } catch (e) {
      toast.error(e.code === 'OUT_OF_STOCK' || e.code === 'DOUBLE_BOOKING'
        ? 'Rất tiếc, váy vừa hết chỗ trong khoảng ngày này.'
        : e.message || 'Không đặt được đơn')
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-4xl">Đặt thuê</h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-10">
          {/* fulfillment */}
          <section>
            <h2 className="mb-4 text-xl">Hình thức nhận váy</h2>
            <div className="grid grid-cols-2 gap-3">
              {[{ v: 'pickup', label: 'Nhận tại atelier', desc: 'Đến thử và lấy trực tiếp', icon: Store },
                { v: 'delivery', label: 'Giao tận nơi', desc: 'Ship nội thành', icon: Truck }].map((o) => (
                <button key={o.v} onClick={() => setFulfillment(o.v)}
                  className={cn('flex items-start gap-3 rounded-md border p-4 text-left', fulfillment === o.v ? 'border-ink bg-muted' : 'border-input hover:border-ink')}>
                  <o.icon className="mt-0.5 size-5 text-accent" />
                  <span><span className="block font-medium">{o.label}</span><span className="block text-xs text-muted-foreground">{o.desc}</span></span>
                </button>
              ))}
            </div>
          </section>

          {/* address */}
          {fulfillment === 'delivery' && (
            <section>
              <h2 className="mb-4 text-xl">Địa chỉ giao</h2>
              {addresses.length > 0 && !adding && (
                <div className="space-y-3">
                  {addresses.map((a) => (
                    <label key={a.id} className={cn('flex cursor-pointer items-start gap-3 rounded-md border p-4', selectedAddr === a.id ? 'border-ink bg-muted' : 'border-input')}>
                      <input type="radio" name="addr" checked={selectedAddr === a.id} onChange={() => setAddressId(a.id)} className="mt-1 accent-[color:var(--ink)]" />
                      <span className="text-sm"><span className="font-medium">{a.recipient}</span> · {a.phone}
                        <span className="block text-muted-foreground">{[a.line1, a.ward, a.district, a.province].filter(Boolean).join(', ')}</span></span>
                    </label>
                  ))}
                  <button onClick={() => setAdding(true)} className="text-sm text-accent hover:underline">+ Thêm địa chỉ mới</button>
                </div>
              )}
              {(adding || addresses.length === 0) && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Người nhận"><Input value={newAddr.recipient} onChange={(e) => setNewAddr({ ...newAddr, recipient: e.target.value })} /></Field>
                  <Field label="Số điện thoại"><Input value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} /></Field>
                  <div className="sm:col-span-2"><Field label="Địa chỉ"><Input value={newAddr.line1} onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })} placeholder="Số nhà, tên đường" /></Field></div>
                  <Field label="Phường/Xã"><Input value={newAddr.ward} onChange={(e) => setNewAddr({ ...newAddr, ward: e.target.value })} /></Field>
                  <Field label="Quận/Huyện"><Input value={newAddr.district} onChange={(e) => setNewAddr({ ...newAddr, district: e.target.value })} /></Field>
                  <div className="sm:col-span-2"><Field label="Tỉnh/Thành phố"><Input value={newAddr.province} onChange={(e) => setNewAddr({ ...newAddr, province: e.target.value })} /></Field></div>
                  {addresses.length > 0 && <button onClick={() => setAdding(false)} className="text-left text-sm text-accent hover:underline">Dùng địa chỉ đã lưu</button>}
                </div>
              )}
            </section>
          )}

          {/* payment */}
          <section>
            <h2 className="mb-4 text-xl">Phương thức thanh toán</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PAYMENTS.map((p) => (
                <button key={p.value} onClick={() => setMethod(p.value)}
                  className={cn('rounded-md border p-3 text-left', method === p.value ? 'border-ink bg-muted' : 'border-input hover:border-ink')}>
                  <span className="block text-sm font-medium">{p.label}</span>
                  <span className="block text-xs text-muted-foreground">{p.note}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl">Ghi chú</h2>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Yêu cầu thêm cho atelier (tuỳ chọn)" />
          </section>
        </div>

        {/* summary */}
        <aside className="h-fit rounded-md border border-border bg-card p-6">
          <h2 className="mb-4 text-xl">Đơn của bạn</h2>
          <ul className="mb-4 space-y-2 border-b border-border pb-4 text-sm">
            {items.map((i) => <li key={i.key} className="flex justify-between gap-2 text-muted-foreground"><span>{i.productName} ({i.sizeLabel})</span></li>)}
          </ul>
          <div className="mb-4">
            <div className="flex gap-2">
              <Input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Mã giảm giá" className="flex-1" />
              <Button variant="outline" onClick={applyCoupon} disabled={validateCoupon.isPending}><Tag className="size-4" /> Áp dụng</Button>
            </div>
            {discount > 0 && <p className="mt-2 flex items-center gap-1 text-xs text-[color:var(--color-ok)]"><Check className="size-3" /> Đã áp dụng mã</p>}
            {couponMsg && <p className="mt-2 text-xs text-destructive">{couponMsg}</p>}
            <p className="mt-2 text-xs text-muted-foreground">Thử: CHAOMUNG · HE2026 · VIPCHOU</p>
          </div>
          <PriceSummary totals={totals} />
          <Button className="mt-6 w-full" size="lg" disabled={createRental.isPending} onClick={placeOrder}>
            {createRental.isPending ? 'Đang xử lý…' : method === 'cash' ? 'Đặt giữ váy' : 'Thanh toán & đặt thuê'}
          </Button>
        </aside>
      </div>
    </div>
  )
}
