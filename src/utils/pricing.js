/**
 * Centralized Pricing Engine for Khushi Travels
 * 
 * Approximate Highway Distances (Round Trip KM from Mathura)
 */
export const ROUTE_DISTANCES = {
  'mathura': 30, // Local Mathura darshan
  'vrindavan': 40,
  'agra': 130,
  'ayodhya': 1150,
  'varanasi': 1380,
  'haridwar': 720,
  'rishikesh': 770,
  'jaipur': 450,
  'manali': 1380,
  'goa': 3600,
  'kedarnath': 1100,
  'badrinath': 1180,
  'shimla': 990,
  'nainital': 740,
  'udaipur': 1180,
  'tirupati': 3900,
  'shirdi': 2250,
  'amritsar': 1200,
  'puri': 3000
};

/**
 * Calculates Estimated Fare based on vehicle pricing parameters and trip details
 */
export function calculateEstimatedFare({
  tripType = 'Round Trip',
  destinations = ['mathura'],
  vehicle = null,
  days = 1,
  packagePrice = null
}) {
  // If a fixed tour package is selected, use that as the base
  if (packagePrice && Number(packagePrice) > 0) {
    return Number(packagePrice);
  }

  if (!vehicle) {
    return 3000;
  }

  // Calculate approximate distance
  let totalKm = 100;
  if (Array.isArray(destinations)) {
    let sum = 0;
    destinations.forEach(d => {
      const key = (typeof d === 'string' ? d : d?.id || '').toLowerCase();
      sum += (ROUTE_DISTANCES[key] || 150);
    });
    totalKm = Math.max(sum, 100);
  } else if (typeof destinations === 'string') {
    const key = destinations.toLowerCase();
    totalKm = ROUTE_DISTANCES[key] || 150;
  }

  const numDays = Math.max(Number(days) || 1, 1);
  const minKmPerDay = 250;
  const billableKm = Math.max(totalKm, numDays * minKmPerDay);

  let fare = 0;

  if (tripType === 'One Way') {
    // One way transfer: minimum 1 day base or direct km + one way allowance
    fare = Math.max(vehicle.basePrice || 2000, (totalKm / 2) * (vehicle.perKmPrice || 14) * 1.4 + (vehicle.driverAllowance || 400));
  } else if (tripType === 'Multi Day' || numDays > 1) {
    // Multi-day per day or km billing, whichever is standard
    const dayFare = numDays * (vehicle.perDayPrice || 3200);
    const kmFare = billableKm * (vehicle.perKmPrice || 14);
    fare = Math.max(dayFare, kmFare) + (numDays * (vehicle.driverAllowance || 500));
  } else {
    // Standard Round Trip
    fare = (billableKm * (vehicle.perKmPrice || 14)) + (vehicle.driverAllowance || 400);
  }

  // Round off to nearest 50
  return Math.round(fare / 50) * 50;
}

/**
 * Deterministic Vehicle Recommendation based on passenger count
 */
export function recommendVehicleCategory(passengerCount) {
  const count = Number(passengerCount) || 1;
  if (count <= 4) {
    return {
      category: 'Sedan',
      recommendedVehicleIds: ['maruti-dzire', 'toyota-etios'],
      badge: 'Best for 1–4 Passengers (Economy & Comfort)'
    };
  } else if (count <= 7) {
    return {
      category: 'SUV',
      recommendedVehicleIds: ['maruti-ertiga', 'innova-crysta', 'kia-carens'],
      badge: 'Best for 5–7 Passengers (Family & Pilgrimage)'
    };
  } else if (count <= 12) {
    return {
      category: 'Group Travel',
      recommendedVehicleIds: ['tempo-traveller-12'],
      badge: 'Best for 8–12 Passengers (Maharaja Pushback Tempo)'
    };
  } else if (count <= 17) {
    return {
      category: 'Group Travel',
      recommendedVehicleIds: ['tempo-traveller-17'],
      badge: 'Best for 13–17 Passengers (17 Seater Tempo Traveller)'
    };
  } else {
    return {
      category: 'Group Travel',
      recommendedVehicleIds: ['mini-bus-26'],
      badge: 'Best for 18+ Passengers (Luxury Mini Bus / Coach)'
    };
  }
}
