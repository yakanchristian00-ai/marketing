const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// GET /api/notifications/my-notifications - Get user notifications
router.get('/my-notifications', (req, res) => {
  try {
    const db = readDB();
    const userNotifications = (db.notifications || [])
      .filter(n => n.user_id === req.user.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const unreadCount = userNotifications.filter(n => !n.is_read).length;

    res.json({
      notifications: userNotifications,
      unread_count: unreadCount
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des notifications.' });
  }
});

// PATCH /api/notifications/:id/read - Mark notification as read
router.patch('/:id/read', (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();

    const notifIndex = (db.notifications || []).findIndex(
      n => n.id === id && n.user_id === req.user.id
    );

    if (notifIndex === -1) {
      return res.status(404).json({ error: 'Notification non trouvée.' });
    }

    db.notifications[notifIndex].is_read = true;
    writeDB(db);

    res.json({ message: 'Notification marquée comme lue.' });

  } catch (error) {
    console.error('Error marking notification read:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la notification.' });
  }
});

// PATCH /api/notifications/read-all - Mark all user notifications as read
router.patch('/read-all', (req, res) => {
  try {
    const db = readDB();
    let updated = false;

    (db.notifications || []).forEach(n => {
      if (n.user_id === req.user.id && !n.is_read) {
        n.is_read = true;
        updated = true;
      }
    });

    if (updated) {
      writeDB(db);
    }

    res.json({ message: 'Toutes les notifications ont été marquées comme lues.' });

  } catch (error) {
    console.error('Error marking all notifications read:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
  }
});

module.exports = router;
