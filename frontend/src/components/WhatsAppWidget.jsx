import React, { useState } from 'react';
import { MessageCircle, X, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { buildAdminWhatsAppLink } from '../config/contact';

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const handleOpenWhatsApp = (text) => {
    const message = text || customMsg || 'Bonjour l’équipe TTES-ICG, je souhaite avoir des renseignements sur vos services marketing et produits.';
    window.open(buildAdminWhatsAppLink(message), '_blank');
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1050 }}>
      
      {/* Expanded Chat Popup Bubble */}
      {open && (
        <div
          className="glass-card-lg"
          style={{
            position: 'absolute',
            bottom: '70px',
            right: 0,
            width: '340px',
            padding: '20px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#030712' }}>
                <MessageCircle size={22} />
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#FFFFFF' }}>TTES-ICG WhatsApp</div>
                <div style={{ fontSize: '0.72rem', color: '#4ADE80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
                  En ligne • Réponse &lt; 5 min
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.5 }}>
            Bonjour ! 👋 Comment l’équipe TTES-ICG peut vous aider aujourd’hui ?
          </p>

          {/* Quick Action Shortcuts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            <button
              onClick={() => handleOpenWhatsApp('Bonjour TTES-ICG, je souhaite faire une simulation de devis marketing.')}
              style={{
                textAlign: 'left',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              💬 Demande de Devis & ROI
            </button>

            <button
              onClick={() => handleOpenWhatsApp('Bonjour TTES-ICG, j’aimerais commander un kit / produit du catalogue.')}
              style={{
                textAlign: 'left',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              🛍️ Question sur le Catalogue Produits
            </button>

            <button
              onClick={() => handleOpenWhatsApp('Bonjour, je souhaite fixer une date pour une consultation stratégique.')}
              style={{
                textAlign: 'left',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              📅 Prise de Rendez-vous rapide
            </button>
          </div>

          {/* Direct Input */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Écrivez votre message..."
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="form-input"
              style={{ padding: '8px 12px', fontSize: '0.82rem' }}
              onKeyDown={(e) => e.key === 'Enter' && handleOpenWhatsApp()}
            />
            <button
              onClick={() => handleOpenWhatsApp()}
              style={{
                background: '#25D366',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#030712',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 25px rgba(37, 211, 102, 0.5)',
          cursor: 'pointer',
          transition: 'transform 0.3s ease',
          position: 'relative'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        title="Discuter directement sur WhatsApp"
      >
        <MessageCircle size={30} />
        {/* Pulsing online badge */}
        <span
          style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: '#4ADE80',
            border: '2px solid #030712'
          }}
        />
      </button>

    </div>
  );
}
