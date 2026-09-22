import React from 'react';
import ProductCatalog from '@/components/home/ProductCatalog';
import UspSection from '@/components/home/UspSection';

export const metadata = {
  title: 'Artisan Chocolates Menu | Happy Choco Bangalore',
  description: 'Explore our full collection of handcrafted dark chocolates, almond rocks, stuffed dates, and festive luxury boxes made with zero refined sugar.',
};

export default function ProductsPage() {
  return (
    <div className="pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cocoa-dark mb-3">
          Our Handcrafted Menu
        </h1>
        <p className="text-sm text-cocoa-muted max-w-xl mx-auto font-light">
          No refined sugar. No preservatives. 70-80% dark single origin cocoa crafted fresh on order in Bangalore.
        </p>
      </div>

      <ProductCatalog />
      <UspSection />
    </div>
  );
}
