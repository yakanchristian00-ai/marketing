const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./config/database');

const authRoutes = require('./routes/auth');
const servicesRoutes = require('./routes/services');
const portfolioRoutes = require('./routes/portfolio');
const productsRoutes = require('./routes/products');
const leadsRoutes = require('./routes/leads');
const adminRoutes = require('./routes/admin');
const expertisesRoutes = require('./routes/expertises');
const notificationsRoutes = require('./routes/notifications');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/expertises', expertisesRoutes);
app.use('/api/notifications', notificationsRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'TTES-ICG Marketing & Products API',
    timestamp: new Date().toISOString()
  });
});

const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
const fs = require('fs');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 TTES-ICG Fullstack Server sur le port ${PORT}`);
  console.log(`🌐 Web App: http://localhost:${PORT}`);
  console.log(`🔑 Admin Access: admin@ttes-icg.com / Admin123!`);
  console.log(`====================================================`);
});
