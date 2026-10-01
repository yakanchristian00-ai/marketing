import React, { useState } from 'react';
import { apiProducts } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { X, ShoppingBag, CheckCircle2, MessageCircle, Star, ShieldCheck, ArrowRight, DollarSign } from 'lucide-react';
import { buildAdminWhatsAppLink } from '../config/contact';

export default function ProductModal({ product, isOpen, onClose }) {
  const { user } = useAuth();

  const [name, setName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [company, setCompany] = useState(user?.company || '');

  const [submitting, setSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !product) return null;

  const handleOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const res = await apiProducts.submitOrder({
        product_id: product.id,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        company
      });
      setSuccessOrder(res);
    } catch (err) {
      setErrorMsg(err.message || 'Erreur lors de la commande.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const text =
      `Bonjour TTES-ICG, je souhaite commander directement le produit "${product.title}" (${Number(product.price).toLocaleString('fr-FR')} FCFA). Mon nom: ${name || 'Prospect'}.`
    window.open(buildAdminWhatsAppLink(text), '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card-lg" style={{ maxWidth: '720px', padding: '36px' }} onClick={(e) => e.stopPropagation()}>
        
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

        {successOrder ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid var(--accent-emerald)',
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}
            >
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '10px', color: '#FFFFFF' }}>
              Commande Reçue avec Succès !
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px auto' }}>
              Réf Commande: <strong>{successOrder.order.id}</strong>. Votre demande pour <strong>"{product.title}"</strong> a été enregistrée.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <a
                href={successOrder.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ background: '#25D366', color: '#030712' }}
              >
                <MessageCircle size={18} />
                Finaliser sur WhatsApp
              </a>

              <button className="btn btn-outline" onClick={onClose}>
                Fermer
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header Product Info */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', alignItems: 'start', flexWrap: 'wrap' }}>
              <img
                src={product.image}
                alt={product.title}
                style={{ width: '130px', height: '130px', borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="badge badge-purple">{product.category}</span>
                  {product.badge && <span className="badge badge-cyan">{product.badge}</span>}
                </div>
                <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '8px' }}>
                  {product.title}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--primary-cyan)', fontFamily: 'var(--font-heading)' }}>
                    {Number(product.price).toLocaleString('fr-FR')} FCFA
                  </div>
                  {product.original_price && (
                    <div style={{ fontSize: '0.95rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                      {Number(product.original_price).toLocaleString('fr-FR')} FCFA
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '20px', lineHeight: 1.6 }}>
              {product.description}
            </p>

            {/* Included features */}
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '24px' }}>
              <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#FFFFFF', marginBottom: '10px', textTransform: 'uppercase' }}>
                Ce qui est inclus dans ce pack :
              </div>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {product.features.map((feat, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--text-main)', marginBottom: '6px' }}>
                    <CheckCircle2 size={15} color="var(--primary-cyan)" style={{ flexShrink: 0 }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Form */}
            {errorMsg && (
              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(244, 63, 94, 0.15)', color: '#FECDD3', fontSize: '0.82rem', marginBottom: '16px' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleOrder}>
              <div className="grid-2" style={{ gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Nom complet *</label>
                  <input
                    type="text"
                    required
                    placeholder="Votre nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Adresse Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid-2" style={{ gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Téléphone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+237 ..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Société (Optionnel)</label>
                  <input
                    type="text"
                    placeholder="Nom d’entreprise"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <ShoppingBag size={18} />
                  {submitting ? 'Validation...' : 'Commander Maintenant'}
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="btn"
                  style={{ background: '#25D366', color: '#030712', fontWeight: '700' }}
                >
                  <MessageCircle size={18} />
                  WhatsApp Direct
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
