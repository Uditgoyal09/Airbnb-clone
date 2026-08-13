'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DateRange, Range } from 'react-date-range';
import { format, differenceInDays, addDays, isWithinInterval, parseISO } from 'date-fns';
import { createBooking, getListingBookings } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import styles from './BookingWidget.module.css';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface BookingWidgetProps {
  listing: any;
}

export default function BookingWidget({ listing }: BookingWidgetProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [dateRange, setDateRange] = useState<Range[]>([
    { startDate: new Date(), endDate: new Date(), key: 'selection' }
  ]);
  const [hasSelectedDates, setHasSelectedDates] = useState(false);
  const [guests, setGuests] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [guestBreakdown, setGuestBreakdown] = useState({ adults: 1, children: 0, infants: 0 });
  const [bookedRanges, setBookedRanges] = useState<{ start: Date; end: Date }[]>([]);

  const calendarRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch already-booked dates
    getListingBookings(String(listing.id)).then((bookings: any[]) => {
      const ranges = bookings
        .filter(b => b.status !== 'cancelled')
        .map(b => ({ start: parseISO(b.check_in), end: parseISO(b.check_out) }));
      setBookedRanges(ranges);
    }).catch(() => {});
  }, [listing.id]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) setShowCalendar(false);
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) setShowGuests(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const isDateDisabled = (date: Date) => {
    return bookedRanges.some(range => isWithinInterval(date, { start: range.start, end: addDays(range.end, -1) }));
  };

  const startDate = dateRange[0].startDate;
  const endDate = dateRange[0].endDate;
  const nights = hasSelectedDates && startDate && endDate ? differenceInDays(endDate, startDate) : 0;
  const nightlyTotal = nights > 0 ? nights * listing.price_per_night : 0;
  const cleaningFee = nights > 0 ? Math.round(listing.price_per_night * 0.15) : 0;
  const serviceFee = nights > 0 ? Math.round(nightlyTotal * 0.14) : 0;
  const total = nightlyTotal + cleaningFee + serviceFee;

  const totalGuests = guestBreakdown.adults + guestBreakdown.children;

  const handleReserve = async () => {
    if (!hasSelectedDates || nights <= 0) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    if (user.is_host) {
      toast.error('Switch to a guest account to make a booking');
      return;
    }

    setIsLoading(true);
    try {
      const booking = await createBooking({
        listing_id: listing.id,
        guest_id: user.id,
        check_in: format(startDate!, 'yyyy-MM-dd'),
        check_out: format(endDate!, 'yyyy-MM-dd'),
        total_price: total,
        guest_count: totalGuests,
      });
      toast.success('Booking confirmed!');
      router.push(`/bookings/${booking.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  const dateDisplay = hasSelectedDates && startDate && endDate && nights > 0
    ? `${format(startDate, 'MMM d')} – ${format(endDate, 'MMM d, yyyy')}`
    : 'Add dates';

  return (
    <div className={styles.widget}>
      <div className={styles.priceHeader}>
        <div>
          <span className={styles.price}>₹{listing.price_per_night.toLocaleString('en-IN')}</span>
          <span className={styles.night}> night</span>
        </div>
        <div className={styles.ratingSmall}>
          <span>★</span>
          <span>{listing.rating?.toFixed(2) || '4.95'}</span>
          <span className={styles.reviewCount}>· {listing.num_reviews || 0} reviews</span>
        </div>
      </div>

      {/* Date Range Picker */}
      <div ref={calendarRef} className={styles.formSection}>
        <div className={styles.dateRow} onClick={() => { setShowCalendar(!showCalendar); setShowGuests(false); }}>
          <div className={styles.dateBlock}>
            <div className={styles.dateLabel}>CHECK-IN</div>
            <div className={styles.dateValue}>{hasSelectedDates && startDate ? format(startDate, 'MM/dd/yyyy') : 'Add date'}</div>
          </div>
          <div className={styles.dateDivider}></div>
          <div className={styles.dateBlock}>
            <div className={styles.dateLabel}>CHECKOUT</div>
            <div className={styles.dateValue}>{hasSelectedDates && endDate && nights > 0 ? format(endDate, 'MM/dd/yyyy') : 'Add date'}</div>
          </div>
        </div>

        {showCalendar && (
          <div className={styles.calendarPopover}>
            <DateRange
              ranges={dateRange}
              onChange={(item) => {
                setDateRange([item.selection]);
                if (item.selection.startDate && item.selection.endDate &&
                    differenceInDays(item.selection.endDate, item.selection.startDate) > 0) {
                  setHasSelectedDates(true);
                  setShowCalendar(false);
                }
              }}
              months={1}
              direction="vertical"
              showDateDisplay={false}
              minDate={new Date()}
              rangeColors={['#222222']}
              disabledDay={isDateDisabled}
            />
          </div>
        )}

        {/* Guests */}
        <div ref={guestRef}>
          <div className={styles.guestBlock} onClick={() => { setShowGuests(!showGuests); setShowCalendar(false); }}>
            <div className={styles.dateLabel}>GUESTS</div>
            <div className={styles.dateValue}>
              {totalGuests} guest{totalGuests !== 1 ? 's' : ''}
              {guestBreakdown.infants > 0 ? `, ${guestBreakdown.infants} infant${guestBreakdown.infants > 1 ? 's' : ''}` : ''}
            </div>
          </div>
          {showGuests && (
            <div className={styles.guestPopover}>
              {[
                { key: 'adults', label: 'Adults', desc: 'Ages 13+' },
                { key: 'children', label: 'Children', desc: 'Ages 2–12' },
                { key: 'infants', label: 'Infants', desc: 'Under 2' },
              ].map(({ key, label, desc }) => (
                <div key={key} className={styles.guestRow}>
                  <div>
                    <div className={styles.guestLabel}>{label}</div>
                    <div className={styles.guestDesc}>{desc}</div>
                  </div>
                  <div className={styles.guestControls}>
                    <button type="button" className={styles.guestBtn}
                      onClick={() => setGuestBreakdown(g => ({ ...g, [key]: Math.max(key === 'adults' ? 1 : 0, g[key as keyof typeof g] - 1) }))}
                      disabled={guestBreakdown[key as keyof typeof guestBreakdown] <= (key === 'adults' ? 1 : 0)}>–</button>
                    <span className={styles.guestCount}>{guestBreakdown[key as keyof typeof guestBreakdown]}</span>
                    <button type="button" className={styles.guestBtn}
                      onClick={() => setGuestBreakdown(g => ({ ...g, [key]: g[key as keyof typeof g] + 1 }))}
                      disabled={totalGuests >= listing.max_guests && key !== 'infants'}>+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button className={styles.reserveBtn} onClick={handleReserve} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Reserve'}
      </button>
      <p className={styles.chargeNotice}>You won't be charged yet</p>

      {nights > 0 && (
        <div className={styles.breakdown}>
          <div className={styles.breakdownRow}>
            <span>₹{listing.price_per_night.toLocaleString('en-IN')} × {nights} night{nights > 1 ? 's' : ''}</span>
            <span>₹{nightlyTotal.toLocaleString('en-IN')}</span>
          </div>
          <div className={styles.breakdownRow}>
            <span className={styles.underlineText}>Cleaning fee</span>
            <span>₹{cleaningFee.toLocaleString('en-IN')}</span>
          </div>
          <div className={styles.breakdownRow}>
            <span className={styles.underlineText}>Airbnb service fee</span>
            <span>₹{serviceFee.toLocaleString('en-IN')}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Total before taxes</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
