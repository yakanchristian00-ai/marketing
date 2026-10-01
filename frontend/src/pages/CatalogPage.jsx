import React, { useState, useEffect } from 'react';
import { apiProducts } from '../api/client';
import { ShoppingBag, Search, Filter, Star, Sparkles, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { buildAdminWhatsAppLink } from '../config/contact';

export default function CatalogPage({ onOpenProductModal }) {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const res = await apiProducts.getAll();
        setProducts(res.products || []);
      } catch (err) {
        console.error('Erreur catalogue produits:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const categories = ['Tous', 'Kits Marketing', 'Formations', 'E-books', 'Templates', 'Logiciels'];

  let filtered = products.filter(p => {
    const matchesCat = activeCategory === 'Tous' || p.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  }

  const handleWhatsAppOrder = (prod) => {
    const text =
      `Bonjour TTES-ICG, je souhaite commander directement le produit "${prod.title}" (${Number(prod.price).toLocaleString('fr-FR')} FCFA). Merci de m'indiquer la marche à suivre.`
    window.open(buildAdminWhatsAppLink(text), '_blank');
  };

  return (
    <div className="section-padding">
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="badge badge-purple" style={{ marginBottom: '12px' }}>
            <ShoppingBag size={14} /> Boutique Digital Solutions & Formations
          </span>
          <h1 style={{ fontSize: '3rem', marginBottom: '16px' }} className="text-gradient">
            Catalogue de Produits & Kits Marketing TTES-ICG
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
            Accélérez vos ventes grâce à nos outils prêts à l’emploi, modèles d’automatisation, guides stratégiques et formations certifiantes.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-card-lg" style={{ padding: '24px', marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Rechercher un produit, e-book, formation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '44px' }}
              />
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Trier par :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
                style={{ width: 'auto', padding: '10px 16px' }}
              >
                <option value="popular">Plus populaires</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
              </select>
            </div>

          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  border: activeCategory === cat ? '1px solid var(--primary-cyan)' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: activeCategory === cat ? 'rgba(0, 240, 255, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  color: activeCategory === cat ? 'var(--primary-cyan)' : 'var(--text-muted)',
                  fontWeight: '700',
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

        {/* Products Grid */}
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Chargement du catalogue...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(15, 23, 42, 0.4)', borderRadius: 'var(--radius-md)' }}>
            Aucun produit ne correspond à votre recherche.
          </div>
        ) : (
          <div className="grid-3" style={{ gap: '30px' }}>
            {filtered.map(prod => (
              <div
                key={prod.id}
                className="glass-panel"
                style={{
                  padding: '24px',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div>
                  {/* Image with Badges */}
                  <div style={{ position: 'relative', height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '20px' }}>
                    <img src={prod.image} alt={prod.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                      <span className="badge badge-purple">{prod.category}</span>
                      {prod.badge && <span className="badge badge-cyan">{prod.badge}</span>}
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', color: '#FBBF24' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="#FBBF24" color="#FBBF24" />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {prod.rating} ({prod.reviews_count} avis)
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '10px' }}>{prod.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px', lineHeight: 1.5 }}>
                    {prod.description}
                  </p>

                  {/* Features list */}
                  <div style={{ marginBottom: '20px' }}>
                    {prod.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                        <CheckCircle2 size={13} color="var(--primary-cyan)" style={{ flexShrink: 0 }} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & Action Buttons */}
                <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Prix Total</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--primary-cyan)', fontFamily: 'var(--font-heading)' }}>
                        {Number(prod.price).toLocaleString('fr-FR')} FCFA
                      </div>
                    </div>
                    {prod.original_price && (
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                        {Number(prod.original_price).toLocaleString('fr-FR')} FCFA
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => onOpenProductModal(prod)}
                      style={{ flex: 1 }}
                    >
                      Commander
                    </button>

                    <button
                      className="btn btn-sm"
                      style={{ background: '#25D366', color: '#030712', fontWeight: '700', padding: '8px 12px' }}
                      onClick={() => handleWhatsAppOrder(prod)}
                      title="Acheter via WhatsApp"
                    >
                      <MessageCircle size={16} />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
