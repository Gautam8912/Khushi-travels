import React, { useState } from 'react';
import { Search, Calendar, Users, MapPin, ArrowRight, ShieldCheck, Clock, Award, Star, CheckCircle2 } from 'lucide-react';
import { business } from '../data/business.js';

export default function Hero({ onOpenBooking, onSearchDestination, destinations = [] }) {
  const [pickup, setPickup] = useState('Mathura New Bus Stand (Main Office)');
  const [destinationInput, setDestinationInput] = useState('');
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState(4);
  const [tripType, setTripType] = useState('Round Trip');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Today's date for minimum calendar bounds
  const todayStr = new Date().toISOString().split('T')[0];

  const handleDestinationChange = (val) => {
    setDestinationInput(val);
    if (val.trim().length > 0) {
      const filtered = destinations.filter(d => 
        d.name.toLowerCase().includes(val.toLowerCase()) ||
        d.city.toLowerCase().includes(val.toLowerCase()) ||
        d.state.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (destName) => {
    setDestinationInput(destName);
    setShowSuggestions(false);
  };

  const handleQuickSearch = (e) => {
    e.preventDefault();
    onOpenBooking({
      pickupLocation: pickup,
      destinationName: destinationInput || 'Mathura + Vrindavan',
      travelDate,
      returnDate: tripType === 'One Way' ? '' : returnDate,
      passengers,
      tripType
    });
  };

  const popularQuickPills = ['Mathura', 'Vrindavan', 'Agra', 'Ayodhya', 'Varanasi', 'Jaipur', 'Goa', 'Manali'];

  return (
    <section className="relative min-h-[640px] lg:min-h-[720px] bg-slate-950 text-white flex flex-col justify-center overflow-hidden">
      
      {/* Background Image with Deep Luxury Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2000&q=85" 
          alt="Braj Vrindavan Mathura Prem Mandir Tourism" 
          className="w-full h-full object-cover object-center opacity-30 scale-105 transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full">
        
        {/* Brand Tagline Badge */}
        <div className="flex flex-wrap items-center gap-3 mb-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Mathura’s #1 Verified Tour & Travel Cab Service</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Govt. Registered • Fastag Enabled • Clean Fleet</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="max-w-3xl mb-8">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Your Journey <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">Starts Here</span>
          </h1>
          <p className="text-lg sm:text-xl text-amber-200/90 font-medium mt-2">
            “{business.tagline}” <span className="text-slate-400 text-sm sm:text-base">— {business.taglineHindi}</span>
          </p>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Comfortable journeys, trusted vehicles, experienced local chauffeurs, and memorable trips with Khushi Travels. Book Braj Darshan, outstation cabs, and all-India pilgrimage packages effortlessly.
          </p>
        </div>

        {/* Quick Search Floating Panel */}
        <div className="glass-panel-dark rounded-2xl p-4 sm:p-6 shadow-2xl border border-slate-700/80 max-w-5xl">
          
          {/* Trip Type Selector Tabs */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            {['Round Trip', 'One Way', 'Multi Day'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setTripType(type)}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  tripType === type
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
            <span className="ml-auto text-xs text-slate-400 hidden md:inline">
              📍 Pickup: Mathura & NCR Doorstep
            </span>
          </div>

          {/* Search Inputs Form */}
          <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5">
            
            {/* Pickup Location */}
            <div className="lg:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                From (Pickup Point)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                <select
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-medium"
                >
                  <option value="Mathura New Bus Stand (Main Office)">Mathura New Bus Stand (Office)</option>
                  <option value="Mathura Junction Railway Station">Mathura Junction Station</option>
                  <option value="Vrindavan Entry / Chhatikara">Vrindavan / Prem Mandir</option>
                  <option value="Agra Cantt / City">Agra Cantt / City</option>
                  <option value="Delhi IGI Airport (T1/T2/T3)">Delhi Airport (IGI T3)</option>
                  <option value="Noida / Greater Noida">Noida / Pari Chowk</option>
                  <option value="Other / Hotel Doorstep">Other / Hotel Doorstep</option>
                </select>
              </div>
            </div>

            {/* Destination Search with Autocomplete */}
            <div className="lg:col-span-3 relative">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Where do you want to go?
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Mathura, Vrindavan, Agra, Ayodhya..."
                  value={destinationInput}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  onFocus={() => destinationInput && setShowSuggestions(true)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
                />
              </div>

              {/* Instant Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-30 overflow-hidden">
                  {suggestions.map(s => (
                    <div
                      key={s.id}
                      onClick={() => handleSelectSuggestion(s.name)}
                      className="px-3.5 py-2.5 hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs border-b border-slate-800/60 last:border-0"
                    >
                      <div>
                        <p className="font-bold text-white">{s.name}</p>
                        <p className="text-[11px] text-slate-400">{s.state} • {s.type}</p>
                      </div>
                      <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-semibold">
                        Select
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Travel Date */}
            <div className={tripType === 'One Way' ? 'lg:col-span-3' : 'lg:col-span-2'}>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Travel Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-amber-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="date"
                  min={todayStr}
                  value={travelDate}
                  onChange={(e) => {
                    setTravelDate(e.target.value);
                    if (returnDate < e.target.value) {
                      setReturnDate(e.target.value);
                    }
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-2 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-medium"
                />
              </div>
            </div>

            {/* Return Date (if round trip or multi-day) */}
            {tripType !== 'One Way' && (
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Return Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-amber-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="date"
                    min={travelDate || todayStr}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-2 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>
              </div>
            )}

            {/* Travellers & Submit CTA */}
            <div className={tripType === 'One Way' ? 'lg:col-span-3' : 'lg:col-span-2'}>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Passengers
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-amber-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-medium"
                >
                  <option value={1}>1 Passenger</option>
                  <option value={2}>2 Passengers</option>
                  <option value={4}>4 Passengers (Sedan)</option>
                  <option value={5}>5 Passengers (SUV)</option>
                  <option value={7}>7 Passengers (Innova)</option>
                  <option value={12}>12 Passengers (Tempo)</option>
                  <option value={17}>17 Passengers (Tempo)</option>
                  <option value={26}>26 Passengers (Coach)</option>
                </select>
              </div>
            </div>

            {/* Search Trips Button */}
            <div className="lg:col-span-12 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Popular:</span>
                {popularQuickPills.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setDestinationInput(p);
                      onSearchDestination && onSearchDestination(p);
                    }}
                    className="px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-400 text-[11px] transition-colors border border-slate-700/50"
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Search className="w-4 h-4" />
                <span>Search Trips & Find Vehicles</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

          </form>
        </div>

        {/* Hero Features Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-4 border-t border-slate-800/60 max-w-5xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Verified Drivers</p>
              <p className="text-[11px] text-slate-400">Devotional & Punctual</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Star className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Transparent Pricing</p>
              <p className="text-[11px] text-slate-400">0% Hidden Charges</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">24/7 Office Support</p>
              <p className="text-[11px] text-slate-400">Mathura New Bus Stand</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Sanitized AC Cabs</p>
              <p className="text-[11px] text-slate-400">Dzire, Crysta, Tempo</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
