import React, { useState } from 'react';
import { Phone, MessageSquare, MapPin, Mail, Clock, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { business } from '../data/business.js';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) return;
    
    // Build direct WhatsApp trigger with inquiry
    const text = `Radhe Radhe! Khushi Travels,\n\nName: ${name}\nPhone: ${phone}\nMessage: ${message || 'I have an inquiry regarding tours / cab hire.'}`;
    window.open(`https://wa.me/91${business.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');

    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName('');
      setPhone('');
      setMessage('');
    }, 4000);
  };

  return (
    <section id="contact" className="py-16 bg-slate-950 text-white border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-3.5 py-1 rounded-full text-xs font-bold mb-3 border border-amber-500/20">
            <Phone className="w-3.5 h-3.5" />
            <span>24/7 Connect with Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Contact Khushi Travels
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            Reach out anytime for urgent pickups, customized family tour packages, or bus rental bookings.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
          
          {/* Direct Phone Numbers & Coordinates */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Helpline & Booking Numbers
              </h3>
              <p className="text-xs text-slate-400">
                Tap any number below to dial our office or dispatch manager directly:
              </p>
            </div>

            {/* Clickable Phone Number Buttons */}
            <div className="space-y-2.5">
              {business.phones.map((p, idx) => (
                <a
                  key={idx}
                  href={`tel:${p}`}
                  className="bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 p-3.5 rounded-2xl flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">
                        {idx === 0 ? 'Primary Booking Line' : idx === 1 ? 'Office Manager' : '24/7 Operations Desk'}
                      </p>
                      <p className="font-mono font-black text-white text-base">
                        +91 {p}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-400 group-hover:underline">
                    Call Now ➔
                  </span>
                </a>
              ))}
            </div>

            {/* WhatsApp Quick Direct Link */}
            <a
              href={`https://wa.me/91${business.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-2xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat with Us on WhatsApp (+91 {business.whatsapp})</span>
            </a>

            {/* Office Location Snippet */}
            <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-300 space-y-1">
              <p className="font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                {business.location.name}
              </p>
              <p className="text-slate-400 text-[11px] pl-5">
                {business.location.address}
              </p>
            </div>

          </div>

          {/* Quick Inquiry Form */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Send Direct Message
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                Have custom travel requirements? Send us a quick note and our team will connect with you on WhatsApp/Call.
              </p>

              {sent ? (
                <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-5 rounded-2xl text-xs text-center font-bold space-y-2 animate-fade-in">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p>Inquiry Sent via WhatsApp! Our team will reply shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={10}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Travel Plan / Inquiry Message</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Need 17 seater Tempo Traveller for Ayodhya from Mathura on next Sunday..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3 rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry to Khushi Travels</span>
                  </button>
                </form>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>⚡ Average response time: &lt; 5 minutes</span>
              <span className="text-emerald-400 font-bold">24/7 Available</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
