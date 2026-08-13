'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getListings, deleteListing, getBookingsForUser } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import styles from './HostListings.module.css';

export default function HostDashboard() {
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    if (!user.is_host) { setLoading(false); return; }
    getListings({ host_id: user.id })
      .then(setListings)
      .catch(() => toast.error('Failed to load listings'))
      .finally(() => setLoading(false));
  }, [user.id, user.is_host]);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteListing(id);
      setListings(prev => prev.filter(l => l.id !== id));
      toast.success('Listing deleted');
    } catch {
      toast.error('Failed to delete listing');
    } finally {
      setDeleting(null);
    }
  };

  if (!user.is_host) {
    return (
      <div className="container">
        <div className={styles.page}>
          <div className={styles.notHost}>
            <div className={styles.notHostIcon}>🏠</div>
            <h1>Become a host</h1>
            <p>Share your space with the world and start earning. Switch to a host account to get started.</p>
            <p style={{ marginTop: 8, fontSize: 14, color: '#717171' }}>Use the account switcher in the top-right menu to switch to a host account.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Host Dashboard</h1>
            <p className={styles.subtitle}>Welcome back, {user.name}! You have {listings.length} listing{listings.length !== 1 ? 's' : ''}.</p>
          </div>
          <Link href="/host/create" className={styles.createBtn}>
            + Create new listing
          </Link>
        </div>

        {loading ? (
          <div className={styles.skeletonGrid}>
            {[1, 2, 3].map(i => <div key={i} className={styles.skeleton}></div>)}
          </div>
        ) : listings.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🏡</div>
            <h2>No listings yet</h2>
            <p>Create your first listing to start hosting guests.</p>
            <Link href="/host/create" className={styles.createBtn}>Create a listing</Link>
          </div>
        ) : (
          <div className={styles.listingsGrid}>
            {listings.map(listing => {
              let photos: string[] = [];
              try { photos = typeof listing.photos === 'string' ? JSON.parse(listing.photos) : listing.photos; } catch {}
              return (
                <div key={listing.id} className={styles.listingCard}>
                  <Link href={`/listings/${listing.id}`} className={styles.cardPhotoWrap}>
                    {photos[0] ? (
                      <Image src={photos[0]} alt={listing.title} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <div className={styles.noPhoto}>🏠</div>
                    )}
                    <div className={styles.photoBadge}>{listing.property_type}</div>
                  </Link>

                  <div className={styles.cardBody}>
                    <div className={styles.cardTop}>
                      <div>
                        <h3 className={styles.cardTitle}>{listing.title}</h3>
                        <p className={styles.cardLocation}>{listing.location}</p>
                      </div>
                      <div className={styles.cardRating}>★ {listing.rating?.toFixed(2)}</div>
                    </div>

                    <div className={styles.cardStats}>
                      <div className={styles.stat}>
                        <div className={styles.statValue}>₹{listing.price_per_night?.toLocaleString('en-IN')}</div>
                        <div className={styles.statLabel}>/ night</div>
                      </div>
                      <div className={styles.stat}>
                        <div className={styles.statValue}>{listing.max_guests}</div>
                        <div className={styles.statLabel}>guests</div>
                      </div>
                      <div className={styles.stat}>
                        <div className={styles.statValue}>{listing.bedrooms}</div>
                        <div className={styles.statLabel}>bedrooms</div>
                      </div>
                      <div className={styles.stat}>
                        <div className={styles.statValue}>{listing.num_reviews}</div>
                        <div className={styles.statLabel}>reviews</div>
                      </div>
                    </div>

                    <div className={styles.cardActions}>
                      <Link href={`/listings/${listing.id}`} className={styles.viewBtn}>View listing</Link>
                      <Link href={`/host/listings/${listing.id}/edit`} className={styles.editBtn}>Edit</Link>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(listing.id, listing.title)}
                        disabled={deleting === listing.id}
                      >
                        {deleting === listing.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
