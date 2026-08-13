'use client';

import styles from './CategoryBar.module.css';

const CATEGORIES = [
  { id: 'trending', label: 'Trending', icon: '📈' },
  { id: 'beach', label: 'Beachfront', icon: '🏖️' },
  { id: 'cabin', label: 'Cabins', icon: '🏕️' },
  { id: 'pool', label: 'Amazing pools', icon: '🏊' },
  { id: 'Apartment', label: 'Apartments', icon: '🏢' },
  { id: 'Villa', label: 'Villas', icon: '🏡' },
  { id: 'Heritage Home', label: 'Heritage', icon: '🏰' },
  { id: 'Houseboat', label: 'Houseboats', icon: '⛵' },
  { id: 'Treehouse', label: 'Treehouses', icon: '🌳' },
];

interface CategoryBarProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  onFilterClick: () => void;
}

export default function CategoryBar({ activeCategory, onCategoryChange, onFilterClick }: CategoryBarProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.categories}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`${styles.catBtn} ${activeCategory === cat.id ? styles.catBtnActive : ''}`}
            onClick={() => onCategoryChange(activeCategory === cat.id ? '' : cat.id)}
          >
            <span className={styles.catIcon}>{cat.icon}</span>
            <span className={styles.catLabel}>{cat.label}</span>
          </button>
        ))}
      </div>
      <div className={styles.filterBtnWrapper}>
        <button className={styles.filterBtn} onClick={onFilterClick}>
          <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentcolor', strokeWidth: '2', overflow: 'visible' }}>
            <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-1 1h2a4 4 0 0 1 4 4v1H1v-1a4 4 0 0 1 4-4zm7-3a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm-1 1h2a4 4 0 0 1 4 4v1h-6v-1a5 5 0 0 0-.73-2.62A4 4 0 1 1 12 7z"></path>
          </svg>
          <span className={styles.filterText}>Filters</span>
        </button>
      </div>
    </div>
  );
}
