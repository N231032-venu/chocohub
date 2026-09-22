'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Star, MapPin, Sparkles, ArrowRight, Clock, Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatINR, formatDate } from '@/lib/utils';
import { Order } from '@/types';

export default function AccountOverviewPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Valued Customer');

  useEffect(() => {
    const loadAccountData = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setUserName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Customer');

          const { data: userOrders } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

          if (userOrders) {
            setOrders(userOrders);
          }
        }
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    };

    loadAccountData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#FDF0E6] rounded-32 p-6 sm:p-8 border border-truffle/15 shadow-soft relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <span className="px-3 py-1 rounded-full bg-cream-100 text-truffle-dark text-[11px] font-bold uppercase tracking-wider border border-truffle/20">
            Member Area
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cocoa-dark">
            Hello, {userName}! 🍫
          </h1>
          <p className="text-xs sm:text-sm text-cocoa-muted max-w-xl font-light leading-relaxed">
            Welcome to your Happy Choco artisan lounge. Track your fresh Bangalore kitchen batches, manage delivery addresses, and leave reviews for your favorite treats.
          </p>
        </div>

        {/* Floating background glow */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Quick KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FDF0E6] rounded-24 p-5 border border-truffle/15 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-truffle">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-cocoa-dark" />
          </div>
          <p className="font-serif text-2xl font-bold text-cocoa-dark">{orders.length}</p>
          <span className="text-[10px] text-truffle">Handcrafted batches</span>
        </div>

        <div className="bg-[#FDF0E6] rounded-24 p-5 border border-truffle/15 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-truffle">
            <span className="text-xs font-bold uppercase tracking-wider">Sugar-Free Savings</span>
            <Sparkles className="w-4 h-4 text-gold" />
          </div>
          <p className="font-serif text-2xl font-bold text-cocoa-dark">100%</p>
          <span className="text-[10px] text-emerald-800 font-semibold">Zero refined sugar consumed</span>
        </div>

        <div className="bg-[#FDF0E6] rounded-24 p-5 border border-truffle/15 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-truffle">
            <span className="text-xs font-bold uppercase tracking-wider">Origin</span>
            <Heart className="w-4 h-4 text-red-500" />
          </div>
          <p className="font-serif text-lg font-bold text-cocoa-dark">Bangalore</p>
          <span className="text-[10px] text-truffle">Fresh small-batch craft</span>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-[#FDF0E6] rounded-32 p-6 sm:p-8 border border-truffle/15 shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-truffle/15">
          <h2 className="font-serif text-lg font-bold text-cocoa-dark">
            Recent Orders
          </h2>
          <Link
            href="/account/orders"
            className="text-xs font-bold text-cocoa-dark hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center text-truffle mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <p className="text-xs text-cocoa-muted">No orders placed yet.</p>
            <Link
              href="/products"
              className="inline-block px-5 py-2 rounded-full bg-cocoa-dark text-[#FDF0E6] text-xs font-semibold"
            >
              Order Artisan Chocolates
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="bg-[#FFFBF5] rounded-24 p-4 border border-truffle/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cocoa-dark">
                      #{order.id.slice(0, 8)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-truffle mt-1">
                    {formatDate(order.created_at)} • {order.items?.length || 1} items
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="font-serif text-sm font-bold text-cocoa-dark">
                    {formatINR(order.total_amount)}
                  </span>
                  <Link
                    href="/account/orders"
                    className="px-3.5 py-1.5 rounded-full bg-card hover:bg-cream-200 text-cocoa-dark text-xs font-semibold border border-truffle/20 transition-colors"
                  >
                    Track Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
