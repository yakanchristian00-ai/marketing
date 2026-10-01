const API_BASE = '';

function getAuthHeaders() {
  const token = localStorage.getItem('ttes_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Erreur lors de la communication avec le serveur.');
  }

  return data;
}

export const apiAuth = {
  login: (credentials) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  signup: (userData) => apiFetch('/api/auth/signup', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => apiFetch('/api/auth/me'),
  updateProfile: (profileData) => apiFetch('/api/auth/profile', { method: 'PATCH', body: JSON.stringify(profileData) })
};

export const apiServices = {
  getAll: () => apiFetch('/api/services')
};

export const apiPortfolio = {
  getAll: () => apiFetch('/api/portfolio')
};

export const apiProducts = {
  getAll: (category) => apiFetch(`/api/products${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  getById: (id) => apiFetch(`/api/products/${id}`),
  create: (productData) => apiFetch('/api/products', { method: 'POST', body: JSON.stringify(productData) }),
  update: (id, productData) => apiFetch(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(productData) }),
  deleteProduct: (id) => apiFetch(`/api/products/${id}`, { method: 'DELETE' }),
  submitOrder: (orderData) => apiFetch('/api/products/order', { method: 'POST', body: JSON.stringify(orderData) })
};

export const apiLeads = {
  submitQuote: (quoteData) => apiFetch('/api/leads/quotes', { method: 'POST', body: JSON.stringify(quoteData) }),
  submitBooking: (bookingData) => apiFetch('/api/leads/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),
  submitContact: (contactData) => apiFetch('/api/leads/contacts', { method: 'POST', body: JSON.stringify(contactData) }),
  getMyLeads: () => apiFetch('/api/leads/my-leads')
};

export const apiAdmin = {
  getStats: () => apiFetch('/api/admin/stats'),
  getLeads: () => apiFetch('/api/admin/leads'),
  updateLeadStatus: (type, id, status) => apiFetch(`/api/admin/leads/${type}/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  updateUserRole: (id, role) => apiFetch(`/api/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
  toggleBlockUser: (id, is_blocked) => apiFetch(`/api/admin/users/${id}/block`, { method: 'PATCH', body: JSON.stringify({ is_blocked }) }),
  deleteUser: (id) => apiFetch(`/api/admin/users/${id}`, { method: 'DELETE' }),
  deleteLead: (type, id) => apiFetch(`/api/admin/leads/${type}/${id}`, { method: 'DELETE' })
};

export const apiExpertises = {
  getAll: () => apiFetch('/api/expertises'),
  requestActivation: (expertise_id) => apiFetch('/api/expertises/request', { method: 'POST', body: JSON.stringify({ expertise_id }) }),
  getMyExpertises: () => apiFetch('/api/expertises/my-expertises'),
  getProtectedContent: (expertiseId) => apiFetch(`/api/expertises/protected-content/${expertiseId}`),
  // Admin
  getAdminRequests: () => apiFetch('/api/expertises/admin/requests'),
  getAdminClients: () => apiFetch('/api/expertises/admin/clients'),
  approveRequest: (id) => apiFetch(`/api/expertises/admin/requests/${id}/approve`, { method: 'PATCH' }),
  rejectRequest: (id, admin_note) => apiFetch(`/api/expertises/admin/requests/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ admin_note }) }),
  toggleClientExpertise: (data) => apiFetch('/api/expertises/admin/client-expertise', { method: 'PATCH', body: JSON.stringify(data) }),
  getAdminHistory: () => apiFetch('/api/expertises/admin/history')
};

export const apiNotifications = {
  getMyNotifications: () => apiFetch('/api/notifications/my-notifications'),
  markRead: (id) => apiFetch(`/api/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: () => apiFetch('/api/notifications/read-all', { method: 'PATCH' })
};
