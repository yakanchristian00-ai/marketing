const express = require('express');
const router = express.Router();
const { readDB } = require('../config/database');

// GET /api/portfolio - Retrieve portfolio case studies
router.get('/', (req, res) => {
  const db = readDB();
  res.json({ portfolio: db.portfolio || [] });
});

module.exports = router;
