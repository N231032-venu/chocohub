'use client';

import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter } from 'lucide-react';
import { Product } from '@/types';
import { INITIAL_PRODUCTS } from '@/lib/seed-data';
import ProductCard from '@/components/product/ProductCard';
import { createClient } from '@/lib/supabase/client';

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Fetch live products from Supabase if available
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('is_bestseller', { ascending: false });

        if (!error && data && data.length > 0) {
          setProducts(data);
        }
      } catch {
        // Use seed data
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ['All', 'Dark Chocolates', 'Nut Loaded', 'Sugar-Free', 'Gift Boxes'];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.ingredients?.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="products" className="py-16 sm:py-24 bg-[#FFFBF5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-xl">
            <span className="px-3 py-1 rounded-full bg-card text-truffle-dark text-xs font-bold uppercase tracking-wider border border-truffle/20">
              Artisan Small-Batch Collection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cocoa-dark">
              Handcrafted Chocolates Menu
            </h2>
            <p className="text-sm text-cocoa-muted font-light leading-relaxed">
              Every single bar and truffle is made fresh upon receiving your order, ensuring peak flavor, texture, and aroma.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-truffle" />
            <input
              type="text"
              placeholder="Search almonds, dates, 75% dark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-cream-100 border border-truffle/20 text-xs text-cocoa-dark placeholder:text-truffle/70 focus:outline-none focus:ring-2 focus:ring-cocoa-dark/20 shadow-sm"
            />
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                selectedCategory === cat
                  ? 'bg-cocoa-dark text-[#FDF0E6] border-cocoa-dark shadow-md'
                  : 'bg-card text-cocoa hover:bg-cream-200 border-truffle/15'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-card/40 rounded-32 border border-truffle/15 p-8">
            <Sparkles className="w-10 h-10 text-truffle mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-cocoa-dark">No Chocolates Found</h3>
            <p className="text-xs text-cocoa-muted mt-1 max-w-sm mx-auto">
              We couldn't find any chocolates matching your search or category filter. Try selecting another filter!
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-6 py-2 rounded-full bg-cocoa-dark text-[#FDF0E6] text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
