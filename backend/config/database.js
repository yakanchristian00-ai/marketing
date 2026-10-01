const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const initialProducts = [
  {
    id: 'prod_101',
    title: 'Pack Growth Accelerator B2B',
    category: 'Kits Marketing',
    badge: 'Best-Seller',
    price: 450000,
    original_price: 650000,
    rating: 4.9,
    reviews_count: 38,
    description: 'Le kit ultime pour les entreprises B2B : 50+ templates de prospection LinkedIn, cold emails à haut taux de réponse, scripts de conversion et tunnels de prospection prêts à l’emploi.',
    features: [
      '50+ Modèles d’emails à fort taux d’ouverture (>65%)',
      'Script de qualification des rendez-vous B2B',
      'Workflow d’automatisation Make & CRM',
      'Accès à la communauté privée TTES-ICG Growth'
    ],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    type: 'digital_pack'
  },
  {
    id: 'prod_102',
    title: 'Formation Masterclass Google Ads & SEO 2026',
    category: 'Formations',
    badge: 'Certification',
    price: 250000,
    original_price: 350000,
    rating: 5.0,
    reviews_count: 52,
    description: 'Formation vidéo complète de 15h sur l’optimisation des campagnes Google Search, Display, YouTube Ads et les stratégies SEO avancées adaptées au marché africain et international.',
    features: [
      '15 heures de cours vidéo HD en accès à vie',
      'Études de cas réelles de campagnes à +500% ROI',
      'Templates d’audit SEO & Mots-clés offerts',
      'Certificat de réussite officiel TTES-ICG Academy'
    ],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    type: 'course'
  },
  {
    id: 'prod_103',
    title: 'E-Book Stratégique : SEO & Acquisition en Afrique',
    category: 'E-books',
    badge: 'Incontournable',
    price: 35000,
    original_price: 60000,
    rating: 4.8,
    reviews_count: 94,
    description: 'Guide pratique de 180 pages révélant les règles méconnues du référencement et des habitudes d’achat numérique en Afrique Francophone.',
    features: [
      '180 pages illustrées avec exemples locaux',
      'Analyse des comportements d’achat Mobile & WhatsApp',
      'Checklist SEO technique clé en main'
    ],
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    type: 'ebook'
  },
  {
    id: 'prod_104',
    title: 'Dashboard Notion & Excel ROI Marketing',
    category: 'Templates',
    badge: 'Pratique',
    price: 45000,
    original_price: 75000,
    rating: 4.9,
    reviews_count: 27,
    description: 'Système de suivi en temps réel de votre budget marketing, du coût par prospect (CPL), du coût d’acquisition client (CAC) et de l’attribution de vos ventes.',
    features: [
      'Dashboard Notion interactif & modèle Excel automatisé',
      'Calcul automatique du ROI par canal publicitaire',
      'Guide vidéo d’installation en 5 minutes'
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    type: 'template'
  },
  {
    id: 'prod_105',
    title: 'Kit Social Media All-in-One (365 Jours de Contenu)',
    category: 'Templates',
    badge: 'Gain de Temps',
    price: 180000,
    original_price: 300000,
    rating: 4.9,
    reviews_count: 64,
    description: 'Un an de stratégie de contenu prête à publier : 365 idées de posts, 100+ templates Canva modifiables, scripts de Reels et carrousels engageants.',
    features: [
      '365 Idées de publications par secteur',
      '120 Modèles Canva haute qualité',
      'Planning éditorial pré-rempli'
    ],
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    type: 'template'
  },
  {
    id: 'prod_106',
    title: 'Logiciel WhatsApp Automation & Lead Connect',
    category: 'Logiciels',
    badge: 'Exclusif',
    price: 350000,
    original_price: 500000,
    rating: 5.0,
    reviews_count: 41,
    description: 'Outil d’automatisation des relances WhatsApp pour transformer vos prospects indécis en clients payants sans spamming.',
    features: [
      'Relances automatiques personnalisées',
      'Intégration directe avec vos formulaires web',
      'Support technique et mises à jour incluses'
    ],
    image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=800&q=80',
    type: 'software'
  }
];

const initialData = {
  users: [],
  services: [
    {
      id: 'srv_1',
      title: 'Stratégie Digitale & Growth Hacking',
      category: 'Strategie',
      badge: 'Populaire',
      price_starting: 750000,
      description: 'Audit à 360°, positionnement de marque, tunnels de conversion à haut rendement et campagnes d’acquisition accélérée.',
      features: [
        'Audit stratégique concurrentiel complet',
        'Tunnels de vente personnalisés',
        'Growth hacking multi-canaux',
        'Rapports mensuels de performance & ROI'
      ],
      icon: 'Rocket'
    },
    {
      id: 'srv_2',
      title: 'SEO, SEA & Google Ads Performance',
      category: 'Acquisition',
      badge: 'Recommandé',
      price_starting: 500000,
      description: 'Dominance des moteurs de recherche avec optimisation sémantique avancée et campagnes PPC ultra-ciblées.',
      features: [
        'Optimisation SEO Technique & Netlinking',
        'Gestion complète Google Ads & Search',
        'Ciblage de mots-clés à haute intention',
        'Conversion Rate Optimization (CRO)'
      ],
      icon: 'Search'
    },
    {
      id: 'srv_3',
      title: 'Branding & Design d’Expérience (UX/UI)',
      category: 'Design',
      badge: 'Premium',
      price_starting: 600000,
      description: 'Création d’identités visuelles mémorables, chartes graphiques d’élite et interfaces utilisateur captivantes.',
      features: [
        'Logo & Charte graphique complète',
        'Design UI/UX d’applications et sites web',
        'Supports de communication haute définition',
        'Brand Guidelines & Asset System'
      ],
      icon: 'Palette'
    },
    {
      id: 'srv_4',
      title: 'Social Media Management & Content Production',
      category: 'Contenu',
      badge: 'Engageant',
      price_starting: 450000,
      description: 'Animation de communauté, production de vidéos courtes (Reels/TikTok), copywriting persuasif et Meta Ads.',
      features: [
        'Calendrier éditorial hebdomadaire',
        'Production vidéo et graphismes originaux',
        'Social Ads ciblées Meta & LinkedIn',
        'Modération et engagement de la communauté'
      ],
      icon: 'Share2'
    },
    {
      id: 'srv_5',
      title: 'Développement Web & Landing Pages Haute Conversion',
      category: 'Tech',
      badge: 'Incontournable',
      price_starting: 850000,
      description: 'Conception de sites vitrines et plateformes web ultra-rapides, adaptées au mobile et optimisées pour la capture de prospects.',
      features: [
        'Architecture modern React / Web app',
        'Vitesse de chargement optimale (<1s)',
        'Intégration CRM & formulaires intelligents',
        'Sécurité SSL & hébergement sécurisé'
      ],
      icon: 'Code'
    },
    {
      id: 'srv_6',
      title: 'Analytics, Data Intelligence & Consulting ROI',
      category: 'Data',
      badge: 'Sur Mesure',
      price_starting: 400000,
      description: 'Mise en place de dashboards de pilotage en temps réel, attribution des conversions et conseil stratégique aux dirigeants.',
      features: [
        'Tableaux de bord personnalisés',
        'Tracking événementiel avancé (GA4 / Tag Manager)',
        'Audit d’efficacité des dépenses publicitaires',
        'Coaching trimestriel pour équipes internes'
      ],
      icon: 'BarChart3'
    }
  ],
  portfolio: [
    {
      id: 'port_1',
      client_name: 'AfriqPay FinTech',
      category: 'Acquisition & SEO',
      growth_metric: '+340% de conversion',
      sub_metric: '180 000+ nouveaux utilisateurs qualifiés',
      description: 'Déploiement d’une stratégie Google Ads & SEO multi-pays couplée à une refonte ergonomique des landing pages.',
      tags: ['Google Ads', 'SEO', 'Fintech'],
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'port_2',
      client_name: 'Krysto Luxury Real Estate',
      category: 'Branding & Social Ads',
      growth_metric: '4.8M € de ventes générées',
      sub_metric: 'ROI Marketing de 12.5x',
      description: 'Campagne de branding ultra-premium et ciblage précis des investisseurs haute valeur sur LinkedIn & Meta.',
      tags: ['Branding', 'Social Ads', 'Immobilier'],
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'port_3',
      client_name: 'BTP Logistique Central',
      category: 'Inbound & Web Development',
      growth_metric: '+210% de leads B2B',
      sub_metric: 'Coût par prospect réduit de 45%',
      description: 'Refonte globale du portail web et automatisation du tunnel de qualification des devis industriels.',
      tags: ['Web Dev', 'Inbound', 'B2B'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'port_4',
      client_name: 'BioSanté Nature',
      category: 'Growth & Content Creation',
      growth_metric: '+500k de portée sociale',
      sub_metric: 'Engagement multiplié par 6',
      description: 'Production quotidienne de vidéos courtes et stratégie d’influenceurs santé en Afrique de l’Ouest et Centrale.',
      tags: ['Content', 'TikTok', 'Growth'],
      image: 'https://images.unsplash.com/photo-1542744094-3a3121699563?auto=format&fit=crop&w=800&q=80'
    }
  ],
  products: initialProducts,
  orders: [
    {
      id: 'ord_5001',
      product_id: 'prod_101',
      product_title: 'Pack Growth Accelerator B2B',
      price: 450000,
      customer_name: 'David Mbarga',
      customer_email: 'd.mbarga@corpinvest.cm',
      customer_phone: '+237 6 77 88 99 00',
      company: 'CorpInvest Cameroun',
      status: 'completed',
      created_at: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ],
  quotes: [
    {
      id: 'qt_1001',
      user_id: 'usr_client_1',
      user_name: 'Jean Dupont',
      user_email: 'client@example.com',
      company: 'InnovTech Sarl',
      monthly_budget: 1500000,
      target_reach: '50,000 - 150,000 personnes',
      selected_services: ['Stratégie Digitale & Growth Hacking', 'SEO, SEA & Google Ads Performance'],
      estimated_leads: 180,
      estimated_roi_multiplier: '4.5x',
      estimated_revenue: 6750000,
      status: 'pending',
      notes: 'Besoin d’un lancement accéléré d’ici le mois prochain.',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ],
  bookings: [
    {
      id: 'bk_2001',
      user_id: 'usr_client_1',
      user_name: 'Jean Dupont',
      user_email: 'client@example.com',
      phone: '+237 6 77 88 99 00',
      company: 'InnovTech Sarl',
      date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      time_slot: '14:00 - 14:45',
      topic: 'Audit Stratégique & Inbound Marketing',
      status: 'confirmed',
      notes: 'Session d’alignement par visioconférence.',
      created_at: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ],
  contacts: [
    {
      id: 'ct_3001',
      name: 'Marie Claire Nguema',
      email: 'mc.nguema@globalcorporate.cm',
      phone: '+237 6 99 11 22 33',
      subject: 'Demande de partenariat annuel',
      message: 'Bonjour l’équipe TTES-ICG, nous souhaiterions confier la gestion complète de nos réseaux sociaux à votre agence.',
      status: 'pending',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ]
};

const { initialExpertises } = require('./expertises');

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDB(initialData);
      return initialData;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(data);
    if (!parsed.products) parsed.products = initialProducts;
    if (!parsed.orders) parsed.orders = initialData.orders || [];
    if (!parsed.expertises) parsed.expertises = initialExpertises;
    if (!parsed.expertise_activation_requests) parsed.expertise_activation_requests = [];
    if (!parsed.client_expertises) parsed.client_expertises = [];
    if (!parsed.notifications) parsed.notifications = [];
    if (!parsed.expertise_history) parsed.expertise_history = [];
    return parsed;
  } catch (error) {
    console.error('Error reading database file:', error);
    return initialData;
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to database file:', error);
  }
}

function initDatabase() {
  const db = readDB();
  
  const superadminPasswordHash = bcrypt.hashSync('SuperAdmin123!', 10);
  const adminPasswordHash = bcrypt.hashSync('Admin123!', 10);
  const clientPasswordHash = bcrypt.hashSync('Client123!', 10);

  let updated = false;

  // Check Superadmin
  const existingSuperadmin = db.users.find(u => u.email === 'superadmin@ttes-icg.com');
  if (!existingSuperadmin) {
    db.users.unshift({
      id: 'usr_superadmin_1',
      email: 'superadmin@ttes-icg.com',
      password_hash: superadminPasswordHash,
      full_name: 'SuperAdmin TTES-ICG (Direction)',
      role: 'superadmin',
      company: 'TTES-ICG High Direction',
      phone: '+237 6 00 00 00 00',
      created_at: new Date().toISOString()
    });
    updated = true;
  } else {
    existingSuperadmin.role = 'superadmin';
    existingSuperadmin.password_hash = superadminPasswordHash;
    updated = true;
  }

  // Check Admin
  const existingAdmin = db.users.find(u => u.email === 'admin@ttes-icg.com');
  if (!existingAdmin) {
    db.users.push({
      id: 'usr_admin_1',
      email: 'admin@ttes-icg.com',
      password_hash: adminPasswordHash,
      full_name: 'Administrateur TTES-ICG',
      role: 'admin',
      company: 'TTES-ICG Marketing Agency',
      phone: '+237 6 57 85 01 97',
      created_at: new Date().toISOString()
    });
    updated = true;
  } else {
    existingAdmin.role = 'admin';
    existingAdmin.password_hash = adminPasswordHash;
    updated = true;
  }

  // Check Client
  const existingClient = db.users.find(u => u.email === 'client@example.com');
  if (!existingClient) {
    db.users.push({
      id: 'usr_client_1',
      email: 'client@example.com',
      password_hash: clientPasswordHash,
      full_name: 'Jean Dupont',
      role: 'client',
      company: 'InnovTech Sarl',
      phone: '+237 6 77 88 99 00',
      created_at: new Date().toISOString()
    });
    updated = true;
  }

  if (updated) {
    writeDB(db);
  }

  console.log('✅ Base de données TTES-ICG initialisée avec gestion des rôles Superadmin, Admin & Client.');
  console.log('👑 SuperAdmin: superadmin@ttes-icg.com | Pass: SuperAdmin123!');
  console.log('🛡️ Admin: admin@ttes-icg.com | Pass: Admin123!');
  console.log('👤 Client: client@example.com | Pass: Client123!');
}

initDatabase();

module.exports = {
  readDB,
  writeDB,
  initDatabase
};
