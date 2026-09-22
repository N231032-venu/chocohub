import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import UspSection from '@/components/home/UspSection';
import ProductCatalog from '@/components/home/ProductCatalog';
import StorySection from '@/components/home/StorySection';
import ReviewsSection from '@/components/home/ReviewsSection';
import GiftingCtaSection from '@/components/home/GiftingCtaSection';
import FaqSection from '@/components/home/FaqSection';

export default function HomePage() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <UspSection />
      <ProductCatalog />
      <StorySection />
      <ReviewsSection />
      <GiftingCtaSection />
      <FaqSection />
    </div>
  );
}
