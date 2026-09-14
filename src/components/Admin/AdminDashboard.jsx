import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Calendar, Car, Package, MapPin, MessageSquare,
  Search, Filter, CheckCircle2, XCircle, Clock, AlertCircle, RefreshCw,
  Plus, Edit, Trash2, Printer, Phone, Send, ShieldCheck, Download,
  ExternalLink, UserCheck, LogOut, ArrowRight, X, ChevronRight, Sparkles
} from 'lucide-react';
import {
  fetchAdminBookings, updateBookingStatus, updateBookingDetails, deleteBooking,
  fetchVehicles, saveVehicle, deleteVehicle,
  fetchPackages, savePackage, deletePackage,
  fetchPickupLocations, fetchReviews,
  fetchSmsLogs, testSmsDispatch, fetchAdminAnalytics
} from '../../services/api.js';
import { business } from '../../data/business.js';
import { buildWhatsAppUrl } from '../../utils/whatsapp.js';

export default function AdminDashboard({ user, onLogout, onCloseToPublic }) {
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'analytics' | 'fleet' | 'packages' | 'locations' | 'sms-logs'
  const [loading, setLoading] = useState(false);
  const [messageToast, setMessageToast] = useState('');

  // Bookings State
  const [bookings, setBookings] = useState([]);
  const [bookingFilterStatus, setBookingFilterStatus] = useState('ALL');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingDateFilter, setBookingDateFilter] = useState('');
  const [selectedBookingForAction, setSelectedBookingForAction] = useState(null);
  const [actionType, setActionType] = useState(null); // 'CONFIRM' | 'REJECT' | 'COMPLETE' | 'EDIT' | 'PRINT'

  // Action Form State
  const [assignedDriver, setAssignedDriver] = useState('');
  const [assignedVehicleNo, setAssignedVehicleNo] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('PAYMENT_PENDING');

  // Fleet & Package State
  const [fleetList, setFleetList] = useState([]);
  const [packageList, setPackageList] = useState([]);
  const [pickupList, setPickupList] = useState([]);
  const [smsLogsList, setSmsLogsList] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);

  // Edit / Add Modal State for Vehicle / Package
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [editingPackage, setEditingPackage] = useState(null);

  // SMS Dispatcher State
  const [testSmsPhone, setTestSmsPhone] = useState('9634400179');
  const [testSmsMessage, setTestSmsMessage] = useState('Khushi Travels: Test alert from admin console.');
  const [smsSending, setSmsSending] = useState(false);

  // Initial Load
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [bData, vData, pData, locData, smsData, aData] = await Promise.all([
        fetchAdminBookings({
          status: bookingFilterStatus,
          search: bookingSearch,
          date: bookingDateFilter
        }).catch(() => []),
        fetchVehicles(true).catch(() => []),
        fetchPackages(true).catch(() => []),
        fetchPickupLocations().catch(() => []),
        fetchSmsLogs().catch(() => []),
        fetchAdminAnalytics().catch(() => null)
      ]);

      setBookings(bData);
      setFleetList(vData);
      setPackageList(pData);
      setPickupList(locData);
      setSmsLogsList(smsData);
      setAnalyticsData(aData);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [bookingFilterStatus, bookingSearch, bookingDateFilter]);

  const showToast = (msg) => {
    setMessageToast(msg);
    setTimeout(() => setMessageToast(''), 3500);
  };

  // Status Update Handlers
  const handleOpenAction = (booking, type) => {
    setSelectedBookingForAction(booking);
    setActionType(type);
    setAssignedDriver(booking.assigned_driver || '');
    setAssignedVehicleNo(booking.assigned_vehicle_no || '');
    setAdminNotes(booking.admin_notes || '');
    setPaymentStatus(booking.payment_status || 'PAYMENT_PENDING');
  };

  const handleExecuteStatusUpdate = async (status) => {
    if (!selectedBookingForAction) return;
    setLoading(true);
    try {
      await updateBookingStatus(selectedBookingForAction.id, {
        status,
        assignedDriver,
        assignedVehicleNo,
        paymentStatus,
        adminNotes,
        notifyCustomer: true
      });

      showToast(`Booking ${selectedBookingForAction.booking_id} marked as ${status}. SMS dispatched.`);
      setSelectedBookingForAction(null);
      setActionType(null);
      loadAllData();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this booking?')) return;
    try {
      await deleteBooking(id);
      showToast('Booking deleted successfully.');
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSendTestSms = async (e) => {
    e.preventDefault();
    if (!testSmsPhone || !testSmsMessage) return;
    setSmsSending(true);
    try {
      const res = await testSmsDispatch(testSmsPhone, testSmsMessage);
      showToast('Test SMS processed and logged in audit console.');
      loadAllData();
    } catch (err) {
      alert('SMS dispatch error: ' + err.message);
    } finally {
      setSmsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      
      {/* Admin Top Navigation Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
              KT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg text-white">
                  Khushi Travels Management Console
                </h1>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  SQLite WAL Connected
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Logged in as: <strong className="text-amber-400">{user?.name || 'Administrator'}</strong> ({user?.email || business.adminEmail})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={onCloseToPublic}
              className="hidden sm:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition-colors"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onLogout}
              className="bg-rose-950/40 hover:bg-rose-900 text-rose-300 border border-rose-800/60 text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>

        {/* Tab Navigation Menu */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 overflow-x-auto py-1 border-t border-slate-800/60 text-xs scrollbar-none">
          {[
            { id: 'bookings', label: 'Bookings & Trips', icon: Calendar, badge: bookings.filter(b => b.status === 'PENDING').length },
            { id: 'analytics', label: 'Executive Analytics', icon: LayoutDashboard },
            { id: 'fleet', label: 'Fleet & Cabs', icon: Car },
            { id: 'packages', label: 'Tour Packages', icon: Package },
            { id: 'locations', label: 'Pickup Hubs', icon: MapPin },
            { id: 'sms-logs', label: 'SMS Audit & Dispatch', icon: MessageSquare, badge: smsLogsList.length }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    activeTab === tab.id ? 'bg-slate-950 text-amber-400' : 'bg-amber-500 text-slate-950'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Floating Success Toast */}
      {messageToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-slate-950 font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{messageToast}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* ======================================================== */}
        {/* TAB 1: BOOKINGS & TRIPS MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'bookings' && (
          <div className="space-y-5">
            
            {/* Action & Filter Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    <span>Customer Booking Requests</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Review incoming tour requests, assign drivers, update statuses, and dispatch SMS.
                  </p>
                </div>

                <button
                  onClick={loadAllData}
                  disabled={loading}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh Data</span>
                </button>
              </div>

              {/* Filter and Search Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                
                {/* Search */}
                <div className="sm:col-span-5 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search by ID, Name, Phone, Route..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Status Selector */}
                <div className="sm:col-span-4">
                  <select
                    value={bookingFilterStatus}
                    onChange={(e) => setBookingFilterStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                  >
                    <option value="ALL">All Statuses ({bookings.length})</option>
                    <option value="PENDING">Pending Confirmation</option>
                    <option value="CONFIRMED">Confirmed Trips</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled / Rejected</option>
                  </select>
                </div>

                {/* Date Filter */}
                <div className="sm:col-span-3">
                  <input
                    type="date"
                    value={bookingDateFilter}
                    onChange={(e) => setBookingDateFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

              </div>

            </div>

            {/* Bookings Table / Cards */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              {bookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3.5 px-4">Booking ID</th>
                        <th className="py-3.5 px-4">Customer Details</th>
                        <th className="py-3.5 px-4">Destination & Route</th>
                        <th className="py-3.5 px-4">Travel Dates</th>
                        <th className="py-3.5 px-4">Vehicle & Pax</th>
                        <th className="py-3.5 px-4">Fare (Est.)</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {bookings.map(b => {
                        const isPending = b.status === 'PENDING';
                        const isConfirmed = b.status === 'CONFIRMED';
                        const isCompleted = b.status === 'COMPLETED';

                        return (
                          <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                            
                            {/* Booking ID */}
                            <td className="py-3.5 px-4 font-mono font-black text-amber-400 whitespace-nowrap">
                              {b.booking_id}
                              <p className="text-[10px] text-slate-400 font-sans font-normal">{b.created_at?.slice(0, 16)}</p>
                            </td>

                            {/* Customer */}
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-white text-sm">{b.customer_name}</p>
                              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <a href={`tel:${b.customer_phone}`} className="hover:text-amber-400">
                                  📞 {b.customer_phone}
                                </a>
                              </p>
                              {b.customer_email && (
                                <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{b.customer_email}</p>
                              )}
                            </td>

                            {/* Route */}
                            <td className="py-3.5 px-4 max-w-[200px]">
                              <p className="font-bold text-amber-300 line-clamp-2">
                                {Array.isArray(b.destinations) ? b.destinations.join(' ➔ ') : b.destinations}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                                Pickup: {b.pickup_location}
                              </p>
                            </td>

                            {/* Dates */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <p className="font-bold text-white">{b.travel_date}</p>
                              <p className="text-[11px] text-slate-400">{b.return_date ? `to ${b.return_date}` : 'One Way'}</p>
                              <span className="text-[10px] bg-slate-950 px-1.5 py-0.5 rounded text-slate-400">{b.trip_type}</span>
                            </td>

                            {/* Vehicle & Pax */}
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-white truncate max-w-[140px]">{b.vehicle_name}</p>
                              <p className="text-[11px] text-slate-400">
                                {b.total_passengers} Pax ({b.travellers_adults}A, {b.travellers_children}C, {b.travellers_seniors}S)
                              </p>
                              {b.assigned_driver && (
                                <p className="text-[10px] text-emerald-400 truncate font-semibold mt-0.5">
                                  Driver: {b.assigned_driver}
                                </p>
                              )}
                            </td>

                            {/* Fare */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <p className="font-black text-amber-400 text-sm">₹{b.estimated_fare}</p>
                              <span className="text-[9px] bg-slate-950 text-slate-400 px-1.5 py-0.2 rounded font-mono">
                                {b.payment_status}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black border ${
                                isConfirmed
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                  : isPending
                                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                  : isCompleted
                                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                                  : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                              }`}>
                                {b.status}
                              </span>
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                
                                {isPending && (
                                  <button
                                    onClick={() => handleOpenAction(b, 'CONFIRM')}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                    title="Confirm Booking & Assign Driver"
                                  >
                                    Confirm
                                  </button>
                                )}

                                {isConfirmed && (
                                  <button
                                    onClick={() => handleOpenAction(b, 'COMPLETE')}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                    title="Mark Trip as Completed"
                                  >
                                    Complete
                                  </button>
                                )}

                                {isPending && (
                                  <button
                                    onClick={() => handleOpenAction(b, 'REJECT')}
                                    className="bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/80 px-2 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                    title="Decline / Reject Booking"
                                  >
                                    Reject
                                  </button>
                                )}

                                <a
                                  href={`https://wa.me/91${b.customer_whatsapp || b.customer_phone}?text=${encodeURIComponent(`Radhe Radhe ${b.customer_name}! This is Khushi Travels regarding your booking ${b.booking_id}.`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-slate-800 hover:bg-slate-700 text-emerald-400 p-1.5 rounded-lg border border-slate-700"
                                  title="WhatsApp Customer"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </a>

                                <button
                                  onClick={() => handleOpenAction(b, 'PRINT')}
                                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded-lg border border-slate-700"
                                  title="Print Trip Manifest"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => handleDeleteBooking(b.id)}
                                  className="bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-white p-1.5 rounded-lg border border-slate-700"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                              </div>
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400 text-xs">
                  <p className="text-sm font-bold text-slate-300">No bookings found for the selected filter.</p>
                  <p className="mt-1">Try changing status or search keyword.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: EXECUTIVE ANALYTICS */}
        {/* ======================================================== */}
        {activeTab === 'analytics' && analyticsData && (
          <div className="space-y-6">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
                <span className="text-xs text-slate-400 font-semibold uppercase">Total Bookings</span>
                <p className="text-3xl font-black text-white mt-1">{analyticsData.kpis.totalBookings}</p>
                <p className="text-[11px] text-amber-400 mt-0.5">{analyticsData.kpis.todayBookings} placed today</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
                <span className="text-xs text-slate-400 font-semibold uppercase">Pending Requests</span>
                <p className="text-3xl font-black text-amber-400 mt-1">{analyticsData.kpis.pendingBookings}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Require confirmation</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
                <span className="text-xs text-slate-400 font-semibold uppercase">Confirmed & Active</span>
                <p className="text-3xl font-black text-emerald-400 mt-1">{analyticsData.kpis.confirmedBookings}</p>
                <p className="text-[11px] text-emerald-400/80 mt-0.5">Drivers assigned</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
                <span className="text-xs text-slate-400 font-semibold uppercase">Est. Confirmed Revenue</span>
                <p className="text-3xl font-black text-amber-300 mt-1">₹{analyticsData.kpis.totalRevenue.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{analyticsData.kpis.completedBookings} trips completed</p>
              </div>
            </div>

            {/* Vehicle Breakdown & Demand */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <Car className="w-5 h-5 text-amber-400" />
                  <span>Most Demanded Vehicles</span>
                </h3>
                <div className="space-y-3">
                  {analyticsData.vehiclesStats && analyticsData.vehiclesStats.map((v, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                      <span className="font-bold text-white">{v.vehicle_name}</span>
                      <span className="font-black bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-lg">
                        {v.booking_count} Bookings
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>Operations Health & SMS Delivery</span>
                </h3>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
                  <p className="flex justify-between">
                    <span>SMS Subsystem:</span>
                    <strong className="text-emerald-400">ACTIVE & LOGGING</strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Database Engine:</span>
                    <strong className="text-emerald-400">SQLite (better-sqlite3 WAL)</strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Admin Authentication:</span>
                    <strong className="text-emerald-400">JWT Bearer Token Protected</strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Central Office:</span>
                    <strong className="text-amber-400">Mathura New Bus Stand</strong>
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: FLEET & VEHICLES MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'fleet' && (
          <div className="space-y-5">
            
            <div className="flex items-center justify-between bg-slate-900 p-5 rounded-3xl border border-slate-800">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Car className="w-5 h-5 text-amber-400" />
                  <span>Fleet & Cab Management</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Manage pricing, KM rates, daily allowance, and vehicle availability.
                </p>
              </div>

              <button
                onClick={() => setEditingVehicle({
                  id: '', name: '', category: 'Sedan', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
                  seats: 4, luggageCapacity: 2, ac: true, basePrice: 2000, perKmPrice: 12, perDayPrice: 2800, driverAllowance: 400,
                  available: true, description: 'Comfortable AC Sedan', features: ['AC', 'Fastag', 'Clean Interior']
                })}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Vehicle</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fleetList.map(v => (
                <div key={v.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-5 space-y-4">
                  <div className="relative h-40 rounded-2xl overflow-hidden">
                    <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                      {v.category}
                    </span>
                    <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      v.available ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {v.available ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-white">{v.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{v.seats} Seats • Luggage: {v.luggage_capacity || v.luggageCapacity} bags</p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl text-xs space-y-1">
                    <p className="flex justify-between">
                      <span className="text-slate-400">Rate / KM:</span>
                      <strong className="text-amber-400">₹{v.per_km_price || v.perKmPrice}/km</strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400">Daily Package:</span>
                      <strong className="text-white">₹{v.per_day_price || v.perDayPrice}/day</strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400">Driver Allowance:</span>
                      <span className="text-slate-300">₹{v.driver_allowance || v.driverAllowance}/day</span>
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingVehicle({
                        ...v,
                        luggageCapacity: v.luggage_capacity || v.luggageCapacity,
                        perKmPrice: v.per_km_price || v.perKmPrice,
                        perDayPrice: v.per_day_price || v.perDayPrice,
                        driverAllowance: v.driver_allowance || v.driverAllowance,
                        basePrice: v.base_price || v.basePrice
                      })}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-xl text-xs font-bold transition-colors"
                    >
                      Edit Vehicle
                    </button>
                    <button
                      onClick={async () => {
                        if (!window.confirm(`Delete ${v.name}?`)) return;
                        await deleteVehicle(v.id);
                        showToast('Vehicle deleted.');
                        loadAllData();
                      }}
                      className="bg-slate-800 hover:bg-rose-900 text-rose-400 hover:text-white p-2 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: TOUR PACKAGES MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'packages' && (
          <div className="space-y-5">
            
            <div className="flex items-center justify-between bg-slate-900 p-5 rounded-3xl border border-slate-800">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-400" />
                  <span>Tour Packages & Braj Darshan Management</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Create or edit tour packages, itineraries, inclusions, and prices.
                </p>
              </div>

              <button
                onClick={() => setEditingPackage({
                  id: '', title: '', duration: '2 Days / 1 Night', startingPrice: 3500,
                  destinations: ['Mathura', 'Vrindavan'], image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=80',
                  description: 'Complete Braj Darshan tour with AC cab.', highlights: ['Janmabhoomi Darshan', 'Prem Mandir'],
                  inclusions: ['AC Cab', 'Toll & Taxes'], exclusions: ['Hotel', 'Meals'], popular: true, enabled: true
                })}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Tour Package</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packageList.map(p => (
                <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-5 space-y-3">
                  <div className="relative h-40 rounded-2xl overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                      {p.duration}
                    </span>
                    <span className="absolute top-2 right-2 bg-slate-950/80 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      From ₹{p.starting_price || p.startingPrice}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-white">{p.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setEditingPackage({
                        ...p,
                        startingPrice: p.starting_price || p.startingPrice
                      })}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-xl text-xs font-bold transition-colors"
                    >
                      Edit Package
                    </button>
                    <button
                      onClick={async () => {
                        if (!window.confirm(`Delete ${p.title}?`)) return;
                        await deletePackage(p.id);
                        showToast('Package deleted.');
                        loadAllData();
                      }}
                      className="bg-slate-800 hover:bg-rose-900 text-rose-400 hover:text-white p-2 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: PICKUP HUBS MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'locations' && (
          <div className="space-y-5">
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span>Boarding Hubs & Office Locations</span>
              </h2>
              <p className="text-xs text-slate-400">
                Designated physical boarding hubs for customer pickup coordination.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pickupList.map(loc => (
                <div key={loc.id} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-white text-sm">{loc.name}</h3>
                    {loc.is_primary || loc.isPrimary ? (
                      <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-md uppercase">
                        Primary Office
                      </span>
                    ) : null}
                  </div>
                  <p className="text-slate-300 font-mono text-[11px]">{loc.address}</p>
                  <a
                    href={loc.google_maps_url || loc.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-amber-400 hover:underline pt-1 text-xs font-bold"
                  >
                    <span>📍 Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: SMS AUDIT & DISPATCHER */}
        {/* ======================================================== */}
        {activeTab === 'sms-logs' && (
          <div className="space-y-6">
            
            {/* Live SMS Dispatcher Tool */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-400" />
                  <span>Real SMS Notification Dispatcher</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Sends automated SMS alerts for booking receipts, driver assignment confirmations, and trip updates.
                </p>
              </div>

              <form onSubmit={handleSendTestSms} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-4">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Recipient Indian Mobile
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={testSmsPhone}
                    onChange={(e) => setTestSmsPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    SMS Message Content
                  </label>
                  <input
                    type="text"
                    required
                    value={testSmsMessage}
                    onChange={(e) => setTestSmsMessage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2 flex items-end">
                  <button
                    type="submit"
                    disabled={smsSending}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{smsSending ? 'Sending...' : 'Send SMS'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* SMS Audit History Logs Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-white">
                  SMS Audit History ({smsLogsList.length} Messages Dispatched)
                </h3>
                <span className="text-xs text-slate-400">
                  DLT / Fast2SMS Provider Format
                </span>
              </div>

              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Time</th>
                      <th className="p-3">Recipient</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Template</th>
                      <th className="p-3">Message Content</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {smsLogsList.map(s => (
                      <tr key={s.id} className="hover:bg-slate-800/50">
                        <td className="p-3 whitespace-nowrap font-mono text-[11px] text-slate-400">
                          {s.created_at?.slice(0, 19)}
                        </td>
                        <td className="p-3 font-mono font-bold text-white whitespace-nowrap">
                          {s.recipient_phone}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="text-[10px] bg-slate-950 text-amber-400 px-2 py-0.5 rounded font-bold">
                            {s.recipient_type}
                          </span>
                        </td>
                        <td className="p-3 whitespace-nowrap font-bold text-slate-300 text-[11px]">
                          {s.template_name}
                        </td>
                        <td className="p-3 text-slate-300 max-w-sm">
                          <p className="line-clamp-2">{s.message}</p>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ======================================================== */}
      {/* MODAL: CONFIRM BOOKING & ASSIGN DRIVER */}
      {/* ======================================================== */}
      {actionType === 'CONFIRM' && selectedBookingForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-lg text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm Booking & Assign Chauffeur</span>
              </h3>
              <button onClick={() => setActionType(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1">
              <p><strong className="text-white">Booking ID:</strong> <span className="font-mono text-amber-400">{selectedBookingForAction.booking_id}</span></p>
              <p><strong className="text-white">Customer:</strong> {selectedBookingForAction.customer_name} ({selectedBookingForAction.customer_phone})</p>
              <p><strong className="text-white">Travel Date:</strong> {selectedBookingForAction.travel_date}</p>
              <p><strong className="text-white">Vehicle:</strong> {selectedBookingForAction.vehicle_name}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Assign Driver (Name & Phone Number) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dharmendra Sharma (9871122334)"
                  value={assignedDriver}
                  onChange={(e) => setAssignedDriver(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Assigned Vehicle Plate Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UP 85 BX 4012"
                  value={assignedVehicleNo}
                  onChange={(e) => setAssignedVehicleNo(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono uppercase focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400 font-bold"
                >
                  <option value="PAYMENT_PENDING">Payment Pending (Cash on Trip)</option>
                  <option value="ADVANCE_PAID">Advance Token Received</option>
                  <option value="FULLY_PAID">100% Fully Paid</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Admin Internal Notes</label>
                <textarea
                  rows={2}
                  placeholder="Pickup instructions or notes for driver..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>
            </div>

            <p className="text-[11px] text-emerald-300 italic">
              ⚡ Clicking "Confirm & Send SMS" will immediately dispatch the confirmation SMS to customer {selectedBookingForAction.customer_phone}.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActionType(null)}
                className="flex-1 bg-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleExecuteStatusUpdate('CONFIRMED')}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-black shadow-lg"
              >
                Confirm & Dispatch SMS
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DECLINE / REJECT BOOKING */}
      {/* ======================================================== */}
      {actionType === 'REJECT' && selectedBookingForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-lg text-rose-400 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                <span>Decline Booking Request</span>
              </h3>
              <button onClick={() => setActionType(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Specify reason for declining booking <strong className="text-white">{selectedBookingForAction.booking_id}</strong>:
            </p>

            <textarea
              rows={3}
              placeholder="e.g. Vehicle fully booked on requested date. Alternative slot offered."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-400 resize-none"
            />

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActionType(null)}
                className="flex-1 bg-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleExecuteStatusUpdate('REJECTED')}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-2.5 rounded-xl text-xs font-black"
              >
                Decline & Notify Customer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: MARK AS COMPLETED */}
      {/* ======================================================== */}
      {actionType === 'COMPLETE' && selectedBookingForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-lg text-blue-400 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Complete Trip</span>
              </h3>
              <button onClick={() => setActionType(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Mark trip <strong className="text-white">{selectedBookingForAction.booking_id}</strong> as COMPLETED and send customer thank-you SMS?
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActionType(null)}
                className="flex-1 bg-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleExecuteStatusUpdate('COMPLETED')}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-xs font-black"
              >
                Mark Trip Completed
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: PRINT TRIP SHEET / DRIVER MANIFEST */}
      {/* ======================================================== */}
      {actionType === 'PRINT' && selectedBookingForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white text-slate-950 rounded-3xl p-8 shadow-2xl space-y-6 my-8">
            
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">KHUSHI TRAVELS</h2>
                <p className="text-xs text-slate-600">Mathura New Bus Stand, Adarsh Nagar, Mathura (UP 281001)</p>
                <p className="text-xs text-slate-600 font-bold">Helpline: +91 9634400179 / +91 9149107116</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold uppercase text-slate-500">Official Trip Sheet</span>
                <p className="text-lg font-black font-mono text-amber-600">{selectedBookingForAction.booking_id}</p>
              </div>
            </div>

            {/* Print Body */}
            <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-200 pb-4">
              <div>
                <p className="text-slate-500 font-semibold">CUSTOMER NAME</p>
                <p className="font-bold text-base text-slate-900">{selectedBookingForAction.customer_name}</p>
                <p className="font-mono font-bold">+91 {selectedBookingForAction.customer_phone}</p>
              </div>
              <div>
                <p className="text-slate-500 font-semibold">ASSIGNED VEHICLE & DRIVER</p>
                <p className="font-bold text-base text-slate-900">{selectedBookingForAction.vehicle_name}</p>
                <p className="text-slate-700">Driver: {selectedBookingForAction.assigned_driver || 'To be assigned'}</p>
                <p className="font-mono text-slate-700">Plate: {selectedBookingForAction.assigned_vehicle_no || 'UP 85'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-200 pb-4">
              <div>
                <p className="text-slate-500 font-semibold">DESTINATIONS</p>
                <p className="font-bold text-slate-900">{Array.isArray(selectedBookingForAction.destinations) ? selectedBookingForAction.destinations.join(' ➔ ') : selectedBookingForAction.destinations}</p>
                <p className="text-slate-600 mt-1">Pickup: {selectedBookingForAction.pickup_location}</p>
              </div>
              <div>
                <p className="text-slate-500 font-semibold">DATES & PASSENGERS</p>
                <p className="font-bold text-slate-900">From: {selectedBookingForAction.travel_date} to {selectedBookingForAction.return_date || 'One Way'}</p>
                <p className="text-slate-600 mt-1">{selectedBookingForAction.total_passengers} Travellers ({selectedBookingForAction.travellers_adults} Adults, {selectedBookingForAction.travellers_children} Kids)</p>
              </div>
            </div>

            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase">Estimated Total Fare</span>
                <p className="text-2xl font-black text-slate-900">₹{selectedBookingForAction.estimated_fare}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-500 uppercase">Payment Status</span>
                <p className="font-bold text-slate-900">{selectedBookingForAction.payment_status}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 no-print">
              <button
                onClick={() => setActionType(null)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-2.5 rounded-xl text-xs font-bold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-slate-950 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Trip Sheet</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT VEHICLE */}
      {/* ======================================================== */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-white space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-lg text-white">
                {editingVehicle.id ? 'Edit Vehicle Fleet' : 'Add New Fleet Vehicle'}
              </h3>
              <button onClick={() => setEditingVehicle(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await saveVehicle(editingVehicle, Boolean(editingVehicle.id));
                  showToast('Vehicle saved successfully.');
                  setEditingVehicle(null);
                  loadAllData();
                } catch (err) {
                  alert(err.message);
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Vehicle Model Name *</label>
                <input
                  type="text"
                  required
                  value={editingVehicle.name}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={editingVehicle.category}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Premium">Premium</option>
                    <option value="Group Travel">Group Travel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Seats Count</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={editingVehicle.seats}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, seats: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Per KM (₹)</label>
                  <input
                    type="number"
                    value={editingVehicle.perKmPrice}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, perKmPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Per Day (₹)</label>
                  <input
                    type="number"
                    value={editingVehicle.perDayPrice}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, perDayPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Driver Allowance</label>
                  <input
                    type="number"
                    value={editingVehicle.driverAllowance}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, driverAllowance: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Vehicle Image URL</label>
                <input
                  type="url"
                  value={editingVehicle.image}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, image: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingVehicle(null)}
                  className="flex-1 bg-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 py-2.5 rounded-xl text-xs font-black shadow-md"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT TOUR PACKAGE */}
      {/* ======================================================== */}
      {editingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-white space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-lg text-white">
                {editingPackage.id ? 'Edit Package' : 'Add Tour Package'}
              </h3>
              <button onClick={() => setEditingPackage(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await savePackage(editingPackage, Boolean(editingPackage.id));
                  showToast('Package saved successfully.');
                  setEditingPackage(null);
                  loadAllData();
                } catch (err) {
                  alert(err.message);
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Package Title *</label>
                <input
                  type="text"
                  required
                  value={editingPackage.title}
                  onChange={(e) => setEditingPackage({ ...editingPackage, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={editingPackage.duration}
                    onChange={(e) => setEditingPackage({ ...editingPackage, duration: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Starting Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingPackage.startingPrice}
                    onChange={(e) => setEditingPackage({ ...editingPackage, startingPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingPackage.description}
                  onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPackage(null)}
                  className="flex-1 bg-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 py-2.5 rounded-xl text-xs font-black shadow-md"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
