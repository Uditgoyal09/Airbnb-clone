'use client';

import { useEffect } from 'react';
import styles from './ListingMap.module.css';

interface ListingMapProps {
  latitude: number;
  longitude: number;
  title: string;
  price: number;
}

export default function ListingMap({ latitude, longitude, title, price }: ListingMapProps) {
  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    let map: any = null;
    
    const initMap = async () => {
      const L = (await import('leaflet')).default;
      
      // Fix Leaflet default icon URLs (broken in webpack builds)
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const container = document.getElementById('listing-map');
      if (!container || (container as any)._leaflet_id) return;

      map = L.map('listing-map').setView([latitude, longitude], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Custom price marker
      const priceIcon = L.divIcon({
        className: '',
        html: `<div style="background:#222;color:white;padding:6px 10px;border-radius:20px;font-size:13px;font-weight:700;font-family:Inter,sans-serif;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.3);">₹${price.toLocaleString('en-IN')}</div>`,
        iconAnchor: [40, 20],
      });

      L.marker([latitude, longitude], { icon: priceIcon })
        .addTo(map)
        .bindPopup(`<b>${title}</b><br/>₹${price.toLocaleString('en-IN')} / night`, { maxWidth: 200 })
        .openPopup();
    };

    initMap();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [latitude, longitude, title, price]);

  return (
    <div className={styles.mapWrapper}>
      <div id="listing-map" className={styles.map}></div>
    </div>
  );
}
