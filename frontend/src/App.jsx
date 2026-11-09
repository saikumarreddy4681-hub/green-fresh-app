import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import MyOrdersPage from './pages/MyOrdersPage';
import UserProfilePage from './pages/UserProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-[#fafbf9] text-gray-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
            {/* Top Navigation */}
            <Navbar />

            {/* Main Page Content */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                
                {/* 3 Main Categories + Direct Category Shortcuts */}
                <Route path="/category/:categorySlug" element={<CategoryPage />} />
                <Route path="/fruits" element={<CategoryPage initialCategory="fresh-fruits" />} />
                <Route path="/vegetables" element={<CategoryPage initialCategory="fresh-vegetables" />} />
                <Route path="/milk-dairy" element={<CategoryPage initialCategory="milk-dairy" />} />
                <Route path="/milk" element={<CategoryPage initialCategory="milk-dairy" />} />

                {/* Shopping & Checkout */}
                <Route path="/cart" element={<CartPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success/:id" element={<OrderSuccessPage />} />
                <Route path="/orders/track/:id" element={<OrderTrackingPage />} />
                <Route path="/my-orders" element={<MyOrdersPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
                
                {/* Information Pages */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                
                {/* Authentication */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Admin Dashboard */}
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

                {/* Fallback redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Shopping Cart Side Drawer */}
            <CartDrawer />

            {/* Global Toast Notifications */}
            <Toast />

            {/* Footer */}
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
