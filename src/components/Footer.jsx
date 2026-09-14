import React from 'react';
import { Car, MapPin, Phone, MessageSquare, Mail, ShieldCheck, Heart, ExternalLink, UserCheck } from 'lucide-react';
import { business } from '../data/business.js';

export default function Footer({ onOpenBooking, onOpenTracker, onOpenAdmin, onNavigate }) {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900 pt-16 pb-24 md:pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Story */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Car className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg tracking-tight text-white">
                  KHUSHI TRAVELS
                </h3>
                <p className="text-[11px] text-amber-400 font-semibold">
                  {business.taglineHindi}
                </p>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs">
              Mathura's premier tour and cab booking agency. Providing reliable, sanitized vehicles and knowledgeable chauffeurs for Braj Bhoomi pilgrimage, heritage circuits, and all-India travel.
            </p>

            <div className="pt-1">
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Government Registered Operator
              </p>
              <p className="text-amber-400 font-mono text-xs mt-0.5">
                All-India Commercial Tourist Permit
              </p>
            </div>
          </div>

          {/* Col 2: Popular Tour Circuits */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider text-amber-400">
              Popular Tour Circuits
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button onClick={() => onNavigate('destinations')} className="hover:text-amber-400 transition-colors text-left">
                  • Mathura – Vrindavan Braj Darshan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('destinations')} className="hover:text-amber-400 transition-colors text-left">
                  • Govardhan – Barsana – Gokul Parikrama
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('destinations')} className="hover:text-amber-400 transition-colors text-left">
                  • Agra Taj Mahal & Fatehpur Sikri
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('destinations')} className="hover:text-amber-400 transition-colors text-left">
                  • Ayodhya Ram Mandir & Kashi Varanasi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('destinations')} className="hover:text-amber-400 transition-colors text-left">
                  • Haridwar & Rishikesh Ganga Aarti
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('destinations')} className="hover:text-amber-400 transition-colors text-left">
                  • Golden Triangle (Delhi – Agra – Jaipur)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider text-amber-400">
              Quick Links
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button onClick={() => onOpenBooking()} className="hover:text-amber-400 transition-colors text-left font-bold text-amber-300">
                  ⚡ Online Cab Booking
                </button>
              </li>
              <li>
                <button onClick={onOpenTracker} className="hover:text-amber-400 transition-colors text-left">
                  🔍 Track Your Booking Status
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('vehicles')} className="hover:text-amber-400 transition-colors text-left">
                  🚗 Our Vehicle Fleet & Fares
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('packages')} className="hover:text-amber-400 transition-colors text-left">
                  📦 Handcrafted Tour Packages
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('custom-tour')} className="hover:text-amber-400 transition-colors text-left">
                  🗺️ Multi-City Route Planner
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="hover:text-amber-400 transition-colors text-left flex items-center gap-1 text-slate-400">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Admin Management Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Office Location & Phones */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider text-amber-400">
              Contact & Location
            </h4>
            
            <div className="space-y-2 text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Mathura New Bus Stand</strong><br />
                  {business.location.address}
                </span>
              </p>

              <div className="pt-2">
                <a
                  href={business.location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 px-3 py-1.5 rounded-xl border border-slate-800 transition-colors font-bold text-[11px]"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>📍 View on Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="pt-2 space-y-1">
                <p className="text-slate-400 text-[11px]">Helpline Numbers:</p>
                {business.phones.map((phone, idx) => (
                  <p key={idx}>
                    <a href={`tel:${phone}`} className="hover:text-amber-400 font-mono font-bold">
                      📞 +91 {phone}
                    </a>
                  </p>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
          <p>
            © 2026 <strong>Khushi Travels</strong>. All rights reserved. Registered Indian Tour & Travel Service.
          </p>
          <div className="flex items-center space-x-4">
            <button onClick={onOpenAdmin} className="text-slate-400 hover:text-amber-400 transition-colors">
              Admin Login
            </button>
            <span>•</span>
            <span className="text-slate-400">Mathura, Uttar Pradesh, India</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
