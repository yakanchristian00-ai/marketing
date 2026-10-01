const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../config/database');
const { EXPERTISE_PRICE, EXPERTISE_CURRENCY, ADMIN_WHATSAPP_NUMBER } = require('../config/expertises');
const { authenticateToken, optionalToken, requireAnyRole } = require('../middleware/auth');
const { hasActiveExpertise, requireActiveExpertise } = require('../middleware/expertiseAuth');

// GET /api/expertises - Public / Client catalog with status
router.get('/', optionalToken, (req, res) => {
  try {
    const db = readDB();
    const expertises = db.expertises || [];
    const clientUserId = req.user ? req.user.id : null;

    const result = expertises.map(exp => {
      let status = 'NOT_ACTIVATED';
      let pendingRequest = null;
      let rejectionNote = null;

      if (clientUserId) {
        // Check if active in client_expertises
        const clientExp = (db.client_expertises || []).find(
          ce => ce.client_id === clientUserId && ce.expertise_id === exp.id
        );

        if (clientExp && clientExp.status === 'ACTIVE') {
          status = 'ACTIVE';
        } else if (clientExp && clientExp.status === 'INACTIVE') {
          status = 'INACTIVE';
        }

        // Check requests
        const userRequests = (db.expertise_activation_requests || []).filter(
          r => r.client_id === clientUserId && r.expertise_id === exp.id
        );

        // Check if there is a PENDING request
        const pending = userRequests.find(r => r.status === 'PENDING');
        if (pending) {
          status = 'PENDING';
          pendingRequest = pending;
        }

        // Check if last request was REJECTED and not since activated
        if (status === 'NOT_ACTIVATED' || status === 'INACTIVE') {
          const rejected = userRequests
            .filter(r => r.status === 'REJECTED')
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
          if (rejected) {
            status = 'REJECTED';
            rejectionNote = rejected.admin_note || null;
          }
        }
      }

      return {
        ...exp,
        price: EXPERTISE_PRICE,
        currency: EXPERTISE_CURRENCY,
        user_status: status,
        pending_request: pendingRequest,
        rejection_note: rejectionNote
      };
    });

    res.json({
      price_config: {
        amount: EXPERTISE_PRICE,
        currency: EXPERTISE_CURRENCY,
        admin_whatsapp: ADMIN_WHATSAPP_NUMBER
      },
      expertises: result
    });

  } catch (error) {
    console.error('Error fetching expertises:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des expertises.' });
  }
});

// POST /api/expertises/request - Request activation (Client)
router.post('/request', authenticateToken, (req, res) => {
  try {
    const { expertise_id } = req.body;

    if (!expertise_id) {
      return res.status(400).json({ error: 'Veuillez spécifier l’expertise souhaitée.' });
    }

    const db = readDB();
    const expertise = (db.expertises || []).find(e => e.id === expertise_id);

    if (!expertise) {
      return res.status(404).json({ error: 'Expertise non trouvée.' });
    }

    // Check existing active PENDING request
    const existingPending = (db.expertise_activation_requests || []).find(
      r => r.client_id === req.user.id && r.expertise_id === expertise_id && r.status === 'PENDING'
    );

    if (existingPending) {
      return res.status(409).json({
        error: 'Une demande d’activation est déjà en cours de traitement pour cette expertise.',
        request: existingPending
      });
    }

    const requestId = 'req_exp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const newRequest = {
      id: requestId,
      client_id: req.user.id,
      client_name: req.user.full_name,
      client_email: req.user.email,
      client_phone: req.user.phone || '',
      expertise_id: expertise.id,
      expertise_name: expertise.title,
      amount: EXPERTISE_PRICE,
      currency: EXPERTISE_CURRENCY,
      status: 'PENDING',
      admin_id: null,
      admin_note: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      approved_at: null
    };

    db.expertise_activation_requests.unshift(newRequest);

    // Create audit log
    const logId = 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    db.expertise_history.unshift({
      id: logId,
      client_id: req.user.id,
      client_name: req.user.full_name,
      expertise_id: expertise.id,
      expertise_name: expertise.title,
      action: 'REQUESTED',
      performed_by: req.user.id,
      performed_by_name: req.user.full_name,
      details: `Demande d’activation créée pour ${EXPERTISE_PRICE} ${EXPERTISE_CURRENCY}`,
      created_at: new Date().toISOString()
    });

    writeDB(db);

    // Build prefilled WhatsApp message
    const message = `Bonjour, je souhaite activer l’expertise ${expertise.title} pour ${EXPERTISE_PRICE} ${EXPERTISE_CURRENCY} sur TTES-ICG. Mon compte est associé à ${req.user.email}.`;
    const whatsappLink = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    res.status(201).json({
      message: 'Votre demande d’activation a été enregistrée avec succès.',
      request: newRequest,
      whatsapp: {
        number: ADMIN_WHATSAPP_NUMBER,
        message,
        link: whatsappLink
      }
    });

  } catch (error) {
    console.error('Error creating expertise request:', error);
    res.status(500).json({ error: 'Erreur lors du traitement de la demande.' });
  }
});

// GET /api/expertises/my-expertises - User's active & requested expertises
router.get('/my-expertises', authenticateToken, (req, res) => {
  try {
    const db = readDB();
    const userExpertises = (db.client_expertises || []).filter(ce => ce.client_id === req.user.id);
    const userRequests = (db.expertise_activation_requests || []).filter(r => r.client_id === req.user.id);

    res.json({
      client_expertises: userExpertises,
      requests: userRequests
    });
  } catch (error) {
    console.error('Error fetching user expertises:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de vos expertises.' });
  }
});

// GET /api/expertises/protected-content/:expertiseId - Protected feature content
router.get('/protected-content/:expertiseId', authenticateToken, requireActiveExpertise(req => req.params.expertiseId), (req, res) => {
  try {
    const { expertiseId } = req.params;
    const db = readDB();
    const expertise = (db.expertises || []).find(e => e.id === expertiseId);

    res.json({
      success: true,
      expertise_id: expertiseId,
      expertise_title: expertise ? expertise.title : 'Expertise Avancée',
      unlocked_at: new Date().toISOString(),
      data: {
        welcome_message: `Félicitations ${req.user.full_name} ! Vous disposez d’un accès complet et privilégié à "${expertise ? expertise.title : 'cette expertise'}".`,
        exclusive_tools: [
          { name: 'Audit en Temps Réel IA', status: 'Actif', endpoint: '/api/analytics/live' },
          { name: 'Générateur de Mots-Clés B2B Afrique & International', status: 'Actif', endpoint: '/api/keywords/generator' },
          { name: 'Workflow Automatisation WhatsApp', status: 'Actif', endpoint: '/api/whatsapp/workflow' }
        ],
        documentation_url: 'https://ttes-icg.com/docs/expertise-premium',
        support_contact: '+237 6 57 85 01 97'
      }
    });

  } catch (error) {
    console.error('Error fetching protected content:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération du contenu protégé.' });
  }
});

// ==========================================
// ADMIN ENDPOINTS
// ==========================================
router.use('/admin', authenticateToken);
router.use('/admin', requireAnyRole(['superadmin', 'admin']));

// GET /api/expertises/admin/requests - List all requests
router.get('/admin/requests', (req, res) => {
  try {
    const db = readDB();
    const requests = (db.expertise_activation_requests || []).sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    res.json({ requests });
  } catch (error) {
    console.error('Admin fetch requests error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des demandes.' });
  }
});

// GET /api/expertises/admin/clients - Clients with all individual expertises status
router.get('/admin/clients', (req, res) => {
  try {
    const db = readDB();
    const clients = (db.users || []).filter(u => u.role === 'client');
    const expertises = db.expertises || [];
    const clientExpertises = db.client_expertises || [];
    const requests = db.expertise_activation_requests || [];

    const overview = clients.map(c => {
      const userExps = expertises.map(exp => {
        const ceRecord = clientExpertises.find(
          ce => ce.client_id === c.id && ce.expertise_id === exp.id
        );
        const pendingReq = requests.find(
          r => r.client_id === c.id && r.expertise_id === exp.id && r.status === 'PENDING'
        );

        let status = 'INACTIVE';
        if (ceRecord && ceRecord.status === 'ACTIVE') {
          status = 'ACTIVE';
        } else if (pendingReq) {
          status = 'PENDING';
        }

        return {
          expertise_id: exp.id,
          expertise_title: exp.title,
          status,
          activated_at: ceRecord ? ceRecord.activated_at : null
        };
      });

      return {
        id: c.id,
        full_name: c.full_name,
        email: c.email,
        phone: c.phone,
        company: c.company,
        created_at: c.created_at,
        expertises: userExps
      };
    });

    res.json({ clients: overview });

  } catch (error) {
    console.error('Admin fetch clients error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des clients.' });
  }
});

// PATCH /api/expertises/admin/requests/:id/approve - Approve payment request
router.patch('/admin/requests/:id/approve', (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();

    const requestIndex = (db.expertise_activation_requests || []).findIndex(r => r.id === id);
    if (requestIndex === -1) {
      return res.status(404).json({ error: 'Demande introuvable.' });
    }

    const reqItem = db.expertise_activation_requests[requestIndex];

    reqItem.status = 'APPROVED';
    reqItem.admin_id = req.user.id;
    reqItem.updated_at = new Date().toISOString();
    reqItem.approved_at = new Date().toISOString();

    // Activate in client_expertises
    if (!db.client_expertises) db.client_expertises = [];
    const clientExpIndex = db.client_expertises.findIndex(
      ce => ce.client_id === reqItem.client_id && ce.expertise_id === reqItem.expertise_id
    );

    if (clientExpIndex !== -1) {
      db.client_expertises[clientExpIndex].status = 'ACTIVE';
      db.client_expertises[clientExpIndex].activated_at = new Date().toISOString();
      db.client_expertises[clientExpIndex].activated_by = req.user.id;
      db.client_expertises[clientExpIndex].updated_at = new Date().toISOString();
    } else {
      db.client_expertises.push({
        id: 'ce_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        client_id: reqItem.client_id,
        expertise_id: reqItem.expertise_id,
        expertise_name: reqItem.expertise_name,
        status: 'ACTIVE',
        activated_at: new Date().toISOString(),
        activated_by: req.user.id,
        deactivated_at: null,
        deactivated_by: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    // Create client notification
    if (!db.notifications) db.notifications = [];
    db.notifications.unshift({
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      user_id: reqItem.client_id,
      title: 'Expertise Activée !',
      message: `Votre expertise "${reqItem.expertise_name}" a été activée avec succès par l’administrateur.`,
      type: 'success',
      is_read: false,
      created_at: new Date().toISOString()
    });

    // Create audit log
    if (!db.expertise_history) db.expertise_history = [];
    db.expertise_history.unshift({
      id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      client_id: reqItem.client_id,
      client_name: reqItem.client_name,
      expertise_id: reqItem.expertise_id,
      expertise_name: reqItem.expertise_name,
      action: 'APPROVED',
      performed_by: req.user.id,
      performed_by_name: req.user.full_name,
      details: `Demande de ${reqItem.amount} ${reqItem.currency} approuvée et expertise activée.`,
      created_at: new Date().toISOString()
    });

    writeDB(db);

    res.json({
      message: `La demande de ${reqItem.client_name} a été approuvée et l’expertise est désormais activée.`,
      request: reqItem
    });

  } catch (error) {
    console.error('Admin approve request error:', error);
    res.status(500).json({ error: 'Erreur lors de l’approbation de la demande.' });
  }
});

// PATCH /api/expertises/admin/requests/:id/reject - Reject payment request
router.patch('/admin/requests/:id/reject', (req, res) => {
  try {
    const { id } = req.params;
    const { admin_note } = req.body;

    const db = readDB();
    const requestIndex = (db.expertise_activation_requests || []).findIndex(r => r.id === id);
    if (requestIndex === -1) {
      return res.status(404).json({ error: 'Demande introuvable.' });
    }

    const reqItem = db.expertise_activation_requests[requestIndex];

    reqItem.status = 'REJECTED';
    reqItem.admin_id = req.user.id;
    reqItem.admin_note = admin_note || 'Demande refusée par l’administration.';
    reqItem.updated_at = new Date().toISOString();

    // Create client notification
    if (!db.notifications) db.notifications = [];
    db.notifications.unshift({
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      user_id: reqItem.client_id,
      title: 'Demande d’expertise Refusée',
      message: `Votre demande d’activation de l’expertise "${reqItem.expertise_name}" a été refusée.${reqItem.admin_note ? ` Motif: ${reqItem.admin_note}` : ''}`,
      type: 'danger',
      is_read: false,
      created_at: new Date().toISOString()
    });

    // Audit log
    if (!db.expertise_history) db.expertise_history = [];
    db.expertise_history.unshift({
      id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      client_id: reqItem.client_id,
      client_name: reqItem.client_name,
      expertise_id: reqItem.expertise_id,
      expertise_name: reqItem.expertise_name,
      action: 'REJECTED',
      performed_by: req.user.id,
      performed_by_name: req.user.full_name,
      details: `Demande refusée. Note: ${reqItem.admin_note}`,
      created_at: new Date().toISOString()
    });

    writeDB(db);

    res.json({
      message: `La demande a été refusée.`,
      request: reqItem
    });

  } catch (error) {
    console.error('Admin reject request error:', error);
    res.status(500).json({ error: 'Erreur lors du refus de la demande.' });
  }
});

// PATCH /api/expertises/admin/client-expertise - Toggle client individual expertise
router.patch('/admin/client-expertise', (req, res) => {
  try {
    const { client_id, expertise_id, status, admin_note } = req.body;

    if (!client_id || !expertise_id || !['ACTIVE', 'INACTIVE'].includes(status)) {
      return res.status(400).json({ error: 'Données invalides (client_id, expertise_id, status ACTIVE|INACTIVE requis).' });
    }

    const db = readDB();
    const clientUser = (db.users || []).find(u => u.id === client_id);
    const expertise = (db.expertises || []).find(e => e.id === expertise_id);

    if (!clientUser || !expertise) {
      return res.status(404).json({ error: 'Client ou expertise introuvable.' });
    }

    if (!db.client_expertises) db.client_expertises = [];
    const clientExpIndex = db.client_expertises.findIndex(
      ce => ce.client_id === client_id && ce.expertise_id === expertise_id
    );

    const nowStr = new Date().toISOString();
    if (clientExpIndex !== -1) {
      db.client_expertises[clientExpIndex].status = status;
      db.client_expertises[clientExpIndex].updated_at = nowStr;
      if (status === 'ACTIVE') {
        db.client_expertises[clientExpIndex].activated_at = nowStr;
        db.client_expertises[clientExpIndex].activated_by = req.user.id;
      } else {
        db.client_expertises[clientExpIndex].deactivated_at = nowStr;
        db.client_expertises[clientExpIndex].deactivated_by = req.user.id;
      }
    } else {
      db.client_expertises.push({
        id: 'ce_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        client_id,
        expertise_id,
        expertise_name: expertise.title,
        status,
        activated_at: status === 'ACTIVE' ? nowStr : null,
        activated_by: status === 'ACTIVE' ? req.user.id : null,
        deactivated_at: status === 'INACTIVE' ? nowStr : null,
        deactivated_by: status === 'INACTIVE' ? req.user.id : null,
        created_at: nowStr,
        updated_at: nowStr
      });
    }

    // Client notification
    if (!db.notifications) db.notifications = [];
    const isActivating = status === 'ACTIVE';
    db.notifications.unshift({
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      user_id: client_id,
      title: isActivating ? 'Expertise Activée' : 'Expertise Désactivée',
      message: isActivating
        ? `Votre expertise "${expertise.title}" a été activée avec succès par l’administrateur.`
        : `L’expertise "${expertise.title}" a été désactivée par l’administrateur.${admin_note ? ` Note: ${admin_note}` : ''}`,
      type: isActivating ? 'success' : 'warning',
      is_read: false,
      created_at: nowStr
    });

    // Audit log
    if (!db.expertise_history) db.expertise_history = [];
    db.expertise_history.unshift({
      id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      client_id,
      client_name: clientUser.full_name,
      expertise_id,
      expertise_name: expertise.title,
      action: isActivating ? 'ACTIVATED' : 'DEACTIVATED',
      performed_by: req.user.id,
      performed_by_name: req.user.full_name,
      details: isActivating
        ? 'Expertise activée manuellement par l’administrateur.'
        : `Expertise désactivée / révoquée. ${admin_note ? `Note: ${admin_note}` : ''}`,
      created_at: nowStr
    });

    writeDB(db);

    res.json({
      message: `Statut de l’expertise "${expertise.title}" mis à jour avec succès (${status}) pour ${clientUser.full_name}.`
    });

  } catch (error) {
    console.error('Admin toggle client expertise error:', error);
    res.status(500).json({ error: 'Erreur lors du changement de statut.' });
  }
});

// GET /api/expertises/admin/history - Audit logs
router.get('/admin/history', (req, res) => {
  try {
    const db = readDB();
    const history = (db.expertise_history || []).sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    res.json({ history });
  } catch (error) {
    console.error('Admin fetch history error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l’historique.' });
  }
});

module.exports = router;
