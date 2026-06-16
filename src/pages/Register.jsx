import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/context/AuthProvider'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/input'

const schema = z.object({
  full_name: z.string().min(2, 'Nhập họ tên'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(8, 'Số điện thoại không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
})

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (values) => {
    setServerError(null)
    try {
      await registerUser(values)
      toast.success('Tạo tài khoản thành công')
      navigate('/tai-khoan')
    } catch (e) {
      setServerError(e.message || 'Đăng ký thất bại')
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <p className="eyebrow mb-2">Gia nhập Chou</p>
      <h1 className="text-4xl">Đăng ký</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
        <Field label="Họ và tên" error={errors.full_name?.message}><Input placeholder="Nguyễn Văn A" {...register('full_name')} /></Field>
        <Field label="Email" error={errors.email?.message}><Input type="email" placeholder="ban@email.com" {...register('email')} /></Field>
        <Field label="Số điện thoại" error={errors.phone?.message}><Input placeholder="09xxxxxxxx" {...register('phone')} /></Field>
        <Field label="Mật khẩu" error={errors.password?.message}><Input type="password" placeholder="••••••••" {...register('password')} /></Field>
        {serverError && <p className="text-sm text-destructive">{serverError}</p>}
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>{isSubmitting ? 'Đang tạo…' : 'Tạo tài khoản'}</Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">Đã có tài khoản? <Link to="/dang-nhap" className="text-accent hover:underline">Đăng nhập</Link></p>
    </div>
  )
}
