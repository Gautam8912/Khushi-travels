import React, { useState } from 'react';
import { Phone, MessageSquare, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { business } from '../data/business.js';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleWhatsAppSend = (e) => {
    e.preventDefault();
    if (!name || !phone) return;
    const text = `Radhe Radhe Khushi Travels,\n\nName: ${name}\nPhone: ${phone}\nInquiry: ${message || 'I would like to inquire about tour cabs.'}`;
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
    <section id="contact" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block">
            Direct Contact
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Speak Directly with Khushi Travels
          </h2>
          <p className="text-sm text-slate-600">
            Call or WhatsApp us anytime for immediate cab booking or custom tour plans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Phone Numbers Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Call Our Office Numbers
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any number below to dial directly:
              </p>
            </div>

            <div className="space-y-3">
              {business.phones.map((p, idx) => (
                <a
                  key={idx}
                  href={`tel:${p}`}
                  className="bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 p-4 rounded-2xl flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500">
                        {idx === 0 ? 'Primary Booking Desk' : idx === 1 ? 'Office Manager' : '24/7 Operations Desk'}
                      </p>
                      <p className="font-mono font-bold text-slate-900 text-sm">
                        +91 {p}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-700 group-hover:underline">
                    Call ➔
                  </span>
                </a>
              ))}
            </div>

            <a
              href={`https://wa.me/91${business.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-2xl text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-colors text-center"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp (+91 {business.whatsapp})</span>
            </a>
          </div>

          {/* Quick Message Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Send Quick Inquiry
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Leave your number and message, we will reply right away.
              </p>
            </div>

            {sent ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-xs text-center font-bold space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p>Opening WhatsApp chat with your inquiry!</p>
              </div>
            ) : (
              <form onSubmit={handleWhatsAppSend} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tour Requirements</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. 6 people for Vrindavan & Agra on weekend..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-slate-900 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>Send WhatsApp Message</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
