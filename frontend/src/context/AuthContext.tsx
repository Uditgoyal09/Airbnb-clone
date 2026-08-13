'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AppUser {
  id: number;
  name: string;
  email: string;
  is_host: boolean;
  avatar_url: string;
}

// Hardcoded seed users matching our seed.py
const SEED_USERS: AppUser[] = [
  { id: 1, name: 'Ananya Sharma', email: 'ananya@example.com', is_host: true, avatar_url: 'https://i.pravatar.cc/150?u=ananya' },
  { id: 2, name: 'Vikram Mehta', email: 'vikram@example.com', is_host: true, avatar_url: 'https://i.pravatar.cc/150?u=vikram' },
  { id: 3, name: 'Rahul Gupta', email: 'rahul@example.com', is_host: false, avatar_url: 'https://i.pravatar.cc/150?u=rahul' },
  { id: 4, name: 'Priya Singh', email: 'priya@example.com', is_host: false, avatar_url: 'https://i.pravatar.cc/150?u=priya' },
];

interface AuthContextType {
  user: AppUser;
  setUser: (user: AppUser) => void;
  users: AppUser[];
  wishlist: Set<number>;
  toggleWishlist: (listingId: number) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AppUser>(SEED_USERS[2]); // Default: Rahul (guest)
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());

  const setUser = (u: AppUser) => {
    setUserState(u);
    if (typeof window !== 'undefined') {
      localStorage.setItem('airbnb_user_id', String(u.id));
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('airbnb_user_id');
      if (saved) {
        const found = SEED_USERS.find(u => u.id === Number(saved));
        if (found) setUserState(found);
      }
      const savedWishlist = localStorage.getItem('airbnb_wishlist');
      if (savedWishlist) {
        setWishlist(new Set(JSON.parse(savedWishlist)));
      }
    }
  }, []);

  const toggleWishlist = (listingId: number) => {
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(listingId)) next.delete(listingId);
      else next.add(listingId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('airbnb_wishlist', JSON.stringify([...next]));
      }
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, users: SEED_USERS, wishlist, toggleWishlist }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
