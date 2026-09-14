import React from 'react';
import { MapPin, Clock, ArrowRight } from 'lucide-react';

export default function DestinationCard({ destination, onSelect, onBook }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col group">
      
      {/* Destination Photo */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={destination.image}
          alt={`${destination.name}, ${destination.state}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Type Tag */}
        <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/95 text-slate-900 shadow-xs">
          {destination.type}
        </span>

        {/* Distance from Mathura */}
        {destination.distance_from_mathura > 0 && (
          <span className="absolute top-3 right-3 text-[11px] font-semibold bg-slate-900/80 text-white px-2 py-0.5 rounded-full backdrop-blur-xs">
            {destination.distance_from_mathura} km from Mathura
          </span>
        )}

        {/* Name on Image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-xl font-bold tracking-tight drop-shadow-xs">
            {destination.name}
          </h3>
          <p className="text-xs text-slate-200 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>{destination.city}, {destination.state}</span>
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {destination.description}
        </p>

        {/* Highlights */}
        {destination.popular_for && (
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px]">
            <p className="font-semibold text-slate-700 line-clamp-1">
              ⭐ {destination.popular_for}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Recommended: <strong className="text-slate-800">{destination.recommended_days}</strong></span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onSelect(destination)}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2 px-3 rounded-xl text-xs transition-colors text-center"
          >
            View Details
          </button>

          <button
            type="button"
            onClick={() => onBook(destination)}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1 shadow-xs"
          >
            <span>Book Trip</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>

      </div>
    </div>
  );
}
