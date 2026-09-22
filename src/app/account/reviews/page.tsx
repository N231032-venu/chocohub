'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Check, Sparkles, Plus, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Review, Product } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '@/lib/seed-data';

export default function AccountReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState(INITIAL_PRODUCTS[0]?.id || '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setReviewerName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Mom Reviewer');

          const { data: userReviews } = await supabase
            .from('reviews')
            .select('*')
            .eq('user_id', session.user.id);

          if (userReviews && userReviews.length > 0) {
            setReviews(userReviews);
          }
        }
      } catch {
        // fallback
      }
    };

    fetchUserData();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    const selectedProd = products.find((p) => p.id === selectedProductId);

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      customer_name: reviewerName || 'Happy Mom',
      product_id: selectedProductId,
      product_name: selectedProd?.name,
      rating,
      comment,
      is_approved: false, // Owner moderates it in /admin
      created_at: new Date().toISOString(),
    };

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      await supabase.from('reviews').insert({
        user_id: session?.user?.id || null,
        customer_name: reviewerName || 'Customer',
        product_id: selectedProductId,
        rating,
        comment,
        is_approved: false,
      });

      setReviews([newReview, ...reviews]);
      setSuccessMsg('Thank you! Your 5-star review has been submitted for moderation and will appear once approved by the owner.');
      setIsSubmitting(false);
      setComment('');
    } catch {
      setReviews([newReview, ...reviews]);
      setSuccessMsg('Review received! Thank you for supporting our homemade chocolates.');
      setIsSubmitting(false);
      setComment('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FDF0E6] rounded-32 p-6 sm:p-8 border border-truffle/15 shadow-soft space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-truffle/15">
        <div>
          <h1 className="font-serif text-2xl font-bold text-cocoa-dark">
            My Reviews & Ratings
          </h1>
          <p className="text-xs text-truffle mt-0.5">
            Share your feedback on our wholesome chocolate creations
          </p>
        </div>

        {!isSubmitting && (
          <button
            onClick={() => setIsSubmitting(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-cocoa-dark text-[#FDF0E6] hover:bg-cocoa text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Write a Review</span>
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-xs text-emerald-800 font-medium flex items-start gap-2">
          <Check className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {isSubmitting && (
        <form
          onSubmit={handleSubmitReview}
          className="bg-[#FFFBF5] rounded-28 p-6 border border-truffle/20 shadow-sm space-y-4"
        >
          <h3 className="font-serif text-base font-bold text-cocoa-dark">
            Write a Homemade Chocolate Review
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                Select Chocolate
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-card border border-truffle/25 text-xs text-cocoa-dark font-medium"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.weight})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider block">
                Your Star Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'fill-gold text-gold'
                          : 'text-truffle/30'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-cocoa-dark ml-2">
                  {rating} out of 5 stars
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                Your Review & Experience *
              </label>
              <textarea
                required
                rows={3}
                placeholder="What did you and your family love about the taste, texture, and sweetness?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-card border border-truffle/25 text-xs text-cocoa-dark placeholder:text-truffle/60 focus:outline-none focus:ring-2 focus:ring-cocoa-dark/20"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setIsSubmitting(false)}
              className="px-4 py-2 rounded-full bg-cream-200 text-cocoa-dark text-xs font-semibold hover:bg-cream-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-full bg-cocoa-dark text-[#FDF0E6] text-xs font-semibold hover:bg-cocoa shadow-sm disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-[#FFFBF5] rounded-24 p-5 border border-truffle/15 shadow-sm space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gold">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-gold" />
                ))}
              </div>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                  rev.is_approved
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                {rev.is_approved ? 'Approved & Public' : 'Pending Approval'}
              </span>
            </div>

            <p className="text-xs text-cocoa leading-relaxed italic">
              "{rev.comment}"
            </p>

            <div className="text-[10px] text-truffle pt-1 border-t border-truffle/10 flex justify-between">
              <span>{rev.customer_name}</span>
              <span>{rev.product_name || 'Artisan Chocolate'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
