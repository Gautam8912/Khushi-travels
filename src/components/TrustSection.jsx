import React from 'react';
import { ShieldCheck, UserCheck, Clock, Award } from 'lucide-react';
import { business } from '../data/business.js';

export default function TrustSection() {
  const pillars = [
    {
      icon: UserCheck,
      title: "Experienced Drivers",
      description: "Courteous, verified local chauffeurs with complete knowledge of Braj temples, shortcuts, and Aarti timings."
    },
    {
      icon: ShieldCheck,
      title: "Comfortable AC Vehicles",
      description: "Clean sedans, SUVs, and Tempo Travellers serviced before every trip for family & senior citizen comfort."
    },
    {
      icon: Award,
      title: "Direct Owner Pricing",
      description: "No hidden charges, no middleman commissions. Honest rates discussed and finalized directly with the owner."
    },
    {
      icon: Clock,
      title: "24/7 Office Support",
      description: "Physical office at Mathura New Bus Stand available round-the-clock to coordinate your journey."
    }
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block">
            Why Choose Us
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Aapka Safar, Hamari Zimmedari
          </h2>
          <p className="text-sm text-slate-600">
            Dedicated to providing peaceful, hassle-free travel for pilgrims, families, and tourists.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 hover:border-slate-300 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
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
