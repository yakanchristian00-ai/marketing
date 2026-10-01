import React, { useState, useEffect } from 'react';
import { apiLeads } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { X, Calendar, Clock, User, Mail, Phone, Building, CheckCircle2, ArrowRight } from 'lucide-react';

export default function BookingModal({ isOpen, onClose }) {
  const { user } = useAuth();

  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('14:00 - 14:45');
  const [topic, setTopic] = useState('Audit Stratégique & Growth');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Default to tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.full_name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setCompany(user.company || '');
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const payload = {
        user_name: name,
        user_email: email,
        phone,
        company,
        date,
        time_slot: timeSlot,
        topic,
        notes
      };

      const res = await apiLeads.submitBooking(payload);
      setSuccessBooking(res.booking);
    } catch (err) {
      setErrorMsg(err.message || 'Erreur lors de la réservation.');
    } finally {
      setSubmitting(false);
    }
  };

  const timeSlots = [
    '09:00 - 09:45',
    '11:00 - 11:45',
    '14:00 - 14:45',
    '16:00 - 16:45'
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card-lg" style={{ padding: '36px' }} onClick={(e) => e.stopPropagation()}>
        
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

        {successBooking ? (
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
              Rendez-vous Confirmé !
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
              Un consultant senior TTES-ICG vous contactera le <strong>{successBooking.date}</strong> à <strong>{successBooking.time_slot}</strong>.
            </p>

            <button className="btn btn-primary" onClick={onClose}>
              Fermer la fenêtre
            </button>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-cyan)', marginBottom: '8px' }}>
                <Calendar size={18} />
                <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Consultation Stratégique Offerte (45 min)
                </span>
              </div>
              <h2 style={{ fontSize: '1.7rem' }} className="text-gradient">
                Réservez votre Session de Conseil TTES-ICG
              </h2>
            </div>

            {errorMsg && (
              <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'rgba(244, 63, 94, 0.15)', color: '#FECDD3', fontSize: '0.85rem', marginBottom: '20px' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmitBooking}>
              
              {/* Date & Slot selection */}
              <div className="grid-2" style={{ gap: '16px', marginBottom: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Date souhaitée *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Créneau horaire *</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="form-select"
                  >
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Topic selection */}
              <div className="form-group">
                <label className="form-label">Sujet principal *</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="form-select"
                >
                  <option value="Audit Stratégique & Growth">Audit Stratégique & Growth Hacking</option>
                  <option value="SEO & Acquisition Ads">Acquisition SEO & Google Ads</option>
                  <option value="Branding & Identité Visuelle">Branding & Identité Visuelle</option>
                  <option value="Refonte Site Web / Application">Refonte Site Web & Application</option>
                  <option value="Autre demande spécifique">Autre demande spécifique</option>
                </select>
              </div>

              {/* Personal Details */}
              <div className="grid-2" style={{ gap: '16px' }}>
                <div className="form-group">
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

                <div className="form-group">
                  <label className="form-label">Adresse Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="email@entreprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid-2" style={{ gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Téléphone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+237 ..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Société</label>
                  <input
                    type="text"
                    placeholder="Nom d’entreprise"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '10px' }}
              >
                {submitting ? 'Confirmation en cours...' : 'Confirmer mon Rendez-vous'}
                <ArrowRight size={18} />
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
