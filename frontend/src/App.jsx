import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import CatalogPage from './pages/CatalogPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';

// Widgets & Modals
import WhatsAppWidget from './components/WhatsAppWidget';
import ProductModal from './components/ProductModal';
import AuthModal from './components/AuthModal';
import BookingModal from './components/BookingModal';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import NotificationsModal from './components/NotificationsModal';

export default function App() {
  const [activePage, setActivePage] = useState('home');

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [userDashboardOpen, setUserDashboardOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productModalOpen, setProductModalOpen] = useState(false);

  const handleOpenProductModal = (product) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'about':
        return <AboutPage onOpenBooking={() => setBookingModalOpen(true)} />;
      case 'services':
        return <ServicesPage onOpenBooking={() => setBookingModalOpen(true)} onOpenUserDashboard={() => setUserDashboardOpen(true)} />;
      case 'catalog':
        return <CatalogPage onOpenProductModal={handleOpenProductModal} />;
      case 'blog':
        return <BlogPage />;
      case 'contact':
        return <ContactPage onOpenBooking={() => setBookingModalOpen(true)} />;
      case 'home':
      default:
        return (
          <HomePage
            onOpenBooking={() => setBookingModalOpen(true)}
            onNavigatePage={setActivePage}
            onOpenProductModal={handleOpenProductModal}
            onOpenUserDashboard={() => setUserDashboardOpen(true)}
          />
        );
    }
  };

  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {/* Navigation Bar */}
        <Navbar
          activePage={activePage}
          setActivePage={setActivePage}
          onOpenBooking={() => setBookingModalOpen(true)}
          onOpenUserDashboard={() => setUserDashboardOpen(true)}
          onOpenAdminDashboard={() => setAdminDashboardOpen(true)}
          onOpenNotifications={() => setNotificationsModalOpen(true)}
        />

        {/* Dynamic Multi-Page Content */}
        <main style={{ flex: 1 }}>
          {renderPage()}
        </main>

        {/* Floating WhatsApp Widget */}
        <WhatsAppWidget />

        {/* Global Footer */}
        <Footer onOpenAdminDashboard={() => setAdminDashboardOpen(true)} />

        {/* Modals */}
        <AuthModal />
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
        />
        <ProductModal
          product={selectedProduct}
          isOpen={productModalOpen}
          onClose={() => setProductModalOpen(false)}
        />
        <UserDashboard
          isOpen={userDashboardOpen}
          onClose={() => setUserDashboardOpen(false)}
        />
        <AdminDashboard
          isOpen={adminDashboardOpen}
          onClose={() => setAdminDashboardOpen(false)}
        />
        <NotificationsModal
          isOpen={notificationsModalOpen}
          onClose={() => setNotificationsModalOpen(false)}
        />

      </div>
    </AuthProvider>
  );
}
