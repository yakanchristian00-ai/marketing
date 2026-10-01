const express = require('express');
const router = express.Router();
const { readDB } = require('../config/database');

// GET /api/services - Retrieve agency services
router.get('/', (req, res) => {
  const db = readDB();
  res.json({ services: db.services || [] });
});

module.exports = router;
