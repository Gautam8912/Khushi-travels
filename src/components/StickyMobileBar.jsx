import React from 'react';
import { Phone, MessageSquare, Calendar } from 'lucide-react';
import { business } from '../data/business.js';

export default function StickyMobileBar({ onOpenBooking }) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-2.5 px-4 flex items-center justify-between gap-2 shadow-2xl">
      
      {/* Call Button */}
      <a
        href={`tel:${business.primaryPhone}`}
        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-bold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
      >
        <Phone className="w-4 h-4 text-amber-400" />
        <span>Call Us</span>
      </a>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/91${business.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md shadow-emerald-600/20"
      >
        <MessageSquare className="w-4 h-4" />
        <span>WhatsApp</span>
      </a>

      {/* Primary Book Now CTA */}
      <button
        type="button"
        onClick={() => onOpenBooking()}
        className="flex-[1.2] bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-lg shadow-amber-500/20"
      >
        <Calendar className="w-4 h-4" />
        <span>Book Cab</span>
      </button>

    </div>
  );
}
