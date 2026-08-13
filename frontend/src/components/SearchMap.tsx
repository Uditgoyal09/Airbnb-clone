'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Listing {
  id: number;
  title: string;
  price_per_night: number;
  rating?: number;
  latitude?: number;
  longitude?: number;
}

interface SearchMapProps {
  listings: Listing[];
  hoveredListingId?: number | null;
}

// Custom icon factory for price markers
const createPriceIcon = (price: number, isHovered: boolean) => {
  const formattedPrice = `₹${price.toLocaleString('en-IN')}`;
  
  return L.divIcon({
    className: 'custom-price-marker',
    html: `
      <div style="
        background-color: ${isHovered ? 'var(--text-dark)' : 'white'};
        color: ${isHovered ? 'white' : 'var(--text-dark)'};
        padding: 6px 12px;
        border-radius: 28px;
        font-weight: 700;
        font-size: 15px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border: 1px solid ${isHovered ? 'var(--text-dark)' : 'rgba(0,0,0,0.08)'};
        white-space: nowrap;
        transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1), background-color 0.2s, color 0.2s;
        transform: scale(${isHovered ? 1.1 : 1});
        transform-origin: center center;
        z-index: ${isHovered ? 1000 : 1};
        position: relative;
        display: flex;
        align-items: center;
      ">
        <span>${formattedPrice}</span>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [40, 20],
  });
};

function MapBounds({ listings }: { listings: Listing[] }) {
  const map = useMap();
  
  useEffect(() => {
    const validListings = listings.filter(l => l.latitude && l.longitude);
    if (validListings.length > 0) {
      const bounds = L.latLngBounds(validListings.map(l => [l.latitude!, l.longitude!]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [listings, map]);
  
  return null;
}

export default function SearchMap({ listings, hoveredListingId }: SearchMapProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ background: '#e5e5e5', width: '100%', height: '100%' }} />;

  // Default center if no listings (India)
  const defaultCenter: [number, number] = [20.5937, 78.9629];
  const validListings = listings.filter(l => l.latitude && l.longitude);

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={5} 
      style={{ height: '100%', width: '100%', zIndex: 1 }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {validListings.map(listing => (
        <Marker 
          key={listing.id} 
          position={[listing.latitude!, listing.longitude!]}
          icon={createPriceIcon(listing.price_per_night, listing.id === hoveredListingId)}
        >
          <Popup closeButton={false}>
            <strong>{listing.title}</strong><br/>
            ₹{listing.price_per_night} / night
          </Popup>
        </Marker>
      ))}
      
      <MapBounds listings={validListings} />
    </MapContainer>
  );
}
