import { ADMIN_WHATSAPP_NUMBER } from './contact';

export const EXPERTISE_PRICE = 200;
export const EXPERTISE_CURRENCY = 'FCFA';

export function buildExpertiseWhatsAppLink(expertiseTitle, userEmail) {
  const message = `Bonjour, je souhaite activer l’expertise ${expertiseTitle || 'sélectionnée'} pour ${EXPERTISE_PRICE} ${EXPERTISE_CURRENCY} sur TTES-ICG. Mon compte est associé à ${userEmail || '[EMAIL/IDENTIFIANT]'}.`;
  return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
