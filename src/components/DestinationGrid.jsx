import React, { useState, useMemo } from 'react';
import { Search, MapPin, Filter, Sparkles } from 'lucide-react';
import DestinationCard from './DestinationCard.jsx';

export default function DestinationGrid({ destinations, onSelectDestination, onPlanTrip }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Religious / Pilgrimage',
    'Hill Stations',
    'Historical / Heritage',
    'Beaches',
    'Nature / Adventure',
    'Family / Leisure'
  ];

  // Dynamic filter
  const filteredDestinations = useMemo(() => {
    return destinations.filter(d => {
      const matchesSearch = 
        !searchQuery ||
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.popularFor && d.popularFor.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (d.type && d.type.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = 
        selectedCategory === 'All' ||
        d.type === selectedCategory ||
        (Array.isArray(d.categories) && d.categories.includes(selectedCategory));

      return matchesSearch && matchesCat;
    });
  }, [destinations, searchQuery, selectedCategory]);

  return (
    <section id="destinations" className="py-16 bg-slate-950 text-white border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-xs font-bold mb-2 border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>India-Wide Destinations</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore Popular Destinations
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-1 max-w-2xl">
              From the divine holy shrines of Mathura, Vrindavan, Ayodhya & Kashi to scenic Himalayan hill retreats and heritage forts.
            </p>
          </div>

          <div className="text-xs font-medium text-slate-400 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 self-start md:self-auto">
            Showing <strong className="text-amber-400">{filteredDestinations.length}</strong> available destinations
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-8 shadow-xl space-y-4">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-amber-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by destination (e.g. Mathura, Vrindavan, Agra, Ayodhya, Varanasi, Goa, Manali...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Chips Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1 pl-1 pr-2 whitespace-nowrap">
              <Filter className="w-3.5 h-3.5 text-amber-400" /> Filter:
            </span>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Destination Cards Grid */}
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDestinations.map(dest => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onSelect={onSelectDestination}
                onPlanTrip={onPlanTrip}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
            <p className="text-lg font-bold text-slate-300">No destinations found matching your search</p>
            <p className="text-sm text-slate-400 mt-1">Try searching for Mathura, Vrindavan, Agra, Ayodhya, or reset your filters.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-4 bg-amber-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-400"
            >
              Reset Search Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
