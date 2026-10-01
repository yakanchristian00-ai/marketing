import React, { useState } from 'react';
import { apiLeads } from '../api/client';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import { ADMIN_WHATSAPP_DISPLAY } from '../config/contact';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmitContact = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      await apiLeads.submitContact({
        name,
        email,
        phone,
        subject,
        message
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setErrorMsg(err.message || 'Erreur lors de l’envoi de votre message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>
            <MessageSquare size={14} /> Contact & Support
          </span>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '16px' }} className="text-gradient">
            Discutons de Votre Prochain Projet
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
            Nos experts en ingénierie marketing sont disponibles pour répondre à toutes vos questions et accélérer votre croissance.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid-2" style={{ gap: '40px', alignItems: 'start' }}>
          
          {/* Left Column: Form */}
          <div className="glass-card-lg" style={{ padding: '36px' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '20px', color: '#FFFFFF' }}>
              Envoyez-nous un message direct
            </h3>

            {success ? (
              <div style={{ padding: '20px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid var(--accent-emerald)', textAlign: 'center' }}>
                <CheckCircle2 size={32} color="var(--accent-emerald)" style={{ marginBottom: '10px' }} />
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '6px' }}>
                  Message Envoyé avec Succès !
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Un conseiller TTES-ICG reviendra vers vous sous 24h ouvrées.
                </div>
                <button className="btn btn-sm btn-outline" onClick={() => setSuccess(false)}>
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitContact}>
                {errorMsg && (
                  <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'rgba(244, 63, 94, 0.15)', color: '#FECDD3', fontSize: '0.85rem', marginBottom: '16px' }}>
                    {errorMsg}
                  </div>
                )}

                <div className="grid-2" style={{ gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Nom complet *</label>
                    <input
                      type="text"
                      required
                      placeholder="Jean Dupont"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Adresse Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="jean@entreprise.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '16px' }}>
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

                  <div className="form-group">
                    <label className="form-label">Sujet</label>
                    <input
                      type="text"
                      placeholder="Objet de votre demande"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Votre message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Décrivez brièvement vos objectifs..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-textarea"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  {submitting ? 'Envoi...' : 'Transmettre à l’Équipe TTES-ICG'}
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Info Cards & Location Map frame */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 240, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-cyan)', flexShrink: 0 }}>
                <Phone size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Téléphone & WhatsApp Direct</div>
                <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#FFFFFF', marginTop: '2px' }}>{ADMIN_WHATSAPP_DISPLAY}</div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C084FC', flexShrink: 0 }}>
                <Mail size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Adresses Email</div>
                <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#FFFFFF', marginTop: '2px' }}>contact@ttes-icg.com | devis@ttes-icg.com</div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', flexShrink: 0 }}>
                <MapPin size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Siège & Bureaux</div>
                <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#FFFFFF', marginTop: '2px' }}>Douala & Yaoundé, Cameroun</div>
              </div>
            </div>

            {/* Interactive Location Frame */}
            <div className="glass-card-lg" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <Clock size={18} color="var(--primary-cyan)" />
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#FFFFFF' }}>Heures d'Ouverture du Bureau</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Du Lundi au Vendredi : <strong>08h00 - 18h30</strong><br />
                Samedi : <strong>09h00 - 13h00</strong> (Permanence téléphonique)
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
