export const ADMIN_WHATSAPP_NUMBER = '237657850197';
export const ADMIN_WHATSAPP_DISPLAY = '+237 6 57 85 01 97';

export function buildAdminWhatsAppLink(message) {
  return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
