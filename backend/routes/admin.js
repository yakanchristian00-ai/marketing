const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../config/database');
const { authenticateToken, requireRole, requireAnyRole } = require('../middleware/auth');

router.use(authenticateToken);
router.use(requireAnyRole(['superadmin', 'admin']));

// GET /api/admin/stats - Overview metrics
router.get('/stats', (req, res) => {
  try {
    const db = readDB();
    const totalUsers = db.users.length;
    const totalQuotes = db.quotes.length;
    const totalBookings = db.bookings.length;
    const totalContacts = db.contacts.length;
    const totalOrders = (db.orders || []).length;
    const totalProducts = (db.products || []).length;

    const estimatedPipelineRevenue = db.quotes.reduce((acc, q) => acc + (q.estimated_revenue || 0), 0);
    const productSalesRevenue = (db.orders || []).reduce((acc, o) => acc + (o.price || 0), 0);

    res.json({
      stats: {
        totalUsers,
        totalQuotes,
        totalBookings,
        totalContacts,
        totalOrders,
        totalProducts,
        estimatedPipelineRevenue,
        productSalesRevenue,
        pendingLeadsCount: db.quotes.filter(q => q.status === 'pending').length + db.bookings.filter(b => b.status === 'pending').length
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Erreur lors du calcul des statistiques.' });
  }
});

// GET /api/admin/leads - All leads, orders, products & users data
router.get('/leads', (req, res) => {
  try {
    const db = readDB();
    const sanitizedUsers = db.users.map(u => ({
      id: u.id,
      email: u.email,
      full_name: u.full_name,
      role: u.role,
      company: u.company,
      phone: u.phone,
      is_blocked: u.is_blocked || false,
      created_at: u.created_at
    }));

    res.json({
      quotes: db.quotes,
      bookings: db.bookings,
      contacts: db.contacts,
      orders: db.orders || [],
      products: db.products || [],
      users: sanitizedUsers
    });
  } catch (error) {
    console.error('Admin leads fetch error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
  }
});

// PATCH /api/admin/leads/:type/:id - Update lead status
router.patch('/leads/:type/:id', (req, res) => {
  try {
    const { type, id } = req.params;
    const { status } = req.body;

    if (!['quotes', 'bookings', 'contacts', 'orders'].includes(type)) {
      return res.status(400).json({ error: 'Type de ressource invalide.' });
    }

    if (!status) {
      return res.status(400).json({ error: 'Nouveau statut requis.' });
    }

    const db = readDB();
    const collection = db[type];
    const itemIndex = collection.findIndex(item => item.id === id);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Élément introuvable.' });
    }

    collection[itemIndex].status = status;
    writeDB(db);

    res.json({
      message: `Statut mis à jour avec succès : ${status}`,
      updatedItem: collection[itemIndex]
    });
  } catch (error) {
    console.error('Admin update status error:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
  }
});

// PATCH /api/admin/users/:id/role - Superadmin only: Change user role
router.patch('/users/:id/role', requireRole('superadmin'), (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['superadmin', 'admin', 'client'].includes(role)) {
      return res.status(400).json({ error: 'Rôle invalide. Rôles autorisés: superadmin, admin, client.' });
    }

    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }

    db.users[userIndex].role = role;
    writeDB(db);

    res.json({
      message: `Le rôle de ${db.users[userIndex].full_name} a été mis à jour avec succès : ${role}`,
      user: {
        id: db.users[userIndex].id,
        email: db.users[userIndex].email,
        full_name: db.users[userIndex].full_name,
        role: db.users[userIndex].role
      }
    });

  } catch (error) {
    console.error('Superadmin role change error:', error);
    res.status(500).json({ error: 'Erreur lors du changement de rôle.' });
  }
});

// PATCH /api/admin/users/:id/block - Superadmin only: Block / Unblock user
router.patch('/users/:id/block', requireRole('superadmin'), (req, res) => {
  try {
    const { id } = req.params;
    const { is_blocked } = req.body;

    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }

    // Cannot block oneself
    if (db.users[userIndex].id === req.user.id) {
      return res.status(400).json({ error: 'Vous ne pouvez pas bloquer votre propre compte.' });
    }

    db.users[userIndex].is_blocked = Boolean(is_blocked);
    writeDB(db);

    const actionText = is_blocked ? 'bloqué/suspendu' : 'débloqué';

    res.json({
      message: `Le compte de ${db.users[userIndex].full_name} a été ${actionText} avec succès.`,
      user: {
        id: db.users[userIndex].id,
        email: db.users[userIndex].email,
        full_name: db.users[userIndex].full_name,
        is_blocked: db.users[userIndex].is_blocked
      }
    });

  } catch (error) {
    console.error('Superadmin block user error:', error);
    res.status(500).json({ error: 'Erreur lors de la modification du statut de blocage.' });
  }
});

// DELETE /api/admin/users/:id - Superadmin only: Delete user account
router.delete('/users/:id', requireRole('superadmin'), (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();

    // Cannot delete oneself
    if (id === req.user.id) {
      return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte.' });
    }

    const initialLength = db.users.length;
    db.users = db.users.filter(u => u.id !== id);

    if (db.users.length === initialLength) {
      return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }

    writeDB(db);

    res.json({ message: 'Compte utilisateur supprimé avec succès.' });

  } catch (error) {
    console.error('Superadmin delete user error:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l’utilisateur.' });
  }
});

// DELETE /api/admin/leads/:type/:id - Delete lead or order
router.delete('/leads/:type/:id', (req, res) => {
  try {
    const { type, id } = req.params;

    if (!['quotes', 'bookings', 'contacts', 'orders'].includes(type)) {
      return res.status(400).json({ error: 'Type de ressource invalide.' });
    }

    const db = readDB();
    const initialLength = db[type].length;
    db[type] = db[type].filter(item => item.id !== id);

    if (db[type].length === initialLength) {
      return res.status(404).json({ error: 'Élément introuvable.' });
    }

    writeDB(db);

    res.json({ message: 'Élément supprimé avec succès.' });
  } catch (error) {
    console.error('Admin delete item error:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

module.exports = router;
