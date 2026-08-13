import { getBookingById } from '@/services/api';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default async function BookingConfirmation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let booking: any;
  try {
    booking = await getBookingById(id);
  } catch {
    return (
      <div className="container" style={{ paddingTop: '80px', textAlign: 'center' }}>
        <h1>Booking not found</h1>
        <Link href="/trips" style={{ marginTop: '16px', display: 'inline-block', textDecoration: 'underline' }}>View my trips</Link>
      </div>
    );
  }

  const listing = booking.listing;
  let photos: string[] = [];
  try { photos = typeof listing?.photos === 'string' ? JSON.parse(listing.photos) : (listing?.photos || []); } catch { photos = []; }

  const nights = listing ? Math.ceil((new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const nightlyTotal = nights * (listing?.price_per_night || 0);
  const cleaningFee = Math.round((listing?.price_per_night || 0) * 0.15);
  const serviceFee = Math.round(nightlyTotal * 0.14);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="container">
      <div className={styles.page}>

        {/* Left: Confirmation Info */}
        <div className={styles.main}>
          <div className={styles.successBanner}>
            <div className={styles.successIcon}>🎉</div>
            <div>
              <h1 className={styles.successTitle}>Your booking is confirmed!</h1>
              <p className={styles.successSubtitle}>Booking #{booking.id} · Get ready for your trip</p>
            </div>
          </div>

          {listing && (
            <>
              <div className={styles.card}>
                <h2>Your trip</h2>
                <div className={styles.tripGrid}>
                  <div className={styles.tripItem}>
                    <div className={styles.tripLabel}>Dates</div>
                    <div className={styles.tripValue}>{formatDate(booking.check_in)} – {formatDate(booking.check_out)}</div>
                  </div>
                  <div className={styles.tripItem}>
                    <div className={styles.tripLabel}>Guests</div>
                    <div className={styles.tripValue}>{booking.guest_count || 1} guest{(booking.guest_count || 1) > 1 ? 's' : ''}</div>
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <h2>Price details</h2>
                <div className={styles.priceRows}>
                  <div className={styles.priceRow}>
                    <span>₹{listing.price_per_night?.toLocaleString('en-IN')} × {nights} night{nights > 1 ? 's' : ''}</span>
                    <span>₹{nightlyTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className={styles.priceRow}>
                    <span>Cleaning fee</span>
                    <span>₹{cleaningFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className={styles.priceRow}>
                    <span>Airbnb service fee</span>
                    <span>₹{serviceFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className={styles.totalRow}>
                    <span>Total (INR)</span>
                    <span>₹{booking.total_price?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <h2>What&apos;s next</h2>
                <div className={styles.nextSteps}>
                  <div className={styles.step}><span className={styles.stepNum}>1</span><span>You&apos;ll receive a confirmation email with all the details</span></div>
                  <div className={styles.step}><span className={styles.stepNum}>2</span><span>Contact your host 2 days before check-in</span></div>
                  <div className={styles.step}><span className={styles.stepNum}>3</span><span>Review check-in instructions sent by your host</span></div>
                </div>
              </div>

              <div className={styles.actions}>
                <Link href="/trips" className={styles.primaryBtn}>View my trips</Link>
                <Link href="/" className={styles.secondaryBtn}>Back to home</Link>
              </div>
            </>
          )}
        </div>

        {/* Right: Listing summary */}
        {listing && (
          <div className={styles.sidebar}>
            <div className={styles.listingSummary}>
              <div className={styles.summaryPhoto}>
                {photos[0] && <Image src={photos[0]} alt={listing.title} fill style={{ objectFit: 'cover' }} />}
              </div>
              <div className={styles.summaryInfo}>
                <div className={styles.summaryType}>{listing.property_type}</div>
                <div className={styles.summaryTitle}>{listing.title}</div>
                <div className={styles.summaryLocation}>{listing.location}</div>
                <div className={styles.summaryRating}>★ {listing.rating?.toFixed(2)} · {listing.num_reviews} reviews</div>
              </div>
            </div>
            <div className={styles.statusBadge}>
              <span className={`${styles.badge} ${booking.status === 'confirmed' ? styles.confirmed : styles.cancelled}`}>
                {booking.status === 'confirmed' ? '✓ Confirmed' : booking.status}
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
