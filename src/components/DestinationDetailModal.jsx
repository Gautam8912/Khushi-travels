import React from 'react';
import { X, MapPin, Clock, Star, ArrowRight, Phone, MessageSquare } from 'lucide-react';
import { business } from '../data/business.js';

export default function DestinationDetailModal({ destination, onClose, onBook }) {
  if (!destination) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl text-slate-900 my-8 flex flex-col max-h-[90vh]">
        
        {/* Top Image */}
        <div className="relative h-60 sm:h-72 w-full shrink-0 bg-slate-100">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-800 p-2 rounded-full shadow-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500 text-slate-950 inline-block mb-1.5 shadow-xs">
              {destination.type}
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">
              {destination.name}
            </h2>
            <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{destination.city}, {destination.state}, India</span>
            </p>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-sm">
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              About This Destination
            </h4>
            <p className="text-slate-700 leading-relaxed">
              {destination.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
            <div>
              <p className="text-slate-500 font-semibold">Recommended Stay:</p>
              <p className="font-bold text-slate-900 text-sm mt-0.5 flex items-center gap-1">
                <Clock className="w-4 h-4 text-amber-600" />
                {destination.recommended_days}
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-semibold">From Mathura Office:</p>
              <p className="font-bold text-slate-900 text-sm mt-0.5 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-amber-600" />
                {destination.distance_from_mathura === 0 ? 'Local (0 km)' : `${destination.distance_from_mathura} km`}
              </p>
            </div>
          </div>

          {destination.popular_for && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-600" /> Must-Visit Attractions & Temples
              </h4>
              <p className="bg-amber-50/60 border border-amber-200/80 p-3.5 rounded-2xl text-xs text-slate-800 font-medium leading-relaxed">
                {destination.popular_for}
              </p>
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs text-slate-600">
            ℹ️ <strong>Direct Owner Support:</strong> Khushi Travels owner will coordinate the driver, vehicle type, and exact schedule tailored to your family or group.
          </div>

        </div>

        {/* Actions Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`https://wa.me/91${business.whatsapp}?text=${encodeURIComponent(`Radhe Radhe! Khushi Travels, I want to inquire about trip to ${destination.name}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${business.primaryPhone}`}
              className="flex-1 sm:flex-none bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-slate-600" />
              <span>Call Owner</span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onBook(destination);
            }}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 transition-all"
          >
            <span>Book This Trip</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>

        </div>

      </div>
    </div>
  );
}
