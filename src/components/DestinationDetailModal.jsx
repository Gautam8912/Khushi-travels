import React from 'react';
import { X, MapPin, Clock, Star, Compass, ArrowRight, ShieldCheck, Car, Phone, MessageSquare } from 'lucide-react';
import { business } from '../data/business.js';

export default function DestinationDetailModal({ destination, onClose, onPlanTrip }) {
  if (!destination) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl text-white max-h-[90vh] flex flex-col">
        
        {/* Header Hero Image */}
        <div className="relative h-64 sm:h-72 w-full shrink-0">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white p-2 rounded-full border border-slate-700 backdrop-blur-md transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges and Titles */}
          <div className="absolute bottom-4 left-6 right-6">
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-amber-500 text-slate-950 mb-2">
              {destination.type}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {destination.name}
            </h2>
            <p className="text-sm sm:text-base text-amber-300 font-medium flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{destination.city}, {destination.state}, India</span>
            </p>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200">
          
          {/* Overview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              Destination Overview
            </h4>
            <p className="text-sm leading-relaxed text-slate-300">
              {destination.description}
            </p>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-800/70 p-3.5 rounded-2xl border border-slate-700/60">
              <p className="text-xs text-slate-400 font-medium">Recommended Stay</p>
              <p className="text-base font-bold text-white mt-0.5 flex items-center gap-1">
                <Clock className="w-4 h-4 text-amber-400" />
                {destination.recommendedDays}
              </p>
            </div>

            <div className="bg-slate-800/70 p-3.5 rounded-2xl border border-slate-700/60">
              <p className="text-xs text-slate-400 font-medium">From Mathura Office</p>
              <p className="text-base font-bold text-white mt-0.5 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-amber-400" />
                {destination.distanceFromMathura === 0 ? 'Local (0 km)' : `${destination.distanceFromMathura} KM`}
              </p>
            </div>

            <div className="bg-slate-800/70 p-3.5 rounded-2xl border border-slate-700/60">
              <p className="text-xs text-slate-400 font-medium">Best Season to Visit</p>
              <p className="text-xs font-bold text-white mt-1 line-clamp-1">
                {destination.bestTime || 'October to March'}
              </p>
            </div>
          </div>

          {/* Best Attractions */}
          {destination.popularFor && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400" /> Must-Visit Attractions & Temples
              </h4>
              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60">
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {destination.popularFor}
                </p>
              </div>
            </div>
          )}

          {/* Popular Nearby Destinations */}
          {destination.nearbyPlaces && destination.nearbyPlaces.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-400" /> Popular Nearby Circuits
              </h4>
              <div className="flex flex-wrap gap-2">
                {destination.nearbyPlaces.map((place, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1"
                  >
                    <span className="text-amber-400">•</span> {place}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Available Cabs & Services */}
          <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 p-4 rounded-2xl">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Car className="w-4 h-4" /> Khushi Travels Vehicle Options
            </h4>
            <p className="text-xs text-slate-300">
              Sedans (Dzire, Etios), Family SUVs (Ertiga, Innova Crysta), Luxury Coaches (12/17 Seater Maharaja Tempo Travellers). All vehicles air-conditioned with verified experienced highway chauffeurs.
            </p>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <a
              href={`https://wa.me/91${business.whatsapp}?text=${encodeURIComponent(`Radhe Radhe! Khushi Travels, I want to inquire about trip package to ${destination.name}. Please share cab fares & details.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Inquiry</span>
            </a>

            <a
              href={`tel:${business.primaryPhone}`}
              className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Call Us</span>
            </a>
          </div>

          <button
            onClick={() => {
              onClose();
              onPlanTrip(destination);
            }}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <span>Plan My Trip to {destination.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
}
