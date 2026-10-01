import React, { useState, useEffect } from 'react';
import { apiPortfolio } from '../api/client';
import { Briefcase, TrendingUp, Sparkles, ExternalLink, ArrowUpRight } from 'lucide-react';

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [filter, setFilter] = useState('Tous');

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const data = await apiPortfolio.getAll();
        setPortfolio(data.portfolio || []);
      } catch (err) {
        console.error('Erreur portfolio:', err);
      }
    }
    fetchPortfolio();
  }, []);

  const tags = ['Tous', 'Acquisition', 'SEO', 'Branding', 'Social Ads', 'Web Dev', 'Inbound'];

  const filteredItems = filter === 'Tous'
    ? portfolio
    : portfolio.filter(item => 
        item.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())) ||
        item.category.toLowerCase().includes(filter.toLowerCase())
      );

  return (
    <section id="portfolio" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '12px' }}>
            <Briefcase size={14} /> Réalisations & Success Stories
          </span>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '16px' }} className="text-gradient">
            Nos Études de Cas & Impact Mesurable
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem' }}>
            Découvrez comment nous aidons nos partenaires à dépasser leurs objectifs de croissance grâce à des campagnes à haute valeur ajoutée.
          </p>

          {/* Filter Tags */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '28px' }}>
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: filter === t ? '1px solid var(--accent-emerald)' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: filter === t ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  color: filter === t ? 'var(--accent-emerald)' : 'var(--text-muted)',
                  fontWeight: '600',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid-2" style={{ gap: '32px' }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Image Header with Badge Overlay */}
              <div style={{ position: 'relative', height: '230px', overflow: 'hidden' }}>
                <img
                  src={item.image}
                  alt={item.client_name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8, 11, 20, 0.95) 0%, transparent 60%)' }} />

                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  <span className="badge badge-cyan">{item.category}</span>
                </div>

                <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
                    {item.client_name}
                  </div>
                </div>
              </div>

              {/* Body details */}
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '20px', lineHeight: 1.6 }}>
                  {item.description}
                </p>

                {/* Key Growth Metrics Box */}
                <div
                  style={{
                    background: 'rgba(0, 240, 255, 0.05)',
                    border: '1px solid rgba(0, 240, 255, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--primary-cyan)', fontFamily: 'var(--font-heading)' }}>
                      {item.growth_metric}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {item.sub_metric}
                    </div>
                  </div>
                  <TrendingUp size={28} color="var(--primary-cyan)" />
                </div>

                {/* Tags list */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {item.tags.map((t, idx) => (
                    <span key={idx} style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(255, 255, 255, 0.06)', color: 'var(--text-dim)' }}>
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
