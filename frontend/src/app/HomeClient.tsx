'use client';

import { useState, useEffect } from 'react';
import ListingCard from '@/components/ListingCard';
import CategoryBar from '@/components/CategoryBar';
import FilterModal, { FilterState } from '@/components/FilterModal';
import dynamic from 'next/dynamic';
import styles from './page.module.css';

// Dynamically import SearchMap to avoid SSR issues with Leaflet
const SearchMap = dynamic(() => import('@/components/SearchMap'), { ssr: false });

interface Listing {
  id: number; title: string; location: string; price_per_night: number;
  photos: string; rating?: number; num_reviews?: number; property_type?: string; category?: string;
  latitude?: number; longitude?: number;
}

interface HomeClientProps {
  initialListings: Listing[];
  locationQuery: string;
}

export default function HomeClient({ initialListings, locationQuery }: HomeClientProps) {
  const listings = initialListings;
  const [activeCategory, setActiveCategory] = useState('');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ minPrice: 0, maxPrice: 50000, propertyType: 'Any', amenities: [], bedrooms: 0 });
  const [hoveredListingId, setHoveredListingId] = useState<number | null>(null);
  
  const isMapView = !!locationQuery;

  // Apply filters and category client-side
  const filteredListings = listings
    .filter(l => !activeCategory || l.category === activeCategory || l.property_type === activeCategory)
    .filter(l => l.price_per_night >= filters.minPrice && l.price_per_night <= filters.maxPrice)
    .filter(l => filters.propertyType === 'Any' || l.property_type === filters.propertyType);

  return (
    <div className={styles.home}>
      <div className={`container`}>
        <CategoryBar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onFilterClick={() => setFilterModalOpen(true)}
        />
      </div>

      <div className={isMapView ? styles.splitMainContent : `container ${styles.mainContent}`}>
        {filteredListings.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>No listings found</h2>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : isMapView ? (
          <div className={styles.splitContainer}>
            <div className={styles.listPane}>
              <div className={styles.resultsHeader}>
                <p>Over {filteredListings.length} homes in {locationQuery}</p>
                <div className={styles.feesToggle}>
                  <span>Prices include all fees</span>
                </div>
              </div>
              <div className={styles.horizontalList}>
                {filteredListings.map((listing) => (
                  <div 
                    key={listing.id} 
                    onMouseEnter={() => setHoveredListingId(listing.id)}
                    onMouseLeave={() => setHoveredListingId(null)}
                  >
                    <ListingCard
                      id={listing.id}
                      title={listing.title}
                      location={listing.location}
                      price_per_night={listing.price_per_night}
                      photos={listing.photos}
                      rating={listing.rating}
                      num_reviews={listing.num_reviews}
                      property_type={listing.property_type}
                      layout="horizontal"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.mapPane}>
              <SearchMap listings={filteredListings} hoveredListingId={hoveredListingId} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 grid-cols-sm-2 grid-cols-md-3 grid-cols-lg-4 grid-cols-xl-5 grid-cols-2xl-6">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                location={listing.location}
                price_per_night={listing.price_per_night}
                photos={listing.photos}
                rating={listing.rating}
                num_reviews={listing.num_reviews}
                property_type={listing.property_type}
              />
            ))}
          </div>
        )}
      </div>

      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={setFilters}
        initial={filters}
      />
    </div>
  );
}
