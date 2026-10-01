import React, { useState, useEffect } from 'react';
import { apiServices } from '../api/client';
import { Rocket, Search, Palette, Share2, Code, BarChart3, CheckCircle, ArrowRight, Sparkles, ChevronRight, Info, Eye } from 'lucide-react';
import ServiceDetailModal from './ServiceDetailModal';

const ICON_MAP = {
  Rocket: Rocket,
  Search: Search,
  Palette: Palette,
  Share2: Share2,
  Code: Code,
  BarChart3: BarChart3
};

export default function Services({ onSelectServiceForQuote, onOpenBooking }) {
  const [services, setServices] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [selectedServiceDetail, setSelectedServiceDetail] = useState(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await apiServices.getAll();
        setServices(data.services || []);
      } catch (err) {
        console.error('Erreur chargement services:', err);
      }
    }
    fetchServices();
  }, []);

  const categories = ['Tous', 'Strategie', 'Acquisition', 'Design', 'Contenu', 'Tech', 'Data'];

  const filteredServices = activeCategory === 'Tous'
    ? services
    : services.filter(s => s.category === activeCategory);

  return (
    <section id="services" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>
            <Sparkles size={14} /> Domaines d’Expertise
          </span>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '16px' }} className="text-gradient">
            Nos Solutions Marketing & Ingénierie
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem' }}>
            Des stratégies personnalisées pour capturer de nouveaux marchés, maximiser votre taux de conversion et asseoir votre leadership.
          </p>

          {/* Category Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '30px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  border: activeCategory === cat ? '1px solid var(--primary-cyan)' : '1px solid var(--border-glass)',
                  background: activeCategory === cat ? 'rgba(0, 200, 255, 0.15)' : '#0B1726',
                  color: activeCategory === cat ? 'var(--primary-cyan)' : 'var(--text-muted)',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid-3">
          {filteredServices.map((service) => {
            const IconComponent = ICON_MAP[service.icon] || Rocket;

            return (
              <div
                key={service.id}
                className="glass-panel"
                style={{
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '14px',
                        background: 'rgba(0, 200, 255, 0.1)',
                        border: '1px solid var(--primary-cyan)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary-cyan)'
                      }}
                    >
                      <IconComponent size={26} />
                    </div>
                    {service.badge && (
                      <span className="badge badge-purple">{service.badge}</span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '12px', color: '#FFFFFF' }}>
                    {service.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '20px', lineHeight: 1.6 }}>
                    {service.description}
                  </p>

                  {/* Features List */}
                  <ul style={{ listStyle: 'none', padding: 0, marginBottom: '24px' }}>
                    {service.features.slice(0, 3).map((feat, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '8px' }}>
                        <CheckCircle size={16} color="var(--primary-cyan)" style={{ flexShrink: 0 }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Action & Pricing */}
                <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>À partir de</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary-cyan)', fontFamily: 'var(--font-heading)' }}>
                      {Number(service.price_starting).toLocaleString('fr-FR')} FCFA
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {/* Voir Plus / Description Détaillée Button */}
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => setSelectedServiceDetail(service)}
                      title="Voir la description complète"
                    >
                      <Eye size={14} /> Voir Plus
                    </button>

                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => onSelectServiceForQuote(service.title)}
                    >
                      Choisir
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Modal Description Détaillée du Service */}
        <ServiceDetailModal
          service={selectedServiceDetail}
          isOpen={Boolean(selectedServiceDetail)}
          onClose={() => setSelectedServiceDetail(null)}
          onSelectForQuote={onSelectServiceForQuote}
          onOpenBooking={onOpenBooking}
        />

      </div>
    </section>
  );
}
