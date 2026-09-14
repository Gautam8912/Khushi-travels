import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import DestinationGrid from './components/DestinationGrid.jsx';
import DestinationDetailModal from './components/DestinationDetailModal.jsx';
import TrustSection from './components/TrustSection.jsx';
import BusinessLocationSection from './components/BusinessLocationSection.jsx';
import ContactSection from './components/ContactSection.jsx';
import Footer from './components/Footer.jsx';
import BookingModal from './components/BookingModal.jsx';
import OwnerLoginModal from './components/OwnerLoginModal.jsx';
import OwnerDashboard from './components/OwnerDashboard.jsx';

import {
  fetchDestinations,
  checkOwnerAuth
} from './services/api.js';

export default function App() {
  const [destinations, setDestinations] = useState([]);
  
  // Modal States
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDestinationForBooking, setSelectedDestinationForBooking] = useState('Mathura + Vrindavan');
  const [detailModalDestination, setDetailModalDestination] = useState(null);

  // Owner Auth & Dashboard States
  const [ownerUser, setOwnerUser] = useState(() => {
    try {
      const saved = localStorage.getItem('khushi_owner_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [ownerLoginOpen, setOwnerLoginOpen] = useState(false);
  const [viewingOwnerDashboard, setViewingOwnerDashboard] = useState(false);

  // Load Destinations on Mount
  useEffect(() => {
    fetchDestinations()
      .then(data => setDestinations(data))
      .catch(err => console.error('Error fetching destinations:', err));

    if (localStorage.getItem('khushi_owner_token')) {
      checkOwnerAuth()
        .then(res => setOwnerUser(res.user))
        .catch(() => {
          localStorage.removeItem('khushi_owner_token');
          localStorage.removeItem('khushi_owner_user');
          setOwnerUser(null);
        });
    }
  }, []);

  // Smooth Navigation
  const handleNavigate = (sectionId) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open Booking Modal with destination prefilled
  const handleOpenBooking = (prefill = {}) => {
    if (prefill.destination) {
      setSelectedDestinationForBooking(prefill.destination);
    }
    setBookingModalOpen(true);
  };

  // Owner Handlers
  const handleOwnerLoginSuccess = (user) => {
    setOwnerUser(user);
    setOwnerLoginOpen(false);
    setViewingOwnerDashboard(true);
  };

  const handleOwnerLogout = () => {
    localStorage.removeItem('khushi_owner_token');
    localStorage.removeItem('khushi_owner_user');
    setOwnerUser(null);
    setViewingOwnerDashboard(false);
  };

  // If Owner is viewing their dashboard, render the Owner Dashboard
  if (viewingOwnerDashboard && ownerUser) {
    return (
      <OwnerDashboard
        user={ownerUser}
        onLogout={handleOwnerLogout}
        onCloseToWebsite={() => setViewingOwnerDashboard(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Top Navbar */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenOwner={() => {
          if (ownerUser) setViewingOwnerDashboard(true);
          else setOwnerLoginOpen(true);
        }}
        onNavigate={handleNavigate}
      />

      {/* Main Content */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <Hero
          onOpenBooking={handleOpenBooking}
          destinations={destinations}
        />

        {/* Tourist Places & Destinations */}
        <DestinationGrid
          destinations={destinations}
          onSelectDestination={(d) => setDetailModalDestination(d)}
          onBookDestination={(d) => handleOpenBooking({ destination: d.name })}
        />

        {/* 4 Trust Pillars */}
        <TrustSection />

        {/* Physical Office at Mathura New Bus Stand & Google Maps */}
        <BusinessLocationSection />

        {/* Direct Contact & WhatsApp */}
        <ContactSection />

      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenOwner={() => {
          if (ownerUser) setViewingOwnerDashboard(true);
          else setOwnerLoginOpen(true);
        }}
        onNavigate={handleNavigate}
      />

      {/* Booking Form Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialDestination={selectedDestinationForBooking}
      />

      {/* Destination Detail Modal */}
      {detailModalDestination && (
        <DestinationDetailModal
          destination={detailModalDestination}
          onClose={() => setDetailModalDestination(null)}
          onBook={(d) => {
            setDetailModalDestination(null);
            handleOpenBooking({ destination: d.name });
          }}
        />
      )}

      {/* Owner Login Modal */}
      <OwnerLoginModal
        isOpen={ownerLoginOpen}
        onClose={() => setOwnerLoginOpen(false)}
        onLoginSuccess={handleOwnerLoginSuccess}
      />

    </div>
  );
}
