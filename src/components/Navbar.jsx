import React, { useState } from 'react';
import { Phone, MessageSquare, MapPin, Calendar, Car, Shield, Menu, X, Compass, Search, UserCheck } from 'lucide-react';
import { business } from '../data/business.js';

export default function Navbar({ onOpenBooking, onOpenTracker, onOpenAdmin, activeSection, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Destinations', id: 'destinations' },
    { label: 'Our Fleet', id: 'vehicles' },
    { label: 'Tour Packages', id: 'packages' },
    { label: 'Custom Tour', id: 'custom-tour' },
    { label: 'Office & Maps', id: 'location' },
    { label: 'Reviews', id: 'reviews' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleItemClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg transition-all">
      {/* Top micro-bar for phone & office location */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 px-4 py-1.5 text-xs font-semibold">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-900" />
              <span>Mathura New Bus Stand, Adarsh Nagar, Mathura (UP)</span>
            </span>
            <span className="hidden md:inline-block text-slate-900/40">•</span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-900">
              <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse"></span>
              24/7 Available for Braj Darshan & All-India Tours
            </span>
          </div>

          <div className="flex items-center space-x-3 ml-auto">
            <span className="text-slate-900 hidden sm:inline">Call Helpline:</span>
            <a 
              href={`tel:${business.primaryPhone}`} 
              className="font-bold underline hover:text-black transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              +91 {business.primaryPhone}
            </a>
            <span className="text-slate-900/40">|</span>
            <a 
              href={`https://wa.me/91${business.whatsapp}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded text-[11px] font-bold hover:bg-black transition-colors flex items-center gap-1"
            >
              <MessageSquare className="w-3 h-3 text-emerald-400" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleItemClick('home')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Car className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  KHUSHI TRAVELS
                </span>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30">
                  MATHURA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wide font-medium">
                {business.taglineHindi}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.id 
                    ? 'text-amber-400 bg-slate-800/80 font-semibold shadow-inner' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action CTA Buttons */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {/* Track Booking Button */}
            <button
              onClick={onOpenTracker}
              className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg border border-slate-700 transition-all flex items-center gap-1.5"
              title="Track your booking status with Booking ID & Phone"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>Track Trip</span>
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={onOpenAdmin}
              className="text-xs font-semibold text-slate-400 hover:text-amber-400 bg-slate-800/60 hover:bg-slate-800 px-2.5 py-2 rounded-lg border border-slate-700/60 transition-all flex items-center gap-1"
              title="Khushi Travels Admin Dashboard"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            {/* Primary CTA: Book Now */}
            <button
              onClick={() => onOpenBooking()}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Now</span>
            </button>
          </div>

          {/* Mobile menu hamburger button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={onOpenTracker}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg text-xs"
              title="Track Trip"
            >
              <Search className="w-4 h-4 text-amber-400" />
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-2xl">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                  activeSection === item.id
                    ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Cab / Tour Package</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${business.primaryPhone}`}
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call Us</span>
              </a>

              <a
                href={`https://wa.me/91${business.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
              className="w-full text-center text-xs text-slate-400 hover:text-amber-400 py-2"
            >
              🔐 Admin Management Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
