// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Lazy load pages
const Home           = lazy(() => import('./pages/Home/Home'));
const Products       = lazy(() => import('./pages/Products/Products'));
const ProductDetail  = lazy(() => import('./pages/ProductDetail/ProductDetail'));
const Cart           = lazy(() => import('./pages/Cart/Cart'));
const Login          = lazy(() => import('./pages/Auth/Login'));
const Register       = lazy(() => import('./pages/Auth/Register'));
const VendorDashboard= lazy(() => import('./pages/Vendor/VendorDashboard'));

function PageLoader() {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60vh'}}>
      <div style={{
        width:32,height:32,border:'3px solid var(--bg-elevated)',
        borderTopColor:'var(--accent)',borderRadius:'50%',
        animation:'spin 0.7s linear infinite'
      }}/>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuth, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!isAuth) return <Navigate to="/login" replace />;
  return children;
}

function AppLayout() {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"                      element={<Home />} />
          <Route 
  path="/products" 
  element={
    <ProtectedRoute>
      <Products />
    </ProtectedRoute>
  } 
/>
          <Route path="/products/:id"          element={<ProductDetail />} />
          <Route path="/cart"                  element={<Cart />} />
          <Route path="/login"                 element={<Login />} />
          <Route path="/register"              element={<Register />} />
          <Route path="/vendor/dashboard"      element={<ProtectedRoute><VendorDashboard /></ProtectedRoute>} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'toast-custom',
          duration: 3000,
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-strong)',
            fontFamily: 'var(--font-body)',
          },
        }}
      />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppLayout />
      </CartProvider>
    </AuthProvider>
  );
}
