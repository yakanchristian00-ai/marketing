import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import QuoteCalculator from '../components/QuoteCalculator';
import Portfolio from '../components/Portfolio';
import { apiProducts } from '../api/client';
import { ShoppingBag, ArrowRight, Star, Sparkles, MessageCircle } from 'lucide-react';

export default function HomePage({ onOpenBooking, onNavigatePage, onOpenProductModal, onOpenUserDashboard }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await apiProducts.getAll();
        setFeaturedProducts((res.products || []).slice(0, 3));
      } catch (err) {
        console.error('Error loading featured products:', err);
      }
    }
    loadProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <Hero onOpenBooking={onOpenBooking} />

      {/* Services Overview */}
      <Services
        onSelectServiceForQuote={() => {
          const calc = document.getElementById('calculator');
          if (calc) calc.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenUserDashboard={onOpenUserDashboard}
      />

      {/* Quote Calculator */}
      <QuoteCalculator />

      {/* Featured Products Teaser Section */}
      <section className="section-padding" style={{ position: 'relative', background: 'rgba(15, 23, 42, 0.4)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span className="badge badge-purple" style={{ marginBottom: '10px' }}>
                <ShoppingBag size={14} /> Boutique Numérique TTES-ICG
              </span>
              <h2 style={{ fontSize: '2.2rem' }} className="text-gradient">
                Kits Marketing, Formations & Outils Prêts à l'Emploi
              </h2>
            </div>
            <button type
              className="btn btn-outline"
              onClick={() => onNavigatePage('catalog')}
            >
              Voir tout le catalogue ({featuredProducts.length}+)
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid-3">
            {featuredProducts.map(prod => (
              <div
                key={prod.id}
                className="glass-panel"
                style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 'var(--radius-lg)' }}
              >
                <div>
                  <div style={{ position: 'relative', height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '16px' }}>
                    <img src={prod.image} alt={prod.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span className="badge badge-cyan" style={{ position: 'absolute', top: '12px', left: '12px' }}>{prod.category}</span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '8px' }}>{prod.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px', lineHeight: 1.5 }}>
                    {prod.description.substring(0, 110)}...
                  </p>
                </div>

                <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--primary-cyan)', fontFamily: 'var(--font-heading)' }}>
                      {Number(prod.price).toLocaleString('fr-FR')} FCFA
                    </div>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={() => onOpenProductModal(prod)}>
                    Découvrir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <Portfolio />
    </div>
  );
}
