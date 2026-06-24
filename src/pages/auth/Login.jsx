import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/store/hooks'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/input'

const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Nhập mật khẩu'),
})

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async ({ email, password }) => {
    setServerError(null)
    try {
      await login(email, password)
      toast.success('Đăng nhập thành công')
      navigate(location.state?.from ?? '/tai-khoan')
    } catch (e) {
      setServerError(e.message || 'Đăng nhập thất bại')
    }
  }

  const quick = async (email, password, to) => {
    try { await login(email, password); navigate(to) } catch (e) { setServerError(e.message) }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <p className="eyebrow mb-2">Chào mừng trở lại</p>
      <h1 className="text-4xl">Đăng nhập</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
        <Field label="Email" error={errors.email?.message}><Input type="email" placeholder="ban@email.com" {...register('email')} /></Field>
        <Field label="Mật khẩu" error={errors.password?.message}><Input type="password" placeholder="••••••••" {...register('password')} /></Field>
        {serverError && <p className="text-sm text-destructive">{serverError}</p>}
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>{isSubmitting ? 'Đang đăng nhập…' : 'Đăng nhập'}</Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">Chưa có tài khoản? <Link to="/dang-ky" className="text-accent hover:underline">Đăng ký</Link></p>

      <div className="my-8 border-t border-dashed hairline" />
      <p className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Đăng nhập nhanh (demo)</p>
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => quick('mai.anh@example.com', 'test123', '/tai-khoan')}>Khách hàng</Button>
      </div>
    </div>
  )
}
