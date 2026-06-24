import { useState } from 'react'
import { Link } from 'react-router'
import { LogOut, MapPin, Package, Plus, Star, Trash2, UserCog } from 'lucide-react'
import { useAuth } from '@/store/hooks'
import { useMyRentals, useAddresses, useSaveAddress, useDeleteAddress } from '@/features/account'
import { toast } from 'sonner'
import { Button, LinkButton } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/input'
import { Card, Badge, EmptyState, Skeleton } from '@/components/ui/primitives'
import { formatDate, formatVnd } from '@/lib/format'
import { cn } from '@/lib/cn'

const STATUS = { pending: ['Chờ xác nhận', 'neutral'], confirmed: ['Đã xác nhận', 'accent'], in_use: ['Đang thuê', 'accent'], returned: ['Đã trả', 'neutral'], completed: ['Hoàn tất', 'ok'], cancelled: ['Đã huỷ', 'danger'], overdue: ['Quá hạn', 'danger'] }
const emptyAddr = { recipient: '', phone: '', line1: '', ward: '', district: '', province: '' }

export default function Account() {
  const { user, logout } = useAuth()
  const [tab, setTab] = useState('orders')
  const { data: rentals = [], isLoading: rLoading } = useMyRentals()
  const { data: addresses = [] } = useAddresses()
  const saveAddress = useSaveAddress()
  const deleteAddress = useDeleteAddress()
  const [showAddr, setShowAddr] = useState(false)
  const [form, setForm] = useState(emptyAddr)

  const TABS = [
    { id: 'orders', label: 'Đơn của tôi', icon: Package },
    { id: 'addresses', label: 'Sổ địa chỉ', icon: MapPin },
    { id: 'profile', label: 'Hồ sơ', icon: UserCog },
  ]

  const addAddress = async () => {
    if (!form.recipient || !form.phone || !form.line1 || !form.province) { toast.error('Nhập đủ thông tin địa chỉ'); return }
    await saveAddress.mutateAsync({ ...form, is_default: addresses.length === 0 })
    setForm(emptyAddr); setShowAddr(false); toast.success('Đã thêm địa chỉ')
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow mb-2">Tài khoản</p><h1 className="text-4xl">Xin chào, {user?.full_name}</h1></div>
        <Button variant="ghost" size="sm" onClick={logout}><LogOut className="size-4" /> Đăng xuất</Button>
      </div>

      <div className="mt-8 flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn('flex items-center gap-2 border-b-2 px-4 py-3 text-sm', tab === t.id ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground')}>
            <t.icon className="size-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'orders' && (
          rLoading ? <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
          : rentals.length === 0 ? <EmptyState icon={<Package className="size-10" />} title="Chưa có đơn thuê" description="Đơn thuê của bạn sẽ hiện ở đây." action={<LinkButton to="/vay">Chọn váy</LinkButton>} />
          : <div className="space-y-3">
              {rentals.map((r) => {
                const [label, tone] = STATUS[r.status]
                return (
                  <Link key={r.id} to={`/tai-khoan/don/${r.rental_no}`}>
                    <Card className="flex flex-wrap items-center justify-between gap-4 p-5 transition-colors hover:border-ink">
                      <div>
                        <div className="flex items-center gap-3"><span className="font-mono text-sm">{r.rental_no}</span><Badge tone={tone}>{label}</Badge></div>
                        <p className="mt-1 text-sm text-muted-foreground">{r.items.map((i) => i.product_name).join(', ')}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{formatDate(r.start_date)} → {formatDate(r.end_date)}</p>
                      </div>
                      <p className="font-[var(--font-display)] text-xl text-accent">{formatVnd(r.grand_total)}</p>
                    </Card>
                  </Link>
                )
              })}
            </div>
        )}

        {tab === 'addresses' && (
          <div className="space-y-4">
            {addresses.map((a) => (
              <Card key={a.id} className="flex items-start justify-between gap-4 p-5">
                <div className="text-sm">
                  <p className="flex items-center gap-2 font-medium">{a.recipient} · {a.phone} {a.is_default && <Badge tone="accent">Mặc định</Badge>}</p>
                  <p className="mt-1 text-muted-foreground">{[a.line1, a.ward, a.district, a.province].filter(Boolean).join(', ')}</p>
                </div>
                <div className="flex gap-2">
                  {!a.is_default && <Button variant="ghost" size="sm" onClick={() => { saveAddress.mutate({ ...a, is_default: true }); toast.success('Đã đặt mặc định') }}>Đặt mặc định</Button>}
                  <button onClick={() => { deleteAddress.mutate(a.id); toast.success('Đã xoá') }} className="text-muted-foreground hover:text-destructive" aria-label="Xoá"><Trash2 className="size-4" /></button>
                </div>
              </Card>
            ))}
            {showAddr ? (
              <Card className="p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Người nhận"><Input value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} /></Field>
                  <Field label="Số điện thoại"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
                  <div className="sm:col-span-2"><Field label="Địa chỉ"><Input value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} /></Field></div>
                  <Field label="Phường/Xã"><Input value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value })} /></Field>
                  <Field label="Quận/Huyện"><Input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} /></Field>
                  <div className="sm:col-span-2"><Field label="Tỉnh/Thành phố"><Input value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} /></Field></div>
                </div>
                <div className="mt-4 flex gap-2"><Button onClick={addAddress} disabled={saveAddress.isPending}>Lưu địa chỉ</Button><Button variant="ghost" onClick={() => setShowAddr(false)}>Huỷ</Button></div>
              </Card>
            ) : <Button variant="outline" onClick={() => setShowAddr(true)}><Plus className="size-4" /> Thêm địa chỉ</Button>}
          </div>
        )}

        {tab === 'profile' && (
          <Card className="max-w-lg p-6">
            <div className="space-y-4">
              <Field label="Họ và tên"><Input defaultValue={user?.full_name} readOnly /></Field>
              <Field label="Email"><Input defaultValue={user?.email ?? ''} readOnly /></Field>
              <Field label="Số điện thoại"><Input defaultValue={user?.phone ?? ''} readOnly /></Field>
              {user?.created_at && <p className="flex items-center gap-2 text-xs text-muted-foreground"><Star className="size-3.5 text-accent" /> Thành viên từ {formatDate(user.created_at)}</p>}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
