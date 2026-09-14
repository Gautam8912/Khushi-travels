import React, { useState, useMemo } from 'react';
import { Search, Filter, MapPin, Sparkles } from 'lucide-react';
import DestinationCard from './DestinationCard.jsx';

export default function DestinationGrid({ destinations, onSelectDestination, onBookDestination }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Religious / Pilgrimage',
    'Hill Stations',
    'Historical / Heritage',
    'Beaches & Leisure',
    'Nature & Adventure'
  ];

  const filtered = useMemo(() => {
    return destinations.filter(d => {
      const matchSearch =
        !searchQuery ||
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.popular_for && d.popular_for.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCat =
        selectedCategory === 'All' || d.type === selectedCategory;

      return matchSearch && matchCat;
    });
  }, [destinations, searchQuery, selectedCategory]);

  return (
    <section id="destinations" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block mb-2">
              Tour & Pilgrimage Catalogue
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Popular Indian Travel Destinations
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Choose your destination for Braj Bhoomi pilgrimage, Taj Mahal heritage tours, or Himalayan hill stations.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-medium bg-white px-3 py-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
            Showing <strong className="text-slate-900">{filtered.length}</strong> destinations
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search destinations (e.g. Mathura, Vrindavan, Agra, Ayodhya, Varanasi...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700 bg-slate-200 px-2 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Destinations Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(dest => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onSelect={onSelectDestination}
                onBook={onBookDestination}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="font-bold text-slate-700">No destinations found matching your search.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-3 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
