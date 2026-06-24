import { Navigate, useLocation } from 'react-router'
import { useAuth } from '@/store/hooks'
import { Spinner } from '@/components/ui/primitives'

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }
  if (!user) {
    return <Navigate to="/dang-nhap" replace state={{ from: location.pathname }} />
  }
  return children
}
