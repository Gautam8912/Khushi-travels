import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'khushi_travels.db');

const db = new Database(dbPath);

// Enable WAL mode for high performance concurrency
db.pragma('journal_mode = WAL');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    seats INTEGER NOT NULL,
    luggage_capacity INTEGER NOT NULL,
    ac BOOLEAN NOT NULL DEFAULT 1,
    pricing_type TEXT NOT NULL DEFAULT 'km_day',
    base_price REAL NOT NULL DEFAULT 2000,
    per_km_price REAL NOT NULL DEFAULT 14,
    per_day_price REAL NOT NULL DEFAULT 3000,
    driver_allowance REAL NOT NULL DEFAULT 500,
    available BOOLEAN NOT NULL DEFAULT 1,
    description TEXT,
    features TEXT,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS destinations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    popular_for TEXT NOT NULL,
    image TEXT NOT NULL,
    nearby_places TEXT,
    recommended_days TEXT NOT NULL,
    categories TEXT NOT NULL,
    coordinates TEXT,
    pickup_points TEXT,
    distance_from_mathura INTEGER DEFAULT 0,
    best_time TEXT,
    featured BOOLEAN DEFAULT 0,
    enabled BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS packages (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    duration TEXT NOT NULL,
    starting_price REAL NOT NULL,
    destinations TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    highlights TEXT,
    itinerary TEXT,
    inclusions TEXT,
    exclusions TEXT,
    popular BOOLEAN DEFAULT 0,
    enabled BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS pickup_locations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    google_maps_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT 0,
    enabled BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    booking_id TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_whatsapp TEXT,
    customer_email TEXT,
    trip_type TEXT NOT NULL,
    destinations TEXT NOT NULL,
    pickup_location TEXT NOT NULL,
    pickup_address TEXT,
    travel_date TEXT NOT NULL,
    return_date TEXT,
    travellers_adults INTEGER NOT NULL DEFAULT 1,
    travellers_children INTEGER NOT NULL DEFAULT 0,
    travellers_seniors INTEGER NOT NULL DEFAULT 0,
    total_passengers INTEGER NOT NULL DEFAULT 1,
    vehicle_id TEXT,
    vehicle_name TEXT NOT NULL,
    package_id TEXT,
    package_title TEXT,
    special_requests TEXT,
    estimated_fare REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    payment_status TEXT NOT NULL DEFAULT 'PAYMENT_PENDING',
    assigned_driver TEXT,
    assigned_vehicle_no TEXT,
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_city TEXT,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    trip_route TEXT NOT NULL,
    vehicle_used TEXT,
    date TEXT NOT NULL,
    verified BOOLEAN DEFAULT 1,
    approved BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sms_logs (
    id TEXT PRIMARY KEY,
    booking_id TEXT,
    recipient_phone TEXT NOT NULL,
    recipient_type TEXT NOT NULL,
    template_name TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL,
    provider_response TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed function
export function seedDatabase() {
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM admin_users').get().count;
  if (adminCount === 0) {
    const passwordHash = bcrypt.hashSync('Khushi@2026', 10);
    db.prepare(`
      INSERT INTO admin_users (id, name, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?)
    `).run('admin-01', 'Khushi Travels Admin', 'admin@khushitravels.com', passwordHash, 'superadmin');
    console.log('✅ Admin user created: admin@khushitravels.com / Khushi@2026');
  }

  // Seed Pickup Locations
  const locCount = db.prepare('SELECT COUNT(*) as count FROM pickup_locations').get().count;
  if (locCount === 0) {
    const insertLoc = db.prepare(`
      INSERT INTO pickup_locations (id, name, address, latitude, longitude, google_maps_url, is_primary, enabled)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const locations = [
      {
        id: 'loc-01',
        name: 'Mathura New Bus Stand (Main Office)',
        address: 'FMRF+RP8, Adarsh Nagar, Manoharpura, Mathura, Uttar Pradesh 281001',
        latitude: 27.4924,
        longitude: 77.6737,
        google_maps_url: 'https://www.google.com/maps/search/?api=1&query=Khushi+Travels+Mathura+New+Bus+Stand+Adarsh+Nagar+Manoharpura+Mathura+Uttar+Pradesh+281001',
        is_primary: 1,
        enabled: 1
      },
      {
        id: 'loc-02',
        name: 'Mathura Junction Railway Station',
        address: 'Station Road, Junction Area, Mathura, Uttar Pradesh 281001',
        latitude: 27.4891,
        longitude: 77.6710,
        google_maps_url: 'https://www.google.com/maps/search/?api=1&query=Mathura+Junction+Railway+Station+Mathura',
        is_primary: 0,
        enabled: 1
      },
      {
        id: 'loc-03',
        name: 'Mathura Cantt Railway Station',
        address: 'Civil Lines, Mathura Cantt, Mathura, Uttar Pradesh 281001',
        latitude: 27.5020,
        longitude: 77.6950,
        google_maps_url: 'https://www.google.com/maps/search/?api=1&query=Mathura+Cantt+Railway+Station+Mathura',
        is_primary: 0,
        enabled: 1
      },
      {
        id: 'loc-04',
        name: 'Vrindavan Entry Point (Chhatikara Road)',
        address: 'Chhatikara Crossing, NH-19 / Vrindavan Road, Uttar Pradesh 281121',
        latitude: 27.5680,
        longitude: 77.6540,
        google_maps_url: 'https://www.google.com/maps/search/?api=1&query=Chhatikara+Crossing+Vrindavan+Mathura',
        is_primary: 0,
        enabled: 1
      },
      {
        id: 'loc-05',
        name: 'Prem Mandir / ISKCON Vrindavan',
        address: 'Bhaktivedanta Swami Marg, Raman Reti, Vrindavan, Uttar Pradesh 281121',
        latitude: 27.5724,
        longitude: 77.6715,
        google_maps_url: 'https://www.google.com/maps/search/?api=1&query=Prem+Mandir+Vrindavan+Mathura',
        is_primary: 0,
        enabled: 1
      },
      {
        id: 'loc-06',
        name: 'Agra Cantt Railway Station',
        address: 'Station Road, Cantonment, Agra, Uttar Pradesh 282001',
        latitude: 27.1583,
        longitude: 78.0081,
        google_maps_url: 'https://www.google.com/maps/search/?api=1&query=Agra+Cantt+Railway+Station',
        is_primary: 0,
        enabled: 1
      },
      {
        id: 'loc-07',
        name: 'Delhi IGI Airport (T1/T2/T3)',
        address: 'Indira Gandhi International Airport, New Delhi, Delhi 110037',
        latitude: 28.5562,
        longitude: 77.1000,
        google_maps_url: 'https://www.google.com/maps/search/?api=1&query=Indira+Gandhi+International+Airport+Delhi',
        is_primary: 0,
        enabled: 1
      },
      {
        id: 'loc-08',
        name: 'Noida / Greater Noida (Pari Chowk / Botanical Garden)',
        address: 'Pari Chowk & Sector 37 Metro, Gautam Buddha Nagar, Uttar Pradesh',
        latitude: 28.4682,
        longitude: 77.5113,
        google_maps_url: 'https://www.google.com/maps/search/?api=1&query=Pari+Chowk+Greater+Noida',
        is_primary: 0,
        enabled: 1
      }
    ];

    locations.forEach(l => {
      insertLoc.run(l.id, l.name, l.address, l.latitude, l.longitude, l.google_maps_url, l.is_primary, l.enabled);
    });
    console.log('✅ Seeded pickup locations');
  }

  // Seed Vehicles
  const vehCount = db.prepare('SELECT COUNT(*) as count FROM vehicles').get().count;
  if (vehCount === 0) {
    const insertVeh = db.prepare(`
      INSERT INTO vehicles (
        id, name, category, image, seats, luggage_capacity, ac,
        pricing_type, base_price, per_km_price, per_day_price, driver_allowance,
        available, description, features, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const vehicles = [
      {
        id: 'maruti-dzire',
        name: 'Maruti Suzuki Dzire',
        category: 'Sedan',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        seats: 4,
        luggage_capacity: 2,
        ac: 1,
        pricing_type: 'km_day',
        base_price: 1800,
        per_km_price: 11,
        per_day_price: 2600,
        driver_allowance: 400,
        available: 1,
        description: 'Perfect for couples, small families and business trips. Fuel-efficient, comfortable AC sedan with neat interiors and experienced driver.',
        features: JSON.stringify(['AC Climate Control', 'Pushback Comfort Seats', 'Music System with Bluetooth', 'Fastag Enabled', 'Sanitized Vehicle', 'Clean Boot Space']),
        display_order: 1
      },
      {
        id: 'toyota-etios',
        name: 'Toyota Etios',
        category: 'Sedan',
        image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
        seats: 4,
        luggage_capacity: 3,
        ac: 1,
        pricing_type: 'km_day',
        base_price: 1900,
        per_km_price: 12,
        per_day_price: 2800,
        driver_allowance: 400,
        available: 1,
        description: 'Spacious legroom, legendary Toyota reliability, huge luggage boot space. Ideal for outstation temple tours & airport transfers.',
        features: JSON.stringify(['Super Spacious Legroom', 'Large Boot Space (595L)', 'Chilled AC', 'Mobile Charging Ports', 'Professional Chauffeur']),
        display_order: 2
      },
      {
        id: 'maruti-ertiga',
        name: 'Maruti Suzuki Ertiga (Hybrid)',
        category: 'SUV',
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
        seats: 6,
        luggage_capacity: 3,
        ac: 1,
        pricing_type: 'km_day',
        base_price: 2400,
        per_km_price: 14,
        per_day_price: 3400,
        driver_allowance: 450,
        available: 1,
        description: 'Family favourite 6-7 seater MUV with dual AC and flexible seating. Smooth ride across Mathura, Vrindavan, Agra and North India.',
        features: JSON.stringify(['Dual AC (Front & Rear)', '6 Passenger Seating', 'Smooth Suspension', 'Luggage Carrier on Request', 'Ample Legroom']),
        display_order: 3
      },
      {
        id: 'innova-crysta',
        name: 'Toyota Innova Crysta',
        category: 'SUV',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
        seats: 7,
        luggage_capacity: 4,
        ac: 1,
        pricing_type: 'km_day',
        base_price: 2800,
        per_km_price: 18,
        per_day_price: 4200,
        driver_allowance: 500,
        available: 1,
        description: 'The King of Indian Highway Travel. Supreme luxury, plush captain seats, silent cabin, top safety features, and smooth ride for long-distance pilgrim & family tours.',
        features: JSON.stringify(['Captain Seats', 'Individual AC Vents', 'Smooth Highway Cruiser', 'Heavy Luggage Roof Carrier', 'First Aid & Water Bottle', 'Fastag Onboard']),
        display_order: 4
      },
      {
        id: 'kia-carens',
        name: 'Kia Carens Luxury Plus',
        category: 'Premium',
        image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
        seats: 6,
        luggage_capacity: 3,
        ac: 1,
        pricing_type: 'km_day',
        base_price: 2600,
        per_km_price: 16,
        per_day_price: 3800,
        driver_allowance: 500,
        available: 1,
        description: 'Modern luxury MPV with ambient lighting, plush leatherette seating, ventilated seats, and ultra-quiet ride for VIP pilgrims & corporate travelers.',
        features: JSON.stringify(['Ventilated Seats', 'Sunroof & Ambient Lights', 'Rear Sunshades', 'Type-C Fast Chargers at all seats', 'Plush Leatherette Interior']),
        display_order: 5
      },
      {
        id: 'toyota-fortuner',
        name: 'Toyota Fortuner 4x4',
        category: 'Premium',
        image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
        seats: 7,
        luggage_capacity: 4,
        ac: 1,
        pricing_type: 'km_day',
        base_price: 4500,
        per_km_price: 26,
        per_day_price: 6500,
        driver_allowance: 600,
        available: 1,
        description: 'VIP Executive SUV for high-profile visits, VIP temple darshan, corporate executives, and luxury hill station journeys.',
        features: JSON.stringify(['VIP Class Presence', 'All-Terrain 4x4 Capability', 'Premium Sound System', 'Uniformed Chauffeur', 'Complimentary Refreshments']),
        display_order: 6
      },
      {
        id: 'tempo-traveller-12',
        name: 'Force Tempo Traveller (12 Seater)',
        category: 'Group Travel',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
        seats: 12,
        luggage_capacity: 8,
        ac: 1,
        pricing_type: 'km_day',
        base_price: 3800,
        per_km_price: 24,
        per_day_price: 5500,
        driver_allowance: 600,
        available: 1,
        description: 'Spacious 12-seater Maharaja 1x1 or 2x1 pushback seats with individual AC vents, LED screen, and huge boot + top luggage carrier. Ideal for joint families & pilgrim groups.',
        features: JSON.stringify(['12 Pushback Luxury Seats', 'Individual AC Vents & Reading Lights', 'LCD TV & High Power Sound System', 'Huge Luggage Carrier', 'Spacious Center Aisle']),
        display_order: 7
      },
      {
        id: 'tempo-traveller-17',
        name: 'Force Maharaja Tempo Traveller (17 Seater)',
        category: 'Group Travel',
        image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
        seats: 17,
        luggage_capacity: 12,
        ac: 1,
        pricing_type: 'km_day',
        base_price: 4500,
        per_km_price: 28,
        per_day_price: 6800,
        driver_allowance: 700,
        available: 1,
        description: '17 Seater Luxury Coach configuration for large pilgrim groups, wedding guests, school tours, and corporate outings with top safety and comfort.',
        features: JSON.stringify(['17 Pushback Maharaja Seats', 'Air Suspension for Smooth Ride', 'Ice Box & Water Dispenser', 'LED Ambience Lighting', 'PA System & Mic']),
        display_order: 8
      },
      {
        id: 'mini-bus-26',
        name: 'Luxury Mini Bus (26 Seater AC)',
        category: 'Group Travel',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
        seats: 26,
        luggage_capacity: 20,
        ac: 1,
        pricing_type: 'km_day',
        base_price: 6500,
        per_km_price: 36,
        per_day_price: 9500,
        driver_allowance: 800,
        available: 1,
        description: 'Complete 26-seater tourist coach with panoramic windows, plush recliner seats, powerful AC, and verified experienced highway captains.',
        features: JSON.stringify(['26 Semi-Sleeper Recliner Seats', 'Dual High Capacity Air Conditioning', 'Large Underbody Luggage Trays', 'Microphone & Guide System', 'GPS Live Tracking']),
        display_order: 9
      }
    ];

    vehicles.forEach(v => {
      insertVeh.run(
        v.id, v.name, v.category, v.image, v.seats, v.luggage_capacity, v.ac,
        v.pricing_type, v.base_price, v.per_km_price, v.per_day_price, v.driver_allowance,
        v.available, v.description, v.features, v.display_order
      );
    });
    console.log('✅ Seeded vehicles');
  }

  // Seed Destinations
  const destCount = db.prepare('SELECT COUNT(*) as count FROM destinations').get().count;
  if (destCount === 0) {
    const insertDest = db.prepare(`
      INSERT INTO destinations (
        id, name, state, city, type, description, popular_for, image,
        nearby_places, recommended_days, categories, coordinates, pickup_points,
        distance_from_mathura, best_time, featured, enabled
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const destinations = [
      {
        id: 'mathura',
        name: 'Mathura',
        state: 'Uttar Pradesh',
        city: 'Mathura',
        type: 'Religious / Pilgrimage',
        description: 'The sacred birthplace of Lord Krishna. Famous for Shri Krishna Janmabhoomi, ancient ghats along the Yamuna river, Dwarkadhish temple, and world-famous Mathura ke Pede.',
        popular_for: 'Shri Krishna Janmabhoomi, Dwarkadhish Temple, Vishram Ghat, Kans Qila, Mathura Museum',
        image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=900&q=80',
        nearby_places: JSON.stringify(['Vrindavan', 'Govardhan', 'Gokul', 'Barsana', 'Nandgaon', 'Agra']),
        recommended_days: '1–2 Days',
        categories: JSON.stringify(['Religious / Pilgrimage', 'Historical / Heritage', 'Family / Leisure']),
        coordinates: JSON.stringify({ lat: 27.4924, lng: 77.6737 }),
        pickup_points: JSON.stringify(['Mathura New Bus Stand', 'Mathura Junction', 'Mathura Cantt']),
        distance_from_mathura: 0,
        best_time: 'October to March (Janmashtami & Holi are peak festive seasons)',
        featured: 1,
        enabled: 1
      },
      {
        id: 'vrindavan',
        name: 'Vrindavan',
        state: 'Uttar Pradesh',
        city: 'Vrindavan',
        type: 'Religious / Pilgrimage',
        description: 'The divine town where Lord Krishna spent his childhood. Renowned for Banke Bihari Mandir, grand Prem Mandir light show, ISKCON Krishna Balaram Mandir, and Nidhivan.',
        popular_for: 'Banke Bihari Mandir, Prem Mandir Light Show, ISKCON Vrindavan, Radha Raman Mandir, Nidhivan, Yamuna Aarti at Kesi Ghat',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=80',
        nearby_places: JSON.stringify(['Mathura', 'Govardhan', 'Barsana', 'Nandgaon']),
        recommended_days: '2 Days',
        categories: JSON.stringify(['Religious / Pilgrimage', 'Family / Leisure']),
        coordinates: JSON.stringify({ lat: 27.5806, lng: 77.7006 }),
        pickup_points: JSON.stringify(['Prem Mandir', 'Chhatikara Crossing', 'Mathura Bus Stand']),
        distance_from_mathura: 14,
        best_time: 'September to March',
        featured: 1,
        enabled: 1
      },
      {
        id: 'agra',
        name: 'Agra',
        state: 'Uttar Pradesh',
        city: 'Agra',
        type: 'Historical / Heritage',
        description: 'Home of the timeless Taj Mahal, an iconic UNESCO World Heritage site and Wonder of the World. Also home to the majestic Agra Fort and nearby Fatehpur Sikri.',
        popular_for: 'Taj Mahal, Agra Fort, Fatehpur Sikri, Mehtab Bagh, Itmad-ud-Daulah, Agra Petha Bazaar',
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80',
        nearby_places: JSON.stringify(['Fatehpur Sikri', 'Mathura', 'Vrindavan', 'Bharatpur Bird Sanctuary']),
        recommended_days: '1–2 Days',
        categories: JSON.stringify(['Historical / Heritage', 'Family / Leisure']),
        coordinates: JSON.stringify({ lat: 27.1767, lng: 78.0081 }),
        pickup_points: JSON.stringify(['Agra Cantt', 'Idgah Bus Stand', 'Taj Mahal East Gate']),
        distance_from_mathura: 58,
        best_time: 'October to March',
        featured: 1,
        enabled: 1
      },
      {
        id: 'ayodhya',
        name: 'Ayodhya',
        state: 'Uttar Pradesh',
        city: 'Ayodhya',
        type: 'Religious / Pilgrimage',
        description: 'The ancient capital of the Suryavanshi kings and the birthplace of Lord Shri Ram. Featuring the magnificent Shri Ram Janmabhoomi Mandir, Hanuman Garhi, and Saryu Aarti.',
        popular_for: 'Shri Ram Janmabhoomi Mandir, Hanuman Garhi, Kanak Bhavan, Saryu Ghat Aarti, Dashrath Mahal, Ram Ki Paidi',
        image: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=900&q=80',
        nearby_places: JSON.stringify(['Varanasi', 'Prayagraj', 'Lucknow']),
        recommended_days: '2–3 Days',
        categories: JSON.stringify(['Religious / Pilgrimage', 'Historical / Heritage']),
        coordinates: JSON.stringify({ lat: 26.7922, lng: 82.1998 }),
        pickup_points: JSON.stringify(['Ayodhya Cantt', 'Ram Mandir Gate 1', 'Mathura Bus Stand']),
        distance_from_mathura: 560,
        best_time: 'October to March (Deepotsav is unforgettable)',
        featured: 1,
        enabled: 1
      },
      {
        id: 'varanasi',
        name: 'Varanasi (Kashi)',
        state: 'Uttar Pradesh',
        city: 'Varanasi',
        type: 'Religious / Pilgrimage',
        description: 'One of the world’s oldest continuously inhabited spiritual cities on the banks of the Holy Ganges. Home to Kashi Vishwanath Jyotirlinga, Dashashwamedh Ghat Ganga Aarti, and Sarnath.',
        popular_for: 'Kashi Vishwanath Corridor, Grand Ganga Aarti at Dashashwamedh Ghat, Assi Ghat Subah-e-Banaras, Sarnath Buddhist Stupa, Banarasi Silk Weaving',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=900&q=80',
        nearby_places: JSON.stringify(['Ayodhya', 'Prayagraj', 'Sarnath', 'Bodh Gaya']),
        recommended_days: '3 Days',
        categories: JSON.stringify(['Religious / Pilgrimage', 'Historical / Heritage']),
        coordinates: JSON.stringify({ lat: 25.3176, lng: 82.9739 }),
        pickup_points: JSON.stringify(['Varanasi Cantt', 'Godowlia Crossing', 'Mathura Office']),
        distance_from_mathura: 680,
        best_time: 'October to March (Dev Deepawali is grandest)',
        featured: 1,
        enabled: 1
      },
      {
        id: 'haridwar',
        name: 'Haridwar',
        state: 'Uttarakhand',
        city: 'Haridwar',
        type: 'Religious / Pilgrimage',
        description: 'Gateway to the Gods and starting point of the sacred Char Dham Yatra. Witness the mesmerizing evening Ganga Aarti at Har Ki Pauri and visit Mansa Devi Temple.',
        popular_for: 'Har Ki Pauri Ganga Aarti, Mansa Devi & Chandi Devi Ropeway, Maya Devi Mandir, Shantikunj, Chandi Ghat',
        image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=900&q=80',
        nearby_places: JSON.stringify(['Rishikesh', 'Dehradun', 'Mussoorie']),
        recommended_days: '2 Days',
        categories: JSON.stringify(['Religious / Pilgrimage', 'Nature / Adventure']),
        coordinates: JSON.stringify({ lat: 29.9457, lng: 78.1642 }),
        pickup_points: JSON.stringify(['Har Ki Pauri', 'Haridwar Junction', 'Mathura Office']),
        distance_from_mathura: 350,
        best_time: 'All year round (September to April is pleasant)',
        featured: 1,
        enabled: 1
      },
      {
        id: 'rishikesh',
        name: 'Rishikesh',
        state: 'Uttarakhand',
        city: 'Rishikesh',
        type: 'Nature / Adventure',
        description: 'Yoga Capital of the World and adventure hub nestled in the Himalayan foothills. Famous for river rafting on the emerald Ganga, bungee jumping, and Triveni Ghat Aarti.',
        popular_for: 'White Water River Rafting, Lakshman Jhula & Ram Jhula, Triveni Ghat Aarti, Beatles Ashram, Cliff Jumping, Camping',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80',
        nearby_places: JSON.stringify(['Haridwar', 'Shivpuri', 'Dehradun', 'Mussoorie']),
        recommended_days: '2–3 Days',
        categories: JSON.stringify(['Nature / Adventure', 'Religious / Pilgrimage', 'Family / Leisure']),
        coordinates: JSON.stringify({ lat: 30.0869, lng: 78.2676 }),
        pickup_points: JSON.stringify(['Tapovan', 'Triveni Ghat', 'Mathura Bus Stand']),
        distance_from_mathura: 375,
        best_time: 'September to June',
        featured: 1,
        enabled: 1
      },
      {
        id: 'jaipur',
        name: 'Jaipur (Pink City)',
        state: 'Rajasthan',
        city: 'Jaipur',
        type: 'Historical / Heritage',
        description: 'The royal capital of Rajasthan known for stunning palaces, hilltop forts, colorful bazaars, rich Rajasthani cuisine, and vibrant Rajput heritage.',
        popular_for: 'Hawa Mahal, Amber Fort & Elephant Ride, City Palace, Jantar Mantar, Nahargarh Fort Sunset, Chokhi Dhani',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80',
        nearby_places: JSON.stringify(['Agra', 'Ajmer', 'Pushkar', 'Ranthambore']),
        recommended_days: '2–3 Days',
        categories: JSON.stringify(['Historical / Heritage', 'Family / Leisure']),
        coordinates: JSON.stringify({ lat: 26.9124, lng: 75.7873 }),
        pickup_points: JSON.stringify(['Sindhi Camp', 'Jaipur Junction', 'Mathura Office']),
        distance_from_mathura: 220,
        best_time: 'October to March',
        featured: 1,
        enabled: 1
      },
      {
        id: 'manali',
        name: 'Manali',
        state: 'Himachal Pradesh',
        city: 'Manali',
        type: 'Hill Stations',
        description: 'A paradise in the lap of the Himalayas surrounded by pine forests, snow-clad peaks, the Beas river, Solang Valley adventure sports, and the Atal Tunnel.',
        popular_for: 'Solang Valley Snow Sports, Atal Tunnel & Sissu, Rohtang Pass, Hidimba Devi Temple, Old Manali Cafes, Mall Road',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80',
        nearby_places: JSON.stringify(['Kullu', 'Kasol', 'Manikaran', 'Shimla']),
        recommended_days: '4–5 Days',
        categories: JSON.stringify(['Hill Stations', 'Nature / Adventure', 'Family / Leisure']),
        coordinates: JSON.stringify({ lat: 32.2396, lng: 77.1887 }),
        pickup_points: JSON.stringify(['Mall Road Manali', 'Mathura Office', 'Delhi Airport']),
        distance_from_mathura: 670,
        best_time: 'October to June (Snow in Dec-Feb)',
        featured: 1,
        enabled: 1
      },
      {
        id: 'goa',
        name: 'Goa',
        state: 'Goa',
        city: 'Panaji',
        type: 'Beaches',
        description: 'Sun, sand, azure waters, Portuguese heritage, and vibrant nightlife. Explore North Goa party beaches or unwind along the tranquil palm-fringed sands of South Goa.',
        popular_for: 'Baga & Calangute Beaches, Palolem Beach, Dudhsagar Waterfalls, Basilica of Bom Jesus, Fort Aguada, Sunset River Cruise',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80',
        nearby_places: JSON.stringify(['Gokarna', 'Dudhsagar', 'South Goa']),
        recommended_days: '4–5 Days',
        categories: JSON.stringify(['Beaches', 'Family / Leisure', 'Nature / Adventure']),
        coordinates: JSON.stringify({ lat: 15.2993, lng: 74.1240 }),
        pickup_points: JSON.stringify(['Panaji City', 'Mopa Airport', 'Dabolim Airport']),
        distance_from_mathura: 1750,
        best_time: 'October to April',
        featured: 1,
        enabled: 1
      },
      {
        id: 'tirupati',
        name: 'Tirupati',
        state: 'Andhra Pradesh',
        city: 'Tirupati',
        type: 'Religious / Pilgrimage',
        description: 'The sacred abode of Lord Sri Venkateswara (Balaji) perched atop the Seven Hills of Tirumala. One of the richest and most revered pilgrim destinations in the world.',
        popular_for: 'Sri Venkateswara Swamy Temple (Tirumala), Padmavathi Ammavari Temple, Kapila Theertham, Sri Govindaraja Swamy Temple, Silathoranam',
        image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=900&q=80',
        nearby_places: JSON.stringify(['Srikalahasti', 'Kanipakam', 'Chennai']),
        recommended_days: '2–3 Days',
        categories: JSON.stringify(['Religious / Pilgrimage']),
        coordinates: JSON.stringify({ lat: 13.6288, lng: 79.4192 }),
        pickup_points: JSON.stringify(['Tirupati Railway Station', 'Alipiri Toll Gate', 'Chennai Pickup']),
        distance_from_mathura: 1950,
        best_time: 'September to March',
        featured: 0,
        enabled: 1
      },
      {
        id: 'kedarnath',
        name: 'Kedarnath',
        state: 'Uttarakhand',
        city: 'Rudraprayag',
        type: 'Religious / Pilgrimage',
        description: 'One of the most sacred 12 Jyotirlingas and the crowning glory of the Char Dham Yatra, set against the majestic snow-capped Himalayan Mandakini peaks.',
        popular_for: 'Kedarnath Jyotirlinga Temple, Bhairavnath Temple, Vasuki Tal, Mandakini River Valley, Gaurikund Trek',
        image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=900&q=80',
        nearby_places: JSON.stringify(['Badrinath', 'Guptkashi', 'Rishikesh', 'Tungnath']),
        recommended_days: '4–5 Days',
        categories: JSON.stringify(['Religious / Pilgrimage', 'Nature / Adventure']),
        coordinates: JSON.stringify({ lat: 30.7346, lng: 79.0669 }),
        pickup_points: JSON.stringify(['Haridwar', 'Rishikesh', 'Mathura Office']),
        distance_from_mathura: 540,
        best_time: 'May to June & September to October (Yatra Season)',
        featured: 1,
        enabled: 1
      },
      {
        id: 'badrinath',
        name: 'Badrinath',
        state: 'Uttarakhand',
        city: 'Chamoli',
        type: 'Religious / Pilgrimage',
        description: 'The holy abode of Lord Badri Narayan (Vishnu) nestled between the Nar and Narayan mountain ranges. Features the Tapt Kund hot springs and Mana, the first Indian village.',
        popular_for: 'Badrinath Temple, Tapt Kund Hot Spring, Mana Village & Saraswati River Origin, Vasudhara Falls, Neelkanth Peak View',
        image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=900&q=80',
        nearby_places: JSON.stringify(['Mana Village', 'Kedarnath', 'Joshimath', 'Auli']),
        recommended_days: '4–5 Days',
        categories: JSON.stringify(['Religious / Pilgrimage', 'Nature / Adventure']),
        coordinates: JSON.stringify({ lat: 30.7433, lng: 79.4938 }),
        pickup_points: JSON.stringify(['Haridwar', 'Rishikesh', 'Mathura Office']),
        distance_from_mathura: 580,
        best_time: 'May to June & September to October',
        featured: 0,
        enabled: 1
      },
      {
        id: 'shimla',
        name: 'Shimla',
        state: 'Himachal Pradesh',
        city: 'Shimla',
        type: 'Hill Stations',
        description: 'The Queen of Hill Stations and historic British summer capital. Stroll along the vibrant Mall Road, visit the iconic Christ Church, and take in the panoramic Himalayan views from Jakhu Hill.',
        popular_for: 'The Ridge & Christ Church, Jakhu Hanuman Temple, Kufri Snow View, Mall Road Shopping, Toy Train Experience',
        image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=900&q=80',
        nearby_places: JSON.stringify(['Kufri', 'Chail', 'Mashobra', 'Manali']),
        recommended_days: '3 Days',
        categories: JSON.stringify(['Hill Stations', 'Family / Leisure']),
        coordinates: JSON.stringify({ lat: 31.1048, lng: 77.1734 }),
        pickup_points: JSON.stringify(['Mall Road', 'Shimla Old Bus Stand', 'Mathura Office']),
        distance_from_mathura: 490,
        best_time: 'March to June & December to February (Snow)',
        featured: 0,
        enabled: 1
      },
      {
        id: 'nainital',
        name: 'Nainital',
        state: 'Uttarakhand',
        city: 'Nainital',
        type: 'Hill Stations',
        description: 'The enchanting Lake City of Kumaon. Enjoy tranquil boat rides on pear-shaped Naini Lake, visit Naina Devi Temple, and ride the aerial ropeway to Snow View Point.',
        popular_for: 'Naini Lake Boating, Naina Devi Temple, Snow View Point Ropeway, Tiffin Top, Bhimtal & Naukuchiatal',
        image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=900&q=80',
        nearby_places: JSON.stringify(['Bhimtal', 'Mukteshwar', 'Ranikhet', 'Jim Corbett']),
        recommended_days: '3 Days',
        categories: JSON.stringify(['Hill Stations', 'Family / Leisure']),
        coordinates: JSON.stringify({ lat: 29.3919, lng: 79.4542 }),
        pickup_points: JSON.stringify(['Mallital', 'Tallital Bus Stand', 'Mathura Office']),
        distance_from_mathura: 360,
        best_time: 'March to June & September to November',
        featured: 0,
        enabled: 1
      },
      {
        id: 'jim-corbett',
        name: 'Jim Corbett National Park',
        state: 'Uttarakhand',
        city: 'Ramnagar',
        type: 'Nature / Adventure',
        description: 'India’s oldest national park and premier Project Tiger sanctuary. Experience exhilarating open-top jeep safaris through dense Sal forests and riverine grasslands.',
        popular_for: 'Jeep Jungle Safari in Dhikala/Bijrani Zones, Royal Bengal Tiger Spotting, Corbett Falls, Kosi River Rafting & Riverside Luxury Resorts',
        image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=900&q=80',
        nearby_places: JSON.stringify(['Nainital', 'Ranikhet', 'Rishikesh']),
        recommended_days: '2–3 Days',
        categories: JSON.stringify(['Nature / Adventure', 'Family / Leisure']),
        coordinates: JSON.stringify({ lat: 29.5300, lng: 78.7747 }),
        pickup_points: JSON.stringify(['Ramnagar Railway Station', 'Mathura Office']),
        distance_from_mathura: 330,
        best_time: 'November to June (Safari Zones Open)',
        featured: 0,
        enabled: 1
      },
      {
        id: 'udaipur',
        name: 'Udaipur (City of Lakes)',
        state: 'Rajasthan',
        city: 'Udaipur',
        type: 'Historical / Heritage',
        description: 'The romantic Venice of the East, surrounded by the Aravali ranges and mirror-like lakes. Home to the palatial City Palace, Lake Pichola boat cruises, and Jag Mandir.',
        popular_for: 'Lake Pichola Boat Ride, Grand City Palace, Jag Mandir Palace, Saheliyon Ki Bari, Bagore Ki Haveli Folk Dance, Sajjangarh Monsoon Palace',
        image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=900&q=80',
        nearby_places: JSON.stringify(['Kumbhalgarh', 'Ranakpur', 'Chittorgarh', 'Mount Abu']),
        recommended_days: '3–4 Days',
        categories: JSON.stringify(['Historical / Heritage', 'Family / Leisure']),
        coordinates: JSON.stringify({ lat: 24.5854, lng: 73.7125 }),
        pickup_points: JSON.stringify(['City Palace Area', 'Udaipur Bus Stand', 'Mathura Office']),
        distance_from_mathura: 580,
        best_time: 'October to March',
        featured: 0,
        enabled: 1
      },
      {
        id: 'shirdi',
        name: 'Shirdi',
        state: 'Maharashtra',
        city: 'Shirdi',
        type: 'Religious / Pilgrimage',
        description: 'The sacred land of Saint Sai Baba. Pilgrims flock from across the world to receive the divine blessings at Sai Baba Samadhi Mandir and Dwarkamai.',
        popular_for: 'Sai Baba Samadhi Mandir, Dwarkamai Masjid, Chavadi, Gurusthan, Shani Shingnapur Day Trip, Sai Teerth Spiritual Theme Park',
        image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=900&q=80',
        nearby_places: JSON.stringify(['Shani Shingnapur', 'Nashik', 'Trimbakeshwar']),
        recommended_days: '2 Days',
        categories: JSON.stringify(['Religious / Pilgrimage']),
        coordinates: JSON.stringify({ lat: 19.7667, lng: 74.4777 }),
        pickup_points: JSON.stringify(['Shirdi Mandir Gate 2', 'Kopargaon Railway Station']),
        distance_from_mathura: 1100,
        best_time: 'All year round',
        featured: 0,
        enabled: 1
      },
      {
        id: 'amritsar',
        name: 'Amritsar',
        state: 'Punjab',
        city: 'Amritsar',
        type: 'Religious / Pilgrimage',
        description: 'Home of the resplendent Golden Temple (Sri Harmandir Sahib), the spiritual heartbeat of Sikhism. Famous for soulful langar, Jallianwala Bagh, and Wagah Border ceremony.',
        popular_for: 'Golden Temple (Harmandir Sahib), Wagah Border Retreat Ceremony, Jallianwala Bagh Memorial, Partition Museum, Amritsari Kulcha Trail',
        image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=900&q=80',
        nearby_places: JSON.stringify(['Wagah Border', 'Dharamshala', 'Dalhousie']),
        recommended_days: '2 Days',
        categories: JSON.stringify(['Religious / Pilgrimage', 'Historical / Heritage', 'Family / Leisure']),
        coordinates: JSON.stringify({ lat: 31.6340, lng: 74.8723 }),
        pickup_points: JSON.stringify(['Golden Temple Gate', 'Amritsar Cantt', 'Mathura Office']),
        distance_from_mathura: 590,
        best_time: 'October to March',
        featured: 0,
        enabled: 1
      },
      {
        id: 'puri',
        name: 'Puri (Jagannath Puri)',
        state: 'Odisha',
        city: 'Puri',
        type: 'Religious / Pilgrimage',
        description: 'One of the Char Dham holy tirthas on the Bay of Bengal coast. Sacred abode of Lord Jagannath, famous for Mahaprasad, Golden Beach, and nearby Konark Sun Temple.',
        popular_for: 'Shri Jagannath Temple, Puri Golden Beach, Konark Sun Temple, Chilika Lake Dolphin Tour, Raghurajpur Heritage Craft Village',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80',
        nearby_places: JSON.stringify(['Konark', 'Bhubaneswar', 'Chilika Lake']),
        recommended_days: '3 Days',
        categories: JSON.stringify(['Religious / Pilgrimage', 'Beaches', 'Historical / Heritage']),
        coordinates: JSON.stringify({ lat: 19.8135, lng: 85.8312 }),
        pickup_points: JSON.stringify(['Grand Road Puri', 'Bhubaneswar Airport']),
        distance_from_mathura: 1480,
        best_time: 'October to March (Rath Yatra in June/July)',
        featured: 0,
        enabled: 1
      }
    ];

    destinations.forEach(d => {
      insertDest.run(
        d.id, d.name, d.state, d.city, d.type, d.description, d.popular_for, d.image,
        d.nearby_places, d.recommended_days, d.categories, d.coordinates, d.pickup_points,
        d.distance_from_mathura, d.best_time, d.featured, d.enabled
      );
    });
    console.log('✅ Seeded destinations');
  }

  // Seed Packages
  const pkgCount = db.prepare('SELECT COUNT(*) as count FROM packages').get().count;
  if (pkgCount === 0) {
    const insertPkg = db.prepare(`
      INSERT INTO packages (
        id, title, duration, starting_price, destinations, image, description,
        highlights, itinerary, inclusions, exclusions, popular, enabled
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const packages = [
      {
        id: 'mathura-vrindavan-darshan',
        title: 'Mathura – Vrindavan Complete Braj Darshan',
        duration: '2 Days / 1 Night',
        starting_price: 3499,
        destinations: JSON.stringify(['Mathura', 'Vrindavan', 'Gokul', 'Govardhan', 'Barsana', 'Nandgaon']),
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=80',
        description: 'Immerse yourself in the divine land of Shri Radha Krishna. Complete hassle-free Braj Bhoomi pilgrimage with AC vehicle, local knowledgeable chauffeur, and comfortable itinerary.',
        highlights: JSON.stringify([
          'Shri Krishna Janmabhoomi & Dwarkadhish Mandir',
          'Banke Bihari VIP Darshan guidance & Prem Mandir light show',
          'Govardhan Parikrama & Radha Kund / Shyam Kund',
          'Barsana Shri Radha Rani Mandir & Nandgaon',
          'Yamuna Aarti at Vishram Ghat'
        ]),
        itinerary: JSON.stringify([
          {
            day: 'Day 1',
            title: 'Mathura & Vrindavan Darshan',
            details: 'Morning pickup from Mathura New Bus Stand or Station. Visit Shri Krishna Janmabhoomi, Dwarkadhish Mandir, Vishram Ghat. Afternoon transfer to Vrindavan. Darshan at Banke Bihari Mandir, ISKCON Temple, and evening magnificent musical fountain and light show at Prem Mandir.'
          },
          {
            day: 'Day 2',
            title: 'Govardhan, Barsana & Gokul Parikrama',
            details: 'Early morning drive to Govardhan Hill, Dan Ghati Mandir, Mansi Ganga. Proceed to Barsana to seek blessings at Shri Radha Rani Temple (Laadli Ji). Visit Nandgaon and Raman Reti in Gokul. Evening drop back at Mathura.'
          }
        ]),
        inclusions: JSON.stringify([
          'Private dedicated AC vehicle (Sedan/SUV/Traveller)',
          'All toll taxes, state taxes, parking fees & Fastag',
          'Professional, devotional, non-smoking local driver',
          'Driver daily allowance & night stay charges',
          'Flexible pickup and drop anywhere in Mathura/Vrindavan'
        ]),
        exclusions: JSON.stringify([
          'Hotel accommodation (can be added on request)',
          'VIP Temple Darshan entry tickets/puja samagri',
          'Meals, snacks, and mineral water',
          'Personal shopping and porter charges'
        ]),
        popular: 1,
        enabled: 1
      },
      {
        id: 'mathura-agra-tour',
        title: 'Mathura – Vrindavan – Agra Golden Tour',
        duration: '2 Days / 1 Night',
        starting_price: 4499,
        destinations: JSON.stringify(['Mathura', 'Vrindavan', 'Agra', 'Fatehpur Sikri']),
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80',
        description: 'The ultimate blend of spiritual serenity and majestic Mughal history. Experience the holy temples of Vrindavan and the wonder of the world Taj Mahal in Agra.',
        highlights: JSON.stringify([
          'Krishna Janmabhoomi & Banke Bihari Mandir',
          'Prem Mandir Evening Spectacular Illuminations',
          'Sunrise or day tour of the iconic Taj Mahal',
          'Agra Fort & historic Fatehpur Sikri Buland Darwaza'
        ]),
        itinerary: JSON.stringify([
          {
            day: 'Day 1',
            title: 'Braj Bhoomi Darshan (Mathura & Vrindavan)',
            details: 'Pickup from Mathura. Explore Janmabhoomi, Dwarkadhish, ISKCON, Banke Bihari, and Prem Mandir. Evening drive to Agra and check-in to hotel.'
          },
          {
            day: 'Day 2',
            title: 'Agra Heritage & Fatehpur Sikri',
            details: 'Morning visit to Taj Mahal. Explore the red sandstone Agra Fort. Afternoon drive to UNESCO World Heritage site Fatehpur Sikri. Evening drop at Mathura or Agra Station.'
          }
        ]),
        inclusions: JSON.stringify([
          'Dedicated AC cab for full 2-day itinerary',
          'All interstate border permits, toll & parking charges',
          'Experienced highway chauffeur',
          'Pickup & drop at requested location'
        ]),
        exclusions: JSON.stringify([
          'Monument entry tickets at Taj Mahal & Agra Fort',
          'Hotel stay & meals',
          'Approved monument tour guide fee'
        ]),
        popular: 1,
        enabled: 1
      },
      {
        id: 'ayodhya-varanasi-prayagraj',
        title: 'Ayodhya – Varanasi – Prayagraj Mahatirth Yatra',
        duration: '4 Days / 3 Nights',
        starting_price: 11999,
        destinations: JSON.stringify(['Ayodhya', 'Varanasi', 'Prayagraj']),
        image: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=900&q=80',
        description: 'Complete holy pilgrimage covering Ram Lalla Darshan in Ayodhya, holy Sangam snan in Prayagraj, and Kashi Vishwanath Jyotirlinga in Varanasi.',
        highlights: JSON.stringify([
          'Shri Ram Janmabhoomi Mandir & Hanuman Garhi, Ayodhya',
          'Triveni Sangam Boat Ride & Bade Hanuman Ji, Prayagraj',
          'Kashi Vishwanath Corridor & Ganga Aarti at Dashashwamedh Ghat',
          'Assi Ghat Subah-e-Banaras & Sarnath Buddhist Site'
        ]),
        itinerary: JSON.stringify([
          {
            day: 'Day 1',
            title: 'Ayodhya Sacred City Tour',
            details: 'Pickup and drive to Ayodhya. Darshan at Ram Janmabhoomi Mandir, Kanak Bhawan, Hanuman Garhi, and evening Saryu River Aarti.'
          },
          {
            day: 'Day 2',
            title: 'Ayodhya to Prayagraj (Triveni Sangam)',
            details: 'Drive to Prayagraj. Sacred holy dip at Triveni Sangam (Ganga, Yamuna, Saraswati), visit Anand Bhavan and Bade Hanuman Temple. Night stay at Prayagraj or drive to Varanasi.'
          },
          {
            day: 'Day 3',
            title: 'Varanasi Kashi Vishwanath & Ganga Aarti',
            details: 'Early morning boat ride on holy Ganga. Special darshan at Kashi Vishwanath Temple, Annapurna Mandir, Kaal Bhairav. Evening grand Ganga Aarti.'
          },
          {
            day: 'Day 4',
            title: 'Sarnath & Departure',
            details: 'Morning visit to Sarnath Dhamek Stupa & Archaeological Museum. Shopping for Banarasi silks. Afternoon drop at Varanasi Cantt / Airport.'
          }
        ]),
        inclusions: JSON.stringify([
          'Dedicated comfortable AC vehicle with experienced long-distance chauffeur',
          'All interstate taxes, toll plaza charges, parking',
          'Driver night allowance and food',
          'Fuel charges for complete circuit'
        ]),
        exclusions: JSON.stringify([
          'Hotel rooms & all meals',
          'Boat ride fees at Sangam and Dashashwamedh Ghat',
          'Pooja tickets and priest dakshina'
        ]),
        popular: 1,
        enabled: 1
      },
      {
        id: 'golden-triangle-delhi-agra-jaipur',
        title: 'Golden Triangle (Delhi – Agra – Jaipur)',
        duration: '5 Days / 4 Nights',
        starting_price: 14500,
        destinations: JSON.stringify(['Delhi', 'Agra', 'Jaipur', 'Mathura', 'Fatehpur Sikri']),
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80',
        description: 'India’s most celebrated cultural tourist route. Experience the historical monuments of Delhi, the romance of the Taj Mahal in Agra, and the regal forts of Pink City Jaipur.',
        highlights: JSON.stringify([
          'Delhi India Gate, Qutub Minar & Red Fort',
          'Mathura Janmabhoomi stopover on the highway',
          'Taj Mahal & Agra Fort UNESCO World Heritage sites',
          'Amber Fort, Hawa Mahal & Jal Mahal in Jaipur'
        ]),
        itinerary: JSON.stringify([
          {
            day: 'Day 1',
            title: 'Delhi Sightseeing',
            details: 'Pickup from Delhi Airport/Railway Station. Tour India Gate, Rashtrapati Bhavan, Qutub Minar, and Lotus Temple.'
          },
          {
            day: 'Day 2',
            title: 'Delhi to Agra via Mathura',
            details: 'Scenic Yamuna Expressway drive. Quick holy darshan at Mathura Krishna Janmabhoomi. Arrive in Agra and visit Agra Fort.'
          },
          {
            day: 'Day 3',
            title: 'Agra Taj Mahal & Drive to Jaipur',
            details: 'Sunrise at Taj Mahal. En route to Jaipur, explore the abandoned Mughal city Fatehpur Sikri and Abhaneri Stepwell. Evening arrival in Jaipur.'
          },
          {
            day: 'Day 4',
            title: 'Pink City Jaipur Royal Tour',
            details: 'Visit Amber Fort with elephant or jeep ride, Hawa Mahal photo-stop, City Palace Museum, and Jantar Mantar. Evening Chokhi Dhani ethnic village.'
          },
          {
            day: 'Day 5',
            title: 'Jaipur to Delhi Return',
            details: 'Morning visit to Nahargarh Fort. Afternoon drive back to Delhi or drop at Jaipur Airport.'
          }
        ]),
        inclusions: JSON.stringify([
          'Complete 5-day AC private vehicle transportation',
          'All interstate toll, entry taxes, and parking fees',
          'Courteous, verified English & Hindi speaking chauffeur',
          'Driver allowance and night halt charges'
        ]),
        exclusions: JSON.stringify([
          'Hotel accommodation & food',
          'Monument entry tickets',
          'Guide charges'
        ]),
        popular: 0,
        enabled: 1
      },
      {
        id: 'himachal-manali-shimla',
        title: 'Himachal Snow Odyssey (Shimla & Manali)',
        duration: '6 Days / 5 Nights',
        starting_price: 18999,
        destinations: JSON.stringify(['Shimla', 'Kufri', 'Kullu', 'Manali', 'Solang Valley']),
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80',
        description: 'Escape into the majestic Himalayas. Crisp mountain air, snow viewpoints at Solang & Rohtang, apple orchards, and picturesque hill resorts.',
        highlights: JSON.stringify([
          'Shimla Mall Road, Ridge & Kufri Himalayan View',
          'Kullu Valley Shawl Weaving & White Water River Rafting',
          'Solang Valley Paragliding & Atal Tunnel Sissu valley tour',
          'Old Manali Cafes, Hadimba Temple & Vashisht Hot Springs'
        ]),
        itinerary: JSON.stringify([
          { day: 'Day 1', title: 'Delhi/Mathura to Shimla', details: 'Scenic mountain climb into the Shivalik hills. Check-in and evening walk on Mall Road.' },
          { day: 'Day 2', title: 'Shimla & Kufri Excursion', details: 'Visit Kufri amusement park, Jakhu Temple, and colonial Vice-regal Lodge.' },
          { day: 'Day 3', title: 'Shimla to Manali via Kullu', details: 'Panoramic drive along Beas River. River rafting in Kullu and evening arrival in Manali.' },
          { day: 'Day 4', title: 'Manali Local Sightseeing', details: 'Hadimba Temple, Club House, Vashisht Hot Springs, and Tibetan Monastery.' },
          { day: 'Day 5', title: 'Solang Valley & Atal Tunnel', details: 'Full day excursion to Solang Valley for adventure activities and crossing through Atal Tunnel to Lahaul Sissu.' },
          { day: 'Day 6', title: 'Manali to Delhi/Mathura Return', details: 'Scenic descent and return transfer.' }
        ]),
        inclusions: JSON.stringify([
          'All-inclusive private AC vehicle with hill-expert driver',
          'Toll tax, state road tax, green tax, hill permits',
          'Driver food & accommodation allowance'
        ]),
        exclusions: JSON.stringify([
          'Hotel accommodation',
          'Adventure sports tickets (paragliding, rafting, snow suits)',
          'Rohtang Pass NGT special permit fee'
        ]),
        popular: 0,
        enabled: 1
      },
      {
        id: 'haridwar-rishikesh-weekend',
        title: 'Haridwar & Rishikesh Spiritual & Adventure Break',
        duration: '3 Days / 2 Nights',
        starting_price: 6499,
        destinations: JSON.stringify(['Haridwar', 'Rishikesh']),
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80',
        description: 'The ideal quick weekend retreat from Mathura or Delhi. Experience the holy dip at Har Ki Pauri and exhilarating river rafting in Rishikesh.',
        highlights: JSON.stringify([
          'Har Ki Pauri Evening Ganga Aarti',
          'Mansa Devi Ropeway Ride',
          '16 KM River Rafting in Shivpuri / Rishikesh',
          'Ram Jhula, Lakshman Jhula & Beatles Ashram'
        ]),
        itinerary: JSON.stringify([
          { day: 'Day 1', title: 'Mathura to Haridwar', details: 'Morning drive. Check in at Haridwar. Visit Mansa Devi and Har Ki Pauri Ganga Aarti.' },
          { day: 'Day 2', title: 'Haridwar to Rishikesh Adventure', details: 'Drive to Rishikesh. White water river rafting on the Ganges, cliff jumping, and Triveni Ghat Aarti.' },
          { day: 'Day 3', title: 'Rishikesh to Mathura Return', details: 'Morning yoga session/Beatles Ashram visit and smooth drive back.' }
        ]),
        inclusions: JSON.stringify([
          'AC Cab for entire journey',
          'Tolls, parking, driver allowance included',
          'Doorstep pickup and drop'
        ]),
        exclusions: JSON.stringify([
          'Hotels and meals',
          'Rafting & adventure activity charges'
        ]),
        popular: 0,
        enabled: 1
      }
    ];

    packages.forEach(p => {
      insertPkg.run(
        p.id, p.title, p.duration, p.starting_price, p.destinations, p.image,
        p.description, p.highlights, p.itinerary, p.inclusions, p.exclusions,
        p.popular, p.enabled
      );
    });
    console.log('✅ Seeded packages');
  }

  // Seed Reviews
  const revCount = db.prepare('SELECT COUNT(*) as count FROM reviews').get().count;
  if (revCount === 0) {
    const insertRev = db.prepare(`
      INSERT INTO reviews (id, customer_name, customer_city, rating, comment, trip_route, vehicle_used, date, verified, approved)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const reviews = [
      {
        id: 'rev-01',
        customer_name: 'Suresh Chandra Sharma',
        customer_city: 'Delhi',
        rating: 5,
        comment: 'We booked Innova Crysta for our family Mathura-Vrindavan-Govardhan parikrama. Driver Dharmendra Ji was extremely polite, knowledgeable, and punctual. My elderly parents were very comfortable throughout the trip.',
        trip_route: 'Mathura – Vrindavan – Govardhan',
        vehicle_used: 'Toyota Innova Crysta',
        date: '2026-08-28',
        verified: 1,
        approved: 1
      },
      {
        id: 'rev-02',
        customer_name: 'Pooja Aggarwal',
        customer_city: 'Jaipur',
        rating: 5,
        comment: 'Outstanding service! Khushi Travels provided clean sanitized Dzire for our Agra and Mathura trip. Transparent pricing without any hidden charges. Booking confirmation on WhatsApp was instantaneous.',
        trip_route: 'Agra & Mathura Day Tour',
        vehicle_used: 'Maruti Suzuki Dzire',
        date: '2026-09-02',
        verified: 1,
        approved: 1
      },
      {
        id: 'rev-03',
        customer_name: 'Ramesh Gupta & Group',
        customer_city: 'Kanpur',
        rating: 5,
        comment: 'Booked 17-seater Tempo Traveller for 15 devotees visiting Ayodhya and Varanasi from Mathura. The vehicle had supreme pushback seats and excellent music system. The entire group was thoroughly satisfied.',
        trip_route: 'Mathura to Ayodhya – Kashi',
        vehicle_used: 'Maharaja Tempo Traveller 17 Seater',
        date: '2026-09-06',
        verified: 1,
        approved: 1
      },
      {
        id: 'rev-04',
        customer_name: 'Dr. Amit Trivedi',
        customer_city: 'Lucknow',
        rating: 5,
        comment: 'Very professional tour operator in Mathura. Picked us up right on time from Mathura New Bus Stand office. Highly recommended for religious and family trips.',
        trip_route: 'Braj Bhoomi Complete Darshan',
        vehicle_used: 'Maruti Ertiga',
        date: '2026-09-10',
        verified: 1,
        approved: 1
      }
    ];

    reviews.forEach(r => {
      insertRev.run(r.id, r.customer_name, r.customer_city, r.rating, r.comment, r.trip_route, r.vehicle_used, r.date, r.verified, r.approved);
    });
    console.log('✅ Seeded reviews');
  }

  // Seed sample real bookings so admin dashboard displays real data initially
  const bookCount = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;
  if (bookCount === 0) {
    const insertBook = db.prepare(`
      INSERT INTO bookings (
        id, booking_id, customer_name, customer_phone, customer_whatsapp, customer_email,
        trip_type, destinations, pickup_location, pickup_address, travel_date, return_date,
        travellers_adults, travellers_children, travellers_seniors, total_passengers,
        vehicle_id, vehicle_name, package_id, package_title, special_requests, estimated_fare,
        status, payment_status, assigned_driver, assigned_vehicle_no, admin_notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const sampleBookings = [
      {
        id: 'book-seed-01',
        booking_id: 'KT-20260914-0012',
        customer_name: 'Rahul Kumar',
        customer_phone: '9876543210',
        customer_whatsapp: '9876543210',
        customer_email: 'rahul.k@gmail.com',
        trip_type: 'Round Trip',
        destinations: JSON.stringify(['Mathura', 'Vrindavan', 'Agra']),
        pickup_location: 'Mathura New Bus Stand (Main Office)',
        pickup_address: 'Adarsh Nagar, Manoharpura, Mathura',
        travel_date: '2026-09-20',
        return_date: '2026-09-22',
        travellers_adults: 4,
        travellers_children: 1,
        travellers_seniors: 0,
        total_passengers: 5,
        vehicle_id: 'innova-crysta',
        vehicle_name: 'Toyota Innova Crysta',
        package_id: 'mathura-agra-tour',
        package_title: 'Mathura – Vrindavan – Agra Golden Tour',
        special_requests: 'Senior citizen travelling, need low step entry and AC at all times.',
        estimated_fare: 8400,
        status: 'PENDING',
        payment_status: 'PAYMENT_PENDING',
        assigned_driver: '',
        assigned_vehicle_no: '',
        admin_notes: 'Customer requested morning 8 AM pickup from Bus Stand.',
        created_at: '2026-09-14 10:30:00',
        updated_at: '2026-09-14 10:30:00'
      },
      {
        id: 'book-seed-02',
        booking_id: 'KT-20260913-0008',
        customer_name: 'Vikram Singh Shekhawat',
        customer_phone: '9829012345',
        customer_whatsapp: '9829012345',
        customer_email: 'vikram.singh@yahoo.com',
        trip_type: 'Round Trip',
        destinations: JSON.stringify(['Mathura', 'Vrindavan']),
        pickup_location: 'Mathura Junction Railway Station',
        pickup_address: 'Platform 1 Exit Gate, Mathura Junction',
        travel_date: '2026-09-18',
        return_date: '2026-09-19',
        travellers_adults: 3,
        travellers_children: 0,
        travellers_seniors: 1,
        total_passengers: 4,
        vehicle_id: 'maruti-dzire',
        vehicle_name: 'Maruti Suzuki Dzire',
        package_id: 'mathura-vrindavan-darshan',
        package_title: 'Mathura – Vrindavan Complete Braj Darshan',
        special_requests: 'Early morning 6:30 AM arrival by Shatabdi.',
        estimated_fare: 5200,
        status: 'CONFIRMED',
        payment_status: 'ADVANCE_PAID',
        assigned_driver: 'Mahesh Sharma (9871122334)',
        assigned_vehicle_no: 'UP 85 BX 4012',
        admin_notes: 'Advance ₹1000 received. Confirmed driver Mahesh.',
        created_at: '2026-09-13 14:15:00',
        updated_at: '2026-09-13 16:00:00'
      },
      {
        id: 'book-seed-03',
        booking_id: 'KT-20260912-0005',
        customer_name: 'Sunita Mehra',
        customer_phone: '9910554433',
        customer_whatsapp: '9910554433',
        customer_email: 'sunita.mehra@outlook.com',
        trip_type: 'Multi Day',
        destinations: JSON.stringify(['Ayodhya', 'Varanasi', 'Prayagraj']),
        pickup_location: 'Delhi IGI Airport (T1/T2/T3)',
        pickup_address: 'Terminal 3 Arrival Gate 4',
        travel_date: '2026-09-25',
        return_date: '2026-09-29',
        travellers_adults: 10,
        travellers_children: 2,
        travellers_seniors: 2,
        total_passengers: 14,
        vehicle_id: 'tempo-traveller-17',
        vehicle_name: 'Force Maharaja Tempo Traveller (17 Seater)',
        package_id: 'ayodhya-varanasi-prayagraj',
        package_title: 'Ayodhya – Varanasi – Prayagraj Mahatirth Yatra',
        special_requests: 'Require luggage carrier and 2 mineral water crates.',
        estimated_fare: 38500,
        status: 'CONFIRMED',
        payment_status: 'PARTIALLY_PAID',
        assigned_driver: 'Radheshyam Rawat (9761998877)',
        assigned_vehicle_no: 'UP 85 AZ 9001',
        admin_notes: 'Full group itinerary confirmed with flight arrival at 9 AM.',
        created_at: '2026-09-12 11:45:00',
        updated_at: '2026-09-12 15:20:00'
      },
      {
        id: 'book-seed-04',
        booking_id: 'KT-20260910-0002',
        customer_name: 'Anand Verma',
        customer_phone: '9456781230',
        customer_whatsapp: '9456781230',
        customer_email: 'anandv@gmail.com',
        trip_type: 'One Way',
        destinations: JSON.stringify(['Jaipur']),
        pickup_location: 'Mathura New Bus Stand (Main Office)',
        pickup_address: 'Adarsh Nagar, Manoharpura, Mathura',
        travel_date: '2026-09-11',
        return_date: '',
        travellers_adults: 2,
        travellers_children: 0,
        travellers_seniors: 0,
        total_passengers: 2,
        vehicle_id: 'toyota-etios',
        vehicle_name: 'Toyota Etios',
        package_id: null,
        package_title: 'Direct Outstation Transfer',
        special_requests: 'One way drop to Jaipur airport.',
        estimated_fare: 3500,
        status: 'COMPLETED',
        payment_status: 'FULLY_PAID',
        assigned_driver: 'Sanjay Yadav (9837001122)',
        assigned_vehicle_no: 'UP 85 CA 3411',
        admin_notes: 'Trip completed safely. Customer gave 5-star rating.',
        created_at: '2026-09-10 09:10:00',
        updated_at: '2026-09-11 18:30:00'
      }
    ];

    sampleBookings.forEach(b => {
      insertBook.run(
        b.id, b.booking_id, b.customer_name, b.customer_phone, b.customer_whatsapp, b.customer_email,
        b.trip_type, b.destinations, b.pickup_location, b.pickup_address, b.travel_date, b.return_date,
        b.travellers_adults, b.travellers_children, b.travellers_seniors, b.total_passengers,
        b.vehicle_id, b.vehicle_name, b.package_id, b.package_title, b.special_requests, b.estimated_fare,
        b.status, b.payment_status, b.assigned_driver, b.assigned_vehicle_no, b.admin_notes, b.created_at, b.updated_at
      );
    });
    console.log('✅ Seeded bookings');
  }

  // Seed SMS Logs
  const smsCount = db.prepare('SELECT COUNT(*) as count FROM sms_logs').get().count;
  if (smsCount === 0) {
    const insertSms = db.prepare(`
      INSERT INTO sms_logs (id, booking_id, recipient_phone, recipient_type, template_name, message, status, provider_response)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialSms = [
      {
        id: 'sms-01',
        booking_id: 'KT-20260914-0012',
        recipient_phone: '9876543210',
        recipient_type: 'CUSTOMER',
        template_name: 'BOOKING_RECEIVED',
        message: 'Khushi Travels: Your booking request KT-20260914-0012 for Mathura - Agra on 20 Sep has been received. Our team will contact you shortly. Helpdesk: 9634400179',
        status: 'SENT',
        provider_response: '{"status":"success","code":"SMS_DELIVERED","message_id":"MSG-9634-88912"}'
      },
      {
        id: 'sms-02',
        booking_id: 'KT-20260914-0012',
        recipient_phone: '9634400179',
        recipient_type: 'ADMIN',
        template_name: 'NEW_BOOKING_ALERT',
        message: 'New Khushi Travels Booking! ID: KT-20260914-0012, Customer: Rahul Kumar (9876543210), Trip: Mathura + Agra, Date: 20 Sep 2026, Pax: 5, Vehicle: Innova Crysta. Please review.',
        status: 'SENT',
        provider_response: '{"status":"success","code":"SMS_DELIVERED","message_id":"MSG-9634-88913"}'
      },
      {
        id: 'sms-03',
        booking_id: 'KT-20260913-0008',
        recipient_phone: '9829012345',
        recipient_type: 'CUSTOMER',
        template_name: 'BOOKING_CONFIRMED',
        message: 'Khushi Travels: Your booking KT-20260913-0008 has been CONFIRMED! Travel Date: 18 Sep 2026. Vehicle: Dzire (UP 85 BX 4012), Driver: Mahesh Sharma (9871122334). Happy Journey! 9634400179',
        status: 'SENT',
        provider_response: '{"status":"success","code":"SMS_DELIVERED","message_id":"MSG-9634-88914"}'
      }
    ];

    initialSms.forEach(s => {
      insertSms.run(s.id, s.booking_id, s.recipient_phone, s.recipient_type, s.template_name, s.message, s.status, s.provider_response);
    });
    console.log('✅ Seeded SMS logs');
  }
}

export default db;
