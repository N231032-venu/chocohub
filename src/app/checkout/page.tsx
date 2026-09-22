'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  QrCode,
  Truck,
  MessageCircle,
  ArrowLeft,
  Check,
  Sparkles,
  Lock
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { formatINR, BRAND_PHONE, BRAND_PHONE_CLEAN } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { PaymentMethod, OrderItem } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalAmount, clearCart } = useCartStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [pincode, setPincode] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const totalAmount = getTotalAmount();
  const shippingFee = totalAmount >= 799 ? 0 : 60;
  const finalTotal = totalAmount + shippingFee;

  useEffect(() => {
    // Check if user is logged in to pre-fill profile data
    const loadUser = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUserId(session.user.id);
          setEmail(session.user.email || '');
          if (session.user.user_metadata?.full_name) {
            setFullName(session.user.user_metadata.full_name);
          }
          if (session.user.user_metadata?.phone) {
            setPhone(session.user.user_metadata.phone);
          }
          if (session.user.user_metadata?.address) {
            setAddress(session.user.user_metadata.address);
          }

          // Also check profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            if (profile.full_name) setFullName(profile.full_name);
            if (profile.phone) setPhone(profile.phone);
            if (profile.address) setAddress(profile.address);
          }
        }
      } catch {
        // graceful offline
      }
    };

    loadUser();
  }, []);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center text-truffle">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-cocoa-dark">
          Your Cart is Empty
        </h1>
        <p className="text-xs text-cocoa-muted max-w-sm">
          Please add some fresh handcrafted chocolates to your box before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="px-6 py-3 rounded-full bg-cocoa-dark text-[#FDF0E6] text-xs font-semibold hover:bg-cocoa transition-colors"
        >
          Browse Artisan Menu
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !phone.trim() || !address.trim() || !pincode.trim()) {
      setErrorMsg('Please complete all required shipping details.');
      return;
    }

    setLoading(true);

    const orderItems: OrderItem[] = items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      weight: item.product.weight,
      quantity: item.quantity,
      image: item.product.images?.[0],
    }));

    try {
      const supabase = createClient();
      const newOrder = {
        user_id: userId,
        customer_name: fullName,
        phone,
        email: email || null,
        address,
        city: city || 'Bangalore',
        pincode,
        items: orderItems,
        total_amount: finalTotal,
        status: 'confirmed',
        payment_status: paymentMethod === 'cod' ? 'cod' : 'pending',
        payment_method: paymentMethod,
        notes: notes || null,
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(newOrder)
        .select()
        .single();

      const createdOrderId = data?.id || `HC-${Date.now()}`;

      // Clear local cart store
      clearCart();

      // Navigate to order success page
      router.push(`/order-success?orderId=${encodeURIComponent(createdOrderId)}&name=${encodeURIComponent(fullName)}&total=${finalTotal}&phone=${encodeURIComponent(phone)}&method=${paymentMethod}`);
    } catch (err) {
      // Fallback redirect with generated ID if Supabase offline
      const mockId = `HC-${Date.now()}`;
      clearCart();
      router.push(`/order-success?orderId=${mockId}&name=${encodeURIComponent(fullName)}&total=${finalTotal}&phone=${encodeURIComponent(phone)}&method=${paymentMethod}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cocoa hover:text-cocoa-dark transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cocoa-dark">
          Secure Checkout
        </h1>
        <p className="text-xs text-truffle mt-1">
          Freshly prepared on order in Bangalore • Zero refined sugar
        </p>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Customer & Delivery Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact & Shipping */}
            <div className="bg-[#FDF0E6] rounded-32 p-6 sm:p-8 border border-truffle/15 shadow-soft space-y-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-truffle/15">
                <div className="w-8 h-8 rounded-full bg-cocoa-dark text-card flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h2 className="font-serif text-xl font-bold text-cocoa-dark">
                  Delivery Address in Bangalore / Pan-India
                </h2>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-100 border border-red-300 text-xs text-red-800 font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#FFFBF5] border border-truffle/25 text-sm text-cocoa-dark placeholder:text-truffle/60 focus:outline-none focus:ring-2 focus:ring-cocoa-dark/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9845368540"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#FFFBF5] border border-truffle/25 text-sm text-cocoa-dark placeholder:text-truffle/60 focus:outline-none focus:ring-2 focus:ring-cocoa-dark/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                    Email (for receipt)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. priya@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#FFFBF5] border border-truffle/25 text-sm text-cocoa-dark placeholder:text-truffle/60 focus:outline-none focus:ring-2 focus:ring-cocoa-dark/20"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                    Complete Street Address & Apartment *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="House/Flat No, Apartment Name, Street, Landmark"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFFBF5] border border-truffle/25 text-sm text-cocoa-dark placeholder:text-truffle/60 focus:outline-none focus:ring-2 focus:ring-cocoa-dark/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#FFFBF5] border border-truffle/25 text-sm text-cocoa-dark focus:outline-none focus:ring-2 focus:ring-cocoa-dark/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 560038"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#FFFBF5] border border-truffle/25 text-sm text-cocoa-dark placeholder:text-truffle/60 focus:outline-none focus:ring-2 focus:ring-cocoa-dark/20"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                    Special Gift Message / Delivery Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Please add a birthday note: 'Happy Birthday Rohit!'"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#FFFBF5] border border-truffle/25 text-sm text-cocoa-dark placeholder:text-truffle/60 focus:outline-none focus:ring-2 focus:ring-cocoa-dark/20"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="bg-[#FDF0E6] rounded-32 p-6 sm:p-8 border border-truffle/15 shadow-soft space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-truffle/15">
                <div className="w-8 h-8 rounded-full bg-cocoa-dark text-card flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h2 className="font-serif text-xl font-bold text-cocoa-dark">
                  Payment Method
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* UPI */}
                <label
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-24 border-2 cursor-pointer flex flex-col justify-between space-y-2 transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-cocoa-dark bg-[#FFFBF5] shadow-md'
                      : 'border-truffle/20 bg-cream-100/60 hover:bg-cream-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <QrCode className="w-5 h-5 text-cocoa-dark" />
                    {paymentMethod === 'upi' && <Check className="w-4 h-4 text-emerald-700" />}
                  </div>
                  <div>
                    <span className="font-serif text-sm font-bold text-cocoa-dark block">UPI / QR</span>
                    <span className="text-[11px] text-truffle font-medium">GPay, PhonePe, Paytm</span>
                  </div>
                </label>

                {/* Cash On Delivery */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-24 border-2 cursor-pointer flex flex-col justify-between space-y-2 transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-cocoa-dark bg-[#FFFBF5] shadow-md'
                      : 'border-truffle/20 bg-cream-100/60 hover:bg-cream-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Truck className="w-5 h-5 text-cocoa-dark" />
                    {paymentMethod === 'cod' && <Check className="w-4 h-4 text-emerald-700" />}
                  </div>
                  <div>
                    <span className="font-serif text-sm font-bold text-cocoa-dark block">Cash on Delivery</span>
                    <span className="text-[11px] text-truffle font-medium">Pay upon receipt</span>
                  </div>
                </label>

                {/* WhatsApp Order */}
                <label
                  onClick={() => setPaymentMethod('whatsapp')}
                  className={`p-4 rounded-24 border-2 cursor-pointer flex flex-col justify-between space-y-2 transition-all ${
                    paymentMethod === 'whatsapp'
                      ? 'border-cocoa-dark bg-[#FFFBF5] shadow-md'
                      : 'border-truffle/20 bg-cream-100/60 hover:bg-cream-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <MessageCircle className="w-5 h-5 text-emerald-700" />
                    {paymentMethod === 'whatsapp' && <Check className="w-4 h-4 text-emerald-700" />}
                  </div>
                  <div>
                    <span className="font-serif text-sm font-bold text-cocoa-dark block">WhatsApp Confirm</span>
                    <span className="text-[11px] text-truffle font-medium">Coordinate via chat</span>
                  </div>
                </label>
              </div>

              {/* Payment Explanatory Box */}
              {paymentMethod === 'upi' && (
                <div className="p-4 rounded-2xl bg-[#FFFBF5] border border-truffle/20 text-xs text-cocoa space-y-2">
                  <p className="font-semibold text-cocoa-dark flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-gold" />
                    UPI Payment Instructions:
                  </p>
                  <p className="text-cocoa-muted leading-relaxed">
                    You can pay to UPI VPA: <strong className="text-cocoa-dark">9845368540@okbizaxis</strong> or scan the QR on the next screen. Your fresh batch will begin preparation immediately!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Summary Card */}
          <div className="lg:col-span-5 bg-[#FDF0E6] rounded-32 p-6 sm:p-8 border border-truffle/15 shadow-soft space-y-6 sticky top-24">
            <h2 className="font-serif text-xl font-bold text-cocoa-dark pb-3 border-b border-truffle/15">
              Order Summary ({items.reduce((acc, it) => acc + it.quantity, 0)} items)
            </h2>

            {/* Items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-card shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-cocoa-dark truncate">{item.product.name}</h4>
                    <p className="text-[10px] text-truffle">{item.product.weight} • Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-cocoa-dark">
                    {formatINR(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-truffle/15 space-y-2 text-xs text-cocoa">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold">{formatINR(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Bangalore Delivery</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-800">FREE</strong>
                  ) : (
                    formatINR(shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-cocoa-dark pt-2 border-t border-truffle/10">
                <span>Total Payable</span>
                <span className="font-serif text-xl">{formatINR(finalTotal)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-full bg-cocoa-dark text-[#FDF0E6] hover:bg-cocoa font-semibold text-sm shadow-soft hover:shadow-soft-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 group"
            >
              {loading ? (
                <span>Placing Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-gold" />
                  <span>Confirm & Place Order ({formatINR(finalTotal)})</span>
                </>
              )}
            </button>

            <div className="text-center space-y-1 pt-1">
              <p className="text-[11px] text-truffle flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                Handcrafted Fresh On Order in Bangalore
              </p>
              <p className="text-[10px] text-truffle/80">
                Order confirmation will also be sent to WhatsApp {phone ? `(${phone})` : ''}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
