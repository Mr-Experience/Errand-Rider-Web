import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import AdminLogin from './pages/AdminLogin';
import VendorLogin from './pages/VendorLogin';
import RiderLogin from './pages/RiderLogin';
import AdminDashboard from './pages/AdminDashboard';
import VendorDashboard from './pages/VendorDashboard';
import RiderDashboard from './pages/RiderDashboard';

import VendorSignup from './pages/VendorSignup';
import RiderSignup from './pages/RiderSignup';
import AdminVendors from './pages/AdminVendors';
import AdminAddVendor from './pages/AdminAddVendor';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname.includes('/login') || location.pathname.includes('/signup');
  const isAdminPage = location.pathname.startsWith('/admin') && !location.pathname.includes('/login');
  const isVendorPage = location.pathname.startsWith('/vendor') && !location.pathname.includes('/login') && !location.pathname.includes('/signup');
  const isRiderPage = location.pathname.startsWith('/rider') && !location.pathname.includes('/login') && !location.pathname.includes('/signup');
  const isDashboard = isAdminPage || isVendorPage || isRiderPage;
  
  // Header should be visible on home and auth pages, but not dashboards
  const showHeader = !isDashboard;
  // Footer should only be visible on the home page
  const showFooter = !isAuthPage && !isDashboard;

  return (
    <div className="app-layout">
      {showHeader && <Header isSimple={isAuthPage} />}
      <div className="app-container">
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Features />
            </>
          } />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/vendor/login" element={<VendorLogin />} />
          <Route path="/rider/login" element={<RiderLogin />} />
          <Route path="/vendor/signup" element={<VendorSignup />} />
          <Route path="/rider/signup" element={<RiderSignup />} />
          
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/vendors" element={
            <ProtectedRoute requiredRole="admin">
              <AdminVendors />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/vendors/add" element={
            <ProtectedRoute requiredRole="admin">
              <AdminAddVendor />
            </ProtectedRoute>
          } />
          
          <Route path="/vendor/dashboard" element={
            <ProtectedRoute requiredRole="vendor">
              <VendorDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/rider/dashboard" element={
            <ProtectedRoute requiredRole="rider">
              <RiderDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
      {showFooter && <Footer />}
    </div>
  );
}

export default App;
