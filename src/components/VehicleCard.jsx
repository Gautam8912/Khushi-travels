import React from 'react';
import { Users, Briefcase, Wind, CheckCircle2, MessageSquare, Calendar, Star, ShieldCheck } from 'lucide-react';
import { business } from '../data/business.js';
import { generateVehicleInquiryWhatsAppMessage, buildWhatsAppUrl } from '../utils/whatsapp.js';

export default function VehicleCard({ vehicle, onBookVehicle }) {
  const handleWhatsApp = () => {
    const text = generateVehicleInquiryWhatsAppMessage(vehicle.name, vehicle.seats);
    window.open(buildWhatsAppUrl(text), '_blank');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col group">
      
      {/* Vehicle Image Container */}
      <div className="relative h-52 overflow-hidden bg-slate-950">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-md">
          {vehicle.category}
        </span>

        {/* Availability Badge */}
        {vehicle.available ? (
          <span className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Available
          </span>
        ) : (
          <span className="absolute top-3 right-3 bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md">
            Booked
          </span>
        )}

        {/* Bottom Title on Image */}
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-xl font-black text-white tracking-tight">
            {vehicle.name}
          </h3>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-slate-200">
        
        {/* Specs Badges */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800/80 text-center text-xs">
          <div className="flex flex-col items-center justify-center">
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Capacity</span>
            <span className="font-extrabold text-white flex items-center gap-1 mt-0.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              {vehicle.seats} Seats
            </span>
          </div>

          <div className="flex flex-col items-center justify-center border-x border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Luggage</span>
            <span className="font-extrabold text-white flex items-center gap-1 mt-0.5">
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              {vehicle.luggageCapacity} Bags
            </span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <span className="text-slate-400 text-[10px] uppercase font-semibold">AC Type</span>
            <span className="font-extrabold text-white flex items-center gap-1 mt-0.5">
              <Wind className="w-3.5 h-3.5 text-amber-400" />
              Dual AC
            </span>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
          {vehicle.description}
        </p>

        {/* Features List */}
        {vehicle.features && vehicle.features.length > 0 && (
          <div className="space-y-1">
            {vehicle.features.slice(0, 3).map((feat, i) => (
              <p key={i} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{feat}</span>
              </p>
            ))}
          </div>
        )}

        {/* Pricing Box */}
        <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-amber-500/20 p-3.5 rounded-2xl">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Outstation Rate</span>
              <p className="text-lg font-black text-amber-400">
                ₹{vehicle.perKmPrice} <span className="text-xs font-normal text-slate-400">/ KM</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Daily Package</span>
              <p className="text-lg font-black text-white">
                ₹{vehicle.perDayPrice} <span className="text-xs font-normal text-slate-400">/ Day</span>
              </p>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 mt-1.5 pt-1.5 border-t border-slate-800 flex items-center justify-between">
            <span>Driver Allowance: ₹{vehicle.driverAllowance}/day</span>
            <span className="text-amber-400 font-medium">Fastag Included</span>
          </p>
        </div>

        {/* Action CTAs */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleWhatsApp}
            className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 font-bold py-2.5 px-3 rounded-xl text-xs transition-colors border border-slate-700 flex items-center justify-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Ask on WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => onBookVehicle(vehicle)}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 px-3 rounded-xl text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Cab</span>
          </button>
        </div>

      </div>
    </div>
  );
}
