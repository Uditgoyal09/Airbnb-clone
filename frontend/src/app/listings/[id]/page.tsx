import { getListingById } from '@/services/api';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import BookingWidget from '@/components/BookingWidget';
import ListingMap from '@/components/ListingMap';
import GallerySection from './GallerySection';

// Mocked reviews data
const MOCK_REVIEWS = [
  { id: 1, name: 'Aarav Patel', avatar: 'https://i.pravatar.cc/150?u=aarav', date: 'July 2026', text: 'Absolutely stunning place! The host was incredibly welcoming, the property was exactly as described, and the views were breathtaking. Would highly recommend to anyone visiting the area.', rating: 5 },
  { id: 2, name: 'Sanya Kapoor', avatar: 'https://i.pravatar.cc/150?u=sanya', date: 'June 2026', text: 'We had the most wonderful stay here. The space was immaculately clean, well-stocked with everything we needed, and the location was perfect. Ananya was a fantastic host — very responsive and helpful throughout.', rating: 5 },
  { id: 3, name: 'Rohan Desai', avatar: 'https://i.pravatar.cc/150?u=rohan', date: 'May 2026', text: 'Great value for money. The apartment was cozy and comfortable. Location was very convenient — close to shops and transport. The check-in was smooth and instructions were clear. Will definitely return!', rating: 4 },
  { id: 4, name: 'Meera Nair', avatar: 'https://i.pravatar.cc/150?u=meera', date: 'April 2026', text: "One of my best Airbnb stays in India. Everything was perfect — from the thoughtful amenities to the gorgeous outdoor space. Waking up to that view every morning was the highlight of our trip!", rating: 5 },
];

const AMENITY_ICONS: Record<string, string> = {
  'Wifi': '📶', 'Kitchen': '🍳', 'Free parking': '🚗', 'Air conditioning': '❄️',
  'Pool': '🏊', 'Gym': '🏋️', 'Beach access': '🏖️', '55" HDTV': '📺',
  'Washer': '🫧', 'Dryer': '🌀', 'Indoor fireplace': '🔥', 'Hot tub': '♨️',
  'BBQ grill': '🍖', 'Balcony': '🌅', 'Garden': '🌿', 'Dedicated workspace': '💻',
};

export default async function ListingDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let listing: any;
  try {
    listing = await getListingById(resolvedParams.id);
  } catch {
    return (
      <div className="container" style={{ paddingTop: '80px', textAlign: 'center' }}>
        <h1>Listing not found</h1>
        <p style={{ marginTop: '16px', color: '#717171' }}>Sorry, we could not find what you were looking for.</p>
        <Link href="/" style={{ display: 'inline-block', marginTop: '24px', color: '#222', textDecoration: 'underline' }}>← Back to home</Link>
      </div>
    );
  }

  let photos: string[] = [];
  try { photos = typeof listing.photos === 'string' ? JSON.parse(listing.photos) : listing.photos; } catch { photos = []; }

  let amenities: string[] = [];
  try { amenities = typeof listing.amenities === 'string' ? JSON.parse(listing.amenities) : listing.amenities; } catch { amenities = []; }

  return (
    <div className={`container ${styles.page}`}>
      {/* Title */}
      <h1 className={styles.title}>{listing.title}</h1>

      {/* Meta row */}
      <div className={styles.metaRow}>
        <div className={styles.metaLeft}>
          <span className={styles.rating}>★ {(listing.rating || 4.95).toFixed(2)}</span>
          <span className={styles.dot}>·</span>
          <span className={styles.reviews}>{listing.num_reviews || 0} reviews</span>
          <span className={styles.dot}>·</span>
          {listing.rating >= 4.9 && <span className={styles.superhost}>⭐ Superhost</span>}
          {listing.rating >= 4.9 && <span className={styles.dot}>·</span>}
          <span className={styles.location}>{listing.location}</span>
        </div>
        <div className={styles.metaActions}>
          <button className={styles.actionBtn}>
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ height: '16px', width: '16px', fill: 'none', stroke: 'currentcolor', strokeWidth: '2' }}><path d="M27 5H5a2 2 0 0 0-2 2v18l4-4h20a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/></svg>
            Share
          </button>
          <button className={styles.actionBtn}>
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ height: '16px', width: '16px', fill: 'none', stroke: 'currentcolor', strokeWidth: '2' }}><path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 8.1l-2.05-2.05a6.98 6.98 0 0 0-9.9 9.9C5.5 18 16 28 16 28z"/></svg>
            Save
          </button>
        </div>
      </div>

      {/* Photo Gallery */}
      <GallerySection photos={photos} title={listing.title} />

      {/* Main content + Sidebar */}
      <div className={styles.contentGrid}>
        <div className={styles.details}>

          {/* Host header */}
          <div className={styles.hostHeader}>
            <div>
              <h2 className={styles.hostTitle}>{listing.property_type} hosted by {listing.host?.name || 'Host'}</h2>
              <div className={styles.specs}>
                <span>{listing.max_guests} guests</span>
                <span className={styles.specDot}>·</span>
                <span>{listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''}</span>
                <span className={styles.specDot}>·</span>
                <span>{listing.bathrooms} bathroom{listing.bathrooms !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className={styles.hostAvatarWrap}>
              <Image
                src={listing.host?.avatar_url || 'https://i.pravatar.cc/150?u=host'}
                alt="Host"
                width={56}
                height={56}
                className={styles.hostAvatar}
              />
              {listing.rating >= 4.9 && <div className={styles.superhostBadge} title="Superhost">⭐</div>}
            </div>
          </div>

          <div className={styles.divider} />

          {/* Highlights */}
          <div className={styles.highlights}>
            <div className={styles.highlight}>
              <span className={styles.highlightIcon}>🏆</span>
              <div>
                <div className={styles.highlightTitle}>Guest favourite</div>
                <div className={styles.highlightDesc}>One of the most loved homes on Airbnb based on ratings and reviews</div>
              </div>
            </div>
            <div className={styles.highlight}>
              <span className={styles.highlightIcon}>🔑</span>
              <div>
                <div className={styles.highlightTitle}>Self check-in</div>
                <div className={styles.highlightDesc}>Check yourself in with the keypad</div>
              </div>
            </div>
            <div className={styles.highlight}>
              <span className={styles.highlightIcon}>📍</span>
              <div>
                <div className={styles.highlightTitle}>Great location</div>
                <div className={styles.highlightDesc}>95% of recent guests gave the location a 5-star rating</div>
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Description */}
          <div className={styles.description}>
            <p>{listing.description}</p>
          </div>

          <div className={styles.divider} />

          {/* Amenities */}
          <div className={styles.amenitiesSection}>
            <h2>What this place offers</h2>
            <div className={styles.amenitiesGrid}>
              {amenities.map((item: string, idx: number) => (
                <div key={idx} className={styles.amenityItem}>
                  <span className={styles.amenityIcon}>{AMENITY_ICONS[item] || '✓'}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.divider} />

          {/* Reviews */}
          <div className={styles.reviewsSection}>
            <div className={styles.reviewsHeader}>
              <h2>★ {(listing.rating || 4.95).toFixed(2)} · {listing.num_reviews || 0} reviews</h2>
            </div>
            <div className={styles.reviewsGrid}>
              {MOCK_REVIEWS.map(review => (
                <div key={review.id} className={styles.review}>
                  <div className={styles.reviewerInfo}>
                    <Image src={review.avatar} alt={review.name} width={40} height={40} className={styles.reviewerAvatar} />
                    <div>
                      <div className={styles.reviewerName}>{review.name}</div>
                      <div className={styles.reviewDate}>{review.date}</div>
                    </div>
                  </div>
                  <div className={styles.reviewStars}>
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                  <p className={styles.reviewText}>{review.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.divider} />

          {/* Map */}
          {listing.latitude && listing.longitude && (
            <div className={styles.mapSection}>
              <h2>Where you&apos;ll be</h2>
              <p className={styles.mapLocation}>{listing.location}</p>
              <ListingMap
                latitude={listing.latitude}
                longitude={listing.longitude}
                title={listing.title}
                price={listing.price_per_night}
              />
              <p className={styles.mapDesc}>Exact location provided after booking.</p>
            </div>
          )}

        </div>

        {/* Booking Widget Sidebar */}
        <div className={styles.sidebar} id="booking-widget">
          <BookingWidget listing={listing} />
        </div>
      </div>

      {/* Mobile Sticky Booking Footer */}
      <div className={styles.mobileStickyFooter}>
        <div className={styles.mobileFooterContent}>
          <div className={styles.mobilePrice}>
            <span className={styles.priceAmount}>₹{listing.price_per_night.toLocaleString('en-IN')}</span>
            <span className={styles.priceNight}> / night</span>
          </div>
          <a href="#booking-widget" className={styles.mobileReserveBtn}>
            Reserve
          </a>
        </div>
      </div>
    </div>
  );
}
