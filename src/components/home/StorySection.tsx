import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Sparkles, CheckCircle2, MessageCircle } from 'lucide-react';
import { BRAND_PHONE_CLEAN } from '@/lib/utils';

export default function StorySection() {
  return (
    <section id="our-story" className="py-20 bg-card relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mompreneur Visual Story Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] w-full rounded-32 overflow-hidden bg-cream-100 shadow-soft-xl border border-truffle/20">
              <Image
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000&auto=format&fit=crop"
                alt="Bangalore Mom Crafting Chocolates in Home Kitchen"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 500px"
              />

              {/* Gradient overlay for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa-dark/80 via-transparent to-transparent" />

              {/* Floating Quote Card */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-24 bg-[#FFFBF5]/95 backdrop-blur-md border border-truffle/20 shadow-md">
                <p className="font-serif italic text-xs sm:text-sm text-cocoa-dark leading-relaxed">
                  "As a mother, I refused to feed my children chemicals and white sugar disguised as chocolate. Happy Choco was born right at my dining table in Bangalore."
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-cocoa-dark">Founder & Mompreneur</span>
                  <span className="text-[10px] text-truffle font-medium">Happy Choco Bangalore</span>
                </div>
              </div>
            </div>

            {/* Decorative accent element */}
            <div className="hidden sm:block absolute -top-4 -right-4 bg-[#FFFBF5] rounded-full p-4 border border-truffle/20 shadow-soft">
              <Heart className="w-6 h-6 text-red-600 fill-red-500" />
            </div>
          </div>

          {/* Right Column: Story & Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-cream-100 text-truffle-dark text-xs font-bold uppercase tracking-wider border border-truffle/20">
                Our Origin Story
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cocoa-dark leading-tight">
                From a Bangalore Mom's Kitchen <br />
                <span className="italic font-normal text-truffle-dark">To 200+ Happy Families.</span>
              </h2>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-cocoa-muted font-light leading-relaxed">
              <p>
                Like most parents, I noticed how grocery store chocolates were loaded with 50%+ refined white sugar, cheap palm oil, and synthetic artificial flavors. When my kids asked for treats, I wanted something nourishing, pure, and deeply chocolatey.
              </p>
              <p>
                I began experimenting with single-origin raw cocoa, Arabian Medjool dates, organic raw honey, and whole roasted nuts in small batches. What started as guilt-free treats for my family quickly spread through neighborhood moms, school birthday parties, and festive celebrations.
              </p>
            </div>

            {/* Value checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-cocoa-dark font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Zero palm oil or artificial waxes</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-cocoa-dark font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Stone-ground in micro batches</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-cocoa-dark font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Kid-friendly & diabetic friendly options</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-cocoa-dark font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Hand-packed in eco-luxury boxes</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="px-7 py-3.5 rounded-full bg-cocoa-dark text-[#FDF0E6] hover:bg-cocoa font-semibold text-xs sm:text-sm shadow-md transition-all"
              >
                Taste the Difference
              </Link>
              <a
                href={`https://wa.me/${BRAND_PHONE_CLEAN}?text=${encodeURIComponent('Hi! I would love to know more about how you handcraft your chocolates!')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-cream-100 hover:bg-cream-200 text-cocoa-dark border border-truffle/20 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>Chat with the Maker</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
