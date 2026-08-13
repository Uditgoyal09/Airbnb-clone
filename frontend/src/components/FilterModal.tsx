'use client';

import { useState } from 'react';
import styles from './FilterModal.module.css';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initial?: FilterState;
}

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  propertyType: string;
  amenities: string[];
  bedrooms: number;
}

const PROPERTY_TYPES = ['Any', 'Apartment', 'Villa', 'Cabin', 'Houseboat', 'Treehouse', 'Bungalow', 'Resort', 'Heritage Home', 'Flat'];
const AMENITIES_LIST = ['Wifi', 'Kitchen', 'Free parking', 'Air conditioning', 'Pool', 'Gym', 'Beach access', '55" HDTV', 'Washer', 'Dryer', 'Indoor fireplace', 'Hot tub', 'BBQ grill', 'Balcony', 'Garden'];

export default function FilterModal({ isOpen, onClose, onApply, initial }: FilterModalProps) {
  const [minPrice, setMinPrice] = useState(initial?.minPrice ?? 0);
  const [maxPrice, setMaxPrice] = useState(initial?.maxPrice ?? 50000);
  const [propertyType, setPropertyType] = useState(initial?.propertyType ?? 'Any');
  const [amenities, setAmenities] = useState<string[]>(initial?.amenities ?? []);
  const [bedrooms, setBedrooms] = useState(initial?.bedrooms ?? 0);

  if (!isOpen) return null;

  const toggleAmenity = (a: string) => {
    setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  const handleReset = () => {
    setMinPrice(0); setMaxPrice(50000); setPropertyType('Any'); setAmenities([]); setBedrooms(0);
  };

  const handleApply = () => {
    onApply({ minPrice, maxPrice, propertyType, amenities, bedrooms });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
          <h2 className={styles.title}>Filters</h2>
          <div></div>
        </div>

        <div className={styles.body}>
          {/* Price Range */}
          <section className={styles.section}>
            <h3>Price range</h3>
            <p className={styles.subtext}>Nightly prices including fees and taxes</p>
            <div className={styles.priceInputs}>
              <div className={styles.priceInput}>
                <label>Min price</label>
                <input type="number" value={minPrice} onChange={e => setMinPrice(Number(e.target.value))} min="0" max={maxPrice} step="500" />
              </div>
              <div className={styles.priceDash}>—</div>
              <div className={styles.priceInput}>
                <label>Max price</label>
                <input type="number" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} min={minPrice} max="100000" step="500" />
              </div>
            </div>
          </section>

          <div className={styles.divider}></div>

          {/* Bedrooms */}
          <section className={styles.section}>
            <h3>Bedrooms</h3>
            <div className={styles.bedroomBtns}>
              {[0, 1, 2, 3, 4, 5].map(n => (
                <button key={n} className={`${styles.bedroomBtn} ${bedrooms === n ? styles.bedroomBtnActive : ''}`} onClick={() => setBedrooms(n)}>
                  {n === 0 ? 'Any' : `${n}+`}
                </button>
              ))}
            </div>
          </section>

          <div className={styles.divider}></div>

          {/* Property Type */}
          <section className={styles.section}>
            <h3>Type of place</h3>
            <div className={styles.typeGrid}>
              {PROPERTY_TYPES.map(type => (
                <button key={type} className={`${styles.typeBtn} ${propertyType === type ? styles.typeBtnActive : ''}`} onClick={() => setPropertyType(type)}>
                  {type}
                </button>
              ))}
            </div>
          </section>

          <div className={styles.divider}></div>

          {/* Amenities */}
          <section className={styles.section}>
            <h3>Amenities</h3>
            <div className={styles.amenitiesGrid}>
              {AMENITIES_LIST.map(a => (
                <label key={a} className={styles.amenityItem}>
                  <input type="checkbox" checked={amenities.includes(a)} onChange={() => toggleAmenity(a)} />
                  <span>{a}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className={styles.footer}>
          <button className={styles.resetBtn} onClick={handleReset}>Clear all</button>
          <button className={styles.applyBtn} onClick={handleApply}>Show results</button>
        </div>
      </div>
    </div>
  );
}
