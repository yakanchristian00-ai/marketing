import React from 'react';
import { ShieldCheck, Award, Target, Users, Sparkles, CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import { buildAdminWhatsAppLink } from '../config/contact';

export default function AboutPage({ onOpenBooking }) {
  const handleWhatsApp = () => {
    window.open(buildAdminWhatsAppLink('Bonjour TTES-ICG, je souhaite en savoir plus sur votre agence et vos services.'), '_blank');
  };

  return (
    <div className="section-padding">
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>
            <Award size={14} /> À Propos de TTES-ICG
          </span>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }} className="text-gradient">
            Ingénierie, Conseil & Marketing de Performance
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '750px', margin: '0 auto', fontSize: '1.15rem' }}>
            <strong>TTES-ICG</strong> (Technologies, Transports, Études, Services - Ingénierie, Conseil & Gestion) est une agence de référence qui accompagne les entreprises dans leur accélération digitale et leur conquête de marché.
          </p>
        </div>

        {/* Vision & Mission Grid */}
        <div className="grid-2" style={{ gap: '32px', marginBottom: '80px' }}>
          <div className="glass-card-lg" style={{ padding: '40px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(0, 240, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-cyan)', marginBottom: '20px' }}>
              <Target size={26} />
            </div>
            <h3 style={{ fontSize: '1.6rem', color: '#FFFFFF', marginBottom: '14px' }}>Notre Mission</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7 }}>
              Transformer chaque franc investi en marketing en résultats mesurables et pérennes. Nous concevons des écosystèmes d’acquisition complets combinant stratégie d’ingénierie, branding d’élite et automatisation.
            </p>
          </div>

          <div className="glass-card-lg" style={{ padding: '40px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C084FC', marginBottom: '20px' }}>
              <Sparkles size={26} />
            </div>
            <h3 style={{ fontSize: '1.6rem', color: '#FFFFFF', marginBottom: '14px' }}>Notre Vision</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7 }}>
              Devenir le partenaire stratégique incontournable des dirigeants, PME et grands groupes en Afrique et à l’international pour imposer leur dominance concurrentielle.
            </p>
          </div>
        </div>

        {/* Key Values */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '2.2rem', textAlign: 'center', marginBottom: '40px' }} className="text-gradient">
            Nos Valeurs Fondamentales
          </h2>

          <div className="grid-3" style={{ gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '30px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-cyan)', marginBottom: '10px' }}>1. Rigueur & Ingénierie</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Pas d’improvisation. Toutes nos campagnes reposent sur des données chiffrées, des audits approfondis et des tests A/B rigoureux.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '30px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#C084FC', marginBottom: '10px' }}>2. Retours sur Investissement (ROI)</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Chaque euro ou FCFA engagé doit être orienté vers la génération de prospects qualifiés et la croissance du chiffre d’affaires.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '30px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--accent-emerald)', marginBottom: '10px' }}>3. Accompagnement Proche & Réactif</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Un accès direct avec nos consultants seniors par visioconférence et sur WhatsApp pour un suivi en temps réel.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="glass-card-lg" style={{ padding: '50px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: '#FFFFFF' }}>
            Prêt à faire passer votre entreprise au niveau supérieur ?
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 30px auto' }}>
            Échangez directement avec un expert TTES-ICG pour analyser vos opportunités de croissance.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={onOpenBooking}>
              Réserver un Audit Offert
            </button>
            <button className="btn" style={{ background: '#25D366', color: '#030712', fontWeight: '700' }} onClick={handleWhatsApp}>
              <MessageCircle size={18} /> Discuter sur WhatsApp
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
