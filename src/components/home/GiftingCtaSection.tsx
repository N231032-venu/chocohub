import React from 'react';
import Link from 'next/link';
import { Gift, MessageCircle, Sparkles, Heart } from 'lucide-react';
import { BRAND_PHONE_CLEAN } from '@/lib/utils';

export default function GiftingCtaSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-cocoa-dark via-cocoa to-cocoa-deep text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-truffle/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-[#FFFBF5]/10 backdrop-blur-md rounded-32 p-8 sm:p-12 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/20 text-gold text-xs font-bold uppercase tracking-wider border border-gold/30">
              <Gift className="w-3.5 h-3.5" />
              Festive & Corporate Gifting
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Looking for Custom Gift Boxes & Birthday Favors?
            </h2>
            <p className="text-sm sm:text-base text-card-soft/90 font-light leading-relaxed">
              We handcraft bespoke, personalized chocolate hampers, return gifts for kids' parties, and corporate wellness gift boxes. Custom flavor assortment and handwritten notes available.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
            <a
              href={`https://wa.me/${BRAND_PHONE_CLEAN}?text=${encodeURIComponent('Hi! I am looking for custom Happy Choco gift hampers for an upcoming event.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-soft hover:shadow-soft-lg transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Inquire Custom Gifting</span>
            </a>
            <Link
              href="/products"
              className="px-8 py-4 rounded-full bg-[#FFFBF5] text-cocoa-dark hover:bg-card font-semibold text-sm shadow-md transition-all text-center"
            >
              View Signature Gift Boxes
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
