import React, { useState, useMemo } from 'react';
import { Car, Users, Sparkles, Filter, CheckCircle2, ShieldCheck } from 'lucide-react';
import VehicleCard from './VehicleCard.jsx';
import { recommendVehicleCategory } from '../utils/pricing.js';

export default function VehicleGrid({ vehicles, onBookVehicle }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [passengerCount, setPassengerCount] = useState(4);

  const categories = ['All', 'Sedan', 'SUV', 'Premium', 'Group Travel'];

  const recommendation = useMemo(() => {
    return recommendVehicleCategory(passengerCount);
  }, [passengerCount]);

  const filteredVehicles = useMemo(() => {
    if (selectedCategory === 'All') return vehicles;
    return vehicles.filter(v => v.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [vehicles, selectedCategory]);

  return (
    <section id="vehicles" className="py-16 bg-slate-950 text-white border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-3.5 py-1 rounded-full text-xs font-bold mb-3 border border-amber-500/20">
            <Car className="w-3.5 h-3.5" />
            <span>Khushi Travels Vehicle Fleet</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Comfortable & Sanitized Vehicles for Every Journey
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            From economic AC sedans for couple temple visits to luxury Innova Crystas and 12–26 seater Maharaja Tempo Travellers for joint family pilgrim groups.
          </p>
        </div>

        {/* Smart Vehicle Recommendation Helper Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-amber-500/30 rounded-3xl p-5 mb-10 shadow-xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                Vehicle Recommendation Engine
              </p>
              <p className="text-sm font-extrabold text-white">
                How many people are travelling?
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                Recommended: <strong className="text-amber-300">{recommendation.badge}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-700">
            {[2, 4, 6, 7, 12, 17, 26].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => setPassengerCount(num)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  passengerCount === num
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {num} Pax
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs Filter */}
        <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto pb-1 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl font-extrabold transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map(veh => (
            <VehicleCard
              key={veh.id}
              vehicle={veh}
              onBookVehicle={onBookVehicle}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
