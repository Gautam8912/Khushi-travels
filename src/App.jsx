import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import DestinationGrid from './components/DestinationGrid.jsx';
import DestinationDetailModal from './components/DestinationDetailModal.jsx';
import VehicleGrid from './components/VehicleGrid.jsx';
import PackageGrid from './components/PackageGrid.jsx';
import MultiDestinationBuilder from './components/MultiDestinationBuilder.jsx';
import BusinessLocationSection from './components/BusinessLocationSection.jsx';
import TrustSection from './components/TrustSection.jsx';
import CustomerReviews from './components/CustomerReviews.jsx';
import GallerySection from './components/GallerySection.jsx';
import ContactSection from './components/ContactSection.jsx';
import Footer from './components/Footer.jsx';
import StickyMobileBar from './components/StickyMobileBar.jsx';
import BookingModal from './components/BookingModal.jsx';
import BookingTrackerModal from './components/BookingTrackerModal.jsx';
import AdminLoginModal from './components/Admin/AdminLoginModal.jsx';
import AdminDashboard from './components/Admin/AdminDashboard.jsx';

import {
  fetchDestinations,
  fetchVehicles,
  fetchPackages,
  fetchPickupLocations,
  fetchReviews,
  checkAdminAuth
} from './services/api.js';

export default function App() {
  // Navigation & Active Section State
  const [activeSection, setActiveSection] = useState('home');

  // Application Data States
  const [destinations, setDestinations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [packages, setPackages] = useState([]);
  const [pickupLocations, setPickupLocations] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Modal States
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingInitialData, setBookingInitialData] = useState({});
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);
  const [selectedDestinationModal, setSelectedDestinationModal] = useState(null);

  // Admin Portal States
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('khushi_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [viewingAdminDashboard, setViewingAdminDashboard] = useState(false);

  // Load Data on Mount
  const loadInitialData = async () => {
    try {
      const [destData, vehData, pkgData, locData, revData] = await Promise.all([
        fetchDestinations(),
        fetchVehicles(),
        fetchPackages(),
        fetchPickupLocations(),
        fetchReviews()
      ]);

      setDestinations(destData);
      setVehicles(vehData);
      setPackages(pkgData);
      setPickupLocations(locData);
      setReviews(revData);
    } catch (err) {
      console.error('Initial data load error:', err);
    }
  };

  useEffect(() => {
    loadInitialData();

    // Verify admin token if stored
    if (localStorage.getItem('khushi_admin_token')) {
      checkAdminAuth()
        .then(res => setAdminUser(res.user))
        .catch(() => {
          localStorage.removeItem('khushi_admin_token');
          localStorage.removeItem('khushi_admin_user');
          setAdminUser(null);
        });
    }
  }, []);

  // Smooth Navigation Handler
  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open Booking with Optional Prefilled Data
  const handleOpenBooking = (prefill = {}) => {
    setBookingInitialData(prefill);
    setBookingModalOpen(true);
  };

  // Trigger Booking from Destination
  const handlePlanTripForDestination = (destination) => {
    handleOpenBooking({
      destinationName: destination.name,
      destinations: [destination.name],
      tripType: destination.distanceFromMathura > 150 ? 'Multi Day' : 'Round Trip',
      pickupLocation: 'Mathura New Bus Stand (Main Office)'
    });
  };

  // Trigger Booking from Vehicle
  const handleBookVehicle = (vehicle) => {
    handleOpenBooking({
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      passengers: Math.min(vehicle.seats, 4)
    });
  };

  // Trigger Booking from Tour Package
  const handleBookPackage = (pkg) => {
    handleOpenBooking({
      packageId: pkg.id,
      packageTitle: pkg.title,
      packageStartingPrice: pkg.startingPrice || pkg.starting_price,
      destinationName: Array.isArray(pkg.destinations) ? pkg.destinations.join(' ➔ ') : pkg.destinations,
      tripType: 'Multi Day',
      specialRequests: `Book Package: ${pkg.title} (${pkg.duration})`
    });
  };

  // Admin Login Handler
  const handleAdminLoginSuccess = (user) => {
    setAdminUser(user);
    setAdminLoginOpen(false);
    setViewingAdminDashboard(true);
  };

  // Admin Logout Handler
  const handleAdminLogout = () => {
    localStorage.removeItem('khushi_admin_token');
    localStorage.removeItem('khushi_admin_user');
    setAdminUser(null);
    setViewingAdminDashboard(false);
  };

  // If Admin is viewing dashboard, render full admin console
  if (viewingAdminDashboard && adminUser) {
    return (
      <AdminDashboard
        user={adminUser}
        onLogout={handleAdminLogout}
        onCloseToPublic={() => setViewingAdminDashboard(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Global Navbar */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenTracker={() => setTrackerModalOpen(true)}
        onOpenAdmin={() => {
          if (adminUser) setViewingAdminDashboard(true);
          else setAdminLoginOpen(true);
        }}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Public Customer Page */}
      <main className="flex-1">
        
        {/* Hero Section with Search */}
        <Hero
          onOpenBooking={handleOpenBooking}
          onSearchDestination={(term) => {
            handleNavigate('destinations');
          }}
          destinations={destinations}
        />

        {/* Destination Catalogue */}
        <DestinationGrid
          destinations={destinations}
          onSelectDestination={(d) => setSelectedDestinationModal(d)}
          onPlanTrip={handlePlanTripForDestination}
        />

        {/* Custom Multi-City Route Planner */}
        <MultiDestinationBuilder
          onOpenBooking={handleOpenBooking}
        />

        {/* Vehicle Fleet & Fares */}
        <VehicleGrid
          vehicles={vehicles}
          onBookVehicle={handleBookVehicle}
        />

        {/* Handcrafted Tour Packages */}
        <PackageGrid
          packages={packages}
          onBookPackage={handleBookPackage}
        />

        {/* Trust & Guarantees */}
        <TrustSection />

        {/* Verified Customer Reviews */}
        <CustomerReviews
          reviews={reviews}
          onReviewAdded={loadInitialData}
        />

        {/* Photo Gallery */}
        <GallerySection />

        {/* Mathura Physical Location & Hubs */}
        <BusinessLocationSection
          pickupLocations={pickupLocations}
        />

        {/* Contact & Direct Phone Numbers */}
        <ContactSection />

      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenTracker={() => setTrackerModalOpen(true)}
        onOpenAdmin={() => {
          if (adminUser) setViewingAdminDashboard(true);
          else setAdminLoginOpen(true);
        }}
        onNavigate={handleNavigate}
      />

      {/* Mobile Sticky Bar */}
      <StickyMobileBar
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* ================= MODALS ================= */}

      {/* Comprehensive Booking Wizard Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialData={bookingInitialData}
        vehicles={vehicles}
        destinations={destinations}
        pickupLocations={pickupLocations}
      />

      {/* Live Booking Tracker Modal */}
      {trackerModalOpen && (
        <BookingTrackerModal
          onClose={() => setTrackerModalOpen(false)}
        />
      )}

      {/* Single Destination Detail Modal */}
      {selectedDestinationModal && (
        <DestinationDetailModal
          destination={selectedDestinationModal}
          onClose={() => setSelectedDestinationModal(null)}
          onPlanTrip={handlePlanTripForDestination}
        />
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

    </div>
  );
}
