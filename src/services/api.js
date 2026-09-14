import { initialDestinations } from '../data/destinations.js';
import { initialVehicles } from '../data/vehicles.js';
import { initialPackages } from '../data/packages.js';
import { initialPickupLocations } from '../data/pickupLocations.js';

const API_BASE = '/api';

// Helper for auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('khushi_admin_token');
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
    console.warn('Using local fallback for destinations:', err.message);
    let filtered = [...initialDestinations];
    if (query.q) {
      const q = query.q.toLowerCase();
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.city.toLowerCase().includes(q) || 
        d.state.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q)
      );
    }
    if (query.type && query.type !== 'All') {
      filtered = filtered.filter(d => d.type === query.type);
    }
    return filtered;
  }
}

export async function fetchDestinationById(id) {
  try {
    const res = await fetch(`${API_BASE}/destinations/${id}`);
    if (!res.ok) throw new Error('Destination not found');
    return await res.json();
  } catch (err) {
    return initialDestinations.find(d => d.id === id) || null;
  }
}

// ---------------- VEHICLES ----------------
export async function fetchVehicles(all = false) {
  try {
    const res = await fetch(`${API_BASE}/vehicles${all ? '?all=true' : ''}`);
    if (!res.ok) throw new Error('Failed to fetch vehicles');
    return await res.json();
  } catch (err) {
    console.warn('Using local fallback for vehicles');
    return initialVehicles;
  }
}

// ---------------- TOUR PACKAGES ----------------
export async function fetchPackages(all = false) {
  try {
    const res = await fetch(`${API_BASE}/packages${all ? '?all=true' : ''}`);
    if (!res.ok) throw new Error('Failed to fetch packages');
    return await res.json();
  } catch (err) {
    console.warn('Using local fallback for packages');
    return initialPackages;
  }
}

// ---------------- PICKUP LOCATIONS ----------------
export async function fetchPickupLocations() {
  try {
    const res = await fetch(`${API_BASE}/pickup-locations`);
    if (!res.ok) throw new Error('Failed to fetch pickup locations');
    return await res.json();
  } catch (err) {
    console.warn('Using local fallback for pickup locations');
    return initialPickupLocations;
  }
}

// ---------------- REVIEWS ----------------
export async function fetchReviews() {
  try {
    const res = await fetch(`${API_BASE}/reviews`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function submitReview(reviewData) {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit review');
  return data;
}

// ---------------- BOOKINGS ----------------
export async function createBooking(bookingData) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create booking');
  return data;
}

export async function trackBooking(bookingId, phone) {
  const res = await fetch(`${API_BASE}/bookings/track?bookingId=${encodeURIComponent(bookingId)}&phone=${encodeURIComponent(phone)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Booking lookup failed');
  return data;
}

export async function fetchBookingById(idOrBookingId) {
  const res = await fetch(`${API_BASE}/bookings/${idOrBookingId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Booking not found');
  return data;
}

// ---------------- ADMIN API ----------------
export async function adminLogin(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Admin login failed');
  return data;
}

export async function checkAdminAuth() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Unauthorized');
  return await res.json();
}

export async function fetchAdminBookings(filters = {}) {
  const params = new URLSearchParams(filters);
  const res = await fetch(`${API_BASE}/bookings?${params.toString()}`, {
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch bookings');
  return data;
}

export async function updateBookingStatus(id, updatePayload) {
  const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(updatePayload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update status');
  return data;
}

export async function updateBookingDetails(id, updatedFields) {
  const res = await fetch(`${API_BASE}/bookings/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(updatedFields)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update booking');
  return data;
}

export async function deleteBooking(id) {
  const res = await fetch(`${API_BASE}/bookings/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete booking');
  return data;
}

export async function fetchAdminAnalytics() {
  const res = await fetch(`${API_BASE}/analytics`, {
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load analytics');
  return data;
}

export async function fetchSmsLogs() {
  const res = await fetch(`${API_BASE}/sms-logs`, {
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load SMS logs');
  return data;
}

export async function testSmsDispatch(phone, message) {
  const res = await fetch(`${API_BASE}/sms-logs/test-dispatch`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ phone, message })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to test SMS');
  return data;
}

// Vehicle Admin
export async function saveVehicle(vehicleData, isEdit = false) {
  const url = isEdit ? `${API_BASE}/vehicles/${vehicleData.id}` : `${API_BASE}/vehicles`;
  const method = isEdit ? 'PUT' : 'POST';
  const res = await fetch(url, {
    method,
    headers: getAuthHeaders(),
    body: JSON.stringify(vehicleData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to save vehicle');
  return data;
}

export async function deleteVehicle(id) {
  const res = await fetch(`${API_BASE}/vehicles/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete vehicle');
  return data;
}

// Package Admin
export async function savePackage(packageData, isEdit = false) {
  const url = isEdit ? `${API_BASE}/packages/${packageData.id}` : `${API_BASE}/packages`;
  const method = isEdit ? 'PUT' : 'POST';
  const res = await fetch(url, {
    method,
    headers: getAuthHeaders(),
    body: JSON.stringify(packageData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to save package');
  return data;
}

export async function deletePackage(id) {
  const res = await fetch(`${API_BASE}/packages/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete package');
  return data;
}
