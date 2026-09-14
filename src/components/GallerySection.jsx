import React, { useState } from 'react';
import { Camera, Image, Sparkles } from 'lucide-react';

export default function GallerySection() {
  const [filter, setFilter] = useState('All');

  const galleryItems = [
    {
      category: 'Temples',
      title: 'Prem Mandir Vrindavan Lighting',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80'
    },
    {
      category: 'Vehicles',
      title: 'Toyota Innova Crysta Fleet',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
    },
    {
      category: 'Heritage',
      title: 'Majestic Taj Mahal Agra',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80'
    },
    {
      category: 'Temples',
      title: 'Ganga Aarti Haridwar & Varanasi',
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80'
    },
    {
      category: 'Vehicles',
      title: 'Maharaja Tempo Traveller Coach',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
    },
    {
      category: 'Hills',
      title: 'Himalayan Snow Valley Solang',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'
    },
    {
      category: 'Temples',
      title: 'Shri Krishna Janmabhoomi Mathura',
      image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80'
    },
    {
      category: 'Vehicles',
      title: 'Comfortable Dzire & Etios Sedans',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const categories = ['All', 'Temples', 'Vehicles', 'Heritage', 'Hills'];

  const filtered = filter === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === filter);

  return (
    <section className="py-16 bg-slate-950 text-white border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-3.5 py-1 rounded-full text-xs font-bold mb-2 border border-amber-500/20">
              <Camera className="w-3.5 h-3.5" />
              <span>Tour Moments & Fleet Visuals</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Khushi Travels Travel Gallery
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-800 self-start md:self-auto text-xs">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  filter === c
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="group relative h-60 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-[9px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md uppercase">
                  {item.category}
                </span>
                <p className="text-xs font-bold text-white mt-1 leading-snug">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
