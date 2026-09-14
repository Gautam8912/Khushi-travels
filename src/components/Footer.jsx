import React from 'react';
import { Car, MapPin, Phone, MessageSquare, ExternalLink, Lock } from 'lucide-react';
import { business } from '../data/business.js';

export default function Footer({ onOpenBooking, onOpenOwner, onNavigate }) {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 md:pb-12 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
          
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Car className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-white">KHUSHI TRAVELS</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {business.taglineHindi} — Mathura's premier tour and cab service. Professional chauffeurs and clean AC vehicles for pilgrimage and outstation travel.
            </p>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">
              Office Location
            </h4>
            <p className="text-slate-400 text-xs">
              <strong>Mathura New Bus Stand</strong><br />
              {business.location.address}
            </p>
            <a
              href={business.location.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline inline-flex items-center gap-1 font-semibold text-xs mt-1"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>View on Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">
              24/7 Helpline
            </h4>
            <div className="space-y-1 font-mono text-xs">
              {business.phones.map((p, i) => (
                <p key={i}>
                  <a href={`tel:${p}`} className="hover:text-white">
                    📞 +91 {p}
                  </a>
                </p>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© 2026 Khushi Travels. All rights reserved. Mathura, Uttar Pradesh.</p>
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenOwner}
              className="text-slate-400 hover:text-amber-400 flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>Owner Management Login</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
