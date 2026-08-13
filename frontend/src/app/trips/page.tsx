'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getBookingsForUser, cancelBooking } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import styles from './page.module.css';

export default function TripsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    getBookingsForUser(user.id)
      .then(setBookings)
      .catch(() => toast.error('Failed to load trips'))
      .finally(() => setLoading(false));
  }, [user.id]);

  const handleCancel = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(bookingId);
    try {
      await cancelBooking(bookingId);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled');
    } catch {
      toast.error('Failed to cancel booking');
    } finally {
      setCancelling(null);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

  const upcoming = bookings.filter(b => b.status === 'confirmed' && new Date(b.check_in) >= new Date());
  const past = bookings.filter(b => b.status !== 'cancelled' && new Date(b.check_in) < new Date());
  const cancelled = bookings.filter(b => b.status === 'cancelled');

  const TripCard = ({ booking, showCancel }: { booking: any; showCancel?: boolean }) => {
    const listing = booking.listing;
    let photos: string[] = [];
    try { photos = typeof listing?.photos === 'string' ? JSON.parse(listing.photos) : (listing?.photos || []); } catch {}
    const nights = Math.ceil((new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / (1000 * 60 * 60 * 24));

    return (
      <div className={`${styles.tripCard} ${booking.status === 'cancelled' ? styles.cancelled : ''}`}>
        <div className={styles.tripPhoto}>
          {photos[0] && <Image src={photos[0]} alt={listing?.title || 'Listing'} fill style={{ objectFit: 'cover' }} />}
          {!photos[0] && <div className={styles.noPhoto}>🏠</div>}
        </div>
        <div className={styles.tripInfo}>
          <div className={styles.tripHeader}>
            <div>
              <div className={styles.tripLocation}>{listing?.location || 'Unknown location'}</div>
              <h3 className={styles.tripTitle}>{listing?.title || 'Listing'}</h3>
            </div>
            <span className={`${styles.statusBadge} ${booking.status === 'confirmed' ? styles.statusConfirmed : styles.statusCancelled}`}>
              {booking.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}
            </span>
          </div>

          <div className={styles.tripMeta}>
            <div className={styles.tripMetaItem}>
              <span className={styles.tripMetaLabel}>Dates</span>
              <span className={styles.tripMetaValue}>{formatDate(booking.check_in)} – {formatDate(booking.check_out)}</span>
            </div>
            <div className={styles.tripMetaItem}>
              <span className={styles.tripMetaLabel}>Guests</span>
              <span className={styles.tripMetaValue}>{booking.guest_count || 1} guest{(booking.guest_count || 1) > 1 ? 's' : ''}</span>
            </div>
            <div className={styles.tripMetaItem}>
              <span className={styles.tripMetaLabel}>Duration</span>
              <span className={styles.tripMetaValue}>{nights} night{nights > 1 ? 's' : ''}</span>
            </div>
            <div className={styles.tripMetaItem}>
              <span className={styles.tripMetaLabel}>Total</span>
              <span className={styles.tripMetaValue}>₹{booking.total_price?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className={styles.tripActions}>
            {listing && (
              <Link href={`/listings/${listing.id}`} className={styles.viewBtn}>View listing</Link>
            )}
            <Link href={`/bookings/${booking.id}`} className={styles.detailBtn}>Booking details</Link>
            {showCancel && booking.status === 'confirmed' && (
              <button className={styles.cancelBtn} onClick={() => handleCancel(booking.id)} disabled={cancelling === booking.id}>
                {cancelling === booking.id ? 'Cancelling...' : 'Cancel booking'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container">
        <div className={styles.page}>
          <h1 className={styles.pageTitle}>Trips</h1>
          <div className={styles.skeletonList}>
            {[1, 2, 3].map(i => <div key={i} className={styles.skeleton}></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Trips</h1>
        <p className={styles.pageSubtitle}>
          Logged in as <strong>{user.name}</strong>
          {user.is_host ? ' (Host — switch to a guest account to see your bookings)' : ''}
        </p>

        {bookings.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🧳</div>
            <h2>No trips yet</h2>
            <p>When you book a trip, it will appear here.</p>
            <Link href="/" className={styles.exploreBtn}>Start exploring</Link>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Upcoming trips ({upcoming.length})</h2>
                <div className={styles.tripList}>
                  {upcoming.map(b => <TripCard key={b.id} booking={b} showCancel />)}
                </div>
              </section>
            )}
            {past.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Past trips ({past.length})</h2>
                <div className={styles.tripList}>
                  {past.map(b => <TripCard key={b.id} booking={b} />)}
                </div>
              </section>
            )}
            {cancelled.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Cancelled trips ({cancelled.length})</h2>
                <div className={styles.tripList}>
                  {cancelled.map(b => <TripCard key={b.id} booking={b} />)}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
