import { Routes, Route } from 'react-router-dom'
import { StorefrontLayout } from '@/components/layout/StorefrontLayout'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import Home from '@/pages/Home'
import Catalog from '@/pages/Catalog'
import ProductDetail from '@/pages/ProductDetail'
import Cart from '@/pages/Cart'
import Checkout from '@/pages/Checkout'
import OrderConfirmation from '@/pages/OrderConfirmation'
import Account from '@/pages/Account'
import RentalDetail from '@/pages/RentalDetail'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import About from '@/pages/About'
import NotFound from '@/pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<StorefrontLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/vay" element={<Catalog />} />
        <Route path="/vay/:slug" element={<ProductDetail />} />
        <Route path="/gio-hang" element={<Cart />} />
        <Route path="/ve-chung-toi" element={<About />} />
        <Route path="/dang-nhap" element={<Login />} />
        <Route path="/dang-ky" element={<Register />} />
        <Route path="/thanh-toan" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/dat-hang/:rentalNo" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
        <Route path="/tai-khoan" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/tai-khoan/don/:rentalNo" element={<ProtectedRoute><RentalDetail /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
