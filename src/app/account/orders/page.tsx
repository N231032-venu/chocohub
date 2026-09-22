'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  MessageCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatINR, formatDate, BRAND_PHONE_CLEAN } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

          if (!error && data) {
            setOrders(data);
          }
        }
      } catch {
        // offline
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
        return 1;
      case 'preparing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 1;
    }
  };

  const steps = [
    { label: 'Confirmed', icon: CheckCircle2 },
    { label: 'Fresh Preparing', icon: Clock },
    { label: 'Dispatched', icon: Truck },
    { label: 'Delivered', icon: Package },
  ];

  return (
    <div className="bg-[#FDF0E6] rounded-32 p-6 sm:p-8 border border-truffle/15 shadow-soft space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-truffle/15">
        <div>
          <h1 className="font-serif text-2xl font-bold text-cocoa-dark">
            My Orders & Tracking
          </h1>
          <p className="text-xs text-truffle mt-0.5">
            Live status of your fresh Bangalore handcrafted batches
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center text-truffle mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-cocoa-dark">
              No orders found
            </h3>
            <p className="text-xs text-cocoa-muted max-w-sm mx-auto">
              You haven't placed any orders with this account yet.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-block px-6 py-2.5 rounded-full bg-cocoa-dark text-[#FDF0E6] text-xs font-semibold hover:bg-cocoa shadow-md transition-colors"
          >
            Explore Artisan Chocolates
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStep = getStatusStep(order.status);

            const whatsappMessage = `Hi Happy Choco! 🍫 Inquiring about my Order #${order.id.slice(0, 8)}. Could you share the latest delivery status?`;
            const whatsappUrl = `https://wa.me/${BRAND_PHONE_CLEAN}?text=${encodeURIComponent(whatsappMessage)}`;

            return (
              <div
                key={order.id}
                className="bg-[#FFFBF5] rounded-28 p-5 sm:p-6 border border-truffle/15 shadow-sm space-y-6"
              >
                {/* Top order bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-truffle/15">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-cocoa-dark">
                        Order #{order.id.slice(0, 8)}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-truffle">
                      Placed on {formatDate(order.created_at)}
                    </p>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div>
                      <span className="text-[10px] text-truffle block uppercase font-bold">Total</span>
                      <span className="font-serif text-base font-bold text-cocoa-dark">
                        {formatINR(order.total_amount)}
                      </span>
                    </div>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full bg-emerald-700/10 hover:bg-emerald-700/20 text-emerald-800 border border-emerald-700/30 text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                      title="WhatsApp Kitchen Update"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-emerald-700" />
                      <span>WhatsApp Update</span>
                    </a>
                  </div>
                </div>

                {/* Tracking Step Timeline */}
                <div className="py-2">
                  <div className="grid grid-cols-4 gap-2 relative">
                    {/* Connecting Bar */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-truffle/20 -translate-y-1/2 z-0" />
                    <div
                      className="absolute top-1/2 left-0 h-1 bg-emerald-700 -translate-y-1/2 z-0 transition-all duration-500"
                      style={{
                        width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                      }}
                    />

                    {steps.map((step, idx) => {
                      const StepIcon = step.icon;
                      const isCompleted = idx + 1 <= currentStep;
                      const isCurrent = idx + 1 === currentStep;

                      return (
                        <div
                          key={idx}
                          className="flex flex-col items-center text-center relative z-10 space-y-1.5"
                        >
                          <div
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                              isCompleted
                                ? 'bg-emerald-700 text-white shadow-md'
                                : 'bg-[#FFFBF5] text-truffle border-2 border-truffle/30'
                            } ${isCurrent ? 'ring-4 ring-emerald-700/20' : ''}`}
                          >
                            <StepIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <span
                            className={`text-[10px] sm:text-xs font-semibold ${
                              isCompleted ? 'text-cocoa-dark' : 'text-truffle'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items in order */}
                <div className="pt-2 space-y-2 border-t border-truffle/10">
                  <span className="text-[11px] font-bold text-cocoa-dark uppercase tracking-wider block">
                    Ordered Items:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {order.items?.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-card border border-truffle/10"
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-cream-100 relative shrink-0">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          ) : (
                            <ShoppingBag className="w-5 h-5 text-truffle m-auto" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-cocoa-dark truncate">{item.name}</p>
                          <p className="text-[10px] text-truffle">{item.weight} • Qty: {item.quantity}</p>
                        </div>
                        <span className="text-xs font-semibold text-cocoa-dark">
                          {formatINR(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="text-[11px] text-cocoa-muted pt-2 border-t border-truffle/10 flex items-start gap-2">
                  <Truck className="w-3.5 h-3.5 text-truffle-dark shrink-0 mt-0.5" />
                  <span>
                    <strong>Delivery to:</strong> {order.customer_name}, {order.address}, {order.city} ({order.pincode}) • Phone: {order.phone}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
