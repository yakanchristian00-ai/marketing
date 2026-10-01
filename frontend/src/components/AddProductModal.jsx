import React, { useState, useEffect } from 'react';
import { apiProducts } from '../api/client';
import { X, PlusCircle, CheckCircle2, Sparkles, Image, DollarSign, Tag, List } from 'lucide-react';

export default function AddProductModal({ isOpen, onClose, editProduct, onProductSaved }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Kits Marketing');
  const [badge, setBadge] = useState('Nouveau');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [type, setType] = useState('digital_pack');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (editProduct) {
      setTitle(editProduct.title || '');
      setCategory(editProduct.category || 'Kits Marketing');
      setBadge(editProduct.badge || '');
      setPrice(editProduct.price || '');
      setOriginalPrice(editProduct.original_price || '');
      setDescription(editProduct.description || '');
      setFeaturesText(Array.isArray(editProduct.features) ? editProduct.features.join('\n') : '');
      setImage(editProduct.image || '');
      setImagePreview(editProduct.image || '');
      setType(editProduct.type || 'digital_pack');
    } else {
      setTitle('');
      setCategory('Kits Marketing');
      setBadge('Nouveau');
      setPrice('');
      setOriginalPrice('');
      setDescription('');
      setFeaturesText('');
      setImage('');
      setImagePreview('');
      setType('digital_pack');
    }
  }, [editProduct, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Veuillez sélectionner un fichier image valide.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setImage(result);
      setImagePreview(result);
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const featuresArray = featuresText.split('\n').filter(line => line.trim() !== '');

      const payload = {
        title,
        category,
        badge,
        price: Number(price),
        original_price: originalPrice ? Number(originalPrice) : null,
        description,
        features: featuresArray,
        image: image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        type
      };

      if (editProduct) {
        await apiProducts.update(editProduct.id, payload);
        setSuccessMsg('Produit mis à jour avec succès !');
      } else {
        await apiProducts.create(payload);
        setSuccessMsg('Nouveau produit ajouté au catalogue avec succès !');
      }

      setTimeout(() => {
        if (onProductSaved) onProductSaved();
        onClose();
      }, 1200);

    } catch (err) {
      setErrorMsg(err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card-lg" style={{ maxWidth: '680px', padding: '36px' }} onClick={(e) => e.stopPropagation()}>
        
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

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-cyan)', marginBottom: '8px' }}>
            <PlusCircle size={20} />
            <span style={{ fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Gestion du Catalogue TTES-ICG
            </span>
          </div>
          <h2 style={{ fontSize: '1.7rem' }} className="text-gradient">
            {editProduct ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit / Formation'}
          </h2>
        </div>

        {errorMsg && (
          <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'rgba(244, 63, 94, 0.15)', color: '#FECDD3', fontSize: '0.85rem', marginBottom: '20px' }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.15)', color: '#A7F3D0', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label">Titre du produit / Formation *</label>
            <input
              type="text"
              required
              placeholder="ex: Pack Masterclass Growth B2B 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="grid-2" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Catégorie *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
              >
                <option value="Kits Marketing">Kits Marketing</option>
                <option value="Formations">Formations</option>
                <option value="E-books">E-books</option>
                <option value="Templates">Templates</option>
                <option value="Logiciels">Logiciels</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Badge promotionnel</label>
              <input
                type="text"
                placeholder="ex: Best-Seller, Nouveau, Promo"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="grid-2" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Prix de vente (FCFA) *</label>
              <input
                type="number"
                required
                placeholder="ex: 250000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Prix barré avant réduction (FCFA)</label>
              <input
                type="number"
                placeholder="ex: 350000"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image du produit</label>

            <div style={{ display: 'grid', gap: '12px' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="form-input"
                style={{ padding: '12px 14px' }}
              />

              <input
                type="url"
                placeholder="Ou collez une URL d'image : https://images.unsplash.com/..."
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                  setImagePreview(e.target.value);
                }}
                className="form-input"
              />
            </div>

            {imagePreview && (
              <div style={{ marginTop: '12px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(15, 23, 42, 0.4)' }}>
                <img
                  src={imagePreview}
                  alt="Prévisualisation"
                  style={{ display: 'block', width: '100%', maxHeight: '220px', objectFit: 'cover' }}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Description courte *</label>
            <textarea
              rows={3}
              required
              placeholder="Décrivez les bénéfices clés de ce produit..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Fonctionnalités & Éléments inclus (1 par ligne)</label>
            <textarea
              rows={4}
              placeholder="15h de cours vidéo HD&#10;Templates Notion offerts&#10;Certificat de réussite"
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              className="form-textarea"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
          >
            {submitting ? 'Enregistrement...' : editProduct ? 'Mettre à jour le Produit' : 'Publier le Produit dans le Catalogue'}
          </button>
        </form>

      </div>
    </div>
  );
}
