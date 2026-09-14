import React from 'react';
import { MapPin, Navigation, ExternalLink, Phone, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { business } from '../data/business.js';

export default function BusinessLocationSection({ pickupLocations = [] }) {
  return (
    <section id="location" className="py-16 bg-slate-950 text-white border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-3.5 py-1 rounded-full text-xs font-bold mb-3 border border-amber-500/20">
            <MapPin className="w-3.5 h-3.5" />
            <span>Physical Office & Pickup Points</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Visit Our Mathura Office & Pickup Hubs
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            We are centrally located right at Mathura New Bus Stand with designated 24/7 boarding points across Mathura, Vrindavan, Agra, and Delhi-NCR.
          </p>
        </div>

        {/* Main Office Card & Map Directions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Main Business Location Card */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black bg-amber-500 text-slate-950 px-3 py-1 rounded-full uppercase tracking-wider">
                  Main Business Headquarters
                </span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Open 24/7
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {business.name}
                </h3>
                <p className="text-sm text-amber-400 font-bold mt-1">
                  📍 {business.location.name}
                </p>
              </div>

              {/* Exact Address Box */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Full Postal Address:
                </p>
                <p className="text-sm font-bold text-slate-100 leading-relaxed font-mono">
                  {business.location.address}
                </p>
              </div>

              {/* Key Amenities */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Luggage Safe-keep Available
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Air-Conditioned Waiting Lounge
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Immediate Spot Cab Dispatch
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Temple Timing Assistance
                </span>
              </div>
            </div>

            {/* Clickable Map and Contact Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              
              {/* Prominent Google Maps Button */}
              <a
                href={business.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3.5 px-4 rounded-2xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Navigation className="w-4 h-4 fill-current" />
                <span>📍 View on Google Maps</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${business.primaryPhone}`}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Call: {business.primaryPhone}</span>
                </a>

                <a
                  href={`https://wa.me/91${business.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Location</span>
                </a>
              </div>

            </div>

          </div>

          {/* Secondary Pickup Hubs List */}
          <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-base text-white mb-1 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Other Key Boarding Points</span>
              </h4>
              <p className="text-xs text-slate-400 mb-4">
                We provide prompt doorstep pickup across these hubs at no extra charges:
              </p>

              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {pickupLocations.slice(1).map(loc => (
                  <div
                    key={loc.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-white">{loc.name}</p>
                      <a
                        href={loc.google_maps_url || loc.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5 shrink-0"
                      >
                        <span>Maps</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {loc.address}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-xs text-amber-300">
              💡 <strong>Hotel / Residence Pickup:</strong> Staying at a hotel or dharamshala in Mathura / Vrindavan? Our chauffeur will arrive directly at your porch.
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
