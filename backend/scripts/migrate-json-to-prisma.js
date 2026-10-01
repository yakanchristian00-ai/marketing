const fs = require('fs');
const path = require('path');
const prisma = require('../config/prisma');

async function migrate() {
  const jsonPath = path.join(__dirname, '..', 'data', 'db.json');
  if (!fs.existsSync(jsonPath)) {
    console.log('❌ Aucun fichier db.json trouvé dans backend/data/db.json');
    return;
  }

  const raw = fs.readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(raw);

  console.log('🚀 Début de la migration des données vers la base PostgreSQL...');

  // 1. Users
  console.log(`👤 Migration de ${(data.users || []).length} utilisateurs...`);
  for (const u of data.users || []) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        full_name: u.full_name,
        role: u.role || 'client',
        company: u.company || '',
        phone: u.phone || '',
        is_blocked: Boolean(u.is_blocked)
      },
      create: {
        id: u.id,
        email: u.email,
        password_hash: u.password_hash,
        full_name: u.full_name,
        role: u.role || 'client',
        company: u.company || '',
        phone: u.phone || '',
        is_blocked: Boolean(u.is_blocked),
        created_at: u.created_at ? new Date(u.created_at) : new Date()
      }
    });
  }

  // 2. Expertises
  console.log(`💎 Migration de ${(data.expertises || []).length} expertises...`);
  for (const exp of data.expertises || []) {
    await prisma.expertise.upsert({
      where: { id: exp.id },
      update: {
        title: exp.title,
        price: exp.price || 200,
        currency: exp.currency || 'FCFA',
        description: exp.description,
        features: exp.features || [],
        icon: exp.icon || 'Sparkles',
        category: exp.category || 'Général'
      },
      create: {
        id: exp.id,
        title: exp.title,
        badge: exp.badge || '200 FCFA',
        price: exp.price || 200,
        currency: exp.currency || 'FCFA',
        description: exp.description,
        features: exp.features || [],
        icon: exp.icon || 'Sparkles',
        category: exp.category || 'Général',
        created_at: new Date()
      }
    });
  }

  // 3. Client Expertises
  console.log(`🔗 Migration de ${(data.client_expertises || []).length} liaisons client_expertises...`);
  for (const ce of data.client_expertises || []) {
    try {
      await prisma.clientExpertise.upsert({
        where: {
          client_id_expertise_id: {
            client_id: ce.client_id,
            expertise_id: ce.expertise_id
          }
        },
        update: {
          status: ce.status || 'INACTIVE',
          activated_at: ce.activated_at ? new Date(ce.activated_at) : null,
          deactivated_at: ce.deactivated_at ? new Date(ce.deactivated_at) : null
        },
        create: {
          id: ce.id || undefined,
          client_id: ce.client_id,
          expertise_id: ce.expertise_id,
          expertise_name: ce.expertise_name || 'Expertise',
          status: ce.status || 'INACTIVE',
          activated_at: ce.activated_at ? new Date(ce.activated_at) : null,
          activated_by: ce.activated_by || null,
          deactivated_at: ce.deactivated_at ? new Date(ce.deactivated_at) : null,
          deactivated_by: ce.deactivated_by || null,
          created_at: ce.created_at ? new Date(ce.created_at) : new Date()
        }
      });
    } catch (err) {
      console.warn(`Avertissement liaison client ${ce.client_id}:`, err.message);
    }
  }

  // 4. Requests
  console.log(`📋 Migration de ${(data.expertise_activation_requests || []).length} demandes d’activation...`);
  for (const r of data.expertise_activation_requests || []) {
    try {
      await prisma.expertiseActivationRequest.create({
        data: {
          id: r.id,
          client_id: r.client_id,
          client_name: r.client_name,
          client_email: r.client_email,
          client_phone: r.client_phone || '',
          expertise_id: r.expertise_id,
          expertise_name: r.expertise_name,
          amount: r.amount || 200,
          currency: r.currency || 'FCFA',
          status: r.status || 'PENDING',
          admin_id: r.admin_id || null,
          admin_note: r.admin_note || '',
          created_at: r.created_at ? new Date(r.created_at) : new Date(),
          approved_at: r.approved_at ? new Date(r.approved_at) : null
        }
      });
    } catch (err) {
      // Ignore if already exists
    }
  }

  // 5. Quotes
  console.log(`📊 Migration de ${(data.quotes || []).length} devis...`);
  for (const q of data.quotes || []) {
    try {
      await prisma.quote.create({
        data: {
          id: q.id,
          user_id: q.user_id || null,
          user_name: q.user_name || 'Prospect',
          user_email: q.user_email || 'email@example.com',
          company: q.company || '',
          phone: q.phone || '',
          monthly_budget: Number(q.monthly_budget) || 0,
          selected_services: q.selected_services || [],
          estimated_leads: Number(q.estimated_leads) || 0,
          estimated_roi_multiplier: String(q.estimated_roi_multiplier || '1.0x'),
          estimated_revenue: Number(q.estimated_revenue) || 0,
          status: q.status || 'pending',
          notes: q.notes || '',
          created_at: q.created_at ? new Date(q.created_at) : new Date()
        }
      });
    } catch (err) {
      // Ignore duplicate
    }
  }

  // 6. Bookings
  console.log(`📅 Migration de ${(data.bookings || []).length} rendez-vous...`);
  for (const b of data.bookings || []) {
    try {
      await prisma.booking.create({
        data: {
          id: b.id,
          user_id: b.user_id || null,
          user_name: b.user_name || '',
          user_email: b.user_email || '',
          phone: b.phone || '',
          company: b.company || '',
          date: b.date || '',
          time_slot: b.time_slot || '',
          topic: b.topic || '',
          status: b.status || 'confirmed',
          notes: b.notes || '',
          created_at: b.created_at ? new Date(b.created_at) : new Date()
        }
      });
    } catch (err) {
      // Ignore duplicate
    }
  }

  // 7. Orders
  console.log(`🛍️ Migration de ${(data.orders || []).length} commandes...`);
  for (const ord of data.orders || []) {
    try {
      await prisma.order.create({
        data: {
          id: ord.id,
          product_id: ord.product_id,
          product_title: ord.product_title,
          price: ord.price || 0,
          customer_name: ord.customer_name,
          customer_email: ord.customer_email,
          customer_phone: ord.customer_phone || '',
          company: ord.company || '',
          status: ord.status || 'completed',
          created_at: ord.created_at ? new Date(ord.created_at) : new Date()
        }
      });
    } catch (err) {
      // Ignore duplicate
    }
  }

  // 8. Notifications
  console.log(`🔔 Migration de ${(data.notifications || []).length} notifications...`);
  for (const notif of data.notifications || []) {
    try {
      await prisma.notification.create({
        data: {
          id: notif.id,
          user_id: notif.user_id,
          title: notif.title,
          message: notif.message,
          type: notif.type || 'info',
          is_read: Boolean(notif.is_read),
          created_at: notif.created_at ? new Date(notif.created_at) : new Date()
        }
      });
    } catch (err) {
      // Ignore duplicate
    }
  }

  console.log('✅✅ TOUTES LES DONNÉES ONT ÉTÉ MIGRÉES AVEC SUCCÈS DANS POSTGRESQL !');
}

migrate()
  .catch((e) => {
    console.error('Erreur migration:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
