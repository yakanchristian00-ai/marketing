import React from 'react';
import { Rocket, ShieldCheck, Mail, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Footer({ onOpenAdminDashboard }) {
  const { user, openAuth, isAdmin } = useAuth();

  return (
    <footer
      style={{
        background: 'rgba(5, 8, 15, 0.95)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '70px 0 30px 0',
        position: 'relative'
      }}
    >
      <div className="container">
        <div className="grid-4" style={{ gap: '40px', marginBottom: '50px' }}>
          
          {/* Brand Info */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--primary-cyan) 0%, var(--primary-purple) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Rocket size={22} color="#030712" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '900', fontSize: '1.4rem', color: '#FFFFFF' }}>
                TTES<span style={{ color: 'var(--primary-cyan)' }}>-ICG</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Technologies, Transports, Études, Services — Ingénierie, Conseil & Marketing de Performance pour entreprises exigeantes.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>Cameroun</span>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>International</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '1.05rem' }}>Navigation</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <li><a href="#services" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Nos Services Marketing</a></li>
              <li><a href="#calculator" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Calculateur Devis & ROI</a></li>
              <li><a href="#portfolio" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Réalisations & Résultats</a></li>
              <li><a href="#contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact & Horaires</a></li>
            </ul>
          </div>

          {/* Expertises */}
          <div>
            <h4 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '1.05rem' }}>Expertises TTES-ICG</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li>• Growth Hacking & Lead Generation</li>
              <li>• SEO, SEA & Publicité Google</li>
              <li>• Branding & Identité Visuelle</li>
              <li>• Management Réseaux Sociaux</li>
              <li>• Conseil ROI & Data Analytics</li>
            </ul>
          </div>

          {/* Access & Admin */}
          <div>
            <h4 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '1.05rem' }}>Espace Membre & Admin</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Connectez-vous pour suivre l’état de vos demandes ou accéder à la gestion d’agence.
            </p>
            
            {user ? (
              <div>
                {isAdmin && (
                  <button className="btn btn-sm btn-purple" onClick={onOpenAdminDashboard} style={{ width: '100%', marginBottom: '10px' }}>
                    <ShieldCheck size={16} /> Espace Administration
                  </button>
                )}
              </div>
            ) : (
              <button className="btn btn-sm btn-outline" onClick={() => openAuth('login')} style={{ width: '100%' }}>
                Se Connecter / Inscription
              </button>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ paddingTop: '30px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
          <div>
            © 2026 TTES-ICG Marketing & Consulting. Tous droits réservés.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Mentions Légales</span>
            <span>Politique de Confidentialité</span>
            <span>Conditions d'Utilisation</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
