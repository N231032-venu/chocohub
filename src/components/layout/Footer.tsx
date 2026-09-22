import React from 'react';
import Link from 'next/link';
import { Heart, Instagram, MessageCircle, Phone, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import { BRAND_PHONE, BRAND_PHONE_CLEAN, BRAND_INSTAGRAM, BRAND_INSTAGRAM_URL } from '@/lib/utils';

export default function Footer() {
  return (
    <footer className="bg-cocoa-dark text-card-soft pt-16 pb-12 border-t border-cocoa-light/20 relative overflow-hidden">
      {/* Subtle background ambient blur */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-truffle/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold text-cocoa-dark flex items-center justify-center font-serif text-lg font-bold">
                H
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Happy Choco
              </span>
            </div>
            <p className="text-sm text-card-soft/80 leading-relaxed font-light">
              Handcrafted with love by a Bangalore mompreneur. 100% homemade artisan chocolates made with 70-80% single-origin dark cocoa and zero refined sugars.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={BRAND_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-cocoa-light/40 flex items-center justify-center text-card-soft hover:text-white hover:bg-cocoa-light transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${BRAND_PHONE_CLEAN}?text=${encodeURIComponent('Hi Happy Choco! 🍫')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-700/60 flex items-center justify-center text-white hover:bg-emerald-600 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-white tracking-wide">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm text-card-soft/80">
              <li>
                <Link href="/products" className="hover:text-gold transition-colors">
                  Artisan Chocolates Catalog
                </Link>
              </li>
              <li>
                <Link href="/#why-us" className="hover:text-gold transition-colors">
                  Why No Refined Sugar?
                </Link>
              </li>
              <li>
                <Link href="/#our-story" className="hover:text-gold transition-colors">
                  Our Bangalore Mom Story
                </Link>
              </li>
              <li>
                <Link href="/#reviews" className="hover:text-gold transition-colors">
                  Customer Reviews (4.9/5)
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-gold transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Values / USPs */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-white tracking-wide">
              Our Promise
            </h3>
            <ul className="space-y-2.5 text-xs text-card-soft/80">
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Zero Refined Sugar (Dates & Raw Honey)</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Zero Preservatives & Additives</span>
              </li>
              <li className="flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>70-80% Single Origin Cocoa</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Small Batch • Fresh on Order in Bangalore</span>
              </li>
            </ul>
          </div>

          {/* Contact & Orders */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-white tracking-wide">
              Direct Orders & Gifting
            </h3>
            <p className="text-xs text-card-soft/80 leading-relaxed">
              For custom hampers, birthday favors, corporate gifting or quick same-day Bangalore delivery, connect on WhatsApp.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-card-soft">
                <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>{BRAND_PHONE}</span>
              </div>
              <div className="flex items-center gap-2 text-card-soft">
                <Instagram className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>{BRAND_INSTAGRAM}</span>
              </div>
              <div className="flex items-center gap-2 text-card-soft">
                <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Bangalore, Karnataka, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-cocoa-light/20 flex flex-col sm:flex-row items-center justify-between text-xs text-card-soft/60 gap-4">
          <p>© {new Date().getFullYear()} Happy Choco Homemade. Handcrafted with love.</p>
          <div className="flex items-center gap-6">
            <span>Domain: happychocohomemade.in</span>
            <Link href="/admin" className="hover:text-gold transition-colors text-[11px] opacity-70 hover:opacity-100">
              Owner Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
