const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDB, writeDB } = require('../config/database');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');
const { sendWelcomeEmail, sendLoginAlertEmail } = require('../services/emailService');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validatePasswordComplexity(password) {
  if (!password || password.length < 8) {
    return 'Le mot de passe doit contenir au moins 8 caractères.';
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigitOrSpecial = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  if (!hasLetter || !hasDigitOrSpecial) {
    return 'Le mot de passe doit contenir au moins une lettre et au moins un chiffre ou caractère spécial.';
  }
  return null;
}

// POST /api/auth/signup - Register account & Send Welcome Email
router.post('/signup', async (req, res) => {
  try {
    let { full_name, email, password, company, phone } = req.body;

    full_name = full_name ? String(full_name).trim() : '';
    email = email ? String(email).trim().toLowerCase() : '';
    password = password ? String(password).trim() : '';
    company = company ? String(company).trim() : '';
    phone = phone ? String(phone).trim() : '';

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'Veuillez remplir tous les champs obligatoires (nom, email, mot de passe).' });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'Adresse email invalide.' });
    }

    const passwordError = validatePasswordComplexity(password);
    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }

    const db = readDB();
    const existingUser = db.users.find(u => u.email.toLowerCase() === email);

    if (existingUser) {
      return res.status(409).json({ error: 'Un compte avec cette adresse email existe déjà.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const newUser = {
      id: userId,
      email,
      password_hash,
      full_name,
      role: 'client',
      company,
      phone,
      is_blocked: false,
      created_at: new Date().toISOString()
    };

    db.users.push(newUser);
    writeDB(db);

    // Trigger Welcome Email (Async, non-blocking)
    sendWelcomeEmail(newUser.email, newUser.full_name);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Compte créé avec succès ! Un email de bienvenue vous a été transmis.',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
        company: newUser.company,
        phone: newUser.phone,
        is_blocked: false
      }
    });

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la création de compte.' });
  }
});

// POST /api/auth/login - Log in user
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email ? String(email).trim().toLowerCase() : '';
    password = password ? String(password).trim() : '';

    if (!email || !password) {
      return res.status(400).json({ error: 'Veuillez saisir votre email et votre mot de passe.' });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'Adresse email invalide.' });
    }

    const db = readDB();
    const user = db.users.find(u => u.email.toLowerCase() === email);

    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    if (user.is_blocked) {
      return res.status(403).json({ error: 'Votre compte a été suspendu par l’administration TTES-ICG. Veuillez contacter le support.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie !',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        company: user.company,
        phone: user.phone,
        is_blocked: Boolean(user.is_blocked)
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la connexion.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'Utilisateur introuvable.' });
  }

  if (user.is_blocked) {
    return res.status(403).json({ error: 'Votre compte a été suspendu par l’administration TTES-ICG.' });
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      company: user.company,
      phone: user.phone,
      is_blocked: Boolean(user.is_blocked)
    }
  });
});

// PATCH /api/auth/profile
router.patch('/profile', authenticateToken, (req, res) => {
  let { full_name, company, phone } = req.body;
  const db = readDB();
  const userIndex = db.users.findIndex(u => u.id === req.user.id);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Utilisateur introuvable.' });
  }

  if (db.users[userIndex].is_blocked) {
    return res.status(403).json({ error: 'Votre compte a été suspendu.' });
  }

  if (full_name) db.users[userIndex].full_name = String(full_name).trim();
  if (company !== undefined) db.users[userIndex].company = String(company).trim();
  if (phone !== undefined) db.users[userIndex].phone = String(phone).trim();

  writeDB(db);

  res.json({
    message: 'Profil mis à jour avec succès.',
    user: {
      id: db.users[userIndex].id,
      email: db.users[userIndex].email,
      full_name: db.users[userIndex].full_name,
      role: db.users[userIndex].role,
      company: db.users[userIndex].company,
      phone: db.users[userIndex].phone,
      is_blocked: Boolean(db.users[userIndex].is_blocked)
    }
  });
});

module.exports = router;
