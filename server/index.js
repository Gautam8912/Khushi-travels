import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db, { seedDatabase } from './db.js';
import {
  dispatchSMS,
  sendCustomerBookingReceipt,
  sendAdminBookingAlert,
  sendCustomerBookingConfirmation,
  sendCustomerBookingStatusUpdate,
  sendCustomerTripCompleted
} from './smsService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'khushi-travels-secret-key-2026';

app.use(cors());
app.use(express.json());

// Serve static build files if dist folder exists
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Seed the database on startup
seedDatabase();

// Middleware: Authenticate Admin Token
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin token required.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
}

// Helper: Generate Unique Collision-Free Booking ID (e.g. KT-20260914-0015)
function generateBookingId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const datePrefix = `KT-${year}${month}${day}-`;

  const countRow = db.prepare(`
    SELECT COUNT(*) as count FROM bookings WHERE booking_id LIKE ?
  `).get(`${datePrefix}%`);

  const nextSeq = (countRow.count + 1).toString().padStart(4, '0');
  const randomSuffix = crypto.randomBytes(1).toString('hex').toUpperCase();
  return `${datePrefix}${nextSeq}`;
}

// -------------------------------------------------------------
// AUTH ROUTES
// -------------------------------------------------------------

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.prepare('SELECT * FROM admin_users WHERE email = ?').get(email.trim().toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const isMatch = bcrypt.compareSync(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

app.get('/api/auth/me', authenticateAdmin, (req, res) => {
  const user = db.prepare('SELECT id, name, email, role FROM admin_users WHERE id = ?').get(req.admin.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  res.json({ user });
});

app.post('/api/auth/change-password', authenticateAdmin, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  }

  const user = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(req.admin.id);
  if (!bcrypt.compareSync(currentPassword, user.password_hash)) {
    return res.status(400).json({ error: 'Incorrect current password.' });
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?').run(newHash, req.admin.id);

  res.json({ success: true, message: 'Password updated successfully.' });
});

// -------------------------------------------------------------
// DESTINATIONS ROUTES
// -------------------------------------------------------------

app.get('/api/destinations', (req, res) => {
  const { q, category, type, featured } = req.query;
  let query = 'SELECT * FROM destinations WHERE enabled = 1';
  const params = [];

  if (featured === 'true' || featured === '1') {
    query += ' AND featured = 1';
  }

  if (type && type !== 'All') {
    query += ' AND type = ?';
    params.push(type);
  }

  if (category && category !== 'All') {
    query += ' AND categories LIKE ?';
    params.push(`%${category}%`);
  }

  if (q) {
    query += ' AND (name LIKE ? OR city LIKE ? OR state LIKE ? OR popular_for LIKE ? OR type LIKE ?)';
    const term = `%${q}%`;
    params.push(term, term, term, term, term);
  }

  query += ' ORDER BY featured DESC, name ASC';

  const rows = db.prepare(query).all(...params);
  const parsed = rows.map(r => ({
    ...r,
    nearbyPlaces: r.nearby_places ? JSON.parse(r.nearby_places) : [],
    categories: r.categories ? JSON.parse(r.categories) : [],
    coordinates: r.coordinates ? JSON.parse(r.coordinates) : null,
    pickupPoints: r.pickup_points ? JSON.parse(r.pickup_points) : [],
    featured: Boolean(r.featured),
    enabled: Boolean(r.enabled)
  }));

  res.json(parsed);
});

app.get('/api/destinations/all-admin', authenticateAdmin, (req, res) => {
  const rows = db.prepare('SELECT * FROM destinations ORDER BY name ASC').all();
  const parsed = rows.map(r => ({
    ...r,
    nearbyPlaces: r.nearby_places ? JSON.parse(r.nearby_places) : [],
    categories: r.categories ? JSON.parse(r.categories) : [],
    coordinates: r.coordinates ? JSON.parse(r.coordinates) : null,
    pickupPoints: r.pickup_points ? JSON.parse(r.pickup_points) : [],
    featured: Boolean(r.featured),
    enabled: Boolean(r.enabled)
  }));
  res.json(parsed);
});

app.get('/api/destinations/:id', (req, res) => {
  const r = db.prepare('SELECT * FROM destinations WHERE id = ?').get(req.params.id);
  if (!r) {
    return res.status(404).json({ error: 'Destination not found.' });
  }
  res.json({
    ...r,
    nearbyPlaces: r.nearby_places ? JSON.parse(r.nearby_places) : [],
    categories: r.categories ? JSON.parse(r.categories) : [],
    coordinates: r.coordinates ? JSON.parse(r.coordinates) : null,
    pickupPoints: r.pickup_points ? JSON.parse(r.pickup_points) : [],
    featured: Boolean(r.featured),
    enabled: Boolean(r.enabled)
  });
});

app.post('/api/destinations', authenticateAdmin, (req, res) => {
  const {
    id, name, state, city, type, description, popularFor, image,
    nearbyPlaces, recommendedDays, categories, coordinates, pickupPoints,
    distanceFromMathura, bestTime, featured, enabled
  } = req.body;

  if (!name || !state || !type) {
    return res.status(400).json({ error: 'Destination name, state, and type are required.' });
  }

  const destId = id || name.toLowerCase().replace(/[^a-z0-9]/g, '-');

  try {
    db.prepare(`
      INSERT INTO destinations (
        id, name, state, city, type, description, popular_for, image,
        nearby_places, recommended_days, categories, coordinates, pickup_points,
        distance_from_mathura, best_time, featured, enabled
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      destId, name, state, city || name, type, description || '', popularFor || '',
      image || 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=900&q=80',
      JSON.stringify(nearbyPlaces || []), recommendedDays || '1-2 Days',
      JSON.stringify(categories || [type]), JSON.stringify(coordinates || { lat: 27.4924, lng: 77.6737 }),
      JSON.stringify(pickupPoints || ['Mathura New Bus Stand']),
      distanceFromMathura || 0, bestTime || 'October to March',
      featured ? 1 : 0, enabled !== false ? 1 : 0
    );

    res.status(201).json({ success: true, id: destId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/destinations/:id', authenticateAdmin, (req, res) => {
  const {
    name, state, city, type, description, popularFor, image,
    nearbyPlaces, recommendedDays, categories, coordinates, pickupPoints,
    distanceFromMathura, bestTime, featured, enabled
  } = req.body;

  try {
    db.prepare(`
      UPDATE destinations SET
        name = ?, state = ?, city = ?, type = ?, description = ?, popular_for = ?, image = ?,
        nearby_places = ?, recommended_days = ?, categories = ?, coordinates = ?, pickup_points = ?,
        distance_from_mathura = ?, best_time = ?, featured = ?, enabled = ?
      WHERE id = ?
    `).run(
      name, state, city, type, description, popularFor, image,
      JSON.stringify(nearbyPlaces || []), recommendedDays,
      JSON.stringify(categories || []), JSON.stringify(coordinates || {}),
      JSON.stringify(pickupPoints || []), distanceFromMathura || 0, bestTime || '',
      featured ? 1 : 0, enabled ? 1 : 0, req.params.id
    );

    res.json({ success: true, message: 'Destination updated.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/destinations/:id', authenticateAdmin, (req, res) => {
  try {
    db.prepare('DELETE FROM destinations WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Destination deleted.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// VEHICLES ROUTES
// -------------------------------------------------------------

app.get('/api/vehicles', (req, res) => {
  const { all } = req.query;
  const query = all === 'true'
    ? 'SELECT * FROM vehicles ORDER BY display_order ASC, name ASC'
    : 'SELECT * FROM vehicles WHERE available = 1 ORDER BY display_order ASC, name ASC';

  const rows = db.prepare(query).all();
  const parsed = rows.map(v => ({
    ...v,
    features: v.features ? JSON.parse(v.features) : [],
    ac: Boolean(v.ac),
    available: Boolean(v.available)
  }));
  res.json(parsed);
});

app.get('/api/vehicles/:id', (req, res) => {
  const v = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(req.params.id);
  if (!v) {
    return res.status(404).json({ error: 'Vehicle not found.' });
  }
  res.json({
    ...v,
    features: v.features ? JSON.parse(v.features) : [],
    ac: Boolean(v.ac),
    available: Boolean(v.available)
  });
});

app.post('/api/vehicles', authenticateAdmin, (req, res) => {
  const {
    id, name, category, image, seats, luggageCapacity, ac,
    pricingType, basePrice, perKmPrice, perDayPrice, driverAllowance,
    available, description, features, displayOrder
  } = req.body;

  if (!name || !category || !seats) {
    return res.status(400).json({ error: 'Name, category, and seats are required.' });
  }

  const vehId = id || name.toLowerCase().replace(/[^a-z0-9]/g, '-');

  try {
    db.prepare(`
      INSERT INTO vehicles (
        id, name, category, image, seats, luggage_capacity, ac,
        pricing_type, base_price, per_km_price, per_day_price, driver_allowance,
        available, description, features, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      vehId, name, category, image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      seats, luggageCapacity || 2, ac ? 1 : 0,
      pricingType || 'km_day', basePrice || 2000, perKmPrice || 14, perDayPrice || 3000, driverAllowance || 500,
      available ? 1 : 0, description || '', JSON.stringify(features || []), displayOrder || 0
    );

    res.status(201).json({ success: true, id: vehId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/vehicles/:id', authenticateAdmin, (req, res) => {
  const {
    name, category, image, seats, luggageCapacity, ac,
    pricingType, basePrice, perKmPrice, perDayPrice, driverAllowance,
    available, description, features, displayOrder
  } = req.body;

  try {
    db.prepare(`
      UPDATE vehicles SET
        name = ?, category = ?, image = ?, seats = ?, luggage_capacity = ?, ac = ?,
        pricing_type = ?, base_price = ?, per_km_price = ?, per_day_price = ?, driver_allowance = ?,
        available = ?, description = ?, features = ?, display_order = ?
      WHERE id = ?
    `).run(
      name, category, image, seats, luggageCapacity, ac ? 1 : 0,
      pricingType, basePrice, perKmPrice, perDayPrice, driverAllowance,
      available ? 1 : 0, description, JSON.stringify(features || []), displayOrder || 0,
      req.params.id
    );

    res.json({ success: true, message: 'Vehicle updated successfully.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/vehicles/:id', authenticateAdmin, (req, res) => {
  try {
    db.prepare('DELETE FROM vehicles WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Vehicle removed.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// TOUR PACKAGES ROUTES
// -------------------------------------------------------------

app.get('/api/packages', (req, res) => {
  const { all } = req.query;
  const query = all === 'true'
    ? 'SELECT * FROM packages ORDER BY popular DESC, title ASC'
    : 'SELECT * FROM packages WHERE enabled = 1 ORDER BY popular DESC, title ASC';

  const rows = db.prepare(query).all();
  const parsed = rows.map(p => ({
    ...p,
    destinations: p.destinations ? JSON.parse(p.destinations) : [],
    highlights: p.highlights ? JSON.parse(p.highlights) : [],
    itinerary: p.itinerary ? JSON.parse(p.itinerary) : [],
    inclusions: p.inclusions ? JSON.parse(p.inclusions) : [],
    exclusions: p.exclusions ? JSON.parse(p.exclusions) : [],
    popular: Boolean(p.popular),
    enabled: Boolean(p.enabled)
  }));
  res.json(parsed);
});

app.get('/api/packages/:id', (req, res) => {
  const p = db.prepare('SELECT * FROM packages WHERE id = ?').get(req.params.id);
  if (!p) {
    return res.status(404).json({ error: 'Package not found.' });
  }
  res.json({
    ...p,
    destinations: p.destinations ? JSON.parse(p.destinations) : [],
    highlights: p.highlights ? JSON.parse(p.highlights) : [],
    itinerary: p.itinerary ? JSON.parse(p.itinerary) : [],
    inclusions: p.inclusions ? JSON.parse(p.inclusions) : [],
    exclusions: p.exclusions ? JSON.parse(p.exclusions) : [],
    popular: Boolean(p.popular),
    enabled: Boolean(p.enabled)
  });
});

app.post('/api/packages', authenticateAdmin, (req, res) => {
  const {
    id, title, duration, startingPrice, destinations, image,
    description, highlights, itinerary, inclusions, exclusions,
    popular, enabled
  } = req.body;

  if (!title || !duration || !startingPrice) {
    return res.status(400).json({ error: 'Title, duration, and starting price are required.' });
  }

  const pkgId = id || title.toLowerCase().replace(/[^a-z0-9]/g, '-');

  try {
    db.prepare(`
      INSERT INTO packages (
        id, title, duration, starting_price, destinations, image, description,
        highlights, itinerary, inclusions, exclusions, popular, enabled
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      pkgId, title, duration, startingPrice, JSON.stringify(destinations || []),
      image || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=80',
      description || '', JSON.stringify(highlights || []), JSON.stringify(itinerary || []),
      JSON.stringify(inclusions || []), JSON.stringify(exclusions || []),
      popular ? 1 : 0, enabled !== false ? 1 : 0
    );

    res.status(201).json({ success: true, id: pkgId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/packages/:id', authenticateAdmin, (req, res) => {
  const {
    title, duration, startingPrice, destinations, image,
    description, highlights, itinerary, inclusions, exclusions,
    popular, enabled
  } = req.body;

  try {
    db.prepare(`
      UPDATE packages SET
        title = ?, duration = ?, starting_price = ?, destinations = ?, image = ?,
        description = ?, highlights = ?, itinerary = ?, inclusions = ?, exclusions = ?,
        popular = ?, enabled = ?
      WHERE id = ?
    `).run(
      title, duration, startingPrice, JSON.stringify(destinations || []), image,
      description, JSON.stringify(highlights || []), JSON.stringify(itinerary || []),
      JSON.stringify(inclusions || []), JSON.stringify(exclusions || []),
      popular ? 1 : 0, enabled ? 1 : 0, req.params.id
    );

    res.json({ success: true, message: 'Package updated.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/packages/:id', authenticateAdmin, (req, res) => {
  try {
    db.prepare('DELETE FROM packages WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Package deleted.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// PICKUP LOCATIONS ROUTES
// -------------------------------------------------------------

app.get('/api/pickup-locations', (req, res) => {
  const rows = db.prepare('SELECT * FROM pickup_locations WHERE enabled = 1 ORDER BY is_primary DESC, name ASC').all();
  res.json(rows.map(r => ({ ...r, is_primary: Boolean(r.is_primary), enabled: Boolean(r.enabled) })));
});

app.post('/api/pickup-locations', authenticateAdmin, (req, res) => {
  const { name, address, latitude, longitude, googleMapsUrl, isPrimary, enabled } = req.body;
  if (!name || !address || !googleMapsUrl) {
    return res.status(400).json({ error: 'Name, address, and Google Maps URL are required.' });
  }

  const id = 'loc-' + Date.now();
  try {
    db.prepare(`
      INSERT INTO pickup_locations (id, name, address, latitude, longitude, google_maps_url, is_primary, enabled)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, address, latitude || 27.4924, longitude || 77.6737, googleMapsUrl, isPrimary ? 1 : 0, enabled !== false ? 1 : 0);

    res.status(201).json({ success: true, id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// REVIEWS ROUTES
// -------------------------------------------------------------

app.get('/api/reviews', (req, res) => {
  const rows = db.prepare('SELECT * FROM reviews WHERE approved = 1 ORDER BY date DESC').all();
  res.json(rows.map(r => ({ ...r, verified: Boolean(r.verified), approved: Boolean(r.approved) })));
});

app.get('/api/reviews/all-admin', authenticateAdmin, (req, res) => {
  const rows = db.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all();
  res.json(rows.map(r => ({ ...r, verified: Boolean(r.verified), approved: Boolean(r.approved) })));
});

app.post('/api/reviews', (req, res) => {
  const { customerName, customerCity, rating, comment, tripRoute, vehicleUsed } = req.body;
  if (!customerName || !rating || !comment || !tripRoute) {
    return res.status(400).json({ error: 'Name, rating, comment, and trip route are required.' });
  }

  const id = 'rev-' + Date.now();
  const date = new Date().toISOString().split('T')[0];

  try {
    db.prepare(`
      INSERT INTO reviews (id, customer_name, customer_city, rating, comment, trip_route, vehicle_used, date, verified, approved)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1)
    `).run(id, customerName.trim(), customerCity?.trim() || 'India', rating, comment.trim(), tripRoute.trim(), vehicleUsed || 'AC Cab', date);

    res.status(201).json({ success: true, id, message: 'Review submitted successfully.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/reviews/:id', authenticateAdmin, (req, res) => {
  const { approved } = req.body;
  db.prepare('UPDATE reviews SET approved = ? WHERE id = ?').run(approved ? 1 : 0, req.params.id);
  res.json({ success: true, message: 'Review status updated.' });
});

app.delete('/api/reviews/:id', authenticateAdmin, (req, res) => {
  db.prepare('DELETE FROM reviews WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Review deleted.' });
});

// -------------------------------------------------------------
// REAL BOOKINGS ENGINE
// -------------------------------------------------------------

// Customer Guest Booking Creation
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerWhatsapp,
      customerEmail,
      tripType,
      destinations,
      pickupLocation,
      pickupAddress,
      travelDate,
      returnDate,
      travellersAdults = 1,
      travellersChildren = 0,
      travellersSeniors = 0,
      vehicleId,
      vehicleName,
      packageId,
      packageTitle,
      specialRequests,
      estimatedFare
    } = req.body;

    // Strict Validation
    if (!customerName || customerName.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter a valid customer name.' });
    }

    const cleanPhone = (customerPhone || '').replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number.' });
    }

    if (!travelDate) {
      return res.status(400).json({ error: 'Please select a travel date.' });
    }

    // Date comparison check (Disallow past dates)
    const todayStr = new Date().toISOString().split('T')[0];
    if (travelDate < todayStr) {
      return res.status(400).json({ error: 'Travel date cannot be in the past.' });
    }

    if (tripType === 'Round Trip' || tripType === 'Multi Day') {
      if (!returnDate) {
        return res.status(400).json({ error: 'Return date is required for round trips.' });
      }
      if (returnDate < travelDate) {
        return res.status(400).json({ error: 'Return date cannot be before travel date.' });
      }
    }

    const totalPassengers = Number(travellersAdults) + Number(travellersChildren) + Number(travellersSeniors);
    if (totalPassengers <= 0) {
      return res.status(400).json({ error: 'Total passengers must be at least 1.' });
    }

    // Capacity validation if vehicle specified
    if (vehicleId) {
      const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(vehicleId);
      if (vehicle && totalPassengers > vehicle.seats) {
        return res.status(400).json({
          error: `Selected vehicle (${vehicle.name}) can accommodate up to ${vehicle.seats} passengers. You have ${totalPassengers} passengers. Please select a larger vehicle.`
        });
      }
    }

    // Generate unique Collision-Free Booking ID
    const bookingId = generateBookingId();
    const id = 'book-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex');

    // Destinations format
    let destString = 'Mathura';
    if (Array.isArray(destinations)) {
      destString = JSON.stringify(destinations);
    } else if (typeof destinations === 'string') {
      destString = destinations.startsWith('[') ? destinations : JSON.stringify([destinations]);
    }

    const fare = Number(estimatedFare) || 0;

    // Database Insert
    const stmt = db.prepare(`
      INSERT INTO bookings (
        id, booking_id, customer_name, customer_phone, customer_whatsapp, customer_email,
        trip_type, destinations, pickup_location, pickup_address, travel_date, return_date,
        travellers_adults, travellers_children, travellers_seniors, total_passengers,
        vehicle_id, vehicle_name, package_id, package_title, special_requests, estimated_fare,
        status, payment_status, assigned_driver, assigned_vehicle_no, admin_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', 'PAYMENT_PENDING', '', '', '')
    `);

    stmt.run(
      id,
      bookingId,
      customerName.trim(),
      cleanPhone,
      customerWhatsapp ? customerWhatsapp.replace(/\D/g, '') : cleanPhone,
      customerEmail ? customerEmail.trim().toLowerCase() : '',
      tripType || 'Round Trip',
      destString,
      pickupLocation || 'Mathura New Bus Stand (Main Office)',
      pickupAddress || '',
      travelDate,
      returnDate || '',
      travellersAdults,
      travellersChildren,
      travellersSeniors,
      totalPassengers,
      vehicleId || '',
      vehicleName || 'AC Chauffeur Cab',
      packageId || '',
      packageTitle || '',
      specialRequests || '',
      fare
    );

    const createdBooking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);

    // Asynchronously dispatch notifications (Customer SMS + Khushi Travels Admin Alert)
    sendCustomerBookingReceipt(createdBooking).catch(err => console.error('SMS Receipt Error:', err));
    sendAdminBookingAlert(createdBooking).catch(err => console.error('Admin Alert Error:', err));

    res.status(201).json({
      success: true,
      booking: {
        ...createdBooking,
        destinations: JSON.parse(createdBooking.destinations)
      },
      message: 'Booking request placed successfully!'
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'Failed to create booking: ' + err.message });
  }
});

// Track Booking (Public Lookup for customer)
app.get('/api/bookings/track', (req, res) => {
  const { bookingId, phone } = req.query;
  if (!bookingId || !phone) {
    return res.status(400).json({ error: 'Both Booking ID and Mobile number are required.' });
  }

  const cleanPhone = phone.replace(/\D/g, '');
  const row = db.prepare(`
    SELECT * FROM bookings 
    WHERE UPPER(booking_id) = UPPER(?) AND (customer_phone LIKE ? OR customer_whatsapp LIKE ?)
  `).get(bookingId.trim(), `%${cleanPhone.slice(-10)}%`, `%${cleanPhone.slice(-10)}%`);

  if (!row) {
    return res.status(404).json({ error: 'No booking found matching the provided Booking ID and Mobile number.' });
  }

  res.json({
    ...row,
    destinations: row.destinations ? JSON.parse(row.destinations) : []
  });
});

// Single Booking by ID or Booking ID
app.get('/api/bookings/:idOrBookingId', (req, res) => {
  const param = req.params.idOrBookingId;
  const row = db.prepare(`
    SELECT * FROM bookings WHERE id = ? OR UPPER(booking_id) = UPPER(?)
  `).get(param, param);

  if (!row) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  res.json({
    ...row,
    destinations: row.destinations ? JSON.parse(row.destinations) : []
  });
});

// Admin Booking List with Filters & Search
app.get('/api/bookings', authenticateAdmin, (req, res) => {
  const { status, search, date, vehicle } = req.query;
  let query = 'SELECT * FROM bookings WHERE 1=1';
  const params = [];

  if (status && status !== 'ALL') {
    query += ' AND status = ?';
    params.push(status);
  }

  if (date) {
    query += ' AND travel_date = ?';
    params.push(date);
  }

  if (vehicle && vehicle !== 'ALL') {
    query += ' AND vehicle_id = ?';
    params.push(vehicle);
  }

  if (search) {
    query += ` AND (
      booking_id LIKE ? OR
      customer_name LIKE ? OR
      customer_phone LIKE ? OR
      destinations LIKE ? OR
      vehicle_name LIKE ?
    )`;
    const term = `%${search}%`;
    params.push(term, term, term, term, term);
  }

  query += ' ORDER BY created_at DESC';

  const rows = db.prepare(query).all(...params);
  const parsed = rows.map(r => ({
    ...r,
    destinations: r.destinations ? JSON.parse(r.destinations) : []
  }));

  res.json(parsed);
});

// Admin Status Updater (CONFIRM, REJECT, CANCEL, COMPLETE) + Auto-SMS
app.patch('/api/bookings/:id/status', authenticateAdmin, async (req, res) => {
  const { status, assignedDriver, assignedVehicleNo, paymentStatus, adminNotes, notifyCustomer = true } = req.body;

  const validStatuses = ['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value.' });
  }

  const existing = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  try {
    const updatedNotes = adminNotes !== undefined ? adminNotes : existing.admin_notes;
    const updatedDriver = assignedDriver !== undefined ? assignedDriver : existing.assigned_driver;
    const updatedVehNo = assignedVehicleNo !== undefined ? assignedVehicleNo : existing.assigned_vehicle_no;
    const updatedPayment = paymentStatus !== undefined ? paymentStatus : existing.payment_status;

    db.prepare(`
      UPDATE bookings SET
        status = ?,
        assigned_driver = ?,
        assigned_vehicle_no = ?,
        payment_status = ?,
        admin_notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, updatedDriver, updatedVehNo, updatedPayment, updatedNotes, req.params.id);

    const updatedBooking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);

    // Trigger status SMS if enabled
    if (notifyCustomer) {
      if (status === 'CONFIRMED') {
        sendCustomerBookingConfirmation(updatedBooking).catch(err => console.error('SMS Confirm Error:', err));
      } else if (status === 'REJECTED' || status === 'CANCELLED') {
        sendCustomerBookingStatusUpdate(updatedBooking, status, updatedNotes).catch(err => console.error('SMS Status Error:', err));
      } else if (status === 'COMPLETED') {
        sendCustomerTripCompleted(updatedBooking).catch(err => console.error('SMS Completed Error:', err));
      }
    }

    res.json({
      success: true,
      booking: {
        ...updatedBooking,
        destinations: JSON.parse(updatedBooking.destinations)
      },
      message: `Booking marked as ${status}.`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Update Full Booking
app.patch('/api/bookings/:id', authenticateAdmin, (req, res) => {
  const {
    customer_name, customer_phone, customer_whatsapp, customer_email,
    trip_type, destinations, pickup_location, pickup_address,
    travel_date, return_date, travellers_adults, travellers_children,
    travellers_seniors, total_passengers, vehicle_id, vehicle_name,
    estimated_fare, payment_status, assigned_driver, assigned_vehicle_no, admin_notes
  } = req.body;

  try {
    db.prepare(`
      UPDATE bookings SET
        customer_name = COALESCE(?, customer_name),
        customer_phone = COALESCE(?, customer_phone),
        customer_whatsapp = COALESCE(?, customer_whatsapp),
        customer_email = COALESCE(?, customer_email),
        trip_type = COALESCE(?, trip_type),
        destinations = COALESCE(?, destinations),
        pickup_location = COALESCE(?, pickup_location),
        pickup_address = COALESCE(?, pickup_address),
        travel_date = COALESCE(?, travel_date),
        return_date = COALESCE(?, return_date),
        travellers_adults = COALESCE(?, travellers_adults),
        travellers_children = COALESCE(?, travellers_children),
        travellers_seniors = COALESCE(?, travellers_seniors),
        total_passengers = COALESCE(?, total_passengers),
        vehicle_id = COALESCE(?, vehicle_id),
        vehicle_name = COALESCE(?, vehicle_name),
        estimated_fare = COALESCE(?, estimated_fare),
        payment_status = COALESCE(?, payment_status),
        assigned_driver = COALESCE(?, assigned_driver),
        assigned_vehicle_no = COALESCE(?, assigned_vehicle_no),
        admin_notes = COALESCE(?, admin_notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      customer_name, customer_phone, customer_whatsapp, customer_email,
      trip_type, Array.isArray(destinations) ? JSON.stringify(destinations) : destinations,
      pickup_location, pickup_address,
      travel_date, return_date, travellers_adults, travellers_children,
      travellers_seniors, total_passengers, vehicle_id, vehicle_name,
      estimated_fare, payment_status, assigned_driver, assigned_vehicle_no, admin_notes,
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    res.json({
      success: true,
      booking: { ...updated, destinations: JSON.parse(updated.destinations) }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin Delete Booking
app.delete('/api/bookings/:id', authenticateAdmin, (req, res) => {
  try {
    db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Booking removed successfully.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// SMS LOGS & AUDIT ROUTES
// -------------------------------------------------------------

app.get('/api/sms-logs', authenticateAdmin, (req, res) => {
  const rows = db.prepare('SELECT * FROM sms_logs ORDER BY created_at DESC LIMIT 100').all();
  res.json(rows);
});

app.post('/api/sms-logs/test-dispatch', authenticateAdmin, async (req, res) => {
  const { phone, message, templateName = 'ADMIN_TEST_PROBE' } = req.body;
  if (!phone || !message) {
    return res.status(400).json({ error: 'Phone number and message are required.' });
  }

  const result = await dispatchSMS({
    recipientPhone: phone.replace(/\D/g, ''),
    recipientType: 'ADMIN',
    templateName,
    message
  });

  res.json({ success: true, result });
});

// -------------------------------------------------------------
// ANALYTICS & STATS (ADMIN)
// -------------------------------------------------------------

app.get('/api/analytics', authenticateAdmin, (req, res) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const totalBookings = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;
  const todayBookings = db.prepare('SELECT COUNT(*) as count FROM bookings WHERE DATE(created_at) = ?').get(todayStr).count;
  const pendingBookings = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'PENDING'").get().count;
  const confirmedBookings = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'CONFIRMED'").get().count;
  const completedBookings = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'COMPLETED'").get().count;
  const cancelledBookings = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status IN ('CANCELLED', 'REJECTED')").get().count;

  const totalRevenue = db.prepare("SELECT SUM(estimated_fare) as sum FROM bookings WHERE status IN ('CONFIRMED', 'COMPLETED')").get().sum || 0;

  const vehiclesStats = db.prepare(`
    SELECT vehicle_name, COUNT(*) as booking_count 
    FROM bookings 
    GROUP BY vehicle_name 
    ORDER BY booking_count DESC 
    LIMIT 5
  `).all();

  const recentBookings = db.prepare(`
    SELECT * FROM bookings ORDER BY created_at DESC LIMIT 6
  `).all().map(r => ({ ...r, destinations: JSON.parse(r.destinations) }));

  res.json({
    kpis: {
      totalBookings,
      todayBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue
    },
    vehiclesStats,
    recentBookings
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Khushi Travels API',
    location: 'Mathura New Bus Stand, Mathura, UP',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Wildcard fallback middleware to serve index.html for SPA client-side routing
if (fs.existsSync(distPath)) {
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚐 Khushi Travels backend listening on port ${PORT}`);
});
