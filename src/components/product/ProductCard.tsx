'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Eye, Star, Sparkles, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/lib/store/cart-store';
import { formatINR } from '@/lib/utils';
import QuickViewModal from './QuickViewModal';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const imageSrc = product.images?.[0] || 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=600';

  return (
    <>
      <div className="group relative bg-[#FDF0E6] rounded-24 p-4 sm:p-5 border border-truffle/15 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
        {/* Top Badges */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-cream-100 mb-4">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {product.is_bestseller && (
              <span className="px-2.5 py-1 rounded-full bg-gold text-cocoa-dark font-bold text-[10px] tracking-wide uppercase shadow-sm flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 fill-cocoa-dark" />
                Bestseller
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-cocoa-dark/80 backdrop-blur-md text-white font-medium text-[10px] shadow-sm">
              {product.weight}
            </span>
          </div>

          {/* Quick View Button on Hover */}
          <button
            onClick={() => setQuickViewOpen(true)}
            className="absolute bottom-2.5 right-2.5 p-2.5 rounded-full bg-[#FFFBF5]/90 backdrop-blur-md text-cocoa-dark shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-white"
            title="Quick View"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-truffle">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-[11px] font-medium text-cocoa-dark">
                <Star className="w-3 h-3 fill-gold text-gold" />
                <span>4.9</span>
              </div>
            </div>

            <Link href={`/products/${product.id}`} className="group-hover:text-truffle-dark transition-colors">
              <h3 className="font-serif text-base sm:text-lg font-bold text-cocoa-dark leading-snug line-clamp-1">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs text-cocoa-muted line-clamp-2 mt-1.5 mb-4 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price & Add to Cart */}
          <div className="pt-3 border-t border-truffle/15 flex items-center justify-between mt-auto">
            <div>
              <span className="text-[10px] text-truffle font-medium block">Price</span>
              <span className="font-serif text-lg font-bold text-cocoa-dark">
                {formatINR(product.price)}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 ${
                addedAnimation
                  ? 'bg-emerald-700 text-white'
                  : 'bg-cocoa-dark text-[#FDF0E6] hover:bg-cocoa hover:shadow-md'
              }`}
              aria-label="Add to cart"
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Box</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewOpen && (
        <QuickViewModal
          product={product}
          isOpen={quickViewOpen}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  );
}
