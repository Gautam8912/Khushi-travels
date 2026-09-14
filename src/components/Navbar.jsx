import React from 'react';
import { Phone, MessageSquare, MapPin, Calendar, Car, Lock } from 'lucide-react';
import { business } from '../data/business.js';

export default function Navbar({ onOpenBooking, onOpenOwner, onNavigate }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs">
      
      {/* Top Office & Phone Micro-Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-1.5 text-xs text-slate-600">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Office: Mathura New Bus Stand, Uttar Pradesh</span>
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              24/7 Available for Cab & Tour Booking
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto text-xs font-semibold">
            <a
              href={`tel:${business.primaryPhone}`}
              className="text-slate-800 hover:text-amber-700 transition-colors flex items-center gap-1 font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>+91 {business.primaryPhone}</span>
            </a>
            <span className="text-slate-300">|</span>
            <a
              href={`https://wa.me/91${business.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-sm">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  KHUSHI TRAVELS
                </span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                  MATHURA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {business.taglineHindi}
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold text-slate-600">
            <button
              onClick={() => onNavigate('destinations')}
              className="hover:text-slate-900 transition-colors"
            >
              Destinations
            </button>
            <button
              onClick={() => onNavigate('location')}
              className="hover:text-slate-900 transition-colors"
            >
              Office & Location
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-slate-900 transition-colors"
            >
              Contact Us
            </button>
          </nav>

          {/* Right Action CTA Buttons */}
          <div className="flex items-center space-x-2.5">
            
            {/* Owner Login */}
            <button
              onClick={onOpenOwner}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-2 rounded-xl transition-all flex items-center gap-1"
              title="Khushi Travels Owner Dashboard"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Owner</span>
            </button>

            {/* Primary Action: Book This Trip */}
            <button
              onClick={() => onOpenBooking()}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-sm hover:shadow transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Book Trip</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
