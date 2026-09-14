import db from '../server/db.js';

async function runApiTests() {
  console.log('🌐 Starting API End-to-End Integration Tests...\n');

  const BASE_URL = 'http://127.0.0.1:5001/api';

  // 1. Health check
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthJson = await healthRes.json();
  console.log('1. Health Check Response:', healthJson);
  if (healthJson.status !== 'online') throw new Error('Health check failed');

  // 2. Fetch Destinations
  const destRes = await fetch(`${BASE_URL}/destinations?q=math`);
  const destJson = await destRes.json();
  console.log(`2. Search Destinations ('math'): Found ${destJson.length} destination(s)`);
  if (!destJson.some(d => d.name === 'Mathura')) throw new Error('Mathura destination search failed');

  // 3. Create a Guest Booking
  const bookingPayload = {
    customerName: 'Aarav Sharma',
    customerPhone: '9876543210',
    customerWhatsapp: '9876543210',
    customerEmail: 'aarav.s@gmail.com',
    tripType: 'Round Trip',
    destinations: ['Mathura', 'Vrindavan'],
    pickupLocation: 'Mathura New Bus Stand (Main Office)',
    pickupAddress: 'Adarsh Nagar, Mathura',
    travelDate: '2026-09-21',
    returnDate: '2026-09-23',
    travellersAdults: 4,
    travellersChildren: 1,
    travellersSeniors: 0,
    vehicleId: 'innova-crysta',
    vehicleName: 'Toyota Innova Crysta',
    specialRequests: 'Need early morning 7 AM pickup.',
    estimatedFare: 8400
  };

  const createRes = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingPayload)
  });
  const createJson = await createRes.json();
  console.log('3. Create Booking Response:', createJson.success, 'Booking ID:', createJson.booking?.booking_id);

  if (!createJson.success || !createJson.booking?.booking_id.startsWith('KT-')) {
    throw new Error('Booking creation failed: ' + JSON.stringify(createJson));
  }

  const newBookingId = createJson.booking.booking_id;
  const newId = createJson.booking.id;

  // 4. Public Customer Tracking
  const trackRes = await fetch(`${BASE_URL}/bookings/track?bookingId=${newBookingId}&phone=9876543210`);
  const trackJson = await trackRes.json();
  console.log('4. Customer Track Booking Response Status:', trackJson.status);
  if (trackJson.booking_id !== newBookingId) throw new Error('Tracking lookup failed');

  // 5. Admin Login
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@khushitravels.com', password: 'Khushi@2026' })
  });
  const loginJson = await loginRes.json();
  console.log('5. Admin Login:', loginJson.user?.email, 'Token:', loginJson.token ? 'JWT Generated' : 'Missing');
  if (!loginJson.token) throw new Error('Admin login failed');

  const adminToken = loginJson.token;

  // 6. Admin Confirm Booking & Assign Driver
  const confirmRes = await fetch(`${BASE_URL}/bookings/${newId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      status: 'CONFIRMED',
      assignedDriver: 'Rakesh Yadav (9837112233)',
      assignedVehicleNo: 'UP 85 AZ 8899',
      paymentStatus: 'ADVANCE_PAID',
      adminNotes: 'Advance ₹1000 collected at Mathura office.'
    })
  });
  const confirmJson = await confirmRes.json();
  console.log('6. Admin Confirm Status Response:', confirmJson.booking?.status, 'Driver:', confirmJson.booking?.assigned_driver);
  if (confirmJson.booking?.status !== 'CONFIRMED') throw new Error('Admin status update failed');

  // 7. Verify SMS Audit Logs
  const smsRes = await fetch(`${BASE_URL}/sms-logs`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const smsJson = await smsRes.json();
  console.log(`7. SMS Audit Trail: ${smsJson.length} log records present in database`);
  if (smsJson.length === 0) throw new Error('SMS logs empty');

  console.log('\n🌟 ALL END-TO-END HTTP API TESTS PASSED SUCCESSFULLY!\n');
}

runApiTests().catch(err => {
  console.error('❌ API Test Error:', err);
  process.exit(1);
});
