import React, { useState } from 'react';
import { X, Sparkles, MessageCircle, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiExpertises } from '../api/client';
import { EXPERTISE_PRICE, EXPERTISE_CURRENCY, buildExpertiseWhatsAppLink } from '../config/expertises';

export default function PaidExpertiseModal({ isOpen, onClose, expertise, onRequestSubmitted }) {
  const { user, openAuth } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !expertise) return null;

  const handleStartPaymentFlow = async () => {
    if (!user) {
      onClose();
      openAuth('login');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // 1. Submit request to backend (status PENDING, 200 FCFA)
      const res = await apiExpertises.requestActivation(expertise.id);
      
      // 2. Build prefilled WhatsApp link
      const whatsappUrl = res.whatsapp?.link || buildExpertiseWhatsAppLink(expertise.title, user.email);

      // 3. Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');

      // 4. Trigger callback & close modal
      if (onRequestSubmitted) {
        onRequestSubmitted(res.request);
      }
      onClose();

    } catch (err) {
      console.error('Erreur lors de la création de la demande:', err);
      setError(err.message || 'Erreur lors du traitement de votre demande.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-card-lg"
        style={{ maxWidth: '580px', padding: '32px', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
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
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(192, 132, 252, 0.2))',
              border: '1px solid var(--primary-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: 'var(--primary-cyan)'
            }}
          >
            <Sparkles size={32} />
          </div>
          <span className="badge badge-purple" style={{ marginBottom: '8px' }}>
            Service & Expertise Payante
          </span>
          <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', marginTop: '6px' }}>
            Activer l’expertise : {expertise.title}
          </h2>
        </div>

        {/* Pricing Box */}
        <div
          style={{
            background: 'rgba(11, 23, 38, 0.8)',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            textAlign: 'center',
            marginBottom: '24px'
          }}
        >
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
            Tarif Configuré d’Activation
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--primary-cyan)', fontFamily: 'var(--font-heading)', margin: '4px 0' }}>
            {EXPERTISE_PRICE} {EXPERTISE_CURRENCY}
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', margin: 0 }}>
            Paiement unique pour débloquer l’accès à cette expertise stratégique.
          </p>
        </div>

        {/* Detailed Explanation */}
        <div style={{ marginBottom: '24px', fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
          <p style={{ marginBottom: '12px' }}>
            Cette expertise est disponible pour <strong>{EXPERTISE_PRICE} {EXPERTISE_CURRENCY}</strong>.
          </p>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px dashed rgba(255, 255, 255, 0.1)', padding: '14px', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#FACC15', fontWeight: '700', marginBottom: '6px' }}>
              <ShieldCheck size={16} /> Procédure de Paiement Manuel via WhatsApp :
            </div>
            1. En cliquant sur le bouton ci-dessous, votre demande sera enregistrée en attente.<br />
            2. Vous serez automatiquement redirigé vers le WhatsApp de l'administrateur avec le message prérempli.<br />
            3. Après échange et confirmation du paiement, l'administrateur validera manuellement votre accès.
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid var(--accent-rose)', color: 'var(--accent-rose)', padding: '12px', borderRadius: '8px', fontSize: '0.88rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleStartPaymentFlow}
          disabled={submitting}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '1rem',
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            border: 'none',
            color: '#FFFFFF',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 4px 20px rgba(37, 211, 102, 0.3)'
          }}
        >
          <MessageCircle size={20} />
          {submitting ? 'Enregistrement de la demande...' : 'Discuter du paiement sur WhatsApp'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '14px', marginBotton: 0 }}>
          💡 L'ouverture de WhatsApp n'active pas automatiquement l'expertise. L'activation est validée par l'administrateur.
        </p>

      </div>
    </div>
  );
}
