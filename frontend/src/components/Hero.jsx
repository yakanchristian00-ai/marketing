import React from 'react';
import { Rocket, Sparkles, TrendingUp, Calendar, ArrowRight, ShieldCheck, Award } from 'lucide-react';

export default function Hero({ onOpenBooking }) {
  return (
    <section style={{ position: 'relative', padding: '100px 0 80px 0', overflow: 'hidden' }}>
      {/* Background Ambient Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.12) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        
        {/* Top Badges */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <span className="badge badge-cyan" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>
            <Sparkles size={14} /> Agence d’Ingénierie & Marketing TTES-ICG
          </span>
          <span className="badge badge-purple" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>
            <Award size={14} /> Excellence & Performance ROI
          </span>
        </div>

        {/* Hero Title */}
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            lineHeight: 1.15,
            maxWidth: '1000px',
            margin: '0 auto 24px auto'
          }}
        >
          Propulsez votre Marque et Dominez votre Marché avec <span className="text-gradient">TTES-ICG</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '1.2rem',
            color: 'var(--text-muted)',
            maxWidth: '780px',
            margin: '0 auto 40px auto',
            fontWeight: '400'
          }}
        >
          Nous combinons la puissance du <strong>Growth Hacking</strong>, l’optimisation <strong>SEO & Data Analytics</strong>, et la création de <strong>Branding Haute Valeur</strong> pour multiplier le chiffre d’affaires des entreprises ambitieuses.
        </p>

        {/* Call to Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '18px', flexWrap: 'wrap', marginBottom: '64px' }}>
          <a href="#calculator" className="btn btn-lg btn-primary">
            <TrendingUp size={20} />
            Simuler mon Devis & ROI
            <ArrowRight size={18} />
          </a>

          <button className="btn btn-lg btn-outline" onClick={onOpenBooking}>
            <Calendar size={20} />
            Réserver un Audit Stratégique Offert
          </button>
        </div>

        {/* Live Metrics Grid */}
        <div
          className="grid-4"
          style={{
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-lg)',
            padding: '36px 24px'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary-cyan)', fontFamily: 'var(--font-heading)' }}>
              +340%
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '4px' }}>
              ROI Moyen par Campagne
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#C084FC', fontFamily: 'var(--font-heading)' }}>
              4.8M €
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '4px' }}>
              Chiffre d’Affaires Généré
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--accent-emerald)', fontFamily: 'var(--font-heading)' }}>
              12.5x
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '4px' }}>
              Multiplicateur de Visibilité
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#F43F5E', fontFamily: 'var(--font-heading)' }}>
              150+
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '4px' }}>
              Clients & Marques Accompagnées
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
