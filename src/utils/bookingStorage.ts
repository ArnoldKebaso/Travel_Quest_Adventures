// Booking storage utility for managing bookings in localStorage

export interface DestinationBooking {
  id: string;
  type: 'destination';
  destination_id: string;
  destination_name: string;
  customer_name: string;
  customer_email: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface TourBooking {
  id: string;
  type: 'tour';
  tour_id: string;
  tour_title: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_date: string;
  guests: number;
  total_price: number;
  special_requests: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export type UnifiedBooking = DestinationBooking | TourBooking;

const STORAGE_KEY = 'travelquest_bookings';

// Initialize with demo bookings
const demoBookings: UnifiedBooking[] = [
  {
    id: 'bk1',
    type: 'tour',
    tour_id: 't1',
    tour_title: 'Great Barrier Reef Diving Expedition',
    customer_name: 'Sarah Johnson',
    customer_email: 'sarah.j@email.com',
    customer_phone: '+61 412 345 678',
    start_date: '2025-02-15',
    guests: 2,
    total_price: 2400,
    special_requests: 'Vegetarian meals please',
    status: 'confirmed',
    created_at: '2025-01-20T10:00:00Z'
  },
  {
    id: 'bk2',
    type: 'tour',
    tour_id: 't2',
    tour_title: 'Outback Explorer Tour',
    customer_name: 'Mark Wilson',
    customer_email: 'mark.wilson@email.com',
    customer_phone: '+61 423 456 789',
    start_date: '2025-03-01',
    guests: 4,
    total_price: 7200,
    special_requests: 'Need wheelchair accessible vehicle',
    status: 'confirmed',
    created_at: '2025-01-18T14:30:00Z'
  },
  {
    id: 'bk3',
    type: 'tour',
    tour_id: 't3',
    tour_title: 'Tasmania Wilderness Trek',
    customer_name: 'Emily Chen',
    customer_email: 'emily.chen@email.com',
    customer_phone: '+61 434 567 890',
    start_date: '2025-03-15',
    guests: 2,
    total_price: 4200,
    special_requests: 'None',
    status: 'pending',
    created_at: '2025-01-22T09:15:00Z'
  },
  {
    id: 'dst1',
    type: 'destination',
    destination_id: '1',
    destination_name: 'Great Barrier Reef Adventure',
    customer_name: 'Jennifer Davis',
    customer_email: 'jennifer.davis@email.com',
    check_in: '2025-02-20',
    check_out: '2025-02-25',
    guests: 2,
    total_price: 1250,
    status: 'confirmed',
    created_at: '2025-01-19T15:20:00Z'
  },
  {
    id: 'dst2',
    type: 'destination',
    destination_id: '2',
    destination_name: 'Sydney Harbor Experience',
    customer_name: 'Robert Martinez',
    customer_email: 'robert.m@email.com',
    check_in: '2025-03-05',
    check_out: '2025-03-08',
    guests: 3,
    total_price: 900,
    status: 'confirmed',
    created_at: '2025-01-21T11:45:00Z'
  }
];

// Load bookings from localStorage or initialize with demo data
export const loadBookings = (): UnifiedBooking[] => {
  if (typeof window === 'undefined') return demoBookings;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing bookings:', error);
      return demoBookings;
    }
  }
  
  // Initialize with demo data on first load
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoBookings));
  return demoBookings;
};

// Save bookings to localStorage
export const saveBookings = (bookings: UnifiedBooking[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch (error) {
    console.error('Error saving bookings:', error);
  }
};

// Add a new booking
export const addBooking = (booking: UnifiedBooking): void => {
  const bookings = loadBookings();
  bookings.unshift(booking); // Add to beginning
  saveBookings(bookings);
};

// Update booking status
export const updateBookingStatus = (
  id: string,
  status: 'pending' | 'confirmed' | 'cancelled'
): void => {
  const bookings = loadBookings();
  const updated = bookings.map(b => 
    b.id === id ? { ...b, status } : b
  );
  saveBookings(updated);
};

// Generate unique booking ID
export const generateBookingId = (type: 'tour' | 'destination'): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  const prefix = type === 'tour' ? 'bk' : 'dst';
  return `${prefix}_${timestamp}_${random}`;
};

// Generate booking reference number
export const generateBookingReference = (): string => {
  return `TQ-${Date.now().toString().slice(-6)}`;
};
