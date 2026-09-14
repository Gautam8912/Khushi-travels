import db from './db.js';
import crypto from 'crypto';

// Central business contact
const BUSINESS_CONTACT = {
  name: 'Khushi Travels',
  adminPhones: ['9634400179', '9149107116', '9761881999'],
  primaryWhatsApp: '9634400179',
  senderId: process.env.SMS_SENDER_ID || 'KHUSHI'
};

/**
 * Universal SMS Dispatcher
 */
export async function dispatchSMS({
  bookingId = null,
  recipientPhone,
  recipientType = 'CUSTOMER', // 'CUSTOMER' | 'ADMIN'
  templateName,
  message
}) {
  const smsId = 'sms-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex');
  const apiKey = process.env.SMS_API_KEY;
  const isProd = process.env.NODE_ENV === 'production' && apiKey;

  let status = 'SENT';
  let providerResponse = '';

  if (isProd) {
    try {
      // Production SMS API call (e.g. Fast2SMS / MSG91 standard DLT API)
      const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'v3',
          sender_id: process.env.SMS_SENDER_ID || 'KHUSHI',
          message: message,
          language: 'english',
          flash: 0,
          numbers: recipientPhone
        })
      });

      const json = await res.json();
      providerResponse = JSON.stringify(json);
      status = json.return ? 'SENT' : 'FAILED';
    } catch (err) {
      status = 'FAILED';
      providerResponse = JSON.stringify({ error: err.message, date: new Date().toISOString() });
      console.error('Production SMS dispatch failed:', err);
    }
  } else {
    // Development / Sandbox Logging Mode
    status = 'SENT';
    providerResponse = JSON.stringify({
      mode: 'DEVELOPMENT_SIMULATOR',
      status: 'success',
      code: 'SMS_DISPATCHED_TO_QUEUE',
      timestamp: new Date().toISOString(),
      recipient: recipientPhone,
      sender: BUSINESS_CONTACT.senderId
    });
    console.log(`\n================== 📲 SMS NOTIFICATION (${recipientType}) ==================`);
    console.log(`To: ${recipientPhone} | Template: ${templateName}`);
    console.log(`Message: "${message}"`);
    console.log(`========================================================================\n`);
  }

  // Record into persistent database logs
  try {
    db.prepare(`
      INSERT INTO sms_logs (id, booking_id, recipient_phone, recipient_type, template_name, message, status, provider_response)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(smsId, bookingId, recipientPhone, recipientType, templateName, message, status, providerResponse);
  } catch (dbErr) {
    console.error('Failed to save SMS log into db:', dbErr);
  }

  return {
    smsId,
    status,
    recipientPhone,
    recipientType,
    templateName,
    message
  };
}

/**
 * 1. Customer Booking Receipt SMS
 */
export async function sendCustomerBookingReceipt(booking) {
  const destList = Array.isArray(booking.destinations) 
    ? booking.destinations.join(', ') 
    : (typeof booking.destinations === 'string' && booking.destinations.startsWith('[') ? JSON.parse(booking.destinations).join(', ') : booking.destinations);

  const message = `Khushi Travels: Namaste ${booking.customer_name}! Your booking request [${booking.booking_id}] for ${destList} (${booking.travel_date}) has been received. Our team will contact you shortly to confirm fare & details. Helpline: 9634400179`;

  return await dispatchSMS({
    bookingId: booking.booking_id,
    recipientPhone: booking.customer_phone,
    recipientType: 'CUSTOMER',
    templateName: 'CUSTOMER_BOOKING_RECEIPT',
    message
  });
}

/**
 * 2. Admin Alert SMS (Notifies Khushi Travels on every new booking)
 */
export async function sendAdminBookingAlert(booking) {
  const destList = Array.isArray(booking.destinations) 
    ? booking.destinations.join(', ') 
    : (typeof booking.destinations === 'string' && booking.destinations.startsWith('[') ? JSON.parse(booking.destinations).join(', ') : booking.destinations);

  const message = `New Khushi Travels Booking! ID: ${booking.booking_id} | Client: ${booking.customer_name} (${booking.customer_phone}) | Route: ${destList} | Date: ${booking.travel_date} | Pax: ${booking.total_passengers} | Vehicle: ${booking.vehicle_name} | Est: Rs.${booking.estimated_fare}. Please login to confirm.`;

  return await dispatchSMS({
    bookingId: booking.booking_id,
    recipientPhone: BUSINESS_CONTACT.adminPhones[0],
    recipientType: 'ADMIN',
    templateName: 'ADMIN_NEW_BOOKING_ALERT',
    message
  });
}

/**
 * 3. Customer Booking Confirmed SMS
 */
export async function sendCustomerBookingConfirmation(booking) {
  const driverInfo = booking.assigned_driver ? ` Driver: ${booking.assigned_driver}.` : '';
  const vehicleInfo = booking.assigned_vehicle_no ? ` Car No: ${booking.assigned_vehicle_no}.` : '';

  const message = `Khushi Travels: Your booking [${booking.booking_id}] is CONFIRMED! Travel Date: ${booking.travel_date}. Vehicle: ${booking.vehicle_name}.${vehicleInfo}${driverInfo} Pickup: ${booking.pickup_location}. Happy & Safe Journey! Team Khushi Travels (9634400179)`;

  return await dispatchSMS({
    bookingId: booking.booking_id,
    recipientPhone: booking.customer_phone,
    recipientType: 'CUSTOMER',
    templateName: 'CUSTOMER_BOOKING_CONFIRMED',
    message
  });
}

/**
 * 4. Customer Booking Status Update (Rejected / Cancelled)
 */
export async function sendCustomerBookingStatusUpdate(booking, newStatus, reason = '') {
  const statusWord = newStatus === 'REJECTED' ? 'declined due to vehicle unavailability' : 'cancelled';
  const reasonText = reason ? ` Reason: ${reason}.` : '';

  const message = `Khushi Travels: Update on your booking [${booking.booking_id}]. It has been ${statusWord}.${reasonText} For immediate alternate arrangements, please call 9634400179 or WhatsApp us.`;

  return await dispatchSMS({
    bookingId: booking.booking_id,
    recipientPhone: booking.customer_phone,
    recipientType: 'CUSTOMER',
    templateName: `CUSTOMER_BOOKING_${newStatus}`,
    message
  });
}

/**
 * 5. Customer Trip Completed SMS
 */
export async function sendCustomerTripCompleted(booking) {
  const message = `Khushi Travels: Thank you for travelling with Khushi Travels (${booking.booking_id})! We hope you had a divine & comfortable journey. We look forward to serving you again. Share your feedback at 9634400179.`;

  return await dispatchSMS({
    bookingId: booking.booking_id,
    recipientPhone: booking.customer_phone,
    recipientType: 'CUSTOMER',
    templateName: 'CUSTOMER_TRIP_COMPLETED',
    message
  });
}
