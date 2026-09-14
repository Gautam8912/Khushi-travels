import React, { useState, useEffect } from 'react';
import {
  Car, Phone, MessageSquare, MapPin, Calendar, Users,
  CheckCircle2, XCircle, Clock, RefreshCw, Trash2, ExternalLink,
  LogOut, Search, Filter
} from 'lucide-react';
import { fetchOwnerBookings, updateBookingStatus, deleteBooking } from '../services/api.js';
import { business } from '../data/business.js';

export default function OwnerDashboard({ user, onLogout, onCloseToWebsite }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await fetchOwnerBookings({
        status: statusFilter,
        search: searchQuery
      });
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [statusFilter, searchQuery]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleStatusChange = async (id, newStatus, bookingId) => {
    try {
      await updateBookingStatus(id, newStatus);
      showToast(`Booking ${bookingId} marked as ${newStatus}`);
      loadBookings();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id, bookingId) => {
    if (!window.confirm(`Delete booking request ${bookingId}?`)) return;
    try {
      await deleteBooking(id);
      showToast(`Booking ${bookingId} deleted`);
      loadBookings();
    } catch (err) {
      alert(err.message);
    }
  };

  const newCount = bookings.filter(b => b.status === 'New').length;
  const contactedCount = bookings.filter(b => b.status === 'Contacted').length;
  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-black">
              KT
            </div>
            <div>
              <h1 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                <span>Khushi Travels Owner Dashboard</span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full">
                  Live
                </span>
              </h1>
              <p className="text-[11px] text-slate-500">
                Logged in as: <strong>{user?.name || 'Owner'}</strong> ({user?.email || 'admin@khushitravels.com'})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onCloseToWebsite}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 border border-slate-200"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onLogout}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 border border-rose-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Floating Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white font-bold px-4 py-2.5 rounded-2xl shadow-xl text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1">
        
        {/* KPI Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Total Requests</span>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{bookings.length}</p>
          </div>

          <div className="bg-white border border-amber-200 bg-amber-50/40 rounded-2xl p-4 shadow-xs">
            <span className="text-[11px] font-bold text-amber-800 uppercase">New (Pending Call)</span>
            <p className="text-2xl font-black text-amber-700 mt-0.5">{newCount}</p>
          </div>

          <div className="bg-white border border-blue-200 bg-blue-50/40 rounded-2xl p-4 shadow-xs">
            <span className="text-[11px] font-bold text-blue-800 uppercase">Contacted</span>
            <p className="text-2xl font-black text-blue-700 mt-0.5">{contactedCount}</p>
          </div>

          <div className="bg-white border border-emerald-200 bg-emerald-50/40 rounded-2xl p-4 shadow-xs">
            <span className="text-[11px] font-bold text-emerald-800 uppercase">Confirmed Trips</span>
            <p className="text-2xl font-black text-emerald-700 mt-0.5">{confirmedCount}</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Name, Phone, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-900"
            >
              <option value="ALL">All Statuses ({bookings.length})</option>
              <option value="New">New Requests</option>
              <option value="Contacted">Contacted</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <button
              onClick={loadBookings}
              disabled={loading}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl text-xs font-bold transition-colors border border-slate-200"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

        </div>

        {/* Bookings List Cards */}
        <div className="space-y-3">
          {bookings.length > 0 ? (
            bookings.map(b => {
              const isNew = b.status === 'New';
              const isConfirmed = b.status === 'Confirmed';
              const isContacted = b.status === 'Contacted';

              return (
                <div
                  key={b.id}
                  className={`bg-white border rounded-2xl p-5 shadow-xs transition-all space-y-3 ${
                    isNew ? 'border-amber-300 bg-amber-50/10' : 'border-slate-200'
                  }`}
                >
                  
                  {/* Top Line */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-black text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                        {b.booking_id}
                      </span>
                      <h3 className="font-bold text-base text-slate-900">
                        {b.customer_name}
                      </h3>
                      <span className="text-xs text-slate-400">
                        ({b.created_at?.slice(0, 16)})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-semibold">Status:</span>
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value, b.booking_id)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                          isNew
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : isConfirmed
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : isContacted
                            ? 'bg-blue-100 text-blue-900 border-blue-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="New">🟡 New</option>
                        <option value="Contacted">🔵 Contacted</option>
                        <option value="Confirmed">🟢 Confirmed</option>
                        <option value="Cancelled">⚪ Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Trip Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700">
                    <div>
                      <span className="text-slate-400 block font-semibold">Destination:</span>
                      <strong className="text-slate-900 text-sm">{b.destination}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-semibold">Travel Date:</span>
                      <strong className="text-slate-900 text-sm">{b.travel_date}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-semibold">People:</span>
                      <strong className="text-slate-900 text-sm">{b.passengers} Passengers</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-semibold">Pickup:</span>
                      <strong className="text-slate-900 text-sm truncate block">{b.pickup_location}</strong>
                    </div>
                  </div>

                  {/* Customer Notes */}
                  {b.notes && (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600">
                      <strong>Customer Note:</strong> {b.notes}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                    
                    <div className="flex items-center gap-2">
                      
                      {/* One-Click Call Button */}
                      <a
                        href={`tel:${b.customer_phone}`}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-amber-400" />
                        <span>Call +91 {b.customer_phone}</span>
                      </a>

                      {/* One-Click WhatsApp Button */}
                      <a
                        href={`https://wa.me/91${b.customer_phone}?text=${encodeURIComponent(`Radhe Radhe ${b.customer_name}! This is Khushi Travels regarding your booking inquiry ${b.booking_id} for ${b.destination}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp Customer</span>
                      </a>

                    </div>

                    <button
                      onClick={() => handleDelete(b.id, b.booking_id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              );
            })
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-xs">
              <p className="font-bold text-sm text-slate-700">No booking requests found.</p>
              <p className="mt-1">When a customer books on the website, their request will appear here instantly.</p>
            </div>
          )}
        </div>

      </main>

    </div>
  );
}
