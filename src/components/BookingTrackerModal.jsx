import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, XCircle, AlertCircle, Phone, MessageSquare, Car, MapPin, Calendar, Users, ShieldCheck } from 'lucide-react';
import { trackBooking } from '../services/api.js';
import { business } from '../data/business.js';
import { buildWhatsAppUrl } from '../utils/whatsapp.js';

export default function BookingTrackerModal({ onClose }) {
  const [bookingId, setBookingId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingResult, setBookingResult] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!bookingId.trim() || !phone.trim()) {
      setError('Please provide both your Booking ID and Mobile number.');
      return;
    }

    setLoading(true);
    setError('');
    setBookingResult(null);

    try {
      const data = await trackBooking(bookingId.trim(), phone.trim());
      setBookingResult(data);
    } catch (err) {
      setError(err.message || 'No booking found matching the provided Booking ID and Mobile number.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" /> CONFIRMED
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/40 px-3 py-1 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" /> COMPLETED
          </span>
        );
      case 'REJECTED':
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/40 px-3 py-1 rounded-full text-xs font-bold">
            <XCircle className="w-4 h-4" /> {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold">
            <Clock className="w-4 h-4" /> PENDING CONFIRMATION
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl text-white">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-amber-400" />
              <span>Track Your Booking Status</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter your Booking ID & registered Mobile number
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Booking ID (e.g. KT-20260914-0012)
              </label>
              <input
                type="text"
                placeholder="KT-20260914-XXXX"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono uppercase focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Registered Mobile Number
              </label>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            {error && (
              <div className="bg-rose-500/20 border border-rose-500/40 text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Looking Up...' : 'Check Trip Status'}
            </button>
          </form>

          {/* Result Card */}
          {bookingResult && (
            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-4 text-xs animate-fade-in">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Booking ID</span>
                  <p className="font-mono font-black text-amber-400 text-base">{bookingResult.booking_id}</p>
                </div>
                <div>
                  {getStatusBadge(bookingResult.status)}
                </div>
              </div>

              <div className="space-y-2 text-slate-300">
                <p><strong className="text-white">Customer:</strong> {bookingResult.customer_name} ({bookingResult.customer_phone})</p>
                <p><strong className="text-white">Route:</strong> {Array.isArray(bookingResult.destinations) ? bookingResult.destinations.join(' ➔ ') : bookingResult.destinations}</p>
                <p><strong className="text-white">Travel Date:</strong> {bookingResult.travel_date} {bookingResult.return_date ? `to ${bookingResult.return_date}` : ''}</p>
                <p><strong className="text-white">Vehicle:</strong> {bookingResult.vehicle_name}</p>
                <p><strong className="text-white">Pickup Point:</strong> {bookingResult.pickup_location}</p>
                <p><strong className="text-white">Estimated Fare:</strong> ₹{bookingResult.estimated_fare}</p>
              </div>

              {/* Driver and Vehicle Assignment details if Confirmed */}
              {bookingResult.status === 'CONFIRMED' && (
                <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl space-y-1 text-slate-200">
                  <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Driver & Vehicle Assigned:
                  </p>
                  <p className="text-[11px]">• Driver: {bookingResult.assigned_driver || 'Mahesh Ji (Contact: 9634400179)'}</p>
                  <p className="text-[11px]">• Vehicle No: {bookingResult.assigned_vehicle_no || 'UP 85 BX 4012'}</p>
                </div>
              )}

              {/* Cancellation note if rejected */}
              {(bookingResult.status === 'REJECTED' || bookingResult.status === 'CANCELLED') && (
                <div className="bg-rose-950/40 border border-rose-500/30 p-3 rounded-xl text-rose-300 text-xs">
                  {bookingResult.admin_notes || 'Booking declined. Please call 9634400179 for immediate alternative cab options.'}
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <a
                  href={`https://wa.me/91${business.whatsapp}?text=${encodeURIComponent(`Radhe Radhe! Khushi Travels, I am inquiring about my booking ${bookingResult.booking_id}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Help
                </a>

                <a
                  href={`tel:${business.primaryPhone}`}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 border border-slate-700"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" /> Call Office
                </a>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
