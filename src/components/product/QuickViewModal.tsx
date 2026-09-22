'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Check, Star, ShieldCheck, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/lib/store/cart-store';
import { formatINR } from '@/lib/utils';

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const images = product.images?.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=800'
  ];

  const handleAdd = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-cocoa-dark/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.35 }}
            className="relative w-full max-w-3xl bg-[#FFFBF5] rounded-32 p-6 sm:p-8 shadow-2xl border border-truffle/20 z-10 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-cream-200 text-cocoa transition-colors z-20"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
              {/* Product Gallery */}
              <div className="space-y-3">
                <div className="relative aspect-square w-full rounded-24 overflow-hidden bg-card border border-truffle/15 shadow-inner">
                  <Image
                    src={images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  {product.is_bestseller && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gold text-cocoa-dark font-bold text-xs uppercase shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-cocoa-dark" />
                      Mom's Favorite
                    </span>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="flex gap-2 justify-center">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                          selectedImage === idx ? 'border-cocoa-dark scale-105' : 'border-truffle/20 opacity-70'
                        }`}
                      >
                        <Image src={img} alt="" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-truffle">
                      {product.category}
                    </span>
                    <span className="text-truffle">•</span>
                    <span className="text-xs font-medium text-truffle">{product.weight}</span>
                  </div>

                  <h2 className="font-serif text-2xl font-bold text-cocoa-dark">
                    {product.name}
                  </h2>

                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center text-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-gold" />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-cocoa">4.9/5 from 200+ moms</span>
                  </div>
                </div>

                <p className="text-sm text-cocoa-muted leading-relaxed">
                  {product.description}
                </p>

                {/* Ingredients Pill Tag */}
                {product.ingredients?.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-xs font-semibold text-cocoa-dark uppercase tracking-wider block">
                      Artisan Ingredients:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.ingredients.map((ing, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-full bg-card text-cocoa text-[11px] font-medium border border-truffle/15"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing & Add to Cart Controls */}
                <div className="pt-4 border-t border-truffle/15 space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-bold text-cocoa-dark">
                      {formatINR(product.price * quantity)}
                    </span>
                    <span className="text-xs text-truffle">
                      ({formatINR(product.price)} each • Fresh on order)
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Quantity */}
                    <div className="flex items-center border border-truffle/30 rounded-full bg-cream-50 px-2 py-1.5 shadow-inner">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-2 text-cocoa hover:text-cocoa-dark font-bold"
                        aria-label="Decrease"
                      >
                        -
                      </button>
                      <span className="px-3 text-sm font-bold text-cocoa-dark">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-2 text-cocoa hover:text-cocoa-dark font-bold"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>

                    {/* Add button */}
                    <button
                      onClick={handleAdd}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full font-semibold text-sm shadow-md transition-all ${
                        isAdded
                          ? 'bg-emerald-700 text-white'
                          : 'bg-cocoa-dark text-[#FDF0E6] hover:bg-cocoa'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Box</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-xs text-truffle pt-1">
                    <Link
                      href={`/products/${product.id}`}
                      onClick={onClose}
                      className="text-cocoa-dark font-semibold hover:underline flex items-center gap-1"
                    >
                      View Full Details <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="flex items-center gap-1 text-emerald-800 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" /> Made fresh on order
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
