import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { OrderSuccessPage } from './pages/OrderSuccessPage'

import { HomePage } from './pages/HomePage'
import { ProductPage } from './pages/ProductPage'
import { ShopPage } from './pages/ShopPage'
import { CartProvider } from './context/CartContext'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { OrderLookupPage } from './pages/OrderLookupPage'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/shop"
            element={<ShopPage />}
          />

          <Route
            path="/product/:slug"
            element={<ProductPage />}
          />
          
          <Route
            path="/cart"
            element={<CartPage />}
          />

          <Route
            path="/checkout"
            element={<CheckoutPage />}
          />

          <Route
            path="/order-success/:orderNumber"
            element={<OrderSuccessPage />}
          />

          <Route
            path="/order-lookup"
            element={<OrderLookupPage />}
          />

        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App