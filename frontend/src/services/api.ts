const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const getListings = async (params?: {
  location?: string; min_price?: number; max_price?: number;
  property_type?: string; guests?: number; category?: string; host_id?: number;
}) => {
  const url = new URL(`${API_URL}/listings/`);
  if (params?.location) url.searchParams.set('location', params.location);
  if (params?.min_price != null) url.searchParams.set('min_price', String(params.min_price));
  if (params?.max_price != null) url.searchParams.set('max_price', String(params.max_price));
  if (params?.property_type) url.searchParams.set('property_type', params.property_type);
  if (params?.guests != null) url.searchParams.set('guests', String(params.guests));
  if (params?.category) url.searchParams.set('category', params.category);
  if (params?.host_id != null) url.searchParams.set('host_id', String(params.host_id));
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch listings');
  return res.json();
};

export const getListingById = async (id: string) => {
  const res = await fetch(`${API_URL}/listings/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch listing');
  return res.json();
};

export const getListingBookings = async (listingId: string) => {
  const res = await fetch(`${API_URL}/listings/${listingId}/bookings`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch listing bookings');
  return res.json();
};

export const getBookingById = async (id: string) => {
  const res = await fetch(`${API_URL}/bookings/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch booking');
  return res.json();
};

export const getBookingsForUser = async (userId: string | number) => {
  const res = await fetch(`${API_URL}/users/${userId}/bookings`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
};

export const createBooking = async (bookingData: any) => {
  const res = await fetch(`${API_URL}/bookings/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to create booking' }));
    throw new Error(err.detail || 'Failed to create booking');
  }
  return res.json();
};

export const cancelBooking = async (bookingId: number) => {
  const res = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to cancel booking');
  return res.json();
};

export const createListing = async (listingData: any) => {
  const res = await fetch(`${API_URL}/listings/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(listingData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to create listing' }));
    throw new Error(err.detail || 'Failed to create listing');
  }
  return res.json();
};

export const updateListing = async (id: number, listingData: any) => {
  const res = await fetch(`${API_URL}/listings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(listingData),
  });
  if (!res.ok) throw new Error('Failed to update listing');
  return res.json();
};

export const deleteListing = async (id: number) => {
  const res = await fetch(`${API_URL}/listings/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete listing');
  return res.json();
};

export const getUsers = async () => {
  const res = await fetch(`${API_URL}/users/`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};
