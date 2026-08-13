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
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  
  const isMapView = !!locationQuery;

  // Apply filters and category client-side
  const filteredListings = listings
    .filter(l => !activeCategory || l.category === activeCategory || l.property_type === activeCategory)
    .filter(l => l.price_per_night >= filters.minPrice && l.price_per_night <= filters.maxPrice)
    .filter(l => filters.propertyType === 'Any' || l.property_type === filters.propertyType);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, filters, locationQuery]);

  const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE);
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className={styles.pagination}>
        <button
          className={styles.pageButton}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <div className={styles.pageNumbers}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`${styles.pageNumber} ${currentPage === page ? styles.pageNumberActive : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          className={styles.pageButton}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className={styles.home}>
      <div className={`container-wide`}>
        <CategoryBar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onFilterClick={() => setFilterModalOpen(true)}
        />
      </div>

      <div className={isMapView ? styles.splitMainContent : `container-wide ${styles.mainContent}`}>
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
                {paginatedListings.map((listing) => (
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
              {renderPagination()}
            </div>
            <div className={styles.mapPane}>
              <SearchMap listings={filteredListings} hoveredListingId={hoveredListingId} />
            </div>
          </div>
        ) : (
          <div className={styles.sectionsWrapper}>
            {filteredListings.length > 0 && (
              <div className={styles.sectionContainer}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    {locationQuery ? `${locationQuery} homes with free cancellation` : 'Homes with free cancellation'}
                    <svg viewBox="0 0 18 18" style={{ height: '14px', width: '14px', fill: 'currentcolor' }}><path d="m4.29 1.71a1 1 0 1 1 1.42-1.41l8 8a1 1 0 0 1 0 1.41l-8 8a1 1 0 1 1 -1.42-1.41l7.29-7.29z" fillRule="evenodd"></path></svg>
                  </h2>
                </div>
                <div className={styles.carousel}>
                  {filteredListings.slice(0, 10).map((listing) => (
                    <div key={listing.id} className={styles.carouselItem}>
                      <ListingCard
                        id={listing.id}
                        title={listing.title}
                        location={listing.location}
                        price_per_night={listing.price_per_night}
                        photos={listing.photos}
                        rating={listing.rating}
                        num_reviews={listing.num_reviews}
                        property_type={listing.property_type}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {filteredListings.length > 10 && (
              <div className={styles.sectionContainer}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    Available for similar dates
                    <svg viewBox="0 0 18 18" style={{ height: '14px', width: '14px', fill: 'currentcolor' }}><path d="m4.29 1.71a1 1 0 1 1 1.42-1.41l8 8a1 1 0 0 1 0 1.41l-8 8a1 1 0 1 1 -1.42-1.41l7.29-7.29z" fillRule="evenodd"></path></svg>
                  </h2>
                </div>
                <div className={styles.carousel}>
                  {filteredListings.slice(10, 25).map((listing) => (
                    <div key={listing.id} className={styles.carouselItem}>
                      <ListingCard
                        id={listing.id}
                        title={listing.title}
                        location={listing.location}
                        price_per_night={listing.price_per_night}
                        photos={listing.photos}
                        rating={listing.rating}
                        num_reviews={listing.num_reviews}
                        property_type={listing.property_type}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredListings.length > 25 && (
              <div className={styles.sectionContainer}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    More homes for you
                  </h2>
                </div>
                <div className={styles.carousel}>
                  {filteredListings.slice(25, 45).map((listing) => (
                    <div key={listing.id} className={styles.carouselItem}>
                      <ListingCard
                        id={listing.id}
                        title={listing.title}
                        location={listing.location}
                        price_per_night={listing.price_per_night}
                        photos={listing.photos}
                        rating={listing.rating}
                        num_reviews={listing.num_reviews}
                        property_type={listing.property_type}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
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
