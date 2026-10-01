import React, { useState, useEffect } from 'react';
import { apiLeads, apiExpertises } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { X, User, Calculator, Calendar, Clock, CheckCircle2, AlertCircle, Sparkles, Key, Lock, ExternalLink, ShieldCheck } from 'lucide-react';

export default function UserDashboard({ isOpen, onClose }) {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [expertises, setExpertises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unlockedContent, setUnlockedContent] = useState(null);
  const [testingId, setTestingId] = useState(null);

  const loadUserData = async () => {
    if (isOpen && user) {
      setLoading(true);
      try {
        const [leadsRes, expRes] = await Promise.all([
          apiLeads.getMyLeads(),
          apiExpertises.getAll()
        ]);
        setQuotes(leadsRes.quotes || []);
        setBookings(leadsRes.bookings || []);
        setExpertises(expRes.expertises || []);
      } catch (err) {
        console.error('Erreur chargement espace utilisateur:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadUserData();
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleTestProtectedFeature = async (expId) => {
    setTestingId(expId);
    setUnlockedContent(null);
    try {
      const res = await apiExpertises.getProtectedContent(expId);
      setUnlockedContent(res);
    } catch (err) {
      alert('🔒 Contrôle de sécurité Backend : ' + err.message);
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card-lg" style={{ maxWidth: '820px', padding: '36px', maxHeight: '88vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        
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

        {/* User Info Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-cyan), var(--primary-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#030712', fontWeight: '800', fontSize: '1.4rem' }}>
            {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#FFFFFF' }}>{user.full_name}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {user.email} {user.company ? `• ${user.company}` : ''}
            </div>
            <span className="badge badge-cyan" style={{ marginTop: '6px', fontSize: '0.7rem' }}>
              Compte Client Vérifié
            </span>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            Chargement de votre espace personnel...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* -------------------------------------------------------- */}
            {/* MES EXPERTISES PAYANTES (200 FCFA) */}
            {/* -------------------------------------------------------- */}
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="var(--primary-cyan)" />
                Mes Expertises Payantes (200 FCFA)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {expertises.map(exp => {
                  const status = exp.user_status || 'NOT_ACTIVATED';

                  return (
                    <div
                      key={exp.id}
                      style={{
                        background: 'rgba(11, 23, 38, 0.8)',
                        border: status === 'ACTIVE'
                          ? '1px solid var(--accent-emerald)'
                          : status === 'PENDING'
                          ? '1px solid #FACC15'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 'var(--radius-md)',
                        padding: '18px 22px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                        <div style={{ fontWeight: '800', color: '#FFFFFF', fontSize: '1.05rem' }}>{exp.title}</div>

                        {status === 'ACTIVE' && (
                          <span className="badge badge-emerald">✓ Expertise Activée</span>
                        )}

                        {status === 'PENDING' && (
                          <span className="badge" style={{ background: 'rgba(250, 204, 21, 0.15)', color: '#FACC15', border: '1px solid #FACC15' }}>
                            ⏳ Activation en attente
                          </span>
                        )}

                        {status === 'REJECTED' && (
                          <span className="badge badge-rose">❌ Demande Refusée</span>
                        )}

                        {status === 'INACTIVE' && (
                          <span className="badge" style={{ background: 'rgba(148, 163, 184, 0.15)', color: '#94A3B8' }}>Désactivée</span>
                        )}

                        {status === 'NOT_ACTIVATED' && (
                          <span className="badge badge-cyan">Non Activée (200 FCFA)</span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        {exp.description}
                      </div>

                      {status === 'ACTIVE' && (
                        <button
                          onClick={() => handleTestProtectedFeature(exp.id)}
                          disabled={testingId === exp.id}
                          className="btn btn-sm btn-emerald"
                          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Key size={14} />
                          {testingId === exp.id ? 'Vérification Backend en cours...' : 'Tester l’accès aux outils réservés'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Unlocked content result */}
              {unlockedContent && (
                <div style={{ marginTop: '16px', background: 'rgba(57, 217, 138, 0.1)', border: '1px solid var(--accent-emerald)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontWeight: '800', fontSize: '1rem', marginBottom: '8px' }}>
                    <ShieldCheck size={20} />
                    Contenu Protégé Débloqué (Vérifié par le Backend)
                  </div>
                  <p style={{ color: '#FFFFFF', fontSize: '0.9rem', marginBottom: '12px' }}>
                    {unlockedContent.data.welcome_message}
                  </p>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px' }}>
                    <strong>Outils et Fonctionnalités Incluses :</strong>
                    <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
                      {unlockedContent.data.exclusive_tools.map((t, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>
                          ⚡ <strong>{t.name}</strong> — API: <code>{t.endpoint}</code> ({t.status})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Bookings Section */}
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="var(--primary-cyan)" />
                Mes Rendez-vous Programmé(s) ({bookings.length})
              </h3>

              {bookings.length === 0 ? (
                <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', background: 'rgba(15, 23, 42, 0.6)', border: '1px dashed rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Aucun rendez-vous réservé pour le moment.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {bookings.map(b => (
                    <div key={b.id} style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: '700', color: '#FFFFFF', fontSize: '1rem' }}>{b.topic}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          📅 {b.date} • ⏰ {b.time_slot}
                        </div>
                      </div>
                      <span className={`badge ${b.status === 'confirmed' ? 'badge-emerald' : 'badge-purple'}`}>
                        {b.status === 'confirmed' ? 'Confirmé' : 'En Attente'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quotes Section */}
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calculator size={18} color="#C084FC" />
                Mes Estimations de Devis ({quotes.length})
              </h3>

              {quotes.length === 0 ? (
                <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', background: 'rgba(15, 23, 42, 0.6)', border: '1px dashed rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Aucune estimation enregistrée pour l’instant.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {quotes.map(q => (
                    <div key={q.id} style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(0, 240, 255, 0.15)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)', fontWeight: '700' }}>RÉF: {q.id}</span>
                        <span className="badge badge-cyan">{q.status}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Budget Mensuel :</span>
                        <strong style={{ color: '#FFFFFF' }}>{Number(q.monthly_budget).toLocaleString('fr-FR')} FCFA</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Estimations :</span>
                        <strong style={{ color: 'var(--accent-emerald)' }}>~{q.estimated_leads} leads ({q.estimated_roi_multiplier})</strong>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                        Services: {q.selected_services.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
