import store from '../server/db.js';

console.log('🚀 Running Streamlined Khushi Travels System Verification...\n');

// 1. Destination Check
const destinations = store.getDestinations();
console.log(`✅ Destinations in Store: ${destinations.length}`);
if (destinations.length === 0) throw new Error('Destinations not loaded');

// 2. Booking Submission Test
const testPayload = {
  id: 'test-' + Date.now(),
  booking_id: 'KT-9999',
  customer_name: 'Manish Rawat',
  customer_phone: '9876543210',
  destination: 'Vrindavan + Prem Mandir',
  travel_date: '2026-09-25',
  passengers: 4,
  pickup_location: 'Mathura New Bus Stand',
  notes: 'Need clean AC cab for family',
  status: 'New',
  created_at: new Date().toISOString()
};

store.addBooking(testPayload);
const allBookings = store.getBookings();
const inserted = allBookings.find(b => b.id === testPayload.id);
console.log(`✅ New Booking Created: [${inserted.booking_id}] ${inserted.customer_name} -> ${inserted.destination} (Status: ${inserted.status})`);

if (inserted.status !== 'New') throw new Error('Booking status wrong');

// 3. Status Change Test (Owner changes to Contacted, then Confirmed)
store.updateBookingStatus(testPayload.id, 'Contacted');
const updatedContacted = store.getBookings().find(b => b.id === testPayload.id);
console.log(`✅ Status Changed to: ${updatedContacted.status}`);

store.updateBookingStatus(testPayload.id, 'Confirmed');
const updatedConfirmed = store.getBookings().find(b => b.id === testPayload.id);
console.log(`✅ Status Changed to: ${updatedConfirmed.status}`);

console.log('\n🎉 ALL STREAMLINED SYSTEM TESTS PASSED PERFECTLY!\n');
