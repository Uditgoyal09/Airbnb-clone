'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getListingById, updateListing } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import styles from '../../../create/page.module.css';

export default function EditListingPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const [form, setForm] = useState({
    title: '', description: '', location: '',
    price_per_night: 5000, property_type: '', max_guests: 2,
    bedrooms: 1, bathrooms: 1.0, amenities: [] as string[],
    photos: [] as string[], latitude: '', longitude: '',
    category: 'trending', host_id: user.id,
  });

  useEffect(() => {
    getListingById(params.id).then((listing: any) => {
      let amenities: string[] = [];
      try { amenities = JSON.parse(listing.amenities); } catch {}
      let photos: string[] = [];
      try { photos = JSON.parse(listing.photos); } catch {}

      setForm({
        title: listing.title || '',
        description: listing.description || '',
        location: listing.location || '',
        price_per_night: listing.price_per_night || 5000,
        property_type: listing.property_type || '',
        max_guests: listing.max_guests || 2,
        bedrooms: listing.bedrooms || 1,
        bathrooms: listing.bathrooms || 1,
        amenities,
        photos,
        latitude: String(listing.latitude || ''),
        longitude: String(listing.longitude || ''),
        category: listing.category || 'trending',
        host_id: listing.host_id || user.id,
      });
    }).catch(() => toast.error('Failed to load listing')).finally(() => setInitialLoad(false));
  }, [params.id]);

  const set = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));

  const toggleAmenity = (a: string) => {
    set('amenities', form.amenities.includes(a) ? form.amenities.filter((x: string) => x !== a) : [...form.amenities, a]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateListing(Number(params.id), {
        ...form,
        amenities: JSON.stringify(form.amenities),
        photos: JSON.stringify(form.photos),
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
      });
      toast.success('Listing updated!');
      router.push('/host');
    } catch {
      toast.error('Failed to update listing');
    } finally {
      setLoading(false);
    }
  };

  const AMENITIES_OPTIONS = ['Wifi', 'Kitchen', 'Free parking', 'Air conditioning', 'Pool', 'Gym', 'Beach access', '55" HDTV', 'Washer', 'Dryer', 'Indoor fireplace', 'Hot tub', 'BBQ grill', 'Balcony', 'Garden', 'Dedicated workspace'];

  if (initialLoad) return <div className="container"><div className={styles.page}><p>Loading...</p></div></div>;

  return (
    <div className="container">
      <div className={styles.page}>
        <h1 className={styles.title}>Edit listing</h1>

        <div className={styles.formCard}>
          <div className={styles.stepContent}>
            <div className={styles.inputGroup}>
              <label>Title *</label>
              <input className={styles.input} value={form.title} onChange={e => set('title', e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label>Description</label>
              <textarea className={`${styles.input} ${styles.textarea}`} value={form.description} onChange={e => set('description', e.target.value)} rows={5} />
            </div>
            <div className={styles.inputGroup}>
              <label>Location *</label>
              <input className={styles.input} value={form.location} onChange={e => set('location', e.target.value)} />
            </div>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Latitude</label>
                <input className={styles.input} type="number" step="0.0001" value={form.latitude} onChange={e => set('latitude', e.target.value)} />
              </div>
              <div className={styles.inputGroup}>
                <label>Longitude</label>
                <input className={styles.input} type="number" step="0.0001" value={form.longitude} onChange={e => set('longitude', e.target.value)} />
              </div>
              <div className={styles.inputGroup}>
                <label>Price/night (₹)</label>
                <input className={styles.input} type="number" min="500" step="100" value={form.price_per_night} onChange={e => set('price_per_night', Number(e.target.value))} />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Max guests</label>
                <input className={styles.input} type="number" min="1" value={form.max_guests} onChange={e => set('max_guests', Number(e.target.value))} />
              </div>
              <div className={styles.inputGroup}>
                <label>Bedrooms</label>
                <input className={styles.input} type="number" min="0" value={form.bedrooms} onChange={e => set('bedrooms', Number(e.target.value))} />
              </div>
              <div className={styles.inputGroup}>
                <label>Bathrooms</label>
                <input className={styles.input} type="number" min="0.5" step="0.5" value={form.bathrooms} onChange={e => set('bathrooms', Number(e.target.value))} />
              </div>
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: 14, display: 'block', marginBottom: 12 }}>Amenities</label>
              <div className={styles.amenitiesGrid}>
                {AMENITIES_OPTIONS.map(a => (
                  <label key={a} className={`${styles.amenityItem} ${form.amenities.includes(a) ? styles.amenityActive : ''}`}>
                    <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} />
                    <span>{a}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.navBtns}>
          <button className={styles.backBtn} onClick={() => router.push('/host')}>← Cancel</button>
          <button className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
