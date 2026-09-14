import React from 'react';
import { ShieldCheck, UserCheck, Clock, Award, Compass, HeartHandshake } from 'lucide-react';
import { business } from '../data/business.js';

export default function TrustSection() {
  const trustCards = [
    {
      icon: UserCheck,
      title: "Experienced Local Drivers",
      description: "Devotional, courteous, and police-verified chauffeurs with in-depth knowledge of Braj temples, short-cuts, and ghat aarti timings."
    },
    {
      icon: ShieldCheck,
      title: "Comfortable & Sanitized Vehicles",
      description: "Every car, SUV, and Tempo Traveller undergoes multi-point safety checks and complete deep interior sanitization prior to pickup."
    },
    {
      icon: Award,
      title: "Transparent Fixed Pricing",
      description: "Clear billings with toll, state permit, and driver allowance transparency. 0% unexpected price hikes or festival surge gouging."
    },
    {
      icon: Clock,
      title: "24/7 Customer Support",
      description: "Direct assistance from our central Mathura New Bus Stand office throughout your journey for routing or darshan queries."
    },
    {
      icon: HeartHandshake,
      title: "Family & Pilgrim Friendly",
      description: "Special care for elderly parents, wheelchair assistance coordination, child seat requests, and peaceful, devotional atmosphere."
    },
    {
      icon: Compass,
      title: "Pan-India Route Permits",
      description: "All our vehicles possess nationwide commercial tourist permits, GPS live tracking, and enabled Fastag for seamless interstate highway transit."
    }
  ];

  return (
    <section className="py-16 bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-3.5 py-1 rounded-full text-xs font-bold mb-3 border border-amber-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>The Khushi Travels Promise</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Why Pilgrims & Families Trust Khushi Travels
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            Aapka Safar, Hamari Zimmedari — We treat every guest not as a booking, but as our esteemed family member.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustCards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-amber-500/30 transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
