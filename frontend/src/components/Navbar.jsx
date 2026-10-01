import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Rocket, ShieldCheck, User, LogOut, Menu, X, Calendar, ShoppingBag, MessageCircle, Bell } from 'lucide-react';
import { buildAdminWhatsAppLink } from '../config/contact';
import { apiNotifications } from '../api/client';

export default function Navbar({ activePage, setActivePage, onOpenBooking, onOpenUserDashboard, onOpenAdminDashboard, onOpenNotifications }) {
  const { user, logout, openAuth, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);

  useEffect(() => {
    async function loadNotifCount() {
      if (user) {
        try {
          const res = await apiNotifications.getMyNotifications();
          setUnreadNotifsCount(res.unread_count || 0);
        } catch (err) {
          // Silent catch
        }
      }
    }
    loadNotifCount();
    const interval = setInterval(loadNotifCount, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const navLinks = [
    { id: 'home', label: 'Accueil' },
    { id: 'about', label: 'À Propos' },
    { id: 'services', label: 'Services & Expertises' },
    { id: 'catalog', label: 'Catalogue Produits', badge: 'Nouveau' },
    { id: 'blog', label: 'Blog & Insights' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppNav = () => {
    window.open(buildAdminWhatsAppLink('Bonjour TTES-ICG, je vous contacte depuis votre site web.'), '_blank');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        background: 'rgba(8, 11, 20, 0.9)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
        
        {/* Brand Logo */}
        <div onClick={() => handleNavClick('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary-cyan) 0%, var(--primary-purple) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-neon)'
            }}
          >
            <Rocket size={24} color="#030712" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: '900', fontSize: '1.4rem', letterSpacing: '-0.03em', color: '#FFFFFF' }}>
              TTES<span style={{ color: 'var(--primary-cyan)' }}>-ICG</span>
            </div>
            <div style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>
              Marketing & Ingénierie
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="desktop-nav">
          {navLinks.map(link => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isActive ? 'var(--primary-cyan)' : 'var(--text-muted)',
                  fontWeight: isActive ? '700' : '600',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  position: 'relative',
                  padding: '6px 0'
                }}
              >
                {link.label}
                {link.badge && (
                  <span style={{ marginLeft: '6px', fontSize: '0.65rem', padding: '2px 6px', borderRadius: 'var(--radius-full)', background: 'var(--primary-cyan)', color: '#030712', fontWeight: '800' }}>
                    {link.badge}
                  </span>
                )}
                {isActive && (
                  <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'var(--primary-cyan)', borderRadius: '2px' }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Auth & CTA Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* WhatsApp Direct Button */}
          <button
            onClick={handleWhatsAppNav}
            className="btn btn-sm"
            style={{ background: 'rgba(37, 211, 102, 0.15)', border: '1px solid #25D366', color: '#25D366', fontWeight: '700' }}
            title="Discuter sur WhatsApp"
          >
            <MessageCircle size={16} />
            WhatsApp
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Notification Bell */}
              <button
                onClick={onOpenNotifications}
                title="Notifications"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: unreadNotifsCount > 0 ? 'var(--primary-cyan)' : 'var(--text-muted)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <Bell size={17} />
                {unreadNotifsCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      background: 'var(--accent-rose)',
                      color: '#FFFFFF',
                      fontSize: '0.65rem',
                      fontWeight: '800',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {isAdmin ? (
                <button className="btn btn-sm btn-purple" onClick={onOpenAdminDashboard}>
                  <ShieldCheck size={16} /> Admin
                </button>
              ) : (
                <button className="btn btn-sm btn-outline" onClick={onOpenUserDashboard}>
                  <User size={16} /> Mon Espace
                </button>
              )}

              <button
                onClick={logout}
                title="Se déconnecter"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-muted)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button className="btn btn-sm btn-outline" onClick={() => openAuth('login')}>
                Connexion
              </button>
              <button className="btn btn-sm btn-primary" onClick={onOpenBooking}>
                <Calendar size={15} />
                RDV
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
