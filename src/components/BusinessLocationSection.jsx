import React from 'react';
import { MapPin, Navigation, ExternalLink, Phone, MessageSquare, Clock } from 'lucide-react';
import { business } from '../data/business.js';

export default function BusinessLocationSection() {
  return (
    <section id="location" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block">
            Main Office & Pickup
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Visit Our Mathura Office
          </h2>
          <p className="text-sm text-slate-600">
            We operate directly from Mathura New Bus Stand with 24/7 vehicle boarding and luggage assistance.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full uppercase">
                Primary Business Location
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                Khushi Travels
              </h3>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">
                📍 {business.location.name}
              </p>
            </div>

            <div className="text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl self-start sm:self-auto flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              24/7 Open & Active
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1 text-xs">
            <p className="text-slate-500 font-bold uppercase">Postal Address:</p>
            <p className="font-mono text-slate-800 text-sm font-semibold">
              {business.location.address}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            
            <a
              href={business.location.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-2xl text-sm shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <Navigation className="w-4 h-4 text-amber-400 fill-current" />
              <span>📍 View on Google Maps</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${business.primaryPhone}`}
                className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors text-center"
              >
                <Phone className="w-4 h-4 text-amber-700" />
                <span>Call Helpline</span>
              </a>

              <a
                href={`https://wa.me/91${business.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Location</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
