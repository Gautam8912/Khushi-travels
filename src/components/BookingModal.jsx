import React, { useState } from 'react';
import { X, Calendar, Users, MapPin, Phone, User, CheckCircle2, AlertCircle, ArrowRight, Clock, MessageSquare } from 'lucide-react';
import { createBookingRequest } from '../services/api.js';
import { business } from '../data/business.js';
import BookingConfirmation from './BookingConfirmation.jsx';

export default function BookingModal({
  isOpen,
  onClose,
  initialDestination = 'Mathura + Vrindavan'
}) {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const [destination, setDestination] = useState(initialDestination);
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState(4);
  const [pickupLocation, setPickupLocation] = useState('Mathura New Bus Stand (Main Office)');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [completedBooking, setCompletedBooking] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!travelDate) {
      setErrorMsg('Please select your travel date.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        destination: destination.trim() || 'Mathura + Vrindavan',
        travelDate,
        passengers: Number(passengers) || 1,
        pickupLocation,
        notes: notes.trim()
      };

      const result = await createBookingRequest(payload);
      if (result.success && result.booking) {
        setCompletedBooking(result.booking);
      } else {
        throw new Error(result.error || 'Failed to submit booking');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Submission failed. Please call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (completedBooking) {
    return (
      <BookingConfirmation
        booking={completedBooking}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl text-slate-900 my-8">
        
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full inline-block mb-1">
              Khushi Travels • Mathura
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Book Your Trip Request
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit your trip details. Our owner will call/WhatsApp you directly.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 text-xs">
          
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* 1. Destination */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Where do you want to go? *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Mathura, Vrindavan, Agra, Ayodhya..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white font-medium"
                />
              </div>
            </div>

            {/* 2. Date & People Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Travel Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="date"
                    min={todayStr}
                    required
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-2 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Number of People *
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-2 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white font-bold"
                  >
                    <option value={1}>1 Person</option>
                    <option value={2}>2 People</option>
                    <option value={4}>4 People (Car)</option>
                    <option value={6}>6 People (SUV)</option>
                    <option value={7}>7 People (Innova)</option>
                    <option value={12}>12 People (Tempo)</option>
                    <option value={17}>17 People (Tempo)</option>
                    <option value={26}>26+ People (Bus)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Pickup Location */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Pickup Location *
              </label>
              <select
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white font-medium"
              >
                <option value="Mathura New Bus Stand (Main Office)">Mathura New Bus Stand (Office)</option>
                <option value="Mathura Junction Railway Station">Mathura Junction Railway Station</option>
                <option value="Mathura Cantt Railway Station">Mathura Cantt Railway Station</option>
                <option value="Vrindavan Entry / Chhatikara">Vrindavan Entry / Chhatikara Road</option>
                <option value="Prem Mandir / ISKCON Vrindavan">Prem Mandir / ISKCON Vrindavan</option>
                <option value="Agra Cantt Railway Station">Agra Cantt Railway Station</option>
                <option value="Delhi IGI Airport (T1/T2/T3)">Delhi Airport (IGI T3)</option>
                <option value="Hotel / Residence Doorstep">Hotel / Residence Doorstep (Mention below)</option>
              </select>
            </div>

            {/* 4. Customer Details */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Your Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Kumar"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Mobile / WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98XXXXXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 5. Optional Note */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Any specific note? (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Need AC car, senior citizen travelling, morning 7 AM pickup..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white resize-none"
              />
            </div>

            {/* Practical Note */}
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-[11px] text-amber-900">
              📞 <strong>Direct Owner Contact:</strong> After submitting, Khushi Travels owner will call or WhatsApp you to confirm vehicle options, exact timing, and quote the best price.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <span>Submitting Request...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Submit Booking Request</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}
