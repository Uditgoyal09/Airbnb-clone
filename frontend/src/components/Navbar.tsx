'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DateRange, Range } from 'react-date-range';
import { format } from 'date-fns';
import LanguageModal from './LanguageModal';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function Navbar() {
  const { user, setUser, users } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(true);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'homes' | 'experiences' | 'services'>('homes');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchBlock, setActiveSearchBlock] = useState<'where' | 'when' | 'who' | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeDateTab, setActiveDateTab] = useState<'dates' | 'flexible'>('flexible');
  const [flexibleStayLength, setFlexibleStayLength] = useState<'Weekend' | 'Week' | 'Month'>('Weekend');
  const [flexibleMonths, setFlexibleMonths] = useState<string[]>([]);

  const [dateRange, setDateRange] = useState<Range[]>([
    { startDate: new Date(), endDate: new Date(), key: 'selection' }
  ]);
  const [hasSelectedDates, setHasSelectedDates] = useState(false);
  const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 });

  const router = useRouter();
  const searchBarRef = useRef<HTMLFormElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setActiveSearchBlock(null);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    
    // Handle mobile resize
    const handleResize = () => setIsMobile(window.innerWidth <= 744);
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    let lastIsScrolled = false;
    const handleScroll = () => {
      const isPastThreshold = window.scrollY > 20;
      if (isPastThreshold !== lastIsScrolled) {
        lastIsScrolled = isPastThreshold;
        setIsScrolled(isPastThreshold);
        setIsSearchExpanded(!isPastThreshold);
        if (isPastThreshold) setActiveSearchBlock(null);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearchBlock(null);
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('location', searchQuery.trim());
    if (hasSelectedDates && dateRange[0].startDate && dateRange[0].endDate) {
      params.set('check_in', format(dateRange[0].startDate, 'yyyy-MM-dd'));
      params.set('check_out', format(dateRange[0].endDate, 'yyyy-MM-dd'));
    }
    const totalGuests = guests.adults + guests.children;
    if (totalGuests > 0) params.set('guests', String(totalGuests));
    router.push(`/?${params.toString()}`);
    if (isScrolled) setIsSearchExpanded(false);
  };

  const totalGuests = guests.adults + guests.children;
  const guestText = totalGuests === 0 ? 'Add guests' : `${totalGuests} guest${totalGuests > 1 ? 's' : ''}`;
  
  let dateText = 'Add dates';
  if (activeDateTab === 'dates' && hasSelectedDates && dateRange[0].startDate && dateRange[0].endDate) {
    dateText = `${format(dateRange[0].startDate, 'MMM d')} – ${format(dateRange[0].endDate, 'MMM d')}`;
  } else if (activeDateTab === 'flexible' && flexibleMonths.length > 0) {
    dateText = `Any ${flexibleStayLength.toLowerCase()} in ${flexibleMonths.join(', ')}`;
  } else if (activeDateTab === 'flexible') {
    dateText = `Any ${flexibleStayLength.toLowerCase()}`;
  }

  const handleSwitchUser = (selectedUser: typeof users[0]) => {
    setUser(selectedUser);
    setIsMenuOpen(false);
    toast.success(`Switched to ${selectedUser.name}`);
  };

  return (
    <>
      <header className={`${styles.header} ${isSearchExpanded ? styles.headerExpanded : styles.headerCollapsed}`}>
        <div className={`container ${styles.headerContainer}`}>

          {/* Top Row */}
          <div className={styles.topRow}>
            <Link href="/" className={styles.logo}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" alt="Airbnb" className={styles.fullLogo} />
            </Link>

            <div className={`${styles.centerNav} ${isSearchExpanded ? styles.centerNavVisible : styles.centerNavHidden}`}>
              <Link href="/" className={`${styles.navTab} ${activeTab === 'all' ? styles.navTabActive : ''}`} onClick={() => setActiveTab('all')}>
                <span className={styles.navIcon}>🌍</span>
                <span className={styles.navText}>All</span>
              </Link>
              <Link href="/" className={`${styles.navTab} ${activeTab === 'homes' ? styles.navTabActive : ''}`} onClick={() => setActiveTab('homes')}>
                <span className={styles.navIcon}>🏡</span>
                <span className={styles.navText}>Homes</span>
              </Link>
              <Link href="/experiences" className={`${styles.navTab} ${activeTab === 'experiences' ? styles.navTabActive : ''}`} onClick={() => setActiveTab('experiences')}>
                <span className={styles.navIcon}>🎈</span>
                <span className={styles.navText}>Experiences</span>
              </Link>
              <Link href="/services" className={`${styles.navTab} ${activeTab === 'services' ? styles.navTabActive : ''}`} onClick={() => setActiveTab('services')}>
                <span className={styles.navIcon}>🛎️</span>
                <span className={styles.navText}>Services</span>
              </Link>
            </div>

            <button className={`${styles.collapsedPill} ${isSearchExpanded ? styles.collapsedPillHidden : styles.collapsedPillVisible}`} onClick={() => setIsSearchExpanded(true)}>
              <div className={styles.searchText}>{searchQuery || 'Anywhere'}</div>
              <div className={styles.searchDivider}></div>
              <div className={styles.searchText}>{hasSelectedDates ? dateText : 'Any week'}</div>
              <div className={styles.searchDivider}></div>
              <div className={`${styles.searchText} ${totalGuests === 0 ? styles.searchLight : ''}`}>{guestText}</div>
              <div className={styles.searchIconSmall}>
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', fill: 'none', height: '12px', width: '12px', stroke: 'currentcolor', strokeWidth: '5.33333', overflow: 'visible' }}>
                  <g fill="none"><path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"></path></g>
                </svg>
              </div>
            </button>

            {/* User Menu */}
            <div className={styles.userMenu}>
              <Link href={user.is_host ? '/host' : '/host'} className={styles.hostLink}>
                {user.is_host ? 'Host Dashboard' : 'Airbnb your home'}
              </Link>
              <div className={styles.globeIcon} onClick={() => setIsLanguageModalOpen(true)}>
                <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', height: '16px', width: '16px', fill: 'currentcolor' }}>
                  <path d="m8.002.25a7.77 7.77 0 0 1 7.748 7.776 7.75 7.75 0 0 1 -7.521 7.72l-.246.004a7.75 7.75 0 0 1 -7.73-7.513l-.003-.245a7.75 7.75 0 0 1 7.752-7.742zm1.949 8.5h-3.903c.155 2.897 1.176 5.343 1.886 5.493l.068.007c.68-.002 1.72-2.365 1.932-5.23zm4.255 0h-2.752c-.091 1.96-.53 3.783-1.188 5.076a6.257 6.257 0 0 0 3.905-4.829zm-9.661 0h-2.75a6.257 6.257 0 0 0 3.934 5.075c-.615-1.29-1.036-3.113-1.184-5.075zm5.406-7.004c-.754.002-1.786 2.37-1.996 5.254h3.99c-.198-2.723-1.127-5.02-1.859-5.242zm-5.462.248c.642 1.353 1.096 3.256 1.191 5.256h-2.812a6.262 6.262 0 0 1 1.621-5.256zm7.25.006a6.264 6.264 0 0 1 1.558 4.966l.06.284h-2.812c.094-2.001.547-3.904 1.194-5.25z"></path>
                </svg>
              </div>

              <div ref={menuRef} className={styles.profileDropdown} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentcolor', strokeWidth: '3', overflow: 'visible' }}>
                  <g fill="none" fillRule="nonzero"><path d="m2 16h28"></path><path d="m2 24h28"></path><path d="m2 8h28"></path></g>
                </svg>
                <div className={styles.avatar}>
                  {user.avatar_url ? (
                    <Image src={user.avatar_url} alt={user.name} width={30} height={30} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', height: '30px', width: '30px', fill: 'var(--text-light)' }}>
                      <path d="m16 .7c-8.437 0-15.3 6.863-15.3 15.3s6.863 15.3 15.3 15.3 15.3-6.863 15.3-15.3-6.863-15.3-15.3-15.3zm0 28c-4.021 0-7.605-1.884-9.933-4.81a12.425 12.425 0 0 1 6.451-4.4 6.507 6.507 0 0 1 -3.018-5.49c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5a6.513 6.513 0 0 1 -3.019 5.491 12.42 12.42 0 0 1 6.452 4.4c-2.328 2.925-5.912 4.809-9.933 4.809z"></path>
                    </svg>
                  )}
                </div>

                {isMenuOpen && (
                  <div className={styles.dropdownMenu} onClick={e => e.stopPropagation()}>
                    <div className={styles.dropdownUserInfo}>
                      <span className={styles.dropdownUserName}>{user.name}</span>
                      <span className={styles.dropdownUserRole}>{user.is_host ? '🏠 Host' : '🧳 Guest'}</span>
                    </div>
                    <hr className={styles.dropdownDivider} />
                    <Link href="/trips" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>My Trips</Link>
                    <Link href="/wishlist" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>Wishlists</Link>
                    <hr className={styles.dropdownDivider} />
                    <Link href="/host" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>{user.is_host ? 'Host Dashboard' : 'Become a host'}</Link>
                    {user.is_host && <Link href="/host/create" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>Create new listing</Link>}
                    <hr className={styles.dropdownDivider} />
                    <div className={styles.dropdownSection}>Switch account</div>
                    {users.map(u => (
                      <button key={u.id} className={`${styles.dropdownItem} ${styles.userSwitchBtn} ${u.id === user.id ? styles.activeUser : ''}`} onClick={() => handleSwitchUser(u)}>
                        <Image src={u.avatar_url} alt={u.name} width={24} height={24} style={{ borderRadius: '50%' }} />
                        <span>{u.name} {u.is_host ? '(Host)' : '(Guest)'}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          
          {/* Mobile Search Modal */}
          {isMobile && isSearchExpanded && (
            <div className={styles.mobileSearchModal}>
              <div className={styles.mobileModalHeader}>
                <button className={styles.mobileModalClose} onClick={() => setIsSearchExpanded(false)}>
                  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', fill: 'none', height: '12px', width: '12px', stroke: 'currentcolor', strokeWidth: '5.33333', overflow: 'visible' }}><path d="m6 6 20 20"></path><path d="m26 6-20 20"></path></svg>
                </button>
                <div className={styles.mobileModalTabs}>
                  <button className={`${styles.mobileModalTab} ${activeTab === 'homes' ? styles.mobileModalTabActive : ''}`} onClick={() => setActiveTab('homes')}>Stays</button>
                  <button className={`${styles.mobileModalTab} ${activeTab === 'experiences' ? styles.mobileModalTabActive : ''}`} onClick={() => setActiveTab('experiences')}>Experiences</button>
                </div>
              </div>

              <div className={styles.mobileModalBody}>
                {activeSearchBlock === 'where' || activeSearchBlock === null ? (
                  <div className={styles.mobileActiveCard}>
                    <h2 className={styles.mobileCardTitle}>Where to?</h2>
                    <div className={styles.mobileSearchInputWrap}>
                      <span style={{ fontSize: '18px' }}>🔍</span>
                      <input type="text" placeholder="Search destinations" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.mobileSearchInput} autoFocus />
                    </div>
                    <div className={styles.destList}>
                      <button type="button" className={styles.destItem} onClick={() => { setSearchQuery('Zirakpur'); setActiveSearchBlock('when'); }}>
                        <div className={styles.destIcon}><span style={{fontSize:'20px'}}>📍</span></div>
                        <div className={styles.destDetails}>
                          <div className={styles.destName}>Zirakpur, Punjab</div>
                          <div className={styles.destSub}>Near you</div>
                        </div>
                      </button>
                      <button type="button" className={styles.destItem} onClick={() => { setSearchQuery('Chandigarh'); setActiveSearchBlock('when'); }}>
                        <div className={styles.destIcon}><span style={{fontSize:'20px'}}>🌳</span></div>
                        <div className={styles.destDetails}>
                          <div className={styles.destName}>Chandigarh</div>
                          <div className={styles.destSub}>A hidden gem</div>
                        </div>
                      </button>
                      <button type="button" className={styles.destItem} onClick={() => { setSearchQuery('Goa'); setActiveSearchBlock('when'); }}>
                        <div className={styles.destIcon}><span style={{fontSize:'20px'}}>🏖️</span></div>
                        <div className={styles.destDetails}>
                          <div className={styles.destName}>Goa</div>
                          <div className={styles.destSub}>Popular beach destination</div>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.mobileCollapsedPill} onClick={() => setActiveSearchBlock('where')}>
                    <span className={styles.mobileCollapsedLabel}>Where</span>
                    <span className={styles.mobileCollapsedValue}>{searchQuery || "I'm flexible"}</span>
                  </div>
                )}

                {activeSearchBlock === 'when' ? (
                  <div className={styles.mobileActiveCard}>
                    <h2 className={styles.mobileCardTitle}>When's your trip?</h2>
                    <div className={styles.dateTabsWrapper}>
                      <div className={styles.dateTabs}>
                        <button type="button" className={`${styles.dateTab} ${activeDateTab === 'dates' ? styles.dateTabActive : ''}`} onClick={() => setActiveDateTab('dates')}>Dates</button>
                        <button type="button" className={`${styles.dateTab} ${activeDateTab === 'flexible' ? styles.dateTabActive : ''}`} onClick={() => setActiveDateTab('flexible')}>Flexible</button>
                      </div>
                    </div>
                    {activeDateTab === 'dates' ? (
                      <DateRange ranges={dateRange} onChange={(item) => { setDateRange([item.selection]); setHasSelectedDates(true); }} months={1} direction="vertical" showDateDisplay={false} minDate={new Date()} rangeColors={['#222222']} />
                    ) : (
                      <div className={styles.flexibleContainer}>
                        <div className={styles.stayLengthPills}>
                          {['Weekend', 'Week', 'Month'].map(length => (
                            <button key={length} type="button" className={`${styles.stayLengthPill} ${flexibleStayLength === length ? styles.stayLengthPillActive : ''}`} onClick={() => setFlexibleStayLength(length)}>{length}</button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.mobileCollapsedPill} onClick={() => setActiveSearchBlock('when')}>
                    <span className={styles.mobileCollapsedLabel}>When</span>
                    <span className={styles.mobileCollapsedValue}>{hasSelectedDates ? dateText : "Any week"}</span>
                  </div>
                )}

                {activeSearchBlock === 'who' ? (
                  <div className={styles.mobileActiveCard}>
                    <h2 className={styles.mobileCardTitle}>Who's coming?</h2>
                    <div className={styles.guestDropdown}>
                      {[
                        { key: 'adults', label: 'Adults', desc: 'Ages 13 or above' },
                        { key: 'children', label: 'Children', desc: 'Ages 2–12' },
                        { key: 'infants', label: 'Infants', desc: 'Under 2' },
                      ].map(({ key, label, desc }) => (
                        <div key={key} className={styles.guestRow}>
                          <div className={styles.guestDetails}>
                            <div className={styles.guestType}>{label}</div>
                            <div className={styles.guestDesc}>{desc}</div>
                          </div>
                          <div className={styles.guestControls}>
                            <button type="button" onClick={() => setGuests(g => ({ ...g, [key]: Math.max(0, g[key] - 1) }))} disabled={guests[key] === 0}>-</button>
                            <span>{guests[key]}</span>
                            <button type="button" onClick={() => setGuests(g => ({ ...g, [key]: g[key] + 1 }))}>+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={styles.mobileCollapsedPill} onClick={() => setActiveSearchBlock('who')}>
                    <span className={styles.mobileCollapsedLabel}>Who</span>
                    <span className={styles.mobileCollapsedValue}>{totalGuests === 0 ? "Add guests" : guestText}</span>
                  </div>
                )}
              </div>

              <div className={styles.mobileModalFooter}>
                <button className={styles.mobileClearBtn} onClick={() => { setSearchQuery(''); setHasSelectedDates(false); setGuests({adults:0, children:0, infants:0, pets:0}); }}>Clear all</button>
                <button className={styles.mobileSearchBtn} onClick={(e) => { handleSearchSubmit(e); setIsSearchExpanded(false); }}>
                  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentcolor', strokeWidth: '5.33333', overflow: 'visible' }}><g fill="none"><path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"></path></g></svg>
                  Search
                </button>
              </div>
            </div>
          )}

          {/* Expanded Search Bar */}
          {!isMobile && (

          <div className={`${styles.expandedSearchWrapper} ${isSearchExpanded ? styles.expandedSearchVisible : styles.expandedSearchHidden}`}>
            <form ref={searchBarRef} onSubmit={handleSearchSubmit} className={`${styles.expandedSearchBar} ${activeSearchBlock ? styles.searchBarActive : ''}`}>
              <div className={`${styles.searchBlock} ${activeSearchBlock === 'where' ? styles.searchBlockActive : ''}`} onClick={() => setActiveSearchBlock('where')}>
                <div className={styles.searchBlockLabel}>Where</div>
                <input type="text" placeholder={activeTab === 'experiences' ? 'Search by city or landmark' : 'Search destinations'} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchBlockInput} />
                {activeSearchBlock === 'where' && (
                  <div className={styles.destinationsPopover} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.popoverTitle}>Suggested destinations</div>
                    <div className={styles.destList}>
                      <button type="button" className={styles.destItem} onClick={() => { setSearchQuery('Zirakpur'); setActiveSearchBlock('when'); }}>
                        <div className={styles.destIcon}><span style={{fontSize:'20px'}}>📍</span></div>
                        <div className={styles.destDetails}>
                          <div className={styles.destName}>Zirakpur, Punjab</div>
                          <div className={styles.destSub}>Near you</div>
                        </div>
                      </button>
                      <button type="button" className={styles.destItem} onClick={() => { setSearchQuery('Chandigarh'); setActiveSearchBlock('when'); }}>
                        <div className={styles.destIcon}><span style={{fontSize:'20px'}}>🌳</span></div>
                        <div className={styles.destDetails}>
                          <div className={styles.destName}>Chandigarh</div>
                          <div className={styles.destSub}>A hidden gem</div>
                        </div>
                      </button>
                      <button type="button" className={styles.destItem} onClick={() => { setSearchQuery('Sahibzada Ajit Singh Nagar'); setActiveSearchBlock('when'); }}>
                        <div className={styles.destIcon}><span style={{fontSize:'20px'}}>🏙️</span></div>
                        <div className={styles.destDetails}>
                          <div className={styles.destName}>Sahibzada Ajit Singh Nagar, Punjab</div>
                          <div className={styles.destSub}>Popular with travellers near you</div>
                        </div>
                      </button>
                      <button type="button" className={styles.destItem} onClick={() => { setSearchQuery('Kharar'); setActiveSearchBlock('when'); }}>
                        <div className={styles.destIcon}><span style={{fontSize:'20px'}}>🏞️</span></div>
                        <div className={styles.destDetails}>
                          <div className={styles.destName}>Kharar, Punjab</div>
                          <div className={styles.destSub}>Near you</div>
                        </div>
                      </button>
                      <button type="button" className={styles.destItem} onClick={() => { setSearchQuery('Kasauli'); setActiveSearchBlock('when'); }}>
                        <div className={styles.destIcon}><span style={{fontSize:'20px'}}>⛰️</span></div>
                        <div className={styles.destDetails}>
                          <div className={styles.destName}>Kasauli, Himachal Pradesh</div>
                          <div className={styles.destSub}>For nature lovers</div>
                        </div>
                      </button>
                      <button type="button" className={styles.destItem} onClick={() => { setSearchQuery('Shimla'); setActiveSearchBlock('when'); }}>
                        <div className={styles.destIcon}><span style={{fontSize:'20px'}}>❄️</span></div>
                        <div className={styles.destDetails}>
                          <div className={styles.destName}>Shimla, Himachal Pradesh</div>
                          <div className={styles.destSub}>Great for winter getaways</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.searchBlockDivider}></div>
              <div className={`${styles.searchBlock} ${activeSearchBlock === 'when' ? styles.searchBlockActive : ''}`} onClick={() => setActiveSearchBlock('when')}>
                <div className={styles.searchBlockLabel}>When</div>
                <div className={`${styles.searchBlockValue} ${dateText !== 'Add dates' ? styles.hasValue : ''}`}>{dateText}</div>
                {activeSearchBlock === 'when' && (
                  <div className={`${styles.popover} ${styles.whenPopover}`} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.dateTabsWrapper}>
                      <div className={styles.dateTabs}>
                        <button type="button" className={`${styles.dateTab} ${activeDateTab === 'dates' ? styles.dateTabActive : ''}`} onClick={() => setActiveDateTab('dates')}>Dates</button>
                        <button type="button" className={`${styles.dateTab} ${activeDateTab === 'flexible' ? styles.dateTabActive : ''}`} onClick={() => setActiveDateTab('flexible')}>Flexible</button>
                      </div>
                    </div>
                    {activeDateTab === 'dates' ? (
                      <DateRange ranges={dateRange} onChange={(item) => { setDateRange([item.selection]); setHasSelectedDates(true); }} months={isMobile ? 1 : 2} direction={isMobile ? "vertical" : "horizontal"} showDateDisplay={false} minDate={new Date()} rangeColors={['#222222']} />
                    ) : (
                      <div className={styles.flexibleContainer}>
                        <h3 className={styles.flexibleTitle}>How long would you like to stay?</h3>
                        <div className={styles.stayLengthPills}>
                          {['Weekend', 'Week', 'Month'].map(length => (
                            <button 
                              key={length} 
                              type="button" 
                              className={`${styles.stayLengthPill} ${flexibleStayLength === length ? styles.stayLengthPillActive : ''}`}
                              onClick={() => setFlexibleStayLength(length as any)}
                            >
                              {length}
                            </button>
                          ))}
                        </div>
                        <h3 className={styles.flexibleTitle}>When do you want to go?</h3>
                        <div className={styles.monthScroller}>
                          {['August 2026', 'September 2026', 'October 2026', 'November 2026', 'December 2026', 'January 2027'].map(month => {
                            const isSelected = flexibleMonths.includes(month);
                            return (
                              <button 
                                key={month} 
                                type="button" 
                                className={`${styles.monthCard} ${isSelected ? styles.monthCardActive : ''}`}
                                onClick={() => {
                                  if (isSelected) {
                                    setFlexibleMonths(flexibleMonths.filter(m => m !== month));
                                  } else {
                                    setFlexibleMonths([...flexibleMonths, month]);
                                  }
                                }}
                              >
                                <div className={styles.monthIcon}>📅</div>
                                <div className={styles.monthName}>{month.split(' ')[0]}</div>
                                <div className={styles.monthYear}>{month.split(' ')[1]}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className={styles.searchBlockDivider}></div>
              <div className={`${styles.searchBlock} ${styles.searchBlockGuests} ${activeSearchBlock === 'who' ? styles.searchBlockActive : ''}`} onClick={() => setActiveSearchBlock('who')}>
                <div className={styles.guestInfo}>
                  <div className={styles.searchBlockLabel}>Who</div>
                  <div className={`${styles.searchBlockValue} ${totalGuests > 0 ? styles.hasValue : ''}`}>{guestText}</div>
                </div>
                <button type="submit" className={`${styles.bigSearchBtn} ${activeSearchBlock ? styles.bigSearchBtnExpanded : ''}`}>
                  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentcolor', strokeWidth: '4', overflow: 'visible' }}>
                    <g fill="none"><path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"></path></g>
                  </svg>
                  {activeSearchBlock && <span>Search</span>}
                </button>
                {activeSearchBlock === 'who' && (
                  <div className={styles.popover} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.guestDropdown}>
                      {[
                        { key: 'adults', label: 'Adults', desc: 'Ages 13 or above' },
                        { key: 'children', label: 'Children', desc: 'Ages 2–12' },
                        { key: 'infants', label: 'Infants', desc: 'Under 2' },
                      ].map(({ key, label, desc }) => (
                        <div key={key} className={styles.guestRow}>
                          <div className={styles.guestDetails}>
                            <div className={styles.guestType}>{label}</div>
                            <div className={styles.guestDesc}>{desc}</div>
                          </div>
                          <div className={styles.guestControls}>
                            <button type="button" onClick={() => setGuests(g => ({ ...g, [key]: Math.max(0, g[key as keyof typeof g] - 1) }))} disabled={guests[key as keyof typeof guests] === 0}>-</button>
                            <span>{guests[key as keyof typeof guests]}</span>
                            <button type="button" onClick={() => setGuests(g => ({ ...g, [key]: g[key as keyof typeof g] + 1 }))}>+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
          )}
        </div>
      </header>

      <LanguageModal isOpen={isLanguageModalOpen} onClose={() => setIsLanguageModalOpen(false)} />
    </>
  );
}
