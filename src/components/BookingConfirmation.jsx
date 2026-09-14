import React from 'react';
import { CheckCircle2, MessageSquare, Phone, MapPin, Printer, ArrowRight, Clock } from 'lucide-react';
import { business } from '../data/business.js';

export default function BookingConfirmation({ booking, onClose }) {
  if (!booking) return null;

  const handleWhatsApp = () => {
    const text = `Radhe Radhe! Khushi Travels,\n\nI have submitted a booking request on your website.\n\n*Booking ID:* ${booking.booking_id}\n*Name:* ${booking.customer_name}\n*Destination:* ${booking.destination}\n*Date:* ${booking.travel_date}\n*People:* ${booking.passengers}\n*Pickup:* ${booking.pickup_location}\n\nPlease confirm availability and share fare quotation.`;
    window.open(`https://wa.me/91${business.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl text-slate-900 my-8">
        
        {/* Top Clean Header */}
        <div className="bg-emerald-700 text-white p-6 text-center space-y-2">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-black">
            Booking Request Received!
          </h3>
          <p className="text-xs text-emerald-100 max-w-sm mx-auto">
            Thank you! Khushi Travels owner will call or WhatsApp you shortly on <strong>+91 {booking.customer_phone}</strong> to confirm your trip.
          </p>
        </div>

        {/* Receipt Body */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Booking ID Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Booking Reference Number
            </span>
            <p className="text-2xl font-black text-slate-900 font-mono tracking-wider mt-0.5">
              {booking.booking_id}
            </p>
          </div>

          {/* Details Summary */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-slate-700">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Customer:</span>
              <strong className="text-slate-900">{booking.customer_name}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Mobile Number:</span>
              <strong className="text-slate-900 font-mono">+91 {booking.customer_phone}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Destination:</span>
              <strong className="text-amber-800">{booking.destination}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Travel Date:</span>
              <strong className="text-slate-900">{booking.travel_date}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Passengers:</span>
              <strong className="text-slate-900">{booking.passengers} People</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Pickup Point:</span>
              <strong className="text-slate-900 text-right max-w-[200px] truncate">{booking.pickup_location}</strong>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleWhatsApp}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>💬 Message Khushi Travels on WhatsApp</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${business.primaryPhone}`}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call: {business.primaryPhone}</span>
              </a>

              <a
                href={business.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors text-center"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>📍 View on Maps</span>
              </a>
            </div>

            <button
              onClick={onClose}
              className="w-full text-slate-500 hover:text-slate-900 py-2 text-xs font-medium"
            >
              Close & Return to Home
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
