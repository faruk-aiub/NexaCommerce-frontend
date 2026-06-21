import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';

// Protection Guards
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';

// Lazy load pages
const Home = React.lazy(() => import('../pages/Home'));
const Shop = React.lazy(() => import('../pages/Shop'));
const ProductDetails = React.lazy(() => import('../pages/ProductDetails'));
const Cart = React.lazy(() => import('../pages/Cart'));
const Checkout = React.lazy(() => import('../pages/Checkout'));
const Wishlist = React.lazy(() => import('../pages/Wishlist'));
const TrackOrder = React.lazy(() => import('../pages/TrackOrder'));

// Auth
const Login = React.lazy(() => import('../pages/Login'));
const Register = React.lazy(() => import('../pages/Register'));
const ForgotPassword = React.lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('../pages/ResetPassword'));

// Static pages
const About = React.lazy(() => import('../pages/About'));
const Contact = React.lazy(() => import('../pages/Contact'));
const FAQ = React.lazy(() => import('../pages/FAQ'));
const PrivacyPolicy = React.lazy(() => import('../pages/PrivacyPolicy'));
const Blog = React.lazy(() => import('../pages/Blog'));
const BlogDetails = React.lazy(() => import('../pages/BlogDetails'));

// Customer dashboard
const Profile = React.lazy(() => import('../pages/Profile'));
const Orders = React.lazy(() => import('../pages/Orders'));
const OrderDetails = React.lazy(() => import('../pages/OrderDetails'));
const Addresses = React.lazy(() => import('../pages/Addresses'));
const Settings = React.lazy(() => import('../pages/Settings'));

// Admin dashboard
const AdminStats = React.lazy(() => import('../pages/admin/AdminStats'));
const AdminProducts = React.lazy(() => import('../pages/admin/AdminProducts'));
const AdminCategories = React.lazy(() => import('../pages/admin/AdminCategories'));
const AdminBrands = React.lazy(() => import('../pages/admin/AdminBrands'));
const AdminCoupons = React.lazy(() => import('../pages/admin/AdminCoupons'));
const AdminReviews = React.lazy(() => import('../pages/admin/AdminReviews'));
const AdminInvoices = React.lazy(() => import('../pages/admin/AdminInvoices'));

// Suspense Loading fallback
const PageLoader = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-[#0B0F19]">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E63946] border-t-transparent"></div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Storefront Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:slug" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="track-order" element={<TrackOrder />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogDetails />} />

          {/* Checkout needs to be protected */}
          <Route path="checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />

          {/* Customer Dashboard nested routes */}
          <Route path="dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Auth routes */}
        <Route path="/" element={<MainLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* Admin Console Route group */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminStats />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="brands" element={<AdminBrands />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="invoices" element={<AdminInvoices />} />
        </Route>

        {/* Wildcard Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
