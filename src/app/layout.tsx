import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';

export const metadata: Metadata = {
  title: 'Happy Choco Homemade | Handcrafted Healthy Chocolates Bangalore',
  description:
    'Artisanal homemade dark chocolates crafted with 70-80% premium cocoa and zero refined sugar. 100% natural, preservative-free, handcrafted fresh on order in Bangalore by a mompreneur.',
  keywords: [
    'healthy chocolate',
    'homemade chocolate bangalore',
    'sugar free chocolate',
    'dark chocolate dates',
    'mom made chocolates',
    'healthy gifting bangalore',
  ],
  authors: [{ name: 'Happy Choco Homemade' }],
  openGraph: {
    title: 'Happy Choco Homemade - Guilt-Free Artisan Chocolates',
    description: 'No Refined Sugar. No Preservatives. 100% Homemade fresh on order in Bangalore.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased selection:bg-truffle/20 selection:text-cocoa-dark">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
