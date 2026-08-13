'use client';

import { useState } from 'react';
import Image from 'next/image';
import GalleryModal from '@/components/GalleryModal';
import styles from './GallerySection.module.css';

interface GallerySectionProps {
  photos: string[];
  title: string;
}

export default function GallerySection({ photos, title }: GallerySectionProps) {
  const [modalOpen, setModalOpen] = useState(false);

  if (!photos.length) return <div className={styles.noPhotos}>No photos available</div>;

  return (
    <>
      <div className={styles.gallery} onClick={() => setModalOpen(true)}>
        <div className={styles.mainPhoto}>
          <Image src={photos[0]} alt={title} fill style={{ objectFit: 'cover' }} />
        </div>
        <div className={styles.sideGrid}>
          {[1, 2, 3, 4].map(i => (
            photos[i] ? (
              <div key={i} className={styles.sidePhoto}>
                <Image src={photos[i]} alt={`${title} ${i}`} fill style={{ objectFit: 'cover' }} />
                {i === 4 && photos.length > 5 && (
                  <div className={styles.moreOverlay}>+{photos.length - 5} more</div>
                )}
              </div>
            ) : null
          ))}
        </div>
        <button className={styles.showAllBtn} onClick={e => { e.stopPropagation(); setModalOpen(true); }}>
          <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{ height: '16px', width: '16px', fill: 'none', stroke: 'currentcolor', strokeWidth: '1.5' }}>
            <rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/>
            <rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/>
          </svg>
          Show all photos
        </button>
      </div>

      {modalOpen && (
        <GalleryModal photos={photos} title={title} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
