'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createListing } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import styles from './page.module.css';

const STEPS = ['Type', 'Location', 'Details', 'Amenities', 'Photos', 'Price'];
const PROPERTY_TYPES = ['Apartment', 'Villa', 'Cabin', 'Houseboat', 'Treehouse', 'Bungalow', 'Resort', 'Heritage Home', 'Flat', 'Studio'];
const AMENITIES_OPTIONS = ['Wifi', 'Kitchen', 'Free parking', 'Air conditioning', 'Pool', 'Gym', 'Beach access', '55" HDTV', 'Washer', 'Dryer', 'Indoor fireplace', 'Hot tub', 'BBQ grill', 'Balcony', 'Garden', 'Dedicated workspace'];
const CATEGORIES = ['trending', 'beach', 'cabin', 'pool'];
const PHOTO_SEEDS = ['forest1', 'mountain2', 'beach3', 'urban4', 'villa5', 'nature6', 'cottage7', 'lake8'];

export default function CreateListingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '', description: '', location: '',
    price_per_night: 5000, property_type: '', max_guests: 2,
    bedrooms: 1, bathrooms: 1.0, amenities: [] as string[],
    photos: [] as string[], latitude: '', longitude: '',
    category: 'trending',
  });

  const set = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));

  const toggleAmenity = (a: string) => {
    set('amenities', form.amenities.includes(a) ? form.amenities.filter(x => x !== a) : [...form.amenities, a]);
  };

  const addPhotoUrl = (url: string) => {
    if (url && !form.photos.includes(url)) set('photos', [...form.photos, url]);
  };

  const removePhoto = (url: string) => set('photos', form.photos.filter(p => p !== url));

  const handleSubmit = async () => {
    if (!form.title || !form.location || !form.property_type) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const photos = form.photos.length > 0 ? form.photos :
        PHOTO_SEEDS.slice(0, 5).map(s => `https://picsum.photos/seed/${s}/900/600`);

      await createListing({
        title: form.title,
        description: form.description || 'A wonderful place to stay.',
        location: form.location,
        price_per_night: form.price_per_night,
        property_type: form.property_type,
        max_guests: form.max_guests,
        bedrooms: form.bedrooms,
        bathrooms: form.bathrooms,
        amenities: JSON.stringify(form.amenities),
        photos: JSON.stringify(photos),
        host_id: user.id,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        category: form.category,
        rating: 4.95,
        num_reviews: 0,
      });
      toast.success('Listing created successfully!');
      router.push('/host');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  if (!user.is_host) {
    return (
      <div className="container">
        <div className={styles.page}>
          <div className={styles.notHost}>
            <h1>You need to be a host</h1>
            <p>Switch to a host account to create listings.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create a new listing</h1>
          <div className={styles.steps}>
            {STEPS.map((s, i) => (
              <div key={s} className={`${styles.step} ${i === step ? styles.stepActive : ''} ${i < step ? styles.stepDone : ''}`} onClick={() => i < step && setStep(i)}>
                <div className={styles.stepNum}>{i < step ? '✓' : i + 1}</div>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.formCard}>
          {/* Step 0: Type */}
          {step === 0 && (
            <div className={styles.stepContent}>
              <h2>What kind of place are you listing?</h2>
              <div className={styles.typeGrid}>
                {PROPERTY_TYPES.map(type => (
                  <button key={type} className={`${styles.typeBtn} ${form.property_type === type ? styles.typeBtnActive : ''}`} onClick={() => set('property_type', type)}>
                    {type}
                  </button>
                ))}
              </div>
              <div className={styles.inputGroup}>
                <label>Category</label>
                <select value={form.category} onChange={e => set('category', e.target.value)} className={styles.input}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Step 1: Location */}
          {step === 1 && (
            <div className={styles.stepContent}>
              <h2>Where is your place located?</h2>
              <div className={styles.inputGroup}>
                <label>Full address / location *</label>
                <input className={styles.input} value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Baga, North Goa, India" />
              </div>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>Latitude (optional)</label>
                  <input className={styles.input} type="number" step="0.0001" value={form.latitude} onChange={e => set('latitude', e.target.value)} placeholder="e.g. 15.5736" />
                </div>
                <div className={styles.inputGroup}>
                  <label>Longitude (optional)</label>
                  <input className={styles.input} type="number" step="0.0001" value={form.longitude} onChange={e => set('longitude', e.target.value)} placeholder="e.g. 73.7553" />
                </div>
              </div>
              <p className={styles.hint}>💡 Find coordinates at <a href="https://maps.google.com" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>maps.google.com</a> → right-click on your location → copy lat/lng</p>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className={styles.stepContent}>
              <h2>Share some basics about your place</h2>
              <div className={styles.inputGroup}>
                <label>Title *</label>
                <input className={styles.input} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Cozy beachfront apartment in Goa" maxLength={80} />
                <span className={styles.charCount}>{form.title.length}/80</span>
              </div>
              <div className={styles.inputGroup}>
                <label>Description</label>
                <textarea className={`${styles.input} ${styles.textarea}`} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe what makes your place special..." rows={5} />
              </div>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>Max guests</label>
                  <input className={styles.input} type="number" min="1" max="20" value={form.max_guests} onChange={e => set('max_guests', Number(e.target.value))} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Bedrooms</label>
                  <input className={styles.input} type="number" min="0" max="20" value={form.bedrooms} onChange={e => set('bedrooms', Number(e.target.value))} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Bathrooms</label>
                  <input className={styles.input} type="number" min="0.5" max="20" step="0.5" value={form.bathrooms} onChange={e => set('bathrooms', Number(e.target.value))} />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Amenities */}
          {step === 3 && (
            <div className={styles.stepContent}>
              <h2>What amenities do you offer?</h2>
              <div className={styles.amenitiesGrid}>
                {AMENITIES_OPTIONS.map(a => (
                  <label key={a} className={`${styles.amenityItem} ${form.amenities.includes(a) ? styles.amenityActive : ''}`}>
                    <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} />
                    <span>{a}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Photos */}
          {step === 4 && (
            <div className={styles.stepContent}>
              <h2>Add some photos of your place</h2>
              <p className={styles.hint}>Paste image URLs (from picsum.photos, unsplash, etc.)</p>
              <div className={styles.photoInput}>
                <input id="photoUrl" className={styles.input} type="url" placeholder="https://picsum.photos/seed/my-place/900/600" />
                <button className={styles.addPhotoBtn} onClick={() => {
                  const input = document.getElementById('photoUrl') as HTMLInputElement;
                  if (input.value) { addPhotoUrl(input.value); input.value = ''; }
                }}>Add</button>
              </div>
              <div className={styles.quickPhotos}>
                <p className={styles.hint}>Or pick placeholder photos:</p>
                <div className={styles.quickPhotoList}>
                  {PHOTO_SEEDS.map(s => {
                    const url = `https://picsum.photos/seed/${s}/900/600`;
                    return (
                      <button key={s} className={`${styles.quickPhotoBtn} ${form.photos.includes(url) ? styles.quickPhotoBtnActive : ''}`} onClick={() => form.photos.includes(url) ? removePhoto(url) : addPhotoUrl(url)}>
                        {form.photos.includes(url) ? '✓' : '+'} {s}
                      </button>
                    );
                  })}
                </div>
              </div>
              {form.photos.length > 0 && (
                <div className={styles.photoPreview}>
                  {form.photos.map((p, i) => (
                    <div key={i} className={styles.previewItem}>
                      <img src={p} alt={`Photo ${i + 1}`} className={styles.previewImg} />
                      <button className={styles.removePhotoBtn} onClick={() => removePhoto(p)}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Price */}
          {step === 5 && (
            <div className={styles.stepContent}>
              <h2>Now, set your price</h2>
              <p className={styles.hint}>You can change this at any time. The competitive rate for your area is around ₹8,000–₹20,000/night.</p>
              <div className={styles.priceInput}>
                <span className={styles.currencySymbol}>₹</span>
                <input
                  type="number"
                  value={form.price_per_night}
                  onChange={e => set('price_per_night', Number(e.target.value))}
                  className={styles.priceField}
                  min="500"
                  step="100"
                />
              </div>
              <p className={styles.priceNote}>Guests will see ₹{form.price_per_night?.toLocaleString('en-IN')}/night</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className={styles.navBtns}>
          {step > 0 && (
            <button className={styles.backBtn} onClick={() => setStep(s => s - 1)}>← Back</button>
          )}
          {step < STEPS.length - 1 ? (
            <button className={styles.nextBtn} onClick={() => setStep(s => s + 1)}>Next →</button>
          ) : (
            <button className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
              {loading ? 'Creating...' : 'Create listing 🎉'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
