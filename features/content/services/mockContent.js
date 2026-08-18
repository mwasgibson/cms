import { withLatency } from '../../../utils/mockMode'

// Versioned key prevents the old Panda Towers seed from surviving in localStorage.
const STORAGE_KEY = 'hotel_mock_content_v2'

const SEED_CONTENT = {
  home: {
    headline: 'Welcome to Our Hotel',
    subheadline: 'Find comfortable rooms and book your stay online.',
    hero_image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80',
    cta_primary: 'View Available Rooms',
    cta_primary_url: 'rooms.html',
    service_1: 'Luxury Rooms',
    service_2: 'Restaurant',
    service_3: 'Free Wi-Fi',
    service_4: 'Conference Rooms',
    service_5: 'Airport Pickup',
    quick_link_label: 'Book a Room',
    quick_link_url: 'booking.html',
  },
  navigation: {
    home: 'Home',
    dashboard: 'Dashboard',
    booking: 'Booking',
    reservations: 'Reservations',
    rooms: 'Rooms',
    deals: 'Deals',
    events: 'Events',
    contact: 'Contact',
    register: 'Register',
    login: 'Login',
  },
  contact: {
    title: 'Contact Us',
    phone: '+254 108 962 037',
    email: 'gibsonmwangi72@gmail.com',
    location: 'Nairobi, Kenya',
    name_placeholder: 'Your Name',
    email_placeholder: 'Your Email',
    subject_placeholder: 'Subject',
    message_placeholder: 'Your Message',
    submit_label: 'Send Message',
  },
  footer: {
    copyright: '© 2026 HOTEL NAME',
    privacy_label: 'Privacy Policy',
    privacy_url: '#',
    terms_label: 'Terms & Conditions',
    terms_url: '#',
    cookie_label: 'Cookie Policy',
    cookie_url: '#',
  },
  seo: {
    site_title: 'Hotel Management System',
    site_description: 'Find comfortable rooms and book your stay online.',
    home_keywords: 'hotel, rooms, accommodation, booking, Nairobi',
    og_image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80',
  },
}

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // Reseed below if localStorage contains invalid JSON.
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CONTENT))
  return SEED_CONTENT
}

function saveStore(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export async function mockGetContent() {
  return withLatency(loadStore())
}

export async function mockUpdateSection(section, payload) {
  const data = loadStore()
  data[section] = typeof payload === 'object' && !Array.isArray(payload)
    ? { ...(data[section] || {}), ...payload }
    : payload
  saveStore(data)
  return withLatency(data[section])
}
