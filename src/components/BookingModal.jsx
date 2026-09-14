import React, { useState, useEffect, useMemo } from 'react';
import { X, Calendar, Users, MapPin, Car, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Phone, Clock, FileText, Info } from 'lucide-react';
import { createBooking } from '../services/api.js';
import { calculateEstimatedFare, recommendVehicleCategory } from '../utils/pricing.js';
import { business } from '../data/business.js';
import BookingConfirmation from './BookingConfirmation.jsx';

export default function BookingModal({
  isOpen,
  onClose,
  initialData = {},
  vehicles = [],
  destinations = [],
  pickupLocations = []
}) {
  if (!isOpen) return null;

  // Step state (1: Trip, 2: Passengers & Vehicle, 3: Customer Info, 4: Review)
  const [step, setStep] = useState(1);

  // Form Fields
  const [tripType, setTripType] = useState(initialData.tripType || 'Round Trip');
  const [destinationInput, setDestinationInput] = useState(initialData.destinationName || 'Mathura + Vrindavan');
  const [pickupLocation, setPickupLocation] = useState(initialData.pickupLocation || 'Mathura New Bus Stand (Main Office)');
  const [pickupAddress, setPickupAddress] = useState('');
  
  const todayStr = new Date().toISOString().split('T')[0];
  const [travelDate, setTravelDate] = useState(initialData.travelDate || (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  })());

  const [returnDate, setReturnDate] = useState(initialData.returnDate || (() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  })());

  // Passengers
  const [adults, setAdults] = useState(initialData.passengers ? Math.min(initialData.passengers, 4) : 4);
  const [children, setChildren] = useState(0);
  const [seniors, setSeniors] = useState(0);

  // Vehicle & Package
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialData.vehicleId || '');
  const [packageId, setPackageId] = useState(initialData.packageId || '');
  const [packageTitle, setPackageTitle] = useState(initialData.packageTitle || '');

  // Customer Details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState(initialData.specialRequests || '');

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [completedBooking, setCompletedBooking] = useState(null);

  // Total Passengers
  const totalPassengers = useMemo(() => {
    return Number(adults) + Number(children) + Number(seniors);
  }, [adults, children, seniors]);

  // Recommendation
  const recommendation = useMemo(() => {
    return recommendVehicleCategory(totalPassengers);
  }, [totalPassengers]);

  // Set default vehicle recommendation if none selected
  useEffect(() => {
    if (!selectedVehicleId && vehicles.length > 0) {
      const match = vehicles.find(v => recommendation.recommendedVehicleIds.includes(v.id)) || vehicles[0];
      if (match) setSelectedVehicleId(match.id);
    }
  }, [recommendation, vehicles, selectedVehicleId]);

  const selectedVehicle = useMemo(() => {
    return vehicles.find(v => v.id === selectedVehicleId) || vehicles[0] || null;
  }, [vehicles, selectedVehicleId]);

  // Days count
  const tripDays = useMemo(() => {
    if (tripType === 'One Way') return 1;
    if (!travelDate || !returnDate) return 1;
    const diffMs = new Date(returnDate).getTime() - new Date(travelDate).getTime();
    const days = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(days, 1);
  }, [tripType, travelDate, returnDate]);

  // Estimated Fare
  const estimatedFare = useMemo(() => {
    return calculateEstimatedFare({
      tripType,
      destinations: [destinationInput],
      vehicle: selectedVehicle,
      days: tripDays,
      packagePrice: initialData.packageStartingPrice || null
    });
  }, [tripType, destinationInput, selectedVehicle, tripDays, initialData]);

  // Capacity Warning
  const capacityWarning = useMemo(() => {
    if (selectedVehicle && totalPassengers > selectedVehicle.seats) {
      return `Warning: Selected vehicle (${selectedVehicle.name}) accommodates up to ${selectedVehicle.seats} passengers. You have ${totalPassengers} passengers. Please choose a larger vehicle or Tempo Traveller.`;
    }
    return null;
  }, [selectedVehicle, totalPassengers]);

  // Step 1 Validation
  const validateStep1 = () => {
    if (!destinationInput.trim()) {
      setErrorMsg('Please specify your destination.');
      return false;
    }
    if (!travelDate) {
      setErrorMsg('Please select a travel date.');
      return false;
    }
    if (travelDate < todayStr) {
      setErrorMsg('Travel date cannot be in the past.');
      return false;
    }
    if (tripType !== 'One Way') {
      if (!returnDate) {
        setErrorMsg('Please select a return date for round trip.');
        return false;
      }
      if (returnDate < travelDate) {
        setErrorMsg('Return date cannot be before travel date.');
        return false;
      }
    }
    setErrorMsg('');
    return true;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (totalPassengers <= 0) {
      setErrorMsg('Please select at least 1 passenger.');
      return false;
    }
    if (selectedVehicle && totalPassengers > selectedVehicle.seats) {
      setErrorMsg(`This vehicle cannot accommodate ${totalPassengers} passengers. Please select a larger vehicle.`);
      return false;
    }
    setErrorMsg('');
    return true;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMsg('Please enter your full name.');
      return false;
    }
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) setStep(4);
  };

  const handlePrev = () => {
    setErrorMsg('');
    setStep(prev => Math.max(1, prev - 1));
  };

  // Final Submission Handler (Idempotent)
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.replace(/\D/g, ''),
        customerWhatsapp: customerWhatsapp ? customerWhatsapp.replace(/\D/g, '') : customerPhone.replace(/\D/g, ''),
        customerEmail: customerEmail.trim().toLowerCase(),
        tripType,
        destinations: [destinationInput],
        pickupLocation,
        pickupAddress: pickupAddress.trim(),
        travelDate,
        returnDate: tripType === 'One Way' ? '' : returnDate,
        travellersAdults: adults,
        travellersChildren: children,
        travellersSeniors: seniors,
        vehicleId: selectedVehicle?.id || 'maruti-dzire',
        vehicleName: selectedVehicle?.name || 'AC Sedan',
        packageId: packageId || null,
        packageTitle: packageTitle || null,
        specialRequests: specialRequests.trim(),
        estimatedFare
      };

      const result = await createBooking(payload);
      if (result.success && result.booking) {
        setCompletedBooking(result.booking);
      } else {
        throw new Error(result.error || 'Unable to place booking.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Booking submission failed. Please try again or WhatsApp us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  // If completed, render the confirmation receipt
  if (completedBooking) {
    return (
      <BookingConfirmation
        booking={completedBooking}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl text-white my-8 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Step {step} of 4
              </span>
              <h3 className="text-lg font-black text-white">
                {step === 1 && 'Trip & Itinerary Details'}
                {step === 2 && 'Passengers & Vehicle Selection'}
                {step === 3 && 'Contact & Pickup Information'}
                {step === 4 && 'Review & Confirm Booking'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Khushi Travels • Mathura New Bus Stand
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Step Indicator Bar */}
        <div className="w-full bg-slate-800 h-1 shrink-0">
          <div
            className="bg-gradient-to-r from-amber-500 to-amber-400 h-1 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-200">
          
          {/* Global Error Banner */}
          {errorMsg && (
            <div className="bg-rose-500/20 border border-rose-500/40 text-rose-300 p-3.5 rounded-2xl text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ================= STEP 1: TRIP DETAILS ================= */}
          {step === 1 && (
            <div className="space-y-4">
              
              {/* Trip Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Trip Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Round Trip', 'One Way', 'Multi Day'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTripType(t)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        tripType === t
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Destination(s) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Mathura, Vrindavan, Agra, Ayodhya..."
                    value={destinationInput}
                    onChange={(e) => setDestinationInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-medium"
                    required
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2 text-[11px]">
                  <span className="text-slate-400">Quick suggestions:</span>
                  {['Mathura + Vrindavan', 'Agra Taj Mahal', 'Ayodhya', 'Varanasi', 'Haridwar - Rishikesh', 'Jaipur'].map(q => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setDestinationInput(q)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[10px] border border-slate-700"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pickup Location */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Pickup Location *
                </label>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-medium"
                >
                  <option value="Mathura New Bus Stand (Main Office)">Mathura New Bus Stand (Khushi Travels Main Office)</option>
                  <option value="Mathura Junction Railway Station">Mathura Junction Railway Station</option>
                  <option value="Mathura Cantt Railway Station">Mathura Cantt Railway Station</option>
                  <option value="Vrindavan Entry / Chhatikara Road">Vrindavan Entry / Chhatikara Road</option>
                  <option value="Prem Mandir / ISKCON Vrindavan">Prem Mandir / ISKCON Vrindavan</option>
                  <option value="Agra Cantt Railway Station">Agra Cantt Railway Station</option>
                  <option value="Delhi IGI Airport (T1/T2/T3)">Delhi IGI Airport (T1/T2/T3)</option>
                  <option value="Noida / Greater Noida (Pari Chowk)">Noida / Greater Noida (Pari Chowk)</option>
                  <option value="Other / Hotel Doorstep">Other / Hotel Doorstep (Specify below)</option>
                </select>
              </div>

              {/* Travel Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Travel Start Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-amber-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="date"
                      min={todayStr}
                      value={travelDate}
                      onChange={(e) => {
                        setTravelDate(e.target.value);
                        if (returnDate < e.target.value) setReturnDate(e.target.value);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-medium"
                      required
                    />
                  </div>
                </div>

                {tripType !== 'One Way' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Return Date *
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-amber-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="date"
                        min={travelDate || todayStr}
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-medium"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {tripType !== 'One Way' && (
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                  <span>Calculated Trip Duration:</span>
                  <strong className="text-amber-400">{tripDays} Days ({Math.max(1, tripDays - 1)} Nights)</strong>
                </div>
              )}

            </div>
          )}

          {/* ================= STEP 2: PASSENGERS & VEHICLE ================= */}
          {step === 2 && (
            <div className="space-y-5">
              
              {/* Passenger Breakdown Counters */}
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-400" />
                    Number of Travellers
                  </span>
                  <span className="text-xs font-extrabold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full">
                    Total: {totalPassengers} Passengers
                  </span>
                </div>

                {/* Adults */}
                <div className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-xs font-bold text-white">Adults</p>
                    <p className="text-[10px] text-slate-400">Ages 12+</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-7 h-7 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-bold flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-amber-400 text-sm">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="w-7 h-7 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-bold flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between py-1 border-t border-slate-800/60">
                  <div>
                    <p className="text-xs font-bold text-white">Children</p>
                    <p className="text-[10px] text-slate-400">Ages 2–11</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-7 h-7 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-bold flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-amber-400 text-sm">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(children + 1)}
                      className="w-7 h-7 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-bold flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Seniors */}
                <div className="flex items-center justify-between py-1 border-t border-slate-800/60">
                  <div>
                    <p className="text-xs font-bold text-white">Senior Citizens</p>
                    <p className="text-[10px] text-slate-400">Ages 60+ (Priority comfort seating)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSeniors(Math.max(0, seniors - 1))}
                      className="w-7 h-7 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-bold flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-amber-400 text-sm">{seniors}</span>
                    <button
                      type="button"
                      onClick={() => setSeniors(seniors + 1)}
                      className="w-7 h-7 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-bold flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Recommendation Note */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 text-xs text-amber-300 flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Recommendation: <strong>{recommendation.badge}</strong></span>
              </div>

              {/* Capacity Warning Alert */}
              {capacityWarning && (
                <div className="bg-rose-500/20 border border-rose-500/40 text-rose-300 p-3 rounded-2xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{capacityWarning}</span>
                </div>
              )}

              {/* Vehicle Selection Cards Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Choose Your Preferred Vehicle:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {vehicles.map(v => {
                    const isSelected = selectedVehicleId === v.id;
                    const isRecommended = recommendation.recommendedVehicleIds.includes(v.id);
                    const isTooSmall = totalPassengers > v.seats;

                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVehicleId(v.id)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 relative ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500 text-white shadow-md'
                            : isTooSmall
                            ? 'bg-slate-950/60 border-slate-800 text-slate-400 opacity-60'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200'
                        }`}
                      >
                        <img
                          src={v.image}
                          alt={v.name}
                          className="w-14 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0 text-xs">
                          <p className="font-bold text-white truncate">{v.name}</p>
                          <p className="text-[11px] text-slate-400">
                            {v.seats} Seats • AC • ₹{v.perKmPrice}/km
                          </p>
                        </div>

                        {isRecommended && (
                          <span className="absolute top-2 right-2 text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded font-bold">
                            Ideal
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ================= STEP 3: CONTACT & SPECIAL REQUESTS ================= */}
          {step === 3 && (
            <div className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mobile Number (for SMS & Call) *
                  </label>
                  <div className="relative">
                    <span className="text-xs text-slate-400 absolute left-3.5 top-3 font-semibold">+91</span>
                    <input
                      type="tel"
                      placeholder="98XXXXXXXX"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      maxLength={10}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-12 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    WhatsApp Number (Optional)
                  </label>
                  <div className="relative">
                    <span className="text-xs text-slate-400 absolute left-3.5 top-3 font-semibold">+91</span>
                    <input
                      type="tel"
                      placeholder="Leave blank if same"
                      value={customerWhatsapp}
                      onChange={(e) => setCustomerWhatsapp(e.target.value)}
                      maxLength={10}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-12 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com (for itinerary copy)"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Specific Pickup Address / Landmark
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hotel Radha Palace, Station Gate 1, or Adarsh Nagar..."
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Special Requests / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Senior citizen travelling, need low step entry, child seat, early morning 6 AM start..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

            </div>
          )}

          {/* ================= STEP 4: REVIEW & CONFIRM ================= */}
          {step === 4 && (
            <div className="space-y-4">
              
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3 text-xs">
                <p className="font-black text-amber-400 text-sm uppercase tracking-wider pb-2 border-b border-slate-800">
                  Trip Summary & Verification
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400">Destination:</span>
                    <p className="font-bold text-white mt-0.5">{destinationInput}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Trip Type:</span>
                    <p className="font-bold text-white mt-0.5">{tripType}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/60">
                  <div>
                    <span className="text-slate-400">Travel Date:</span>
                    <p className="font-bold text-white mt-0.5">{travelDate}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Return Date:</span>
                    <p className="font-bold text-white mt-0.5">{tripType === 'One Way' ? 'One Way' : returnDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/60">
                  <div>
                    <span className="text-slate-400">Vehicle:</span>
                    <p className="font-bold text-amber-300 mt-0.5">{selectedVehicle?.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Passengers:</span>
                    <p className="font-bold text-white mt-0.5">{totalPassengers} ({adults} Adults, {children} Kids, {seniors} Seniors)</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60">
                  <span className="text-slate-400">Pickup Point:</span>
                  <p className="font-bold text-white mt-0.5">{pickupLocation} {pickupAddress ? `(${pickupAddress})` : ''}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/60">
                  <span className="text-slate-400">Customer Details:</span>
                  <p className="font-bold text-white mt-0.5">{customerName} • +91 {customerPhone}</p>
                </div>

                {specialRequests && (
                  <div className="pt-2 border-t border-slate-800/60">
                    <span className="text-slate-400">Special Request:</span>
                    <p className="font-medium text-amber-300/90 mt-0.5">{specialRequests}</p>
                  </div>
                )}
              </div>

              {/* Estimated Fare Box with Strict Rule Compliance */}
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border border-amber-500/40 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-300">Estimated Fare</span>
                    <p className="text-2xl sm:text-3xl font-black text-amber-400">
                      ₹{estimatedFare}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-slate-950 text-amber-300 px-2 py-1 rounded-md font-semibold border border-amber-500/30">
                      Tolls & Fastag Included
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-amber-200/90 mt-2 italic">
                  * Estimated fare is based on standard distance calculation. Final fare will be confirmed by Khushi Travels team.
                </p>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">✓ Unique Booking ID generated</span>
                <span className="flex items-center gap-1">✓ Instant SMS dispatched</span>
                <span className="flex items-center gap-1">✓ Free cancellation</span>
                <span className="flex items-center gap-1">✓ 24/7 Mathura Office support</span>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitBooking}
              disabled={submitting}
              className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black px-6 py-3 rounded-xl text-xs sm:text-sm shadow-xl shadow-amber-500/30 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <span>Recording Booking & Dispatching SMS...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Booking Request</span>
                </>
              )}
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
