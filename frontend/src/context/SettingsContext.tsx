'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Currency = {
  code: string;
  symbol: string;
  rate: number; // conversion rate from INR (base)
  name: string;
};

export const currencies: Currency[] = [
  { code: 'INR', symbol: '₹', rate: 1, name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', rate: 0.012, name: 'United States Dollar' },
  { code: 'EUR', symbol: '€', rate: 0.011, name: 'Euro' },
  { code: 'GBP', symbol: '£', rate: 0.0094, name: 'British Pound' },
  { code: 'AUD', symbol: 'A$', rate: 0.018, name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', rate: 0.016, name: 'Canadian Dollar' },
];

interface SettingsContextType {
  language: string;
  setLanguage: (lang: string) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('English (UK)');
  const [currency, setCurrency] = useState<Currency>(currencies[0]);

  return (
    <SettingsContext.Provider value={{ language, setLanguage, currency, setCurrency }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
