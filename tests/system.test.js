import db, { seedDatabase } from '../server/db.js';
import {
  dispatchSMS,
  sendCustomerBookingReceipt,
  sendAdminBookingAlert,
  sendCustomerBookingConfirmation,
  sendCustomerBookingStatusUpdate,
  sendCustomerTripCompleted
} from '../server/smsService.js';
import { calculateEstimatedFare, recommendVehicleCategory } from '../src/utils/pricing.js';
import { generateBookingWhatsAppMessage, buildWhatsAppUrl } from '../src/utils/whatsapp.js';
import { business } from '../src/data/business.js';

console.log('🚀 Starting Khushi Travels Full-Stack System Verification...\n');

// 1. Database & Seed Verification
seedDatabase();
const adminCount = db.prepare('SELECT COUNT(*) as count FROM admin_users').get().count;
const vehCount = db.prepare('SELECT COUNT(*) as count FROM vehicles').get().count;
const destCount = db.prepare('SELECT COUNT(*) as count FROM destinations').get().count;
const pkgCount = db.prepare('SELECT COUNT(*) as count FROM packages').get().count;
const bookCount = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;

console.log(`✅ Database Tables Checked:`);
console.log(`   - Admin Users: ${adminCount}`);
console.log(`   - Vehicles in Fleet: ${vehCount}`);
console.log(`   - Destinations: ${destCount}`);
console.log(`   - Tour Packages: ${pkgCount}`);
console.log(`   - Bookings: ${bookCount}`);

if (adminCount === 0 || vehCount === 0 || destCount === 0 || pkgCount === 0) {
  throw new Error('❌ Database seeding failed!');
}

// 2. Pricing & Recommendation Engine Tests
console.log('\n🧠 Testing Deterministic Vehicle Recommendation Engine:');
const rec4 = recommendVehicleCategory(4);
const rec7 = recommendVehicleCategory(7);
const rec14 = recommendVehicleCategory(14);
const rec25 = recommendVehicleCategory(25);

console.log(`   - 4 Passengers -> ${rec4.category} (${rec4.badge})`);
console.log(`   - 7 Passengers -> ${rec7.category} (${rec7.badge})`);
console.log(`   - 14 Passengers -> ${rec14.category} (${rec14.badge})`);
console.log(`   - 25 Passengers -> ${rec25.category} (${rec25.badge})`);

if (rec4.category !== 'Sedan' || rec7.category !== 'SUV' || rec14.category !== 'Group Travel') {
  throw new Error('❌ Vehicle recommendation mismatch!');
}

console.log('\n💰 Testing Fare Calculation Engine:');
const dummySedan = { basePrice: 1800, perKmPrice: 11, perDayPrice: 2600, driverAllowance: 400 };
const dummyInnova = { basePrice: 2800, perKmPrice: 18, perDayPrice: 4200, driverAllowance: 500 };

const fareSedanLocal = calculateEstimatedFare({ tripType: 'Round Trip', destinations: ['mathura', 'vrindavan'], vehicle: dummySedan, days: 1 });
const fareInnovaAgra = calculateEstimatedFare({ tripType: 'Round Trip', destinations: ['mathura', 'agra'], vehicle: dummyInnova, days: 2 });

console.log(`   - Local Braj Darshan (Sedan, 1 Day): ₹${fareSedanLocal}`);
console.log(`   - Mathura-Agra Circuit (Innova Crysta, 2 Days): ₹${fareInnovaAgra}`);

if (fareSedanLocal <= 0 || fareInnovaAgra <= 0) {
  throw new Error('❌ Fare calculation failed!');
}

// 3. WhatsApp Message Generator Verification
console.log('\n💬 Testing WhatsApp Message Generator:');
const sampleMsg = generateBookingWhatsAppMessage({
  destination: 'Mathura + Vrindavan',
  travelDate: '2026-09-20',
  returnDate: '2026-09-22',
  passengers: 5,
  vehicleName: 'Toyota Innova Crysta',
  pickupLocation: 'Mathura New Bus Stand',
  bookingId: 'KT-20260920-0099'
});
const waUrl = buildWhatsAppUrl(sampleMsg);
console.log(`   - WhatsApp URL Generated:\n     ${waUrl.slice(0, 100)}...`);

if (!waUrl.includes('9634400179') || !waUrl.includes('KT-20260920-0099')) {
  throw new Error('❌ WhatsApp link generator failed!');
}

// 4. SMS Provider Notification Pipeline Tests
console.log('\n📲 Testing SMS Provider Notification Pipeline:');

async function testSmsPipeline() {
  const testBooking = {
    booking_id: 'KT-TEST-' + Date.now(),
    customer_name: 'Test Pilgrim',
    customer_phone: '9876543210',
    destinations: ['Mathura', 'Vrindavan'],
    travel_date: '2026-09-20',
    total_passengers: 4,
    vehicle_name: 'Maruti Suzuki Dzire',
    pickup_location: 'Mathura New Bus Stand',
    estimated_fare: 4500,
    assigned_driver: 'Mahesh Sharma (9871122334)',
    assigned_vehicle_no: 'UP 85 BX 4012'
  };

  // Test Customer Booking Receipt SMS
  const r1 = await sendCustomerBookingReceipt(testBooking);
  console.log(`   ✅ Customer Booking Receipt SMS: [${r1.status}] ID: ${r1.smsId}`);

  // Test Admin Booking Alert SMS
  const r2 = await sendAdminBookingAlert(testBooking);
  console.log(`   ✅ Admin Booking Alert SMS: [${r2.status}] ID: ${r2.smsId}`);

  // Test Customer Booking Confirmed SMS
  const r3 = await sendCustomerBookingConfirmation(testBooking);
  console.log(`   ✅ Customer Confirmation SMS: [${r3.status}] ID: ${r3.smsId}`);

  // Test Customer Trip Completed SMS
  const r4 = await sendCustomerTripCompleted(testBooking);
  console.log(`   ✅ Customer Trip Completed SMS: [${r4.status}] ID: ${r4.smsId}`);

  // Verify DB SMS Log Table
  const loggedCount = db.prepare('SELECT COUNT(*) as count FROM sms_logs WHERE booking_id = ?').get(testBooking.booking_id).count;
  console.log(`   ✅ SMS Log Audit Trail: ${loggedCount} messages recorded in database for ${testBooking.booking_id}`);

  if (loggedCount < 4) {
    throw new Error('❌ SMS audit logging failed!');
  }
}

testSmsPipeline().then(() => {
  console.log('\n🎉 ALL FULL-STACK & BUSINESS TESTS PASSED PERFECTLY!\n');
  process.exit(0);
}).catch(err => {
  console.error('\n❌ Test failure:', err);
  process.exit(1);
});
