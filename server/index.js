import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import store, { seedDatabase } from './db.js';
import {
  sendCustomerBookingReceipt,
  sendAdminBookingAlert
} from './smsService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'khushi-travels-secret-key-2026';

app.use(cors());
app.use(express.json());

// Seed database on startup
seedDatabase();

// Middleware: Authenticate Owner Token
function authenticateOwner(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Owner login required.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
  }
}

// Generate Simple Clean Booking ID (e.g. KT-0015)
function generateSimpleBookingId() {
  const bookings = store.getBookings();
  const nextNum = (bookings.length + 1).toString().padStart(4, '0');
  return `KT-${nextNum}`;
}

// -------------------------------------------------------------
// 1. DESTINATIONS
// -------------------------------------------------------------

app.get('/api/destinations', (req, res) => {
  const { q, type } = req.query;
  let list = store.getDestinations().filter(d => d.enabled);

  if (type && type !== 'All') {
    list = list.filter(d => d.type === type);
  }

  if (q) {
    const term = q.toLowerCase();
    list = list.filter(d => 
      d.name.toLowerCase().includes(term) ||
      d.city.toLowerCase().includes(term) ||
      d.state.toLowerCase().includes(term) ||
      (d.popular_for && d.popular_for.toLowerCase().includes(term))
    );
  }

  res.json(list);
});

// -------------------------------------------------------------
// 2. BOOKINGS (Customer Submits $\rightarrow$ Saved to Store)
// -------------------------------------------------------------

app.post('/api/bookings', async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      destination,
      travelDate,
      passengers = 1,
      pickupLocation,
      notes = ''
    } = req.body;

    // Strict simple validation
    if (!customerName || customerName.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter your name.' });
    }

    const cleanPhone = (customerPhone || '').replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
    }

    if (!travelDate) {
      return res.status(400).json({ error: 'Please select your travel date.' });
    }

    if (!destination || !destination.trim()) {
      return res.status(400).json({ error: 'Please select or enter your destination.' });
    }

    const bookingId = generateSimpleBookingId();
    const id = 'book-' + Date.now() + '-' + crypto.randomBytes(2).toString('hex');

    const newBooking = {
      id,
      booking_id: bookingId,
      customer_name: customerName.trim(),
      customer_phone: cleanPhone,
      destination: destination.trim(),
      travel_date: travelDate,
      passengers: Number(passengers) || 1,
      pickup_location: pickupLocation || 'Mathura New Bus Stand',
      notes: notes.trim(),
      status: 'New',
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };

    store.addBooking(newBooking);

    // Notification (SMS + Owner Alert Log)
    sendCustomerBookingReceipt(newBooking).catch(() => {});
    sendAdminBookingAlert(newBooking).catch(() => {});

    console.log(`\n🎉 New Booking Request: [${bookingId}] ${customerName} (${cleanPhone}) -> ${destination} on ${travelDate} (${passengers} people)\n`);

    res.status(201).json({
      success: true,
      booking: newBooking,
      message: 'Booking request received successfully! Khushi Travels owner will contact you shortly.'
    });
  } catch (err) {
    console.error('Error creating booking request:', err);
    res.status(500).json({ error: 'Failed to submit booking: ' + err.message });
  }
});

// -------------------------------------------------------------
// 3. OWNER BOOKINGS MANAGEMENT
// -------------------------------------------------------------

// Owner List Bookings
app.get('/api/bookings', authenticateOwner, (req, res) => {
  const { status, search } = req.query;
  let list = store.getBookings();

  if (status && status !== 'ALL') {
    list = list.filter(b => b.status === status);
  }

  if (search) {
    const term = search.toLowerCase();
    list = list.filter(b => 
      b.booking_id.toLowerCase().includes(term) ||
      b.customer_name.toLowerCase().includes(term) ||
      b.customer_phone.includes(term) ||
      b.destination.toLowerCase().includes(term)
    );
  }

  res.json(list);
});

// Owner Update Status (New -> Contacted -> Confirmed -> Cancelled)
app.patch('/api/bookings/:id/status', authenticateOwner, (req, res) => {
  const { status } = req.body;
  const valid = ['New', 'Contacted', 'Confirmed', 'Cancelled'];
  if (!valid.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const updated = store.updateBookingStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ error: 'Booking not found' });

  res.json({ success: true, booking: updated });
});

// Owner Delete Record
app.delete('/api/bookings/:id', authenticateOwner, (req, res) => {
  store.deleteBooking(req.params.id);
  res.json({ success: true, message: 'Booking removed.' });
});

// -------------------------------------------------------------
// 4. OWNER AUTHENTICATION
// -------------------------------------------------------------

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required.' });
  }

  const user = store.findAdminByEmail(email.trim());
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

app.get('/api/auth/me', authenticateOwner, (req, res) => {
  const user = store.findAdminById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Khushi Travels Simple Booking System',
    location: 'Mathura New Bus Stand, Mathura, UP'
  });
});

// Serve static build if dist exists
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚐 Khushi Travels backend listening on port ${PORT}`);
});
