import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, Building, Phone, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AuthModal() {
  const { authModalOpen, closeAuth, authMode, setAuthMode, login, signup } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      if (authMode === 'login') {
        await login(email, password);
        setSuccess('Connexion réussie !');
      } else {
        await signup({
          full_name: fullName,
          email,
          password,
          company,
          phone
        });
        setSuccess('Compte créé avec succès !');
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuth}>
      <div className="modal-content glass-card-lg" style={{ padding: '36px' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button
          onClick={closeAuth}
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

        {/* Header Tabs */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-cyan)', marginBottom: '8px' }}>
            <ShieldCheck size={20} />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Espace Membre TTES-ICG
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '16px' }} className="text-gradient">
            {authMode === 'login' ? 'Connexion à votre espace' : 'Créer un compte client'}
          </h2>

          <div
            style={{
              display: 'flex',
              background: '#0B1726',
              padding: '4px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-glass)',
              maxWidth: '320px',
              margin: '0 auto'
            }}
          >
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setError(''); }}
              style={{
                flex: 1,
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: authMode === 'login' ? 'var(--primary-cyan)' : 'transparent',
                color: authMode === 'login' ? '#07111F' : 'var(--text-muted)',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              Se Connecter
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('signup'); setError(''); }}
              style={{
                flex: 1,
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: authMode === 'signup' ? 'var(--primary-purple)' : 'transparent',
                color: authMode === 'signup' ? '#FFFFFF' : 'var(--text-muted)',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              Créer un Compte
            </button>
          </div>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid var(--accent-rose)', color: '#FECDD3', fontSize: '0.85rem', marginBottom: '20px' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'rgba(57, 217, 138, 0.15)', border: '1px solid var(--accent-emerald)', color: '#A7F3D0', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {authMode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Nom complet *</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-dim)' }} />
                <input
                  type="text"
                  required
                  placeholder="ex: Jean Dupont"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Adresse Email *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-dim)' }} />
              <input
                type="email"
                required
                placeholder="votre.email@entreprise.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe *</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-dim)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          {authMode === 'signup' && (
            <div className="grid-2" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Société (Optionnel)</label>
                <input
                  type="text"
                  placeholder="Nom de société"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Téléphone</label>
                <input
                  type="tel"
                  placeholder="+237 ..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`btn ${authMode === 'login' ? 'btn-primary' : 'btn-purple'}`}
            style={{ width: '100%', marginTop: '10px' }}
          >
            {submitting ? 'Vérification...' : authMode === 'login' ? 'Se Connecter' : 'Créer mon Compte'}
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
