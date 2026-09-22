'use client';

import React, { useEffect, useState } from 'react';
import { Star, Heart, CheckCircle, Sparkles, MessageSquareQuote } from 'lucide-react';
import { Review } from '@/types';
import { INITIAL_REVIEWS } from '@/lib/seed-data';
import { createClient } from '@/lib/supabase/client';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('is_approved', true)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setReviews(data);
        }
      } catch {
        // use seed reviews
      }
    };

    fetchReviews();
  }, []);

  return (
    <section id="reviews" className="py-20 bg-[#FFFBF5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="px-3 py-1 rounded-full bg-card text-truffle-dark text-xs font-bold uppercase tracking-wider border border-truffle/20">
            Real Reviews From Real Moms
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cocoa-dark">
            Loved By 200+ Bangalore Families
          </h2>
          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="flex items-center text-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-gold" />
              ))}
            </div>
            <span className="text-sm font-bold text-cocoa-dark">4.9 Average Rating</span>
          </div>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.slice(0, 4).map((review) => (
            <div
              key={review.id}
              className="bg-[#FDF0E6] rounded-24 p-6 border border-truffle/15 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1"
            >
              <div className="space-y-3">
                {/* Rating stars & Quote icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gold">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold" />
                    ))}
                  </div>
                  <MessageSquareQuote className="w-5 h-5 text-truffle/40" />
                </div>

                {/* Comment */}
                <p className="text-xs text-cocoa leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>

              {/* Author & Product */}
              <div className="pt-3 border-t border-truffle/15 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-cocoa-dark">
                    {review.customer_name}
                  </span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                {review.product_name && (
                  <p className="text-[10px] text-truffle font-medium truncate">
                    Purchased: {review.product_name}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
