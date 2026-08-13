import Link from 'next/link';

export default function InfoPage() {
  return (
    <div className="container" style={{ padding: '120px 0', textAlign: 'center', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>Coming Soon</h1>
      <p style={{ color: 'var(--text-light)', marginBottom: '32px' }}>
        This page is a placeholder for the Airbnb Clone. Actual functionality or content will be added here in the future.
      </p>
      <Link href="/" className="btn btn-primary">
        Return Home
      </Link>
    </div>
  );
}
