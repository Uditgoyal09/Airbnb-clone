import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.footerLinks}>
          <div className={styles.footerSection}>
            <h4>Support</h4>
            <ul>
              <li><Link href="/info/help-centre">Help Centre</Link></li>
              <li><Link href="/info/safety-issue">Get help with a safety issue</Link></li>
              <li><Link href="/info/aircover">AirCover</Link></li>
              <li><Link href="/info/anti-discrimination">Anti-discrimination</Link></li>
              <li><Link href="/info/disability-support">Disability support</Link></li>
              <li><Link href="/info/cancellation-options">Cancellation options</Link></li>
              <li><Link href="/info/report-concern">Report neighbourhood concern</Link></li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h4>Hosting</h4>
            <ul>
              <li><Link href="/info/airbnb-your-home">Airbnb your home</Link></li>
              <li><Link href="/info/airbnb-your-experience">Airbnb your experience</Link></li>
              <li><Link href="/info/airbnb-your-service">Airbnb your service</Link></li>
              <li><Link href="/info/aircover-for-hosts">AirCover for Hosts</Link></li>
              <li><Link href="/info/hosting-resources">Hosting resources</Link></li>
              <li><Link href="/info/community-forum">Community forum</Link></li>
              <li><Link href="/info/hosting-responsibly">Hosting responsibly</Link></li>
              <li><Link href="/info/join-hosting-class">Join a free hosting class</Link></li>
              <li><Link href="/info/find-co-host">Find a co-host</Link></li>
              <li><Link href="/info/refer-a-host">Refer a host</Link></li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h4>Airbnb</h4>
            <ul>
              <li><Link href="/info/summer-release">2026 Summer Release</Link></li>
              <li><Link href="/info/newsroom">Newsroom</Link></li>
              <li><Link href="/info/careers">Careers</Link></li>
              <li><Link href="/info/investors">Investors</Link></li>
              <li><Link href="/info/emergency-stays">Airbnb.org emergency stays</Link></li>
            </ul>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <div className={styles.footerCopy}>
            © 2026 Airbnb, Inc. · <Link href="/info/privacy">Privacy</Link> · <Link href="/info/terms">Terms</Link> · <Link href="/info/sitemap">Sitemap</Link> · <Link href="/info/company-details">Company details</Link>
          </div>
          <div className={styles.footerSocials}>
            <div className={styles.footerSocialsLeft}>
              <span className={styles.iconBtn}>
                <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '16px', width: '16px', fill: 'currentcolor' }}>
                  <path d="m8.002.25a7.77 7.77 0 0 1 7.748 7.776 7.75 7.75 0 0 1 -7.521 7.72l-.246.004a7.75 7.75 0 0 1 -7.73-7.513l-.003-.245a7.75 7.75 0 0 1 7.752-7.742zm1.949 8.5h-3.903c.155 2.897 1.176 5.343 1.886 5.493l.068.007c.68-.002 1.72-2.365 1.932-5.23zm4.255 0h-2.752c-.091 1.96-.53 3.783-1.188 5.076a6.257 6.257 0 0 0 3.905-4.829zm-9.661 0h-2.75a6.257 6.257 0 0 0 3.934 5.075c-.615-1.29-1.036-3.113-1.184-5.075zm5.406-7.004c-.754.002-1.786 2.37-1.996 5.254h3.99c-.198-2.723-1.127-5.02-1.859-5.242zm-5.462.248c.642 1.353 1.096 3.256 1.191 5.256h-2.812a6.262 6.262 0 0 1 1.621-5.256zm7.25.006a6.264 6.264 0 0 1 1.558 4.966l.06.284h-2.812c.094-2.001.547-3.904 1.194-5.25z"></path>
                </svg>
                English (IN)
              </span>
              <span className={styles.iconBtn}>₹ INR</span>
            </div>
            <div className={styles.footerSocialIcons}>
              {/* Dummy icons for social media */}
              <div className={styles.socialIcon}>
                <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', height: '18px', width: '18px', fill: 'currentcolor' }}>
                  <path d="M5.5 16H8V8h2.52l.48-3H8V4c0-.52.26-1 1-1h1.5V0H8c-2.5 0-4 1.5-4 4v1H2.5v3H4v8h1.5z"></path>
                </svg>
              </div>
              <div className={styles.socialIcon}>
                <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', height: '18px', width: '18px', fill: 'currentcolor' }}>
                  <path d="M16 3c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4 0 1.6 1.1 2.9 2.6 3.2-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4-.3 0-.5 0-.8 0 1.5 1 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4c.7-.4 1.3-1 1.7-1.6z"></path>
                </svg>
              </div>
              <div className={styles.socialIcon}>
                <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', height: '18px', width: '18px', fill: 'currentcolor' }}>
                  <path d="M8 1.4c2.2 0 2.4 0 3.3.1 1 .1 1.5.2 1.9.4.4.2.7.5.9.9.2.4.4.9.4 1.9.1.9.1 1.1.1 3.3s0 2.4-.1 3.3c-.1 1-.2 1.5-.4 1.9-.2.4-.5.7-.9.9-.4.2-.9.4-1.9.4-.9.1-1.1.1-3.3.1s-2.4 0-3.3-.1c-1-.1-1.5-.2-1.9-.4-.4-.2-.7-.5-.9-.9-.2-.4-.4-.9-.4-1.9C1.4 10.4 1.4 10.2 1.4 8s0-2.4.1-3.3c.1-1 .2-1.5.4-1.9.2-.4.5-.7.9-.9.4-.2.9-.4 1.9-.4.9-.1 1.1-.1 3.3-.1M8 0C5.8 0 5.5 0 4.6.1 3.7.1 3 .3 2.5.5c-.6.2-1.1.6-1.5 1-.4.4-.8.9-1 1.5-.2.5-.4 1.2-.4 2.1C0 5.5 0 5.8 0 8s0 2.5.1 3.4c.1.9.3 1.6.5 2.1.2.6.6 1.1 1 1.5.4.4.9.8 1.5 1 .5.2 1.2.4 2.1.4.9.1 1.2.1 3.4.1s2.5 0 3.4-.1c.9-.1 1.6-.3 2.1-.5.6-.2 1.1-.6 1.5-1 .4-.4.8-.9 1-1.5.2-.5.4-1.2.4-2.1.1-.9.1-1.2.1-3.4s0-2.5-.1-3.4c-.1-.9-.3-1.6-.5-2.1-.2-.6-.6-1.1-1-1.5-.4-.4-.9-.8-1.5-1-.5-.2-1.2-.4-2.1-.4C10.5 0 10.2 0 8 0z"></path>
                  <path d="M8 3.9c-2.3 0-4.1 1.8-4.1 4.1s1.8 4.1 4.1 4.1 4.1-1.8 4.1-4.1-1.8-4.1-4.1-4.1zM8 10.7c-1.5 0-2.7-1.2-2.7-2.7S6.5 5.3 8 5.3s2.7 1.2 2.7 2.7-1.2 2.7-2.7 2.7z"></path>
                  <circle cx="12.3" cy="3.7" r=".9"></circle>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
