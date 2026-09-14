import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageSquare, Phone, MapPin, Printer, Download, Share2, Calendar, Users, Car, ArrowRight, ShieldCheck } from 'lucide-react';
import { business } from '../data/business.js';
import { buildWhatsAppUrl, generateBookingWhatsAppMessage } from '../utils/whatsapp.js';

export default function BookingConfirmation({ booking, onClose, onTrackAnother }) {
  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  }, []);

  if (!booking) return null;

  const destText = Array.isArray(booking.destinations) 
    ? booking.destinations.join(' ➔ ') 
    : booking.destinations;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const msg = generateBookingWhatsAppMessage({
      destination: destText,
      travelDate: booking.travel_date,
      returnDate: booking.return_date,
      passengers: booking.total_passengers,
      vehicleName: booking.vehicle_name,
      pickupLocation: booking.pickup_location,
      tripType: booking.trip_type,
      bookingId: booking.booking_id
    });
    window.open(buildWhatsAppUrl(msg), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl text-white my-8">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-6 text-center text-white relative">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-2 border border-white/30">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Booking Request Received! 🎉
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-md mx-auto">
            Your booking request has been successfully recorded in Khushi Travels system. Our operations team is reviewing it.
          </p>
        </div>

        {/* Printable Ticket Receipt Body */}
        <div className="p-6 space-y-6 text-slate-200" id="printable-booking-card">
          
          {/* Booking ID Highlight Pill */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border border-amber-500/40 rounded-2xl p-4 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Unique Booking Reference ID
            </span>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono tracking-wider mt-0.5">
              {booking.booking_id}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Please quote this Booking ID for all communications. An SMS notification has also been dispatched.
            </p>
          </div>

          {/* Booking Summary Grid */}
          <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 space-y-4 text-xs sm:text-sm">
            
            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-800/80">
              <div>
                <p className="text-slate-400 text-xs">Customer Name</p>
                <p className="font-bold text-white text-sm">{booking.customer_name}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Contact Mobile</p>
                <p className="font-bold text-white text-sm">+91 {booking.customer_phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-slate-800/80">
              <div>
                <p className="text-slate-400 text-xs">Destination Route</p>
                <p className="font-bold text-amber-300 text-sm">{destText}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Trip Type</p>
                <p className="font-bold text-white">{booking.trip_type}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-800/80">
              <div>
                <p className="text-slate-400 text-xs">Travel Date</p>
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {booking.travel_date}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Return Date</p>
                <p className="font-bold text-white">
                  {booking.return_date || 'One Way Drop'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-800/80">
              <div>
                <p className="text-slate-400 text-xs">Vehicle Assigned / Selected</p>
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-amber-400" />
                  {booking.vehicle_name}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Total Travellers</p>
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  {booking.total_passengers} ({booking.travellers_adults} Adults{booking.travellers_children > 0 ? `, ${booking.travellers_children} Kids` : ''}{booking.travellers_seniors > 0 ? `, ${booking.travellers_seniors} Seniors` : ''})
                </p>
              </div>
            </div>

            <div className="pb-3 border-b border-slate-800/80">
              <p className="text-slate-400 text-xs">Pickup Location</p>
              <p className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{booking.pickup_location}</span>
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-slate-400 text-xs">Estimated Fare</p>
                <p className="text-xl font-black text-amber-400">
                  ₹{booking.estimated_fare}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-full">
                  Status: {booking.status}
                </span>
              </div>
            </div>

          </div>

          {/* Special Requests or Admin Notes */}
          {booking.special_requests && (
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-amber-400">Special Request: </span>
              {booking.special_requests}
            </div>
          )}

          {/* Pricing Disclaimer */}
          <p className="text-[11px] text-slate-400 italic text-center">
            * Estimated fare is calculated on standard highway rates. Final fare & driver details will be confirmed directly by Khushi Travels.
          </p>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2 no-print">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>💬 WhatsApp Khushi Travels</span>
              </button>

              <a
                href={`tel:${business.primaryPhone}`}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>📞 Call Helpline (9634400179)</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href={business.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>📍 View Mathura Office on Maps</span>
              </a>

              <button
                type="button"
                onClick={handlePrint}
                className="w-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <Printer className="w-3.5 h-3.5 text-slate-300" />
                <span>📄 Print / Save Booking Summary</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full text-center text-xs text-slate-400 hover:text-white py-2"
            >
              Done & Return to Homepage
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
