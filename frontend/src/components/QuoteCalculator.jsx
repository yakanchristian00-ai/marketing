import React, { useState, useEffect } from 'react';
import { apiLeads, apiExpertises } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Calculator, TrendingUp, DollarSign, Users, CheckCircle2, ArrowRight, Sparkles, Send, Eye, MousePointer, Target, UserCheck, ShoppingBag, ShieldCheck, Lock, Clock, MessageCircle, AlertCircle } from 'lucide-react';
import PaidExpertiseModal from './PaidExpertiseModal';
import { EXPERTISE_PRICE, EXPERTISE_CURRENCY } from '../config/expertises';

const AVAILABLE_SERVICES = [
  'Stratégie Digitale & Growth Hacking',
  'SEO, SEA & Google Ads Performance',
  'Branding & Design d’Expérience (UX/UI)',
  'Social Media Management & Content Production',
  'Développement Web & Landing Pages Haute Conversion',
  'Analytics, Data Intelligence & Consulting ROI'
];

export default function QuoteCalculator({ initialService }) {
  const { user, isAdmin, openAuth } = useAuth();

  const [budget, setBudget] = useState(1500000);
  const [panierMoyen, setPanierMoyen] = useState(345000);
  const [selectedServices, setSelectedServices] = useState([AVAILABLE_SERVICES[0], AVAILABLE_SERVICES[1]]);
  const [notes, setNotes] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [successQuote, setSuccessQuote] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Paid expertise state (Devis ROI)
  const [devisExpertise, setDevisExpertise] = useState(null);
  const [devisStatus, setDevisStatus] = useState('NOT_ACTIVATED');
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [paidModalOpen, setPaidModalOpen] = useState(false);

  const fetchDevisExpertiseStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await apiExpertises.getAll();
      const expList = res.expertises || [];
      const devisExp = expList.find(e => e.id === 'exp_growth_ai') || expList[0];
      setDevisExpertise(devisExp);
      if (devisExp) {
        setDevisStatus(devisExp.user_status || 'NOT_ACTIVATED');
      }
    } catch (err) {
      console.error('Erreur vérification statut devis:', err);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchDevisExpertiseStatus();
  }, [user]);

  useEffect(() => {
    if (initialService && !selectedServices.includes(initialService)) {
      setSelectedServices(prev => [...prev, initialService]);
    }
  }, [initialService]);

  useEffect(() => {
    if (user) {
      setName(user.full_name || '');
      setEmail(user.email || '');
      setCompany(user.company || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  // Conversion Funnel Calculations
  const impressions = Math.round((budget / 10000) * 1000);
  const clics = Math.round(impressions * 0.02);
  const leadsTotal = Math.round(clics * 0.10);
  const leadsQualifies = Math.round(leadsTotal * 0.65);
  const clientsAcquis = Math.max(1, Math.round(leadsQualifies * 0.1025));
  const chiffreAffaires = clientsAcquis * panierMoyen;
  const roiMultiplier = (chiffreAffaires / budget).toFixed(1);

  const toggleService = (srv) => {
    if (selectedServices.includes(srv)) {
      if (selectedServices.length === 1) return;
      setSelectedServices(selectedServices.filter(s => s !== srv));
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const payload = {
        user_name: name || user?.full_name || 'Prospect',
        user_email: email || user?.email,
        company,
        phone,
        monthly_budget: budget,
        selected_services: selectedServices,
        estimated_leads: leadsQualifies,
        estimated_roi_multiplier: `${roiMultiplier}x`,
        estimated_revenue: chiffreAffaires,
        notes: `SimulateurFunnel: ${impressions.toLocaleString('fr-FR')} Imp, ${clics.toLocaleString('fr-FR')} Clics, ${leadsTotal} Leads, ${leadsQualifies} Qualifiés, ${clientsAcquis} Clients @ ${panierMoyen.toLocaleString('fr-FR')} FCFA. ${notes}`
      };

      const res = await apiLeads.submitQuote(payload);
      setSuccessQuote(res.quote);
    } catch (err) {
      setErrorMsg(err.message || 'Erreur lors de l’envoi de votre demande de devis.');
    } finally {
      setSubmitting(false);
    }
  };

  // Check if client has unlocked the devis calculator:
  // Admin / SuperAdmin always have access. Clients must have status === 'ACTIVE'.
  const isUnlocked = isAdmin || devisStatus === 'ACTIVE';

  return (
    <section id="calculator" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="badge badge-purple" style={{ marginBottom: '12px' }}>
            <Calculator size={14} /> Simulateur de Devis & Calculateur ROI
          </span>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '16px' }} className="text-gradient">
            Simulateur de Conversion & Estimation de Devis
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '720px', margin: '0 auto', fontSize: '1.05rem' }}>
            Décomposez l’entonnoir publicitaire étape par étape (Impressions, Clics, Leads, Ventes) pour comprendre comment votre budget se transforme en chiffre d’affaires.
          </p>
        </div>

        {/* Locked Card View for Clients without Active Expertise */}
        {!isUnlocked && !loadingStatus && (
          <div
            className="glass-card-lg"
            style={{
              padding: '48px 32px',
              textAlign: 'center',
              maxWidth: '780px',
              margin: '0 auto',
              border: devisStatus === 'PENDING' ? '1px solid #FACC15' : '1px solid rgba(0, 240, 255, 0.3)',
              background: 'rgba(11, 23, 38, 0.95)'
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '24px',
                background: devisStatus === 'PENDING'
                  ? 'rgba(250, 204, 21, 0.15)'
                  : 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(192, 132, 252, 0.2))',
                border: `1px solid ${devisStatus === 'PENDING' ? '#FACC15' : 'var(--primary-cyan)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                color: devisStatus === 'PENDING' ? '#FACC15' : 'var(--primary-cyan)'
              }}
            >
              {devisStatus === 'PENDING' ? <Clock size={36} /> : <Lock size={36} />}
            </div>

            <span className="badge badge-purple" style={{ marginBottom: '12px' }}>
              Service Payant • {EXPERTISE_PRICE} {EXPERTISE_CURRENCY}
            </span>

            <h3 style={{ fontSize: '1.8rem', color: '#FFFFFF', marginBottom: '12px' }}>
              Simulateur de Devis & Calculateur ROI Verrouillé
            </h3>

            <p style={{ color: 'var(--text-muted)', maxWidth: '620px', margin: '0 auto 24px auto', fontSize: '1rem', lineHeight: 1.6 }}>
              L’accès à l’outil interactif de simulation de devis et d’estimation de ROI est réservé aux clients ayant activé l’expertise (<strong>{EXPERTISE_PRICE} {EXPERTISE_CURRENCY}</strong>). Vous devez effectuer votre demande et échanger avec l’administrateur sur WhatsApp pour faire valider votre accès.
            </p>

            {/* Status-specific messaging */}
            {devisStatus === 'PENDING' && (
              <div style={{ background: 'rgba(250, 204, 21, 0.12)', border: '1px solid #FACC15', color: '#FACC15', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: '0.92rem', fontWeight: '600' }}>
                ⏳ Votre demande d'activation pour le simulateur de devis ({EXPERTISE_PRICE} {EXPERTISE_CURRENCY}) est en cours de traitement par l'administrateur. Veuillez patienter ou poursuivre la discussion sur WhatsApp.
              </div>
            )}

            {devisStatus === 'REJECTED' && (
              <div style={{ background: 'rgba(244, 63, 94, 0.12)', border: '1px solid var(--accent-rose)', color: 'var(--accent-rose)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: '0.92rem' }}>
                ❌ Votre précédente demande d'activation a été refusée par l'administrateur. Vous pouvez refaire une demande.
              </div>
            )}

            {/* Action Button */}
            {user ? (
              <button
                onClick={() => setPaidModalOpen(true)}
                disabled={devisStatus === 'PENDING'}
                className="btn btn-primary btn-lg"
                style={{
                  padding: '16px 32px',
                  fontSize: '1.05rem',
                  fontWeight: '800',
                  background: devisStatus === 'PENDING' ? 'rgba(250, 204, 21, 0.2)' : 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  border: devisStatus === 'PENDING' ? '1px solid #FACC15' : 'none',
                  color: devisStatus === 'PENDING' ? '#FACC15' : '#FFFFFF',
                  cursor: devisStatus === 'PENDING' ? 'not-allowed' : 'pointer'
                }}
              >
                {devisStatus === 'PENDING' ? (
                  <>
                    <Clock size={20} /> Activation en attente par l’Admin...
                  </>
                ) : (
                  <>
                    <MessageCircle size={20} /> Demander l’activation du Devis sur WhatsApp ({EXPERTISE_PRICE} {EXPERTISE_CURRENCY})
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => openAuth('login')}
                className="btn btn-primary btn-lg"
                style={{ padding: '16px 32px', fontSize: '1.05rem', fontWeight: '800' }}
              >
                <Lock size={20} /> Se connecter pour demander le Devis ({EXPERTISE_PRICE} {EXPERTISE_CURRENCY})
              </button>
            )}

            <div style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              🛡️ Seul un administrateur peut valider manuellement l'accès après confirmation de votre paiement sur WhatsApp.
            </div>

            {/* Paid Expertise Modal */}
            {devisExpertise && (
              <PaidExpertiseModal
                isOpen={paidModalOpen}
                onClose={() => setPaidModalOpen(false)}
                expertise={devisExpertise}
                onRequestSubmitted={() => fetchDevisExpertiseStatus()}
              />
            )}
          </div>
        )}

        {/* Full Interactive Calculator Box (Unlocked for Admin or Activated Client) */}
        {isUnlocked && (
          <div className="glass-card-lg" style={{ padding: '40px', border: '1px solid var(--border-glass)' }}>
            
            {successQuote ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: 'rgba(57, 217, 138, 0.15)',
                    border: '2px solid var(--accent-emerald)',
                    color: 'var(--accent-emerald)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px auto'
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '12px', color: '#FFFFFF' }}>
                  Demande de Devis Enregistrée !
                </h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto 24px auto' }}>
                  Merci <strong>{successQuote.user_name}</strong>. Votre simulation de devis commercial (Réf: <strong>{successQuote.id}</strong>) a été transmise à notre équipe stratégique TTES-ICG.
                </p>
                
                <div
                  style={{
                    background: '#0B1726',
                    borderRadius: 'var(--radius-md)',
                    padding: '24px',
                    maxWidth: '540px',
                    margin: '0 auto 32px auto',
                    border: '1px solid var(--border-glass)',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Budget Mensuel :</span>
                    <strong style={{ color: 'var(--primary-cyan)' }}>{Number(successQuote.monthly_budget).toLocaleString('fr-FR')} FCFA</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Leads Qualifiés Estimés :</span>
                    <strong style={{ color: 'var(--accent-emerald)' }}>~{leadsQualifies} prospects qualifiés</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Chiffre d’Affaires Généré :</span>
                    <strong style={{ color: 'var(--secondary-cyan)' }}>{chiffreAffaires.toLocaleString('fr-FR')} FCFA</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Multiplicateur de ROI :</span>
                    <strong style={{ color: '#C084FC' }}>{roiMultiplier}x ROI ({((roiMultiplier - 1) * 100).toFixed(0)}% Net)</strong>
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => setSuccessQuote(null)}
                >
                  Refaire une simulation
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuote}>
                <div className="grid-2" style={{ gap: '40px', alignItems: 'start' }}>
                  
                  {/* Left Column: Sliders & Services */}
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-cyan)', color: '#07111F', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: '800' }}>1</span>
                      Paramètres de la Campagne
                    </h3>

                    {/* Budget Slider */}
                    <div style={{ marginBottom: '24px', background: '#0B1726', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Budget Publicitaire Mensuel :</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary-cyan)', fontFamily: 'var(--font-heading)' }}>
                          {Number(budget).toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>

                      <input
                        type="range"
                        min="15000"
                        max="10000000"
                        step="5000"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        style={{
                          width: '100%',
                          accentColor: 'var(--primary-cyan)',
                          cursor: 'pointer',
                          height: '8px'
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '6px' }}>
                        <span>15 000 FCFA</span>
                        <span>5 000 000 FCFA</span>
                        <span>10 000 000 FCFA+</span>
                      </div>
                    </div>

                    {/* Panier Moyen Slider */}
                    <div style={{ marginBottom: '32px', background: '#0B1726', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Panier Moyen / Valeur Client :</span>
                        <span style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--secondary-cyan)', fontFamily: 'var(--font-heading)' }}>
                          {Number(panierMoyen).toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>

                      <input
                        type="range"
                        min="500"
                        max="2000000"
                        step="500"
                        value={panierMoyen}
                        onChange={(e) => setPanierMoyen(Number(e.target.value))}
                        style={{
                          width: '100%',
                          accentColor: 'var(--secondary-cyan)',
                          cursor: 'pointer',
                          height: '8px'
                        }}
                      />
                    </div>

                    {/* Services Checkboxes */}
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-purple)', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: '800' }}>2</span>
                      Services Inclus
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                      {AVAILABLE_SERVICES.map((srv) => {
                        const isSelected = selectedServices.includes(srv);
                        return (
                          <div
                            key={srv}
                            onClick={() => toggleService(srv)}
                            style={{
                              padding: '12px 16px',
                              borderRadius: 'var(--radius-sm)',
                              border: isSelected ? '1px solid var(--primary-cyan)' : '1px solid var(--border-glass)',
                              background: isSelected ? 'rgba(0, 200, 255, 0.08)' : '#0B1726',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              transition: 'var(--transition)'
                            }}
                          >
                            <span style={{ fontSize: '0.88rem', color: isSelected ? '#FFFFFF' : 'var(--text-muted)', fontWeight: isSelected ? '600' : '400' }}>
                              {srv}
                            </span>
                            <div
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '4px',
                                background: isSelected ? 'var(--primary-cyan)' : 'transparent',
                                border: isSelected ? 'none' : '1px solid var(--text-dim)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#07111F'
                              }}
                            >
                              {isSelected && <CheckCircle2 size={14} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Detailed Funnel Waterfall */}
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-emerald)', color: '#07111F', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: '800' }}>3</span>
                      Décomposition de l'Entonnoir de Conversion
                    </h3>

                    {/* Funnel Waterfall Breakdown */}
                    <div
                      style={{
                        background: '#0B1726',
                        border: '1px solid var(--border-glass)',
                        borderRadius: 'var(--radius-md)',
                        padding: '24px',
                        marginBottom: '28px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}
                    >
                      {/* Budget */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.03)' }}>
                        <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <DollarSign size={16} color="var(--primary-cyan)" /> Budget Publicitaire
                        </span>
                        <strong style={{ color: 'var(--primary-cyan)', fontSize: '1rem' }}>{budget.toLocaleString('fr-FR')} FCFA</strong>
                      </div>

                      {/* Impressions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.03)' }}>
                        <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Eye size={16} color="var(--secondary-cyan)" /> → Impressions (CPM ~10k FCFA)
                        </span>
                        <strong style={{ color: '#FFFFFF', fontSize: '0.95rem' }}>{impressions.toLocaleString('fr-FR')}</strong>
                      </div>

                      {/* Clics */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.03)' }}>
                        <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <MousePointer size={16} color="var(--secondary-cyan)" /> → Clics générés (CTR ~2.0%)
                        </span>
                        <strong style={{ color: '#FFFFFF', fontSize: '0.95rem' }}>{clics.toLocaleString('fr-FR')}</strong>
                      </div>

                      {/* Leads Totaux */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.03)' }}>
                        <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Target size={16} color="#C084FC" /> → Leads totaux (Conv ~10%)
                        </span>
                        <strong style={{ color: '#C084FC', fontSize: '0.95rem' }}>{leadsTotal} leads</strong>
                      </div>

                      {/* Leads Qualifiés */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                        <span style={{ fontSize: '0.88rem', color: '#FFFFFF', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <UserCheck size={16} color="#C084FC" /> → Leads Qualifiés (65%)
                        </span>
                        <strong style={{ color: '#C084FC', fontSize: '1.1rem', fontWeight: '800' }}>{leadsQualifies} qualifiés</strong>
                      </div>

                      {/* Clients Acquis */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(57, 217, 138, 0.15)', border: '1px solid rgba(57, 217, 138, 0.3)' }}>
                        <span style={{ fontSize: '0.88rem', color: '#FFFFFF', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <ShoppingBag size={16} color="var(--accent-emerald)" /> → Clients Acquis (Closing ~10.2%)
                        </span>
                        <strong style={{ color: 'var(--accent-emerald)', fontSize: '1.1rem', fontWeight: '800' }}>{clientsAcquis} clients</strong>
                      </div>

                      {/* Grand Total CA Box */}
                      <div style={{ marginTop: '10px', background: 'linear-gradient(135deg, rgba(0, 200, 255, 0.12) 0%, rgba(57, 217, 138, 0.12) 100%)', border: '1px solid var(--primary-cyan)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                            Chiffre d’Affaires Estimé ({clientsAcquis} clients × {panierMoyen.toLocaleString('fr-FR')} FCFA)
                          </div>
                          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--accent-emerald)', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                            {chiffreAffaires.toLocaleString('fr-FR')} FCFA
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Multiplicateur</div>
                          <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--primary-cyan)', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                            {roiMultiplier}x ROI
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Submission Form */}
                    <div style={{ background: '#0B1726', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#FFFFFF', marginBottom: '14px' }}>
                        Recevoir la stratégie & proposition détaillée :
                      </div>

                      {errorMsg && (
                        <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(244, 63, 94, 0.15)', color: '#FECDD3', fontSize: '0.82rem', marginBottom: '14px' }}>
                          {errorMsg}
                        </div>
                      )}

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
                          <label className="form-label">Email professionnel *</label>
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
                          <label className="form-label">Société</label>
                          <input
                            type="text"
                            placeholder="Nom d’entreprise"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: '12px' }}>
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

                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '8px' }}
                      >
                        {submitting ? 'Transmission en cours...' : 'Valider & Obtenir l’Audit Gratuit'}
                        <Send size={16} />
                      </button>
                    </div>

                  </div>

                </div>
              </form>
            )}

          </div>
        )}

      </div>
    </section>
  );
}
