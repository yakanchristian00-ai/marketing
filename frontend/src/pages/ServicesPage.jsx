import React from 'react';
import Services from '../components/Services';
import { MessageCircle, Calendar } from 'lucide-react';
import { buildAdminWhatsAppLink } from '../config/contact';

export default function ServicesPage({ onOpenBooking, onOpenUserDashboard }) {
  const handleWhatsApp = () => {
    window.open(buildAdminWhatsAppLink('Bonjour TTES-ICG, je souhaite obtenir une proposition commerciale personnalisée.'), '_blank');
  };

  return (
    <div className="section-padding">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '16px' }} className="text-gradient">
            Pôles d'Expertise & Solutions Sur Mesure
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
            De la stratégie de Growth Hacking au développement d'applications web d'élite, nous déployons les meilleures méthodologies pour garantir votre réussite.
          </p>
        </div>

        <Services
          onSelectServiceForQuote={() => {
            window.location.hash = '#calculator';
          }}
          onOpenUserDashboard={onOpenUserDashboard}
        />

        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <div style={{ display: 'inline-flex', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={onOpenBooking}>
              <Calendar size={18} /> Prendre un rendez-vous conseil
            </button>
            <button className="btn" style={{ background: '#25D366', color: '#030712', fontWeight: '700' }} onClick={handleWhatsApp}>
              <MessageCircle size={18} /> Échanger sur WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
