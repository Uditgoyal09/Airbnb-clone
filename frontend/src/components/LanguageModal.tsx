'use client';

import { useState } from 'react';
import styles from './LanguageModal.module.css';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguageModal({ isOpen, onClose }: LanguageModalProps) {
  const [activeLang, setActiveLang] = useState('English (UK)');

  if (!isOpen) return null;

  const languages = [
    { name: 'English', region: 'United Kingdom', id: 'English (UK)' },
    { name: 'English', region: 'United States', id: 'English (US)' },
    { name: 'हिन्दी', region: 'India', id: 'Hindi' },
    { name: 'Español', region: 'España', id: 'Spanish' },
    { name: 'Français', region: 'France', id: 'French' }
  ];

  const handleSelectLanguage = (id: string) => {
    setActiveLang(id);
    // Add slight delay before closing to show selection feedback
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className={styles.header}>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Content Tabs */}
        <div className={styles.tabs}>
          <div className={`${styles.tab} ${styles.activeTab}`}>Language and region</div>
          <div className={styles.tab}>Currency</div>
        </div>

        {/* Language Grid */}
        <div className={styles.content}>
          <h3 className={styles.sectionTitle}>Suggested languages and regions</h3>
          <div className={styles.grid}>
            
            {languages.map((lang) => (
              <div 
                key={lang.id}
                className={`${styles.item} ${activeLang === lang.id ? styles.activeItem : ''}`}
                onClick={() => handleSelectLanguage(lang.id)}
              >
                <div className={styles.itemName}>{lang.name}</div>
                <div className={styles.itemRegion}>{lang.region}</div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}
