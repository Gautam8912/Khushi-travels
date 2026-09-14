import React, { useState } from 'react';
import { Search, MapPin, ArrowRight, ShieldCheck, Phone, MessageSquare, CheckCircle2 } from 'lucide-react';
import { business } from '../data/business.js';

export default function Hero({ onOpenBooking, onSearchDestination, destinations = [] }) {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (val) => {
    setSearchInput(val);
    if (val.trim().length > 0) {
      const filtered = destinations.filter(d => 
        d.name.toLowerCase().includes(val.toLowerCase()) ||
        d.city.toLowerCase().includes(val.toLowerCase()) ||
        d.state.toLowerCase().includes(val.toLowerCase()) ||
        (d.popularFor && d.popularFor.toLowerCase().includes(val.toLowerCase()))
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (dest) => {
    setSearchInput(dest.name);
    setShowSuggestions(false);
    onOpenBooking({ destination: dest.name });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onOpenBooking({ destination: searchInput.trim() });
    } else {
      onOpenBooking();
    }
  };

  const popularDestinations = [
    'Mathura', 'Vrindavan', 'Agra', 'Ayodhya', 'Varanasi', 'Haridwar', 'Jaipur', 'Goa', 'Manali'
  ];

  return (
    <section className="bg-white border-b border-slate-200 py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-800 px-3.5 py-1.5 rounded-full text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>Mathura’s Trusted Tour & Cab Travel Service</span>
        </div>

        {/* Main Clean Headline */}
        <div className="space-y-3 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Explore India
          </h1>
          <p className="text-lg sm:text-xl font-medium text-slate-600">
            {business.tagline} <span className="text-amber-700 font-semibold">• {business.taglineHindi}</span>
          </p>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Book cabs and pilgrimage tours from Mathura New Bus Stand to all over India. Select your destination, fill simple details, and we handle everything.
          </p>
        </div>

        {/* Large Prominent Search Box */}
        <div className="max-w-2xl mx-auto relative">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-lg rounded-2xl border-2 border-slate-200 hover:border-slate-400 focus-within:border-slate-900 transition-all bg-white overflow-hidden p-1.5">
            <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
            <input
              type="text"
              placeholder="Where do you want to go? (e.g. Mathura, Vrindavan, Agra, Ayodhya...)"
              value={searchInput}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => searchInput && setShowSuggestions(true)}
              className="w-full bg-transparent px-3.5 py-3 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
            />
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shrink-0 transition-colors flex items-center gap-1.5"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </form>

          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-30 overflow-hidden text-left divide-y divide-slate-100">
              {suggestions.map(s => (
                <div
                  key={s.id}
                  onClick={() => handleSelectSuggestion(s)}
                  className="p-3.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.city}, {s.state} • {s.type}</p>
                  </div>
                  <span className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-lg">
                    Book Trip ➔
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Destination Pill Chips */}
        <div className="space-y-2.5 pt-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Popular Destinations:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {popularDestinations.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setSearchInput(p);
                  onOpenBooking({ destination: p });
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3.5 py-1.5 rounded-full text-xs transition-colors border border-slate-200 hover:border-slate-300"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Verified & Polite Drivers
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Clean AC Vehicles
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Direct Owner Quotation & Booking
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Office at Mathura New Bus Stand
          </span>
        </div>

      </div>
    </section>
  );
}
