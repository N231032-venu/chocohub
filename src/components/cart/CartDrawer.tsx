'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Truck } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { formatINR, getWhatsAppOrderUrl } from '@/lib/utils';

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    getTotalAmount,
    getTotalItems,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalAmount = getTotalAmount();
  const totalItems = getTotalItems();
  const freeShippingThreshold = 799;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - totalAmount);
  const freeShippingPercentage = Math.min(100, (totalAmount / freeShippingThreshold) * 100);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-cocoa-dark/60 backdrop-blur-sm z-50"
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 max-w-md w-full bg-cream-100 shadow-2xl z-50 flex flex-col justify-between border-l border-truffle/20"
          >
            {/* Header */}
            <div className="p-5 border-b border-truffle/15 flex items-center justify-between bg-[#FFFBF5]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-card text-cocoa-dark">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-cocoa-dark">
                    Your Fresh Cart
                  </h2>
                  <p className="text-xs text-truffle font-medium">
                    {totalItems} handcrafted {totalItems === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeDrawer}
                className="p-2 rounded-full hover:bg-cream-200 text-cocoa transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="bg-cream-200/60 px-5 py-3 border-b border-truffle/10">
              <div className="flex items-center justify-between text-xs font-medium text-cocoa mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-truffle-dark" />
                  {freeShippingRemaining === 0 ? (
                    <span className="text-emerald-800 font-semibold flex items-center gap-1">
                      🎉 Free Bangalore Delivery unlocked!
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-cocoa-dark">{formatINR(freeShippingRemaining)}</strong> more for FREE Bangalore Delivery
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-semibold text-truffle-dark">
                  {Math.round(freeShippingPercentage)}%
                </span>
              </div>
              <div className="w-full bg-truffle/20 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-cocoa-dark h-full rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingPercentage}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center text-truffle">
                    <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-serif text-lg font-bold text-cocoa-dark">
                      Your chocolate box is empty
                    </p>
                    <p className="text-xs text-truffle max-w-xs">
                      Treat yourself or your loved ones to fresh, preservative-free artisanal chocolates!
                    </p>
                  </div>
                  <button
                    onClick={closeDrawer}
                    className="px-6 py-2.5 rounded-full bg-cocoa-dark text-[#FDF0E6] text-xs font-semibold hover:bg-cocoa transition-colors shadow-md"
                  >
                    Explore Artisan Menu
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3.5 p-3 rounded-24 bg-[#FFFBF5] border border-truffle/15 shadow-sm hover:shadow-soft transition-all"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-card shrink-0">
                      <Image
                        src={item.product.images[0] || 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=600'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-serif text-sm font-semibold text-cocoa-dark truncate">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-truffle hover:text-red-600 p-1 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-truffle font-medium">
                          {item.product.weight}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-truffle/30 rounded-full bg-cream-50 px-1 py-0.5 shadow-inner">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-cream-200 rounded-full text-cocoa transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold px-2 text-cocoa-dark min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-cream-200 rounded-full text-cocoa transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="font-serif text-sm font-bold text-cocoa-dark">
                            {formatINR(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-5 border-t border-truffle/15 bg-[#FFFBF5] space-y-3">
                <div className="space-y-1.5 text-xs text-truffle-dark">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-cocoa-dark">{formatINR(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span>{freeShippingRemaining === 0 ? <strong className="text-emerald-800">FREE</strong> : 'Calculated at checkout'}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-truffle/10 font-bold text-cocoa-dark">
                    <span>Total</span>
                    <span className="font-serif text-base">{formatINR(totalAmount)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Link
                    href="/checkout"
                    onClick={closeDrawer}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-cocoa-dark text-[#FDF0E6] hover:bg-cocoa font-semibold text-sm shadow-md transition-all group"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <p className="text-[11px] text-center text-truffle flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3 text-gold" />
                    100% Homemade fresh on order in Bangalore
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
