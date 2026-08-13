import { getListings } from '@/services/api';
import HomeClient from './HomeClient';

export default async function Home({ searchParams }: { searchParams: Promise<{ location?: string; guests?: string }> }) {
  const resolvedParams = await searchParams;
  const locationQuery = resolvedParams.location || '';
  const guestsQuery = resolvedParams.guests ? Number(resolvedParams.guests) : undefined;

  let listings = [];
  try {
    listings = await getListings({
      location: locationQuery || undefined,
      guests: guestsQuery,
    });
  } catch (error) {
    console.error('Failed to fetch listings:', error);
  }

  return <HomeClient initialListings={listings} locationQuery={locationQuery} />;
}
