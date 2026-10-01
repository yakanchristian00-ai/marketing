const { readDB } = require('../config/database');

function hasActiveExpertise(clientId, expertiseId) {
  if (!clientId || !expertiseId) return false;
  const db = readDB();
  const clientExpertises = db.client_expertises || [];
  
  const record = clientExpertises.find(
    ce => ce.client_id === clientId && ce.expertise_id === expertiseId && ce.status === 'ACTIVE'
  );
  
  return Boolean(record);
}

function requireActiveExpertise(expertiseIdGetter) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentification requise.' });
    }

    const expertiseId = typeof expertiseIdGetter === 'function'
      ? expertiseIdGetter(req)
      : (req.params.expertiseId || req.body.expertiseId || expertiseIdGetter);

    if (!expertiseId) {
      return res.status(400).json({ error: 'Identifiant d’expertise requis.' });
    }

    if (!hasActiveExpertise(req.user.id, expertiseId)) {
      return res.status(403).json({
        error: 'Accès refusé. Cette fonctionnalité nécessite l’activation préalable de l’expertise payante (200 FCFA).'
      });
    }

    next();
  };
}

module.exports = {
  hasActiveExpertise,
  requireActiveExpertise
};
