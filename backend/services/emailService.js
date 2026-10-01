let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (err) {
  console.log('ℹ️ Nodemailer non installé, bascule en mode simulation d’email.');
}

// Configure Transporter with Environment Variables or Fallback Test Mode
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (nodemailer && host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  // Fallback Console Logger Mode when SMTP credentials are not yet configured
  return {
    sendMail: async (mailOptions) => {
      console.log(`====================================================`);
      console.log(`📧 [EMAIL SERVICE - MODE TEST/SIMULATION CONSOLE]`);
      console.log(`À: ${mailOptions.to}`);
      console.log(`Sujet: ${mailOptions.subject}`);
      console.log(`====================================================`);
      return { messageId: 'simulated_' + Date.now() };
    }
  };
}

const transporter = createTransporter();

/**
 * Envoie un email de bienvenue après inscription
 */
async function sendWelcomeEmail(toEmail, fullName) {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #07111F; color: #F5F7FA; padding: 40px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #00C8FF; margin: 0;">TTES-ICG</h1>
          <p style="color: #A7B0BD; font-size: 14px;">Ingénierie & Marketing de Performance</p>
        </div>
        
        <h2 style="color: #FFFFFF;">Bienvenue chez TTES-ICG, ${fullName} !</h2>
        <p style="color: #A7B0BD; line-height: 1.6;">
          Votre compte client a été créé avec succès. Vous pouvez désormais vous connecter à tout moment pour effectuer des simulations de devis ROI, réserver des consultations stratégiques offertes et accéder à nos produits numériques.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:5000" style="background-color: #00C8FF; color: #07111F; font-weight: bold; padding: 14px 28px; border-radius: 30px; text-decoration: none; display: inline-block;">
            Accéder à mon Espace Client
          </a>
        </div>

        <p style="color: #A7B0BD; font-size: 13px;">
          Une question ? Échangez directement avec notre équipe sur WhatsApp : <a href="https://wa.me/237677889900" style="color: #39D98A;">Discuter sur WhatsApp</a>
        </p>

        <hr style="border: none; border-top: 1px solid #183047; margin: 30px 0;" />
        <p style="color: #64748B; font-size: 12px; text-align: center;">
          © 2026 TTES-ICG Marketing & Consulting. Tous droits réservés.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"TTES-ICG Agence" <contact@ttes-icg.com>',
      to: toEmail,
      subject: '🚀 Bienvenue chez TTES-ICG - Votre Compte est Actif !',
      html: htmlContent
    });
  } catch (err) {
    console.error('Erreur envoi email bienvenue:', err);
  }
}

/**
 * Envoie une notification lors d'une nouvelle connexion (optionnel)
 */
async function sendLoginAlertEmail(toEmail, fullName) {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #07111F; color: #F5F7FA; padding: 30px; border-radius: 12px;">
        <h3 style="color: #00C8FF;">Alerte de Connexion TTES-ICG</h3>
        <p style="color: #A7B0BD;">Bonjour ${fullName}, une nouvelle connexion à votre compte a été détectée le ${new Date().toLocaleString('fr-FR')}.</p>
        <p style="color: #64748B; font-size: 12px;">Si vous n'êtes pas à l'origine de cette connexion, veuillez contacter le support immédiatement.</p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"TTES-ICG Sécurité" <security@ttes-icg.com>',
      to: toEmail,
      subject: '🔒 Nouvelle connexion détectée à votre compte TTES-ICG',
      html: htmlContent
    });
  } catch (err) {
    console.error('Erreur envoi email connexion:', err);
  }
}

module.exports = {
  sendWelcomeEmail,
  sendLoginAlertEmail
};
