import React from 'react';
import { MapPin, Calendar, Compass, ArrowRight, Star, Clock } from 'lucide-react';

export default function DestinationCard({ destination, onSelect, onPlanTrip }) {
  const getCategoryColor = (cat) => {
    if (cat.includes('Religious') || cat.includes('Pilgrimage')) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    if (cat.includes('Hill')) return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
    if (cat.includes('Beaches')) return 'bg-teal-500/20 text-teal-400 border-teal-500/30';
    if (cat.includes('Historical')) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-amber-500/40 transition-all duration-300 flex flex-col group">
      
      {/* Image Container with Badges */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={destination.image}
          alt={`${destination.name}, ${destination.state}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
        
        {/* Category Tag */}
        <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md ${getCategoryColor(destination.type)}`}>
          {destination.type}
        </span>

        {/* Distance from Mathura */}
        {destination.distanceFromMathura > 0 && (
          <span className="absolute top-3 right-3 text-[11px] font-semibold bg-slate-950/80 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 backdrop-blur-md">
            {destination.distanceFromMathura} km from Mathura
          </span>
        )}

        {/* Name and State on Image */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            {destination.name}
          </h3>
          <p className="text-xs text-amber-300 font-medium flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{destination.city}, {destination.state}</span>
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        {/* Description Snippet */}
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
          {destination.description}
        </p>

        {/* Popular Spots Highlights */}
        {destination.popularFor && (
          <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-800">
            <p className="text-[11px] font-bold text-amber-400 mb-1 flex items-center gap-1">
              <Star className="w-3 h-3" /> Key Attractions:
            </p>
            <p className="text-[11px] text-slate-300 line-clamp-1">
              {destination.popularFor}
            </p>
          </div>
        )}

        {/* Recommended Duration & Best Time */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Rec: <strong className="text-slate-200">{destination.recommendedDays}</strong></span>
          </span>
          <span className="text-[11px] text-amber-300/80">
            {destination.bestTime ? 'Best: Winter/All Year' : 'All Season'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => onSelect(destination)}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold py-2 px-3 rounded-xl text-xs transition-colors border border-slate-700"
          >
            Explore Details
          </button>

          <button
            onClick={() => onPlanTrip(destination)}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 px-3 rounded-xl text-xs transition-all shadow-md shadow-amber-500/10 flex items-center justify-center gap-1 group-hover:bg-amber-400"
          >
            <span>Plan My Trip</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
