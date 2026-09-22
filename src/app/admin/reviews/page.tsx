'use client';

import React, { useState, useEffect } from 'react';
import { Star, Check, Trash2, ShieldCheck, RefreshCw, MessageSquare } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import { Review } from '@/types';
import { INITIAL_REVIEWS } from '@/lib/seed-data';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setReviews(data);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const supabase = createClient();
      await supabase
        .from('reviews')
        .update({ is_approved: true })
        .eq('id', id);

      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_approved: true } : r))
      );
    } catch {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_approved: true } : r))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this review?')) return;

    try {
      const supabase = createClient();
      await supabase.from('reviews').delete().eq('id', id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'pending') return !r.is_approved;
    if (filter === 'approved') return r.is_approved;
    return true;
  });

  return (
    <div className="bg-[#FDF0E6] rounded-32 p-6 sm:p-8 border border-truffle/15 shadow-soft space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-truffle/15">
        <div>
          <h1 className="font-serif text-2xl font-bold text-cocoa-dark">
            Reviews Moderation Queue
          </h1>
          <p className="text-xs text-truffle mt-0.5">
            Approve genuine mom customer reviews to display on product pages & homepage
          </p>
        </div>

        <button
          onClick={fetchReviews}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-full bg-cream-100 hover:bg-cream-200 text-cocoa-dark border border-truffle/20 text-xs font-semibold transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filter === 'all'
              ? 'bg-cocoa-dark text-[#FDF0E6]'
              : 'bg-card text-cocoa hover:bg-cream-200 border border-truffle/15'
          }`}
        >
          All ({reviews.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filter === 'pending'
              ? 'bg-amber-800 text-white'
              : 'bg-card text-cocoa hover:bg-cream-200 border border-truffle/15'
          }`}
        >
          Pending ({reviews.filter((r) => !r.is_approved).length})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filter === 'approved'
              ? 'bg-emerald-800 text-white'
              : 'bg-card text-cocoa hover:bg-cream-200 border border-truffle/15'
          }`}
        >
          Approved ({reviews.filter((r) => r.is_approved).length})
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 text-xs text-cocoa-muted">
            No reviews matching the selected filter.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FFFBF5] rounded-24 p-5 sm:p-6 border border-truffle/15 shadow-sm space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-gold">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold" />
                    ))}
                  </div>
                  <span className="font-serif text-sm font-bold text-cocoa-dark">
                    {rev.customer_name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      rev.is_approved
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                  >
                    {rev.is_approved ? 'Approved' : 'Pending'}
                  </span>

                  {!rev.is_approved && (
                    <button
                      onClick={() => handleApprove(rev.id)}
                      className="px-3 py-1 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm flex items-center gap-1 transition-colors"
                    >
                      <Check className="w-3 h-3" />
                      <span>Approve</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-cocoa leading-relaxed italic bg-card/60 p-3.5 rounded-xl border border-truffle/10">
                "{rev.comment}"
              </p>

              <div className="text-[11px] text-truffle flex justify-between pt-1">
                <span>{rev.product_name || 'Artisan Recipe'}</span>
                <span>{rev.created_at ? formatDate(rev.created_at) : 'Recent'}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
