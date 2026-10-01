import React, { useState, useEffect } from 'react';
import { X, Bell, CheckCheck, CheckCircle2, AlertTriangle, AlertCircle, Info, Clock } from 'lucide-react';
import { apiNotifications } from '../api/client';

export default function NotificationsModal({ isOpen, onClose, onNotificationsUpdated }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await apiNotifications.getMyNotifications();
      setNotifications(res.notifications || []);
      if (onNotificationsUpdated) {
        onNotificationsUpdated(res.unread_count || 0);
      }
    } catch (err) {
      console.error('Erreur chargement notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMarkRead = async (id) => {
    try {
      await apiNotifications.markRead(id);
      await fetchNotifications();
    } catch (err) {
      console.error('Erreur markRead:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiNotifications.markAllRead();
      await fetchNotifications();
    } catch (err) {
      console.error('Erreur markAllRead:', err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-card-lg"
        style={{ maxWidth: '620px', width: '90%', padding: '32px', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
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

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell size={24} color="var(--primary-cyan)" />
            <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', margin: 0 }}>
              Mes Notifications
            </h2>
          </div>

          {notifications.some(n => !n.is_read) && (
            <button
              onClick={handleMarkAllRead}
              className="btn btn-sm btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
            >
              <CheckCheck size={14} /> Tout marquer comme lu
            </button>
          )}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            Chargement des notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Vous n'avez aucune notification pour le moment.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
            {notifications.map(n => {
              let IconComp = Info;
              let colorClass = 'var(--primary-cyan)';
              let bgBorder = 'rgba(0, 240, 255, 0.15)';

              if (n.type === 'success') {
                IconComp = CheckCircle2;
                colorClass = 'var(--accent-emerald)';
                bgBorder = 'rgba(57, 217, 138, 0.15)';
              } else if (n.type === 'danger') {
                IconComp = AlertCircle;
                colorClass = 'var(--accent-rose)';
                bgBorder = 'rgba(244, 63, 94, 0.15)';
              } else if (n.type === 'warning') {
                IconComp = AlertTriangle;
                colorClass = '#FACC15';
                bgBorder = 'rgba(250, 204, 21, 0.15)';
              }

              return (
                <div
                  key={n.id}
                  onClick={() => !n.is_read && handleMarkRead(n.id)}
                  style={{
                    background: n.is_read ? 'rgba(15, 23, 42, 0.6)' : bgBorder,
                    border: `1px solid ${n.is_read ? 'rgba(255, 255, 255, 0.08)' : colorClass}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    cursor: n.is_read ? 'default' : 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', color: '#FFFFFF', fontSize: '0.95rem' }}>
                      <IconComp size={18} color={colorClass} />
                      {n.title}
                    </div>

                    {!n.is_read && (
                      <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                        Nouveau
                      </span>
                    )}
                  </div>

                  <p style={{ color: 'var(--text-main)', fontSize: '0.88rem', margin: '4px 0 8px 0', lineHeight: 1.5 }}>
                    {n.message}
                  </p>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    {new Date(n.created_at).toLocaleString('fr-FR')}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
