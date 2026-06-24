import { Routes, Route } from 'react-router'
import { StorefrontLayout } from '@/components/layout/StorefrontLayout'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import Home from '@/pages/Home'
import Catalog from '@/pages/catalog/Catalog'
import ProductDetail from '@/pages/catalog/ProductDetail'
import Cart from '@/pages/checkout/Cart'
import Checkout from '@/pages/checkout/Checkout'
import OrderConfirmation from '@/pages/checkout/OrderConfirmation'
import Account from '@/pages/account/Account'
import RentalDetail from '@/pages/account/RentalDetail'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import About from '@/pages/About'
import NotFound from '@/pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<StorefrontLayout />}>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/vay" element={<Catalog />} />
        <Route path="/vay/:slug" element={<ProductDetail />} />
        <Route path="/gio-hang" element={<Cart />} />
        <Route path="/ve-chung-toi" element={<About />} />
        <Route path="/dang-nhap" element={<Login />} />
        <Route path="/dang-ky" element={<Register />} />

        {/* Private routes */}
        <Route path="/thanh-toan" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/dat-hang/:rentalNo" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
        <Route path="/tai-khoan" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/tai-khoan/don/:rentalNo" element={<ProtectedRoute><RentalDetail /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
