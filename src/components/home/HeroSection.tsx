'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Sparkles, MessageCircle, ArrowRight, ShieldCheck, Heart, Award } from 'lucide-react';
import { BRAND_PHONE_CLEAN, formatINR } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cart-store';
import { INITIAL_PRODUCTS } from '@/lib/seed-data';

export default function HeroSection() {
  const { addItem } = useCartStore();
  const heroProduct = INITIAL_PRODUCTS[1] || INITIAL_PRODUCTS[0]; // Roasted Almond Sea Salt Truffle

  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:pt-12 lg:pb-24">
      {/* Warm background ambient glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-card/60 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-truffle-sand/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left"
          >
            {/* Top Bangalore Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-truffle/20 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span className="text-xs font-semibold tracking-wide text-cocoa-dark">
                Freshly made in small batches in Bangalore
              </span>
            </div>

            {/* H1 Headline */}
            <div className="space-y-3">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-cocoa-dark leading-[1.12]">
                Handcrafted Healthy Chocolates, <br />
                <span className="italic font-normal text-truffle-dark">Made With Love.</span>
              </h1>
              <p className="text-base sm:text-lg text-cocoa-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                Indulge guilt-free in rich 70–80% single-origin dark chocolates made with zero refined sugar, zero preservatives, and 100% natural wholesome ingredients. Handcrafted fresh on every order by a Bangalore mom.
              </p>
            </div>

            {/* 2 Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/products"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-cta text-[#FDF0E6] hover:bg-cta-hover font-semibold text-sm shadow-soft hover:shadow-soft-lg transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <span>Shop Artisan Chocolates</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={`https://wa.me/${BRAND_PHONE_CLEAN}?text=${encodeURIComponent('Hi Happy Choco! 🍫 I would like to order fresh healthy chocolates.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-emerald-700/15 text-emerald-900 hover:bg-emerald-700/25 border border-emerald-700/30 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700 fill-emerald-700" />
                <span>Order on WhatsApp</span>
              </a>
            </div>

            {/* Social Proof & Trust Badges */}
            <div className="pt-6 border-t border-truffle/15 flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8">
              {/* Star Rating Badge */}
              <div className="flex items-center gap-3">
                <div className="flex items-center text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-cocoa-dark block leading-none">4.9 / 5</span>
                  <span className="text-[11px] text-truffle font-medium">from 200+ Bangalore moms</span>
                </div>
              </div>

              {/* Quality Seal */}
              <div className="flex items-center gap-2 text-cocoa-dark">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span className="text-xs font-semibold">100% No Refined Sugar</span>
              </div>

              <div className="flex items-center gap-2 text-cocoa-dark">
                <Heart className="w-5 h-5 text-truffle-dark" />
                <span className="text-xs font-semibold">Preservative Free</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Premium Showcase 3D Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            {/* Card Frame with 24px Rounded Corners and Luxury Drop Shadow */}
            <div className="relative bg-[#FDF0E6] rounded-32 p-6 sm:p-7 border border-truffle/20 shadow-soft-xl hover:shadow-2xl transition-all duration-300">
              {/* Top Showcase Floating Tags */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-800 text-white font-bold text-[11px] tracking-wide uppercase shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-gold" />
                  No Refined Sugar
                </span>
                <span className="px-3 py-1 rounded-full bg-cocoa-dark text-[#FDF0E6] font-medium text-[11px] shadow-sm">
                  Made Fresh Today • {heroProduct.weight}
                </span>
              </div>

              {/* Product Visual */}
              <div className="relative aspect-[4/3] w-full rounded-24 overflow-hidden bg-cream-100 shadow-inner mb-5">
                <Image
                  src={heroProduct.images[0]}
                  alt={heroProduct.name}
                  fill
                  priority
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 450px"
                />

                <div className="absolute bottom-3 left-3 bg-[#FFFBF5]/90 backdrop-blur-md px-3 py-1 rounded-full border border-truffle/20 text-xs font-bold text-cocoa-dark shadow-sm">
                  ✨ 70% Dark Cocoa • Roasted Almonds
                </div>
              </div>

              {/* Product Summary */}
              <div className="space-y-2 mb-5">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-cocoa-dark">
                    {heroProduct.name}
                  </h3>
                  <span className="font-serif text-xl font-bold text-cocoa-dark">
                    {formatINR(heroProduct.price)}
                  </span>
                </div>
                <p className="text-xs text-cocoa-muted line-clamp-2 leading-relaxed font-light">
                  {heroProduct.description}
                </p>
              </div>

              {/* Quick Add Button */}
              <button
                onClick={() => addItem(heroProduct, 1)}
                className="w-full py-3.5 px-6 rounded-full bg-cocoa-dark text-[#FDF0E6] hover:bg-cocoa font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
              >
                <span>Add Fresh Box to Cart</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Floating Decorative Badges */}
            <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-[#FFFBF5] rounded-2xl p-3.5 border border-truffle/20 shadow-soft-lg items-center gap-3 animate-float">
              <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-gold">
                <Award className="w-5 h-5 fill-gold" />
              </div>
              <div>
                <p className="text-xs font-bold text-cocoa-dark">Mom's Clean Promise</p>
                <p className="text-[10px] text-truffle">Dates & Raw Honey Sweetened</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
