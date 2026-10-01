import React from 'react';
import { X, CheckCircle2, Rocket, Search, Palette, Share2, Code, BarChart3, ChevronRight, Calendar, ArrowRight } from 'lucide-react';

const ICON_MAP = {
  Rocket: Rocket,
  Search: Search,
  Palette: Palette,
  Share2: Share2,
  Code: Code,
  BarChart3: BarChart3
};

export default function ServiceDetailModal({ service, isOpen, onClose, onSelectForQuote, onOpenBooking }) {
  if (!isOpen || !service) return null;

  const IconComponent = ICON_MAP[service.icon] || Rocket;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card-lg" style={{ maxWidth: '680px', padding: '36px' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
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
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'rgba(0, 200, 255, 0.12)',
              border: '1px solid var(--primary-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-cyan)',
              flexShrink: 0
            }}
          >
            <IconComponent size={32} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-cyan">{service.category}</span>
              {service.badge && <span className="badge badge-purple">{service.badge}</span>}
            </div>
            <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF' }}>{service.title}</h2>
          </div>
        </div>

        {/* Description Section */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--primary-cyan)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Description Détaillée du Service :
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.7 }}>
            {service.description}
          </p>
        </div>

        {/* Features Checklist */}
        <div style={{ background: '#0B1726', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', marginBottom: '28px' }}>
          <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#FFFFFF', textTransform: 'uppercase', marginBottom: '14px' }}>
            Inclus dans cette prestation :
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {service.features && service.features.map((feat, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                <CheckCircle2 size={18} color="var(--primary-cyan)" style={{ flexShrink: 0 }} />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', paddingTop: '20px', borderTop: '1px solid var(--border-glass)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>À partir de</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary-cyan)', fontFamily: 'var(--font-heading)' }}>
              {Number(service.price_starting).toLocaleString('fr-FR')} FCFA
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-outline"
              onClick={() => {
                onClose();
                if (onOpenBooking) onOpenBooking();
              }}
            >
              <Calendar size={16} /> Réserver RDV
            </button>

            <button
              className="btn btn-primary"
              onClick={() => {
                onClose();
                if (onSelectForQuote) onSelectForQuote(service.title);
              }}
            >
              Sélectionner pour Devis
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
