import crypto from 'crypto';

const BUSINESS_CONTACT = {
  name: 'Khushi Travels',
  adminPhones: ['9634400179', '9149107116', '9761881999'],
  primaryWhatsApp: '9634400179'
};

export async function dispatchSMS({ recipientPhone, message }) {
  console.log(`\n================== 📲 SMS NOTIFICATION ==================`);
  console.log(`To: ${recipientPhone}`);
  console.log(`Message: "${message}"`);
  console.log(`==========================================================\n`);
  return { status: 'SENT' };
}

export async function sendCustomerBookingReceipt(booking) {
  const message = `Khushi Travels: Namaste ${booking.customer_name}! Your booking request [${booking.booking_id}] for ${booking.destination} on ${booking.travel_date} has been received. Our team will contact you shortly on call/WhatsApp to confirm all details. Helpline: 9634400179`;
  return await dispatchSMS({
    recipientPhone: booking.customer_phone,
    message
  });
}

export async function sendAdminBookingAlert(booking) {
  const message = `New Khushi Travels Booking! ID: ${booking.booking_id} | Client: ${booking.customer_name} (${booking.customer_phone}) | Destination: ${booking.destination} | Date: ${booking.travel_date} | People: ${booking.passengers} | Pickup: ${booking.pickup_location}. Please call the customer.`;
  return await dispatchSMS({
    recipientPhone: BUSINESS_CONTACT.adminPhones[0],
    message
  });
}
