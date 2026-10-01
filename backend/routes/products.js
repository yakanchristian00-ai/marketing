const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../config/database');
const { optionalToken, authenticateToken, requireAnyRole } = require('../middleware/auth');

const ADMIN_WHATSAPP_NUMBER = '237657850197';

// GET /api/products - Get all products
router.get('/', (req, res) => {
  try {
    const db = readDB();
    const { category, type } = req.query;

    let products = db.products || [];

    if (category && category !== 'Tous') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (type) {
      products = products.filter(p => p.type === type);
    }

    res.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Erreur lors du chargement du catalogue de produits.' });
  }
});

// GET /api/products/:id - Single product details
router.get('/:id', (req, res) => {
  try {
    const db = readDB();
    const product = db.products.find(p => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Produit introuvable.' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Error fetching product detail:', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// POST /api/products - Create new product (Superadmin & Admin)
router.post('/', authenticateToken, requireAnyRole(['superadmin', 'admin']), (req, res) => {
  try {
    const { title, category, badge, price, original_price, description, features, image, type } = req.body;

    if (!title || !category || !price || !description) {
      return res.status(400).json({ error: 'Veuillez remplir le titre, la catégorie, le prix et la description du produit.' });
    }

    const db = readDB();
    const productId = 'prod_' + Date.now().toString().slice(-6);

    const newProduct = {
      id: productId,
      title,
      category,
      badge: badge || '',
      price: Number(price),
      original_price: original_price ? Number(original_price) : null,
      rating: 5.0,
      reviews_count: 1,
      description,
      features: Array.isArray(features) ? features : (features ? features.split('\n').filter(Boolean) : []),
      image: image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      type: type || 'digital_pack',
      created_at: new Date().toISOString()
    };

    if (!db.products) db.products = [];
    db.products.unshift(newProduct);
    writeDB(db);

    res.status(201).json({
      message: 'Nouveau produit ajouté au catalogue avec succès !',
      product: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Erreur lors de la création du produit.' });
  }
});

// PUT /api/products/:id - Update product (Superadmin & Admin)
router.put('/:id', authenticateToken, requireAnyRole(['superadmin', 'admin']), (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, badge, price, original_price, description, features, image, type } = req.body;

    const db = readDB();
    const prodIndex = db.products.findIndex(p => p.id === id);

    if (prodIndex === -1) {
      return res.status(404).json({ error: 'Produit introuvable.' });
    }

    if (title) db.products[prodIndex].title = title;
    if (category) db.products[prodIndex].category = category;
    if (badge !== undefined) db.products[prodIndex].badge = badge;
    if (price) db.products[prodIndex].price = Number(price);
    if (original_price !== undefined) db.products[prodIndex].original_price = original_price ? Number(original_price) : null;
    if (description) db.products[prodIndex].description = description;
    if (features) db.products[prodIndex].features = Array.isArray(features) ? features : features.split('\n').filter(Boolean);
    if (image) db.products[prodIndex].image = image;
    if (type) db.products[prodIndex].type = type;

    writeDB(db);

    res.json({
      message: 'Produit mis à jour avec succès.',
      product: db.products[prodIndex]
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
  }
});

// DELETE /api/products/:id - Delete product (Superadmin & Admin)
router.delete('/:id', authenticateToken, requireAnyRole(['superadmin', 'admin']), (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();

    const initialLength = db.products.length;
    db.products = db.products.filter(p => p.id !== id);

    if (db.products.length === initialLength) {
      return res.status(404).json({ error: 'Produit introuvable.' });
    }

    writeDB(db);

    res.json({ message: 'Produit supprimé du catalogue.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

// POST /api/products/order - Submit product purchase order
router.post('/order', optionalToken, (req, res) => {
  try {
    const {
      product_id,
      customer_name,
      customer_email,
      customer_phone,
      company,
      payment_method,
      notes
    } = req.body;

    if (!product_id || !customer_name || !customer_email || !customer_phone) {
      return res.status(400).json({ error: 'Veuillez saisir votre nom, email et téléphone pour valider la commande.' });
    }

    const db = readDB();
    const product = db.products.find(p => p.id === product_id);

    if (!product) {
      return res.status(404).json({ error: 'Produit sélectionné introuvable.' });
    }

    const orderId = 'ord_' + Date.now().toString().slice(-6);
    const newOrder = {
      id: orderId,
      product_id: product.id,
      product_title: product.title,
      price: product.price,
      customer_name,
      customer_email,
      customer_phone,
      company: company || '',
      payment_method: payment_method || 'WhatsApp / Mobile Money',
      status: 'pending',
      notes: notes || '',
      created_at: new Date().toISOString()
    };

    if (!db.orders) db.orders = [];
    db.orders.unshift(newOrder);
    writeDB(db);

    const waText = encodeURIComponent(
      `Bonjour TTES-ICG, je viens de commander le produit "${product.title}" (Réf: ${orderId}, Prix: ${Number(product.price).toLocaleString('fr-FR')} FCFA). Mon nom est ${customer_name} (${customer_phone}). Merci de me transmettre le lien d'accès/téléchargement.`
    );
    const whatsappLink = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${waText}`;

    res.status(201).json({
      message: 'Votre commande a été enregistrée avec succès !',
      order: newOrder,
      whatsappLink
    });

  } catch (error) {
    console.error('Error creating product order:', error);
    res.status(500).json({ error: 'Erreur lors de l’enregistrement de votre commande.' });
  }
});

module.exports = router;
