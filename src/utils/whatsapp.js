import { business } from '../data/business.js';

/**
 * Builds direct WhatsApp URL with prefilled text
 */
export function buildWhatsAppUrl(message) {
  const phone = business.whatsapp.replace(/\D/g, '');
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/91${phone}?text=${encodedText}`;
}

/**
 * Quick Booking WhatsApp message
 */
export function generateBookingWhatsAppMessage({
  destination,
  travelDate,
  returnDate,
  passengers,
  vehicleName,
  pickupLocation,
  tripType = 'Round Trip',
  bookingId = null
}) {
  let text = `Radhe Radhe! Khushi Travels,\n\n`;
  if (bookingId) {
    text += `I have placed a booking request (ID: *${bookingId}*).\n\n`;
  } else {
    text += `I would like to book a trip with Khushi Travels:\n\n`;
  }
  
  text += `📍 *Destination:* ${destination}\n`;
  text += `🚗 *Trip Type:* ${tripType}\n`;
  text += `📅 *Travel Date:* ${travelDate}\n`;
  if (returnDate) {
    text += `🔄 *Return Date:* ${returnDate}\n`;
  }
  text += `👥 *Passengers:* ${passengers}\n`;
  if (vehicleName) {
    text += `🚐 *Vehicle:* ${vehicleName}\n`;
  }
  if (pickupLocation) {
    text += `📍 *Pickup Point:* ${pickupLocation}\n`;
  }
  text += `\nPlease share availability and confirm the final fare quotation.\n\nThank you!`;
  
  return text;
}

/**
 * Vehicle Inquiry WhatsApp message
 */
export function generateVehicleInquiryWhatsAppMessage(vehicleName, seats) {
  return `Radhe Radhe! Khushi Travels,\n\nI am inquiring about hiring the *${vehicleName}* (${seats} Seats).\n\nPlease let me know your per KM / per day rates and availability for outstation travel from Mathura.\n\nThank you!`;
}

/**
 * Package Inquiry WhatsApp message
 */
export function generatePackageInquiryWhatsAppMessage(packageTitle, duration, price) {
  return `Radhe Radhe! Khushi Travels,\n\nI am interested in your tour package: *${packageTitle}* (${duration}).\nStarting at ₹${price}.\n\nPlease share detailed day-wise itinerary, available dates, and customized quote for our family/group.\n\nThank you!`;
}
