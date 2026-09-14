import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, ThumbsUp, X, Sparkles, ShieldCheck } from 'lucide-react';
import { submitReview } from '../services/api.js';

export default function CustomerReviews({ reviews = [], onReviewAdded }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [rating, setRating] = useState(5);
  const [tripRoute, setTripRoute] = useState('Mathura – Vrindavan Darshan');
  const [vehicleUsed, setVehicleUsed] = useState('Toyota Innova Crysta');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;

    setSubmitting(true);
    try {
      await submitReview({
        customerName: customerName.trim(),
        customerCity: customerCity.trim() || 'India',
        rating,
        tripRoute,
        vehicleUsed,
        comment: comment.trim()
      });

      setSuccessMsg('Thank you! Your verified review has been submitted successfully.');
      setTimeout(() => {
        setModalOpen(false);
        setSuccessMsg('');
        setCustomerName('');
        setComment('');
        if (onReviewAdded) onReviewAdded();
      }, 1500);
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-16 bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-3.5 py-1 rounded-full text-xs font-bold mb-2 border border-amber-500/20">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Verified Customer Feedback</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              What Pilgrims & Travellers Say
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-1 max-w-2xl">
              Real experiences from families, elderly pilgrims, and corporate groups who toured with Khushi Travels.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md self-start md:self-auto transition-all"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map(rev => (
            <div
              key={rev.id}
              className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                
                {/* Rating Stars */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>

                  {rev.verified && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Comment Text */}
                <p className="text-xs text-slate-200 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Route Details */}
              <div className="pt-3 border-t border-slate-800/80 space-y-1">
                <p className="font-extrabold text-white text-xs">
                  {rev.customer_name || rev.customerName}
                </p>
                <p className="text-[11px] text-amber-400/90 font-medium truncate">
                  Route: {rev.trip_route || rev.tripRoute}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{rev.vehicle_used || rev.vehicleUsed || 'AC Cab'}</span>
                  <span>{rev.customer_city || rev.customerCity || 'India'}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Review Submission Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-white">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-extrabold text-lg text-white">
                Share Your Experience
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successMsg ? (
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-4 rounded-2xl text-xs text-center font-bold">
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Your City</label>
                    <input
                      type="text"
                      placeholder="e.g. Delhi, Jaipur"
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-bold"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                      <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                      <option value={3}>⭐⭐⭐ (3/5)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Route / Tour Taken *</label>
                  <input
                    type="text"
                    value={tripRoute}
                    onChange={(e) => setTripRoute(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Vehicle Used</label>
                  <input
                    type="text"
                    value={vehicleUsed}
                    onChange={(e) => setVehicleUsed(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Review *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Share how was the driver, vehicle cleanliness, punctuality..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl text-xs transition-all shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Post Review'}
                </button>

              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
