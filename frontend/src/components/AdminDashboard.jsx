import React, { useState, useEffect } from 'react';
import { apiAdmin, apiProducts, apiExpertises } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { X, ShieldCheck, Crown, Users, Calculator, Calendar, Mail, CheckCircle2, Clock, Trash2, Search, RefreshCw, ShoppingBag, PlusCircle, Edit, DollarSign, Lock, Unlock, MessageCircle, Phone, Sparkles, Check, XCircle, History } from 'lucide-react';
import AddProductModal from './AddProductModal';

export default function AdminDashboard({ isOpen, onClose }) {
  const { user, isAdmin, isSuperAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('expertises'); // 'expertises' | 'quotes' | 'orders' | 'products' | 'bookings' | 'contacts' | 'users'
  const [stats, setStats] = useState(null);
  const [leadsData, setLeadsData] = useState({ quotes: [], bookings: [], contacts: [], orders: [], products: [], users: [] });
  
  // Expertises Admin States
  const [expertiseRequests, setExpertiseRequests] = useState([]);
  const [expertiseClients, setExpertiseClients] = useState([]);
  const [expertiseHistory, setExpertiseHistory] = useState([]);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  const [loading, setLoading] = useState(true);

  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, leadsRes, reqsRes, clientsRes, histRes] = await Promise.all([
        apiAdmin.getStats(),
        apiAdmin.getLeads(),
        apiExpertises.getAdminRequests().catch(() => ({ requests: [] })),
        apiExpertises.getAdminClients().catch(() => ({ clients: [] })),
        apiExpertises.getAdminHistory().catch(() => ({ history: [] }))
      ]);

      setStats(statsRes.stats);
      setLeadsData(leadsRes);
      setExpertiseRequests(reqsRes.requests || []);
      setExpertiseClients(clientsRes.clients || []);
      setExpertiseHistory(histRes.history || []);
    } catch (err) {
      console.error('Erreur chargement données admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAdmin) {
      fetchAdminData();
    }
  }, [isOpen, isAdmin]);

  if (!isOpen || !isAdmin) return null;

  const handleUpdateStatus = async (type, id, newStatus) => {
    try {
      await apiAdmin.updateLeadStatus(type, id, newStatus);
      await fetchAdminData();
    } catch (err) {
      alert('Erreur mise à jour statut: ' + err.message);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    if (!isSuperAdmin) {
      alert('Seul le Superadmin peut modifier les rôles d’utilisateurs.');
      return;
    }
    try {
      await apiAdmin.updateUserRole(userId, newRole);
      await fetchAdminData();
    } catch (err) {
      alert('Erreur modification de rôle: ' + err.message);
    }
  };

  const handleToggleBlockUser = async (userId, currentBlockedState) => {
    if (!isSuperAdmin) {
      alert('Seul le Superadmin peut bloquer ou débloquer des comptes utilisateurs.');
      return;
    }
    const actionText = currentBlockedState ? 'débloquer' : 'suspendre / bloquer';
    if (!window.confirm(`Voulez-vous vraiment ${actionText} cet utilisateur ?`)) return;

    try {
      await apiAdmin.toggleBlockUser(userId, !currentBlockedState);
      await fetchAdminData();
    } catch (err) {
      alert('Erreur lors de la modification du statut: ' + err.message);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!isSuperAdmin) {
      alert('Seul le Superadmin peut supprimer un utilisateur.');
      return;
    }
    if (!window.confirm(`⚠️ Voulez-vous supprimer définitivement le compte de ${userName} ? Cette action est irréversible.`)) return;

    try {
      await apiAdmin.deleteUser(userId);
      await fetchAdminData();
    } catch (err) {
      alert('Erreur lors de la suppression de l’utilisateur: ' + err.message);
    }
  };

  const handleDeleteItem = async (type, id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet élément ?')) return;
    try {
      if (type === 'products') {
        await apiProducts.deleteProduct(id);
      } else {
        await apiAdmin.deleteLead(type, id);
      }
      await fetchAdminData();
    } catch (err) {
      alert('Erreur suppression: ' + err.message);
    }
  };

  // Expertise Actions
  const handleApproveExpertiseRequest = async (requestId, clientName, expTitle) => {
    if (!window.confirm(`Confirmer la réception du paiement de 200 FCFA et activer "${expTitle}" pour ${clientName} ?`)) return;
    try {
      const res = await apiExpertises.approveRequest(requestId);
      alert(res.message);
      await fetchAdminData();
    } catch (err) {
      alert('Erreur lors de la validation: ' + err.message);
    }
  };

  const handleRejectExpertiseRequest = async (requestId, clientName) => {
    const reason = window.prompt(`Motif du refus de la demande pour ${clientName} (optionnel) :`, 'Paiement non reçu sur WhatsApp.');
    if (reason === null) return;
    try {
      const res = await apiExpertises.rejectRequest(requestId, reason);
      alert(res.message);
      await fetchAdminData();
    } catch (err) {
      alert('Erreur lors du refus: ' + err.message);
    }
  };

  const handleToggleIndividualExpertise = async (clientId, expId, expTitle, currentStatus) => {
    const isCurrentlyActive = currentStatus === 'ACTIVE';
    const nextStatus = isCurrentlyActive ? 'INACTIVE' : 'ACTIVE';
    const actionText = isCurrentlyActive ? 'désactiver / révoquer' : 'activer';

    let adminNote = '';
    if (isCurrentlyActive) {
      const noteInput = window.prompt(`Motif de la désactivation/révocation de "${expTitle}" (optionnel) :`);
      if (noteInput === null) return;
      adminNote = noteInput;
    } else {
      if (!window.confirm(`Activer manuellement l'expertise "${expTitle}" pour ce client ?`)) return;
    }

    try {
      const res = await apiExpertises.toggleClientExpertise({
        client_id: clientId,
        expertise_id: expId,
        status: nextStatus,
        admin_note: adminNote
      });
      alert(res.message);
      await fetchAdminData();
    } catch (err) {
      alert('Erreur lors du changement de statut: ' + err.message);
    }
  };

  const openWhatsAppClient = (phone, text) => {
    if (!phone) {
      alert('Aucun numéro de téléphone renseigné pour ce client.');
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, '_blank');
  };

  const filteredClients = expertiseClients.filter(c => 
    c.full_name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    (c.phone && c.phone.includes(clientSearchTerm))
  );

  const filteredUsers = (leadsData.users || []).filter(u =>
    u.full_name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    (u.phone && u.phone.includes(userSearchTerm)) ||
    (u.company && u.company.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
    (u.role && u.role.toLowerCase().includes(userSearchTerm.toLowerCase()))
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card-lg" style={{ maxWidth: '1180px', width: '95%', padding: '36px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--text-muted)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Dashboard Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isSuperAdmin ? (
                <Crown size={28} color="#FACC15" />
              ) : (
                <ShieldCheck size={28} color="var(--primary-cyan)" />
              )}
              <h2 style={{ fontSize: '1.8rem' }} className="text-gradient">
                {isSuperAdmin ? 'Panneau de Gestion SuperAdmin (Direction)' : 'Panneau d’Administration TTES-ICG'}
              </h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
              Connecté en tant que <strong>{user.full_name}</strong> ({user.email}) • Rôle :{' '}
              <span className={`badge ${isSuperAdmin ? 'badge-purple' : 'badge-cyan'}`} style={{ color: isSuperAdmin ? '#FACC15' : undefined }}>
                {user.role}
              </span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                setEditingProduct(null);
                setAddProductModalOpen(true);
              }}
              className="btn btn-sm btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <PlusCircle size={16} /> Ajouter un Produit
            </button>

            <button
              onClick={fetchAdminData}
              className="btn btn-sm btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={14} /> Actualiser
            </button>
          </div>
        </div>

        {/* Overview Stats Cards Grid */}
        {stats && (
          <div className="grid-4" style={{ gap: '16px', marginBottom: '32px' }}>
            <div style={{ background: '#0B1726', border: '1px solid var(--border-glass)', padding: '18px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Demandes Expertises (200 FCFA)</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--primary-cyan)', fontFamily: 'var(--font-heading)' }}>
                {expertiseRequests.length} demandes
              </div>
            </div>

            <div style={{ background: '#0B1726', border: '1px solid var(--border-glass)', padding: '18px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Commandes Produits</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#C084FC', fontFamily: 'var(--font-heading)' }}>
                {stats.totalOrders} ({stats.productSalesRevenue.toLocaleString('fr-FR')} FCFA)
              </div>
            </div>

            <div style={{ background: '#0B1726', border: '1px solid var(--border-glass)', padding: '18px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Produits en Vente</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent-emerald)', fontFamily: 'var(--font-heading)' }}>
                {stats.totalProducts} articles
              </div>
            </div>

            <div style={{ background: '#0B1726', border: '1px solid var(--border-glass)', padding: '18px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Pipeline Estimé</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#F43F5E', fontFamily: 'var(--font-heading)', marginTop: '6px' }}>
                {stats.estimatedPipelineRevenue.toLocaleString('fr-FR')} FCFA
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('expertises')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: activeTab === 'expertises' ? '1px solid var(--primary-cyan)' : '1px solid transparent',
              background: activeTab === 'expertises' ? 'rgba(0, 200, 255, 0.2)' : 'transparent',
              color: activeTab === 'expertises' ? 'var(--primary-cyan)' : 'var(--text-muted)',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            💎 Expertises & Paiements 200 FCFA ({expertiseRequests.filter(r => r.status === 'PENDING').length} en attente)
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: activeTab === 'quotes' ? '1px solid var(--primary-cyan)' : '1px solid transparent',
              background: activeTab === 'quotes' ? 'rgba(0, 200, 255, 0.15)' : 'transparent',
              color: activeTab === 'quotes' ? 'var(--primary-cyan)' : 'var(--text-muted)',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            📋 Devis ({leadsData.quotes.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: activeTab === 'orders' ? '1px solid #C084FC' : '1px solid transparent',
              background: activeTab === 'orders' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
              color: activeTab === 'orders' ? '#C084FC' : 'var(--text-muted)',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            🛍️ Commandes ({(leadsData.orders || []).length})
          </button>

          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: activeTab === 'products' ? '1px solid var(--accent-emerald)' : '1px solid transparent',
              background: activeTab === 'products' ? 'rgba(57, 217, 138, 0.15)' : 'transparent',
              color: activeTab === 'products' ? 'var(--accent-emerald)' : 'var(--text-muted)',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            📦 Catalogue Produits ({(leadsData.products || []).length})
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: activeTab === 'bookings' ? '1px solid #18E0D0' : '1px solid transparent',
              background: activeTab === 'bookings' ? 'rgba(24, 224, 208, 0.15)' : 'transparent',
              color: activeTab === 'bookings' ? '#18E0D0' : 'var(--text-muted)',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            📅 Rendez-vous ({leadsData.bookings.length})
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: activeTab === 'contacts' ? '1px solid #F43F5E' : '1px solid transparent',
              background: activeTab === 'contacts' ? 'rgba(244, 63, 94, 0.15)' : 'transparent',
              color: activeTab === 'contacts' ? '#F43F5E' : 'var(--text-muted)',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            ✉️ Messages ({leadsData.contacts.length})
          </button>

          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: activeTab === 'users' ? '1px solid #FACC15' : '1px solid transparent',
              background: activeTab === 'users' ? 'rgba(234, 179, 8, 0.15)' : 'transparent',
              color: activeTab === 'users' ? '#FACC15' : 'var(--text-muted)',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            👥 Gestion Utilisateurs ({leadsData.users.length}) {isSuperAdmin && '👑'}
          </button>
        </div>

        {/* Content Area */}
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Chargement des données administrateur...
          </div>
        ) : (
          <div>
            
            {/* ---------------------------------------------------------------- */}
            {/* EXPERTISES & PAIEMENTS 200 FCFA TAB */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'expertises' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* 1. TABLEAU DE SUIVI DES DEMANDES EN ATTENTE ET TRAITÉES */}
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={20} color="var(--primary-cyan)" />
                    Tableau de Suivi des Demandes d’Activation (Montant : 200 FCFA)
                  </h3>

                  {expertiseRequests.length === 0 ? (
                    <div style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.6)', border: '1px dashed rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)', borderRadius: 'var(--radius-md)' }}>
                      Aucune demande d’activation enregistrée pour l’instant.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {expertiseRequests.map(r => (
                        <div
                          key={r.id}
                          style={{
                            background: '#0B1726',
                            border: r.status === 'PENDING'
                              ? '1px solid #FACC15'
                              : r.status === 'APPROVED'
                              ? '1px solid var(--accent-emerald)'
                              : '1px solid var(--border-glass)',
                            borderRadius: 'var(--radius-md)',
                            padding: '20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '16px'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontWeight: '800', color: '#FFFFFF', fontSize: '1.05rem' }}>{r.client_name}</span>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({r.client_email})</span>
                              <span className="badge badge-purple">{r.amount} {r.currency}</span>
                            </div>

                            <div style={{ fontSize: '0.9rem', color: 'var(--primary-cyan)', marginTop: '4px', fontWeight: '700' }}>
                              Expertise Demandée : {r.expertise_name}
                            </div>

                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                              📅 Demande du {new Date(r.created_at).toLocaleString('fr-FR')} {r.approved_at ? `• Validée le ${new Date(r.approved_at).toLocaleString('fr-FR')}` : ''}
                            </div>
                            {r.admin_note && (
                              <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', marginTop: '4px' }}>
                                Note Admin: {r.admin_note}
                              </div>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            {/* WhatsApp Direct Contact Button */}
                            <button
                              onClick={() => openWhatsAppClient(r.client_phone, `Bonjour ${r.client_name}, l’équipe TTES-ICG vous contacte concernant votre demande d’activation de l’expertise "${r.expertise_name}" pour ${r.amount} ${r.currency}.`)}
                              className="btn btn-sm"
                              style={{ background: 'rgba(37, 211, 102, 0.15)', border: '1px solid #25D366', color: '#25D366', fontWeight: '700' }}
                              title="Contacter le client directement sur WhatsApp pour vérifier le paiement"
                            >
                              <MessageCircle size={15} /> WhatsApp Client
                            </button>

                            {/* Status Badge */}
                            <span className={`badge ${r.status === 'APPROVED' ? 'badge-emerald' : r.status === 'PENDING' ? 'badge-purple' : 'badge-rose'}`} style={{ background: r.status === 'PENDING' ? 'rgba(250, 204, 21, 0.15)' : undefined, color: r.status === 'PENDING' ? '#FACC15' : undefined }}>
                              {r.status === 'APPROVED' ? '✓ Approuvé & Activé' : r.status === 'PENDING' ? '⏳ En Attente' : '❌ Refusé'}
                            </span>

                            {/* Admin Action Buttons */}
                            {r.status === 'PENDING' && (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  onClick={() => handleApproveExpertiseRequest(r.id, r.client_name, r.expertise_name)}
                                  className="btn btn-sm btn-emerald"
                                  style={{ fontWeight: '700' }}
                                >
                                  <Check size={15} /> Activer
                                </button>

                                <button
                                  onClick={() => handleRejectExpertiseRequest(r.id, r.client_name)}
                                  className="btn btn-sm"
                                  style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid var(--accent-rose)', color: 'var(--accent-rose)', fontWeight: '700' }}
                                >
                                  <XCircle size={15} /> Refuser
                                </button>
                              </div>
                            )}

                            {r.status === 'APPROVED' && (
                              <button
                                onClick={() => handleToggleIndividualExpertise(r.client_id, r.expertise_id, r.expertise_name, 'ACTIVE')}
                                className="btn btn-sm"
                                style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid var(--accent-rose)', color: 'var(--accent-rose)', fontWeight: '700' }}
                              >
                                Révoquer / Désactiver
                              </button>
                            )}
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. RECHERCHE & GESTION INDIVIDUELLE DES CLIENTS (Client ↔ Expertise) */}
                <div style={{ background: '#0B1726', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={20} color="#FACC15" />
                        Activation / Désactivation Individuelle par Client
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
                        Chaque activation est stricte à un couple (client_id + expertise_id) sans impacter les autres clients.
                      </p>
                    </div>

                    <div style={{ position: 'relative', width: '280px' }}>
                      <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        placeholder="Rechercher un client (Nom, email)..."
                        value={clientSearchTerm}
                        onChange={(e) => setClientSearchTerm(e.target.value)}
                        className="form-control"
                        style={{ paddingLeft: '36px', padding: '8px 12px 8px 36px', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredClients.map(c => (
                      <div key={c.id} style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <div>
                            <strong style={{ color: '#FFFFFF', fontSize: '1rem' }}>{c.full_name}</strong>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '10px' }}>({c.email})</span>
                            {c.phone && <span style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)', marginLeft: '10px' }}>📞 {c.phone}</span>}
                          </div>

                          {c.phone && (
                            <button
                              onClick={() => openWhatsAppClient(c.phone, `Bonjour ${c.full_name}, l’équipe TTES-ICG vous contacte.`)}
                              className="btn btn-sm"
                              style={{ background: 'rgba(37, 211, 102, 0.15)', border: '1px solid #25D366', color: '#25D366', padding: '4px 10px', fontSize: '0.78rem' }}
                            >
                              <MessageCircle size={14} /> Contacter
                            </button>
                          )}
                        </div>

                        {/* List of Expertises for this client */}
                        <div className="grid-3" style={{ gap: '12px' }}>
                          {c.expertises.map(exp => {
                            const isActive = exp.status === 'ACTIVE';
                            const isPending = exp.status === 'PENDING';

                            return (
                              <div
                                key={exp.expertise_id}
                                style={{
                                  background: isActive ? 'rgba(57, 217, 138, 0.1)' : 'rgba(0, 0, 0, 0.3)',
                                  border: `1px solid ${isActive ? 'var(--accent-emerald)' : 'rgba(255, 255, 255, 0.1)'}`,
                                  borderRadius: '6px',
                                  padding: '12px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                  gap: '10px'
                                }}
                              >
                                <div>
                                  <div style={{ fontWeight: '700', color: '#FFFFFF', fontSize: '0.88rem' }}>
                                    {exp.expertise_title}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', marginTop: '4px', color: isActive ? 'var(--accent-emerald)' : isPending ? '#FACC15' : 'var(--text-dim)' }}>
                                    Statut: {isActive ? '[✓] Activée' : isPending ? '[⏳] Demande en attente' : '[ ] Désactivée'}
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleToggleIndividualExpertise(c.id, exp.expertise_id, exp.expertise_title, exp.status)}
                                  className={`btn btn-sm ${isActive ? 'btn-outline' : 'btn-emerald'}`}
                                  style={{
                                    fontSize: '0.75rem',
                                    padding: '4px 10px',
                                    borderColor: isActive ? 'var(--accent-rose)' : undefined,
                                    color: isActive ? 'var(--accent-rose)' : undefined
                                  }}
                                >
                                  {isActive ? 'Révoquer' : 'Activer'}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. HISTORIQUE D'AUDIT DES MODIFICATIONS */}
                <div style={{ background: '#0B1726', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <History size={20} color="#C084FC" />
                    Historique d’Audit des Modifications
                  </h3>

                  {expertiseHistory.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Aucun enregistrement d’historique.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
                      {expertiseHistory.map(h => (
                        <div key={h.id} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '6px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                          <div>
                            <span style={{ fontWeight: '700', color: '#FFFFFF' }}>{h.client_name}</span> • <span style={{ color: 'var(--primary-cyan)' }}>{h.expertise_name}</span>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '2px' }}>
                              Action: <strong>{h.action}</strong> • Par: {h.performed_by_name || 'Admin'} • Details: {h.details}
                            </div>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            {new Date(h.created_at).toLocaleString('fr-FR')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {leadsData.bookings.map(b => (
                  <div key={b.id} style={{ background: '#0B1726', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ fontWeight: '800', color: '#FFFFFF', fontSize: '1.05rem' }}>{b.topic}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Client: <strong>{b.user_name}</strong> ({b.user_email}) {b.phone ? `• 📞 ${b.phone}` : ''}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)', marginTop: '4px', fontWeight: '700' }}>
                        📅 Date: {b.date} à {b.time_slot}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {b.phone && (
                        <button
                          onClick={() => openWhatsAppClient(b.phone, `Bonjour ${b.user_name}, l’équipe TTES-ICG vous contacte concernant votre rendez-vous du ${b.date} à ${b.time_slot} (${b.topic}).`)}
                          className="btn btn-sm"
                          style={{ background: 'rgba(37, 211, 102, 0.15)', border: '1px solid #25D366', color: '#25D366', fontWeight: '700' }}
                          title="Contacter ce client directement sur WhatsApp"
                        >
                          <MessageCircle size={15} /> WhatsApp
                        </button>
                      )}

                      <select
                        value={b.status}
                        onChange={(e) => handleUpdateStatus('bookings', b.id, e.target.value)}
                        className="form-select"
                        style={{ padding: '6px 12px', fontSize: '0.82rem', width: 'auto' }}
                      >
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmé</option>
                        <option value="completed">Terminé</option>
                        <option value="cancelled">Annulé</option>
                      </select>

                      <button
                        onClick={() => handleDeleteItem('bookings', b.id)}
                        style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid var(--accent-rose)', color: 'var(--accent-rose)', borderRadius: '6px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* QUOTES TAB */}
            {activeTab === 'quotes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {leadsData.quotes.map(q => (
                  <div key={q.id} style={{ background: '#0B1726', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: '800', color: '#FFFFFF' }}>{q.user_name}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({q.user_email})</span>
                        {q.phone && <span style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)' }}>📞 {q.phone}</span>}
                      </div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--primary-cyan)', marginTop: '6px', fontWeight: '700' }}>
                        Budget: {Number(q.monthly_budget).toLocaleString('fr-FR')} FCFA • ROI Est: {q.estimated_roi_multiplier} (~{q.estimated_leads} leads)
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {q.phone && (
                        <button
                          onClick={() => openWhatsAppClient(q.phone, `Bonjour ${q.user_name}, l’équipe TTES-ICG fait suite à votre simulation de devis (Réf: ${q.id}, Budget: ${Number(q.monthly_budget).toLocaleString('fr-FR')} FCFA).`)}
                          className="btn btn-sm"
                          style={{ background: 'rgba(37, 211, 102, 0.15)', border: '1px solid #25D366', color: '#25D366', fontWeight: '700' }}
                          title="Contacter ce client directement sur WhatsApp"
                        >
                          <MessageCircle size={15} /> WhatsApp
                        </button>
                      )}

                      <select
                        value={q.status}
                        onChange={(e) => handleUpdateStatus('quotes', q.id, e.target.value)}
                        className="form-select"
                        style={{ padding: '6px 12px', fontSize: '0.82rem', width: 'auto' }}
                      >
                        <option value="pending">En attente</option>
                        <option value="contacted">Contacté</option>
                        <option value="completed">Validé / Signé</option>
                        <option value="cancelled">Annulé</option>
                      </select>

                      <button
                        onClick={() => handleDeleteItem('quotes', q.id)}
                        style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid var(--accent-rose)', color: 'var(--accent-rose)', borderRadius: '6px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {(leadsData.orders || []).map(ord => (
                  <div key={ord.id} style={{ background: '#0B1726', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: '800', color: '#FFFFFF', fontSize: '1.05rem' }}>{ord.product_title}</span>
                        <span className="badge badge-purple">{Number(ord.price).toLocaleString('fr-FR')} FCFA</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Acheteur: <strong>{ord.customer_name}</strong> ({ord.customer_email}) • 📞 {ord.customer_phone}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {ord.customer_phone && (
                        <button
                          onClick={() => openWhatsAppClient(ord.customer_phone, `Bonjour ${ord.customer_name}, l’équipe TTES-ICG vous contacte concernant votre commande du produit "${ord.product_title}" (Réf: ${ord.id}).`)}
                          className="btn btn-sm"
                          style={{ background: 'rgba(37, 211, 102, 0.15)', border: '1px solid #25D366', color: '#25D366', fontWeight: '700' }}
                          title="Envoyer l'accès ou contacter sur WhatsApp"
                        >
                          <MessageCircle size={15} /> WhatsApp
                        </button>
                      )}

                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus('orders', ord.id, e.target.value)}
                        className="form-select"
                        style={{ padding: '6px 12px', fontSize: '0.82rem', width: 'auto' }}
                      >
                        <option value="pending">En attente</option>
                        <option value="completed">Livré / Transmis</option>
                        <option value="cancelled">Annulé</option>
                      </select>

                      <button
                        onClick={() => handleDeleteItem('orders', ord.id)}
                        style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid var(--accent-rose)', color: 'var(--accent-rose)', borderRadius: '6px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CONTACTS TAB */}
            {activeTab === 'contacts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {leadsData.contacts.map(c => (
                  <div key={c.id} style={{ background: '#0B1726', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <span style={{ fontWeight: '800', color: '#FFFFFF' }}>{c.name}</span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: '8px' }}>({c.email})</span>
                        {c.phone && <span style={{ fontSize: '0.82rem', color: 'var(--primary-cyan)', marginLeft: '8px' }}>📞 {c.phone}</span>}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {c.phone && (
                          <button
                            onClick={() => openWhatsAppClient(c.phone, `Bonjour ${c.name}, l’équipe TTES-ICG fait suite à votre message concernant "${c.subject}".`)}
                            className="btn btn-sm"
                            style={{ background: 'rgba(37, 211, 102, 0.15)', border: '1px solid #25D366', color: '#25D366', fontWeight: '700' }}
                            title="Répondre sur WhatsApp"
                          >
                            <MessageCircle size={15} /> WhatsApp
                          </button>
                        )}

                        <select
                          value={c.status}
                          onChange={(e) => handleUpdateStatus('contacts', c.id, e.target.value)}
                          className="form-select"
                          style={{ padding: '4px 10px', fontSize: '0.78rem', width: 'auto' }}
                        >
                          <option value="pending">En attente</option>
                          <option value="contacted">Répondu</option>
                          <option value="closed">Fermé</option>
                        </select>

                        <button
                          onClick={() => handleDeleteItem('contacts', c.id)}
                          style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid var(--accent-rose)', color: 'var(--accent-rose)', borderRadius: '6px', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div style={{ fontWeight: '600', color: 'var(--primary-cyan)', fontSize: '0.9rem', marginBottom: '6px' }}>
                      Sujet: {c.subject}
                    </div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', background: 'rgba(0, 0, 0, 0.2)', padding: '10px', borderRadius: '6px' }}>
                      "{c.message}"
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', background: '#0B1726', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users size={20} color="#FACC15" />
                      Gestion des Utilisateurs ({filteredUsers.length} / {(leadsData.users || []).length})
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
                      Recherchez et localisez rapidement les utilisateurs par nom, email, téléphone, entreprise ou rôle.
                    </p>
                  </div>

                  <div style={{ position: 'relative', width: '320px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Rechercher par nom, email, tél, rôle..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="form-control"
                      style={{ paddingLeft: '36px', padding: '8px 12px 8px 36px', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                {filteredUsers.length === 0 ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', background: '#0B1726', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-glass)' }}>
                    Aucun utilisateur ne correspond à votre recherche "{userSearchTerm}".
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredUsers.map(u => (
                      <div key={u.id} style={{ background: '#0B1726', border: u.is_blocked ? '1px solid var(--accent-rose)' : '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                        <div>
                          <div style={{ fontWeight: '800', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {u.full_name}
                            {u.role === 'superadmin' && <Crown size={16} color="#FACC15" />}
                            {u.is_blocked && (
                              <span className="badge" style={{ background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', border: '1px solid var(--accent-rose)' }}>
                                ⛔ Compte Suspendu / Bloqué
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {u.email} {u.phone ? `• 📞 ${u.phone}` : ''} {u.company ? `• 🏢 ${u.company}` : ''}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {u.phone && (
                            <button
                              onClick={() => openWhatsAppClient(u.phone, `Bonjour ${u.full_name}, l’équipe TTES-ICG vous contacte.`)}
                              className="btn btn-sm"
                              style={{ background: 'rgba(37, 211, 102, 0.15)', border: '1px solid #25D366', color: '#25D366', fontWeight: '700' }}
                              title="Contacter sur WhatsApp"
                            >
                              <MessageCircle size={15} /> WhatsApp
                            </button>
                          )}

                          {isSuperAdmin ? (
                            <select
                              value={u.role}
                              onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                              className="form-select"
                              style={{ padding: '6px 12px', fontSize: '0.82rem', width: 'auto' }}
                            >
                              <option value="client">👤 client</option>
                              <option value="admin">🛡️ admin</option>
                              <option value="superadmin">👑 superadmin</option>
                            </select>
                          ) : (
                            <span className={`badge ${u.role === 'superadmin' ? 'badge-purple' : u.role === 'admin' ? 'badge-cyan' : 'badge-emerald'}`}>
                              {u.role}
                            </span>
                          )}

                          {isSuperAdmin && u.id !== user.id && (
                            <button
                              onClick={() => handleToggleBlockUser(u.id, u.is_blocked)}
                              style={{
                                padding: '6px 14px',
                                borderRadius: 'var(--radius-sm)',
                                border: u.is_blocked ? '1px solid var(--accent-emerald)' : '1px solid var(--accent-rose)',
                                background: u.is_blocked ? 'rgba(57, 217, 138, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                                color: u.is_blocked ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                                fontWeight: '700',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                              title={u.is_blocked ? 'Débloquer cet utilisateur' : 'Bloquer / Suspendre cet utilisateur'}
                            >
                              {u.is_blocked ? <Unlock size={14} /> : <Lock size={14} />}
                              {u.is_blocked ? 'Débloquer' : 'Bloquer'}
                            </button>
                          )}

                          {isSuperAdmin && u.id !== user.id && (
                            <button
                              onClick={() => handleDeleteUser(u.id, u.full_name)}
                              style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid var(--accent-rose)', color: 'var(--accent-rose)', borderRadius: '6px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                              title="Supprimer définitivement l'utilisateur"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {(leadsData.products || []).map(p => (
                  <div key={p.id} style={{ background: '#0B1726', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src={p.image} alt={p.title} style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: '800', color: '#FFFFFF', fontSize: '1rem' }}>{p.title}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)', fontWeight: '700', marginTop: '2px' }}>
                          {Number(p.price).toLocaleString('fr-FR')} FCFA • Catégorie: {p.category}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setAddProductModalOpen(true);
                        }}
                        style={{ background: 'rgba(0, 200, 255, 0.1)', border: '1px solid var(--primary-cyan)', color: 'var(--primary-cyan)', borderRadius: '6px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        title="Modifier le produit"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteItem('products', p.id)}
                        style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid var(--accent-rose)', color: 'var(--accent-rose)', borderRadius: '6px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        title="Supprimer du catalogue"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* Add / Edit Product Modal */}
        <AddProductModal
          isOpen={addProductModalOpen}
          onClose={() => setAddProductModalOpen(false)}
          editProduct={editingProduct}
          onProductSaved={fetchAdminData}
        />

      </div>
    </div>
  );
}
