'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './GalleryModal.module.css';

interface GalleryModalProps {
  photos: string[];
  title: string;
  onClose: () => void;
}

export default function GalleryModal({ photos, title, onClose }: GalleryModalProps) {
  const [current, setCurrent] = useState(0);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentcolor', strokeWidth: '3', overflow: 'visible' }}>
              <path d="M6 6 L26 26 M26 6 L6 26" />
            </svg>
          </button>
          <span className={styles.counter}>{current + 1} / {photos.length}</span>
        </div>

        <div className={styles.mainPhoto}>
          <Image src={photos[current]} alt={`${title} - photo ${current + 1}`} fill style={{ objectFit: 'contain' }} />
          {current > 0 && (
            <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={() => setCurrent(c => c - 1)}>‹</button>
          )}
          {current < photos.length - 1 && (
            <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={() => setCurrent(c => c + 1)}>›</button>
          )}
        </div>

        <div className={styles.thumbs}>
          {photos.map((p, i) => (
            <div key={i} className={`${styles.thumb} ${current === i ? styles.thumbActive : ''}`} onClick={() => setCurrent(i)}>
              <Image src={p} alt={`Thumb ${i + 1}`} fill style={{ objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
