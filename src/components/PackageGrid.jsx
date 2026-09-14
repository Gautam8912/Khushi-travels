import React, { useState } from 'react';
import { Package, Sparkles, X, Check, ArrowRight, Clock, ShieldCheck, MapPin, MessageSquare, Phone } from 'lucide-react';
import PackageCard from './PackageCard.jsx';
import { business } from '../data/business.js';
import { generatePackageInquiryWhatsAppMessage, buildWhatsAppUrl } from '../utils/whatsapp.js';

export default function PackageGrid({ packages, onBookPackage }) {
  const [selectedModalPackage, setSelectedModalPackage] = useState(null);

  const handleWhatsApp = (pkg) => {
    const msg = generatePackageInquiryWhatsAppMessage(pkg.title, pkg.duration, pkg.startingPrice);
    window.open(buildWhatsAppUrl(msg), '_blank');
  };

  return (
    <section id="packages" className="py-16 bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-3.5 py-1 rounded-full text-xs font-bold mb-3 border border-amber-500/20">
            <Package className="w-3.5 h-3.5" />
            <span>Curated Pilgrimage & Holiday Packages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Handcrafted Tour Packages with Khushi Travels
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            All-inclusive vehicle packages covering Braj Bhoomi, Taj Mahal, Ayodhya Ram Mandir, Varanasi Kashi Vishwanath, Golden Triangle, and Himalayan hill circuits.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onSelectPackage={(p) => setSelectedModalPackage(p)}
              onBookPackage={onBookPackage}
            />
          ))}
        </div>

      </div>

      {/* Package Detail Modal (Itinerary + Inclusions / Exclusions) */}
      {selectedModalPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl text-white max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="relative h-56 sm:h-64 w-full shrink-0">
              <img
                src={selectedModalPackage.image}
                alt={selectedModalPackage.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              
              <button
                onClick={() => setSelectedModalPackage(null)}
                className="absolute top-4 right-4 bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white p-2 rounded-full border border-slate-700 backdrop-blur-md transition-all"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500 text-slate-950">
                    {selectedModalPackage.duration}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-900/80 text-amber-300 border border-amber-500/30">
                    Starting ₹{selectedModalPackage.startingPrice}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {selectedModalPackage.title}
                </h3>
              </div>
            </div>

            {/* Modal Scroll Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-200 text-xs sm:text-sm">
              
              <div>
                <h4 className="font-bold text-amber-400 uppercase tracking-wider text-xs mb-1.5">
                  Package Overview
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {selectedModalPackage.description}
                </p>
              </div>

              {/* Day-by-Day Itinerary */}
              {selectedModalPackage.itinerary && selectedModalPackage.itinerary.length > 0 && (
                <div>
                  <h4 className="font-bold text-amber-400 uppercase tracking-wider text-xs mb-3 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" /> Day-by-Day Itinerary
                  </h4>
                  <div className="space-y-3">
                    {selectedModalPackage.itinerary.map((item, idx) => (
                      <div key={idx} className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                        <span className="text-xs font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                          {item.day}: {item.title}
                        </span>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                          {item.details}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Inclusions */}
                <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-2xl">
                  <h5 className="font-bold text-emerald-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" /> What's Included
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedModalPackage.inclusions && selectedModalPackage.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div className="bg-rose-950/20 border border-rose-500/30 p-4 rounded-2xl">
                  <h5 className="font-bold text-rose-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <X className="w-4 h-4 text-rose-400" /> What's Not Included
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedModalPackage.exclusions && selectedModalPackage.exclusions.map((exc, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">✕</span>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleWhatsApp(selectedModalPackage)}
                  className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Ask on WhatsApp</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  const p = selectedModalPackage;
                  setSelectedModalPackage(null);
                  onBookPackage(p);
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-6 py-3 rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <span>Book This Tour Package</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
