'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { CheckCircle2, Sparkles, MessageCircle, ArrowRight, ShieldCheck, Clock, MapPin, Package } from 'lucide-react';
import { BRAND_PHONE_CLEAN, formatINR } from '@/lib/utils';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || `HC-${Date.now().toString().slice(-6)}`;
  const customerName = searchParams.get('name') || 'Chocolate Lover';
  const total = Number(searchParams.get('total')) || 0;
  const paymentMethod = searchParams.get('method') || 'upi';

  useEffect(() => {
    // Fire festive celebration confetti
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#D4AF37', '#8B6A5C', '#3D2218', '#EBDCCE'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#D4AF37', '#8B6A5C', '#3D2218', '#EBDCCE'],
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const whatsappMessage = `Hi Happy Choco! 🍫 I just placed an order on your website!\n\n` +
    `*Order ID:* ${orderId}\n` +
    `*Customer:* ${customerName}\n` +
    `*Total:* ₹${total}\n` +
    `*Payment:* ${paymentMethod.toUpperCase()}\n\n` +
    `Please confirm the order and let me know the preparation timeline. Thank you!`;

  const whatsappUrl = `https://wa.me/${BRAND_PHONE_CLEAN}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="py-12 sm:py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#FDF0E6] rounded-32 p-8 sm:p-12 border border-truffle/20 shadow-soft-xl text-center space-y-8">
        {/* Checkmark Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-700/10 text-emerald-800 flex items-center justify-center mx-auto border-2 border-emerald-700/20 shadow-sm animate-bounce">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-emerald-800/10 text-emerald-900 text-xs font-bold uppercase tracking-wider">
            Order Successfully Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cocoa-dark">
            Thank You, {customerName}!
          </h1>
          <p className="text-sm text-cocoa-muted max-w-md mx-auto font-light leading-relaxed">
            Your fresh batch of handcrafted healthy chocolates will soon be prepared in our Bangalore kitchen with pure love and zero refined sugar.
          </p>
        </div>

        {/* Order Details Badge Card */}
        <div className="bg-[#FFFBF5] rounded-24 p-6 border border-truffle/15 text-left space-y-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-truffle/15">
            <div>
              <span className="text-[11px] text-truffle block uppercase font-bold tracking-wider">
                Order Reference
              </span>
              <span className="font-mono text-sm font-bold text-cocoa-dark">
                #{orderId}
              </span>
            </div>

            {total > 0 && (
              <div className="text-right">
                <span className="text-[11px] text-truffle block uppercase font-bold tracking-wider">
                  Total Amount
                </span>
                <span className="font-serif text-lg font-bold text-cocoa-dark">
                  {formatINR(total)}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-cocoa">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-truffle-dark shrink-0 mt-0.5" />
              <div>
                <strong className="block text-cocoa-dark">Preparation</strong>
                <span>Handcrafted in 24 hrs</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-truffle-dark shrink-0 mt-0.5" />
              <div>
                <strong className="block text-cocoa-dark">Delivery Origin</strong>
                <span>Bangalore Kitchen</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-truffle-dark shrink-0 mt-0.5" />
              <div>
                <strong className="block text-cocoa-dark">Quality</strong>
                <span>100% Preservative Free</span>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Instant Confirmation CTA */}
        <div className="space-y-3 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm shadow-soft hover:shadow-soft-lg transition-all duration-200"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Connect on WhatsApp for Live Updates</span>
          </a>

          <p className="text-xs text-truffle">
            Our mompreneur will message you with dispatch details and tracking.
          </p>
        </div>

        {/* Navigation CTAs */}
        <div className="pt-6 border-t border-truffle/15 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/account/orders"
            className="px-6 py-2.5 rounded-full bg-cream-100 hover:bg-cream-200 text-cocoa-dark border border-truffle/20 text-xs font-semibold transition-colors"
          >
            Track in My Account
          </Link>

          <Link
            href="/products"
            className="px-6 py-2.5 rounded-full bg-cocoa-dark text-[#FDF0E6] hover:bg-cocoa text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>Order More Chocolates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-xs text-truffle">Loading order confirmation...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
