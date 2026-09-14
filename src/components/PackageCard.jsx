import React from 'react';
import { Clock, MapPin, CheckCircle2, ArrowRight, Star, ShieldCheck, MessageSquare } from 'lucide-react';
import { generatePackageInquiryWhatsAppMessage, buildWhatsAppUrl } from '../utils/whatsapp.js';

export default function PackageCard({ pkg, onSelectPackage, onBookPackage }) {
  const handleWhatsApp = () => {
    const msg = generatePackageInquiryWhatsAppMessage(pkg.title, pkg.duration, pkg.startingPrice);
    window.open(buildWhatsAppUrl(msg), '_blank');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col group">
      
      {/* Top Image Banner */}
      <div className="relative h-52 overflow-hidden bg-slate-950">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

        {/* Popular Tag */}
        {pkg.popular && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-current" />
            Top Recommended
          </span>
        )}

        {/* Duration Badge */}
        <span className="absolute top-3 right-3 bg-slate-950/80 text-amber-300 border border-slate-700 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {pkg.duration}
        </span>

        {/* Starting Price Overlay */}
        <div className="absolute bottom-3 right-3 bg-amber-500 text-slate-950 px-3 py-1 rounded-xl font-black text-xs shadow-lg">
          Starting ₹{pkg.startingPrice}
        </div>
      </div>

      {/* Package Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          <h3 className="text-lg font-black text-white tracking-tight leading-snug group-hover:text-amber-400 transition-colors">
            {pkg.title}
          </h3>

          {/* Destinations Included */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {pkg.destinations && pkg.destinations.map((d, idx) => (
              <span key={idx} className="bg-slate-800 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-slate-700">
                {d}
              </span>
            ))}
          </div>

          <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
            {pkg.description}
          </p>
        </div>

        {/* Highlights */}
        {pkg.highlights && pkg.highlights.length > 0 && (
          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 space-y-1.5 text-xs">
            <p className="text-[11px] font-bold text-amber-400">Package Highlights:</p>
            {pkg.highlights.slice(0, 2).map((h, i) => (
              <p key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5 line-clamp-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{h}</span>
              </p>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onSelectPackage(pkg)}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-colors border border-slate-700"
          >
            View Itinerary
          </button>

          <button
            type="button"
            onClick={() => onBookPackage(pkg)}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 px-3 rounded-xl text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1"
          >
            <span>Book Tour</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
