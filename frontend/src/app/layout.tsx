import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Airbnb Clone — Find unique places to stay',
  description: 'Find and book unique accommodations across India and the world. From beachfront villas to mountain cabins — your next adventure awaits.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '12px',
                background: '#222222',
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                padding: '12px 20px',
              },
            }}
          />
          <Navbar />
          <main style={{ minHeight: '100vh', paddingTop: '0' }}>
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
