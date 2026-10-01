const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../config/database');
const { optionalToken, authenticateToken } = require('../middleware/auth');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/leads/quotes - Calculate & Save Quote Request
router.post('/quotes', optionalToken, (req, res) => {
  try {
    let {
      user_name,
      user_email,
      company,
      phone,
      monthly_budget,
      selected_services,
      notes
    } = req.body;

    user_name = user_name ? String(user_name).trim() : '';
    user_email = user_email ? String(user_email).trim().toLowerCase() : '';
    company = company ? String(company).trim() : '';
    phone = phone ? String(phone).trim() : '';
    notes = notes ? String(notes).trim() : '';

    if (!user_email || !monthly_budget || !selected_services || !Array.isArray(selected_services) || selected_services.length === 0) {
      return res.status(400).json({ error: 'Veuillez remplir les informations obligatoires (email, budget, au moins un service).' });
    }

    if (!EMAIL_REGEX.test(user_email)) {
      return res.status(400).json({ error: 'Adresse email invalide.' });
    }

    const budget = Number(monthly_budget);
    if (isNaN(budget) || budget <= 0) {
      return res.status(400).json({ error: 'Budget mensuel invalide.' });
    }

    const leadMultiplier = budget >= 3000000 ? 0.00015 : (budget >= 1000000 ? 0.00013 : 0.00011);
    const roiMultiplier = budget >= 3000000 ? 5.8 : (budget >= 1000000 ? 4.6 : 3.8);

    const estimatedLeads = Math.round(budget * leadMultiplier);
    const estimatedRevenue = Math.round(budget * roiMultiplier);
    const reachMin = Math.round(budget * 0.035);
    const reachMax = Math.round(budget * 0.095);

    const quoteId = 'qt_' + Date.now().toString().slice(-6);
    const newQuote = {
      id: quoteId,
      user_id: req.user ? req.user.id : null,
      user_name: user_name || (req.user ? req.user.full_name : 'Anonyme'),
      user_email: user_email || (req.user ? req.user.email : ''),
      company: company || (req.user ? req.user.company : ''),
      phone: phone || (req.user ? req.user.phone : ''),
      monthly_budget: budget,
      target_reach: `${reachMin.toLocaleString('fr-FR')} - ${reachMax.toLocaleString('fr-FR')} personnes`,
      selected_services: selected_services.map(s => String(s).trim()),
      estimated_leads: estimatedLeads,
      estimated_roi_multiplier: `${roiMultiplier}x`,
      estimated_revenue: estimatedRevenue,
      status: 'pending',
      notes,
      created_at: new Date().toISOString()
    };

    const db = readDB();
    db.quotes.unshift(newQuote);
    writeDB(db);

    res.status(201).json({
      message: 'Votre estimation de devis a été enregistrée avec succès !',
      quote: newQuote
    });

  } catch (error) {
    console.error('Error saving quote:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de l’enregistrement de votre estimation.' });
  }
});

// POST /api/leads/bookings - Schedule consultation booking
router.post('/bookings', optionalToken, (req, res) => {
  try {
    let {
      user_name,
      user_email,
      phone,
      company,
      date,
      time_slot,
      topic,
      notes
    } = req.body;

    user_name = user_name ? String(user_name).trim() : '';
    user_email = user_email ? String(user_email).trim().toLowerCase() : '';
    phone = phone ? String(phone).trim() : '';
    company = company ? String(company).trim() : '';
    date = date ? String(date).trim() : '';
    time_slot = time_slot ? String(time_slot).trim() : '';
    topic = topic ? String(topic).trim() : '';
    notes = notes ? String(notes).trim() : '';

    if (!user_name || !user_email || !date || !time_slot || !topic) {
      return res.status(400).json({ error: 'Veuillez renseigner votre nom, email, date, créneau horaire et sujet du rendez-vous.' });
    }

    if (!EMAIL_REGEX.test(user_email)) {
      return res.status(400).json({ error: 'Adresse email invalide.' });
    }

    const bookingId = 'bk_' + Date.now().toString().slice(-6);
    const newBooking = {
      id: bookingId,
      user_id: req.user ? req.user.id : null,
      user_name: user_name || (req.user ? req.user.full_name : ''),
      user_email: user_email || (req.user ? req.user.email : ''),
      phone: phone || (req.user ? req.user.phone : ''),
      company: company || (req.user ? req.user.company : ''),
      date,
      time_slot,
      topic,
      status: 'pending',
      notes,
      created_at: new Date().toISOString()
    };

    const db = readDB();
    db.bookings.unshift(newBooking);
    writeDB(db);

    res.status(201).json({
      message: 'Votre rendez-vous a été réservé avec succès ! Un expert TTES-ICG prendra contact avec vous.',
      booking: newBooking
    });

  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la prise de rendez-vous.' });
  }
});

// POST /api/leads/contacts - Contact form submission
router.post('/contacts', (req, res) => {
  try {
    let { name, email, phone, subject, message } = req.body;

    name = name ? String(name).trim() : '';
    email = email ? String(email).trim().toLowerCase() : '';
    phone = phone ? String(phone).trim() : '';
    subject = subject ? String(subject).trim() : 'Demande d’information';
    message = message ? String(message).trim() : '';

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Veuillez saisir votre nom, adresse email et votre message.' });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'Adresse email invalide.' });
    }

    const contactId = 'ct_' + Date.now().toString().slice(-6);
    const newContact = {
      id: contactId,
      name,
      email,
      phone,
      subject,
      message,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const db = readDB();
    db.contacts.unshift(newContact);
    writeDB(db);

    res.status(201).json({
      message: 'Votre message a été envoyé avec succès à l’équipe TTES-ICG !',
      contact: newContact
    });

  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de l’envoi du message.' });
  }
});

// GET /api/leads/my-leads
router.get('/my-leads', authenticateToken, (req, res) => {
  try {
    const db = readDB();
    const userEmail = req.user.email.toLowerCase();

    const userQuotes = db.quotes.filter(q => 
      (q.user_id && q.user_id === req.user.id) || 
      (q.user_email && q.user_email.toLowerCase() === userEmail)
    );

    const userBookings = db.bookings.filter(b => 
      (b.user_id && b.user_id === req.user.id) || 
      (b.user_email && b.user_email.toLowerCase() === userEmail)
    );

    res.json({
      quotes: userQuotes,
      bookings: userBookings
    });
  } catch (error) {
    console.error('Error fetching user leads:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de vos demandes.' });
  }
});

module.exports = router;
