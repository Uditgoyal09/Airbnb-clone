'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './ListingCard.module.css';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import toast from 'react-hot-toast';

interface ListingCardProps {
  id: number;
  title: string;
  location: string;
  price_per_night: number;
  photos: string;
  rating?: number;
  num_reviews?: number;
  property_type?: string;
  layout?: 'vertical' | 'horizontal';
}

export default function ListingCard({ id, title, location, price_per_night, photos, rating, num_reviews, property_type, layout = 'vertical' }: ListingCardProps) {
  const { wishlist, toggleWishlist } = useAuth();
  const { currency } = useSettings();
  const isWishlisted = wishlist.has(id);

  let photoList: string[] = [];
  try {
    photoList = typeof photos === 'string' ? JSON.parse(photos) : photos;
  } catch { photoList = []; }

  const mainPhoto = photoList[0] || '';

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  const convertedPrice = Math.round(price_per_night * currency.rate);

  return (
    <Link href={`/listings/${id}`} className={`${styles.card} ${layout === 'horizontal' ? styles.cardHorizontal : ''}`}>
      <div className={styles.imageContainer}>
        {mainPhoto && (
          <Image
            src={mainPhoto}
            alt={title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 550px) 100vw, (max-width: 744px) 50vw, (max-width: 950px) 33vw, 25vw"
          />
        )}
        <button className={`${styles.heartBtn} ${isWishlisted ? styles.hearted : ''}`} onClick={handleWishlist} aria-label="Add to wishlist">
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: 'block', fill: isWishlisted ? 'var(--primary)' : 'rgba(0,0,0,0.5)', height: '16px', width: '16px', stroke: 'white', strokeWidth: '2', overflow: 'visible' }}>
            <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 8.1l-2.05-2.05a6.98 6.98 0 0 0-9.9 9.9C5.5 18 16 28 16 28z"></path>
          </svg>
        </button>
        {(rating && rating >= 4.9) && (
          <div className={styles.guestFavBadge}>Guest favourite</div>
        )}
      </div>
      <div className={styles.cardInfo}>
        {layout === 'horizontal' ? (
          <>
            <div className={styles.cardTop}>
              <div className={styles.cardLocation}>{location}</div>
              {rating && (
                <div className={styles.cardRating}>
                  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: 'block', fill: 'currentcolor', height: '12px', width: '12px' }}>
                    <path d="M15.094 1.579l-4.124 8.885-9.86 1.27a1 1 0 0 0-.542 1.736l7.293 6.565-1.965 9.852a1 1 0 0 0 1.483 1.061L16 25.951l8.625 4.997a1 1 0 0 0 1.483-1.06l-1.965-9.853 7.293-6.565a1 1 0 0 0-.541-1.735l-9.86-1.271-4.127-8.885a1 1 0 0 0-1.814 0z"></path>
                  </svg>
                  <span>{rating.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className={styles.cardTitle}>{title}</div>
            <div className={styles.cardHorizontalDetails}>
              2 guests · 1 bedroom · 1 bed · 1 bath<br/>
              Wifi · Air conditioning · Kitchen
            </div>
            <div className={styles.cardPrice}>
              <span className={styles.priceAmount}>{currency.symbol}{convertedPrice.toLocaleString('en-IN')}</span>
              <span className={styles.priceNight}> / night</span>
            </div>
          </>
        ) : (
          <>
            <div className={styles.cardTitle}>{title}</div>
            <div className={styles.cardSubtitle}>
              {currency.symbol}{(convertedPrice * 2).toLocaleString('en-IN')} for 2 nights {rating ? ` - ★ ${rating.toFixed(1)}` : ''}
            </div>
          </>
        )}
      </div>
    </Link>
  );
}
