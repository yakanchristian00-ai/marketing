const EXPERTISE_PRICE = 200;
const EXPERTISE_CURRENCY = 'FCFA';
const ADMIN_WHATSAPP_NUMBER = '237657850197';

const initialExpertises = [
  {
    id: 'exp_growth_ai',
    title: 'Expertise Simulateur de Devis & Calculateur ROI',
    badge: '200 FCFA',
    price: EXPERTISE_PRICE,
    currency: EXPERTISE_CURRENCY,
    description: 'Déblocage de l’accès au simulateur de devis interactif, calcul du ROI publicitaire et décomposition de l’entonnoir de conversion.',
    features: [
      'Simulateur de devis interactif et personnalisable',
      'Calculateur automatique de ROI et Chiffre d’Affaires',
      'Décomposition complète de l’entonnoir (Impressions, Clics, Leads)',
      'Transmission directe de propositions d’affaires à l’agence'
    ],
    icon: 'Calculator',
    category: 'Acquisition & Growth'
  },
  {
    id: 'exp_seo_master',
    title: 'Expertise Intelligence SEO & Mots-Clés Premium',
    badge: '200 FCFA',
    price: EXPERTISE_PRICE,
    currency: EXPERTISE_CURRENCY,
    description: 'Accès exclusif aux outils de recherche sémantique ciblés sur le marché africain et international.',
    features: [
      'Générateur de mots-clés à forte intention d’achat',
      'Analyse comparative de 5 concurrents directs',
      'Rapport d’opportunités SEO sous 48h',
      'Recommandations de contenu haute conversion'
    ],
    icon: 'Search',
    category: 'SEO & Performance'
  },
  {
    id: 'exp_whatsapp_lead',
    title: 'Expertise Lead Magnet WhatsApp Automation',
    badge: '200 FCFA',
    price: EXPERTISE_PRICE,
    currency: EXPERTISE_CURRENCY,
    description: 'Scripts de conversion et workflows d’automatisation des échanges clients sur WhatsApp.',
    features: [
      'Templates de scripts de relance à 78% de réponse',
      'Guide de configuration d’auto-répondeur intelligent',
      'Intégration directe avec vos formulaires de capture'
    ],
    icon: 'MessageCircle',
    category: 'Tech & Automation'
  }
];

module.exports = {
  EXPERTISE_PRICE,
  EXPERTISE_CURRENCY,
  ADMIN_WHATSAPP_NUMBER,
  initialExpertises
};
