import { initialDestinations } from '../data/destinations.js';

const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('khushi_owner_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

// ---------------- DESTINATIONS ----------------
export async function fetchDestinations(query = {}) {
  try {
    const params = new URLSearchParams(query);
    const res = await fetch(`${API_BASE}/destinations?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch destinations');
    return await res.json();
  } catch (err) {
    let list = [...initialDestinations];
    if (query.q) {
      const q = query.q.toLowerCase();
      list = list.filter(d => 
        d.name.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        (d.popularFor && d.popularFor.toLowerCase().includes(q))
      );
    }
    return list;
  }
}

// ---------------- BOOKINGS ----------------
export async function createBookingRequest(payload) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit booking');
  return data;
}

// ---------------- OWNER DASHBOARD ----------------
export async function ownerLogin(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function checkOwnerAuth() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Unauthorized');
  return await res.json();
}

export async function fetchOwnerBookings(filters = {}) {
  const params = new URLSearchParams(filters);
  const res = await fetch(`${API_BASE}/bookings?${params.toString()}`, {
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch bookings');
  return data;
}

export async function updateBookingStatus(id, status) {
  const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update status');
  return data;
}

export async function deleteBooking(id) {
  const res = await fetch(`${API_BASE}/bookings/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete record');
  return data;
}
