import React, { useState } from 'react';
import { Plus, Trash2, MapPin, ArrowRight, Route, Calendar, Sparkles, Check, Car } from 'lucide-react';
import { initialDestinations } from '../data/destinations.js';

export default function MultiDestinationBuilder({ onOpenBooking }) {
  const [stops, setStops] = useState([
    { id: 'stop-1', name: 'Mathura', stayDays: 1, note: 'Shri Krishna Janmabhoomi & Yamuna Aarti' },
    { id: 'stop-2', name: 'Vrindavan', stayDays: 1, note: 'Banke Bihari & Prem Mandir Light Show' },
    { id: 'stop-3', name: 'Agra', stayDays: 1, note: 'Taj Mahal & Agra Fort' }
  ]);

  const [availableDestination, setAvailableDestination] = useState('Fatehpur Sikri');
  const [customDestination, setCustomDestination] = useState('');
  const [returnToOrigin, setReturnToOrigin] = useState(true);

  const presetChoices = [
    'Fatehpur Sikri', 'Govardhan', 'Barsana', 'Gokul', 'Nandgaon',
    'Ayodhya', 'Varanasi', 'Prayagraj', 'Jaipur', 'Haridwar', 'Rishikesh'
  ];

  const handleAddStop = () => {
    const destName = customDestination.trim() || availableDestination;
    if (!destName) return;

    const newStop = {
      id: 'stop-' + Date.now(),
      name: destName,
      stayDays: 1,
      note: 'Sightseeing & Temple Darshan'
    };

    setStops([...stops, newStop]);
    setCustomDestination('');
  };

  const handleRemoveStop = (id) => {
    if (stops.length <= 2) {
      alert('A multi-destination tour requires at least 2 stops.');
      return;
    }
    setStops(stops.filter(s => s.id !== id));
  };

  const handleUpdateDays = (id, delta) => {
    setStops(stops.map(s => {
      if (s.id === id) {
        const newDays = Math.max(1, s.stayDays + delta);
        return { ...s, stayDays: newDays };
      }
      return s;
    }));
  };

  const totalDays = stops.reduce((acc, curr) => acc + curr.stayDays, 0);

  const handleBookCustomTour = () => {
    const destinationNames = stops.map(s => s.name);
    if (returnToOrigin && stops[0] && stops[stops.length - 1].name !== stops[0].name) {
      destinationNames.push(stops[0].name + ' (Return)');
    }

    const today = new Date();
    today.setDate(today.getDate() + 2);
    const travelDate = today.toISOString().split('T')[0];

    const returnD = new Date(today);
    returnD.setDate(returnD.getDate() + totalDays);
    const returnDate = returnD.toISOString().split('T')[0];

    onOpenBooking({
      tripType: 'Multi Day',
      destinations: destinationNames,
      destinationName: destinationNames.join(' ➔ '),
      travelDate,
      returnDate,
      passengers: 4,
      specialRequests: `Custom Multi-Stop Route: ${destinationNames.join(' -> ')}. Total ${totalDays} Days plan.`
    });
  };

  return (
    <section id="custom-tour" className="py-16 bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-3.5 py-1 rounded-full text-xs font-bold mb-3 border border-amber-500/20">
            <Route className="w-3.5 h-3.5" />
            <span>Multi-Stop Custom Itinerary Builder</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Design Your Own Custom Multi-City Tour
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            Add multiple holy cities and tourist destinations in your desired order. Khushi Travels will provide a dedicated vehicle and driver for your complete multi-day journey.
          </p>
        </div>

        {/* Builder Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          
          {/* Left Column: Interactive Stop List */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Your Route Stops ({stops.length} Cities)</span>
              </h3>
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-lg font-bold">
                Total: {totalDays} Days Trip
              </span>
            </div>

            {/* Stops Timeline */}
            <div className="space-y-3 relative before:absolute before:top-4 before:bottom-4 before:left-5 before:w-0.5 before:bg-amber-500/30">
              {stops.map((stop, index) => (
                <div
                  key={stop.id}
                  className="relative flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl shadow-sm hover:border-slate-700 transition-all pl-12"
                >
                  {/* Step Number Dot */}
                  <div className="absolute left-3 w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
                    {index + 1}
                  </div>

                  {/* Stop Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold text-white text-sm truncate">{stop.name}</p>
                      {index === 0 && (
                        <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">
                          Start Point
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {stop.note}
                    </p>
                  </div>

                  {/* Day Counter Controls */}
                  <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleUpdateDays(stop.id, -1)}
                      className="text-slate-400 hover:text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded hover:bg-slate-800"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-amber-300 w-12 text-center">
                      {stop.stayDays} {stop.stayDays > 1 ? 'Days' : 'Day'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateDays(stop.id, 1)}
                      className="text-slate-400 hover:text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded hover:bg-slate-800"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Stop */}
                  {stops.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStop(stop.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                      title="Remove stop"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Next Stop Controls */}
            <div className="pt-3 border-t border-slate-800/80 space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                + Add Next Destination
              </label>

              <div className="flex flex-wrap sm:flex-nowrap gap-2">
                <select
                  value={availableDestination}
                  onChange={(e) => {
                    setAvailableDestination(e.target.value);
                    setCustomDestination('');
                  }}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {presetChoices.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Or enter any city / stop..."
                  value={customDestination}
                  onChange={(e) => setCustomDestination(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />

                <button
                  type="button"
                  onClick={handleAddStop}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 shrink-0 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Stop</span>
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1 text-xs text-slate-300">
                <input
                  type="checkbox"
                  id="returnOrigin"
                  checked={returnToOrigin}
                  onChange={(e) => setReturnToOrigin(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="returnOrigin" className="cursor-pointer">
                  Return back to {stops[0]?.name || 'Mathura'} on the final day
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Day-by-Day Route Visualizer & Instant Booking */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-5">
            
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-white">Generated Itinerary</h4>
                <p className="text-xs text-slate-400">{totalDays} Days / {Math.max(1, totalDays - 1)} Nights Plan</p>
              </div>
            </div>

            {/* Day Schedule Visual */}
            <div className="space-y-2.5 text-xs">
              {stops.map((stop, i) => {
                const nextStop = stops[i + 1] || (returnToOrigin ? stops[0] : null);
                return (
                  <div key={stop.id} className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    <p className="font-bold text-amber-400 mb-0.5">
                      Day {i + 1} {stop.stayDays > 1 ? `– Day ${i + stop.stayDays}` : ''}
                    </p>
                    <p className="text-white font-semibold">
                      {stop.name} {nextStop && nextStop.name !== stop.name ? `➔ ${nextStop.name}` : '(Local Exploration)'}
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Dedicated AC vehicle with chauffeur at your disposal.
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Included in Khushi Travels custom tour */}
            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 space-y-1.5 text-xs">
              <p className="font-bold text-slate-200">Included In This Custom Tour:</p>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-300">
                <span className="flex items-center gap-1">✓ Chauffeur Allowance</span>
                <span className="flex items-center gap-1">✓ State Permits & Taxes</span>
                <span className="flex items-center gap-1">✓ Toll Taxes & Fastag</span>
                <span className="flex items-center gap-1">✓ Doorstep Pickup & Drop</span>
              </div>
            </div>

            {/* Proceed to Booking CTA */}
            <button
              onClick={handleBookCustomTour}
              className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black py-3.5 px-4 rounded-2xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 text-sm flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01]"
            >
              <Car className="w-4 h-4" />
              <span>Book Cab for this Custom Itinerary</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <p className="text-[11px] text-center text-slate-400">
              ⚡ Instant confirmation request • 0 advance required to submit inquiry
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}
