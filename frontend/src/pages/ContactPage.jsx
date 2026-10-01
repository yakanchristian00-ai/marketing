import React from 'react';
import Contact from '../components/Contact';
import { MessageCircle, Phone, Calendar } from 'lucide-react';
import { buildAdminWhatsAppLink } from '../config/contact';

export default function ContactPage({ onOpenBooking }) {
  const handleWhatsApp = () => {
    window.open(buildAdminWhatsAppLink('Bonjour TTES-ICG, je vous contacte directement pour échanger sur mes besoins marketing.'), '_blank');
  };

  return (
    <div className="section-padding">
      <div className="container">
        
        {/* WhatsApp Highlight Box */}
        <div
          className="glass-card-lg"
          style={{
            padding: '30px',
            marginBottom: '50px',
            background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.12) 0%, rgba(18, 140, 126, 0.12) 100%)',
            border: '1px solid rgba(37, 211, 102, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#25D366', color: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MessageCircle size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF' }}>
                Besoin d’une réponse immédiate ?
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Nos conseillers marketing sont en ligne sur WhatsApp pour vous répondre en moins de 5 minutes.
              </div>
            </div>
          </div>

          <button type
            className="btn"
            style={{ background: '#25D366', color: '#030712', fontWeight: '800' }}
            onClick={handleWhatsApp}
          >
            <MessageCircle size={18} />
            Démarrer le Chat WhatsApp
          </button>
        </div>

        <Contact />

      </div>
    </div>
  );
}
