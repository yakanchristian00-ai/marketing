const jwt = require('jsonwebtoken');
const { readDB } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'ttes_icg_secret_key_2026_super_secure_marketing_token';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Accès refusé. Jeton d’authentification manquant.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Jeton invalide ou expiré. Veuillez vous re-connecter.' });
    }

    const db = readDB();
    const user = db.users.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      company: user.company,
      phone: user.phone
    };

    next();
  });
}

function optionalToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      req.user = null;
    } else {
      const db = readDB();
      const user = db.users.find(u => u.id === decoded.id);
      req.user = user ? {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        company: user.company,
        phone: user.phone
      } : null;
    }
    next();
  });
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentification requise.' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ error: `Accès réservé aux utilisateurs disposant du rôle : ${role}.` });
    }

    next();
  };
}

function requireAnyRole(roles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentification requise.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Accès refusé. Privilèges insuffisants.` });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  optionalToken,
  requireRole,
  requireAnyRole,
  JWT_SECRET
};
