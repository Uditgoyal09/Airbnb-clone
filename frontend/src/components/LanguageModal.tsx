'use client';

import { useState } from 'react';
import styles from './LanguageModal.module.css';
import { useSettings, currencies, Currency } from '@/context/SettingsContext';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguageModal({ isOpen, onClose }: LanguageModalProps) {
  const { language, setLanguage, currency, setCurrency } = useSettings();
  const [activeTab, setActiveTab] = useState<'language' | 'currency'>('language');

  if (!isOpen) return null;

  const languages = [
    { name: 'English', region: 'United Kingdom', id: 'English (UK)' },
    { name: 'English', region: 'United States', id: 'English (US)' },
    { name: 'हिन्दी', region: 'India', id: 'Hindi' },
    { name: 'Español', region: 'España', id: 'Spanish' },
    { name: 'Français', region: 'France', id: 'French' }
  ];

  const handleSelectLanguage = (id: string) => {
    setLanguage(id);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleSelectCurrency = (selectedCurrency: Currency) => {
    setCurrency(selectedCurrency);
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
          <div 
            className={`${styles.tab} ${activeTab === 'language' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('language')}
          >
            Language and region
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'currency' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('currency')}
          >
            Currency
          </div>
        </div>

        {/* Content Grid */}
        <div className={styles.content}>
          {activeTab === 'language' ? (
            <>
              <h3 className={styles.sectionTitle}>Suggested languages and regions</h3>
              <div className={styles.grid}>
                {languages.map((lang) => (
                  <div 
                    key={lang.id}
                    className={`${styles.item} ${language === lang.id ? styles.activeItem : ''}`}
                    onClick={() => handleSelectLanguage(lang.id)}
                  >
                    <div className={styles.itemName}>{lang.name}</div>
                    <div className={styles.itemRegion}>{lang.region}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h3 className={styles.sectionTitle}>Choose a currency</h3>
              <div className={styles.grid}>
                {currencies.map((c) => (
                  <div 
                    key={c.code}
                    className={`${styles.item} ${currency.code === c.code ? styles.activeItem : ''}`}
                    onClick={() => handleSelectCurrency(c)}
                  >
                    <div className={styles.itemName}>{c.name}</div>
                    <div className={styles.itemRegion}>{c.code} - {c.symbol}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
